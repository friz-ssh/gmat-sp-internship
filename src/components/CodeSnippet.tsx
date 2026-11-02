import { useState } from "react";
import type { Snippet } from "../content/materials";

export function CodeSnippet({ file, code }: Snippet) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard bisa diblokir, abaikan */
    }
  }

  return (
    <figure className="m-0 border border-ink bg-ink text-paper">
      <figcaption className="flex items-center justify-between border-b border-paper/25 px-4 py-2 font-mono text-sm">
        <span className="text-paper/70">{file}</span>
        <button
          type="button"
          onClick={copy}
          className="min-h-[44px] px-2 font-sans font-semibold hover:text-signal"
          aria-live="polite"
        >
          {copied ? "Tersalin" : "Salin"}
        </button>
      </figcaption>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </figure>
  );
}