function ScannerForm() {
  return (
    <form className="flex gap-2">
      <input
        className="w-full border-2 border-stone-800 bg-stone-900 px-4 py-4 focus:outline-2 focus:outline-accent"
        id="scanner"
        type="text"
        placeholder="https://example.com"
      />
      <button type="submit" className="bg-accent px-4 py-4">
        SCAN
      </button>
    </form>
  );
}

export default ScannerForm;
