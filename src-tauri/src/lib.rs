use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Duration;

use serde::Serialize;
use tauri::{AppHandle, Emitter, State};

// ---------- State bersama untuk telemetri ----------
// Tiap start menaikkan angka ini. Thread lama berhenti sendiri
// begitu angkanya tidak lagi sama dengan id miliknya.
#[derive(Default)]
struct Telemetry(Arc<AtomicU64>);

#[derive(Clone, Serialize)]
struct Sample {
    t: f64,
    altitude: f64,
}

#[derive(Serialize)]
struct Info {
    os: String,
    arch: String,
    version: String,
}

// ---------- Command: dipanggil frontend, mengembalikan hasil ----------
#[tauri::command]
fn app_info() -> Info {
    Info {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }
}

// Hanya tiga perintah git yang diizinkan. Jangan pernah menjalankan
// string perintah dari frontend secara langsung.
#[tauri::command]
fn git_run(repo: String, action: String) -> Result<String, String> {
    if repo.trim().is_empty() || repo.starts_with('-') {
        return Err("Lokasi repository tidak valid".into());
    }

    let args: Vec<&str> = match action.as_str() {
        "status" => vec!["status", "--short", "--branch"],
        "log" => vec!["log", "--oneline", "--graph", "-n", "15"],
        "branch" => vec!["branch", "-vv"],
        _ => return Err(format!("Perintah '{action}' tidak diizinkan")),
    };

    let output = Command::new("git")
        .arg("-C")
        .arg(&repo)
        .args(&args)
        .output()
        .map_err(|e| format!("Gagal menjalankan git: {e}"))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim_end().to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).trim_end().to_string())
    }
}

// ---------- Event: Rust mengirim data terus-menerus ke frontend ----------
#[tauri::command]
fn start_telemetry(app: AppHandle, state: State<'_, Telemetry>) {
    let counter = state.0.clone();
    let my_id = counter.fetch_add(1, Ordering::SeqCst) + 1;

    thread::spawn(move || {
        let mut t = 0.0_f64;
        while counter.load(Ordering::SeqCst) == my_id {
            let altitude = 500.0 + 400.0 * (t * 0.35).sin() + 60.0 * (t * 1.7).sin();
            let _ = app.emit("telemetry", Sample { t, altitude });
            t += 0.25;
            thread::sleep(Duration::from_millis(250));
        }
    });
}

#[tauri::command]
fn stop_telemetry(state: State<'_, Telemetry>) {
    state.0.fetch_add(1, Ordering::SeqCst);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Telemetry::default())
        .invoke_handler(tauri::generate_handler![
            app_info,
            git_run,
            start_telemetry,
            stop_telemetry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}