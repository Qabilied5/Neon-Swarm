// Tombol UI kecil (fullscreen, pause) + hit test
function uiBtns() {
  if (S == 'dead') return [];
  const b = [];
  let x = W - SAFE.r - 26;
  if (!STANDALONE) {
    // sudah fullscreen saat dipasang sebagai PWA
    b.push({ k: 'fs', x, y: 84, r: 20 });
    x -= 48;
  }
  if (TOUCH && (S == 'play' || S == 'pause')) b.push({ k: 'pause', x, y: 84, r: 20 });
  return b;
}
const uiHit = (x, y) => {
  const b = uiBtns().find((b) => Math.hypot(b.x - x, b.y - y) < b.r + 8);
  return b ? b.k : null;
};
function uiAct(u) {
  if (u == 'fs') goFS();
  else if (S == 'play') S = 'pause';
  else if (S == 'pause') S = 'play';
}
function uiDraw() {
  for (const b of uiBtns()) {
    g.globalAlpha = 0.75;
    g.shadowBlur = 0;
    g.strokeStyle = '#22d3ee';
    g.fillStyle = '#0a1220';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(b.x, b.y, b.r, 0, TAU);
    g.fill();
    g.stroke();
    g.beginPath();
    if (b.k == 'fs') {
      for (const sx of [-1, 1])
        for (const sy of [-1, 1]) {
          g.moveTo(b.x + sx * 8, b.y + sy * 3);
          g.lineTo(b.x + sx * 8, b.y + sy * 8);
          g.lineTo(b.x + sx * 3, b.y + sy * 8);
        }
      g.stroke();
    } else {
      g.fillStyle = '#22d3ee';
      g.fillRect(b.x - 6, b.y - 7, 4, 14);
      g.fillRect(b.x + 2, b.y - 7, 4, 14);
    }
  }
  g.globalAlpha = 1;
}
