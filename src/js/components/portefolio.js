// Portefólio: filtros por categoria e subcategoria.
import { $, esc } from "../core/dom.js";
import { atualizarCards } from "./cards.js";
import { ehVideo, renderVideoDestaque } from "./video-destaque.js";

export function renderPortefolio(d) {
  const box = $("pf");
  let cat = null, sub = null;
  // O vídeo do portefólio fica a toda a largura no topo, fora dos filtros
  const v = (d.fotos || []).find(ehVideo);
  renderVideoDestaque(box, v && { video: v.video, capa: v.poster || v.imagem, titulo: v.legenda });
  const btn = (a, v, t, on) => `<button data-${a}="${esc(v)}" class="${on ? "on" : ""}">${esc(t)}</button>`;
  const tiles = (s, k) => {
    const fs = (d.fotos || []).filter((f) => f.subcategoria === s.id && !ehVideo(f));
    return fs.length
      ? fs.map((f) => {
          const leg = f.legenda || s.nome;
          const dados = `data-card data-titulo="${esc(leg)}" data-sub="${esc(k.nome)}" data-desc="${esc(f.descricao)}" data-img="${esc(f.imagem)}" data-cta="#orcamento"`;
          const img = f.imagem ? `<img loading="lazy" src="${esc(f.imagem)}" alt="${esc(leg)}">` : "";
          return `<figure class="tile${f.imagem ? " has-img" : ""}" ${dados}>${img}<figcaption>${esc(leg)}</figcaption></figure>`;
        }).join("")
      : `<div class="tile" data-card data-titulo="${esc(s.nome)}" data-sub="${esc(k.nome)}" data-cta="#orcamento"><span>${esc(s.nome)}<small>${esc(k.nome)}</small></span></div>`;
  };
  const draw = () => {
    let h = `<div class="fl">${btn("k", "", "Todos", cat === null)}${d.categorias.map((k) => btn("k", k.id, k.nome, cat === k.id)).join("")}</div>`;
    const cur = d.categorias.find((k) => k.id === cat);
    if (cur) h += `<div class="fl">${btn("s", "", "Todas", sub === null)}${cur.subcategorias.map((s) => btn("s", s.id, s.nome, sub === s.id)).join("")}</div>`;
    h += '<div class="pg" data-vermais="4" data-linhas="2">';
    d.categorias.forEach((k) => {
      if (cat && cat !== k.id) return;
      k.subcategorias.forEach((s) => { if (!sub || sub === s.id) h += tiles(s, k); });
    });
    box.innerHTML = h + "</div>";
    atualizarCards(box);
  };
  box.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-k], button[data-s]"); // ignora o botão "Ver mais"
    if (!b) return;
    if ("k" in b.dataset) { cat = b.dataset.k || null; sub = null; } else { sub = b.dataset.s || null; }
    draw();
  });
  draw();
}
