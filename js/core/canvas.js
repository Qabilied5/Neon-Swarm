// Setup canvas, ukuran layar (W,H), safe-area (notch), deteksi portrait, resize
const cv = document.getElementById('c'),
  g = cv.getContext('2d');
// ZM = zoom dunia game. Di HP (layar sentuh) < 1 supaya area pandang lebih luas (zoom-out).
const ZOOM_TOUCH = 0.75;
let ZM = 1,
  W,
  H,
  PORTRAIT = false; // true = HP dipegang tegak (game minta landscape)
const SAFE = { t: 0, r: 0, b: 0, l: 0 }; // inset notch / gesture bar (px)
function readSafe() {
  const el = document.getElementById('safe'),
    cs = el && getComputedStyle(el);
  if (!cs) return;
  const z = ZM || 1; // inset dikonversi ke satuan logis
  SAFE.t = (parseFloat(cs.paddingTop) || 0) / z;
  SAFE.r = (parseFloat(cs.paddingRight) || 0) / z;
  SAFE.b = (parseFloat(cs.paddingBottom) || 0) / z;
  SAFE.l = (parseFloat(cs.paddingLeft) || 0) / z;
}
function rs() {
  const d = Math.min(devicePixelRatio || 1, 2);
  ZM = matchMedia('(pointer: coarse)').matches ? ZOOM_TOUCH : 1;
  W = innerWidth / ZM; // W,H = ukuran dunia logis (lebih besar dari layar saat zoom-out)
  H = innerHeight / ZM;
  cv.width = Math.round(innerWidth * d);
  cv.height = Math.round(innerHeight * d);
  cv.style.width = innerWidth + 'px'; // samakan ukuran CSS dengan viewport asli (hindari 100% yang melar di address bar HP)
  cv.style.height = innerHeight + 'px';
  g.setTransform(d * ZM, 0, 0, d * ZM, 0, 0);
  readSafe();
  PORTRAIT = matchMedia('(orientation: portrait) and (pointer: coarse)').matches;
}
addEventListener('resize', rs);
if (window.visualViewport) visualViewport.addEventListener('resize', rs); // address bar HP muncul / hilang
addEventListener('orientationchange', () => setTimeout(rs, 250)); // iOS: ukuran baru telat terbaca
rs();
