"use client";

import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react";
import { formatActivationTimestamp, formatVnd } from "@/lib/format";
import type { ActivatedUser } from "@/lib/mock-data";

type Column = "user" | "date" | "status" | "reference" | "payout" | "reward";

const ALL_COLUMNS: Column[] = ["user", "date", "status", "reference", "payout", "reward"];

const headings: Record<Column, string> = {
  user: "User",
  date: "Activation date",
  status: "Activation status",
  reference: "Reference target",
  payout: "Payout status",
  reward: "Partner reward",
};

/**
 * Shared activations table. Wrapped in its own horizontal scroll container so a
 * narrow viewport never pushes the page sideways (spec §9).
 */
export function ActivationsTable({
  rows,
  columns = ALL_COLUMNS,
  caption,
  emptyTitle = "No activations match these filters",
  emptyDescription = "Try clearing the search or choosing a different cycle.",
  emptyAction,
}: {
  rows: ActivatedUser[];
  columns?: Column[];
  caption: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<Inbox aria-hidden className="size-6" />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-page">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-muted ${
                  column === "reward" ? "text-right" : ""
                }`}
              >
                {headings[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0 hover:bg-page">
              {columns.includes("user") ? (
                <th scope="row" className="px-6 py-4 text-sm font-bold text-heading">
                  {row.displayName}
                </th>
              ) : null}

              {columns.includes("date") ? (
                <td className="whitespace-nowrap px-6 py-4 text-sm text-body">
                  {formatActivationTimestamp(row.activatedAt)}
                </td>
              ) : null}

              {columns.includes("status") ? (
                <td className="px-6 py-4">
                  <StatusChip status={row.activationStatus} />
                </td>
              ) : null}

              {columns.includes("reference") ? (
                <td className="px-6 py-4 text-sm text-body">
                  <StatusChip status={row.referenceStatus} />
                </td>
              ) : null}

              {columns.includes("payout") ? (
                <td className="px-6 py-4">
                  <StatusChip status={row.payoutStatus} />
                </td>
              ) : null}

              {columns.includes("reward") ? (
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-heading">
                  {row.partnerRewardVnd === null ? (
                    <span className="text-muted" title="Pending review">
                      —
                    </span>
                  ) : (
                    formatVnd(row.partnerRewardVnd)
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
