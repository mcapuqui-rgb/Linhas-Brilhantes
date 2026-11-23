// Formulário de orçamento: valida e abre o WhatsApp com a mensagem pronta.
import { CONFIG } from "../core/config.js";

export function initForm() {
  document.getElementById("qf").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.site.value) return; // campo-armadilha contra spam
    let bad = false;
    f.querySelectorAll("[required]").forEach((i) => {
      const s = i.parentNode.querySelector(".err");
      let m = "";
      if (!i.value.trim()) m = "Campo obrigatório.";
      else if (i.name === "tel" && !/^[+\d\s]{9,15}$/.test(i.value.trim())) m = "Indique um número de telefone válido.";
      else if (i.name === "qtd" && +i.value < 1) m = "Indique uma quantidade de 1 ou mais.";
      s.textContent = m;
      if (m) bad = true;
    });
    if (bad) { f.querySelector(".err:not(:empty)").parentNode.querySelector("input,select").focus(); return; }
    const v = (n) => f[n].value.trim() || "-";
    const t = `Pedido de orçamento - Linhas Brilhantes
Nome: ${v("nome")}
Empresa: ${v("empresa")}
Telefone: ${v("tel")}
Email: ${v("email")}
Local: ${v("mun")}, ${v("prov")}
Modalidade: ${f.mod.value}
Entrega: ${f.ent.value}
Categoria: ${v("cat")}
Quantidade: ${v("qtd")}
Tamanhos/cores: ${v("tc")}
Personalização: ${v("pers")}
Notas: ${v("desc")}`;
    document.getElementById("ok").style.display = "block";
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
  });
}
