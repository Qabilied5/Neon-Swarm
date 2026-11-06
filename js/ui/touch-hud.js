// Gambar stik & tombol di mobile
function touchHud() {
  const ox = JS.on ? JS.ox : Math.max(95, W * 0.14),
    oy = JS.on ? JS.oy : H - 95;
  g.shadowBlur = 0;
  g.strokeStyle = '#22d3ee';
  g.fillStyle = '#22d3ee';
  g.lineWidth = 3;
  g.globalAlpha = JS.on ? 0.6 : 0.25;
  g.beginPath();
  g.arc(ox, oy, 55, 0, TAU);
  g.stroke();
  g.globalAlpha = JS.on ? 0.65 : 0.2;
  g.beginPath();
  g.arc(ox + JS.x * 55, oy + JS.y * 55, 24, 0, TAU);
  g.fill();
  for (const b of btns()) {
    const on = b.k == 'dash' || P.sk[b.k],
      cd = b.k == 'dash' ? P.dc : P.cd[b.k],
      mx = b.k == 'dash' ? P.dashCD : 9,
      rdy = on && cd <= 0;
    g.globalAlpha = on ? 0.9 : 0.3;
    g.fillStyle = '#0a1220';
    g.strokeStyle = b.c;
    g.lineWidth = 3;
    g.shadowColor = b.c;
    g.shadowBlur = rdy ? 12 : 0;
    g.beginPath();
    g.arc(b.x, b.y, b.r, 0, TAU);
    g.fill();
    g.stroke();
    g.shadowBlur = 0;
    if (on && cd > 0) {
      g.fillStyle = 'rgba(0,0,0,.65)';
      g.beginPath();
      g.moveTo(b.x, b.y);
      g.arc(b.x, b.y, b.r, -Math.PI / 2, -Math.PI / 2 + TAU * cl(cd / mx, 0, 1));
      g.fill();
    }
    g.globalAlpha = 1;
    tx(b.l, b.x, b.y + 6, b.k == 'dash' ? 14 : 22, on ? b.c : '#2a4560', 'center', rdy ? 10 : 0);
  }
  g.globalAlpha = 1;
}
