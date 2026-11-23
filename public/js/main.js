// Arranque: liga os componentes e desenha o conteúdo vindo dos dados.
import { getCatalogo } from "./core/api.js";
import { initMenu } from "./components/menu.js";
import { initHero } from "./components/hero.js";
import { initForm } from "./components/orcamento.js";
import { fillProvincias, fillCategorias } from "./components/selects.js";
import { renderCatalogo } from "./components/catalogo.js";
import { renderPortefolio } from "./components/portefolio.js";
import { renderArte } from "./components/arte.js";
import { renderClientes } from "./components/clientes.js";

initMenu();
fillProvincias();
initHero();
initForm();

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
