// Input sentuh: jari kiri = stik gerak, jari kanan = tombol serang (geser untuk bidik, TANPA auto aim)
// + dash & skill. Skill Q/E/R: tahan -> geser untuk membidik -> lepas untuk menembakkan.
const TPR = {}; // waktu efek "ditekan" per tombol

// jarak bidik maksimum (satuan dunia) untuk skill yang menargetkan titik
const SK_RANGE = { q: 230, r: 380 };
const SK_AIMABLE = { q: 1, e: 1, r: 1 };

// set arah bidik dari posisi jari relatif pusat tombol serang
function aimFrom(x, y) {
  const a = tui().atk,
    dx = x - a.x,
    dy = y - a.y,
    m = Math.hypot(dx, dy) || 1;
  AIM.man = m >= a.dead ? 1 : 0; // di tengah tombol = arah bidik terakhir dipertahankan
  if (AIM.man) {
    AIM.x = dx / m;
    AIM.y = dy / m;
  }
  const k = Math.min(m, a.aimR) / m; // posisi knob (dibatasi radius)
  AIM.kx = dx * k;
  AIM.ky = dy * k;
}

// set arah/jarak bidik skill dari posisi jari relatif pusat tombol skill
function skAimFrom(x, y) {
  const b = tui().btns.find((b) => b.k == SK.k);
  if (!b) return;
  const a = tui().atk,
    dx = x - b.x,
    dy = y - b.y,
    m = Math.hypot(dx, dy) || 1,
    rr = a.aimR; // radius geser = sama dengan tombol serang
  SK.man = m >= a.dead ? 1 : 0;
  if (SK.man) {
    SK.x = dx / m;
    SK.y = dy / m;
  }
  SK.d = SK.man ? Math.min(m, rr) / rr : 0;
  const k = Math.min(m, rr) / m;
  SK.kx = dx * k;
  SK.ky = dy * k;
}

// hitung sasaran bidik skill k: arah (a), titik target (x,y), dan apakah digeser manual
function skTarget(k) {
  const man = SK.on && SK.k == k ? SK.man : 0,
    ax = man ? SK.x : Math.cos(P.a),
    ay = man ? SK.y : Math.sin(P.a),
    d = man ? SK.d : 0,
    rg = k == 'r' ? SK_RANGE.r * Math.max(d, 0.25) : SK_RANGE.q * d, // tap tanpa geser: R jatuh di depan pemain, Q di pemain
    dist = man ? rg : k == 'r' ? 220 : 0;
  return { man, a: Math.atan2(ay, ax), x: cl(P.x + ax * dist, 0, W), y: cl(P.y + ay * dist, 0, H) };
}

// jalankan skill dengan bidikan (dipanggil saat jari dilepas)
function castSkill(k) {
  const t = skTarget(k);
  if (k == 'q') {
    if (t.man) nova(t.x, t.y);
    else nova();
  } else if (k == 'e') laser(t.a);
  else if (k == 'r') hole(t.x, t.y);
}

addEventListener(
  'touchstart',
  (e) => {
    if (e.target && e.target.closest && e.target.closest('#install')) return; // biarkan tombol install bekerja
    e.preventDefault();
    TOUCH = true;
    if (PORTRAIT) return;
    for (const t of e.changedTouches) {
      const x = t.clientX / ZM,
        y = t.clientY / ZM; // konversi ke koordinat dunia logis
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
        if (SK_AIMABLE[b.k] && !SK.on) {
          // skill berbidik: ditembakkan saat dilepas
          SK.on = 1;
          SK.id = t.identifier;
          SK.k = b.k;
          SK.man = 0;
          SK.d = 0;
          SK.kx = SK.ky = 0;
          TPR[b.k] = T + 0.14;
        } else if (!SK_AIMABLE[b.k]) {
          b.f();
          TPR[b.k] = T + 0.14;
        }
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
      const tx_ = t.clientX / ZM,
        ty_ = t.clientY / ZM;
      if (AIM.on && t.identifier == AIM.id) aimFrom(tx_, ty_);
      if (SK.on && t.identifier == SK.id) skAimFrom(tx_, ty_);
      if (JS.on && t.identifier == JS.id) {
        const dx = tx_ - JS.ox,
          dy = ty_ - JS.oy,
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
    if (SK.on && t.identifier == SK.id) {
      const k = SK.k;
      if (e.type == 'touchend' && S == 'play' && P) castSkill(k); // touchcancel = batal
      SK.on = 0;
      SK.man = 0;
      SK.kx = SK.ky = 0;
    }
    if (e.type == 'touchend') {
      const u = uiHit(t.clientX / ZM, t.clientY / ZM);
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
