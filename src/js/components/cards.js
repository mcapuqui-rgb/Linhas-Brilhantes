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

function ligarVerMais(raiz) {
  raiz.querySelectorAll("[data-vermais]").forEach((grid) => {
    const limite = parseInt(grid.dataset.vermais, 10) || 4;
    const itens = [...grid.querySelectorAll(":scope > .tile")];
    itens.forEach((c, i) => c.classList.toggle("extra", i >= limite));

    // Reaproveita um .gal-more que já esteja a seguir à grelha; senão cria um
    let box = grid.nextElementSibling;
    if (!box || !box.classList.contains("gal-more")) {
      box = el("div", "gal-more");
      const b = el("button", "btn gold", "Ver mais");
      b.type = "button";
      box.appendChild(b);
      grid.after(box);
    }
    const btn = box.querySelector("button");
    if (!grid.id) grid.id = "vm" + ++seq;
    btn.setAttribute("aria-controls", grid.id);
    if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
    box.classList.toggle("vazio", itens.length <= limite);

    if (box.dataset.ligado) return;
    box.dataset.ligado = "1";
    btn.addEventListener("click", () => {
      const aberta = grid.classList.toggle("aberta");
      btn.textContent = aberta ? "Ver menos" : "Ver mais";
      btn.setAttribute("aria-expanded", String(aberta));
      if (!aberta) (grid.closest(".sec-grupo, section") || grid).scrollIntoView({ block: "start" });
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
