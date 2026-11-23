// Desenha as secções a partir dos dados. Tudo o que vem dos dados passa por esc().
import { CONFIG, PROVINCIAS } from "./config.js";

const $ = (id) => document.getElementById(id);
const MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => MAP[c]);

export function fillProvincias() {
  const p = document.querySelector("[name=prov]");
  PROVINCIAS.forEach((n) => p.add(new Option(n, n)));
}

export function fillCategorias(d) {
  const c = $("catsel");
  d.categorias.forEach((k) => c.add(new Option(k.nome, k.nome)));
}

export function renderCatalogo(d) {
  const box = $("cats");
  box.innerHTML = d.categorias.map((k) =>
    `<div class="row"><h3>${esc(k.nome)}</h3><p>${esc(k.subcategorias.map((s) => s.nome).join(", ") + (k.mais ? ", e muito mais" : ""))}</p><a href="#orcamento" data-c="${esc(k.nome)}">Pedir orçamento</a></div>`
  ).join("");
  box.addEventListener("click", (e) => {
    const c = e.target.dataset && e.target.dataset.c;
    if (c) $("catsel").value = c;
  });
}

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

export function renderArte(d) {
  $("arte").innerHTML = d.obras.map((o) => {
    const msg = `Olá! Tenho interesse na obra “${o.nome}” (marca ${o.marca}) da galeria de arte. Podem informar-me sobre a compra ou o aluguer?`;
    const img = o.imagem ? `<img loading="lazy" src="${esc(o.imagem)}" alt="${esc(o.nome)}">` : "";
    return `<div class="tile${o.imagem ? " has-img" : ""}">${img}<span class="cap"><b class="ttl">${esc(o.nome)}</b><small>${esc(o.marca)}</small><a class="ask" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}">Perguntar sobre esta obra</a></span></div>`;
  }).join("");
}

export function renderClientes(d) {
  const box = $("nm"), N = d.clientes.map((c) => c.nome);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
    box.innerHTML = N.map((n) => `<span>${esc(n)}</span>`).join("");
    return;
  }
  const row = (list, cls, dur) =>
    `<div class="trk ${cls}" style="animation-duration:${dur}s">${list.concat(list).map((t, i) => `<span${i >= list.length ? ' aria-hidden="true"' : ""}>${esc(t)}</span>`).join("")}</div>`;
  box.className = "mq";
  box.innerHTML = row(N, "", 46) + row(N.slice().reverse(), "r", 58);
}
