// import VulnerabilityTable from "./vulnerability-table";
// import  vulnerabilitiesData from "../data/vulnerability-test-data.json";

function ScanResultsSection() {
  return (
    <section className="mx-auto mt-36 flex max-w-7xl flex-col justify-between px-4 xs:px-6 md:px-8">
      <h1 className="w-fit bg-linear-to-br from-orange-400 to-accent px-6 py-2 text-5xl tracking-tighter">
        Scan results
      </h1>

      <div className="relative mt-4 h-screen bg-linear-to-b from-stone-950 to-stone-900">
        {/* noise overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
        {/* <VulnerabilityTable vulnerabilities={vulnerabilitiesData} client:load/> */}
      </div>
    </section>
  );
}

export default ScanResultsSection;
