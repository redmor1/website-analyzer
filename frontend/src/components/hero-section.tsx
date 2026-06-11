import ScannerForm from "./scanner-form";
import { heroLines } from "@/data/hero-lines";

function HeroSection() {
  return (
    <section className="mx-auto flex min-h-[50dvh] max-w-7xl justify-between gap-24 px-4 xs:px-6 md:px-8">
      <div className="mx-auto flex flex-col justify-center gap-16 md:mx-0">
        <div className="text-center text-7xl tracking-tighter xs:text-8xl md:text-left">
          <span className="block">Analyze</span>
          <span className="block">
            {" "}
            your{" "}
            <span className="mt-8 inline-block bg-linear-to-br from-orange-400 to-orange-600 px-6 py-0 leading-none font-bold whitespace-nowrap">
              slop
            </span>
          </span>
        </div>
        <ScannerForm />
        <p className="text-stone-800">*please don't abuse it, i'm broke</p>
      </div>
      <div className="hidden h-96 flex-col overflow-hidden border-accent mask-t-from-80% py-2 md:flex">
        <div className="flex min-h-full shrink-0 animate-marquee-vertical flex-col">
          {/* vertical scrolling animation :P */}
          {heroLines.map((line, index) => (
            <h2 key={`first-${index}`} id={`first-${index}`} className="py-1">
              {line}
            </h2>
          ))}
        </div>

        <div className="flex min-h-full shrink-0 animate-marquee-vertical flex-col">
          {heroLines.map((line, index) => (
            <h2 key={`second-${index}`} id={`second-${index}`} className="py-1">
              {line}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
