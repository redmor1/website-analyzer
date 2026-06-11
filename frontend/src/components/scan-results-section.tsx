import VulnerabilityTable from "./vulnerability-table";
import vulnerabilitiesData from "../data/vulnerability-test-data.json";

import { useEffect, useRef, useState } from "react";

function ScanResultsSection() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isOpen]);

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
          Show scan results
        </button>{" "}
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
          <VulnerabilityTable
            vulnerabilities={vulnerabilitiesData}
            client:load
          />
        </div>
      )}
    </section>
  );
}

export default ScanResultsSection;
