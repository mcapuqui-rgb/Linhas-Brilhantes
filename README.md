# Linhas Brilhantes: site

Site estático, escrito em peças pequenas (`src/`) e juntado por um script simples (`build.mjs`) no site final (`public/`). Preparado para ligar a uma API e a um painel.

## Estrutura
```
build.mjs               junta src/ em public/ (sem dependências)
package.json            comandos: build, dev, deploy
wrangler.jsonc          Cloudflare: publica a pasta public
database/schema.sql     tabelas da fase 2 (D1 / SQLite)
src/                    TUDO o que se edita
├── index.html          esqueleto da página (lista de partials)
├── partials/           uma secção por ficheiro (header, hero, sobre, produtos, producao,
│                       moda, portefolio, clientes, cobertura, orcamento, contactos, footer)
├── css/
│   ├── styles.css      ordem dos @import (= ordem da cascata)
│   └── tokens, base, buttons, header, hero, layout, about, catalogo, producao,
│       galeria, clientes, orcamento, contactos, footer, theme-light, responsive
├── js/
│   ├── main.js         arranque
│   ├── core/           config (WhatsApp, apiUrl, províncias), api (dados), dom (esc)
│   └── components/     menu, hero, selects, catalogo, portefolio, arte, clientes, orcamento
├── data/catalogo.json  conteúdo que o painel vai gerir
└── img/                imagens (opcional)
public/                 GERADO por build.mjs; não editar à mão
```

## Fluxo de trabalho
1. Edite só em `src/`.
2. `npm run build` gera `public/`. `npm run dev` gera e abre o site em local.
3. Faça commit de `src/` e de `public/`. No Cloudflare, o comando de build pode ser `npm run build` e o de deploy `npx wrangler deploy`. Se não configurar build, o `public/` já gerado chega.

## Onde mexer para...
- Mudar um texto: o ficheiro da secção em `src/partials/`.
- Mudar um estilo: o ficheiro da secção em `src/css/`. Cores e temas: `tokens.css` e `theme-light.css`.
- Nova secção: criar o partial, o CSS e (se for dinâmica) o componente, e acrescentar o `@include` em `index.html` e o `@import` em `css/styles.css`.
- Novas categorias, fotografias, obras ou clientes: `src/data/catalogo.json`.

## Ligar à API (fase 2)
1. Rotas de leitura: `GET /categorias` (com `subcategorias`), `/fotos`, `/obras`, `/clientes`, no mesmo formato do `catalogo.json`.
2. Em `src/js/core/config.js`, defina `apiUrl`. O resto não muda.
3. `POST`, `PUT` e `DELETE` ficam atrás de login, verificado no servidor. Active CORS só para o domínio do site.

## Segurança
- Todo o texto vindo dos dados passa por `esc()` (`core/dom.js`). Mantenha isto em componentes novos.
- Valide no servidor, e guarde segredos em variáveis de ambiente, nunca no repositório.
- Os módulos JavaScript precisam de um servidor (`npm run dev`); não abrem com duplo clique.
