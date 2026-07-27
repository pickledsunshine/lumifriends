"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "@/components/layout/Sidebar";

/**
 * Mobile-web navigation drawer. The spec explicitly rules out a native-app
 * bottom navigation bar (§4, §9).
 */
export function MobileNavigationDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 size-full bg-heading/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-line bg-surface"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="absolute right-3 top-6 inline-flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-page hover:text-heading"
        >
          <X aria-hidden className="size-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
