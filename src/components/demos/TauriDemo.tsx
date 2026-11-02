import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { listen } from "@tauri-apps/api/event";
import { call, isDesktop } from "../../lib/tauri";

type Info = { os: string; arch: string; version: string };
type Sample = { t: number; altitude: number };

const MAX_POINTS = 60;
// rumus yang sama dengan versi Rust, dipakai saat berjalan di web
const altitudeAt = (t: number) => 500 + 400 * Math.sin(t * 0.35) + 60 * Math.sin(t * 1.7);

export default function TauriDemo() {
  const desktop = isDesktop();
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);
  const points = useRef<[number, number][]>([]);
  const [running, setRunning] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);

  function push(s: Sample) {
    points.current.push([s.t, s.altitude]);
    if (points.current.length > MAX_POINTS) points.current.shift();
    chart.current?.setOption({ series: [{ data: points.current }] });
  }

  // siapkan grafik
  useEffect(() => {
    const c = echarts.init(el.current!);
    chart.current = c;
    c.setOption({
      animation: false,
      textStyle: { fontFamily: "Bricolage Grotesque Variable" },
      grid: { left: 8, right: 16, top: 16, bottom: 24, containLabel: true },
      xAxis: { type: "value", min: "dataMin", max: "dataMax", name: "waktu (detik)", nameLocation: "middle", nameGap: 28 },
      yAxis: { type: "value", name: "ketinggian (m)", min: 0, max: 1000 },
      series: [{ type: "line", showSymbol: false, data: [], lineStyle: { color: "#000000", width: 2 } }],
    });
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(el.current!);
    return () => {
      ro.disconnect();
      c.dispose();
      chart.current = null;
    };
  }, []);

  // info runtime dari Rust
  useEffect(() => {
    if (desktop) call<Info>("app_info").then(setInfo).catch(() => undefined);
  }, [desktop]);

  // sumber data: event Rust (desktop) atau timer JavaScript (web)
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let unlisten: (() => void) | undefined;
    let timer: number | undefined;

    if (desktop) {
      (async () => {
        const off = await listen<Sample>("telemetry", (e) => push(e.payload));
        if (cancelled) {
          off();
          return;
        }
        unlisten = off;
        await call("start_telemetry");
      })().catch(console.error);
    } else {
      let t = 0;
      timer = window.setInterval(() => {
        push({ t, altitude: altitudeAt(t) });
        t += 0.25;
      }, 250);
    }

    return () => {
      cancelled = true;
      unlisten?.();
      if (timer) window.clearInterval(timer);
      if (desktop) call("stop_telemetry").catch(() => undefined);
    };
  }, [running, desktop]);

  function toggle() {
    if (!running) points.current = [];
    setRunning((r) => !r);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
      <div>
        <div ref={el} className="h-72 w-full" />
        <p className="m-0 mt-3 text-sm">
          Sumber data:{" "}
          <strong>{desktop ? "event Tauri dari Rust" : "timer JavaScript (mode web)"}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <button type="button" className="btn btn-solid w-full" onClick={toggle}>
          {running ? "Hentikan " : "Mulai"}
        </button>
        <dl className="m-0 space-y-2 text-sm">
          <div>
            <dt className="font-semibold">Sistem operasi</dt>
            <dd className="m-0">{info ? info.os : "Hanya di desktop"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Arsitektur</dt>
            <dd className="m-0">{info ? info.arch : "Hanya di desktop"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Versi aplikasi</dt>
            <dd className="m-0">{info ? info.version : "Hanya di desktop"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}