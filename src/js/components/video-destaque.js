// Vídeo da secção: um só, a toda a largura, por cima da grelha de imagens.
// Um item é vídeo se tiver "tipo": "video" ou o campo "video" no catalogo.json.
import { esc } from "../core/dom.js";

export const ehVideo = (o) => !!o && (o.tipo === "video" || !!o.video);

// Mostra o vídeo antes de "ancora" (a grelha). Sem vídeo, remove o bloco.
// v = { video, capa, titulo, sub, wa }
export function renderVideoDestaque(ancora, v) {
  const prev = ancora.previousElementSibling;
  if (prev && prev.classList.contains("video-destaque")) prev.remove();
  if (!v || !v.video) return;

  // Sem capa, o navegador mostra um fotograma do próprio vídeo (#t=0.5)
  const poster = v.capa ? ` poster="${esc(v.capa)}"` : "";
  const src = esc(v.video) + (v.capa ? "" : "#t=0.5");
  const legenda = v.titulo
    ? `<figcaption><b class="ttl">${esc(v.titulo)}</b>${v.sub ? `<small>${esc(v.sub)}</small>` : ""}`
      + (v.wa ? `<a class="ask" target="_blank" rel="noopener" href="${esc(v.wa)}">Perguntar sobre esta obra</a>` : "")
      + "</figcaption>"
    : "";

  const fig = document.createElement("figure");
  fig.className = "video-destaque";
  fig.innerHTML = `<video controls playsinline preload="metadata"${poster} src="${src}"></video>${legenda}`;
  ancora.before(fig);
}
