"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { partner } from "@/lib/mock-data";

export function TopHeader({
  title,
  onOpenNavigation,
}: {
  title: string;
  onOpenNavigation: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenNavigation}
        aria-label="Open navigation"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-control text-body transition-colors hover:bg-page lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <p className="min-w-0 flex-1 truncate text-base font-bold text-heading">{title}</p>

      <div ref={notificationsRef} className="relative">
        <button
          type="button"
          onClick={() => setNotificationsOpen((open) => !open)}
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          className="relative inline-flex size-10 items-center justify-center rounded-control text-body transition-colors hover:bg-page"
        >
          <Bell aria-hidden className="size-5" />
          <span
            aria-hidden
            className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-surface bg-danger"
          />
        </button>

        {notificationsOpen ? (
          <div className="absolute right-0 top-full mt-2 w-72 rounded-card border border-line bg-surface p-2 shadow-raised">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">
              Notifications
            </p>
            <div className="rounded-control px-3 py-2.5">
              <p className="text-sm font-semibold text-heading">3 new activations today</p>
              <p className="mt-0.5 text-xs text-muted">
                Your current cycle now has 34 activations.
              </p>
            </div>
            <div className="rounded-control px-3 py-2.5">
              <p className="text-sm font-semibold text-heading">Payout scheduled</p>
              <p className="mt-0.5 text-xs text-muted">
                Your 1–14 July cycle was paid on 16 July 2026.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div ref={profileRef} className="relative">
        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className="flex min-h-10 items-center gap-2 rounded-control py-1 pl-1 pr-2 transition-colors hover:bg-page"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {partner.initials}
          </span>
          <span className="hidden text-sm font-bold text-heading sm:block">
            {partner.displayName}
          </span>
          <ChevronDown aria-hidden className="size-4 text-muted" />
          <span className="sr-only">Open profile menu</span>
        </button>

        {profileOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-56 rounded-card border border-line bg-surface p-2 shadow-raised"
          >
            <div className="border-b border-line px-3 pb-2.5 pt-1.5">
              <p className="text-sm font-bold text-heading">{partner.displayName}</p>
              <p className="text-xs text-muted">{partner.partnerLabel}</p>
            </div>
            <Link
              role="menuitem"
              href="/account"
              onClick={() => setProfileOpen(false)}
              className="mt-1 flex min-h-10 items-center gap-2.5 rounded-control px-3 text-sm font-semibold text-body transition-colors hover:bg-page hover:text-heading"
            >
              <UserRound aria-hidden className="size-4" />
              Account
            </Link>
            <Link
              role="menuitem"
              href="/logout"
              onClick={() => setProfileOpen(false)}
              className="flex min-h-10 items-center gap-2.5 rounded-control px-3 text-sm font-semibold text-body transition-colors hover:bg-page hover:text-heading"
            >
              <LogOut aria-hidden className="size-4" />
              Log out
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
