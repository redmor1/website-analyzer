import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type {
  RetireVulnerability,
  RetireVulnerabilitySeverity,
} from "@website-analyzer/shared";
import { withStrictMode } from "@frontend/utils/withStrictMode";
import { getSeverityWeights } from "@frontend/utils/table-utils";
import ArrowUp from "@frontend/components/icons/arrow-up";

interface RetireTableProps {
  vulnerabilities: RetireVulnerability[];
}

const severityStyles: Record<RetireVulnerabilitySeverity, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-stone-500/10 text-stone-400 border-stone-500/20",
};

const columnHelper = createColumnHelper<RetireVulnerability>();

const columns = [
  columnHelper.accessor("id", {
    header: "Vulnerability ID",
    cell: (info) => {
      const vuln = info.row.original;
      const hasReferences = vuln.references && vuln.references.length > 0;
      const cveUrl = hasReferences ? vuln.references![0].source.url : null;
      const id = info.getValue();

      if (hasReferences && cveUrl) {
        return (
          <a
            href={cveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-max items-center gap-1.5 transition-colors hover:text-orange-400"
            title="View reference"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="underline decoration-stone-600 underline-offset-4 group-hover:decoration-orange-400">
              {id}
            </span>
            <svg
              className="h-3.5 w-3.5 text-stone-500 transition-colors group-hover:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        );
      }
      return id || "--";
    },
  }),
  columnHelper.accessor((row) => row.ratings?.[0]?.severity || "low", {
    id: "severity",
    header: "Severity",
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => {
      const weightA = getSeverityWeights(rowA.original);
      const weightB = getSeverityWeights(rowB.original);
      return weightA - weightB;
    },

    cell: (info) => {
      const severity = info.getValue() as RetireVulnerabilitySeverity;
      return (
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${severityStyles[severity]}`}
        >
          {severity}
        </span>
      );
    },
  }),
  columnHelper.accessor("cwes", {
    header: "CWE(s)",
    enableSorting: false,
    cell: (info) => {
      const cwes = info.getValue();
      return cwes && cwes.length > 0
        ? cwes.map((cwe) => `CWE-${cwe}`).join(", ")
        : "--";
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
];

function RetireTable({ vulnerabilities }: RetireTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "severity",
      desc: true,
    },
  ]);

  const data = useMemo(() => vulnerabilities, [vulnerabilities]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-6 w-full overflow-hidden border-2 border-stone-800 bg-stone-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-300">
          <thead className="border-accent bg-linear-to-br from-orange-400 to-accent text-xs font-bold tracking-wide text-stone-50 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={`px-6 py-4 ${
                      header.column.getCanSort()
                        ? "cursor-pointer transition-colors select-none hover:bg-stone-800/40"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getIsSorted() === "asc" && (
                        <ArrowUp className="size-4" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ArrowUp className="size-4 rotate-180" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y-2 divide-stone-900 bg-stone-950">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-stone-900/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={
                        cell.column.id === "description"
                          ? "max-w-xl min-w-75 px-6 py-4 leading-relaxed text-stone-400"
                          : cell.column.id === "cwes"
                            ? "px-6 py-4 font-mono whitespace-nowrap text-stone-400"
                            : "px-6 py-4 font-medium whitespace-nowrap text-stone-100"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-stone-500"
                >
                  No vulnerabilities detected. Your slop is clean.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withStrictMode(RetireTable);
