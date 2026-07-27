"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";

/**
 * Opens on hover and on focus, so the content is reachable by keyboard as well
 * as pointer — spec §11.
 */
export function InfoTooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-6 items-center justify-center rounded-full text-muted transition-colors hover:text-brand"
      >
        <Info aria-hidden className="size-5" />
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-control border border-line bg-surface p-3 text-xs font-medium leading-relaxed text-body shadow-raised"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
