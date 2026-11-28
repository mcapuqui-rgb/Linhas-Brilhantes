// Galeria de arte: nome, marca e pergunta por WhatsApp.
// Cada obra abre ampliada ao clicar. Obras com "tipo": "video" são cards de vídeo.
import { CONFIG } from "../core/config.js";
import { $, esc } from "../core/dom.js";

export function renderArte(d) {
  const box = $("arte");
  box.dataset.vermais = box.dataset.vermais || "4";
  box.innerHTML = d.obras.map((o) => {
    const msg = `Olá! Tenho interesse na obra “${o.nome}” (marca ${o.marca}) da galeria de arte. Podem informar-me sobre a compra ou o aluguer?`;
    const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    const video = o.tipo === "video" || !!o.video;
    const capa = o.poster || o.imagem;
    const img = capa ? `<img loading="lazy" src="${esc(capa)}" alt="${esc(o.nome)}">` : "";
    const dados = `data-card data-titulo="${esc(o.nome)}" data-sub="${esc(o.marca)}" data-desc="${esc(o.descricao)}" data-img="${esc(o.imagem)}" data-wa="${esc(wa)}"`
      + (video ? ` data-video="${esc(o.video)}" data-poster="${esc(capa)}"` : "");
    return `<div class="tile${capa ? " has-img" : ""}${video ? " tile-video" : ""}" ${dados}>${img}${video ? '<span class="play" aria-hidden="true"></span>' : ""}<span class="cap"><b class="ttl">${esc(o.nome)}</b><small>${esc(o.marca)}</small><a class="ask" target="_blank" rel="noopener" href="${esc(wa)}">Perguntar sobre esta obra</a></span></div>`;
  }).join("");
}
