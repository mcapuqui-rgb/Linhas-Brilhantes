// Põe o véu no fundo 2 s depois de uma secção ficar em foco.
// Ao mudar de secção, o véu desce e volta a subir 2 s depois.
export function initBgVeil({ delay = 2000 } = {}) {
  const root = document.documentElement;
  const secoes = [...document.querySelectorAll("section")];
  let timer = null;
  let atual = null;

  function ativar(secao) {
    if (secao === atual) return;
    atual = secao;
    clearTimeout(timer);
    root.classList.remove("bg-calmo");
    timer = setTimeout(() => root.classList.add("bg-calmo"), delay);
  }

  // Sem secções ou sem IntersectionObserver: comportamento simples
  if (!secoes.length || !("IntersectionObserver" in window)) {
    timer = setTimeout(() => root.classList.add("bg-calmo"), delay);
    return;
  }

  // Altura visível (em px) de cada secção. Usa pixels e não percentagem,
  // porque em telemóvel as secções são mais altas que o ecrã.
  const visivel = new Map();

  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        visivel.set(e.target, e.isIntersecting ? e.intersectionRect.height : 0);
      });

      let melhor = null;
      let max = 0;
      visivel.forEach((h, el) => {
        if (h > max) { max = h; melhor = el; }
      });
      if (melhor) ativar(melhor);
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
  );

  secoes.forEach((s) => io.observe(s));
}