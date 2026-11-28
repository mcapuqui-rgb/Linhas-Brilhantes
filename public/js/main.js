// Arranque: liga os componentes e desenha o conteúdo vindo dos dados.
import { getCatalogo } from "./core/api.js";
import { initMenu } from "./components/menu.js";
import { initSecoes } from "./components/secoes.js";
import { initProgresso } from "./components/progresso.js";
import { initHero } from "./components/hero.js";
import { initHeroBg } from "./components/hero-bg.js";
import { initForm } from "./components/orcamento.js";
import { fillProvincias, fillCategorias } from "./components/selects.js";
import { renderCatalogo } from "./components/catalogo.js";
import { renderPortefolio } from "./components/portefolio.js";
import { renderArte } from "./components/arte.js";
import { renderClientes } from "./components/clientes.js";
import { initBgVeil } from "./components/bg-veil.js";
import { initCards, atualizarCards } from "./components/cards.js";

initMenu();
initSecoes();
initProgresso();
fillProvincias();
initHero();
initHeroBg();
initForm();
initBgVeil({ delay: 500 });
// Fundo: ao abrir, as imagens aparecem sem véu. Passados ESPERA ms
// (contados depois de a página carregar), a classe "bg-calmo" sobe o véu.
// O CSS faz a transição (ver --veil-time e html::after no styles.css).


// Cards interativos (ampliar, "Ver mais" em ecrãs pequenos). Fica antes do await
// para os cards de Moda e gala funcionarem mesmo que o catálogo demore ou falhe.
initCards();

try {
  const d = await getCatalogo();
  fillCategorias(d);
  renderCatalogo(d);
  renderPortefolio(d);
  renderArte(d);
  renderClientes(d);
  atualizarCards();
} catch (err) {
  console.error(err);
  document.querySelectorAll("#cats,#pf,#arte,#nm").forEach((el) => {
    el.innerHTML = '<p class="note">Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
  });
}