// Panduan bidik (khusus sentuh):
//  - serangan dasar: HANYA ujung panah (tanpa garis) di sisi pemain, terang saat tombol serang ditahan
//  - skill Q/E/R: pratinjau area/arah saat tombol skill ditahan & digeser
function drawAim() {
  if (!TOUCH || !P || S != 'play') return;
  const u = tui().u * ZM, // ukuran fisik konstan walau zoom-out
    on = AIM.on,
    ux = Math.cos(P.a),
    uy = Math.sin(P.a),
    d = 46 * u,
    ex = P.x + ux * d,
    ey = P.y + uy * d,
    sz = 11 * u;
  g.shadowBlur = 0;
  g.strokeStyle = on && AIM.man ? '#ff2e63' : '#22d3ee';
  g.globalAlpha = on ? 0.9 : 0.35;
  g.lineWidth = 3;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(ex - ux * sz - uy * sz * 0.75, ey - uy * sz + ux * sz * 0.75);
  g.lineTo(ex, ey);
  g.lineTo(ex - ux * sz + uy * sz * 0.75, ey - uy * sz - ux * sz * 0.75);
  g.stroke();
  g.lineCap = 'butt';
  if (SK.on) drawSkillAim();
  g.globalAlpha = 1;
}

// pratinjau bidik skill yang sedang ditahan
function drawSkillAim() {
  const k = SK.k,
    t = skTarget(k),
    col = k == 'q' ? '#22d3ee' : k == 'e' ? '#ff2e63' : '#b967ff';
  g.strokeStyle = col;
  g.fillStyle = col;
  g.lineWidth = 2;
  g.setLineDash([8, 8]);
  if (k == 'e') {
    const ux = Math.cos(t.a),
      uy = Math.sin(t.a),
      w = 12 + P.sk.e * 3;
    g.globalAlpha = P.sk.e ? 0.18 : 0.08;
    g.lineWidth = w * 2;
    g.setLineDash([]);
    g.beginPath();
    g.moveTo(P.x, P.y);
    g.lineTo(P.x + ux * 1400, P.y + uy * 1400);
    g.stroke();
    g.globalAlpha = 0.6;
    g.lineWidth = 2;
    g.setLineDash([8, 8]);
    g.beginPath();
    g.moveTo(P.x, P.y);
    g.lineTo(P.x + ux * 1400, P.y + uy * 1400);
    g.stroke();
  } else {
    const r = k == 'q' ? 210 + P.sk.q * 35 : 170 + P.sk.r * 25;
    g.globalAlpha = 0.14;
    g.beginPath();
    g.arc(t.x, t.y, r, 0, TAU);
    g.fill();
    g.globalAlpha = 0.7;
    g.beginPath();
    g.arc(t.x, t.y, r, 0, TAU);
    g.stroke();
    if (t.x != P.x || t.y != P.y) {
      g.globalAlpha = 0.35;
      g.beginPath();
      g.moveTo(P.x, P.y);
      g.lineTo(t.x, t.y);
      g.stroke();
    }
  }
  g.setLineDash([]);
}
