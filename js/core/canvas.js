// Setup canvas, ukuran layar (W,H), resize
const cv = document.getElementById('c'),
  g = cv.getContext('2d');
let W, H;
function rs() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * d;
  cv.height = H * d;
  g.setTransform(d, 0, 0, d, 0, 0);
}
addEventListener('resize', rs);
rs();
