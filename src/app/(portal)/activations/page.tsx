"use client";

import { useMemo, useState } from "react";
import { CircleCheck, FileDown, Users, CircleAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DateRangeSelector, FilterSelect, SearchInput } from "@/components/ui/Fields";
import { Pagination } from "@/components/ui/Pagination";
import { ActivationsTable } from "@/components/tables/ActivationsTable";
import { useToast } from "@/components/ui/Toast";
import { downloadTextFile, toCsv } from "@/lib/download";
import {
  activatedUsers,
  currentCycle,
  currentCycleSummary,
  partner,
  payoutCycles,
  previousCycle,
} from "@/lib/mock-data";
import { formatActivationTimestamp, formatCycleRangeShort, formatVnd, parseIso } from "@/lib/format";

type CycleFilter = "cycle-2026-07-b" | "cycle-2026-07-a" | "all";
type ActivationStatusFilter = "all" | "valid" | "under_review";
type PayoutStatusFilter = "all" | "accruing" | "pending_review" | "scheduled" | "paid";
type SortOrder = "recent" | "oldest" | "name";

const DEFAULTS = {
  search: "",
  cycle: "cycle-2026-07-b" as CycleFilter,
  activationStatus: "all" as ActivationStatusFilter,
  payoutStatus: "all" as PayoutStatusFilter,
  sort: "recent" as SortOrder,
  rowsPerPage: 20,
};

const cycleOptions: { value: CycleFilter; label: string }[] = [
  {
    value: "cycle-2026-07-b",
    label: `Current cycle: ${formatCycleRangeShort(currentCycle.cycleStart, currentCycle.cycleEnd)}`,
  },
  {
    value: "cycle-2026-07-a",
    label: `Last cycle: ${formatCycleRangeShort(previousCycle.cycleStart, previousCycle.cycleEnd)}`,
  },
  { value: "all", label: "All cycles" },
];

const activationStatusOptions: { value: ActivationStatusFilter; label: string }[] = [
  { value: "all", label: "All activation statuses" },
  { value: "valid", label: "Valid" },
  { value: "under_review", label: "Under review" },
];

const payoutStatusOptions: { value: PayoutStatusFilter; label: string }[] = [
  { value: "all", label: "All payout statuses" },
  { value: "accruing", label: "Accruing" },
  { value: "pending_review", label: "Pending review" },
  { value: "scheduled", label: "Scheduled" },
  { value: "paid", label: "Paid" },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "User name (A–Z)" },
];

