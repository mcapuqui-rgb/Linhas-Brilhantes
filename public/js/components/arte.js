// Galeria de arte: nome, marca e pergunta por WhatsApp.
import { CONFIG } from "../core/config.js";
import { $, esc } from "../core/dom.js";

export function renderArte(d) {
  $("arte").innerHTML = d.obras.map((o) => {
    const msg = `Olá! Tenho interesse na obra “${o.nome}” (marca ${o.marca}) da galeria de arte. Podem informar-me sobre a compra ou o aluguer?`;
    const img = o.imagem ? `<img loading="lazy" src="${esc(o.imagem)}" alt="${esc(o.nome)}">` : "";
    return `<div class="tile${o.imagem ? " has-img" : ""}">${img}<span class="cap"><b class="ttl">${esc(o.nome)}</b><small>${esc(o.marca)}</small><a class="ask" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}">Perguntar sobre esta obra</a></span></div>`;
  }).join("");
}
