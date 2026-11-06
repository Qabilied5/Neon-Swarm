// Setup canvas, ukuran layar (W,H), safe-area (notch), deteksi portrait, resize
const cv = document.getElementById('c'),
  g = cv.getContext('2d');
let W,
  H,
  PORTRAIT = false; // true = HP dipegang tegak (game minta landscape)
const SAFE = { t: 0, r: 0, b: 0, l: 0 }; // inset notch / gesture bar (px)
function readSafe() {
  const el = document.getElementById('safe'),
    cs = el && getComputedStyle(el);
  if (!cs) return;
  SAFE.t = parseFloat(cs.paddingTop) || 0;
  SAFE.r = parseFloat(cs.paddingRight) || 0;
  SAFE.b = parseFloat(cs.paddingBottom) || 0;
  SAFE.l = parseFloat(cs.paddingLeft) || 0;
}
function rs() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * d;
  cv.height = H * d;
  g.setTransform(d, 0, 0, d, 0, 0);
  readSafe();
  PORTRAIT = matchMedia('(orientation: portrait) and (pointer: coarse)').matches;
}
addEventListener('resize', rs);
addEventListener('orientationchange', () => setTimeout(rs, 250)); // iOS: ukuran baru telat terbaca
rs();
