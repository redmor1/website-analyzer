import { useState } from "react";
import type { RetireData } from "@website-analyzer/shared";
import RetireTable from "@frontend/features/retire/retire-table";

export function RetireResults({ data }: { data: RetireData }) {
  const [showComponents, setShowComponents] = useState(false);
  const [showServices, setShowServices] = useState(false);

  if (!data) {
    return <div className="text-stone-400">No Retire data available.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="mt-6 px-4">
        <h2 className="mb-4 text-xl font-bold text-stone-100">Scan summary</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Vulnerabilities found</p>
            <p className="mt-1 text-3xl font-bold text-stone-100">
              {data.vulnerabilities?.length || 0}
            </p>
          </div>
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Components detected</p>
            <p className="mt-1 text-3xl font-bold text-stone-100">
              {data.components?.length || 0}
            </p>
          </div>
          <div className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm">
            <p className="text-sm text-stone-400">Services detected</p>
            <p className="mt-1 text-3xl font-bold text-stone-100">
              {data.services?.length || 0}
            </p>
          </div>
        </div>
      </section>

      {data.components && data.components?.length > 0 && (
        <section className="px-4">
          <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="text-lg font-bold text-stone-100">Components</h3>
            <button
              onClick={() => setShowComponents(!showComponents)}
              className="rounded bg-stone-800 px-3 py-1 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-700"
            >
              {showComponents ? "Hide components" : "Show components"}
            </button>
          </div>

          {showComponents && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm"
                >
                  <p className="text-sm text-stone-400 capitalize">
                    {comp.type}
                  </p>
                  <p className="mt-1 text-lg font-bold wrap-break-word text-stone-100">
                    {comp.name}
                  </p>
                  <p className="mt-1 text-sm text-stone-400">v{comp.version}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {data.services && data.services?.length > 0 && (
        <section className="px-4">
          <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="text-lg font-bold text-stone-100">Services</h3>
            <button
              onClick={() => setShowServices(!showServices)}
              className="rounded bg-stone-800 px-3 py-1 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-700"
            >
              {showServices ? "Hide services" : "Show services"}
            </button>
          </div>

          {showServices && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.services.map((service, index) => (
                <div
                  key={index}
                  className="rounded border-2 border-stone-800 bg-stone-900 p-4 shadow-sm"
                >
                  <p className="text-lg font-bold text-stone-100">
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="mt-1 mb-3 text-sm text-stone-400">
                      {service.description}
                    </p>
                  )}
                  {service.endpoints && service.endpoints?.length > 0 && (
                    <div className="mt-2 rounded border border-stone-800 bg-stone-950 p-2">
                      <p className="mb-1 text-xs font-semibold tracking-wider text-stone-500 uppercase">
                        Endpoints
                      </p>
                      <ul className="list-inside list-disc text-sm text-stone-300">
                        {service.endpoints.map((endpoint, i) => (
                          <li key={i} className="truncate" title={endpoint}>
                            {endpoint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section>
        <RetireTable vulnerabilities={data.vulnerabilities} />
      </section>
    </div>
  );
}
