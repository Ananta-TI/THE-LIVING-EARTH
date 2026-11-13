"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, ArrowLeft, Loader2, Save } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { StatusSelect, type EditorialStatus } from "@/components/admin/forms/status-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveStatisticAction } from "@/features/statistics/actions";
import type { StatisticFormLookups, StatisticRow } from "@/features/statistics/queries";
import { STATISTIC_DATA_TYPES } from "@/features/statistics/schemas";

interface StatisticFormProps {
  readonly lookups: StatisticFormLookups;
  readonly initialData?: StatisticRow;
}

export function StatisticForm({ lookups, initialData }: StatisticFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [pillarId, setPillarId] = useState(
    initialData?.pillar_id ?? lookups.pillars[0]?.id ?? "",
  );
  const [referenceId, setReferenceId] = useState(
    initialData?.reference_id ?? lookups.references[0]?.id ?? "",
  );
  const [indicator, setIndicator] = useState(initialData?.indicator ?? "");
  const [value, setValue] = useState(
    initialData?.value !== undefined ? String(initialData.value) : "",
  );
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [geographicScope, setGeographicScope] = useState(
    initialData?.geographic_scope ?? "Global",
  );
  const [measurementYear, setMeasurementYear] = useState(
    initialData?.measurement_year !== undefined
      ? String(initialData.measurement_year)
      : String(new Date().getFullYear()),
  );
  const [publicationDate, setPublicationDate] = useState(initialData?.publication_date ?? "");
  const [dataType, setDataType] = useState<StatisticRow["data_type"]>(
    initialData?.data_type ?? "current_estimate",
  );
  const [status, setStatus] = useState<EditorialStatus>(initialData?.status ?? "draft");
  const [methodology, setMethodology] = useState(initialData?.methodology ?? "");
  const [limitations, setLimitations] = useState(initialData?.limitations ?? "");

  const hasReferences = lookups.references.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveStatisticAction({
        id: initialData?.id,
        pillar_id: pillarId,
        reference_id: referenceId,
        indicator,
        value,
        unit,
        geographic_scope: geographicScope,
        measurement_year: measurementYear,
        publication_date: publicationDate,
        methodology,
        limitations,
        data_type: dataType,
        status,
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to save statistic.");
        return;
      }

      router.push("/admin/statistics");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!hasReferences ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-600/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold">Scientific Reference Required First</p>
            <p className="text-xs leading-relaxed">
              Every statistic in THE LIVING EARTH must link to a verified scientific reference.{" "}
              <Link href="/admin/references/create" className="font-semibold underline">
                Register a scientific reference first
              </Link>{" "}
              before saving statistics.
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Indicator Measurement</CardTitle>
              <CardDescription>
                Record exact numeric environmental indicators with explicit unit, scope, and year.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField id="stat-indicator" label="Indicator Name" required>
                <Input
                  id="stat-indicator"
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  placeholder="e.g., Atmospheric CO2 Concentration (Annual Mean)"
                  required
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField id="stat-value" label="Numeric Value" required>
                  <Input
                    id="stat-value"
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </FormField>

                <FormField id="stat-unit" label="Unit" required>
                  <Input
                    id="stat-unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., ppm, °C, million ha"
                    required
                  />
                </FormField>

                <FormField id="stat-year" label="Measurement Year" required>
                  <Input
                    id="stat-year"
                    type="number"
                    min={1800}
                    max={2150}
                    value={measurementYear}
                    onChange={(e) => setMeasurementYear(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="stat-scope" label="Geographic Scope" required>
                  <Input
                    id="stat-scope"
                    value={geographicScope}
                    onChange={(e) => setGeographicScope(e.target.value)}
                    placeholder="e.g., Global, Southeast Asia, Amazon Basin"
                    required
                  />
                </FormField>

                <FormField
                  id="stat-pub-date"
                  label="Dataset Publication Date"
                  description="Date the source report or dataset was released."
                >
                  <Input
                    id="stat-pub-date"
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                  />
                </FormField>
              </div>

              <FormField
                id="stat-methodology"
                label="Methodology"
                description="How this measurement or estimate is collected and calculated."
              >
                <Textarea
                  id="stat-methodology"
                  rows={3}
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                />
              </FormField>

              <FormField
                id="stat-limitations"
                label="Data Limitations & Uncertainty"
                description="Document confidence bounds, sampling gaps, or comparability caveats."
              >
                <Textarea
                  id="stat-limitations"
                  rows={3}
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Classification &amp; Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="stat-status" label="Status" required>
                <StatusSelect
                  id="stat-status"
                  value={status}
                  onValueChange={setStatus}
                  disabled={isPending}
                />
              </FormField>

              <FormField id="stat-data-type" label="Data Type" required>
                <Select
                  value={dataType}
                  onValueChange={(next) => setDataType(next as StatisticRow["data_type"])}
                >
                  <SelectTrigger id="stat-data-type" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATISTIC_DATA_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="stat-pillar" label="Environmental Pillar" required>
                <Select value={pillarId} onValueChange={setPillarId}>
                  <SelectTrigger id="stat-pillar" className="h-10 w-full">
                    <SelectValue placeholder="Select pillar" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups.pillars.map((pillar) => (
                      <SelectItem key={pillar.id} value={pillar.id}>
                        {pillar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                id="stat-reference"
                label="Scientific Reference"
                required
                description="Mandatory authoritative citation backing this indicator."
              >
                <Select
                  value={referenceId}
                  onValueChange={setReferenceId}
                  disabled={!hasReferences}
                >
                  <SelectTrigger id="stat-reference" className="h-10 w-full">
                    <SelectValue placeholder="Select verified reference" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups.references.map((ref) => (
                      <SelectItem key={ref.id} value={ref.id}>
                        {ref.title} ({ref.organization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <Button asChild type="button" variant="outline" className="gap-1.5">
          <Link href="/admin/statistics">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Statistics</span>
          </Link>
        </Button>

        <Button type="submit" disabled={isPending || !hasReferences} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          <span>{isPending ? "Saving..." : initialData ? "Update Statistic" : "Save Statistic"}</span>
        </Button>
      </div>
    </form>
  );
}
