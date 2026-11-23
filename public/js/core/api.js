// Camada de dados: o resto do site só chama getCatalogo().
// Hoje lê um ficheiro JSON; amanhã lê a API, sem mexer no resto do código.
import { CONFIG } from "./config.js";

async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

let cache = null;
export function getCatalogo() {
  if (!cache) {
    const u = CONFIG.apiUrl;
    cache = u
      ? Promise.all(["categorias", "fotos", "obras", "clientes"].map((p) => getJson(`${u}/${p}`)))
          .then(([categorias, fotos, obras, clientes]) => ({ categorias, fotos, obras, clientes }))
      : getJson(CONFIG.dataUrl);
  }
  return cache;
}
