// Input sentuh: stik analog & tombol skill mobile
const bs = () => Math.max(0.7, Math.min(1.15, Math.min(W, H) / 450));
function btns() {
  const s = bs();
  return [
    { k: 'dash', l: 'DASH', c: '#39ff88', x: W - 75 * s, y: H - 75 * s, r: 42 * s, f: dash },
    { k: 'q', l: 'Q', c: '#22d3ee', x: W - 175 * s, y: H - 55 * s, r: 30 * s, f: nova },
    { k: 'e', l: 'E', c: '#ff2e63', x: W - 165 * s, y: H - 130 * s, r: 30 * s, f: laser },
    { k: 'r', l: 'R', c: '#b967ff', x: W - 90 * s, y: H - 170 * s, r: 30 * s, f: hole },
  ];
}
addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    TOUCH = true;
    for (const t of e.changedTouches) {
      const x = t.clientX,
        y = t.clientY;
      if (uiHit(x, y)) continue;
      if (S == 'menu' || S == 'dead') {
        if (deadT <= 0) init();
        continue;
      }
      if (S == 'levelup') {
        const i = cardAt(x, y);
        if (i >= 0) pickCard(i);
        continue;
      }
      if (S == 'pause') {
        S = 'play';
        continue;
      }
      const b = btns().find((b) => Math.hypot(b.x - x, b.y - y) < b.r + 12);
      if (b) {
        b.f();
        continue;
      }
      if (x < W * 0.5 && !JS.on) {
        JS.on = 1;
        JS.id = t.identifier;
        JS.ox = x;
        JS.oy = y;
        JS.x = JS.y = 0;
      }
    }
  },
  { passive: false },
);
addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
    for (const t of e.changedTouches)
      if (JS.on && t.identifier == JS.id) {
        const dx = t.clientX - JS.ox,
          dy = t.clientY - JS.oy,
          m = Math.hypot(dx, dy),
          mx = 55;
        if (m < 8) {
          JS.x = JS.y = 0;
        } else {
          JS.x = dx / Math.max(m, mx);
          JS.y = dy / Math.max(m, mx);
        }
      }
  },
  { passive: false },
);
const tend = (e) => {
  for (const t of e.changedTouches) {
    if (JS.on && t.identifier == JS.id) {
      JS.on = 0;
      JS.x = JS.y = 0;
    }
    if (e.type == 'touchend') {
      const u = uiHit(t.clientX, t.clientY);
      if (u) uiAct(u);
      else if (!fsTried && S == 'play') {
        fsTried = 1;
        enterFS();
      }
    }
  }
};
addEventListener('touchend', tend);
addEventListener('touchcancel', tend);
