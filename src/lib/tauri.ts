import { invoke } from "@tauri-apps/api/core";

/** true kalau halaman berjalan di dalam jendela Tauri, false kalau di browser biasa */
export const isDesktop = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/** Panggil command Rust. Di versi web akan melempar error yang jelas. */
export async function call<T = void>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T> {
  if (!isDesktop()) {
    throw new Error("Fitur ini hanya tersedia di aplikasi desktop.");
  }
  return invoke<T>(command, args);
}