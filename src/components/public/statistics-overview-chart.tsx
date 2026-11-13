"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PublicStatisticWithSource } from "@/features/public/queries";
import { formatNumber } from "@/lib/utils/format";

interface StatisticsOverviewChartProps {
  readonly statistics: readonly PublicStatisticWithSource[];
  readonly pillars: readonly { readonly id: string; readonly name: string }[];
}

export function StatisticsOverviewChart({
  statistics,
  pillars,
}: StatisticsOverviewChartProps) {
  const unitGroups = useMemo(() => {
    const groups = new Map<string, PublicStatisticWithSource[]>();
    for (const stat of statistics) {
      const list = groups.get(stat.unit) ?? [];
      list.push(stat);
      groups.set(stat.unit, list);
    }
    return Array.from(groups.entries()).filter(([, items]) => items.length >= 2);
  }, [statistics]);

  const [selectedUnit, setSelectedUnit] = useState<string>(
    unitGroups[0]?.[0] ?? "__pillar_counts__",
  );

  const pillarCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const stat of statistics) {
      counts.set(stat.pillar_id, (counts.get(stat.pillar_id) ?? 0) + 1);
    }
    return pillars.map((pillar) => ({
      label: pillar.name,
      count: counts.get(pillar.id) ?? 0,
    }));
  }, [statistics, pillars]);

  const activeUnitSeries = useMemo(() => {
    const found = unitGroups.find(([unit]) => unit === selectedUnit);
    if (!found) return null;
    return {
      unit: found[0],
      points: [...found[1]]
        .sort((a, b) => a.measurement_year - b.measurement_year)
        .map((item) => ({
          label: `${item.measurement_year} · ${item.geographic_scope}`,
          indicator: item.indicator,
          value: item.value,
          dataType: item.data_type,
        })),
    };
  }, [unitGroups, selectedUnit]);

  if (statistics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-xl font-medium text-foreground">
            {activeUnitSeries
              ? `Verified Indicator Comparison (${activeUnitSeries.unit})`
              : "Published Scientific Indicators by Pillar"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeUnitSeries
              ? `Only indicators sharing the same verified unit (${activeUnitSeries.unit}) are plotted together to prevent scale distortion.`
              : "Count of published, source-attributed environmental indicators across pillars (Y-axis anchored at zero)."}
          </p>
        </div>

        {unitGroups.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Chart dataset selector">
            <button
              type="button"
              onClick={() => setSelectedUnit("__pillar_counts__")}
              aria-pressed={selectedUnit === "__pillar_counts__"}
              className={
                selectedUnit === "__pillar_counts__"
                  ? "min-h-9 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                  : "min-h-9 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              }
            >
              By Pillar
            </button>
            {unitGroups.map(([unit]) => (
              <button
                key={unit}
                type="button"
                onClick={() => setSelectedUnit(unit)}
                aria-pressed={selectedUnit === unit}
                className={
                  selectedUnit === unit
                    ? "min-h-9 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                    : "min-h-9 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                }
              >
                Unit: {unit}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className="h-72 w-full min-w-0"
        role="img"
        aria-label={
          activeUnitSeries
            ? `Bar chart of verified ${activeUnitSeries.unit} indicators`
            : "Bar chart of published statistics count per environmental pillar"
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          {activeUnitSeries ? (
            <BarChart
              data={activeUnitSeries.points}
              margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.75rem",
                }}
              />
              <Bar
                dataKey="value"
                name={activeUnitSeries.unit}
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart data={pillarCounts} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval={0}
                tickFormatter={(val: string) => (val.length > 16 ? `${val.slice(0, 15)}…` : val)}
              />
              <YAxis
                domain={[0, "auto"]}
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.75rem",
                }}
              />
              <Bar
                dataKey="count"
                name="Published Indicators"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <details className="rounded-xl border border-border bg-muted/25 px-4 py-2.5 text-xs">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
          Accessible data table alternative ({statistics.length} verified records)
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Indicator
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Value
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Scope
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Year
                </th>
                <th scope="col" className="py-2 font-medium">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => (
                <tr key={stat.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 font-medium text-foreground">{stat.indicator}</td>
                  <td className="py-2 pr-4 tabular-nums">
                    {formatNumber(stat.value)} {stat.unit}
                  </td>
                  <td className="py-2 pr-4">{stat.geographic_scope}</td>
                  <td className="py-2 pr-4 tabular-nums">{stat.measurement_year}</td>
                  <td className="py-2">{stat.reference?.organization ?? "Verified Source"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
