import { scan } from "@/store/scanStore";

export function downloadStoreAsJson(filename = "reports.json") {
  const store = scan.get();
  const jsonString = JSON.stringify(store);
  const blob = new Blob([jsonString], { type: "application/json" });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(downloadUrl);
}
