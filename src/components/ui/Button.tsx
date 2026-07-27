"use client";

import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Minimum 44px interactive target on the default size — spec §3. */
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  sm: "min-h-9 px-3.5 py-2 text-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-surface-purple text-brand hover:bg-[#e3dbff]",
  outline: "border border-line bg-surface text-heading hover:bg-page",
  ghost: "text-brand hover:bg-surface-purple",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & { href: string };

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/** Icon-only control. `label` becomes the accessible name — spec §11. */
export function IconButton({
  label,
  className = "",
  children,
  ...rest
}: { label: string } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    className?: string;
    children: React.ReactNode;
  }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-control text-body transition-colors hover:bg-surface-purple hover:text-brand ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
