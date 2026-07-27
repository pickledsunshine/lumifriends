"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { TextField } from "@/components/ui/Fields";

export function PasswordField({
  label,
  value,
  onChange,
  helper,
  error,
  autoComplete = "current-password",
  placeholder = "••••••••",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      helper={helper}
      error={error}
      icon={<Lock className="size-4" />}
      onChange={(event) => onChange(event.target.value)}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="inline-flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-page hover:text-heading"
        >
          {visible ? (
            <EyeOff aria-hidden className="size-4.5" />
          ) : (
            <Eye aria-hidden className="size-4.5" />
          )}
        </button>
      }
    />
  );
}
