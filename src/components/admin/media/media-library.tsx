"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Edit3, Images, Loader2, Trash2, Upload } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { TableEmptyState } from "@/components/admin/tables/table-empty-state";
import { TableToolbar } from "@/components/admin/tables/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteMediaAssetAction, updateMediaAltTextAction } from "@/features/media/actions";
import type { MediaAssetWithUrl } from "@/features/media/queries";
import { formatDateTime, formatFileSize } from "@/lib/utils/format";
import { ALLOWED_MEDIA_BUCKETS, type MediaBucketName } from "@/lib/utils/media-validation";

interface MediaLibraryProps {
  readonly assets: readonly MediaAssetWithUrl[];
}

export function MediaLibrary({ assets }: MediaLibraryProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [bucketFilter, setBucketFilter] = useState("all");
  const [uploadBucket, setUploadBucket] = useState<MediaBucketName>("article-images");
  const [uploadAlt, setUploadAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState<MediaAssetWithUrl | null>(null);
  const [altInput, setAltInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((asset) => {
      if (bucketFilter !== "all" && asset.storage_bucket !== bucketFilter) return false;
      if (!q) return true;
      return (
        asset.file_name.toLowerCase().includes(q) ||
        (asset.alt_text?.toLowerCase().includes(q) ?? false) ||
        asset.storage_path.toLowerCase().includes(q)
      );
    });
  }, [assets, search, bucketFilter]);

  async function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setFeedback({ type: "error", text: "Select an image file before uploading." });
      return;
    }

    setFeedback(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", uploadBucket);
      formData.append("alt_text", uploadAlt.trim());

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback({ type: "error", text: payload.error ?? "Upload failed." });
        return;
      }

      setUploadAlt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFeedback({ type: "ok", text: "Image uploaded and registered in Media Library." });
      router.refresh();
    } catch {
      setFeedback({ type: "error", text: "Network error during upload." });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleCopyUrl(asset: MediaAssetWithUrl) {
    try {
      await navigator.clipboard.writeText(asset.publicUrl);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setFeedback({ type: "error", text: "Unable to copy URL to clipboard." });
    }
  }

  function handleSaveAlt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingAlt) return;

    startTransition(async () => {
      const result = await updateMediaAltTextAction({
        id: editingAlt.id,
        alt_text: altInput,
      });

      if (!result.ok) {
        setFeedback({ type: "error", text: result.error ?? "Update failed." });
        return;
      }

      setEditingAlt(null);
      setFeedback({ type: "ok", text: result.message ?? "Alt text updated." });
    });
  }

  async function handleDelete(id: string) {
    setFeedback(null);
    const result = await deleteMediaAssetAction(id);
    setFeedback({
      type: result.ok ? "ok" : "error",
      text: result.ok ? (result.message ?? "Deleted.") : (result.error ?? "Delete failed."),
    });
  }

  const hasFilters = Boolean(search.trim() || bucketFilter !== "all");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Upload Editorial Asset</CardTitle>
          <CardDescription>
            Files are validated server-side for magic bytes and size (max 5 MiB: JPEG, PNG, WebP,
            AVIF; safe SVG allowed in site-assets).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadSubmit} className="grid gap-4 md:grid-cols-4 md:items-end">
            <FormField id="media-bucket" label="Target Bucket" required>
              <Select
                value={uploadBucket}
                onValueChange={(next) => setUploadBucket(next as MediaBucketName)}
              >
                <SelectTrigger id="media-bucket" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALLOWED_MEDIA_BUCKETS.map((bucket) => (
                    <SelectItem key={bucket} value={bucket}>
                      {bucket}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="media-file" label="Image File" required>
              <Input
                ref={fileInputRef}
                id="media-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                disabled={isUploading}
                className="h-10 cursor-pointer pt-1.5"
              />
            </FormField>

            <FormField id="media-alt" label="Descriptive Alt Text">
              <Input
                id="media-alt"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="Accessible description of the image"
                disabled={isUploading}
              />
            </FormField>

            <Button type="submit" disabled={isUploading} className="h-10 gap-2">
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="size-4" aria-hidden="true" />
              )}
              <span>{isUploading ? "Uploading..." : "Upload Asset"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {feedback ? (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={
            feedback.type === "error"
              ? "rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
              : "rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary"
          }
        >
          {feedback.text}
        </div>
      ) : null}

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search filename, alt text, or path..."
        searchLabel="Search media assets"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setBucketFilter("all");
        }}
        filters={
          <Select value={bucketFilter} onValueChange={setBucketFilter}>
            <SelectTrigger aria-label="Filter by storage bucket" className="h-10 w-48">
              <SelectValue placeholder="All buckets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buckets</SelectItem>
              {ALLOWED_MEDIA_BUCKETS.map((bucket) => (
                <SelectItem key={bucket} value={bucket}>
                  {bucket}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {filtered.length === 0 ? (
        <TableEmptyState
          icon={Images}
          title={assets.length === 0 ? "Media library is empty" : "No matching assets"}
          description={
            assets.length === 0
              ? "Upload photography, field documentation, or brand visuals using the uploader above."
              : "Try another bucket or search query."
          }
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
                  setBucketFilter("all");
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <Card key={asset.id} className="flex flex-col overflow-hidden border-border bg-card">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.publicUrl}
                  alt={asset.alt_text ?? asset.file_name}
                  className="size-full object-cover"
                />
              </div>
              <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {asset.storage_bucket}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatFileSize(asset.file_size)}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium text-foreground" title={asset.file_name}>
                    {asset.file_name}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {asset.alt_text ? `Alt: ${asset.alt_text}` : "No alt text assigned"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Uploaded {formatDateTime(asset.created_at)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(asset)}
                    className="gap-1.5"
                  >
                    {copiedId === asset.id ? (
                      <Check className="size-3.5 text-primary" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3.5" aria-hidden="true" />
                    )}
                    <span>{copiedId === asset.id ? "Copied" : "Copy URL"}</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit alt text for ${asset.file_name}`}
                      onClick={() => {
                        setEditingAlt(asset);
                        setAltInput(asset.alt_text ?? "");
                      }}
                      className="size-9"
                    >
                      <Edit3 className="size-4" aria-hidden="true" />
                    </Button>
                    <ConfirmDialog
                      title={`Delete "${asset.file_name}"?`}
                      description="This permanently removes the file from Supabase Storage and Media Library if it is not referenced by existing content."
                      confirmLabel="Delete Asset"
                      onConfirm={() => handleDelete(asset.id)}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${asset.file_name}`}
                        className="size-9 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(editingAlt)} onOpenChange={(open) => !open && setEditingAlt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Edit Alt Text</DialogTitle>
            <DialogDescription>{editingAlt?.file_name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAlt} className="space-y-4">
            <FormField
              id="edit-alt-input"
              label="Accessible Alternative Text"
              description="Describes the visual content for screen readers."
            >
              <Input
                id="edit-alt-input"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                maxLength={300}
              />
            </FormField>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAlt(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Alt Text"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
