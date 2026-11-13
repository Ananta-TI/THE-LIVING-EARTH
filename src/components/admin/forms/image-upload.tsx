"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MediaBucket =
  | "article-images"
  | "case-study-images"
  | "pillar-images"
  | "site-assets";

interface ImageUploadProps {
  readonly id: string;
  readonly bucket: MediaBucket;
  readonly value: string;
  readonly onChange: (nextPathOrUrl: string) => void;
  readonly disabled?: boolean;
}

export function ImageUpload({
  id,
  bucket,
  value,
  onChange,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("alt_text", file.name.replace(/\.[^.]+$/, ""));

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        error?: string;
        publicUrl?: string;
        storagePath?: string;
      };

      if (!response.ok || (!payload.publicUrl && !payload.storagePath)) {
        setError(payload.error ?? "Upload failed. Please verify the file format and size.");
        return;
      }

      onChange(payload.publicUrl ?? payload.storagePath ?? "");
    } catch {
      setError("Network error while uploading image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3.5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste storage path or uploaded image URL..."
          disabled={disabled || isUploading}
          className="h-10 flex-1"
        />

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="sr-only"
            aria-label="Upload cover image file"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 gap-1.5"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="size-4" aria-hidden="true" />
            )}
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled || isUploading}
              onClick={() => onChange("")}
              aria-label="Clear selected image"
              className="size-10 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}

      {value ? (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Selected cover preview"
              className="max-h-48 w-full object-cover"
            />
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <ImageIcon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate font-mono">{value}</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
