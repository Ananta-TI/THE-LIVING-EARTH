"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PillarDistributionPoint } from "@/features/dashboard/queries";
import { cn } from "@/lib/utils";

interface ContentDistributionChartProps {
  readonly data: readonly PillarDistributionPoint[];
}

export function ContentDistributionChart({ data }: ContentDistributionChartProps) {
  const [chartMode, setChartMode] = useState<"area" | "bar">("area");

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No pillars found in the database yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div
          role="group"
          aria-label="Chart display mode"
          className="inline-flex rounded-lg border border-border bg-background p-0.5 text-xs"
        >
          <button
            type="button"
            onClick={() => setChartMode("area")}
            aria-pressed={chartMode === "area"}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              chartMode === "area"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Trend Curve
          </button>
          <button
            type="button"
            onClick={() => setChartMode("bar")}
            aria-pressed={chartMode === "bar"}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              chartMode === "bar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Grouped Bars
          </button>
        </div>
      </div>

      <div
        className="h-72 w-full"
        role="img"
        aria-label="Content overview across the five environmental pillars"
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === "area" ? (
            <AreaChart data={[...data]} margin={{ top: 10, right: 16, left: -12, bottom: 8 }}>
              <defs>
                <linearGradient id="adminArticlesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="adminStudiesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="pillar"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval={0}
                tickFormatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 15)}…` : value
                }
              />
              <YAxis
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
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              <Area
                type="monotone"
                dataKey="articles"
                name="Articles"
                stroke="var(--chart-1)"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#adminArticlesFill)"
              />
              <Area
                type="monotone"
                dataKey="caseStudies"
                name="Case Studies"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#adminStudiesFill)"
              />
              <Area
                type="monotone"
                dataKey="statistics"
                name="Statistics"
                stroke="var(--chart-3)"
                strokeWidth={1.8}
                fillOpacity={0.08}
                fill="var(--chart-3)"
              />
            </AreaChart>
          ) : (
            <BarChart data={[...data]} margin={{ top: 10, right: 16, left: -12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="pillar"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval={0}
                tickFormatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 15)}…` : value
                }
              />
              <YAxis
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
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              <Bar dataKey="articles" name="Articles" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="caseStudies"
                name="Case Studies"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="statistics"
                name="Statistics"
                fill="var(--chart-3)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <details className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
          View accessible pillar counts table
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-1.5 pr-4 font-medium">Pillar</th>
                <th className="py-1.5 pr-4 font-medium">Articles</th>
                <th className="py-1.5 pr-4 font-medium">Case Studies</th>
                <th className="py-1.5 font-medium">Statistics</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.pillar} className="border-b border-border/60 last:border-none">
                  <td className="py-1.5 pr-4 font-medium text-foreground">{row.pillar}</td>
                  <td className="py-1.5 pr-4 tabular-nums">{row.articles}</td>
                  <td className="py-1.5 pr-4 tabular-nums">{row.caseStudies}</td>
                  <td className="py-1.5 tabular-nums">{row.statistics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
