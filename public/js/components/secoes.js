// Nav inteligente:
// - ecrã grande: marca no menu a secção que está a ser vista (classe "ativo");
// - telemóvel/tablet: cria um "card" fixo por baixo do cabeçalho com o nome da
//   secção atual (o CSS é a secção 25 do styles.css).
// Os dois partem dos links do #nav, por isso nada fica repetido no HTML.
export function initSecoes() {
  const nav = document.getElementById("nav");
  const header = document.querySelector("header");
  if (!nav || !header) return;

  // Cada link do nav aponta para uma secção (ou bloco) da página.
  const itens = [...nav.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, alvo: document.getElementById(link.getAttribute("href").slice(1)) }))
    .filter((i) => i.alvo);

  // 1) Cards. O card vai para dentro do bloco que ele deve "empurrar":
  //    a própria secção, ou o seu primeiro .sec-grupo (caso da Moda e gala).
  itens.forEach(({ link, alvo }) => {
    const dono = alvo.matches("section")
      ? alvo.querySelector(":scope > .sec-grupo") || alvo
      : alvo;
    if (dono.querySelector(":scope > .sec-card")) return;

    const card = document.createElement("div");
    card.className = "sec-card";
    card.setAttribute("aria-hidden", "true"); // o título real já está no h2
    card.textContent = link.textContent.trim();
    dono.prepend(card);

    const sec = dono.closest("section");
    if (sec) sec.classList.add("tem-card");
  });

  // 2) Secção ativa: entre as secções cujo topo já passou da linha, ganha a
  //    mais próxima dela. No fim da página ganha a última (Contactos é curta
  //    e nunca chegaria à linha).
  let atual = null;
  let pendente = false;

  function marcar(novo) {
    if (novo === atual) return;
    atual = novo;
    itens.forEach((i) => {
      const on = i === novo;
      i.link.classList.toggle("ativo", on);
      if (on) i.link.setAttribute("aria-current", "true");
      else i.link.removeAttribute("aria-current");
    });
  }

  function calcular() {
    pendente = false;
    const linha = header.offsetHeight + Math.min(160, window.innerHeight * 0.25);
    const noFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let escolhido = null;
    let melhor = -Infinity;
    itens.forEach((i) => {
      const topo = i.alvo.getBoundingClientRect().top;
      if (noFim ? topo > melhor : topo <= linha && topo > melhor) {
        melhor = topo;
        escolhido = i;
      }
    });
    marcar(escolhido);
  }

  function agendar() {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(calcular);
  }

  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar);
  window.addEventListener("load", agendar);
  calcular();
}
