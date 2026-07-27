"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { BrandMark } from "@/components/brand/BrandMark";

/** Entry route: send partners to the portal if signed in, otherwise to login. */
export default function RootPage() {
  const router = useRouter();
  const { isSignedIn, isReady } = useSession();

  useEffect(() => {
    if (!isReady) return;
    router.replace(isSignedIn ? "/dashboard" : "/login");
  }, [isReady, isSignedIn, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="flex flex-col items-center gap-4">
        <BrandMark />
        <p className="text-sm text-muted">Loading your partner portal…</p>
      </div>
    </main>
  );
}
