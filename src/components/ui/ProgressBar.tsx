/**
 * Progress toward the reference target.
 * The target is informational, so values above 100% are a valid, non-error
 * state: the bar fills completely and an over-target segment is highlighted.
 */
export function ProgressBar({
  value,
  target,
  label,
}: {
  value: number;
  target: number;
  label: string;
}) {
  const percent = target > 0 ? (value / target) * 100 : 0;
  const withinTargetWidth = Math.min(percent, 100);
  const isAboveTarget = percent > 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={value}
      aria-label={label}
      className="h-3 w-full overflow-hidden rounded-full bg-surface-purple"
    >
      <div className="flex h-full w-full">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-700"
          style={{ width: `${withinTargetWidth}%` }}
        />
        {isAboveTarget ? (
          // Yellow tail shows the surplus without implying anything went wrong.
          <div className="-ml-3 h-full flex-1 rounded-full bg-accent" />
        ) : null}
      </div>
    </div>
  );
}
