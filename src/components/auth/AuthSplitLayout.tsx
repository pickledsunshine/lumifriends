import { BrandMark } from "@/components/brand/BrandMark";

/**
 * Abstract QR / connected-network geometry for the brand panel.
 * Deliberately not photography, crypto imagery or a phone mockup (spec §7.1).
 */
function QrGeometry() {
  const tiles = [
    "accent", "outline", "muted", "muted", "accent", "muted",
    "muted", "accent", "outline", "accent", "muted", "muted",
    "outline", "muted", "accent", "muted", "outline", "accent",
  ];

  return (
    <div
      aria-hidden
      className="rounded-card border border-white/15 bg-white/5 p-8 backdrop-blur-[1px]"
    >
      <div className="grid grid-cols-6 gap-3">
        {tiles.map((tone, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[10px] ${
              tone === "accent"
                ? "bg-accent"
                : tone === "outline"
                  ? "border-2 border-accent/60"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function AuthSplitLayout({
  heading,
  headingAccent,
  copy,
  children,
}: {
  heading: string;
  /** Trailing fragment of the heading, rendered in the brand yellow. */
  headingAccent?: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — full height on desktop, compact header on mobile web. */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-brand px-6 py-8 text-white sm:px-10 lg:w-[52%] lg:px-14 lg:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/4 size-96 rounded-full bg-brand-deep/60 blur-3xl"
        />

        <div className="relative">
          <BrandMark tone="onDark" />
        </div>

        <div className="relative my-10 hidden max-w-lg lg:block">
          <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            {heading}
            {headingAccent ? <span className="block text-accent">{headingAccent}</span> : null}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">{copy}</p>
          <div className="mt-10 max-w-md">
            <QrGeometry />
          </div>
        </div>

        {/* Mobile web gets the message without the tall hero. */}
        <div className="relative mt-6 lg:hidden">
          <h2 className="text-2xl font-bold text-white">
            {heading} {headingAccent ? <span className="text-accent">{headingAccent}</span> : null}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{copy}</p>
        </div>

        <p className="relative mt-10 hidden text-xs font-semibold uppercase tracking-widest text-white/40 lg:block">
          Lumifin global partner network
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-8 lg:py-14">
        <div className="w-full max-w-[440px]">{children}</div>
      </section>
    </div>
  );
}
