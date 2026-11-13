"use client";

import { useRef } from "react";
import { Bold, Code, Heading2, Italic, Link2, List, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownPreview } from "@/components/admin/editor/markdown-preview";

interface MarkdownEditorProps {
  readonly id: string;
  readonly value: string;
  readonly onChange: (nextValue: string) => void;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly disabled?: boolean;
}

export function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder = "Write editorial Markdown content...",
  rows = 14,
  disabled = false,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function wrapSelection(before: string, after: string, fallbackText: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || fallbackText;
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  function prefixLine(prefix: string, fallbackText: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || fallbackText;
    const needsLeadingNewline = start > 0 && value[start - 1] !== "\n";
    const insertion = `${needsLeadingNewline ? "\n" : ""}${prefix}${selected}`;
    const nextValue = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
    onChange(nextValue);
  }

  return (
    <Tabs defaultValue="write" className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border border-b-0 border-border bg-muted/40 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Markdown formatting">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Insert section heading"
            onClick={() => prefixLine("## ", "Section Heading")}
          >
            <Heading2 className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Bold text"
            onClick={() => wrapSelection("**", "**", "bold text")}
          >
            <Bold className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Italic text"
            onClick={() => wrapSelection("*", "*", "italic text")}
          >
            <Italic className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Bullet list"
            onClick={() => prefixLine("- ", "List item")}
          >
            <List className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Blockquote"
            onClick={() => prefixLine("> ", "Quoted ecological observation")}
          >
            <Quote className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Inline code"
            onClick={() => wrapSelection("`", "`", "code")}
          >
            <Code className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={disabled}
            aria-label="Insert hyperlink"
            onClick={() => wrapSelection("[", "](https://example.org)", "source title")}
          >
            <Link2 className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <TabsList className="h-8">
          <TabsTrigger value="write" className="text-xs">
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs">
            Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="write" className="mt-0">
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="rounded-t-none font-mono text-sm leading-relaxed"
        />
      </TabsContent>

      <TabsContent
        value="preview"
        className="mt-0 min-h-64 rounded-b-xl border border-border bg-card p-5"
      >
        <MarkdownPreview content={value} />
      </TabsContent>
    </Tabs>
  );
}
