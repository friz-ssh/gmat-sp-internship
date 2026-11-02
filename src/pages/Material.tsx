import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Link, useParams } from "react-router";
import { CodeSnippet } from "../components/CodeSnippet";
import { CornerMarks } from "../components/CornerMarks";
import {
  materials,
  type Block,
  type DemoId,
  type MaterialData,
} from "../content/materials";

const demos: Record<DemoId, LazyExoticComponent<ComponentType>> = {
  git: lazy(() => import("../components/demos/GitDemo")),
  tauri: lazy(() => import("../components/demos/TauriDemo")),
  chartlab: lazy(() => import("../components/demos/ChartLab")),
  map: lazy(() => import("../components/demos/LeafletDemo")),
};

// daftar semua halaman dari semua materi, untuk tombol Sebelumnya dan Berikutnya
const flat = materials.flatMap((m) => m.pages.map((p) => ({ m, p })));

/** Menampilkan teks dengan potongan di antara tanda ` sebagai kode. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="bg-ink/10 px-1 font-mono text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return (
              <p key={i} className="m-0 max-w-[65ch]">
                <Inline text={b.text} />
              </p>
            );
          case "h":
            return (
              <h2 key={i} className="m-0 mt-10 text-2xl font-bold leading-tight">
                {b.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="m-0 max-w-[65ch] list-disc space-y-2 pl-5">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="m-0 max-w-[65ch] list-decimal space-y-2 pl-5">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </ol>
            );
          case "note":
            return (
              <div key={i} role="note" className="max-w-[65ch] border-l-4 border-signal bg-ink/5 p-4">
                <Inline text={b.text} />
              </div>
            );
          case "code":
            return <CodeSnippet key={i} file={b.file} lang={b.lang} code={b.code} />;
          case "demo": {
            const Demo = demos[b.id];
            return (
              <div key={i} className="relative border border-ink p-4 md:p-6">
                <CornerMarks />
                <Suspense fallback={<p className="m-0">Memuat demo…</p>}>
                  <Demo />
                </Suspense>
              </div>
            );
          }
        }
      })}
    </div>
  );
}

function PageList({ m, current }: { m: MaterialData; current: number }) {
  return (
    <nav aria-label={`Halaman ${m.title}`}>
      <ul className="m-0 list-none p-0">
        {m.pages.map((pg, i) => (
          <li key={pg.slug}>
            <Link
              to={`/materi/${m.slug}/${pg.slug}`}
              aria-current={i === current ? "page" : undefined}
              className={`block border-l-2 py-2 pl-4 pr-2 text-[0.95rem] leading-snug ${
                i === current
                  ? "border-ink bg-ink/5 font-bold"
                  : "border-ink/20 text-ink/75 hover:border-ink hover:text-ink"
              }`}
            >
              {pg.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <h1 className="m-0 text-4xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="mt-4">
        <Link to="/" className="font-semibold underline underline-offset-4">
          Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}

export default function Material() {
  const { slug, page } = useParams();
  const m = materials.find((x) => x.slug === slug);
  const pageIndex = m ? (page ? m.pages.findIndex((p) => p.slug === page) : 0) : -1;

  if (!m || pageIndex === -1) return <NotFound />;

  const current = m.pages[pageIndex];
  const flatIndex = flat.findIndex((f) => f.m.slug === m.slug && f.p.slug === current.slug);
  const prev = flat[flatIndex - 1];
  const next = flat[flatIndex + 1];
  const href = (f: { m: MaterialData; p: { slug: string } }) => `/materi/${f.m.slug}/${f.p.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-14">
      <Link to="/" className="text-sm font-semibold underline underline-offset-4">
        Beranda
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* sidebar: layar lebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
            <p className="m-0 mb-3 text-lg font-extrabold leading-tight">{m.title}</p>
            <PageList m={m} current={pageIndex} />
          </div>
        </aside>

        {/* daftar halaman: layar sempit. key membuatnya menutup lagi setelah pindah halaman */}
        <details key={current.slug} className="border border-ink lg:hidden">
          <summary className="cursor-pointer p-3 font-semibold">
            Halaman {pageIndex + 1} dari {m.pages.length}: {current.title}
          </summary>
          <div className="border-t border-ink p-2">
            <PageList m={m} current={pageIndex} />
          </div>
        </details>

        <article className="min-w-0">
          <p className="m-0 text-sm text-ink/70">
            {m.title}, halaman {pageIndex + 1} dari {m.pages.length}
          </p>
          <h1 className="mb-8 mt-2 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-tight">
            {current.title}
          </h1>

          <Blocks blocks={current.blocks} />

          <nav
            aria-label="Pindah halaman"
            className="mt-16 grid gap-4 border-t border-ink pt-8 md:grid-cols-2"
          >
            {prev ? (
              <Link
                to={href(prev)}
                className="border border-ink p-5 transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="block text-sm">
                  Sebelumnya{prev.m.slug !== m.slug ? `, ${prev.m.title}` : ""}
                </span>
                <span className="text-xl font-bold">{prev.p.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={href(next)}
                className="border border-ink p-5 transition-colors hover:bg-ink hover:text-paper md:text-right"
              >
                <span className="block text-sm">
                  Berikutnya{next.m.slug !== m.slug ? `, ${next.m.title}` : ""}
                </span>
                <span className="text-xl font-bold">{next.p.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}