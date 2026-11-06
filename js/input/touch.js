// Input sentuh: jari kiri = stik gerak, jari kanan = tombol serang (geser untuk bidik) + dash/skill
const TPR = {}; // waktu efek "ditekan" per tombol

// set arah bidik dari posisi jari relatif pusat tombol serang
function aimFrom(x, y) {
  const a = tui().atk,
    dx = x - a.x,
    dy = y - a.y,
    m = Math.hypot(dx, dy) || 1;
  AIM.man = m >= a.dead ? 1 : 0; // di tengah tombol = bidik otomatis
  if (AIM.man) {
    AIM.x = dx / m;
    AIM.y = dy / m;
  }
  const k = Math.min(m, a.aimR) / m; // posisi knob (dibatasi radius)
  AIM.kx = dx * k;
  AIM.ky = dy * k;
}

addEventListener(
  'touchstart',
  (e) => {
    if (e.target && e.target.closest && e.target.closest('#install')) return; // biarkan tombol install bekerja
    e.preventDefault();
    TOUCH = true;
    if (PORTRAIT) return;
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
      const U = tui(),
        b = U.btns.find((b) => Math.hypot(b.x - x, b.y - y) < b.r + 10);
      if (b) {
        b.f();
        TPR[b.k] = T + 0.14;
        continue;
      }
      if (!AIM.on && Math.hypot(U.atk.x - x, U.atk.y - y) < U.atk.r * 1.35) {
        AIM.on = 1;
        AIM.id = t.identifier;
        aimFrom(x, y);
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
    for (const t of e.changedTouches) {
      if (AIM.on && t.identifier == AIM.id) aimFrom(t.clientX, t.clientY);
      if (JS.on && t.identifier == JS.id) {
        const dx = t.clientX - JS.ox,
          dy = t.clientY - JS.oy,
          m = Math.hypot(dx, dy),
          mx = tui().stick.r;
        if (m < 8) {
          JS.x = JS.y = 0;
        } else {
          JS.x = dx / Math.max(m, mx);
          JS.y = dy / Math.max(m, mx);
        }
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
    if (AIM.on && t.identifier == AIM.id) {
      AIM.on = AIM.man = 0;
      AIM.kx = AIM.ky = 0;
    }
    if (e.type == 'touchend') {
      const u = uiHit(t.clientX, t.clientY);
      if (u) uiAct(u);
      else if (!fsTried && !STANDALONE && S == 'play') {
        fsTried = 1;
        enterFS();
      }
    }
  }
};
addEventListener('touchend', tend);
addEventListener('touchcancel', tend);
