// Konstanta balance: tier(wave), LET (zona maut), SUP (super boss), heal, orbital blade
const tier = (w) => (w >= 11 ? 3 : w >= 6 ? 2 : 1),
  LET = 8,
  SUP = 15,
  SUPT = ['Kau hanya serpihan kode.', 'Semua pola ini untukmu.', 'Menarilah, lalu musnah.'];

// Heal (tombol C): cooldown dalam detik & persentase max HP yang dipulihkan
const HEAL_CD = 60,
  HEAL_PCT = 0.3;

// Orbital blade: jarak orbit dari pemain, radius tabrakan, radius gambar
const ORB_R = 100,
  ORB_HIT = 13,
  ORB_SIZE = 10;
