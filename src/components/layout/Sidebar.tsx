"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { primaryNav, secondaryNav, type NavItem } from "@/components/layout/navigation";
import { partner } from "@/lib/mock-data";

function isActive(pathname: string, href: string): boolean {
  return pathname === href.split("#")[0];
}

export function SidebarNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-control px-3.5 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-brand text-white" : "text-body hover:bg-surface-purple hover:text-brand"
      }`}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-3.5 py-6">
        <Link href="/dashboard" onClick={onNavigate} className="inline-flex">
          <BrandMark />
          <span className="sr-only">Go to dashboard</span>
        </Link>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3.5">
        {primaryNav.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}

        <hr className="my-3 border-line" />

        {secondaryNav.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto border-t border-line p-3.5">
        <div className="mb-2 flex items-center gap-3 rounded-control bg-page px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {partner.initials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-heading">
              {partner.displayName}
            </span>
            <span className="block truncate text-xs text-muted">{partner.partnerLabel}</span>
          </span>
        </div>

        <Link
          href="/logout"
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 rounded-control border border-line px-3.5 py-2.5 text-sm font-semibold text-body transition-colors hover:bg-page hover:text-heading"
        >
          <LogOut aria-hidden className="size-5 shrink-0" />
          Log out
        </Link>
      </div>
    </>
  );
}

/** Persistent sidebar on desktop; hidden below `lg` where the drawer takes over. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-65 flex-col border-r border-line bg-surface lg:flex">
      <SidebarContent />
    </aside>
  );
}
