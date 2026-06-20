import type { ObservatoryData } from "@website-analyzer/shared";
import ObservatoryTable from "@frontend/features/observatory/observatory-table";

export function ObservatoryResults({ data }: { data: ObservatoryData }) {
  if (!data || !data.scan || !data.tests) {
    return <div className="text-stone-100">No Observatory data available.</div>;
  }

  const { scan, tests } = data;

  return (
    <div className="space-y-8">
      <section className="mt-6 px-4">
        <h2 className="mb-4 text-xl font-bold text-stone-100">Scan summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Grade</p>
            <p className="text-3xl font-bold text-stone-100">{scan.grade}</p>
          </div>
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Score</p>
            <p className="text-3xl font-bold text-stone-100">{scan.score}</p>
          </div>
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Tests Passed</p>
            <p className="text-3xl font-bold text-stone-100">
              {scan.testsPassed} / {scan.testsQuantity}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 px-4 text-xl font-bold text-stone-100">
          Test results
        </h2>
        <ObservatoryTable tests={tests} />
      </section>
    </div>
  );
}
