"use client";

import { Inbox } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCycleRange, formatLongDate, formatVnd } from "@/lib/format";
import type { PayoutCycle } from "@/lib/mock-data";

export function PayoutHistoryTable({
  cycles,
  onViewDetails,
}: {
  cycles: PayoutCycle[];
  onViewDetails: (cycle: PayoutCycle) => void;
}) {
  if (cycles.length === 0) {
    return (
      <EmptyState
        icon={<Inbox aria-hidden className="size-6" />}
        title="No payout cycles match these filters"
        description="Try a different status or clear the cycle search."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">Completed payout cycles for your partnership</caption>
        <thead>
          <tr className="border-b border-line bg-page">
            <th scope="col" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">
              Cycle
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">
              Valid activations
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">
              Amount
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">
              Status
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">
              Date paid
            </th>
            <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-muted">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((cycle) => (
            <tr key={cycle.id} className="border-b border-line last:border-0 hover:bg-page">
              <th scope="row" className="px-6 py-4">
                <span className="block text-sm font-bold text-heading">
                  {formatCycleRange(cycle.cycleStart, cycle.cycleEnd)}
                </span>
                <span className="block text-xs font-medium text-muted">{cycle.reference}</span>
              </th>
              <td className="px-6 py-4 text-sm text-body">{cycle.validActivationCount}</td>
              <td className="px-6 py-4">
                <span className="block whitespace-nowrap text-sm font-bold text-heading">
                  {formatVnd(cycle.amountVnd)}
                </span>
                {cycle.approximateAmountEur ? (
                  <span className="block text-xs text-muted">≈ €{cycle.approximateAmountEur}</span>
                ) : null}
              </td>
              <td className="px-6 py-4">
                <StatusChip status={cycle.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-body">
                {cycle.paidAt ? formatLongDate(cycle.paidAt) : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onViewDetails(cycle)}
                  className="text-sm font-bold text-brand hover:underline"
                >
                  View details
                  <span className="sr-only">
                    {" "}
                    for {formatCycleRange(cycle.cycleStart, cycle.cycleEnd)}
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
