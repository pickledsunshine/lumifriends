"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  Coins,
  FileDown,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Modal } from "@/components/ui/Modal";
import { FilterSelect, SearchInput } from "@/components/ui/Fields";
import { PayoutStatusTracker } from "@/components/payouts/PayoutStatusTracker";
import { PayoutHistoryTable } from "@/components/tables/PayoutHistoryTable";
import { useToast } from "@/components/ui/Toast";
import { downloadTextFile, toCsv } from "@/lib/download";
import {
  approximateEur,
  currentCycle,
  partner,
  payoutHistory,
  REWARD_PER_ACTIVATION_VND,
  type PayoutCycle,
} from "@/lib/mock-data";
import {
  formatApproxEur,
  formatCycleRange,
  formatDayMonth,
  formatLongDate,
  formatVnd,
} from "@/lib/format";

type StatusFilter = "all" | "paid" | "scheduled";
type RangeFilter = "all" | "2026-07" | "2026-06";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "scheduled", label: "Scheduled" },
];

const rangeOptions: { value: RangeFilter; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "2026-07", label: "July 2026" },
  { value: "2026-06", label: "June 2026" },
];

export default function PayoutsPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [range, setRange] = useState<RangeFilter>("all");
  const [detailsCycle, setDetailsCycle] = useState<PayoutCycle | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payoutHistory.filter((cycle) => {
      if (status !== "all" && cycle.status !== status) return false;
      if (range !== "all" && !cycle.cycleStart.startsWith(range)) return false;
      if (query) {
        const haystack =
          `${cycle.reference} ${formatCycleRange(cycle.cycleStart, cycle.cycleEnd)}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [search, status, range]);

  function handleExportHistory() {
    const csv = toCsv(
      ["Cycle", "Reference", "Valid activations", "Amount VND", "Status", "Date paid"],
      filteredHistory.map((cycle) => [
        formatCycleRange(cycle.cycleStart, cycle.cycleEnd),
        cycle.reference,
        cycle.validActivationCount,
        cycle.amountVnd,
        cycle.status === "paid" ? "Paid" : "Scheduled",
        cycle.paidAt ? formatLongDate(cycle.paidAt) : "",
      ]),
    );
    downloadTextFile(csv, "lumifriends-payout-history.csv", "text/csv");
    showToast(`Exported ${filteredHistory.length} payout cycles to CSV`);
  }

  const breakdown = [
    {
      icon: <Users aria-hidden className="size-4" />,
      label: "Valid activations",
      value: String(currentCycle.validActivationCount),
    },
    {
      icon: <Coins aria-hidden className="size-4" />,
      label: "Reward per activation",
      value: formatVnd(REWARD_PER_ACTIVATION_VND),
    },
    {
      icon: <CalendarDays aria-hidden className="size-4" />,
      label: "Cycle closes",
      value: formatLongDate(currentCycle.cycleEnd),
    },
    {
      icon: <Banknote aria-hidden className="size-4" />,
      label: "Expected payout",
      value: currentCycle.expectedPayoutAt ? formatLongDate(currentCycle.expectedPayoutAt) : "—",
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Payouts" }]}
        title="Payouts"
        titleAdornment={
          <InfoTooltip
            label="How payouts are processed"
            text="Payouts are automatic. Lumifin transfers your accrued earnings after each cycle closes — there is nothing to request or withdraw."
          />
        }
        description="Review accrued earnings and completed payout cycles."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current payout */}
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Current payout cycle
              </p>
              <p className="mt-1 text-lg font-bold text-heading">
                {formatCycleRange(currentCycle.cycleStart, currentCycle.cycleEnd)}
              </p>
            </div>
            <StatusChip status={currentCycle.status} />
          </div>

          <div className="flex flex-wrap items-baseline gap-3 px-6 pt-5">
            <p className="text-4xl font-bold text-brand">{formatVnd(currentCycle.amountVnd)}</p>
            <p className="text-sm font-semibold text-muted">
              {formatApproxEur(currentCycle.approximateAmountEur ?? approximateEur(currentCycle.amountVnd))}
            </p>
          </div>
          <p className="px-6 pt-1 text-sm text-body">
            {currentCycle.validActivationCount} valid activations · Cycle closes{" "}
            {formatDayMonth(currentCycle.cycleEnd)}
          </p>

          <div className="px-6 pt-8">
            <PayoutStatusTracker
              status={currentCycle.status}
              stepCaptions={{
                accruing: "In progress",
                scheduled: formatDayMonth(currentCycle.cycleEnd),
                paid: currentCycle.expectedPayoutAt
                  ? formatDayMonth(currentCycle.expectedPayoutAt)
                  : undefined,
              }}
            />
          </div>

          <div className="p-6">
            <div className="mt-4 flex items-start gap-3 rounded-control bg-surface-purple p-4">
              <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold text-heading">No action is required</p>
                <p className="mt-0.5 text-sm leading-relaxed text-body">
                  Lumifin will process the payout after the current cycle closes.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cycle breakdown */}
        <Card className="flex flex-col">
          <CardHeader title="Cycle breakdown" />
          <div className="flex flex-1 flex-col gap-4 p-6">
            <dl className="flex flex-col gap-3">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-3">
                  <dt className="flex items-center gap-2 text-sm text-body">
                    <span className="text-muted">{item.icon}</span>
                    {item.label}
                  </dt>
                  <dd className="text-right text-sm font-bold text-heading">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto rounded-control bg-page p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Total accrued</p>
              <p className="mt-1 text-2xl font-bold text-brand">
                {formatVnd(currentCycle.amountVnd)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {currentCycle.validActivationCount} × {formatVnd(REWARD_PER_ACTIVATION_VND)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payout history */}
      <Card className="mt-6">
        <CardHeader
          title="Payout history"
          description="Completed cycles, including the amount transferred and the date it settled."
          action={
            <Button variant="outline" size="sm" onClick={handleExportHistory}>
              <FileDown aria-hidden className="size-4" />
              Export history
            </Button>
          }
        />

        <div className="flex flex-wrap gap-3 border-b border-line p-5">
          <SearchInput
            label="Search payout history"
            placeholder="Search by cycle or reference"
            value={search}
            onChange={setSearch}
            className="min-w-56 flex-1"
          />
          <FilterSelect
            label="Date range"
            value={range}
            options={rangeOptions}
            onChange={setRange}
            hideLabel
            icon={<CalendarDays className="size-4" />}
            className="min-w-44"
          />
          <FilterSelect
            label="Payout status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
            hideLabel
            className="min-w-40"
          />
        </div>

        <PayoutHistoryTable cycles={filteredHistory} onViewDetails={setDetailsCycle} />

        <p className="border-t border-line px-6 py-4 text-sm text-muted">
          Showing {filteredHistory.length} of {payoutHistory.length} completed cycles.
        </p>
      </Card>

      {/* How payouts work */}
      <Card className="mt-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setHowItWorksOpen((open) => !open)}
          aria-expanded={howItWorksOpen}
          className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition-colors hover:bg-page"
        >
          <span className="text-base font-bold text-heading">How payouts work</span>
          <ChevronDown
            aria-hidden
            className={`size-5 shrink-0 text-muted transition-transform ${
              howItWorksOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {howItWorksOpen ? (
          <div className="border-t border-line px-6 py-5">
            <p className="text-sm leading-relaxed text-body">
              Earnings accrue when valid users activate through your referral code. At the end of
              each cycle, the total is scheduled for transfer and marked as Paid once the transfer
              is confirmed.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Payouts follow a fixed schedule ({partner.payoutSchedule.toLowerCase()}), so there is
              no request or withdrawal step. Activations still under review are excluded until
              Lumifin confirms them.
            </p>
          </div>
        ) : null}
      </Card>

      <Modal
        open={detailsCycle !== null}
        onClose={() => setDetailsCycle(null)}
        title="Payout details"
        description={
          detailsCycle ? formatCycleRange(detailsCycle.cycleStart, detailsCycle.cycleEnd) : undefined
        }
        footer={<Button onClick={() => setDetailsCycle(null)}>Close</Button>}
      >
        {detailsCycle ? (
          <dl className="flex flex-col divide-y divide-line">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Cycle dates</dt>
              <dd className="text-sm font-bold text-heading">
                {formatCycleRange(detailsCycle.cycleStart, detailsCycle.cycleEnd)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Payout reference</dt>
              <dd className="text-sm font-bold text-heading">{detailsCycle.reference}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Valid activations</dt>
              <dd className="text-sm font-bold text-heading">
                {detailsCycle.validActivationCount}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Reward per activation</dt>
              <dd className="text-sm font-bold text-heading">
                {formatVnd(REWARD_PER_ACTIVATION_VND)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Total</dt>
              <dd className="text-right">
                <span className="block text-base font-bold text-brand">
                  {formatVnd(detailsCycle.amountVnd)}
                </span>
                {detailsCycle.approximateAmountEur ? (
                  <span className="block text-xs text-muted">
                    {formatApproxEur(detailsCycle.approximateAmountEur)}
                  </span>
                ) : null}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-body">Status</dt>
              <dd>
                <StatusChip status={detailsCycle.status} />
              </dd>
            </div>
            {detailsCycle.paidAt ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-body">Date paid</dt>
                <dd className="text-sm font-bold text-heading">
                  {formatLongDate(detailsCycle.paidAt)}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </Modal>
    </>
  );
}
