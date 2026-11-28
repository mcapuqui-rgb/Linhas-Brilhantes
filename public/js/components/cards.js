// Cards interativos:
// 1) clicar no próprio card abre-o ampliado, com mais informação (e vídeo, se for um card de vídeo);
// 2) em ecrãs pequenos mostra no máximo N cards por grelha, com botão "Ver mais".
//
// Como marcar um card (o JS dos componentes já faz isto):
//   <div class="tile" data-card data-titulo="..." data-sub="..." data-desc="..."
//        data-img="..." data-video="..." data-poster="..." data-wa="..." data-cta="#orcamento">
// Como marcar uma grelha com limite:  <div data-vermais="4"> ...cards... </div>

let dlg = null;
let ultimo = null;
let seq = 0;

function el(tag, cls, texto) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (texto) e.textContent = texto;
  return e;
}

// ---------- Janela ampliada ----------

function criarDialogo() {
  if (dlg) return dlg;
  dlg = el("dialog", "mod");
  dlg.setAttribute("aria-labelledby", "mod-ttl");

  const x = el("button", "mod-x", "×");
  x.type = "button";
  x.setAttribute("aria-label", "Fechar");
  x.addEventListener("click", () => dlg.close());

  dlg.append(x, el("div", "mod-corpo"));
  document.body.appendChild(dlg);

  // Clique no fundo escuro (o alvo é o próprio dialog) fecha
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", limpar);
  return dlg;
}

function limpar() {
  const v = dlg.querySelector("video");
  if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
  dlg.querySelector(".mod-corpo").textContent = "";
  document.documentElement.classList.remove("modal-aberto");
  if (ultimo) ultimo.focus({ preventScroll: true });
}

function abrir(card) {
  const d = card.dataset;
  criarDialogo();
  const corpo = dlg.querySelector(".mod-corpo");
  corpo.textContent = "";

  // Média: vídeo, imagem, ou aviso quando ainda não há ficheiro
  const midia = el("div", "mod-midia");
  const ehVideo = "video" in d;
  if (ehVideo && d.video) {
    const v = el("video");
    v.controls = true;
    v.playsInline = true;
    v.preload = "metadata";
    if (d.poster) v.poster = d.poster;
    v.src = d.video;
    midia.appendChild(v);
  } else if (!ehVideo && d.img) {
    const i = el("img");
    i.src = d.img;
    i.alt = d.titulo || "";
    midia.appendChild(i);
  } else {
    midia.appendChild(el("p", "mod-vazio", ehVideo ? "Vídeo em breve." : "Fotografia a adicionar."));
  }

  // Informação
  const info = el("div", "mod-info");
  const h = el("h3", "mod-ttl", d.titulo || card.textContent.trim());
  h.id = "mod-ttl";
  info.appendChild(h);
  if (d.sub) info.appendChild(el("p", "mod-sub", d.sub));
  if (d.desc) info.appendChild(el("p", "mod-desc", d.desc));

  if (d.wa || d.cta) {
    const acoes = el("div", "mod-acoes");
    if (d.wa) {
      const a = el("a", "btn gold", "Perguntar no WhatsApp");
      a.href = d.wa; a.target = "_blank"; a.rel = "noopener";
      acoes.appendChild(a);
    }
    if (d.cta) {
      const a = el("a", "btn", "Pedir orçamento");
      a.href = d.cta;
      a.addEventListener("click", () => dlg.close());
      acoes.appendChild(a);
    }
    info.appendChild(acoes);
  }

  corpo.append(midia, info);
  ultimo = card;
  document.documentElement.classList.add("modal-aberto");
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");

  // Vídeo: o clique no card é a interação do utilizador, por isso pode arrancar já
  const v = dlg.querySelector("video");
  if (v) v.play().catch(() => {});
}

// ---------- Cards ----------

// Torna cada card marcado clicável e acessível por teclado (Tab + Enter/Espaço),
// sem acrescentar nenhum elemento ao card.
function ligarCards(raiz) {
  raiz.querySelectorAll(".tile[data-card]").forEach((c) => {
    if (c.hasAttribute("tabindex")) return;
    c.tabIndex = 0;
    c.setAttribute("aria-haspopup", "dialog");
    c.setAttribute("aria-label", "Ver detalhes: " + (c.dataset.titulo || c.textContent.trim()));
  });
}

// ---------- "Ver mais" ----------
// Em ecrãs pequenos mostra N cards; cada clique em "Ver mais" revela mais N.
// Quando já estão todos visíveis, o botão passa a "Ver menos" e volta aos N iniciais.

const CARDS = ":scope > .tile, :scope > .row";

function limiteDe(grid) {
  return parseInt(grid.dataset.vermais, 10) || 4;
}

function aplicarLimite(grid, box) {
  const limite = limiteDe(grid);
  const itens = [...grid.querySelectorAll(CARDS)];
  const n = Math.max(limite, parseInt(grid.dataset.mostrar, 10) || limite);
  itens.forEach((c, i) => c.classList.toggle("extra", i >= n));

  const btn = box.querySelector("button");
  btn.textContent = n >= itens.length ? "Ver menos" : "Ver mais";
  btn.setAttribute("aria-expanded", String(n > limite));
  box.classList.toggle("vazio", itens.length <= limite);
}

function ligarVerMais(raiz) {
  raiz.querySelectorAll("[data-vermais]").forEach((grid) => {
    // Reaproveita um .gal-more que já esteja a seguir à grelha; senão cria um
    let box = grid.nextElementSibling;
    if (!box || !box.classList.contains("gal-more")) {
      box = el("div", "gal-more");
      const b = el("button", "btn gold", "Ver mais");
      b.type = "button";
      box.appendChild(b);
      grid.after(box);
    }
    if (!grid.id) grid.id = "vm" + ++seq;
    box.querySelector("button").setAttribute("aria-controls", grid.id);

    aplicarLimite(grid, box);

    if (box.dataset.ligado) return;
    box.dataset.ligado = "1";
    box.querySelector("button").addEventListener("click", () => {
      const limite = limiteDe(grid);
      const total = grid.querySelectorAll(CARDS).length;
      const n = Math.max(limite, parseInt(grid.dataset.mostrar, 10) || limite);

      if (n >= total) {
        grid.dataset.mostrar = String(limite);
        aplicarLimite(grid, box);
        (grid.closest(".sec-grupo, section") || grid).scrollIntoView({ block: "start" });
      } else {
        grid.dataset.mostrar = String(n + limite);
        aplicarLimite(grid, box);
      }
    });
  });
}

// ---------- API pública ----------

// Chamar depois de desenhar cards novos (idempotente).
export function atualizarCards(raiz = document) {
  ligarCards(raiz);
  ligarVerMais(raiz);
}

// Chamar uma vez no arranque.
export function initCards() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return; // o link "Perguntar..." continua a funcionar
    const c = e.target.closest(".tile[data-card]");
    if (c) abrir(c);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const c = e.target.closest && e.target.closest(".tile[data-card]");
    if (c && e.target === c) {
      e.preventDefault();
      abrir(c);
    }
  });

  atualizarCards();
}
