import { NextResponse } from "next/server";
import { verifyAdminAction } from "@/features/auth/dal";
import {
  detectValidatedImageFormat,
  isAllowedMediaBucket,
  MAX_MEDIA_FILE_SIZE_BYTES,
  sanitizeBaseFilename,
} from "@/lib/utils/media-validation";

export async function POST(request: Request) {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart upload request." }, { status: 400 });
  }

  const file = formData.get("file");
  const rawBucket = formData.get("bucket")?.toString() ?? "";
  const altText = formData.get("alt_text")?.toString().trim() || null;

  if (!isAllowedMediaBucket(rawBucket)) {
    return NextResponse.json(
      { error: "Invalid storage bucket target." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File size must be between 1 byte and 5 MiB." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detected = detectValidatedImageFormat(bytes, rawBucket);

  if (!detected) {
    return NextResponse.json(
      {
        error:
          rawBucket === "site-assets"
            ? "Unsupported or unsafe file format. Allowed: JPEG, PNG, WebP, AVIF, and safe SVG."
            : "Unsupported file format. Allowed: JPEG, PNG, WebP, and AVIF.",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const baseName = sanitizeBaseFilename(file.name);
  const storagePath = `${year}/${month}/${crypto.randomUUID()}-${baseName}.${detected.extension}`;

  const { error: uploadError } = await auth.supabase.storage
    .from(rawBucket)
    .upload(storagePath, bytes, {
      contentType: detected.mimeType,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = auth.supabase.storage.from(rawBucket).getPublicUrl(storagePath);

  const { data: mediaRecord, error: dbError } = await auth.supabase
    .from("media_assets")
    .insert({
      file_name: `${baseName}.${detected.extension}`,
      storage_bucket: rawBucket,
      storage_path: storagePath,
      mime_type: detected.mimeType,
      file_size: file.size,
      alt_text: altText,
      uploaded_by: auth.user.id,
    })
    .select("*")
    .single();

  if (dbError || !mediaRecord) {
    await auth.supabase.storage.from(rawBucket).remove([storagePath]);
    return NextResponse.json(
      { error: `Failed to record media metadata: ${dbError?.message ?? "Unknown error"}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    asset: mediaRecord,
    storagePath,
    publicUrl,
  });
}
