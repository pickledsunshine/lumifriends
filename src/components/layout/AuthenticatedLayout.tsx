"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigationDrawer } from "@/components/layout/MobileNavigationDrawer";
import { TopHeader } from "@/components/layout/TopHeader";
import { primaryNav } from "@/components/layout/navigation";
import { useSession } from "@/lib/session";

/**
 * Shared shell for every authenticated route — spec §4.
 * Desktop keeps a persistent sidebar; below `lg` it becomes a drawer.
 */
export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, isReady } = useSession();

  useEffect(() => {
    if (isReady && !isSignedIn) router.replace("/login");
  }, [isReady, isSignedIn, router]);

  const title = primaryNav.find((item) => item.href === pathname)?.label ?? "Partner portal";

  if (!isReady || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-sm text-muted">Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <MobileNavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="lg:pl-65">
        <TopHeader title={title} onOpenNavigation={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
