/**
 * Status chips — spec §3.
 * Each chip always carries its own text label, so status is never communicated
 * by colour alone (spec §11).
 */

export type ChipStatus =
  | "accruing"
  | "scheduled"
  | "paid"
  | "valid"
  | "under_review"
  | "pending_review"
  | "active_partner"
  | "within_target"
  | "above_target";

const chipStyles: Record<ChipStatus, { label: string; className: string; dot: string }> = {
  accruing: {
    label: "Accruing",
    className: "bg-surface-purple text-brand",
    dot: "bg-brand",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-surface-yellow text-accent-strong",
    dot: "bg-warning",
  },
  paid: {
    label: "Paid",
    className: "bg-success-soft text-success",
    dot: "bg-success",
  },
  valid: {
    label: "Valid",
    className: "bg-success-soft text-success",
    dot: "bg-success",
  },
  under_review: {
    label: "Under review",
    className: "bg-warning-soft text-accent-strong",
    dot: "bg-warning",
  },
  pending_review: {
    label: "Pending review",
    className: "bg-warning-soft text-accent-strong",
    dot: "bg-warning",
  },
  active_partner: {
    label: "Active partner",
    className: "bg-success-soft text-success",
    dot: "bg-success",
  },
  // Passing the reference target is neutral-positive information, never an error.
  within_target: {
    label: "Within target",
    className: "bg-page text-body",
    dot: "bg-muted",
  },
  above_target: {
    label: "Above target",
    className: "bg-surface-purple text-brand",
    dot: "bg-brand",
  },
};

export function StatusChip({
  status,
  label,
  className = "",
}: {
  status: ChipStatus;
  /** Overrides the default wording when a screen needs a variant. */
  label?: string;
  className?: string;
}) {
  const style = chipStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${style.className} ${className}`}
    >
      <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
      {label ?? style.label}
    </span>
  );
}
