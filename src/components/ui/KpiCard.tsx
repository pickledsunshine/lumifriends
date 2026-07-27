import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function KpiCard({
  label,
  value,
  valueSuffix,
  secondary,
  chip,
  footnote,
  link,
}: {
  label: string;
  value: string;
  /** Smaller trailing text next to the headline figure, e.g. "/ 100". */
  valueSuffix?: string;
  secondary?: string;
  chip?: React.ReactNode;
  footnote?: React.ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <Card className="flex flex-col gap-3 p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-body">{label}</h3>
        {chip}
      </div>

      <p className="text-3xl font-bold leading-none text-heading">
        {value}
        {valueSuffix ? (
          <span className="ml-1.5 text-lg font-semibold text-muted">{valueSuffix}</span>
        ) : null}
      </p>

      {secondary ? <p className="text-sm text-muted">{secondary}</p> : null}

      <div className="mt-auto pt-1">
        {footnote}
        {link ? (
          <Link
            href={link.href}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
          >
            {link.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
