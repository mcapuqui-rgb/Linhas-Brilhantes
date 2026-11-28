// Clientes e parceiros: faixas animadas. Logo quando existe, nome quando não.
import { $, esc } from "../core/dom.js";

export function renderClientes(d) {
  const box = $("nm"), C = d.clientes;

  // dup = cópia da faixa (aria-hidden): imagem sem alt para não ser lida duas vezes
  const item = (c, dup) => c.logo
    ? `<span class="cli"${dup ? ' aria-hidden="true"' : ""}><img src="${esc(c.logo)}" alt="${dup ? "" : esc(c.nome)}" height="56" decoding="async"></span>`
    : `<span${dup ? ' aria-hidden="true"' : ""}>${esc(c.nome)}</span>`;

  if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
    box.innerHTML = C.map((c) => item(c, false)).join("");
    return;
  }

  const row = (list, cls, dur) =>
    `<div class="trk ${cls}" style="animation-duration:${dur}s">${list.map((c) => item(c, false)).join("")}${list.map((c) => item(c, true)).join("")}</div>`;

  box.className = "mq";
  
  box.innerHTML = row(C, "", 46);
}
