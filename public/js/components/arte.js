// Galeria de arte: nome, marca e pergunta por WhatsApp.
// Cada obra abre ampliada ao clicar. A obra com vídeo ("tipo": "video") fica a toda a
// largura no topo; as restantes (imagens) formam a grelha por baixo.
import { CONFIG } from "../core/config.js";
import { $, esc } from "../core/dom.js";
import { ehVideo, renderVideoDestaque } from "./video-destaque.js";

const linkWa = (o) => {
  const msg = `Olá! Tenho interesse na obra “${o.nome}” (marca ${o.marca}) da galeria de arte. Podem informar-me sobre a compra ou o aluguer?`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
};

export function renderArte(d) {
  const box = $("arte");
  box.dataset.vermais = box.dataset.vermais || "4";
  box.dataset.linhas = box.dataset.linhas || "2";

  const obras = d.obras || [];
  const v = obras.find(ehVideo);
  renderVideoDestaque(box, v && { video: v.video, capa: v.poster || v.imagem, titulo: v.nome, sub: v.marca, wa: linkWa(v) });

  box.innerHTML = obras.filter((o) => !ehVideo(o)).map((o) => {
    const wa = linkWa(o);
    const img = o.imagem ? `<img loading="lazy" src="${esc(o.imagem)}" alt="${esc(o.nome)}">` : "";
    const dados = `data-card data-titulo="${esc(o.nome)}" data-sub="${esc(o.marca)}" data-desc="${esc(o.descricao)}" data-img="${esc(o.imagem)}" data-wa="${esc(wa)}"`;
    return `<div class="tile${o.imagem ? " has-img" : ""}" ${dados}>${img}<span class="cap"><b class="ttl">${esc(o.nome)}</b><small>${esc(o.marca)}</small><a class="ask" target="_blank" rel="noopener" href="${esc(wa)}">Perguntar sobre esta obra</a></span></div>`;
  }).join("");
}
