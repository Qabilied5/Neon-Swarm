// Input sentuh: sisi kiri layar = stik gerak (melayang, tanpa UI), sisi kanan layar = serang bebas (tahan + geser untuk bidik, TANPA auto aim)
// + dash & skill. Skill Q/E/R: tahan -> geser untuk membidik -> lepas untuk menembakkan.
const TPR = {}; // waktu efek "ditekan" per tombol

// jarak bidik maksimum (satuan dunia) untuk skill yang menargetkan titik
const SK_RANGE = { q: 230, r: 380 };
const SK_AIMABLE = { q: 1, e: 1, r: 1 };

// BIDIK SERANGAN DASAR: tahan di mana saja di sisi kanan layar -> muncul lingkaran bidik (reticle) di dunia game.
// Geser jari = lingkaran ikut bergerak (relatif, bisa ke mana saja di layar). Pemain menembak ke arah lingkaran.
// Posisi lingkaran disimpan sebagai offset (AIM.ox, AIM.oy) dari pemain, jadi ikut bergerak bersama pemain.
const AIM_GAIN = 2.2; // 1 satuan geser jari = 2.2 satuan gerak lingkaran (jangkauan luas tanpa harus geser jauh)
const AIM_START = 200; // jarak awal lingkaran dari pemain saat tombol pertama ditahan

// mulai bidik: lingkaran muncul di arah bidik terakhir
function aimStart(x, y) {
  const d = AIM.dist || AIM_START;
  AIM.ox = Math.cos(P.a) * d;
  AIM.oy = Math.sin(P.a) * d;
  AIM.lx = x;
  AIM.ly = y;
  AIM.man = 1;
  AIM.kx = AIM.ky = 0;
  aimSync();
}

// geser jari -> geser lingkaran (tanpa batas jangkauan, hanya dibatasi tepi layar)
function aimFrom(x, y) {
  AIM.ox += ((x - AIM.lx) * AIM_GAIN) / ZM; // jari bergerak px layar -> /ZM ke satuan dunia (rasa geser tetap sama di zoom berapa pun)
  AIM.oy += ((y - AIM.ly) * AIM_GAIN) / ZM;
  AIM.lx = x;
  AIM.ly = y;
  aimSync();
}

// jaga lingkaran tetap di dalam layar + hitung arah tembak. Dipanggil juga tiap frame (pemain bergerak).
function aimSync() {
  const m = 14; // margin dari tepi layar
  AIM.ox = cl(P.x + AIM.ox, m, W - m) - P.x;
  AIM.oy = cl(P.y + AIM.oy, m, H - m) - P.y;
  const d = Math.hypot(AIM.ox, AIM.oy);
  if (d > 6) {
    // terlalu dekat pemain = arah dipertahankan
    AIM.x = AIM.ox / d;
    AIM.y = AIM.oy / d;
    AIM.dist = d;
  }
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
      const x = t.clientX,
        y = t.clientY; // koordinat layar asli (ruang UI)
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
      if (!AIM.on && x >= UW * 0.5) {
        // seluruh sisi kanan layar = area serang bebas (tahan + geser)
        AIM.on = 1;
        AIM.id = t.identifier;
        aimStart(x, y);
        continue;
      }
      if (x < UW * 0.5 && !JS.on) {
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
      const tx_ = t.clientX,
        ty_ = t.clientY;
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
