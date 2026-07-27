type CardProps = {
  as?: "div" | "section" | "article";
  tone?: "default" | "purple" | "yellow";
  className?: string;
  /** Allows in-page anchors, e.g. the Help and support nav link. */
  id?: string;
  children: React.ReactNode;
};

const tones = {
  default: "bg-surface border-line",
  purple: "bg-surface-purple border-[#ded3ff]",
  yellow: "bg-surface-yellow border-[#f3e3ac]",
};

/** White card, 1px border, 16px radius, very soft shadow — spec §3. */
export function Card({ as: Tag = "div", tone = "default", className = "", id, children }: CardProps) {
  return (
    <Tag id={id} className={`rounded-card border shadow-card ${tones[tone]} ${className}`}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-6 py-5">
      <div className="flex items-start gap-3">
        {icon ? <span className="mt-0.5 text-brand">{icon}</span> : null}
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
