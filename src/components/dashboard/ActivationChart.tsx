"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = { date: string; activations: number };

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const count = payload[0]?.value ?? 0;
  return (
    <div className="rounded-control border border-line bg-surface px-3 py-2 shadow-raised">
      <p className="text-xs font-bold text-heading">{label}</p>
      <p className="text-xs text-body">
        {count} {count === 1 ? "activation" : "activations"}
      </p>
    </div>
  );
}

/** Daily activations across the current cycle — spec §7.3. */
export function ActivationChart({ data, highlightLabel }: { data: Datum[]; highlightLabel?: string }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -24 }} barCategoryGap="22%">
          <CartesianGrid vertical={false} stroke="#e6e1ef" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tick={{ fill: "#766f86", fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fill: "#766f86", fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#eee9ff" }} />
          <Bar dataKey="activations" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                // The current day is picked out in brand yellow.
                fill={entry.date === highlightLabel ? "#ffd14a" : "#3d11c3"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
