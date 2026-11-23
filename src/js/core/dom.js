// Utilitários de DOM. esc() deve ser usado em todo o texto que vem dos dados.
export const $ = (id) => document.getElementById(id);
const MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => MAP[c]);
