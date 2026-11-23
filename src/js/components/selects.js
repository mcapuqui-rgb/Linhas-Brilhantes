// Preenche as listas do formulário (províncias e categorias).
import { PROVINCIAS } from "../core/config.js";
import { $ } from "../core/dom.js";

export function fillProvincias() {
  const p = document.querySelector("[name=prov]");
  PROVINCIAS.forEach((n) => p.add(new Option(n, n)));
}

export function fillCategorias(d) {
  const c = $("catsel");
  d.categorias.forEach((k) => c.add(new Option(k.nome, k.nome)));
}
