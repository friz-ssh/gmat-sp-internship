import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { CHARTS, GROUPS, rand } from "../../content/chartCatalog";

echarts.registerTheme("gmat", {
  color: ["#000000", "#ff4d00", "#5b6770", "#aab0a6", "#2a6f5f", "#c79a1b", "#3f55b5"],
  backgroundColor: "transparent",
  textStyle: { fontFamily: "Bricolage Grotesque Variable, sans-serif" },
});

// Kode contoh dijalankan di window ini sendiri. Hanya kode yang kamu ketik
// di editor yang dievaluasi, bukan sesuatu dari luar.
function evaluate(code: string): echarts.EChartsOption {
  const fn = new Function("rand", `${code}\nreturn option;`) as (
    r: typeof rand,
  ) => echarts.EChartsOption;
  return fn(rand);
}

export default function ChartLab() {
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);
  const [id, setId] = useState(CHARTS[0].id);
  const def = CHARTS.find((c) => c.id === id) ?? CHARTS[0];
  const [code, setCode] = useState(def.code);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function choose(next: string) {
    const d = CHARTS.find((c) => c.id === next);
    if (!d) return;
    setId(next);
    setCode(d.code);
    setError(null);
  }

  // siapkan instance chart
  useEffect(() => {
    const c = echarts.init(el.current!, "gmat");
    chart.current = c;
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(el.current!);
    return () => {
      ro.disconnect();
      c.dispose();
      chart.current = null;
    };
  }, []);

  // jalankan kode setiap berubah (dengan jeda saat sedang diketik)
  useEffect(() => {
    const delay = code === def.code ? 0 : 350;
    const timer = window.setTimeout(() => {
      try {
        chart.current?.setOption(evaluate(code), true);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [code, def.code]);

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
    <div className="grid gap-5 xl:grid-cols-[13rem_minmax(0,1fr)]">
      {/* pilihan chart: dropdown di layar sempit, daftar bergrup di layar lebar */}
      <label className="flex flex-col gap-1 text-sm font-semibold xl:hidden">
        Jenis chart
        <select
          value={id}
          onChange={(e) => choose(e.target.value)}
          className="min-h-[44px] border border-ink bg-paper px-3 font-normal"
        >
          {GROUPS.map((g) => (
            <optgroup key={g} label={g}>
              {CHARTS.filter((c) => c.group === g).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <nav aria-label="Jenis chart" className="hidden max-h-[40rem] overflow-y-auto pr-2 xl:block">
        {GROUPS.map((g) => (
          <div key={g} className="mb-4">
            <h3 className="m-0 mb-1 text-sm font-bold">{g}</h3>
            <ul className="m-0 list-none p-0">
              {CHARTS.filter((c) => c.group === g).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => choose(c.id)}
                    aria-pressed={c.id === id}
                    className={`block w-full px-2 py-1.5 text-left text-sm ${
                      c.id === id ? "bg-ink text-paper" : "hover:bg-ink/10"
                    }`}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="min-w-0 space-y-4">
        <h3 className="m-0 text-xl font-bold">{def.title}</h3>
        <div ref={el} role="img" aria-label={def.title} className="h-[26rem] w-full" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm font-semibold">Kode (bisa diedit)</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => choose(def.id)}>
              Kembalikan kode awal
            </button>
            <button type="button" className="btn btn-ghost" onClick={copy} aria-live="polite">
              {copied ? "Tersalin" : "Salin kode"}
            </button>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Editor kode chart"
          className="h-80 w-full resize-y border border-ink bg-ink p-4 font-mono text-sm leading-relaxed text-paper"
        />

        {error && (
          <p role="alert" className="m-0 border-l-4 border-signal bg-ink/5 p-3 font-mono text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}