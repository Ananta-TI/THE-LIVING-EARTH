import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config/site";

interface BrandLogoProps {
  readonly tone?: "light" | "dark";
  readonly subtitle?: string;
  readonly compact?: boolean;
  readonly className?: string;
}

export function BrandLogo({
  tone = "light",
  subtitle = SITE_CONFIG.tagline,
  compact = false,
  className,
}: BrandLogoProps) {
  const isDarkSurface = tone === "dark";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full shadow-xs",
          compact ? "size-9" : "size-10",
          isDarkSurface
            ? "bg-earth-forest text-earth-ivory ring-1 ring-earth-sage/35"
            : "bg-earth-forest text-earth-ivory",
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          className={compact ? "size-5" : "size-5.5"}
        >
          <path
            d="M15.5 26C15.5 18.5 18 12.2 25.5 7.5C24.5 15.8 20.5 20.5 15.5 21.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 26V14.5C15.5 11.2 12 8.2 7 7.5C7.6 13.5 10.6 17.5 15.5 18.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 21.5L20.5 14"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-semibold tracking-[0.04em] uppercase",
            compact ? "text-sm sm:text-base" : "text-base sm:text-lg",
            isDarkSurface ? "text-earth-ivory" : "text-earth-deep-forest",
          )}
        >
          {SITE_CONFIG.name}
        </span>
        {subtitle ? (
          <span
            className={cn(
              "mt-0.5 text-[11px] font-normal tracking-normal",
              isDarkSurface ? "text-earth-sage" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
