"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Info, Sparkles, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FilterSelect } from "@/components/ui/Fields";
import { ActivationChart } from "@/components/dashboard/ActivationChart";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ActivationsTable } from "@/components/tables/ActivationsTable";
import {
  activationsComparisonCopy,
  currentCycle,
  currentCycleActivations,
  dailyActivations,
  partner,
  previousCycle,
  REWARD_PER_ACTIVATION_VND,
  approximateEur,
} from "@/lib/mock-data";
import {
  formatApproxEur,
  formatCycleRange,
  formatDayMonth,
  formatLongDate,
  formatVnd,
} from "@/lib/format";

/**
 * The dashboard states called for in spec §12 are exposed through a clearly
 * labelled prototype switch rather than hidden behind unreachable code.
 */
type DashboardVariant = "current" | "empty" | "above_target" | "rollover";

const variantOptions: { value: DashboardVariant; label: string }[] = [
  { value: "current", label: "Active cycle" },
  { value: "empty", label: "No activations yet" },
  { value: "above_target", label: "Above reference target" },
  { value: "rollover", label: "New cycle started" },
];

const aboveTargetDaily = dailyActivations.map((day, index) => ({
  ...day,
  activations: day.activations + 5 + (index % 3),
}));

const TODAY_LABEL = "27 Jul";

export default function DashboardPage() {
  const [variant, setVariant] = useState<DashboardVariant>("current");

  const view = useMemo(() => {
    switch (variant) {
      case "empty":
        return {
          activationCount: 0,
          chartData: dailyActivations.map((day) => ({ ...day, activations: 0 })),
          recentRows: [],
          notice: null as React.ReactNode,
        };
      case "above_target": {
        const count = aboveTargetDaily.reduce((total, day) => total + day.activations, 0);
        return {
          activationCount: count,
          chartData: aboveTargetDaily,
          recentRows: currentCycleActivations.slice(0, 4),
          notice: (
            <div className="flex items-start gap-3 rounded-control bg-surface-purple p-4">
              <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
              <p className="text-sm font-medium leading-relaxed text-heading">
                You&rsquo;ve passed your reference target. Valid activations are still being
                recorded.
              </p>
            </div>
          ),
        };
      }
      case "rollover":
        return {
          activationCount: 0,
          chartData: dailyActivations.map((day) => ({ ...day, activations: 0 })),
          recentRows: [],
          notice: (
            <div className="flex items-start gap-3 rounded-control bg-surface-yellow p-4">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-strong" />
              <p className="text-sm font-medium leading-relaxed text-heading">
                A new cycle has started. Your previous cycle is now in payout history with the
                status Scheduled.
              </p>
            </div>
          ),
        };
      default:
        return {
          activationCount: currentCycleActivations.length,
          chartData: dailyActivations,
          recentRows: currentCycleActivations.slice(0, 4),
          notice: null as React.ReactNode,
        };
    }
  }, [variant]);

  const validCount = useMemo(
    () =>
      variant === "current"
        ? currentCycleActivations.filter((row) => row.activationStatus === "valid").length
        : view.activationCount,
    [variant, view.activationCount],
  );

  const accruedVnd = validCount * REWARD_PER_ACTIVATION_VND;
  const isAboveTarget = view.activationCount > partner.referenceTarget;
  const payoutStatus = variant === "rollover" ? "scheduled" : "accruing";

  return (
    <>
      <PageHeader
        title={`Hello, ${partner.displayName}`}
        description="Here's how your partnership is performing this cycle."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              label="Prototype state"
              value={variant}
              options={variantOptions}
              onChange={setVariant}
              hideLabel
              icon={<Sparkles className="size-4" />}
              className="min-w-52"
            />
            <span className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line bg-surface px-3.5 text-sm font-semibold text-heading">
              <CalendarDays aria-hidden className="size-4 text-muted" />
              {formatCycleRange(currentCycle.cycleStart, currentCycle.cycleEnd)}
            </span>
          </div>
        }
      />

      {view.notice ? <div className="mb-6">{view.notice}</div> : null}

      {/* KPI row */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Activations this cycle"
          value={String(view.activationCount)}
          valueSuffix={`/ ${partner.referenceTarget}`}
          secondary={`Reference target: ${partner.referenceTarget}`}
          footnote={
            view.activationCount > 0 ? (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-surface-yellow px-2.5 py-1 text-xs font-bold text-accent-strong">
                <TrendingUp aria-hidden className="size-3.5" />
                {isAboveTarget
                  ? `${view.activationCount - partner.referenceTarget} above reference target`
                  : activationsComparisonCopy}
              </span>
            ) : (
              <p className="mb-2 text-xs font-semibold text-muted">
                No activations yet this cycle.
              </p>
            )
          }
        />

        <KpiCard
          label="Accrued earnings"
          value={formatVnd(accruedVnd)}
          secondary={formatApproxEur(approximateEur(accruedVnd))}
          chip={<StatusChip status={payoutStatus} />}
          link={{ href: "/payouts", label: "Earnings breakdown" }}
        />

        <KpiCard
          label="Next payout"
          value={formatLongDate(currentCycle.expectedPayoutAt ?? currentCycle.cycleEnd)}
          secondary={`Cycle closes ${formatDayMonth(currentCycle.cycleEnd)}`}
          link={{ href: "/payouts", label: "View payout details" }}
        />
      </div>

      {/* Performance + referral */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Activation performance"
            description="Daily valid activations across the current cycle."
            action={
              <p className="text-sm font-bold text-heading">
                <span className="text-2xl text-brand">{view.activationCount}</span>
                <span className="ml-1 font-semibold text-muted">
                  / {partner.referenceTarget} activations
                </span>
              </p>
            }
          />

          <div className="flex flex-col gap-5 p-6">
            <ProgressBar
              value={view.activationCount}
              target={partner.referenceTarget}
              label={`${view.activationCount} of ${partner.referenceTarget} activations toward the reference target`}
            />

            {view.activationCount === 0 ? (
              <div className="rounded-control bg-page px-4 py-8 text-center">
                <p className="text-sm font-bold text-heading">No activations yet this cycle.</p>
                <p className="mt-1 text-sm text-muted">
                  Share your code or check that your signage and referral link are visible.
                </p>
              </div>
            ) : (
              <ActivationChart data={view.chartData} highlightLabel={TODAY_LABEL} />
            )}

            <p className="rounded-control border-l-4 border-brand bg-surface-purple px-4 py-3 text-sm font-medium leading-relaxed text-heading">
              Valid activations continue to be recorded after the reference target is reached. The
              target is a reference point, not a limit on your earnings.
            </p>
          </div>
        </Card>

        <ReferralCodeCard />
      </div>

      {/* Recent activations */}
      <Card className="mt-6">
        <CardHeader
          title="Recent activations"
          description={`Latest users who joined with ${partner.referralCode}.`}
          action={
            <Link
              href="/activations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
            >
              View all activations
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <ActivationsTable
          rows={view.recentRows}
          columns={["user", "date", "status", "payout", "reward"]}
          caption="The four most recent activations for the current cycle"
          emptyTitle="No activations yet this cycle"
          emptyDescription="Share your code or check that your signage and referral link are visible."
        />
      </Card>

      <p className="mt-6 text-xs text-muted">
        Previous cycle {formatCycleRange(previousCycle.cycleStart, previousCycle.cycleEnd)} closed
        with {previousCycle.validActivationCount} valid activations.
      </p>
    </>
  );
}
