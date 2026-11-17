import Link from "next/link";
import Image from "next/image";
import type { FieldNote } from "@/lib/utils/field-notes";

interface FieldNoteGridProps {
  readonly notes: readonly FieldNote[];
  readonly startIndex?: number;
}

/**
 * The cited ledger: dense hairline columns with hanging ordinal numbers and a
 * kind gutter, so stories and case studies read as one chronological record.
 *
 * Each row carries its own cover photograph. On a fine pointer the photo
 * grows out of a hairline on hover, so the grid reads as a quiet index until
 * the reader points at a note.
 */
export function FieldNoteGrid({ notes, startIndex = 0 }: FieldNoteGridProps) {
  return (
    <ul className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note, index) => {
        const imageSrc = note.imageSrc || "/images/hero-planet.jpg";

        return (
          <li
            key={`${note.kind}-${note.slug}`}
            className="group/note border-b border-border px-0 py-7 sm:px-6 sm:[&:nth-child(odd)]:pl-0 sm:[&:nth-child(2n)]:border-l lg:px-7 lg:[&:nth-child(2n)]:border-l-0 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:nth-child(3n+2)]:border-l lg:[&:nth-child(3n)]:border-l"
          >
            <Link
              href={note.href}
              className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                <span className="tabular-nums">
                  {String(startIndex + index + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{note.location}</span>
              </div>

              {/* Hover-revealed cover plate. */}
              <div
                aria-hidden="true"
                className="relative mt-4 h-[3px] overflow-hidden rounded-sm bg-muted transition-[height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 hover-capable:group-hover/note:h-32 hover-capable:group-hover/note:opacity-100 hover-capable:group-focus-visible/note:h-32 hover-capable:group-focus-visible/note:opacity-100 motion-reduce:h-32 motion-reduce:opacity-100 motion-reduce:transition-none"
              >
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="scale-105 object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/note:scale-100 motion-reduce:transition-none"
                />
              </div>

              <h3 className="mt-4 font-heading text-lg leading-snug text-foreground transition-colors duration-200 group-hover/note:text-primary">
                {note.title}
              </h3>

              <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                <span className="uppercase">
                  {note.kind === "story" ? "Field note" : "Case study"}
                </span>
                {note.year ? (
                  <>
                    <span className="text-border">/</span>
                    <span className="tabular-nums">{note.year}</span>
                  </>
                ) : null}
              </p>

              <span
                aria-hidden="true"
                className="mt-5 block h-px w-0 bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/note:w-16 motion-reduce:transition-none"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}