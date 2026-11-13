import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarkdownArticleProps {
  readonly content: string;
  readonly className?: string;
}

function isSafeHref(rawHref: string): boolean {
  const trimmed = rawHref.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const raw = match[0];
    const key = `${keyPrefix}-${index}`;
    index += 1;

    if (raw.startsWith("**") && raw.endsWith("**")) {
      tokens.push(
        <strong key={key} className="font-medium text-foreground">
          {renderInline(raw.slice(2, -2), `${key}-b`)}
        </strong>,
      );
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      tokens.push(
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (raw.startsWith("*") && raw.endsWith("*")) {
      tokens.push(
        <em key={key} className="italic">
          {renderInline(raw.slice(1, -1), `${key}-i`)}
        </em>,
      );
    } else if (raw.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
      if (linkMatch) {
        const label = linkMatch[1];
        const href = linkMatch[2];
        if (isSafeHref(href)) {
          tokens.push(
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary"
            >
              {label}
            </a>,
          );
        } else {
          tokens.push(label);
        }
      } else {
        tokens.push(raw);
      }
    } else {
      tokens.push(raw);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

/**
 * Pure-React editorial Markdown renderer for long-form environmental stories
 * and case studies. Neutralizes raw HTML and unsafe link schemes.
 */
export function MarkdownArticle({ content, className }: MarkdownArticleProps) {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return null;
  }

  const lines = normalized.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={`code-${i}`}
          className="overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-sm leading-relaxed text-foreground"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${i}`} className="my-8 border-border" />);
      i += 1;
      continue;
    }

    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const key = `h-${i}`;
      if (level <= 2) {
        blocks.push(
          <h2
            key={key}
            className="pt-4 font-heading text-2xl leading-snug font-medium text-foreground sm:text-3xl"
          >
            {renderInline(text, key)}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={key}
            className="pt-2 font-heading text-xl leading-snug font-medium text-foreground sm:text-2xl"
          >
            {renderInline(text, key)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={key} className="pt-1 font-heading text-lg font-medium text-foreground">
            {renderInline(text, key)}
          </h4>,
        );
      }
      i += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("> ")) {
        quoteLines.push((lines[i] ?? "").trim().slice(2));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 rounded-r-xl border-l-4 border-primary bg-secondary/45 px-5 py-4 font-heading text-lg leading-relaxed text-foreground italic"
        >
          {quoteLines.map((qLine, qIdx) => (
            <p key={qIdx}>{renderInline(qLine, `q-${i}-${qIdx}`)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul
          key={`ul-${i}`}
          className="list-disc space-y-2 pl-6 text-base leading-[1.75] text-foreground/90 sm:text-lg"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul-${i}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className="list-decimal space-y-2 pl-6 text-base leading-[1.75] text-foreground/90 sm:text-lg"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol-${i}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length) {
      const current = (lines[i] ?? "").trim();
      if (
        !current ||
        current.startsWith("#") ||
        current.startsWith("> ") ||
        current.startsWith("```") ||
        /^[-*]\s+/.test(current) ||
        /^\d+\.\s+/.test(current) ||
        /^---+$/.test(current)
      ) {
        break;
      }
      paraLines.push(current);
      i += 1;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-base leading-[1.75] text-foreground/90 sm:text-[1.0625rem]">
        {renderInline(paraLines.join(" "), `p-${i}`)}
      </p>,
    );
  }

  return <div className={cn("max-w-[68ch] space-y-5", className)}>{blocks}</div>;
}
