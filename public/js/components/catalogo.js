// Produtos e serviços: uma linha por categoria.
import { $, esc } from "../core/dom.js";

export function renderCatalogo(d) {
  const box = $("cats");
  box.dataset.vermais = box.dataset.vermais || "4";
  box.innerHTML = d.categorias.map((k) =>
    `<div class="row"><h3>${esc(k.nome)}</h3><p>${esc(k.subcategorias.map((s) => s.nome).join(", ") + (k.mais ? ", e muito mais" : ""))}</p><a href="#orcamento" data-c="${esc(k.nome)}">Pedir orçamento</a></div>`
  ).join("");
  box.addEventListener("click", (e) => {
    const a = e.target.closest("[data-c]");
    if (a) $("catsel").value = a.dataset.c;
  });
}
