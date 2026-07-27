/**
 * Lumifriends by Lumifin wordmark.
 * The glyph is abstract QR geometry — no photography or crypto imagery (spec §3).
 */

type BrandMarkProps = {
  /** `onLight` for white surfaces, `onDark` for the purple brand panel. */
  tone?: "onLight" | "onDark";
  showByline?: boolean;
  className?: string;
};

export function BrandGlyph({ className = "size-10" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-[10px] bg-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[62%]" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="#211a35" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="#211a35" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="#211a35" strokeWidth="2" />
        <path d="M14 14h3v3h-3z" fill="#211a35" />
        <path d="M19.5 17.5v3.5M14 21h3.5" stroke="#211a35" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function BrandMark({ tone = "onLight", showByline = true, className = "" }: BrandMarkProps) {
  const nameColor = tone === "onDark" ? "text-white" : "text-brand";
  const bylineColor = tone === "onDark" ? "text-white/70" : "text-muted";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandGlyph />
      <span className="leading-tight">
        <span className={`block text-xl font-bold ${nameColor}`}>Lumifriends</span>
        {showByline ? (
          <span className={`block text-xs font-semibold ${bylineColor}`}>by Lumifin</span>
        ) : null}
      </span>
    </span>
  );
}
