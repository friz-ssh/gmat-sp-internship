import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { useScrollProgress } from "../lib/useScrollProgress";

// GANTI isi array ini dengan jobdesc software programmer GMAT yang sebenarnya.
const JOBS = [
  {
    title: "Bikin GCS (Framework)",
    body: "Membuat aplikasi yang dipakai tim untuk memantau dan mengendalikan perangkat.",
    slug: "tauri",
    link: "Pelajari Tauri",
  },
  {
    title: "Bikin GCS (Visualisasi Data)",
    body: "Mengubah data sensor mentah menjadi grafik yang bisa dibaca sekilas.",
    slug: "echarts",
    link: "Pelajari ECharts",
  },
  {
    title: "Bikin GCS (Peta)",
    body: "Menampilkan lokasi dan jalur di atas peta secara langsung.",
    slug: "leaflet",
    link: "Pelajari Leaflet",
  },
  {
    title: "Bikin GCS (Maintain Kode)",
    body: "Bekerja paralel dengan anggota lain tanpa saling menimpa pekerjaan.",
    slug: "git",
    link: "Pelajari Git",
  },
];

export function JobdescParallax() {
  const section = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const line = useRef<HTMLDivElement>(null);
  const hatch = useRef<HTMLDivElement>(null);
  const [reduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const apply = useCallback((p: number) => {
    const span = 1 / JOBS.length;
    items.current.forEach((li, i) => {
      if (!li) return;
      const center = (i + 0.5) * span;
      const k = Math.max(0, 1 - Math.abs(p - center) / span); // 0 sampai 1
      li.style.opacity = String(0.18 + 0.82 * k);
      li.style.transform = `translate3d(${24 * k}px, 0, 0)`;
    });
    if (line.current) line.current.style.transform = `scaleY(${p})`;
    if (hatch.current) hatch.current.style.transform = `translate3d(0, ${-30 * p}%, 0)`;
  }, []);

  useScrollProgress(section, apply);

  const heading = (
    <div>
      <h2 className="m-0 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
        J*bdesc Software Programmer Ugrasena apa aja?
      </h2>
      <p className="mt-5 max-w-[42ch]">
        Empat pekerjaan ini menjadi alasan kamu belajar empat materi di situs ini.
      </p>
    </div>
  );

  if (reduce) {
    return (
      <section id="tugas" className="border-b border-ink px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
          {heading}
          <ul className="m-0 list-none space-y-10 p-0">
            {JOBS.map((job) => (
              <li key={job.slug}>
                <h3 className="m-0 text-2xl font-bold md:text-4xl">{job.title}</h3>
                <p className="mb-2 mt-2 max-w-[48ch]">{job.body}</p>
                <Link to={`/materi/${job.slug}`} className="font-semibold underline underline-offset-4">
                  {job.link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="tugas" ref={section} className="relative h-[360vh] border-b border-ink">
      <div className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-hidden">
        {/* lapisan parallax: pita hatch bergerak lebih lambat dari konten */}
        <div
          ref={hatch}
          aria-hidden="true"
          className="hatch absolute -top-[10%] right-0 h-[160%] w-1/4 will-change-transform md:w-1/5"
        />
        <div className="relative mx-auto grid h-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1.4fr] md:px-12">
          {heading}
          <div className="relative pl-6">
            <div
              ref={line}
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-ink"
              style={{ transform: "scaleY(0)" }}
            />
            <ul className="m-0 list-none space-y-8 p-0">
              {JOBS.map((job, i) => (
                <li
                  key={job.slug}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  className="will-change-transform"
                  style={{ opacity: 0.18 }}
                >
                  <h3 className="m-0 text-2xl font-bold leading-tight md:text-4xl">{job.title}</h3>
                  <p className="mb-2 mt-2 max-w-[48ch]">{job.body}</p>
                  <Link to={`/materi/${job.slug}`} className="font-semibold underline underline-offset-4">
                    {job.link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}