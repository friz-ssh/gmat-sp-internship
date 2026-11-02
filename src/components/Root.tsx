import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import { materials } from "../content/materials";
import { isDesktop } from "../lib/tauri";

export default function Root() {
  const desktop = isDesktop();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 h-14 border-b border-ink bg-paper">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-6 md:px-12">
          <Link to="/" className="shrink-0 text-lg font-extrabold tracking-tight">
            MAGANG SP 2027
          </Link>
          <nav aria-label="Materi" className="flex gap-5 overflow-x-auto text-sm font-medium">
            {materials.map((m) => (
              <NavLink
                key={m.slug}
                to={`/materi/${m.slug}`}
                className={({ isActive }) =>
                  `whitespace-nowrap py-2 underline-offset-8 hover:underline ${
                    isActive ? "underline" : ""
                  }`
                }
              >
                {m.slug === "git" ? "Git" : m.slug === "echarts" ? "ECharts" : m.slug === "leaflet" ? "Leaflet" : "Tauri"}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink">
        <div className="hatch h-6 border-b border-ink" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm md:px-12">
          <p className="m-0">Built with Tauri, React, dan Tailwind.</p>
          <p className="m-0 mt-1 text-ink/70">
            {desktop
              ? "Kamu membuka versi desktop. Semua demo aktif."
              : "Kamu membuka versi web. Demo yang memakai Rust hanya jalan di aplikasi desktop."}
          </p>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  );
}