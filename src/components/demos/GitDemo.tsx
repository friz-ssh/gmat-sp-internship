import { useState } from "react";
import { call, isDesktop } from "../../lib/tauri";

type Action = "status" | "log" | "branch";

const COMMANDS: Record<Action, string> = {
  status: "git status --short --branch",
  log: "git log --oneline --graph -n 15",
  branch: "git branch -vv",
};

const SAMPLE: Record<Action, string> = {
  status: `## fitur/grafik-telemetri...origin/fitur/grafik-telemetri
 M src/components/Chart.tsx
?? src/lib/format.ts`,
  log: `* 3f9a1c2 Tambah grafik telemetri
* b81d70e Rapikan struktur folder
* 94c2e55 Tambah halaman peta
* 1a0f6d3 Inisialisasi project`,
  branch: `  main                    94c2e55 [origin/main] Tambah halaman peta
* fitur/grafik-telemetri  3f9a1c2 [origin/fitur/grafik-telemetri] Tambah grafik telemetri`,
};

export default function GitDemo() {
  const desktop = isDesktop();
  const [repo, setRepo] = useState(".");
  const [action, setAction] = useState<Action>("log");
  const [output, setOutput] = useState(SAMPLE.log);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function pick(next: Action) {
    setAction(next);
    setError(null);
    if (!desktop) setOutput(SAMPLE[next]);
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const result = await call<string>("git_run", { repo, action });
      setOutput(result || "(tidak ada output)");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Perintah git">
        {(Object.keys(COMMANDS) as Action[]).map((a) => (
          <button
            key={a}
            type="button"
            className="btn btn-ghost"
            aria-pressed={action === a}
            onClick={() => pick(a)}
          >
            git {a}
          </button>
        ))}
      </div>

      {desktop ? (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[16rem] flex-1 flex-col gap-1 text-sm font-semibold">
            Lokasi repository
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="min-h-[44px] border border-ink bg-paper px-3 font-mono font-normal"
            />
          </label>
          <button type="button" className="btn btn-solid" onClick={run} disabled={busy}>
            {busy ? "Menjalankan…" : "Jalankan di Rust"}
          </button>
        </div>
      ) : (
        <p className="m-0 text-sm">
          Kamu di versi web, jadi yang tampil adalah contoh output. Buka aplikasi desktop untuk
          menjalankan git sungguhan lewat command Rust.
        </p>
      )}

      <p className="m-0 font-mono text-sm text-ink/70">$ {COMMANDS[action]}</p>
      <pre
        className="m-0 min-h-32 overflow-x-auto border border-ink bg-ink p-4 font-mono text-sm text-paper"
        aria-live="polite"
      >
        {error ?? output}
      </pre>
    </div>
  );
}