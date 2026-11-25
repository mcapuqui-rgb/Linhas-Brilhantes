// Fundo do hero que alterna entre imagens com fade.
// Só usa as imagens que realmente carregam: se uma não existir, é ignorada.
const IMAGENS = [
  "img/Background/Background4.jpg",
  "img/Background/Background2.jpg",
  "img/Background/Background3.jpg",
  "img/Background/Background1.jpg"
  // "img/Background/f.jpg"   // tire as barras para incluir esta imagem
];
const INTERVALO = 7000; // ms entre trocas

function carregar(src) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () { resolve(src); };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}

export async function initHeroBg() {
  const hero = document.getElementById("inicio");
  if (!hero) return;

  // Respeita "movimento reduzido": fica o fundo estático do CSS (--hero-img)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ok = (await Promise.all(IMAGENS.map(carregar))).filter(Boolean);
  if (ok.length < 2) return;

  const caixa = document.createElement("div");
  caixa.className = "hero-slides";
  caixa.setAttribute("aria-hidden", "true");

  const slides = ok.map(function (src, i) {
    const s = document.createElement("div");
    s.className = "hero-slide" + (i === 0 ? " on" : "");
    s.style.backgroundImage = 'url("' + src + '")';
    caixa.appendChild(s);
    return s;
  });
  hero.prepend(caixa);

  let atual = 0;
  let timer = null;

  function proxima() {
    slides[atual].classList.remove("on");
    atual = (atual + 1) % slides.length;
    slides[atual].classList.add("on");
  }

  function iniciar() { if (!timer) timer = setInterval(proxima, INTERVALO); }
  function parar() { clearInterval(timer); timer = null; }

  iniciar();
  // Pausa quando o separador não está visível (poupa bateria)
  document.addEventListener("visibilitychange", function () {
    document.hidden ? parar() : iniciar();
  });
}