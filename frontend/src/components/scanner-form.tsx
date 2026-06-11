import { useState } from "react";
import { scan } from "@/store/scanStore";
import { postScan } from "@/api/postScan";

function ScannerForm() {
  const [url, setUrl] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(
      `Submitting stuff:\n url: ${url}\n sendEmail: ${sendEmail} \n email: ${email}`,
    );
    const scanResult = await postScan({
      scanners: ["retire"],
      websiteUrl: url,
    });
    scan.set(scanResult);
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
      </div>{" "}
      <div className="flex w-full items-center gap-2">
        <input
          id="email-checkbox"
          type="checkbox"
          checked={sendEmail}
          onChange={() => setSendEmail(!sendEmail)}
          className="form-checkbox"
        />
        <label htmlFor="email-checkbox">Send report to email</label>
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

export default ScannerForm;
