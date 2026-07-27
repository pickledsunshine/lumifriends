"use client";

import { useCallback, useSyncExternalStore } from "react";
import { partner } from "@/lib/mock-data";

/**
 * Prototype-only session. There is no backend: the provisioned referral code
 * plus any non-empty password is accepted, and the flag lives in web storage.
 *
 * Storage is an external store, so it is read through `useSyncExternalStore`
 * rather than an effect — that keeps server and hydrated markup consistent.
 */

const STORAGE_KEY = "lumifriends.session";

const listeners = new Set<() => void>();
let cachedSignedIn: boolean | null = null;

function readStoredSession(): boolean {
  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) === "active" ||
      window.sessionStorage.getItem(STORAGE_KEY) === "active"
    );
  } catch {
    // Storage can be unavailable in private browsing modes.
    return false;
  }
}

function getSnapshot(): boolean {
  if (cachedSignedIn === null) cachedSignedIn = readStoredSession();
  return cachedSignedIn;
}

/** The server has no storage, so it always renders the signed-out shell. */
function getServerSnapshot(): boolean {
  return false;
}

function emit(next: boolean) {
  cachedSignedIn = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Keep other tabs of the prototype in step.
  const handleStorage = () => emit(readStoredSession());
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

const alwaysTrue = () => true;
const alwaysFalse = () => false;

export type SessionState = {
  isSignedIn: boolean;
  /** `false` until hydration completes, so guards never redirect on first paint. */
  isReady: boolean;
  signIn: (options: { referralCode: string; remember: boolean }) => void;
  signOut: () => void;
};

export function useSession(): SessionState {
  const isSignedIn = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = useSyncExternalStore(subscribe, alwaysTrue, alwaysFalse);

  const signIn = useCallback(({ remember }: { referralCode: string; remember: boolean }) => {
    try {
      const store = remember ? window.localStorage : window.sessionStorage;
      store.setItem(STORAGE_KEY, "active");
    } catch {
      // Ignore — the in-memory snapshot below still drives the prototype.
    }
    emit(true);
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore — see above.
    }
    emit(false);
  }, []);

  return { isSignedIn, isReady, signIn, signOut };
}

/**
 * The prototype accepts the provisioned partner code in any casing, and any
 * password of at least one character. Everything else shows the inline error.
 */
export function isValidCredentials(referralCode: string, password: string): boolean {
  return referralCode.trim().toUpperCase() === partner.referralCode && password.length > 0;
}
