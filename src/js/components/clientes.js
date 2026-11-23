// Clientes e parceiros: faixas animadas.
import { $, esc } from "../core/dom.js";

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
