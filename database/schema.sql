-- Esquema para a fase 2 (SQLite / Cloudflare D1). Espelha data/catalogo.json.
CREATE TABLE categorias (
  id TEXT PRIMARY KEY,            -- ex.: "moda-e-gala"
  nome TEXT NOT NULL,
  mais INTEGER NOT NULL DEFAULT 0, -- 1 = mostrar "e muito mais"
  ordem INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE subcategorias (
  id TEXT PRIMARY KEY,
  categoria_id TEXT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE fotos (               -- galeria / portefólio
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subcategoria TEXT NOT NULL REFERENCES subcategorias(id) ON DELETE CASCADE,
  imagem TEXT NOT NULL,            -- endereço da imagem (R2)
  legenda TEXT,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE obras (               -- galeria de arte
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  marca TEXT NOT NULL,
  imagem TEXT,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE clientes (            -- clientes e parceiros (só autorizados)
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  autorizado INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 0
);
-- Mais tarde: pedidos de orçamento e utilizadores do painel.
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL, empresa TEXT, telefone TEXT NOT NULL, email TEXT,
  provincia TEXT, municipio TEXT, modalidade TEXT, entrega TEXT,
  categoria TEXT, quantidade INTEGER, detalhes TEXT,
  estado TEXT NOT NULL DEFAULT 'novo',
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
