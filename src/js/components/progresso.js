// Linha de progresso de cada secção, no card fixo por baixo do menu
// (só se vê em tablet e telemóvel, onde o .sec-card existe).
// A linha enche à medida que se percorre a secção: vazia quando o card cola
// no cabeçalho, cheia quando o card seguinte o empurra para fora.
// Tem de ser chamada depois de initSecoes(), que cria os cards.
export function initProgresso() {
  const itens = [...document.querySelectorAll(".sec-card")].map((card) => {
    let barra = card.querySelector(":scope > .sec-prog");
    if (!barra) {
      barra = document.createElement("span");
      barra.className = "sec-prog";
      barra.setAttribute("aria-hidden", "true");
      card.appendChild(barra);
    }
    return { card, barra, pai: card.parentElement };
  });
  if (!itens.length) return;

  let pendente = false;

  function calcular() {
    pendente = false;
    itens.forEach(({ card, barra, pai }) => {
      const cs = getComputedStyle(card);
      if (cs.display === "none") return; // computador: não há cards

      const colaEm = parseFloat(cs.top) || 0;             // onde o card fica preso
      const r = pai.getBoundingClientRect();
      const percurso = r.height - card.offsetHeight;      // distância em que o card fica preso
      const p = percurso > 0 ? Math.min(1, Math.max(0, (colaEm - r.top) / percurso)) : 0;
      barra.style.setProperty("--p", p.toFixed(4));
    });
  }

  function agendar() {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(calcular);
  }

  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar);
  window.addEventListener("load", agendar);
  // A secção muda de altura sem scroll (ex.: "Ver mais", imagens a carregar)
  if ("ResizeObserver" in window) new ResizeObserver(agendar).observe(document.body);
  calcular();
}
