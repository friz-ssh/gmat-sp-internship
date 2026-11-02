export type ChartDef = { id: string; group: string; title: string; code: string };

/** Pembangkit angka acak dengan seed, supaya data contoh selalu sama. */
export function rand(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const CHARTS: ChartDef[] = [
  // ───────── Garis ─────────
  {
    group: "Garis",
    id: "line-basic",
    title: "Line dasar",
    code: `const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] },
  yAxis: { type: "value" },
  series: [{ type: "line", data: [150, 230, 224, 218, 135, 147, 260] }],
};`,
  },
  {
    group: "Garis",
    id: "line-smooth-area",
    title: "Line halus dengan area",
    code: `const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", boundaryGap: false, data: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] },
  yAxis: { type: "value" },
  series: [{
    type: "line",
    smooth: true,
    showSymbol: false,
    areaStyle: { opacity: 0.15 },
    data: [150, 230, 224, 218, 135, 147, 260],
  }],
};`,
  },
  {
    group: "Garis",
    id: "line-stacked",
    title: "Area bertumpuk",
    code: `const option = {
  tooltip: { trigger: "axis" },
  legend: { data: ["Frontend", "Backend", "Embedded"], bottom: 0 },
  grid: { bottom: 40 },
  xAxis: { type: "category", boundaryGap: false, data: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] },
  yAxis: { type: "value" },
  series: [
    { name: "Frontend", type: "line", stack: "total", areaStyle: {}, emphasis: { focus: "series" }, data: [120, 132, 101, 134, 90, 230, 210] },
    { name: "Backend", type: "line", stack: "total", areaStyle: {}, emphasis: { focus: "series" }, data: [220, 182, 191, 234, 290, 330, 310] },
    { name: "Embedded", type: "line", stack: "total", areaStyle: {}, emphasis: { focus: "series" }, data: [150, 232, 201, 154, 190, 330, 410] },
  ],
};`,
  },
  {
    group: "Garis",
    id: "line-step",
    title: "Line bertingkat (step)",
    code: `const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["00", "04", "08", "12", "16", "20"] },
  yAxis: { type: "value" },
  series: [{ type: "line", step: "middle", data: [10, 10, 40, 40, 25, 60] }],
};`,
  },
  {
    group: "Garis",
    id: "line-zoom",
    title: "Line dengan zoom data",
    code: `const r = rand(3);
const labels = [];
const values = [];
let v = 50;
for (let i = 0; i < 200; i++) {
  labels.push("t" + i);
  v += (r() - 0.5) * 10;
  values.push(Math.round(v * 10) / 10);
}

const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: labels },
  yAxis: { type: "value", scale: true },
  dataZoom: [{ type: "inside" }, { type: "slider" }],
  series: [{ type: "line", showSymbol: false, data: values }],
};`,
  },

  // ───────── Batang ─────────
  {
    group: "Batang",
    id: "bar-basic",
    title: "Bar dasar",
    code: `const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["Frontend", "Backend", "Embedded", "Data"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", barWidth: "45%", data: [40, 35, 25, 18] }],
};`,
  },
  {
    group: "Batang",
    id: "bar-stacked",
    title: "Bar bertumpuk",
    code: `const option = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { bottom: 0 },
  grid: { bottom: 40 },
  xAxis: { type: "category", data: ["Sen", "Sel", "Rab", "Kam", "Jum"] },
  yAxis: { type: "value" },
  series: [
    { name: "Selesai", type: "bar", stack: "tugas", data: [5, 7, 4, 8, 6] },
    { name: "Dikerjakan", type: "bar", stack: "tugas", data: [3, 2, 4, 1, 2] },
    { name: "Tertunda", type: "bar", stack: "tugas", data: [1, 0, 2, 1, 1] },
  ],
};`,
  },
  {
    group: "Batang",
    id: "bar-horizontal",
    title: "Bar horizontal",
    code: `const option = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  grid: { left: 90, right: 20 },
  xAxis: { type: "value" },
  yAxis: { type: "category", data: ["Leaflet", "ECharts", "Git", "Tauri", "React"] },
  series: [{ type: "bar", data: [12, 20, 28, 33, 45] }],
};`,
  },
  {
    group: "Batang",
    id: "bar-waterfall",
    title: "Bar waterfall",
    code: `const option = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  xAxis: { type: "category", data: ["Total", "Sewa", "Listrik", "Transport", "Makan", "Lain"] },
  yAxis: { type: "value" },
  series: [
    // seri pertama transparan: hanya sebagai "pengganjal"
    { type: "bar", stack: "w", silent: true, itemStyle: { color: "transparent" }, data: [0, 1700, 1400, 1200, 300, 0] },
    { type: "bar", stack: "w", data: [2900, 1200, 300, 200, 900, 300] },
  ],
};`,
  },
  {
    group: "Batang",
    id: "bar-polar",
    title: "Bar polar",
    code: `const option = {
  tooltip: {},
  polar: { radius: [20, "75%"] },
  angleAxis: { type: "category", data: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] },
  radiusAxis: {},
  series: [{ type: "bar", coordinateSystem: "polar", data: [3, 5, 4, 7, 6, 2, 4] }],
};`,
  },
  {
    group: "Batang",
    id: "pictorial-bar",
    title: "Pictorial bar",
    code: `const option = {
  tooltip: {},
  xAxis: { type: "category", data: ["Frontend", "Backend", "Embedded", "Data"] },
  yAxis: { splitLine: { show: false } },
  series: [{
    type: "pictorialBar",
    symbol: "rect",
    symbolRepeat: true,
    symbolSize: [24, 6],
    symbolMargin: 2,
    data: [12, 20, 15, 8],
  }],
};`,
  },

  // ───────── Pie ─────────
  {
    group: "Pie",
    id: "pie-basic",
    title: "Pie dasar",
    code: `const option = {
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  series: [{
    type: "pie",
    radius: "60%",
    data: [
      { name: "Frontend", value: 40 },
      { name: "Backend", value: 35 },
      { name: "Embedded", value: 25 },
    ],
  }],
};`,
  },
  {
    group: "Pie",
    id: "pie-donut",
    title: "Donat",
    code: `const option = {
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  series: [{
    type: "pie",
    radius: ["45%", "70%"], // angka pertama = lubang donat
    avoidLabelOverlap: false,
    itemStyle: { borderColor: "#eceeea", borderWidth: 2 },
    label: { show: false, position: "center" },
    emphasis: { label: { show: true, fontSize: 22, fontWeight: "bold" } },
    data: [
      { name: "Frontend", value: 40 },
      { name: "Backend", value: 35 },
      { name: "Embedded", value: 25 },
      { name: "Data", value: 18 },
    ],
  }],
};`,
  },
  {
    group: "Pie",
    id: "pie-rose",
    title: "Nightingale rose",
    code: `const option = {
  tooltip: { trigger: "item" },
  series: [{
    type: "pie",
    roseType: "area",
    radius: ["15%", "70%"],
    itemStyle: { borderRadius: 6 },
    data: [
      { name: "Git", value: 38 },
      { name: "Tauri", value: 30 },
      { name: "ECharts", value: 26 },
      { name: "Leaflet", value: 20 },
      { name: "React", value: 45 },
    ],
  }],
};`,
  },

  // ───────── Sebaran ─────────
  {
    group: "Sebaran",
    id: "scatter-basic",
    title: "Scatter dasar",
    code: `const r = rand(5);
const data = [];
for (let i = 0; i < 80; i++) {
  data.push([Math.round(r() * 100), Math.round(r() * 100)]);
}

const option = {
  tooltip: { trigger: "item" },
  xAxis: {},
  yAxis: {},
  series: [{ type: "scatter", symbolSize: 10, data }],
};`,
  },
  {
    group: "Sebaran",
    id: "scatter-bubble",
    title: "Bubble",
    code: `const r = rand(9);
const data = [];
for (let i = 0; i < 30; i++) {
  // [x, y, ukuran]
  data.push([Math.round(r() * 100), Math.round(r() * 100), 8 + Math.round(r() * 32)]);
}

const option = {
  tooltip: { trigger: "item" },
  xAxis: {},
  yAxis: {},
  series: [{
    type: "scatter",
    itemStyle: { opacity: 0.7 },
    symbolSize: (d) => d[2],
    data,
  }],
};`,
  },
  {
    group: "Sebaran",
    id: "effect-scatter",
    title: "Effect scatter",
    code: `const option = {
  xAxis: { min: 0, max: 100 },
  yAxis: { min: 0, max: 100 },
  series: [{
    type: "effectScatter",
    symbolSize: 14,
    rippleEffect: { brushType: "stroke", scale: 3 },
    data: [[20, 30], [50, 70], [80, 40]],
  }],
};`,
  },

  // ───────── Statistik ─────────
  {
    group: "Statistik",
    id: "radar",
    title: "Radar",
    code: `const option = {
  tooltip: {},
  legend: { data: ["Intern A", "Intern B"], bottom: 0 },
  radar: {
    indicator: [
      { name: "Git", max: 10 },
      { name: "Rust", max: 10 },
      { name: "React", max: 10 },
      { name: "Chart", max: 10 },
      { name: "Peta", max: 10 },
    ],
  },
  series: [{
    type: "radar",
    areaStyle: { opacity: 0.15 },
    data: [
      { name: "Intern A", value: [8, 5, 7, 6, 4] },
      { name: "Intern B", value: [5, 7, 6, 8, 6] },
    ],
  }],
};`,
  },
  {
    group: "Statistik",
    id: "candlestick",
    title: "Candlestick",
    code: `const option = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  yAxis: { scale: true },
  series: [{
    type: "candlestick",
    // tiap data: [buka, tutup, terendah, tertinggi]
    data: [[20, 34, 10, 38], [40, 35, 30, 50], [31, 38, 33, 44], [38, 15, 5, 42],
           [20, 28, 15, 34], [28, 25, 20, 36], [24, 39, 22, 41], [39, 33, 30, 45]],
    itemStyle: { color: "#000000", color0: "#ffffff", borderColor: "#000000", borderColor0: "#000000" },
  }],
};`,
  },
  {
    group: "Statistik",
    id: "boxplot",
    title: "Boxplot",
    code: `const option = {
  tooltip: { trigger: "item" },
  xAxis: { type: "category", data: ["Percobaan 1", "Percobaan 2", "Percobaan 3"] },
  yAxis: { type: "value", scale: true },
  series: [{
    type: "boxplot",
    // tiap data: [min, Q1, median, Q3, max]
    data: [[655, 850, 940, 980, 1175], [672, 800, 845, 885, 1012], [780, 840, 855, 880, 940]],
  }],
};`,
  },
  {
    group: "Statistik",
    id: "heatmap",
    title: "Heatmap",
    code: `const r = rand(7);
const hours = ["00", "03", "06", "09", "12", "15", "18", "21"];
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const data = [];
for (let d = 0; d < 7; d++) {
  for (let h = 0; h < 8; h++) data.push([h, d, Math.round(r() * 10)]);
}

const option = {
  tooltip: { position: "top" },
  grid: { left: 40, right: 16, top: 16, bottom: 56 },
  xAxis: { type: "category", data: hours, splitArea: { show: true } },
  yAxis: { type: "category", data: days, splitArea: { show: true } },
  visualMap: {
    min: 0, max: 10, calculable: true, orient: "horizontal", left: "center", bottom: 0,
    inRange: { color: ["#e6e8e3", "#000000"] },
  },
  series: [{ type: "heatmap", data }],
};`,
  },
  {
    group: "Statistik",
    id: "calendar",
    title: "Heatmap kalender",
    code: `const r = rand(11);
const data = [];
for (let d = 1; d <= 30; d++) {
  data.push(["2026-09-" + String(d).padStart(2, "0"), Math.round(r() * 10)]);
}

const option = {
  tooltip: {},
  visualMap: {
    min: 0, max: 10, orient: "horizontal", left: "center", bottom: 0,
    inRange: { color: ["#e6e8e3", "#ff4d00"] },
  },
  calendar: {
    range: "2026-09",
    cellSize: ["auto", 28],
    top: 40, left: 40, right: 40,
    yearLabel: { show: false },
  },
  series: [{ type: "heatmap", coordinateSystem: "calendar", data }],
};`,
  },

  // ───────── Alur dan indikator ─────────
  {
    group: "Alur dan indikator",
    id: "funnel",
    title: "Funnel",
    code: `const option = {
  tooltip: { trigger: "item", formatter: "{b}: {c}" },
  series: [{
    type: "funnel",
    left: "10%",
    width: "80%",
    sort: "descending",
    gap: 2,
    label: { position: "inside" },
    data: [
      { name: "Kunjungan", value: 100 },
      { name: "Daftar", value: 80 },
      { name: "Aktif", value: 60 },
      { name: "Bayar", value: 40 },
      { name: "Berlangganan", value: 20 },
    ],
  }],
};`,
  },
  {
    group: "Alur dan indikator",
    id: "gauge",
    title: "Gauge",
    code: `const option = {
  series: [{
    type: "gauge",
    progress: { show: true, width: 14 },
    axisLine: { lineStyle: { width: 14 } },
    detail: { valueAnimation: true, formatter: "{value}%" },
    data: [{ value: 72, name: "Baterai" }],
  }],
};`,
  },
  {
    group: "Alur dan indikator",
    id: "sankey",
    title: "Sankey",
    code: `const option = {
  tooltip: { trigger: "item" },
  series: [{
    type: "sankey",
    emphasis: { focus: "adjacency" },
    lineStyle: { curveness: 0.5 },
    data: [
      { name: "Sensor" }, { name: "Rust" }, { name: "Database" },
      { name: "Grafik" }, { name: "Peta" },
    ],
    links: [
      { source: "Sensor", target: "Rust", value: 10 },
      { source: "Rust", target: "Database", value: 4 },
      { source: "Rust", target: "Grafik", value: 4 },
      { source: "Rust", target: "Peta", value: 2 },
      { source: "Database", target: "Grafik", value: 3 },
    ],
  }],
};`,
  },
  {
    group: "Alur dan indikator",
    id: "theme-river",
    title: "Theme river",
    code: `const r = rand(2);
const names = ["Frontend", "Backend", "Embedded"];
const data = [];
for (let d = 1; d <= 20; d++) {
  for (const n of names) {
    data.push(["2026/10/" + String(d).padStart(2, "0"), Math.round(5 + r() * 15), n]);
  }
}

const option = {
  tooltip: { trigger: "axis" },
  legend: { data: names, bottom: 0 },
  singleAxis: { type: "time", top: 20, bottom: 50 },
  series: [{ type: "themeRiver", label: { show: false }, data }],
};`,
  },

  // ───────── Hierarki dan relasi ─────────
  {
    group: "Hierarki dan relasi",
    id: "treemap",
    title: "Treemap",
    code: `const option = {
  tooltip: { trigger: "item" },
  series: [{
    type: "treemap",
    roam: false,
    nodeClick: false,
    breadcrumb: { show: false },
    data: [
      { name: "Frontend", value: 40, children: [{ name: "React", value: 25 }, { name: "CSS", value: 15 }] },
      { name: "Backend", value: 35, children: [{ name: "Rust", value: 20 }, { name: "Python", value: 15 }] },
      { name: "Embedded", value: 25 },
    ],
  }],
};`,
  },
  {
    group: "Hierarki dan relasi",
    id: "sunburst",
    title: "Sunburst",
    code: `const option = {
  series: [{
    type: "sunburst",
    radius: [0, "90%"],
    label: { rotate: "radial" },
    data: [
      { name: "Frontend", children: [{ name: "React", value: 25 }, { name: "CSS", value: 15 }] },
      { name: "Backend", children: [{ name: "Rust", value: 20 }, { name: "Python", value: 15 }] },
      { name: "Embedded", value: 25 },
    ],
  }],
};`,
  },
  {
    group: "Hierarki dan relasi",
    id: "tree",
    title: "Tree",
    code: `const option = {
  tooltip: { trigger: "item" },
  series: [{
    type: "tree",
    top: "5%", left: "12%", bottom: "5%", right: "22%",
    symbolSize: 9,
    initialTreeDepth: 3,
    label: { position: "left", verticalAlign: "middle", align: "right" },
    leaves: { label: { position: "right", verticalAlign: "middle", align: "left" } },
    data: [{
      name: "Tim",
      children: [
        { name: "Software", children: [{ name: "Frontend" }, { name: "Backend" }] },
        { name: "Elektronika" },
        { name: "Mekanik" },
      ],
    }],
  }],
};`,
  },
  {
    group: "Hierarki dan relasi",
    id: "graph",
    title: "Graph (jaringan)",
    code: `const option = {
  tooltip: {},
  series: [{
    type: "graph",
    layout: "force",
    roam: true,
    draggable: true,
    label: { show: true },
    force: { repulsion: 300, edgeLength: 90 },
    lineStyle: { color: "#5b6770" },
    data: [
      { name: "Tauri", symbolSize: 52 },
      { name: "Rust", symbolSize: 40 },
      { name: "React", symbolSize: 40 },
      { name: "ECharts", symbolSize: 32 },
      { name: "Leaflet", symbolSize: 32 },
      { name: "Git", symbolSize: 36 },
    ],
    links: [
      { source: "Tauri", target: "Rust" },
      { source: "Tauri", target: "React" },
      { source: "React", target: "ECharts" },
      { source: "React", target: "Leaflet" },
      { source: "Git", target: "Tauri" },
    ],
  }],
};`,
  },
  {
    group: "Hierarki dan relasi",
    id: "parallel",
    title: "Parallel coordinates",
    code: `const option = {
  parallelAxis: [
    { dim: 0, name: "Kecepatan" },
    { dim: 1, name: "Ketinggian" },
    { dim: 2, name: "Massa" },
    { dim: 3, name: "Durasi" },
  ],
  parallel: { left: "8%", right: "10%", top: 40, bottom: 32 },
  series: [{
    type: "parallel",
    lineStyle: { width: 2 },
    data: [[120, 500, 30, 12], [200, 900, 45, 20], [80, 300, 20, 8], [160, 700, 35, 15]],
  }],
};`,
  },
];

export const GROUPS = Array.from(new Set(CHARTS.map((c) => c.group)));