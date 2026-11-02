import { Link } from "react-router";
import { AsciiHero } from "../components/AsciiHero";
import { CornerMarks } from "../components/CornerMarks";
import { JobdescParallax } from "../components/JobdescParallax";
import { materials } from "../content/materials";

export default function Landing() {
  const toTugas = () =>
    document.getElementById("tugas")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section className="relative h-[calc(100dvh-3.5rem)] min-h-[560px] overflow-hidden border-b border-ink">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
          <AsciiHero />
        </div>

        <div className="pointer-events-none absolute inset-4 border border-ink/25 text-ink">
          <CornerMarks />
        </div>

        <div className="absolute bottom-8 left-8 right-8 max-w-3xl border border-ink bg-paper p-6 md:bottom-12 md:left-12 md:p-8">
          <h1 className="m-0 text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight">
            Magang Software Programmer GMAT 2027
          </h1>
          <br/>
          <p className="mb-6 mt-5 max-w-[52ch]">
            Empat materi pegangan intern programmer GMAT: Git, Tauri, ECharts, dan Leaflet.
            Semuanya bisa dicoba langsung di halaman ini.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/materi/git" className="btn btn-solid">
              Mulai dari Git
            </Link>
            <button type="button" onClick={toTugas} className="btn btn-ghost">
              Lihat tugas programmer
            </button>
          </div>
        </div>
      </section>

      <JobdescParallax />

      <section id="materi">
        <div className="hatch h-6 border-b border-ink" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-12">
          <h2 className="m-0 mb-10 text-4xl font-extrabold tracking-tight md:text-6xl">
            Pilih materi
          </h2>
          <ul className="m-0 list-none border-b border-ink p-0">
            {materials.map((m) => (
              <li key={m.slug} className="border-t border-ink">
                <Link
                  to={`/materi/${m.slug}`}
                  className="grid gap-2 px-2 py-6 transition-colors hover:bg-ink hover:text-paper md:grid-cols-[1.2fr_1.6fr_auto] md:items-center md:gap-8 md:px-4"
                >
                  <span className="text-2xl font-bold leading-tight md:text-3xl">{m.title}</span>
                  <span className="max-w-[56ch]">{m.summary}</span>
                  <span className="text-sm font-semibold underline underline-offset-4">
                    {m.demoLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}