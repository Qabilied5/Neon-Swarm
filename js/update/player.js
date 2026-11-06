// Gerak, bidik, dash, tembak otomatis pemain
function updPlayer(dt) {
  let dx = (K.KeyD || K.ArrowRight ? 1 : 0) - (K.KeyA || K.ArrowLeft ? 1 : 0),
    dy = (K.KeyS || K.ArrowDown ? 1 : 0) - (K.KeyW || K.ArrowUp ? 1 : 0);
  if (JS.on) {
    dx = JS.x;
    dy = JS.y;
  }
  const l = JS.on ? 1 : Math.hypot(dx, dy) || 1;
  if (TOUCH) {
    let bd = 1e9,
      nn = null;
    for (const e of E) {
      const q = Math.hypot(e.x - P.x, e.y - P.y);
      if (q < bd) {
        bd = q;
        nn = e;
      }
    }
    if (nn) P.a = Math.atan2(nn.y - P.y, nn.x - P.x);
    else if (JS.on && (JS.x || JS.y)) P.a = Math.atan2(JS.y, JS.x);
    M.x = P.x + Math.cos(P.a) * 220;
    M.y = P.y + Math.sin(P.a) * 220;
  } else P.a = Math.atan2(M.y - P.y, M.x - P.x);
  if (P.dc > 0) P.dc -= dt;
  if (P.inv > 0) P.inv -= dt;
  for (const k in P.cd) if (P.cd[k] > 0) P.cd[k] -= dt;
  if (P.dash > 0) {
    P.dash -= dt;
    P.x += P.ddx * 720 * dt;
    P.y += P.ddy * 720 * dt;
    pf(P.x, P.y, 2, '#22d3ee', 30, 0.3);
  } else {
    P.x += (dx / l) * P.sp * dt;
    P.y += (dy / l) * P.sp * dt;
  }
  P.x = cl(P.x, P.r, W - P.r);
  P.y = cl(P.y, P.r, H - P.r);
  if (!P.dash && (dx || dy) && Math.random() < 0.6)
    PT.push({ x: P.x, y: P.y, vx: 0, vy: 0, l: 0.35, m: 0.35, c: '#22d3ee', s: 5 });
  P.fire -= dt;
  while (P.fire <= 0) {
    P.fire += 1 / P.rate;
    for (let i = 0; i < P.multi; i++) {
      const a = P.a + (i - (P.multi - 1) / 2) * 0.14;
      B.push({
        x: P.x + Math.cos(a) * 14,
        y: P.y + Math.sin(a) * 14,
        vx: Math.cos(a) * 640,
        vy: Math.sin(a) * 640,
        r: 4,
        d: P.dmg,
        p: P.pier,
        life: 1.1,
        h: new Set(),
      });
    }
    snd(500 + R(0, 80), 0.04, 'square', 0.015);
  }
  P.ot += dt * 3;
}
