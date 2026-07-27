import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-brand hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-brand">
                  {crumb.label}
                </span>
              )}
              {isLast ? null : <ChevronRight aria-hidden className="size-4 text-muted" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  breadcrumb,
  title,
  description,
  badge,
  action,
  titleAdornment,
}: {
  breadcrumb?: { label: string; href?: string }[];
  title: string;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  titleAdornment?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {breadcrumb ? <Breadcrumb trail={breadcrumb} /> : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-brand">{title}</h1>
          {badge}
          {titleAdornment}
        </div>
        {description ? <p className="mt-1.5 max-w-2xl text-body">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  );
}
