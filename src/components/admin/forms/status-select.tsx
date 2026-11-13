"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type EditorialStatus = "draft" | "published" | "archived";

interface StatusSelectProps {
  readonly id?: string;
  readonly value: EditorialStatus;
  readonly onValueChange: (value: EditorialStatus) => void;
  readonly disabled?: boolean;
}

export function StatusSelect({
  id,
  value,
  onValueChange,
  disabled = false,
}: StatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as EditorialStatus)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className="h-10 w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}
