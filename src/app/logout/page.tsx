"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

/** Clears the prototype session and returns the partner to login — spec §2. */
export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useSession();

  useEffect(() => {
    signOut();
    router.replace("/login");
  }, [signOut, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page">
      <p className="text-sm text-muted">Signing you out…</p>
    </main>
  );
}
