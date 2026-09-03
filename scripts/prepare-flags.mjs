/**
 * KidsGameHub — preparação das bandeiras
 * ElCamargo Soluções em TI LTDA
 *
 * Copia para public/flags/ apenas as bandeiras que o jogo realmente usa —
 * de node_modules/flag-icons, e de flags-extra/ para as que o pacote não tem
 * (os estados brasileiros, parte dos americanos e das comunidades espanholas;
 * ver flags-extra/FONTES.md). Assim o app não faz nenhuma requisição a
 * servidor de terceiro: as bandeiras viajam dentro do próprio aplicativo.
 *
 * Também gera src/data/bandeiras-png.js, com os códigos que ficaram em PNG:
 * um brasão desenhado em vetor pesa centenas de KB, e o app precisa caber num
 * celular de entrada.
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
const extras = join(raiz, "flags-extra");
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
const emPng = [];
let bytes = 0;

for (const c of codigos) {
  // Primeiro o pacote; depois o que baixamos à mão, em SVG ou em PNG.
  const candidatos = [
    [join(origem, `${c}.svg`), ".svg"],
    [join(extras, `${c}.svg`), ".svg"],
    [join(extras, `${c}.png`), ".png"],
  ];
  const achado = candidatos.find(([caminho]) => existsSync(caminho));
  if (!achado) { faltando.push(c); continue; }
  const [caminho, ext] = achado;
  const dados = readFileSync(caminho);
  writeFileSync(join(destino, c + ext), dados);
  if (ext === ".png") emPng.push(c);
  bytes += dados.length;
}

/* O app precisa saber a extensão de cada bandeira antes de pedir o arquivo:
   errar a extensão mostraria o desenho de reserva no lugar da bandeira. */
writeFileSync(join(raiz, "src", "data", "bandeiras-png.js"),
`/**
 * KidsGameHub — bandeiras servidas em PNG
 * ElCamargo Soluções em TI LTDA
 *
 * ARQUIVO GERADO por scripts/prepare-flags.mjs. Não edite à mão: ele é
 * refeito antes de todo dev e de todo build.
 *
 * A regra é o tamanho, não o gosto: bandeira com brasão desenhada em vetor
 * passa de 600 KB, e o app inteiro tem que caber num celular de entrada.
 * Essas viram PNG de 320px, o resto continua em SVG.
 */
export const BANDEIRAS_PNG = new Set(${JSON.stringify(emPng.sort())});
`);

const copiados = readdirSync(destino).length;
const mb = (bytes / 1048576).toFixed(2);

console.log(`\n🚩 ${copiados} bandeiras em public/flags/ (${mb} MB)${emPng.length ? ` · ${emPng.length} em PNG` : ""}`);

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
  console.log("  O app mostra um desenho de reserva. Para incluí-las, acrescente o");
  console.log("  código em scripts/baixar-bandeiras.mjs e rode: npm run baixar-bandeiras");
}
console.log("");
