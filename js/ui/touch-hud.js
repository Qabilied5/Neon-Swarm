// Gambar kontrol sentuh: stik kiri, tombol serang (dengan knob bidik), tombol dash & skill
function touchHud() {
  const U = tui(),
    st = U.stick,
    sx = JS.on ? JS.ox : st.x,
    sy = JS.on ? JS.oy : st.y;
  g.shadowBlur = 0;
  // stik kiri
  g.strokeStyle = '#22d3ee';
  g.fillStyle = '#22d3ee';
  g.lineWidth = 3;
  g.globalAlpha = JS.on ? 0.4 : 0.2;
  g.beginPath();
  g.arc(sx, sy, st.r, 0, TAU);
  g.stroke();
  g.globalAlpha = JS.on ? 0.45 : 0.15;
  g.beginPath();
  g.arc(sx + JS.x * st.r, sy + JS.y * st.r, st.r * 0.44, 0, TAU);
  g.fill();
  drawAtkPad(U.atk);
  for (const b of U.btns) drawTBtn(b);
  g.globalAlpha = 1;
}
// tombol serang: cincin besar + ikon bidik; knob mengikuti jari saat digeser
function drawAtkPad(a) {
  const on = AIM.on,
    c = AIM.man ? '#ff2e63' : '#22d3ee';
  g.shadowBlur = 0;
  g.strokeStyle = c;
  g.lineWidth = 3;
  g.globalAlpha = on ? 0.55 : 0.3; // transparan: tanpa warna isi, hanya garis
  g.beginPath();
  g.arc(a.x, a.y, a.r, 0, TAU);
  g.stroke();
  if (on) {
    g.globalAlpha = 0.25;
    g.beginPath();
    g.arc(a.x, a.y, a.aimR, 0, TAU); // jangkauan geser
    g.stroke();
  }
  // ikon crosshair
  g.globalAlpha = on ? 0.55 : 0.3;
  g.lineWidth = 2.5;
  const r = a.r * 0.42;
  g.beginPath();
  g.arc(a.x, a.y, r, 0, TAU);
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    g.moveTo(a.x + dx * r * 0.6, a.y + dy * r * 0.6);
    g.lineTo(a.x + dx * r * 1.45, a.y + dy * r * 1.45);
  }
  g.stroke();
  if (on) {
    g.globalAlpha = 0.5;
    g.fillStyle = c;
    g.beginPath();
    g.arc(a.x + AIM.kx, a.y + AIM.ky, a.r * 0.36, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
}
function drawTBtn(b) {
  const on = b.k == 'dash' || b.k == 'c' || P.sk[b.k],
    skill = b.k == 'q' || b.k == 'e' || b.k == 'r', // Q/E/R: opacity 30%
    cd = b.k == 'dash' ? P.dc : P.cd[b.k],
    mx = b.k == 'dash' ? P.dashCD : b.k == 'c' ? HEAL_CD : 9,
    rdy = on && cd <= 0,
    pr = (TPR[b.k] || 0) > T,
    aiming = SK.on && SK.k == b.k,
    r = b.r * (pr ? 1.12 : 1),
    // skill: 30% (naik sedikit saat ditekan / dibidik agar ada umpan balik); belum terbuka lebih redup
    al = skill ? (pr || aiming ? 0.6 : on ? 0.3 : 0.15) : on ? 0.9 : 0.3;
  g.globalAlpha = al;
  g.fillStyle = pr ? b.c + '55' : '#0a1220';
  g.strokeStyle = b.c;
  g.lineWidth = 3;
  g.shadowColor = b.c;
  g.shadowBlur = rdy && !skill ? 10 : 0;
  g.beginPath();
  g.arc(b.x, b.y, r, 0, TAU);
  g.fill();
  g.stroke();
  g.shadowBlur = 0;
  if (on && cd > 0) {
    g.fillStyle = 'rgba(0,0,0,.65)';
    g.beginPath();
    g.moveTo(b.x, b.y);
    g.arc(b.x, b.y, r, -Math.PI / 2, -Math.PI / 2 + TAU * cl(cd / mx, 0, 1));
    g.fill();
  }
  if (aiming) {
    // knob bidik skill mengikuti jari + cincin jangkauan geser
    g.strokeStyle = b.c;
    g.fillStyle = b.c;
    g.globalAlpha = 0.35;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(b.x, b.y, tui().atk.aimR, 0, TAU);
    g.stroke();
    g.globalAlpha = 0.85;
    g.beginPath();
    g.arc(b.x + SK.kx, b.y + SK.ky, b.r * 0.45, 0, TAU);
    g.fill();
  }
  g.globalAlpha = skill ? Math.min(1, al + 0.1) : 1; // label ikut transparan pada tombol skill
  const big = b.k == 'dash' ? 13 : 20;
  if (b.k == 'c' && cd > 0)
    tx(String(Math.ceil(cd)), b.x, b.y + 6, 16, b.c, 'center', 0); // sisa detik heal
  else tx(b.l, b.x, b.y + big * 0.3, big, on ? b.c : '#2a4560', 'center', rdy && !skill ? 8 : 0);
  g.globalAlpha = 1;
}
