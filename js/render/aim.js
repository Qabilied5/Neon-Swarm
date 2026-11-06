// Garis bidik (khusus sentuh): redup = bidik otomatis, terang + panah = bidik manual
function drawAim() {
  if (!TOUCH || !P || S != 'play') return;
  const man = AIM.on && AIM.man,
    u = tui().u,
    ux = Math.cos(P.a),
    uy = Math.sin(P.a),
    len = (man ? 280 : 150) * u,
    ex = P.x + ux * len,
    ey = P.y + uy * len;
  g.shadowBlur = 0;
  g.strokeStyle = man ? '#ff2e63' : '#22d3ee';
  g.globalAlpha = man ? 0.6 : 0.2;
  g.lineWidth = 2;
  g.setLineDash([8, 10]);
  g.beginPath();
  g.moveTo(P.x + ux * 22, P.y + uy * 22);
  g.lineTo(ex, ey);
  g.stroke();
  g.setLineDash([]);
  if (man) {
    g.globalAlpha = 0.85;
    g.beginPath();
    g.moveTo(ex - ux * 10 - uy * 7, ey - uy * 10 + ux * 7);
    g.lineTo(ex, ey);
    g.lineTo(ex - ux * 10 + uy * 7, ey - uy * 10 - ux * 7);
    g.stroke();
  }
  g.globalAlpha = 1;
}
