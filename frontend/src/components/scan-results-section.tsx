import VulnerabilityTable from "./vulnerability-table";
import vulnerabilitiesData from "../data/vulnerability-test-data.json";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { scan } from "@/store/scanStore";
import { withStrictMode } from "@/utils/withStrictMode";

function ScanResultsSection() {
  // nano store for sharing scan results
  const $scan = useStore(scan);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // We use the vanilla .listen() method on the store itself, not the React hook.
    const unsubscribe = scan.listen((storeValue) => {
      if (storeValue?.retire?.vulnerabilities?.length > 0) {
        setIsOpen(true);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array! We only set up the listener once.

  function handleOpenTable() {
    setIsOpen(!isOpen);
  }

  // TODO: implement download of json file
  function handleDownloadJSON() {
    console.log("downloaded dude");
  }

  return (
    <section className="mx-auto mt-36 flex max-w-7xl flex-col justify-between px-4 pb-12 xs:px-6 md:px-8">
      <div className="flex justify-between">
        <button
          className="w-fit bg-linear-to-br from-orange-400 to-accent px-6 py-2 text-5xl tracking-tighter"
          onClick={() => {
            handleOpenTable();
          }}
        >
          {isOpen ? "Close scan results" : "Show scan results"}
        </button>
        <button
          className="w-fit bg-linear-to-br from-orange-400 to-accent px-4 py-2 text-xl tracking-tighter"
          onClick={() => {
            handleDownloadJSON();
          }}
        >
          Download JSON
        </button>
      </div>
      {/* if it's open then show the table */}
      {isOpen && (
        <div
          ref={tableRef}
          className="relative h-screen bg-linear-to-b from-stone-950 to-stone-900"
        >
          {/* noise overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
          <VulnerabilityTable vulnerabilities={$scan.retire.vulnerabilities} />
        </div>
      )}
    </section>
  );
}

export default withStrictMode(ScanResultsSection);
