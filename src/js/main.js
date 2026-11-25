// Arranque: liga os componentes e desenha o conteúdo vindo dos dados.
import { getCatalogo } from "./core/api.js";
import { initMenu } from "./components/menu.js";
import { initHero } from "./components/hero.js";
import { initHeroBg } from "./components/hero-bg.js";
import { initForm } from "./components/orcamento.js";
import { fillProvincias, fillCategorias } from "./components/selects.js";
import { renderCatalogo } from "./components/catalogo.js";
import { renderPortefolio } from "./components/portefolio.js";
import { renderArte } from "./components/arte.js";
import { renderClientes } from "./components/clientes.js";

initMenu();
fillProvincias();
initHero();
initHeroBg();
initForm();

// Galeria de arte: pré-visualização de 4 obras com botão "Ver mais".
// Fica antes do await para ficar sempre ligado, mesmo que o catálogo demore ou falhe.
(function () {
  var grid = document.getElementById("arte");
  var box = document.getElementById("arte-more");
  if (!grid || !box) return;

  var btn = box.querySelector("button");
  var LIMITE = 4;

  // Marca como "extra" as obras a partir da 5.ª e esconde o botão se não houver
  function atualizar() {
    var itens = grid.querySelectorAll(".tile");
    itens.forEach(function (el, i) {
      el.classList.toggle("extra", i >= LIMITE);
    });
    box.classList.toggle("vazio", itens.length <= LIMITE);
  }

  atualizar();
  new MutationObserver(atualizar).observe(grid, {
    childList: true,
    subtree: true
  });

  btn.addEventListener("click", function () {
    var aberta = grid.classList.toggle("aberta");
    btn.textContent = aberta ? "Ver menos" : "Ver mais";
    btn.setAttribute("aria-expanded", aberta);

    if (!aberta) {
      document.getElementById("galeria-de-arte").scrollIntoView({ block: "start" });
    }
  });
})();

try {
  const d = await getCatalogo();
  fillCategorias(d);
  renderCatalogo(d);
  renderPortefolio(d);
  renderArte(d);
  renderClientes(d);
} catch (err) {
  console.error(err);
  document.querySelectorAll("#cats,#pf,#arte,#nm").forEach((el) => {
    el.innerHTML = '<p class="note">Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
  });
}