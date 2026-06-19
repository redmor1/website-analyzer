import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { withStrictMode } from "@/utils/withStrictMode";
import ArrowUp from "../icons/arrow-up";

// Update this import to match your actual types file if needed
import type { ObservatoryTest } from "@/types/types";

// Local interface for the flattened row data
interface ObservatoryTestRow {
  name: string;
  pass: boolean;
  scoreModifier: number;
  result: string;
}

interface ObservatoryTableProps {
  tests: Record<string, ObservatoryTest>;
}

const columnHelper = createColumnHelper<ObservatoryTestRow>();

const columns = [
  columnHelper.accessor("name", {
    header: "Test",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("pass", {
    header: "Status",
    cell: (info) => {
      const pass = info.getValue();
      return (
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${
            pass
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {pass ? "Pass" : "Fail"}
        </span>
      );
    },
  }),
  columnHelper.accessor("scoreModifier", {
    header: "Penalty",
    cell: (info) => {
      const modifier = info.getValue();
      return modifier < 0 ? (
        <span className="text-red-400">{modifier}</span>
      ) : (
        <span className="text-stone-600">0</span>
      );
    },
  }),
  columnHelper.accessor("result", {
    header: "Result",
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
];

function ObservatoryTable({ tests }: ObservatoryTableProps) {
  // Sort by penalty (scoreModifier) ascending by default to surface the worst issues first
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "scoreModifier",
      desc: false,
    },
  ]);

  // Convert the tests object into an array of rows
  const data = useMemo(() => {
    return Object.entries(tests).map(([name, details]) => ({
      name,
      pass: details.pass,
      scoreModifier: details.scoreModifier,
      result: details.result,
    }));
  }, [tests]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-hidden border-2 border-stone-800 bg-stone-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-300">
          <thead className="border-b border-accent bg-linear-to-br from-orange-400 to-accent text-xs font-bold tracking-wide text-stone-50 uppercase">
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
                        cell.column.id === "name" || cell.column.id === "result"
                          ? "px-6 py-4 font-mono whitespace-nowrap text-stone-400"
                          : cell.column.id === "scoreModifier"
                            ? "px-6 py-4 text-sm font-medium whitespace-nowrap"
                            : "px-6 py-4 whitespace-nowrap"
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
                  No test results available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withStrictMode(ObservatoryTable);
