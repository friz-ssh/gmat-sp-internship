export type DemoId = "git" | "tauri" | "chartlab" | "map";

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string }
  | { t: "code"; file: string; lang: string; code: string }
  | { t: "demo"; id: DemoId };

export type Page = { slug: string; title: string; blocks: Block[] };

export type MaterialData = {
  slug: string;
  title: string;
  summary: string;
  demoLabel: string;
  pages: Page[];
};

// Pembantu supaya penulisan konten ringkas. Teks di antara tanda ` akan tampil sebagai kode.
const p = (text: string): Block => ({ t: "p", text });
const h = (text: string): Block => ({ t: "h", text });
const ul = (...items: string[]): Block => ({ t: "ul", items });
const ol = (...items: string[]): Block => ({ t: "ol", items });
const note = (text: string): Block => ({ t: "note", text });
const code = (file: string, body: string, lang = "bash"): Block => ({
  t: "code",
  file,
  lang,
  code: body,
});
const demo = (id: DemoId): Block => ({ t: "demo", id });

export const materials: MaterialData[] = [
  // ───────────────────────── GIT ─────────────────────────
  {
    slug: "git",
    title: "Version control dengan Git",
    summary:
      "Dari konsep dasar sampai alur kerja tim: commit, branch, merge, rebase, membatalkan perubahan, dan pull request.",
    demoLabel: "Jalankan git lewat Rust",
    pages: [
      {
        slug: "konsep",
        title: "Kenapa butuh version control",
        blocks: [
          p("Banyak orang mengubah kode yang sama dalam waktu yang sama. Tanpa version control, file saling menimpa, tidak ada cara kembali ke versi yang masih jalan, dan tidak ada yang tahu siapa mengubah apa."),
          p("Git adalah sistem version control terdistribusi. Setiap orang punya salinan lengkap riwayat proyek di komputernya, jadi hampir semua operasi berjalan offline dan cepat."),
          h("Istilah dasar"),
          ul(
            "`Repository` (repo): folder proyek beserta seluruh riwayatnya, disimpan di folder tersembunyi `.git`.",
            "`Commit`: potret (snapshot) proyek pada satu waktu, lengkap dengan pesan, penulis, dan ID unik berupa hash.",
            "`Branch`: jalur pengembangan terpisah. Sebenarnya hanya penunjuk ke sebuah commit.",
            "`HEAD`: penunjuk ke posisi yang sedang kamu kerjakan, biasanya ujung dari sebuah branch.",
            "`Remote`: salinan repo di server, misalnya GitHub. Remote utama biasanya bernama `origin`.",
          ),
          note("Git bukan GitHub. Git adalah alat di komputermu. GitHub dan GitLab adalah layanan yang menyimpan repo di server dan menambahkan fitur seperti pull request dan review."),
        ],
      },
      {
        slug: "setup",
        title: "Instalasi dan konfigurasi awal",
        blocks: [
          p("Cek dulu apakah Git sudah terpasang dengan `git --version`. Di Fedora pasang lewat `sudo dnf install git`. Di Windows pasang Git for Windows, lalu jalankan perintah di Git Bash."),
          h("Identitas dan pengaturan dasar"),
          code(
            "terminal",
            `git config --global user.name "Nama Kamu"
git config --global user.email "kamu@email.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # opsional: pakai VS Code
git config --global pull.rebase false           # pull = fetch + merge
git config --list --show-origin                 # cek hasilnya`,
          ),
          note("Nama dan email ini tertulis di setiap commit. Pakai email yang sama dengan akun GitHub supaya kontribusimu tercatat."),
          h("Login ke GitHub dengan SSH"),
          code(
            "terminal",
            `ssh-keygen -t ed25519 -C "kamu@email.com"
cat ~/.ssh/id_ed25519.pub    # salin hasilnya, tempel di GitHub: Settings, SSH and GPG keys
ssh -T git@github.com        # tes koneksi`,
          ),
        ],
      },
      {
        slug: "siklus-commit",
        title: "Siklus dasar: add dan commit",
        blocks: [
          p("Git membagi pekerjaanmu ke tiga area. Memahami ini menjelaskan hampir semua perintah dasar."),
          code(
            "tiga area",
            `working directory  --git add-->  staging area  --git commit-->  repository
(file yang kamu edit)       (calon isi commit)           (riwayat tersimpan)`,
            "text",
          ),
          code(
            "terminal",
            `git init                          # mulai repo baru di folder ini
git status                        # apa yang berubah?
git add src/App.tsx               # stage satu file
git add -p                        # stage per potongan perubahan
git diff                          # perubahan yang belum di-stage
git diff --staged                 # perubahan yang sudah di-stage
git commit -m "Tambah halaman peta"
git log --oneline --graph --decorate -n 15
git show <hash>                   # isi satu commit`,
          ),
          h("File yang tidak boleh masuk repo"),
          p("Dependensi, hasil build, dan rahasia seperti kunci API tidak boleh di-commit. Daftarkan di file `.gitignore` di root proyek."),
          code(
            ".gitignore",
            `node_modules/
dist/
src-tauri/target/
.env
*.log
.DS_Store`,
            "text",
          ),
          note("`git add .` memasukkan semuanya sekaligus dan mudah membawa file yang tidak sengaja. Biasakan menjalankan `git status` sebelum `git commit`."),
        ],
      },
      {
        slug: "branch-merge",
        title: "Branch, merge, dan konflik",
        blocks: [
          p("Branch memungkinkan kamu mengerjakan fitur tanpa mengganggu branch utama. Membuat branch di Git murah dan cepat, jadi biasakan satu fitur satu branch."),
          code(
            "terminal",
            `git branch                        # daftar branch lokal
git switch -c fitur/peta          # buat branch baru dan pindah ke sana
git switch main                   # pindah kembali
git branch -d fitur/peta          # hapus branch yang sudah digabung`,
          ),
          h("Menggabungkan branch"),
          code(
            "terminal",
            `git switch main
git merge fitur/peta`,
          ),
          p("Hasilnya ada dua kemungkinan. Pada `fast-forward`, main belum berubah sejak branch dibuat, sehingga penunjuk main cukup digeser. Pada `merge commit`, kedua jalur punya commit baru, sehingga Git membuat satu commit penggabungan. Opsi `--no-ff` memaksa merge commit selalu dibuat."),
          h("Menyelesaikan konflik"),
          p("Konflik terjadi saat dua branch mengubah baris yang sama. Git berhenti dan menandai bagian yang bertabrakan di dalam file."),
          code(
            "src/lib/map.ts",
            `<<<<<<< HEAD
const zoom = 15;
=======
const zoom = 17;
>>>>>>> fitur/peta`,
            "text",
          ),
          ol(
            "Jalankan `git status` untuk melihat file mana yang konflik.",
            "Buka file, putuskan versi mana yang dipakai (atau gabungkan keduanya), lalu hapus ketiga penanda.",
            "Tandai selesai dengan `git add <file>`.",
            "Selesaikan dengan `git merge --continue` (atau `git commit`).",
          ),
          code(
            "terminal",
            `git merge --abort                 # menyerah dan kembali ke kondisi sebelum merge`,
          ),
        ],
      },
      {
        slug: "remote",
        title: "Remote dan kolaborasi",
        blocks: [
          p("Remote menghubungkan repo lokalmu dengan repo di server. Dari sinilah anggota tim saling bertukar pekerjaan."),
          code(
            "terminal",
            `git clone git@github.com:gmat/proyek.git       # salin repo dari server
git remote -v                                  # lihat remote yang terpasang
git remote add origin git@github.com:gmat/proyek.git   # untuk repo dari git init
git push -u origin main                        # push pertama + set upstream
git fetch origin                               # ambil info terbaru, file kamu belum berubah
git pull                                       # fetch + merge ke branch saat ini
git push                                       # kirim commit lokal ke server`,
          ),
          p("Bedanya: `git fetch` hanya mengunduh data terbaru dari remote tanpa menyentuh file kerjamu. `git pull` melakukan fetch lalu langsung menggabungkannya ke branch aktif."),
          h("Alur pull request"),
          ol(
            "Perbarui main: `git switch main` lalu `git pull`.",
            "Buat branch dari main: `git switch -c fitur/nama-fitur`.",
            "Kerjakan dengan commit-commit kecil yang masing-masing punya satu tujuan.",
            "Push branch: `git push -u origin fitur/nama-fitur`, lalu buka pull request di GitHub.",
            "Reviewer memberi komentar. Perbaiki dengan commit baru di branch yang sama, lalu push lagi.",
            "Setelah disetujui, branch digabung ke main. Hapus branch yang sudah selesai.",
          ),
          note("Kalau push ditolak karena remote punya commit yang belum kamu punya, jalankan `git pull` dulu, selesaikan konflik jika ada, baru push lagi."),
        ],
      },
      {
        slug: "rebase",
        title: "Rebase dan merapikan riwayat",
        blocks: [
          p("Rebase memindahkan commit-commit branchmu ke ujung branch lain, sehingga riwayat tampak lurus seolah kamu baru mulai bekerja dari titik terbaru."),
          code(
            "ilustrasi",
            `sebelum:   main:   A---B---C
                        \\
           fitur:        D---E

sesudah rebase ke main:
           main:   A---B---C
                            \\
           fitur:            D'---E'`,
            "text",
          ),
          code(
            "terminal",
            `git switch fitur/peta
git fetch origin
git rebase origin/main
# ada konflik? selesaikan file-nya, lalu:
git add <file>
git rebase --continue
git rebase --abort                # batalkan seluruh rebase`,
          ),
          note("Aturan emas: jangan rebase commit yang sudah dipush dan dipakai orang lain. Rebase menulis ulang commit (hash-nya berubah). Kalau perlu push ulang branch pribadi setelah rebase, pakai `git push --force-with-lease`, bukan `--force`."),
          h("Merge atau rebase?"),
          ul(
            "Merge menjaga riwayat apa adanya dan aman untuk branch yang dipakai bersama.",
            "Rebase menghasilkan riwayat yang rapi. Pakai untuk membereskan branch pribadi sebelum membuka pull request.",
            "Ikuti kebiasaan tim. Kalau ragu, tanyakan sebelum memilih.",
          ),
          h("Merapikan commit dengan rebase interaktif"),
          code(
            "terminal",
            `git rebase -i HEAD~3              # edit 3 commit terakhir`,
          ),
          code(
            "editor yang terbuka",
            `pick   1a2b3c4 Tambah peta
squash 5d6e7f8 Perbaiki typo
reword 9a0b1c2 tambah marker`,
            "text",
          ),
          p("`pick` mempertahankan commit apa adanya, `squash` melebur commit ke commit di atasnya, dan `reword` mengubah pesan commit."),
        ],
      },
      {
        slug: "membatalkan",
        title: "Membatalkan dan menyelamatkan perubahan",
        blocks: [
          p("Hampir semua kesalahan di Git bisa diperbaiki. Kuncinya memilih alat yang sesuai dengan posisi perubahan itu."),
          ul(
            "Buang perubahan di file yang belum di-stage: `git restore <file>`.",
            "Batalkan `git add`: `git restore --staged <file>`.",
            "Ubah commit terakhir yang belum dipush: `git commit --amend`.",
            "Mundurkan commit tapi simpan perubahannya: `git reset --soft HEAD~1` atau `--mixed`.",
            "Batalkan commit yang sudah dipush: `git revert <hash>`, yang membuat commit baru berisi kebalikannya.",
          ),
          code(
            "terminal",
            `git restore src/App.tsx            # buang perubahan yang belum di-stage
git restore --staged src/App.tsx   # batalkan git add
git commit --amend -m "Pesan yang benar"
git reset --soft HEAD~1            # commit batal, perubahan tetap ter-stage
git reset --mixed HEAD~1           # commit batal, perubahan tetap di file
git revert 3f9a1c2                 # aman untuk commit yang sudah dibagikan`,
          ),
          h("Menyimpan pekerjaan setengah jadi"),
          code(
            "terminal",
            `git stash push -m "setengah jadi"
git stash list
git stash pop                      # kembalikan dan hapus dari daftar stash`,
          ),
          h("Menyelamatkan commit yang hilang"),
          code(
            "terminal",
            `git reflog                         # riwayat posisi HEAD, termasuk commit yang "hilang"
git switch -c selamatkan <hash>    # buat branch dari commit yang ketemu`,
          ),
          note("`git reset --hard` dan `git clean -fd` menghapus perubahan yang belum di-commit dan tidak bisa dikembalikan. Commit yang sudah ada masih bisa diselamatkan lewat `git reflog`."),
        ],
      },
      {
        slug: "konvensi",
        title: "Konvensi tim",
        blocks: [
          p("Git tidak memaksa aturan apa pun, jadi tim yang menyepakatinya. Konvensi yang konsisten membuat riwayat mudah dibaca dan review lebih cepat."),
          h("Nama branch"),
          ul(
            "`fitur/grafik-telemetri` untuk fitur baru.",
            "`perbaikan/marker-hilang` untuk memperbaiki bug.",
            "`dokumentasi/panduan-setup` untuk dokumentasi.",
          ),
          h("Pesan commit"),
          p("Baris pertama singkat (sekitar 50 karakter) dan berupa kalimat perintah. Jelaskan alasannya di badan pesan, bukan hanya apa yang berubah. Banyak tim memakai awalan Conventional Commits seperti `feat`, `fix`, `docs`, `refactor`, dan `chore`."),
          code(
            "contoh pesan commit",
            `feat: tambah grafik telemetri

Data diambil dari event Tauri setiap 250 ms.
Dibutuhkan agar tim bisa memantau ketinggian secara langsung.`,
            "text",
          ),
          h("Pull request yang baik"),
          ul(
            "Kecil dan fokus pada satu tujuan, supaya mudah direview.",
            "Deskripsi menjelaskan apa yang berubah dan kenapa. Sertakan tangkapan layar untuk perubahan tampilan.",
            "Sudah dijalankan dan dicoba sendiri sebelum diminta review.",
          ),
          h("Tag untuk rilis"),
          code(
            "terminal",
            `git tag v1.0.0
git push origin v1.0.0`,
          ),
          note("Jangan pernah meng-commit rahasia seperti kata sandi atau kunci API. Kalau terlanjur, anggap kuncinya bocor: cabut atau ganti dulu, baru bersihkan riwayatnya."),
        ],
      },
      {
        slug: "troubleshooting",
        title: "Masalah yang sering muncul",
        blocks: [
          h("Detached HEAD"),
          p("Kamu sedang berada di sebuah commit, bukan di ujung branch. Kalau ingin menyimpan pekerjaanmu di sini, buat branch. Kalau tidak, pindah saja ke branch lain."),
          code(
            "terminal",
            `git switch -c nama-branch-baru     # simpan posisi ini sebagai branch
git switch main                    # atau kembali ke branch biasa`,
          ),
          h("Push ditolak (rejected, non-fast-forward)"),
          p("Remote punya commit yang belum ada di lokalmu. Ambil dulu, gabungkan, lalu push."),
          code(
            "terminal",
            `git pull
git push`,
          ),
          h("Commit di branch yang salah (belum dipush)"),
          code(
            "terminal",
            `git branch fitur/benar             # buat branch di commit saat ini
git reset --hard HEAD~1            # mundurkan branch yang salah (hati-hati)
git switch fitur/benar`,
          ),
          h("Ingin membatalkan merge yang sedang konflik"),
          code(
            "terminal",
            `git merge --abort
git rebase --abort`,
          ),
          h("Lupa branch mana yang sedang aktif"),
          code(
            "terminal",
            `git status -sb                     # ringkas: branch dan perubahan
git branch -vv                     # semua branch beserta upstream-nya`,
          ),
        ],
      },
      {
        slug: "cheatsheet",
        title: "Cheat sheet perintah",
        blocks: [
          code(
            "mulai",
            `git clone <url>                  salin repo
git init                         mulai repo baru
git status                       lihat perubahan`,
            "text",
          ),
          code(
            "rekam",
            `git add <file>                   stage file
git add -p                       stage per potongan
git commit -m "pesan"            rekam commit
git diff / git diff --staged     lihat perbedaan
git log --oneline --graph        riwayat singkat`,
            "text",
          ),
          code(
            "branch",
            `git switch -c <nama>             buat dan pindah branch
git switch <nama>                pindah branch
git merge <nama>                 gabungkan ke branch aktif
git rebase <dasar>               pindahkan commit ke ujung <dasar>
git branch -d <nama>             hapus branch`,
            "text",
          ),
          code(
            "remote",
            `git fetch                        ambil info terbaru
git pull                         fetch + merge
git push                         kirim commit
git push -u origin <nama>        push pertama + set upstream`,
            "text",
          ),
          code(
            "batalkan",
            `git restore <file>               buang perubahan file
git restore --staged <file>      batalkan git add
git commit --amend               ubah commit terakhir
git revert <hash>                batalkan commit dengan commit baru
git stash / git stash pop        simpan dan kembalikan sementara
git reflog                       cari commit yang hilang`,
            "text",
          ),
        ],
      },
      {
        slug: "demo",
        title: "Coba git lewat Rust",
        blocks: [
          p("Demo ini memanggil command Rust yang menjalankan perintah git di komputermu, lalu menampilkan hasilnya. Hanya tiga perintah bacaan yang diizinkan: `status`, `log`, dan `branch`. Menjalankan perintah sembarang dari frontend berbahaya, jadi daftarnya dibatasi di sisi Rust."),
          demo("git"),
          note("Di versi web, demo menampilkan contoh output karena browser tidak bisa menjalankan proses di komputermu. Di aplikasi desktop, isi lokasi repo dengan `.` lalu pilih perintahnya."),
        ],
      },
    ],
  },

  // ───────────────────────── TAURI ─────────────────────────
  {
    slug: "tauri",
    title: "Framework Tauri",
    summary:
      "Membuat aplikasi desktop dengan antarmuka web dan backend Rust, lengkap dengan cara keduanya berkomunikasi.",
    demoLabel: "Telemetri dari Rust ke grafik",
    pages: [
      {
        slug: "pengantar",
        title: "Apa itu Tauri",
        blocks: [
          p("Tauri adalah framework untuk membuat aplikasi desktop dengan UI dari HTML, CSS, dan JavaScript, dan inti aplikasi yang ditulis dengan Rust."),
          p("Tauri memakai webview bawaan sistem operasi dan tidak membawa Chromium sendiri, sehingga ukuran aplikasinya kecil. Di Linux webview-nya WebKitGTK, di Windows WebView2, dan di macOS WKWebView."),
          h("Dua sisi dalam satu aplikasi"),
          ul(
            "Frontend berjalan di webview. Di proyek ini isinya React dan TypeScript.",
            "Core Rust berjalan sebagai proses native yang boleh mengakses file, proses, dan perangkat.",
          ),
          code(
            "struktur project",
            `gmat-intern-hub/
├─ src/               frontend (React + TypeScript)
├─ src-tauri/
│  ├─ src/lib.rs      command dan event Rust
│  ├─ tauri.conf.json konfigurasi jendela dan keamanan
│  ├─ capabilities/   izin yang diberikan ke frontend
│  └─ Cargo.toml      dependensi Rust
└─ package.json       dependensi frontend`,
            "text",
          ),
          code(
            "terminal",
            `npm run tauri dev       # jalankan aplikasi dengan hot reload
npm run dev             # hanya frontend di browser`,
          ),
        ],
      },
      {
        slug: "command",
        title: "Command: frontend memanggil Rust",
        blocks: [
          p("Command adalah fungsi Rust yang bisa dipanggil dari frontend. Cocok untuk permintaan sekali jalan yang menunggu hasil, seperti membaca file atau menjalankan perintah."),
          code(
            "src-tauri/src/lib.rs",
            `#[tauri::command]
fn salam(nama: String) -> String {
    format!("Halo, {nama}!")
}

// daftarkan di Builder:
// .invoke_handler(tauri::generate_handler![salam])`,
            "rust",
          ),
          code(
            "src/App.tsx",
            `import { invoke } from "@tauri-apps/api/core";

const pesan = await invoke<string>("salam", { nama: "Intern" });
console.log(pesan); // Halo, Intern!`,
            "ts",
          ),
          h("Menangani error"),
          p("Command yang mengembalikan `Result<T, String>` akan melempar error di sisi JavaScript saat hasilnya `Err`. Tangkap dengan `try/catch` di frontend."),
          code(
            "src-tauri/src/lib.rs",
            `#[tauri::command]
fn bagi(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("Pembagi tidak boleh nol".into());
    }
    Ok(a / b)
}`,
            "rust",
          ),
          note("Nama argumen di JavaScript memakai camelCase (`namaFile`), sedangkan di Rust memakai snake_case (`nama_file`). Tauri mengubahnya otomatis."),
        ],
      },
      {
        slug: "event",
        title: "Event: Rust mengirim data terus-menerus",
        blocks: [
          p("Command cocok untuk tanya-jawab. Untuk data yang mengalir terus seperti telemetri sensor, pakai event. Rust mengirim pesan kapan pun ia mau, dan frontend mendengarkannya."),
          code(
            "Rust: kirim event",
            `use tauri::Emitter;

app.emit("telemetry", 42.0).unwrap();`,
            "rust",
          ),
          code(
            "TypeScript: dengarkan event",
            `import { listen } from "@tauri-apps/api/event";

const off = await listen<number>("telemetry", (e) => {
  console.log(e.payload);
});
off(); // berhenti mendengarkan`,
            "ts",
          ),
          p("Demo di bawah mengalirkan data ketinggian simulasi dari thread Rust ke grafik ECharts setiap 250 ms. Di versi web, sumber datanya diganti timer JavaScript, jadi tampilannya sama."),
          demo("tauri"),
        ],
      },
      {
        slug: "keamanan",
        title: "Keamanan dan capabilities",
        blocks: [
          p("Frontend tidak boleh menjalankan perintah sistem sembarangan. Semua akses lewat command yang kamu daftarkan sendiri, dan di Tauri v2 hak aksesnya diatur lagi lewat capabilities."),
          code(
            "src-tauri/capabilities/default.json",
            `{
  "identifier": "default",
  "description": "Izin untuk jendela utama",
  "windows": ["main"],
  "permissions": ["core:default", "opener:default"]
}`,
            "json",
          ),
          h("Batasi apa yang bisa dijalankan"),
          p("Jangan buat command yang menerima string perintah dari frontend lalu langsung menjalankannya. Terima pilihan dari daftar yang sudah ditentukan, seperti pada demo Git."),
          code(
            "src-tauri/src/lib.rs",
            `let args: Vec<&str> = match action.as_str() {
    "status" => vec!["status", "--short"],
    "log" => vec!["log", "--oneline", "-n", "15"],
    _ => return Err("Perintah tidak diizinkan".into()),
};`,
            "rust",
          ),
          note("Kalau kamu menambahkan fitur yang memuat konten dari luar, kencangkan `csp` di `tauri.conf.json`. Selama pengembangan nilainya `null` supaya semua sumber bisa dimuat."),
        ],
      },
      {
        slug: "build",
        title: "Build dan distribusi",
        blocks: [
          code(
            "terminal",
            `npm run tauri build     # installer ada di src-tauri/target/release/bundle/
npm run build           # build web statis ke folder dist/ untuk di-hosting`,
          ),
          p("Hasil build bergantung pada sistem operasi tempat kamu menjalankannya: di Linux biasanya paket `.deb`, `.rpm`, dan `AppImage`; di Windows `.msi` atau `.exe`; di macOS `.dmg`. Untuk membuat installer sistem operasi lain, build di mesin tersebut atau pakai CI seperti GitHub Actions."),
          p("Karena frontend situs ini hanya Vite dan React biasa, build web yang sama bisa di-hosting di GitHub Pages atau Vercel. Bagian yang memakai Rust otomatis jatuh ke mode contoh."),
        ],
      },
    ],
  },

  // ───────────────────────── ECHARTS ─────────────────────────
  {
    slug: "echarts",
    title: "Grafik dengan ECharts",
    summary:
      "Dari konsep option sampai 31 jenis chart yang bisa kamu edit langsung, lengkap dengan interaksi dan data real-time.",
    demoLabel: "Galeri 31 jenis chart yang bisa diedit",
    pages: [
      {
        slug: "konsep",
        title: "Konsep dasar: satu objek option",
        blocks: [
          p("Di ECharts kamu tidak menggambar, kamu mendeskripsikan hasilnya. Semua grafik dikendalikan oleh satu objek `option`, dan ECharts yang mengurus penggambarannya."),
          h("Bagian-bagian option yang paling sering dipakai"),
          ul(
            "`series`: jenis dan data grafik (`line`, `bar`, `pie`, dan seterusnya).",
            "`xAxis` dan `yAxis`: sumbu untuk grafik berkoordinat kartesius.",
            "`tooltip`: kotak informasi saat kursor diarahkan ke data.",
            "`legend`: daftar seri yang bisa dinyalakan atau dimatikan.",
            "`grid`: ukuran area plot di dalam kanvas.",
            "`dataset`: tabel data yang dipakai bersama beberapa seri.",
            "`visualMap`: pemetaan nilai ke warna atau ukuran, dipakai di heatmap.",
            "`dataZoom`: zoom dan geser data di sumbu.",
          ),
          code(
            "contoh minimal",
            `import * as echarts from "echarts";

const chart = echarts.init(document.getElementById("chart"));

chart.setOption({
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["Sen", "Sel", "Rab"] },
  yAxis: { type: "value" },
  series: [{ type: "line", data: [150, 230, 224] }],
});`,
            "ts",
          ),
          note("Container grafik harus punya tinggi yang jelas. Kalau tingginya nol, grafik tidak akan terlihat."),
        ],
      },
      {
        slug: "react",
        title: "Memakai ECharts di React",
        blocks: [
          p("Siklus hidupnya empat langkah: buat instance dengan `echarts.init` di effect, panggil `setOption` setiap data berubah, panggil `resize` saat ukuran container berubah, dan panggil `dispose` saat komponen dilepas."),
          p("Bungkus keempatnya dalam satu komponen supaya bisa dipakai ulang."),
          code(
            "src/components/Chart.tsx",
            `import { useEffect, useRef } from "react";
import * as echarts from "echarts";

type Props = { option: echarts.EChartsOption; className?: string };

export function Chart({ option, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const c = echarts.init(el.current!);
    chart.current = c;
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(el.current!);
    return () => {
      ro.disconnect();
      c.dispose();
      chart.current = null;
    };
  }, []);

  useEffect(() => {
    chart.current?.setOption(option, true);
  }, [option]);

  return <div ref={el} className={className} />;
}`,
            "tsx",
          ),
          note("Bungkus `option` dengan `useMemo` kalau dibuat di dalam komponen. Objek baru di setiap render akan memicu `setOption` terus-menerus."),
        ],
      },
      {
        slug: "galeri",
        title: "Galeri chart yang bisa diedit",
        blocks: [
          p("Pilih jenis chart di daftar, lihat hasilnya, lalu ubah kodenya. Grafik diperbarui otomatis sesaat setelah kamu berhenti mengetik. Kalau kodenya error, pesan error tampil di bawah editor dan grafik terakhir yang valid tetap bertahan."),
          p("Beberapa contoh membangkitkan data acak dengan fungsi `rand(seed)`, supaya hasilnya selalu sama setiap kali dimuat. Di proyek nyata, ganti dengan datamu sendiri."),
          demo("chartlab"),
          note("Galeri ini mencakup 31 jenis chart yang umum dipakai, bukan seluruh contoh di galeri resmi ECharts. Chart peta geografis butuh file GeoJSON, jadi untuk peta pakai Leaflet. Chart 3D butuh paket tambahan `echarts-gl`."),
        ],
      },
      {
        slug: "memilih-chart",
        title: "Memilih jenis chart",
        blocks: [
          p("Mulai dari pertanyaan yang ingin dijawab data, bukan dari chart yang kelihatan keren."),
          ul(
            "Membandingkan nilai antar kategori: `bar`, atau `pictorialBar` untuk tampilan simbol.",
            "Tren dari waktu ke waktu: `line`, dengan `areaStyle` kalau ingin menekankan volume.",
            "Bagian dari keseluruhan: `pie` atau donat untuk sedikit kategori, `treemap` atau `sunburst` kalau bertingkat.",
            "Hubungan dua variabel: `scatter`, dan tambahkan ukuran titik untuk variabel ketiga (bubble).",
            "Sebaran data: `boxplot`. Perubahan harga atau rentang: `candlestick`.",
            "Kepadatan atau intensitas: `heatmap`, termasuk versi kalender.",
            "Perbandingan banyak dimensi sekaligus: `radar` dan `parallel`.",
            "Aliran dari satu tahap ke tahap lain: `sankey` dan `funnel`.",
            "Struktur dan relasi: `tree` untuk hierarki, `graph` untuk jaringan.",
            "Satu angka terhadap targetnya: `gauge`.",
          ),
          note("Pie dengan lebih dari sekitar enam irisan sulit dibaca. Untuk banyak kategori, bar yang diurutkan hampir selalu lebih jelas."),
        ],
      },
      {
        slug: "dataset",
        title: "Dataset dan encode",
        blocks: [
          p("Alih-alih menaruh data di tiap seri, simpan data sekali di `dataset` lalu arahkan seri ke kolom yang dipakai lewat `encode`. Cara ini cocok kalau beberapa seri memakai tabel yang sama."),
          code(
            "dataset.ts",
            `chart.setOption({
  legend: {},
  tooltip: {},
  dataset: {
    source: [
      ["bulan", "Frontend", "Backend"],
      ["Agu", 12, 8],
      ["Sep", 18, 14],
      ["Okt", 22, 19],
    ],
  },
  xAxis: { type: "category" },
  yAxis: {},
  series: [
    { type: "bar", encode: { x: "bulan", y: "Frontend" } },
    { type: "bar", encode: { x: "bulan", y: "Backend" } },
  ],
});`,
            "ts",
          ),
          p("Baris pertama berisi nama kolom, dan `encode` menunjuk kolom dengan nama itu. Ganti isi `dataset.source` saat ada data baru, dan semua seri ikut berubah."),
        ],
      },
      {
        slug: "interaksi",
        title: "Interaksi dan event",
        blocks: [
          p("Banyak interaksi tersedia hanya dengan menambah satu properti di `option`."),
          ul(
            "`tooltip.trigger`: `\"item\"` untuk satu data, `\"axis\"` untuk semua seri di satu posisi sumbu.",
            "`dataZoom`: zoom dengan scroll mouse (`inside`) atau penggeser di bawah grafik (`slider`).",
            "`legend`: klik nama seri untuk menyembunyikannya.",
            "`toolbox`: tombol simpan gambar, zoom area, dan lihat data mentah.",
          ),
          code(
            "interaksi.ts",
            `chart.setOption({
  tooltip: { trigger: "axis" },
  toolbox: { feature: { saveAsImage: {}, dataView: {}, dataZoom: {} } },
  dataZoom: [{ type: "inside" }, { type: "slider" }],
  // ... xAxis, yAxis, series
});`,
            "ts",
          ),
          h("Menangkap event"),
          code(
            "event.ts",
            `chart.on("click", (params) => {
  console.log(params.name, params.value, params.seriesName);
});

// menyorot data lewat kode
chart.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: 2 });
chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: 2 });`,
            "ts",
          ),
        ],
      },
      {
        slug: "realtime",
        title: "Data real-time dan performa",
        blocks: [
          p("Untuk telemetri, simpan sejumlah titik terakhir saja dan perbarui seri setiap data baru masuk. Matikan animasi supaya grafik tidak bergetar."),
          code(
            "realtime.ts",
            `const MAX = 60;
const titik: [number, number][] = [];

function tambah(t: number, nilai: number) {
  titik.push([t, nilai]);
  if (titik.length > MAX) titik.shift();
  chart.setOption({ series: [{ data: titik }] });
}

chart.setOption({
  animation: false,
  xAxis: { type: "value", min: "dataMin", max: "dataMax" },
  yAxis: { type: "value" },
  series: [{ type: "line", showSymbol: false, data: [] }],
});`,
            "ts",
          ),
          h("Kalau datanya besar"),
          ul(
            "Aktifkan `sampling: \"lttb\"` di seri `line` untuk mengurangi titik tanpa merusak bentuk grafik.",
            "Pakai `large: true` di seri `scatter` atau `bar` untuk puluhan ribu titik.",
            "Matikan `animation` dan `showSymbol` saat data sering berubah.",
          ),
          h("Memperkecil ukuran bundle"),
          p("Mengimpor seluruh ECharts membuat bundel besar. Impor hanya yang dipakai."),
          code(
            "src/lib/echarts.ts",
            `import * as echarts from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export { echarts };`,
            "ts",
          ),
        ],
      },
    ],
  },

  // ───────────────────────── LEAFLET ─────────────────────────
  {
    slug: "leaflet",
    title: "Peta dengan Leaflet",
    summary:
      "Menampilkan peta interaktif, menaruh marker, menggambar lintasan, dan menghindari jebakan yang sering muncul.",
    demoLabel: "Klik peta untuk membuat lintasan",
    pages: [
      {
        slug: "konsep",
        title: "Konsep dan setup",
        blocks: [
          p("Leaflet adalah library peta yang ringan. Peta dibangun dari layer yang ditumpuk: tile layer (gambar peta dari server tile), lalu marker, polyline, dan lainnya di atasnya."),
          p("Koordinat selalu berurutan latitude lalu longitude, misalnya `[-7.7713, 110.3775]`."),
          code(
            "map.ts",
            `import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = L.map(element).setView([-7.7713, 110.3775], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);`,
            "ts",
          ),
          h("Di React"),
          code(
            "MapView.tsx",
            `useEffect(() => {
  const map = L.map(el.current!).setView([-7.7713, 110.3775], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  return () => {
    map.remove(); // wajib, supaya tidak error "map already initialized"
  };
}, []);`,
            "tsx",
          ),
        ],
      },
      {
        slug: "layer",
        title: "Marker, popup, dan lintasan",
        blocks: [
          code(
            "marker.ts",
            `const pin = L.divIcon({ className: "map-pin", iconSize: [14, 14] });

L.marker([-7.7713, 110.3775], { icon: pin })
  .addTo(map)
  .bindPopup("Titik awal");`,
            "ts",
          ),
          code(
            "lintasan.ts",
            `const titik: L.LatLngTuple[] = [
  [-7.7713, 110.3775],
  [-7.7690, 110.3790],
  [-7.7665, 110.3810],
];
L.polyline(titik, { color: "#000", weight: 2 }).addTo(map);
L.circle([-7.7713, 110.3775], { radius: 200 }).addTo(map);`,
            "ts",
          ),
          h("Mengelompokkan layer"),
          p("Kumpulkan layer yang berkaitan dalam `layerGroup`, supaya bisa dihapus atau digambar ulang sekaligus."),
          code(
            "group.ts",
            `const grup = L.layerGroup().addTo(map);
L.marker([-7.77, 110.37]).addTo(grup);
L.marker([-7.78, 110.38]).addTo(grup);

grup.clearLayers();   // hapus semuanya`,
            "ts",
          ),
        ],
      },
      {
        slug: "interaksi",
        title: "Event dan kontrol peta",
        blocks: [
          code(
            "interaksi.ts",
            `map.on("click", (e) => {
  console.log(e.latlng.lat, e.latlng.lng);
});

map.flyTo([-7.7956, 110.3695], 16);              // pindah dengan animasi
map.fitBounds(L.latLngBounds(titik));            // muat semua titik di layar

const meter = L.latLng(a).distanceTo(L.latLng(b)); // jarak dua titik`,
            "ts",
          ),
          p("`fitBounds` berguna untuk menampilkan seluruh lintasan tanpa kamu menghitung zoom sendiri. `distanceTo` menghitung jarak dalam meter."),
        ],
      },
      {
        slug: "jebakan",
        title: "Hal yang sering bikin peta rusak",
        blocks: [
          ul(
            "File CSS Leaflet wajib diimpor (`leaflet/dist/leaflet.css`). Tanpanya tile berantakan.",
            "Container peta wajib punya tinggi. Tanpa tinggi, petanya tidak terlihat.",
            "Ikon marker bawaan sering gagal dimuat di bundler seperti Vite. Pakai `L.divIcon` buatan sendiri.",
            "Panggil `map.remove()` saat komponen dilepas, kalau tidak muncul error peta sudah diinisialisasi.",
            "Atribusi OpenStreetMap wajib ditampilkan.",
            "Kontrol peta bisa menimpa header yang sticky. Beri container peta kelas `isolate` supaya z-index-nya terkurung.",
            "Tile butuh internet. Untuk peta offline, kamu perlu menyiapkan tile sendiri.",
          ),
        ],
      },
      {
        slug: "demo",
        title: "Coba: membuat lintasan",
        blocks: [
          p("Klik di peta untuk menambah titik. Garis putus-putus menghubungkan titik-titik itu, dan jarak totalnya dihitung dengan `distanceTo`."),
          demo("map"),
        ],
      },
    ],
  },
];