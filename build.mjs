// Junta as peças de src/ e escreve o site final em public/. Sem dependências.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "src", OUT = "public";
const read = (p) => readFileSync(p, "utf8");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "css"), { recursive: true });

// HTML: troca cada <!-- @include ficheiro --> pelo conteúdo do ficheiro.
const html = read(join(SRC, "index.html")).replace(/<!-- @include (.+?) -->/g, (_, f) => read(join(SRC, f)).trimEnd());
writeFileSync(join(OUT, "index.html"), html);

// CSS: troca cada @import pelo conteúdo do ficheiro (um só pedido no navegador).
const css = read(join(SRC, "css/styles.css")).replace(/@import "(.+?)";/g, (_, f) => read(join(SRC, "css", f)).trim());
writeFileSync(join(OUT, "css/styles.css"), css + "\n");

// JavaScript, dados e imagens: copiados tal como estão.
for (const d of ["js", "data", "img"]) if (existsSync(join(SRC, d))) cpSync(join(SRC, d), join(OUT, d), { recursive: true });
console.log("Site gerado em", OUT);
