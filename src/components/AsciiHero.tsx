import { useEffect, useRef } from "react";

const RAMP = " .:-=+*#%@";
const CW = 9;
const CH = 16;
const FONT = '"JetBrains Mono Variable"';

type Props = { color?: string; accent?: string };

export function AsciiHero({
  color = "rgba(0,0,0,0.30)",
  accent = "#ff4d00",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };

    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let alive = true;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CH - 3}px ${FONT}, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / CW);
      rows = Math.ceil(h / CH);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      let current = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * CW;
          const py = r * CH;
          const x = c / cols;
          const y = r / rows;
          const d = Math.hypot(px - pointer.x, py - pointer.y);

          let v =
            Math.sin(x * 9 + t * 0.7) +
            Math.sin(y * 7 - t * 0.5) +
            Math.sin((x + y) * 11 + t * 0.9);
          v += Math.exp(-d / 140) * Math.sin(d / 10 - t * 4) * 2; // riak dari kursor
          v = Math.min(1, Math.max(0, v / 6 + 0.5));

          const i = Math.floor(v * (RAMP.length - 1));
          if (i === 0) continue;

          const fill = d < 90 ? accent : color;
          if (fill !== current) {
            ctx.fillStyle = fill;
            current = fill;
          }
          ctx.fillText(RAMP[i], px, py);
        }
      }
    };

    const loop = (ms: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!visible || ms - last < 33) return; // ~30 fps cukup untuk ASCII
      last = ms;
      draw(ms / 1000);
    };

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = e.clientX - b.left;
      pointer.y = e.clientY - b.top;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const start = () => {
      if (!alive) return;
      resize();
      window.addEventListener("resize", resize);
      if (reduced) {
        draw(0); // satu frame statis
        return;
      }
      window.addEventListener("pointermove", onMove);
      raf = requestAnimationFrame(loop);
    };

    // tunggu font siap supaya karakter tidak berganti bentuk di tengah jalan
    document.fonts
      .load(`${CH - 3}px ${FONT}`)
      .catch(() => undefined)
      .finally(start);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [color, accent]);

  return <canvas ref={ref} aria-hidden="true" className="block h-full w-full" />;
}