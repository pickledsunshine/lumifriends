"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, CircleCheck, ShieldCheck, Ticket } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { Checkbox, TextField } from "@/components/ui/Fields";
import { Modal } from "@/components/ui/Modal";
import { useSession } from "@/lib/session";
import { partner } from "@/lib/mock-data";

const MIN_PASSWORD_LENGTH = 8;

export default function ClaimAccountPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ code?: string; password?: string; confirm?: string }>({});
  const [successOpen, setSuccessOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (referralCode.trim().toUpperCase() !== partner.referralCode) {
      nextErrors.code = "We don't recognise this referral code. Check the code Lumifin provided.";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== password) {
      nextErrors.confirm = "Both passwords need to match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signIn({ referralCode, remember });
    setSuccessOpen(true);
  }

  return (
    <AuthSplitLayout
      heading="Turn every referral into visible"
      headingAccent="progress."
      copy="Claim your partner account to track activations and payouts in real time."
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to login
      </Link>

      <span className="mt-6 inline-flex rounded-full bg-surface-purple px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand">
        First-time setup
      </span>

      <h1 className="mt-4 text-3xl font-bold">Claim your partner account</h1>
      <p className="mt-2 text-body">
        Use the referral code provided by Lumifin and create a password for future access.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <TextField
          label="Referral code"
          value={referralCode}
          placeholder={`e.g. ${partner.referralCode}`}
          autoComplete="username"
          autoCapitalize="characters"
          icon={<Ticket className="size-4" />}
          error={errors.code}
          onChange={(event) => setReferralCode(event.target.value)}
        />

        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          helper={`Use at least ${MIN_PASSWORD_LENGTH} characters`}
          error={errors.password}
        />

        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          error={errors.confirm}
        />

        <Checkbox
          label="Keep me logged in on this device"
          checked={remember}
          onChange={setRemember}
        />

        {errors.code || errors.password || errors.confirm ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-control border border-danger/20 bg-danger-soft p-4"
          >
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
            <p className="text-sm font-semibold leading-relaxed text-danger">
              Check the highlighted fields and try again.
            </p>
          </div>
        ) : null}

        <Button type="submit" className="w-full py-3.5 text-base">
          Create my account
        </Button>

        <p className="text-center text-sm text-muted">
          Already claimed your account?{" "}
          <Link href="/login" className="font-bold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </form>

      <div className="mt-7 flex items-start gap-3 rounded-card border border-[#f3e3ac] bg-surface-yellow p-4">
        <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-strong" />
        <p className="text-sm font-medium leading-relaxed text-heading">
          Your referral code is unique to your partnership. Valid activations made through this code
          will automatically appear in your portal.
        </p>
      </div>

      <Modal
        open={successOpen}
        onClose={() => router.push("/dashboard")}
        title="Your account is ready"
        description="You can now track your Lumifriends performance and upcoming payouts."
        footer={
          <Button onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
            <CircleCheck aria-hidden className="size-8" />
          </span>
          <p className="text-sm text-body">
            Referral code <strong className="text-heading">{partner.referralCode}</strong> is now
            linked to your partner account.
          </p>
        </div>
      </Modal>
    </AuthSplitLayout>
  );
}
