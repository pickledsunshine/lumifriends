"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Copy,
  Handshake,
  Info,
  KeyRound,
  LogOut,
  Mail,
  MonitorSmartphone,
  Shield,
  ShieldCheck,
  CircleQuestionMark,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { Modal } from "@/components/ui/Modal";
import { PasswordField } from "@/components/auth/PasswordField";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/download";
import { partner, supportLinks } from "@/lib/mock-data";
import { formatLongDate, formatVnd } from "@/lib/format";

const MIN_PASSWORD_LENGTH = 8;

const supportIcons: Record<string, React.ReactNode> = {
  contact: <Mail aria-hidden className="size-5" />,
  guide: <BookOpen aria-hidden className="size-5" />,
  privacy: <Shield aria-hidden className="size-5" />,
  faq: <CircleQuestionMark aria-hidden className="size-5" />,
};

export default function AccountPage() {
  const { showToast } = useToast();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  /** Read-only partnership terms — partners cannot edit any of these (spec §7.7). */
  const partnershipDetails = [
    { label: "Partner type", value: partner.partnerType === "venue" ? "Venue" : "Influencer" },
    { label: "Venue type", value: "Hostel" },
    { label: "Reference target", value: `${partner.referenceTarget} activations` },
    { label: "Target period", value: `${partner.targetPeriodDays} days` },
    { label: "Reward per valid activation", value: formatVnd(partner.rewardPerActivationVnd) },
    { label: "Payout schedule", value: partner.payoutSchedule },
    { label: "Partnership status", value: "Active" },
  ];

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  }

  function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (currentPassword.length === 0) nextErrors.current = "Enter your current password.";
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.next = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== newPassword) nextErrors.confirm = "Both passwords need to match.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPasswordModalOpen(false);
    resetPasswordForm();
    showToast("Your password has been updated.");
  }

  async function copyReferralCode() {
    const copied = await copyToClipboard(partner.referralCode);
    showToast(copied ? "Referral code copied" : "Copy is unavailable in this browser", copied ? "success" : "info");
  }

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Account" }]}
        title="Account"
        description="View your partnership details and manage account access."
      />

      {/* Partner profile */}
      <Card className="flex flex-wrap items-center justify-between gap-6 p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
            {partner.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold">{partner.displayName}</h2>
              <StatusChip status="active_partner" />
            </div>
            <p className="mt-0.5 text-sm text-muted">{partner.partnerLabel}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Referral code</p>
          <div className="mt-1.5 flex items-center gap-2 rounded-control bg-surface-yellow px-3.5 py-2">
            <span className="text-lg font-bold tracking-[0.1em] text-heading">
              {partner.referralCode}
            </span>
            <button
              type="button"
              onClick={copyReferralCode}
              aria-label="Copy referral code"
              className="inline-flex size-8 items-center justify-center rounded-lg text-accent-strong transition-colors hover:bg-white/60"
            >
              <Copy aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Partnership details */}
        <Card>
          <CardHeader title="Partnership details" icon={<Handshake aria-hidden className="size-5" />} />
          <div className="p-6">
            <dl className="flex flex-col divide-y divide-line">
              {partnershipDetails.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-body">{detail.label}</dt>
                  <dd className="text-right text-sm font-bold text-heading">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-start gap-3 rounded-control bg-surface-yellow p-4">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-strong" />
              <p className="text-sm font-medium leading-relaxed text-heading">
                Reference targets are informational. Valid activations continue to be recorded after
                the target is reached.
              </p>
            </div>

            <p className="mt-4 text-xs text-muted">
              These values are set by Lumifin and are read-only.
            </p>
          </div>
        </Card>

        {/* Account security */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Account security" icon={<ShieldCheck aria-hidden className="size-5" />} />
            <div className="flex flex-col gap-4 p-6">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="flex items-center gap-4 rounded-control border border-line p-4 text-left transition-colors hover:bg-page"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-surface-purple text-brand">
                  <KeyRound aria-hidden className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-heading">Change password</span>
                  <span className="block text-xs text-muted">
                    Secure your account with a strong password.
                  </span>
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-muted" />
              </button>

              <div className="flex items-start gap-4 rounded-control border border-line p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-surface-purple text-brand">
                  <MonitorSmartphone aria-hidden className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-heading">Logged-in devices</p>
                  <p className="text-xs text-muted">Current device · Last active: now</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => showToast("Other devices have been logged out.")}
                  >
                    Log out of other devices
                  </Button>
                </div>
              </div>

              <p className="text-xs italic text-muted">
                Password last changed: {formatLongDate(partner.passwordLastChanged)}
              </p>
            </div>
          </Card>

          {/* Support */}
          <Card id="support">
            <CardHeader title="Support" />
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              {supportLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => showToast(link.description, "info")}
                  className="flex items-center gap-3 rounded-control border border-line p-3.5 text-left transition-colors hover:bg-page"
                >
                  <span className="text-brand">{supportIcons[link.id]}</span>
                  <span className="text-sm font-bold text-heading">{link.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Link
            href="/logout"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-line bg-surface text-sm font-bold text-body transition-colors hover:bg-page hover:text-heading"
          >
            <LogOut aria-hidden className="size-4" />
            Log out
          </Link>
        </div>
      </div>

      <Modal
        open={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          resetPasswordForm();
        }}
        title="Change password"
        description="Choose a new password for your partner account."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setPasswordModalOpen(false);
                resetPasswordForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="change-password-form">
              Update password
            </Button>
          </>
        }
      >
        <form
          id="change-password-form"
          onSubmit={handlePasswordSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            error={errors.current}
          />
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
            error={errors.next}
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            error={errors.confirm}
          />

          <div className="rounded-control bg-page p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Password requirements
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-body">
              <li>At least {MIN_PASSWORD_LENGTH} characters</li>
              <li>Different from your current password</li>
              <li>Not shared with any other service</li>
            </ul>
          </div>
        </form>
      </Modal>
    </>
  );
}
