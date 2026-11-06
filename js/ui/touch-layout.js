// Layout kontrol sentuh (landscape): stik kiri, tombol serang kanan dikelilingi dash & skill
const bs = () => cl(innerHeight / 400, 0.75, 1.2) / ZM; // dibagi ZM agar ukuran fisik tombol tetap nyaman saat zoom-out // skala UI menurut tinggi layar

// Tombol di sekeliling tombol serang. a = sudut (derajat, 180 = kiri tombol serang, searah jarum jam)
// Tambah tombol baru di sini (+ f = fungsi aksi). Maks ~6 tombol agar tidak berdesakan.
const TBTN = [
  { k: 'dash', l: 'DASH', c: '#ffd166', a: 348, r: 30, f: () => dash() },
  { k: 'q', l: 'Q', c: '#22d3ee', a: 222, r: 26, f: () => nova() },
  { k: 'e', l: 'E', c: '#ff2e63', a: 264, r: 26, f: () => laser() },
  { k: 'r', l: 'R', c: '#b967ff', a: 306, r: 26, f: () => hole() },
  { k: 'c', l: '✚', c: '#39ff88', a: 180, r: 26, f: () => heal() },
];

let TUI = null;
function buildTUI() {
  const u = bs(),
    R = 96 * u, // jarak tombol skill dari pusat tombol serang
    ar = 46 * u, // radius tombol serang
    cx = W - SAFE.r - 12 - R * 0.98 - 30 * u,
    cy = H - SAFE.b - 10 - ar,
    sr = 55 * u; // radius stik kiri
  return {
    w: W,
    h: H,
    sl: SAFE.l,
    sr: SAFE.r,
    sb: SAFE.b,
    u,
    stick: { x: Math.max(SAFE.l + 30 + sr, W * 0.13), y: H - SAFE.b - 20 - sr, r: sr },
    atk: { x: cx, y: cy, r: ar, aimR: 60 * u, dead: 10 * u },
    btns: TBTN.map((b) => ({
      ...b,
      x: cx + R * Math.cos((b.a * Math.PI) / 180),
      y: cy + R * Math.sin((b.a * Math.PI) / 180),
      r: b.r * u,
    })),
  };
}
// hasil di-cache, dihitung ulang hanya saat ukuran layar / safe-area berubah
function tui() {
  if (!TUI || TUI.w != W || TUI.h != H || TUI.sl != SAFE.l || TUI.sr != SAFE.r || TUI.sb != SAFE.b)
    TUI = buildTUI();
  return TUI;
}
