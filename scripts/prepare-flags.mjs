/**
 * KidsGameHub — preparação das bandeiras
 * ElCamargo Soluções em TI LTDA
 *
 * Copia de node_modules/flag-icons apenas os SVGs que o jogo realmente usa,
 * para public/flags/. Assim o app não faz nenhuma requisição a servidor de
 * terceiro: as bandeiras viajam dentro do próprio aplicativo.
 *
 * Roda sozinho antes de `npm run dev` e `npm run build`.
 * Se algum código não existir no pacote, o script avisa e segue — o app tem
 * um desenho de reserva para esse caso, então nada quebra silenciosamente.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(raiz, "node_modules", "flag-icons", "flags", "4x3");
const destino = join(raiz, "public", "flags");

if (!existsSync(origem)) {
  console.error("\n✗ flag-icons não encontrado. Rode `npm install` primeiro.\n");
  process.exit(1);
}

/* Os códigos vivem em src/data/geografia.js: DATA (países) e SUBFLAGS (estados e regiões).
   Lemos de lá para não manter duas listas que podem divergir. */
const fonte = readFileSync(join(raiz, "src", "data", "geografia.js"), "utf8");

const bloco = (nome) => {
  const i = fonte.indexOf(`const ${nome} = {`);
  if (i < 0) return "";
  let nivel = 0, j = fonte.indexOf("{", i);
  for (let k = j; k < fonte.length; k++) {
    if (fonte[k] === "{") nivel++;
    else if (fonte[k] === "}" && --nivel === 0) return fonte.slice(j, k + 1);
  }
  return "";
};

const paises = [...bloco("DATA").matchAll(/\b([A-Z]{2}):\s*\d/g)].map(m => m[1].toLowerCase());
const regioes = [...bloco("SUBFLAGS").matchAll(/code:\s*"([a-z]{2}-[a-z]{2,3})"/g)].map(m => m[1]);
const codigos = [...new Set([...paises, ...regioes])].sort();

if (!codigos.length) {
  console.error("\n✗ Nenhum código encontrado em src/data/geografia.js. O formato de DATA mudou?\n");
  process.exit(1);
}

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

const faltando = [];
let bytes = 0;

for (const c of codigos) {
  const arq = join(origem, `${c}.svg`);
  if (!existsSync(arq)) { faltando.push(c); continue; }
  const svg = readFileSync(arq);
  writeFileSync(join(destino, `${c}.svg`), svg);
  bytes += svg.length;
}

const copiados = readdirSync(destino).length;
const mb = (bytes / 1048576).toFixed(2);

console.log(`\n🚩 ${copiados} bandeiras em public/flags/ (${mb} MB)`);

/* Bandeiras muito pesadas engordam o cache offline e atrasam a primeira
   abertura em conexão fraca — justamente o público que queremos atender. */
const pesadas = readdirSync(destino)
  .map(f => ({ f, kb: statSync(join(destino, f)).size / 1024 }))
  .filter(x => x.kb > 60)
  .sort((a, b) => b.kb - a.kb);

if (pesadas.length) {
  console.log(`\n⚠ ${pesadas.length} acima de 60 KB, candidatas a otimização com SVGO:`);
  console.log(pesadas.slice(0, 8).map(x => `   ${x.f} ${x.kb.toFixed(0)} KB`).join("\n"));
}

if (faltando.length) {
  console.log(`\n⚠ Sem SVG no flag-icons (${faltando.length}): ${faltando.join(", ")}`);
  console.log("  O app mostra um desenho de reserva. Para incluí-las, baixe o SVG");
  console.log("  do Wikimedia Commons e salve em public/flags/ com o mesmo código.");
}
console.log("");
