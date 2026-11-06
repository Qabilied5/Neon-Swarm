// Vignette, flash merah, HUD (HP, XP, skor, wave, boss bar)
function drawOverlayFx() {
  const d = Math.min(devicePixelRatio || 1, 2);
  g.setTransform(d, 0, 0, d, 0, 0);
  const v = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
  v.addColorStop(0, 'transparent');
  v.addColorStop(1, 'rgba(0,0,0,.65)');
  g.fillStyle = v;
  g.fillRect(0, 0, W, H);
  if (flash > 0) {
    g.fillStyle = `rgba(255,46,99,${flash})`;
    g.fillRect(0, 0, W, H);
  }
}
function drawHud() {
  if (S != 'menu' && P) {
    bar(16, 16, 200, 12, P.hp / P.mh, '#ff2e63');
    tx('HP ' + Math.ceil(P.hp), 20, 42, 12, '#ff8da1', 'left');
    bar(16, 50, 200, 6, P.xp / P.need, '#ffd166');
    tx('LV ' + P.lv, 20, 72, 12, '#ffd166', 'left');
    if (wave >= LET) {
      const n = Math.ceil(P.hp / Math.ceil(P.mh / 3));
      tx(
        '☠ TABRAKAN TERSISA: ' + n,
        20,
        92,
        13,
        n <= 1 ? '#ff2e63' : '#ffb703',
        'left',
        n <= 1 ? 10 : 0,
      );
    }
    tx('SCORE ' + score, W - 16, 30, 18, '#39ff88', 'right', 8);
    tx('BEST ' + best, W - 16, 50, 12, '#7aa2c0', 'right');
    tx('WAVE ' + wave + '  ·  KILLS ' + kills, W / 2, 28, 14, '#22d3ee', 'center', 6);
    if (boss) {
      const bw = boss.sup ? 460 : 320;
      bar(W / 2 - bw / 2, 40, bw, boss.sup ? 12 : 8, boss.hp / boss.mh, '#ff2e63');
      if (boss.sup) tx('☠ ANNIHILATOR ☠', W / 2, 68, 12, '#ffd166', 'center', 8);
      if (taunt) tx('"' + taunt + '"', W / 2, boss.sup ? 88 : 72, 14, '#ff8da1', 'center', 6);
    }
    TOUCH ? touchHud() : skillHud();
    if (combo > 1) tx('COMBO x' + combo, W / 2, H - 74, 18, '#ffd166', 'center', 10);
    if (msgT > 0) {
      g.globalAlpha = cl(msgT, 0, 1);
      tx(msg, W / 2, H * 0.3, Math.min(56, W / 10), '#fff', 'center', 20);
      if (sub) tx(sub, W / 2, H * 0.3 + 36, Math.min(20, W / 26), '#ff8da1', 'center', 10);
      g.globalAlpha = 1;
    }
  }
}
