"use client";

import { useId } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";

/** Every input carries a visible label; icon-only affordances get a `sr-only` one. */

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full rounded-control border border-line bg-surface pl-10 pr-3 text-sm font-medium text-heading placeholder:text-muted focus:border-brand"
        />
      </div>
    </div>
  );
}

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  icon,
  className = "",
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  hideLabel?: boolean;
  icon?: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-semibold"}>
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        ) : null}
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={`min-h-11 w-full appearance-none rounded-control border border-line bg-surface py-2 pr-9 text-sm font-semibold text-heading focus:border-brand ${
            icon ? "pl-10" : "pl-3.5"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}

/** Cycle picker. Presented as a select so it is keyboard-navigable by default. */
export function DateRangeSelector<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <FilterSelect
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      hideLabel
      icon={<Calendar className="size-4" />}
      className={className}
    />
  );
}

export function TextField({
  label,
  helper,
  error,
  icon,
  trailing,
  ...rest
}: {
  label: string;
  helper?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const helperId = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-heading">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? helperId : undefined}
          className={`min-h-12 w-full rounded-control border bg-surface py-2 text-sm font-medium text-heading placeholder:text-muted focus:border-brand ${
            error ? "border-danger" : "border-line"
          } ${icon ? "pl-10" : "pl-3.5"} ${trailing ? "pr-12" : "pr-3.5"}`}
          {...rest}
        />
        {trailing ? (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span>
        ) : null}
      </div>
      {helper || error ? (
        <p
          id={helperId}
          className={`mt-1.5 text-xs font-medium ${error ? "text-danger" : "text-muted"}`}
        >
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 shrink-0 cursor-pointer rounded-sm border border-line accent-brand"
      />
      <label htmlFor={id} className="cursor-pointer text-sm font-medium text-body">
        {label}
      </label>
    </div>
  );
}
