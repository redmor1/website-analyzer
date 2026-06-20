import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { scan } from "@frontend/store/scanStore";
import { withStrictMode } from "@frontend/utils/withStrictMode";
import { ObservatoryResults } from "@frontend/features/observatory/observatory-results";
import { downloadStoreAsJson } from "@frontend/utils/download";
import { RetireResults } from "@frontend/features/retire/retire-results";

function ScanResultsSection() {
  const $scan = useStore(scan);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Extract the names of the scanners that returned data
  const availableScanners = Object.keys($scan || {}).filter(
    (key) => Object.keys($scan[key as key_of_scan] || {}).length > 0,
  );

  useEffect(() => {
    const unsubscribe = scan.listen((storeValue) => {
      const keys = Object.keys(storeValue || {});
      if (keys.length > 0) {
        setIsOpen(true);
        // Default to the first available scanner tab when opened
        setActiveTab(keys[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  function handleTabChange(tabName: string) {
    setActiveTab(tabName);
    // Force the view back to the top of the results section
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function renderActiveTable() {
    switch (activeTab) {
      case "retire":
        return <RetireResults data={$scan.retire} />;

      case "wappalyzergo":
        // return <WappalyzerTable data={$scan.wappalyzergo} />;
        return (
          <div className="p-8 text-white">Wappalyzer Data Placeholder</div>
        );
      case "observatory":
        return <ObservatoryResults data={$scan.observatory} />;
      default:
        return null;
    }
  }

  return (
    <>
      <section className="mx-auto mt-36 flex max-w-7xl flex-col justify-between px-4 pb-12 xs:px-6 md:px-8">
        <div className="flex justify-between">
          <button
            className="w-fit bg-linear-to-br from-orange-400 to-accent px-6 py-2 text-5xl tracking-tighter text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close scan results" : "Show scan results"}
          </button>
          <button
            onClick={() => downloadStoreAsJson("reports.json")}
            className="w-fit cursor-pointer bg-linear-to-br from-orange-400 to-accent px-4 py-2 text-xl tracking-tighter text-white"
          >
            Download JSON
          </button>
        </div>

        {isOpen && availableScanners.length > 0 && (
          <div
            ref={sectionRef}
            className="relative mt-8 min-h-screen border-2 border-stone-800 bg-linear-to-b from-stone-950 to-stone-900 shadow-xl"
          >
            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 z-50 flex w-full border-b-2 border-stone-800 bg-stone-950/90 backdrop-blur-md">
              {availableScanners.map((scanner) => (
                <button
                  key={scanner}
                  onClick={() => handleTabChange(scanner)}
                  className={`flex-1 px-6 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                    activeTab === scanner
                      ? "border-b-2 border-orange-400 bg-stone-800 text-orange-400"
                      : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                  }`}
                >
                  {scanner}
                </button>
              ))}
            </div>

            {/* Render the matching table component */}
            <div className="w-full">{renderActiveTable()}</div>
          </div>
        )}
      </section>
    </>
  );
}

type key_of_scan = keyof NonNullable<typeof scan.value>;

export default withStrictMode(ScanResultsSection);
