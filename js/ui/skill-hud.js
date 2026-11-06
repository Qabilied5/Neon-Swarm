// Gambar ikon skill Q/E/R di desktop
function skillHud() {
  [
    ['q', 'Q', '#22d3ee'],
    ['e', 'E', '#ff2e63'],
    ['r', 'R', '#b967ff'],
  ].forEach((k, i) => {
    const x = W / 2 - 80 + i * 56,
      y = H - 62,
      lv = P.sk[k[0]],
      cd = P.cd[k[0]];
    g.shadowBlur = 0;
    g.fillStyle = '#0a1220';
    g.fillRect(x, y, 48, 48);
    g.strokeStyle = lv ? k[2] : '#1d3a55';
    g.lineWidth = 2;
    g.strokeRect(x, y, 48, 48);
    if (lv && cd > 0) {
      g.fillStyle = 'rgba(0,0,0,.7)';
      g.fillRect(x, y, 48, 48 * cl(cd / 9, 0, 1));
    }
    tx(k[1], x + 24, y + 30, 22, lv ? k[2] : '#2a4560', 'center', lv && cd <= 0 ? 12 : 0);
    if (lv) tx('Lv' + lv, x + 24, y + 43, 10, '#7aa2c0');
  });
}
