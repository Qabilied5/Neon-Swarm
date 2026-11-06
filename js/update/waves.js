// Timer wave & spawn musuh
function updWaves(dt) {
  if (!(boss && boss.sup)) waveT += dt;
  if (waveT >= 22) {
    waveT = 0;
    wave++;
    const nt = tier(wave) != tier(wave - 1);
    if (nt) evolve();
    banner(
      'WAVE ' + wave,
      wave == LET
        ? 'ZONA MAUT: 3 TABRAKAN = LANGSUNG MATI'
        : nt
          ? 'MUSUH BERUBAH: lebih brutal & punya skill'
          : '',
    );
    if (wave % 5 == 0) {
      if (wave >= SUP) spawnSuper();
      else spawnBoss();
    }
  }
  spawnT -= dt;
  if (spawnT < 0 && !(boss && boss.sup) && E.length < Math.min(9 + wave, 22)) {
    spawnT = Math.max(0.5, 1.4 - wave * 0.05);
    const n = 1 + ((wave / 9) | 0);
    for (let i = 0; i < n; i++) {
      const tn = tier(wave),
        p =
          tn == 1
            ? ['drone', 'drone']
            : tn == 2
              ? ['striker', 'striker', 'bomber', 'gunner', 'juggernaut']
              : ['reaper', 'reaper', 'bomber', 'ringer', 'juggernaut', 'gunner'];
      if (tn == 1) {
        if (wave >= 2) p.push('splitter');
        if (wave >= 3) p.push('shooter');
        if (wave >= 4) p.push('brute');
      }
      const [x, y] = edge();
      spawn(pick(p), x, y, 1 + wave * (tn > 1 ? 0.09 : 0.12));
    }
  }
}