export default function ActivationsPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState(DEFAULTS.search);
  const [cycle, setCycle] = useState<CycleFilter>(DEFAULTS.cycle);
  const [activationStatus, setActivationStatus] = useState<ActivationStatusFilter>(
    DEFAULTS.activationStatus,
  );
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatusFilter>(DEFAULTS.payoutStatus);
  const [sort, setSort] = useState<SortOrder>(DEFAULTS.sort);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULTS.rowsPerPage);

  /**
   * Changing any filter invalidates the current page position. The signature is
   * stored alongside the page number so the reset happens during render rather
   * than in an effect, which would cause a second pass.
   */
  const filterSignature = `${search}|${cycle}|${activationStatus}|${payoutStatus}|${sort}|${rowsPerPage}`;
  const [pageState, setPageState] = useState({ signature: filterSignature, page: 1 });
  const page = pageState.signature === filterSignature ? pageState.page : 1;
  const setPage = (nextPage: number) => setPageState({ signature: filterSignature, page: nextPage });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const rows = activatedUsers.filter((row) => {
      if (cycle !== "all") {
        // The under-review record has no payout cycle yet but belongs to the open cycle.
        const rowCycle = row.payoutCycleId ?? currentCycle.id;
        if (rowCycle !== cycle) return false;
      }
      if (activationStatus !== "all" && row.activationStatus !== activationStatus) return false;
      if (payoutStatus !== "all" && row.payoutStatus !== payoutStatus) return false;
      if (query && !`${row.displayName} ${row.id}`.toLowerCase().includes(query)) return false;
      return true;
    });

    return rows.sort((a, b) => {
      if (sort === "name") return a.displayName.localeCompare(b.displayName);
      const diff = parseIso(a.activatedAt).getTime() - parseIso(b.activatedAt).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [search, cycle, activationStatus, payoutStatus, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * rowsPerPage;
  const visible = filtered.slice(startIndex, startIndex + rowsPerPage);

  const isFiltered =
    search !== DEFAULTS.search ||
    cycle !== DEFAULTS.cycle ||
    activationStatus !== DEFAULTS.activationStatus ||
    payoutStatus !== DEFAULTS.payoutStatus ||
    sort !== DEFAULTS.sort;

  function resetFilters() {
    setSearch(DEFAULTS.search);
    setCycle(DEFAULTS.cycle);
    setActivationStatus(DEFAULTS.activationStatus);
    setPayoutStatus(DEFAULTS.payoutStatus);
    setSort(DEFAULTS.sort);
    setPage(1);
  }

  function handleExport() {
    const csv = toCsv(
      ["User", "Activated at", "Activation status", "Reference target", "Payout status", "Partner reward"],
      filtered.map((row) => [
        row.displayName,
        formatActivationTimestamp(row.activatedAt),
        row.activationStatus === "valid" ? "Valid" : "Under review",
        row.referenceStatus === "within_target" ? "Within target" : "Above target",
        row.payoutStatus.replace("_", " "),
        row.partnerRewardVnd === null ? "" : formatVnd(row.partnerRewardVnd),
      ]),
    );

    const cycleSlug = cycle === "all" ? "all-cycles" : cycle;
    downloadTextFile(csv, `lumifriends-activations-${cycleSlug}.csv`, "text/csv");
    showToast(`Exported ${filtered.length} activations to CSV`);
  }

  const summaryCards = [
    {
      label: "Total this cycle",
      value: currentCycleSummary.total,
      icon: <Users aria-hidden className="size-5" />,
      tone: "bg-surface-purple text-brand",
    },
    {
      label: "Valid activations",
      value: currentCycleSummary.valid,
      icon: <CircleCheck aria-hidden className="size-5" />,
      tone: "bg-success-soft text-success",
    },
    {
      label: "Under review",
      value: currentCycleSummary.underReview,
      icon: <CircleAlert aria-hidden className="size-5" />,
      tone: "bg-warning-soft text-accent-strong",
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Activations" },
        ]}
        title="Activations"
        badge={
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
            {currentCycleSummary.total} this cycle
          </span>
        }
        description={
          <>
            Track users who activated through referral code{" "}
            <span className="font-bold text-heading">{partner.referralCode}</span>.
          </>
        }
        action={
          <Button variant="outline" onClick={handleExport}>
            <FileDown aria-hidden className="size-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label} className="flex items-center gap-4 p-5">
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-control ${card.tone}`}>
              {card.icon}
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-muted">
                {card.label}
              </span>
              <span className="block text-2xl font-bold text-heading">{card.value}</span>
            </span>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SearchInput
            label="Search activations"
            placeholder="Search by user name or ID"
            value={search}
            onChange={setSearch}
          />
          <DateRangeSelector
            label="Cycle"
            value={cycle}
            options={cycleOptions}
            onChange={setCycle}
            className="lg:w-72"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Activation status"
            value={activationStatus}
            options={activationStatusOptions}
            onChange={setActivationStatus}
            hideLabel
            className="min-w-52"
          />
          <FilterSelect
            label="Payout status"
            value={payoutStatus}
            options={payoutStatusOptions}
            onChange={setPayoutStatus}
            hideLabel
            className="min-w-52"
          />
          <FilterSelect
            label="Sort order"
            value={sort}
            options={sortOptions}
            onChange={setSort}
            hideLabel
            className="min-w-44"
          />
          <Button
            variant="ghost"
            onClick={resetFilters}
            disabled={!isFiltered}
            className="disabled:opacity-40"
          >
            Reset filters
          </Button>
        </div>
      </Card>

      <Card className="mt-6">
        <ActivationsTable
          rows={visible}
          caption="Activations attributed to your referral code"
          emptyAction={
            isFiltered ? (
              <Button variant="secondary" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : undefined
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-heading">
              {filtered.length === 0
                ? "Showing 0 activations"
                : `Showing ${startIndex + 1}–${Math.min(startIndex + rowsPerPage, filtered.length)} of ${filtered.length} activations`}
            </p>
            <p className="text-xs italic text-muted">
              User details are limited to protect their privacy.
            </p>
          </div>

          {filtered.length > 0 ? (
            <Pagination
              page={safePage}
              pageCount={pageCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          ) : null}
        </div>
      </Card>

      <p className="mt-4 text-xs text-muted">
        Activation records are maintained by Lumifin across{" "}
        {payoutCycles.length} payout cycles and cannot be added, edited or removed by partners.
      </p>
    </>
  );
}
