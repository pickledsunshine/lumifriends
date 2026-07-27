import { Check } from "lucide-react";
import type { PayoutCycleStatus } from "@/lib/mock-data";

const STEPS: { key: PayoutCycleStatus; label: string }[] = [
  { key: "accruing", label: "Accruing" },
  { key: "scheduled", label: "Scheduled" },
  { key: "paid", label: "Paid" },
];

/** Three-stage payout tracker — spec §7.5. Payouts are automatic; nothing here is a control. */
export function PayoutStatusTracker({
  status,
  stepCaptions,
}: {
  status: PayoutCycleStatus;
  /** Optional caption under each step, e.g. the date it happens. */
  stepCaptions?: Partial<Record<PayoutCycleStatus, string>>;
}) {
  const activeIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <ol className="flex items-start">
      {STEPS.map((step, index) => {
        const isComplete = index < activeIndex;
        const isCurrent = index === activeIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <li
            key={step.key}
            className={`relative flex flex-col items-center ${isLast ? "" : "flex-1"}`}
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                  isComplete
                    ? "border-brand bg-brand text-white"
                    : isCurrent
                      ? "border-brand bg-surface"
                      : "border-line bg-surface"
                }`}
              >
                {isComplete ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  <span
                    className={`size-2.5 rounded-full ${isCurrent ? "bg-brand" : "bg-line"}`}
                  />
                )}
              </span>
              {isLast ? null : (
                <span
                  aria-hidden
                  className={`h-1 flex-1 rounded-full ${index < activeIndex ? "bg-brand" : "bg-line"}`}
                />
              )}
            </div>

            <div className={`mt-2 ${isLast ? "text-right" : "w-full"} ${index === 0 ? "text-left" : ""}`}>
              <p
                className={`text-sm font-bold ${isCurrent || isComplete ? "text-brand" : "text-muted"}`}
              >
                {step.label}
                {isCurrent ? <span className="sr-only"> (current stage)</span> : null}
                {isComplete ? <span className="sr-only"> (complete)</span> : null}
              </p>
              {stepCaptions?.[step.key] ? (
                <p className="text-xs text-muted">{stepCaptions[step.key]}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
