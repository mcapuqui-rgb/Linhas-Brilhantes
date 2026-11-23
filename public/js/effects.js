// Animação do início: tesouras a percorrer as duas linhas.
export function initHero() {
  const tps = document.querySelectorAll(".thread path"), sc = document.getElementById("sc"),
        nd = document.getElementById("nd"), hr = document.getElementById("inicio");
  if (tps.length < 2 || !sc || !nd || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const Ls = [tps[0].getTotalLength(), tps[1].getTotalLength()];
  let t0 = null;
  const place = (el, path, L, p, flip) => {
    const m = path.getScreenCTM(), h = hr.getBoundingClientRect(), q = flip ? 1 - p : p, d = flip ? -3 : 3;
    const a = path.getPointAtLength(q * L).matrixTransform(m);
    const b = path.getPointAtLength(Math.min(L, Math.max(0, q * L + d))).matrixTransform(m);
    const g = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    el.style.transform = `translate(${a.x - h.left - 14}px,${a.y - h.top - 14}px) rotate(${g}deg)${flip ? " scaleY(-1)" : ""}`;
    el.style.visibility = "visible";
  };
  requestAnimationFrame(function step(ts) {
    if (t0 === null) t0 = ts;
    const c = ((ts - t0) / 16000) % 1;
    place(sc, tps[0], Ls[0], c, false);
    place(nd, tps[1], Ls[1], c, true);
    requestAnimationFrame(step);
  });
}
