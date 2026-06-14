import { useState } from "react";
import { scan } from "@/store/scanStore";
import { postScan } from "@/api/postScan";
import { withStrictMode } from "@/utils/withStrictMode";

// TODO: link with zod types
const SCANNERS = [
  { name: "retire", isChecked: true },
  { name: "wapiti", isChecked: true },
  { name: "nuclei", isChecked: false },
  { name: "ffuf", isChecked: false },
  { name: "nmap", isChecked: false },
  { name: "testssl", isChecked: false },
];

function ScannerForm() {
  const [url, setUrl] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [scanners, setScanners] = useState(SCANNERS);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(
      `Submitting stuff:\n url: ${url}\n sendEmail: ${sendEmail} \n email: ${email}`,
    );
    const scanResult = await postScan({
      // get all checked scanners and return only the string name
      scanners: scanners.filter((s) => s.isChecked).map((s) => s.name),
      websiteUrl: url,
      email: email,
    });
    scan.set(scanResult);
  }

  async function handleCheckScanner(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    console.log(`Checking stuff ${event.target.id}`);

    const targetId = event.target.id;
    const newCheckedState = event.target.checked;
    console.log(newCheckedState);

    setScanners((prevScanners) =>
      prevScanners.map((scanner) => {
        if (scanner.name === targetId) {
          return { ...scanner, isChecked: newCheckedState };
        }
        return scanner;
      }),
    );
  }

  return (
    <form className="flex flex-col items-start gap-2" onSubmit={handleSubmit}>
      <div className="flex w-full gap-2">
        <input
          className="w-full border-2 border-stone-800 bg-stone-900 px-4 py-4"
          id="scanner"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />{" "}
        <button type="submit" className="bg-accent px-4 py-4">
          SCAN
        </button>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 border-b-2 border-b-accent text-lg">
          Scanners to run
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {scanners.map((scanner) => (
            <div className="flex items-center gap-2" key={scanner.name}>
              <input
                id={scanner.name}
                type="checkbox"
                checked={scanner.isChecked}
                onChange={handleCheckScanner}
                className="form-checkbox"
              />
              <label htmlFor={scanner.name} className="cursor-pointer">
                {scanner.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <input
          id="email-checkbox"
          type="checkbox"
          checked={sendEmail}
          onChange={() => setSendEmail(!sendEmail)}
          className="form-checkbox"
        />
        <label htmlFor="email-checkbox" className="cursor-pointer">
          Send report to email
        </label>
      </div>
      {sendEmail && (
        <input
          id="email"
          type="email"
          placeholder="email@email.com"
          className="w-full border-2 border-stone-800 bg-stone-900 px-4 py-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={sendEmail}
        />
      )}
    </form>
  );
}

export default withStrictMode(ScannerForm);
