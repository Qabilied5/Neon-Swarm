// Layar menu, pause, level-up, game over
function drawMenu() {
  const big = Math.min(84, W / 8);
  if (S == 'menu') {
    tx('NEON SWARM', W / 2, H * 0.36, big, '#22d3ee', 'center', 30);
    tx('bertahan hidup dari kawanan neon', W / 2, H * 0.36 + 34, 16, '#7aa2c0');
    tx(
      'WASD gerak  ·  MOUSE bidik (tembak otomatis)  ·  SPACE / klik kanan dash',
      W / 2,
      H * 0.56,
      15,
      '#39ff88',
    );
    tx(
      'Q NOVA  ·  E LASER  ·  R BLACK HOLE  (skill dibuka lewat upgrade level-up)',
      W / 2,
      H * 0.56 + 50,
      13,
      '#ffd166',
    );
    tx(
      'WAVE 6+ musuh berevolusi  ·  WAVE 8+ 3 tabrakan = MATI  ·  WAVE 15+ super boss',
      W / 2,
      H * 0.56 + 74,
      13,
      '#ff8da1',
    );
    tx(
      'P pause  ·  M suara  ·  boss tiap 5 wave dengan ejekan dari AI (Ollama, opsional)',
      W / 2,
      H * 0.56 + 26,
      13,
      '#7aa2c0',
    );
    const sy = TOUCH ? Math.max(H * 0.7, H * 0.56 + 124) : H * 0.7;
    if (TOUCH)
      tx(
        'SENTUH: stik kiri = gerak · bidik otomatis · tombol kanan = DASH / Q / E / R',
        W / 2,
        H * 0.56 + 98,
        13,
        '#39ff88',
      );
    tx(
      Math.floor(T * 2) % 2
        ? TOUCH
          ? 'SENTUH LAYAR UNTUK MULAI'
          : 'KLIK ATAU TEKAN ENTER UNTUK MULAI'
        : '',
      W / 2,
      sy,
      20,
      '#ffd166',
      'center',
      12,
    );
    if (best) tx('REKOR ' + best, W / 2, sy + 28, 14, '#7aa2c0');
  }
}
function drawPause() {
  if (S == 'pause') {
    g.fillStyle = 'rgba(0,0,0,.6)';
    g.fillRect(0, 0, W, H);
    tx('PAUSE', W / 2, H / 2, 60, '#22d3ee', 'center', 20);
    tx('tekan P untuk lanjut', W / 2, H / 2 + 34, 16, '#7aa2c0');
  }
}
function drawLevelup() {
  if (S == 'levelup') {
    g.fillStyle = 'rgba(0,0,0,.7)';
    g.fillRect(0, 0, W, H);
    const c = cl3(),
      hv = cardAt(M.x, M.y);
    tx(
      'LEVEL UP!  pilih upgrade (klik atau tekan 1/2/3)',
      W / 2,
      c.y0 - 30,
      Math.min(22, W / 30),
      '#ffd166',
      'center',
      12,
    );
    cards.forEach((u, i) => {
      const x = c.x0 + i * (c.cw + c.gp);
      neon(hv == i ? '#39ff88' : '#22d3ee', hv == i ? '#39ff8822' : '#0a1220');
      g.fillRect(x, c.y0, c.cw, c.ch);
      g.strokeRect(x, c.y0, c.cw, c.ch);
      tx(String(i + 1), x + 14, c.y0 + 24, 16, '#7aa2c0', 'left');
      tx(u[0], x + c.cw / 2, c.y0 + 70, Math.min(17, c.cw / 11), '#fff', 'center', 8);
      const w = u[1].split(' ');
      let ln = '',
        y = c.y0 + 108;
      for (const q of w) {
        if ((ln + q).length > 20) {
          tx(ln, x + c.cw / 2, y, 13, '#7aa2c0');
          y += 18;
          ln = '';
        }
        ln += q + ' ';
      }
      tx(ln, x + c.cw / 2, y, 13, '#7aa2c0');
    });
  }
}
function drawDead() {
  const big = Math.min(84, W / 8);
  if (S == 'dead') {
    g.fillStyle = 'rgba(0,0,0,.65)';
    g.fillRect(0, 0, W, H);
    tx('SISTEM RUNTUH', W / 2, H * 0.36, big * 0.8, '#ff2e63', 'center', 30);
    tx(
      `SKOR ${score}   ·   WAVE ${wave}   ·   KILLS ${kills}`,
      W / 2,
      H * 0.36 + 44,
      20,
      '#39ff88',
      'center',
      8,
    );
    if (score >= best && score > 0)
      tx('REKOR BARU!', W / 2, H * 0.36 + 74, 18, '#ffd166', 'center', 10);
    tx(epi, W / 2, H * 0.36 + 110, 15, '#ffd166');
    if (deadT <= 0)
      tx(
        Math.floor(T * 2) % 2
          ? TOUCH
            ? 'SENTUH LAYAR UNTUK MAIN LAGI'
            : 'KLIK ATAU ENTER UNTUK MAIN LAGI'
          : '',
        W / 2,
        H * 0.7,
        20,
        '#22d3ee',
        'center',
        12,
      );
  }
}
