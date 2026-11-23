// Portefólio: filtros por categoria e subcategoria.
import { $, esc } from "../core/dom.js";

export function renderPortefolio(d) {
  const box = $("pf");
  let cat = null, sub = null;
  const btn = (a, v, t, on) => `<button data-${a}="${esc(v)}" class="${on ? "on" : ""}">${esc(t)}</button>`;
  const tiles = (s, k) => {
    const fs = (d.fotos || []).filter((f) => f.subcategoria === s.id);
    return fs.length
      ? fs.map((f) => `<figure class="tile has-img"><img loading="lazy" src="${esc(f.imagem)}" alt="${esc(f.legenda || s.nome)}"><figcaption>${esc(f.legenda || s.nome)}</figcaption></figure>`).join("")
      : `<div class="tile"><span>${esc(s.nome)}<small>${esc(k.nome)}</small></span></div>`;
  };
  const draw = () => {
    let h = `<div class="fl">${btn("k", "", "Todos", cat === null)}${d.categorias.map((k) => btn("k", k.id, k.nome, cat === k.id)).join("")}</div>`;
    const cur = d.categorias.find((k) => k.id === cat);
    if (cur) h += `<div class="fl">${btn("s", "", "Todas", sub === null)}${cur.subcategorias.map((s) => btn("s", s.id, s.nome, sub === s.id)).join("")}</div>`;
    h += '<div class="pg">';
    d.categorias.forEach((k) => {
      if (cat && cat !== k.id) return;
      k.subcategorias.forEach((s) => { if (!sub || sub === s.id) h += tiles(s, k); });
    });
    box.innerHTML = h + "</div>";
  };
  box.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if ("k" in b.dataset) { cat = b.dataset.k || null; sub = null; } else { sub = b.dataset.s || null; }
    draw();
  });
  draw();
}
