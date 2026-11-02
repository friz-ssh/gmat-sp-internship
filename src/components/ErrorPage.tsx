import { Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan yang tidak dikenal.";

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="m-0 text-4xl font-extrabold">Halaman ini gagal dimuat</h1>
      <p className="mt-4">Pesan error:</p>
      <pre className="overflow-x-auto border border-ink bg-ink p-4 font-mono text-sm text-paper">
        {message}
      </pre>
      <p className="mt-6">
        <Link to="/" className="font-semibold underline underline-offset-4">
          Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}