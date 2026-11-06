# NEON SWARM

Game arcade survival berbasis canvas. Buka `index.html` langsung di browser (tanpa build / server).

## Struktur

```
index.html
css/style.css
js/
  core/canvas.js                Setup canvas, ukuran layar (W,H), resize
  core/utils.js                 Helper umum: TAU, R (random), cl (clamp), pick, shuf
  core/state.js                 Semua variabel state global game (P, E, B, wave, score, S=state layar, dll)
  core/audio.js                 Efek suara sederhana (WebAudio) - snd()
  core/ai.js                    AI opsional (Ollama lokal) untuk ejekan boss & epitaf; fallback jika offline
  data/texts.js                 Daftar kalimat ejekan boss & epitaf cadangan
  data/upgrades.js              Daftar upgrade level-up (UP) - tambah upgrade baru di sini
  data/enemies.js               Definisi stat musuh (ET) - tambah tipe musuh baru di sini
  data/config.js                Konstanta balance: tier(wave), LET (zona maut), SUP (super boss)
  game/init.js                  init() = reset & mulai game, banner() = teks tengah layar
  game/effects.js               pf() = efek partikel
  game/player.js                Aksi pemain: dash(), hurt(), die()
  enemies/spawn.js              spawn(), edge(), evolve() (evolusi tier), blast() (ledakan bomber)
  enemies/boss.js               spawnBoss() & spawnSuper() - kemunculan boss
  enemies/secretboss.js           spawnSecret() - Secret Boss "Prism Sentinel" (wave 6, 11, 15, 20)
  enemies/superboss.js          AI & pola serangan Super Boss (sup())
  combat/damage.js              kill(), hit(), chain() petir, boom() ledakan peluru
  combat/skills.js              Skill aktif: nova() Q, laser() E, hole() R
  update/player.js              Gerak, bidik, dash, tembak otomatis pemain
  update/waves.js               Timer wave & spawn musuh
  update/bullets.js             Gerak & tabrakan peluru pemain
  update/enemies.js             AI per tipe musuh + tabrakan dengan pemain + orbital blade
  update/projectiles.js         Peluru musuh & hazard (ring/beam) musuh
  update/pickups.js             Orb XP, level up, pilihan kartu
  update/fx.js                  Partikel, vortex black hole, timer efek, combo
  update/secretboss.js            AI Secret Boss: pola laser layar penuh + pre-laser
  update/index.js               upd(dt) = urutan pembaruan per frame (memanggil file update/* lainnya)
  input/keyboard-mouse.js       Input keyboard & mouse
  input/touch.js                Input sentuh: stik analog & tombol skill mobile
  ui/cards.js                   Layout & klik kartu upgrade
  ui/buttons.js                 Tombol UI kecil (fullscreen, pause) + hit test
  ui/fullscreen.js              Fungsi fullscreen
  ui/touch-hud.js               Gambar stik & tombol di mobile
  ui/skill-hud.js               Gambar ikon skill Q/E/R di desktop
  render/primitives.js          Helper gambar: poly(), neon(), tx() teks, bar()
  render/background.js          Latar & grid
  render/entities.js            Gambar orb, peluru, musuh, pemain
  render/effects.js             Gambar hazard, ring, beam, petir, vortex, teks damage, partikel
  render/world.js               Menyusun semua gambar dunia game (dengan screen shake)
  render/hud.js                 Vignette, flash merah, HUD (HP, XP, skor, wave, boss bar)
  render/screens.js             Layar menu, pause, level-up, game over
  render/draw.js                draw() = urutan render per frame
  main.js                       Game loop - HARUS dimuat paling akhir
```

## Catatan untuk pengembangan

- Semua file JS adalah script klasik yang berbagi scope global (bukan ES module), jadi game tetap jalan dengan membuka file langsung (`file://`).
- Urutan `<script>` di `index.html` penting; `main.js` harus terakhir.
- State global (P, E, B, wave, score, S, dll) ada di `js/core/state.js`.
- `S` = layar aktif: `menu | play | pause | levelup | dead`.

## Cara menambah sesuatu

| Mau tambah...        | Edit file...                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| Upgrade baru         | `data/upgrades.js`                                                        |
| Tipe musuh baru      | `data/enemies.js` (stat) + `update/enemies.js` (AI) + `enemies/spawn.js` / `update/waves.js` (kapan muncul) |
| Skill baru           | `combat/skills.js` + tombol di `input/keyboard-mouse.js`, `input/touch.js`, `ui/skill-hud.js` |
| Pola / kesulitan secret boss | `update/secretboss.js` (pola & timing), `enemies/secretboss.js` (HP), `data/config.js` (`SEC_WAVES`) |
| Atur balance wave    | `data/config.js`, `update/waves.js`                                       |
| Tampilan HUD         | `render/hud.js`                                                           |
| Layar menu / game over | `render/screens.js`                                                     |

Tips hemat token saat prompting: sebutkan hanya file yang relevan (mis. "ubah `js/update/enemies.js`").
