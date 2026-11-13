import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly className?: string;
  readonly render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  readonly data: readonly T[];
  readonly columns: readonly DataTableColumn<T>[];
  readonly getRowKey: (row: T) => string;
  readonly caption?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader className="bg-muted/40">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-11 px-4 text-xs font-medium text-muted-foreground",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={getRowKey(row)} className="hover:bg-muted/30">
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("px-4 py-3.5 align-middle", column.className)}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
