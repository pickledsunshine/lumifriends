"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleAlert, Hash } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { Checkbox, TextField } from "@/components/ui/Fields";
import { useToast } from "@/components/ui/Toast";
import { isValidCredentials, useSession } from "@/lib/session";
import { partner } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const { showToast } = useToast();

  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidCredentials(referralCode, password)) {
      setError(
        "Your referral code or password doesn't match our records. Check your details or contact your Lumifin representative.",
      );
      return;
    }

    setError(null);
    signIn({ referralCode, remember });
    router.push("/dashboard");
  }

  return (
    <AuthSplitLayout
      heading="Your partnership,"
      headingAccent="at a glance."
      copy="Track referrals, earnings and upcoming payouts from one simple portal."
    >
      <span className="inline-flex rounded-full bg-surface-purple px-3 py-1.5 text-xs font-bold text-brand">
        Lumifriends Partner Portal
      </span>

      <h1 className="mt-5 text-4xl font-bold">Welcome back</h1>
      <p className="mt-2 text-body">Log in to view your activations, earnings and payouts.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <TextField
          label="Referral code"
          value={referralCode}
          placeholder={`e.g. ${partner.referralCode}`}
          autoComplete="username"
          autoCapitalize="characters"
          icon={<Hash className="size-4" />}
          onChange={(event) => setReferralCode(event.target.value)}
        />

        <PasswordField label="Password" value={password} onChange={setPassword} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Checkbox
            label="Keep me logged in on this device"
            checked={remember}
            onChange={setRemember}
          />
          <button
            type="button"
            onClick={() =>
              showToast(
                "Password resets are handled by your Lumifin representative in this prototype.",
                "info",
              )
            }
            className="text-sm font-bold text-brand hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-control border border-danger/20 bg-danger-soft p-4"
          >
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
            <p className="text-sm font-semibold leading-relaxed text-danger">{error}</p>
          </div>
        ) : null}

        <Button type="submit" className="w-full py-3.5 text-base">
          Log in
        </Button>

        <Link
          href="/claim-account"
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-brand hover:underline"
        >
          First time here? Claim your account
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </form>

      <div className="mt-8 border-t border-line pt-6 text-center">
        <p className="text-sm text-muted">Need help accessing your account?</p>
        <button
          type="button"
          onClick={() =>
            showToast("Your Lumifin representative can be reached at partners@lumifin.io.", "info")
          }
          className="text-sm font-bold text-brand hover:underline"
        >
          Contact your Lumifin representative.
        </button>
      </div>

      {/* Prototype affordance: the mock accepts the provisioned partner code. */}
      <p className="mt-6 rounded-control bg-page p-3 text-center text-xs text-muted">
        Prototype: log in with code <strong className="text-heading">{partner.referralCode}</strong>{" "}
        and any password.
      </p>
    </AuthSplitLayout>
  );
}
