/**
 * KidsGameHub — baixa as bandeiras que o flag-icons não tem
 * ElCamargo Soluções em TI LTDA
 *
 * O pacote `flag-icons` cobre países e algumas regiões, mas não traz os
 * estados brasileiros nem parte dos estados americanos e das comunidades
 * espanholas. Este script busca esses SVGs no Wikimedia Commons e os guarda
 * em `flags-extra/`, que é versionado.
 *
 * POR QUE VERSIONADO, E NÃO BAIXADO NO BUILD: o `prepare-flags.mjs` apaga e
 * refaz `public/flags/` a cada execução, e o build não pode depender da
 * internet — nem da nossa, nem da de quem clonar o repositório. Roda-se este
 * script UMA vez, confere-se o resultado, e ele entra no commit.
 *
 *     npm run baixar-bandeiras
 *
 * LICENÇA: bandeiras oficiais de estados e regiões são símbolos públicos,
 * hospedados no Commons como domínio público. A procedência de cada arquivo
 * fica registrada em flags-extra/FONTES.md, gerado aqui junto.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const destino = join(raiz, "flags-extra");

/* Código do jogo → nomes de arquivo candidatos no Commons, em ordem de
   preferência. Mais de um porque o Commons renomeia arquivos, e um nome
   errado aqui viraria uma bandeira faltando lá na frente. */
const ALVOS = {
  /* ---------- os 27 estados brasileiros ---------- */
  "br-ac": ["Bandeira do Acre.svg"],
  "br-al": ["Bandeira de Alagoas.svg"],
  "br-am": ["Bandeira do Amazonas.svg"],
  "br-ap": ["Bandeira do Amapá.svg"],
  "br-ba": ["Bandeira da Bahia.svg"],
  "br-ce": ["Bandeira do Ceará.svg"],
  "br-df": ["Bandeira do Distrito Federal (Brasil).svg", "Bandeira do Distrito Federal.svg"],
  "br-es": ["Bandeira do Espírito Santo.svg"],
  "br-go": ["Bandeira de Goiás.svg"],
  "br-ma": ["Bandeira do Maranhão.svg"],
  "br-mg": ["Bandeira de Minas Gerais.svg"],
  "br-ms": ["Bandeira de Mato Grosso do Sul.svg"],
  "br-mt": ["Bandeira de Mato Grosso.svg"],
  "br-pa": ["Bandeira do Pará.svg"],
  "br-pb": ["Bandeira da Paraíba.svg"],
  "br-pe": ["Bandeira de Pernambuco.svg"],
  "br-pi": ["Bandeira do Piauí.svg"],
  "br-pr": ["Bandeira do Paraná.svg"],
  "br-rj": ["Bandeira do estado do Rio de Janeiro.svg", "Bandeira do Rio de Janeiro.svg"],
  "br-rn": ["Bandeira do Rio Grande do Norte.svg"],
  "br-ro": ["Bandeira de Rondônia.svg"],
  "br-rr": ["Bandeira de Roraima.svg"],
  "br-rs": ["Bandeira do Rio Grande do Sul.svg"],
  "br-sc": ["Bandeira de Santa Catarina.svg"],
  "br-se": ["Bandeira de Sergipe.svg"],
  "br-sp": ["Bandeira do estado de São Paulo.svg", "Bandeira do Estado de São Paulo.svg"],
  "br-to": ["Bandeira do Tocantins.svg"],

  /* ---------- o que já era citado no jogo e faltava ---------- */
  "es-an": ["Flag of Andalucía.svg", "Bandera de Andalucía.svg"],
  "es-cn": ["Flag of the Canary Islands.svg"],
  "es-ib": ["Flag of the Balearic Islands.svg"],
  "us-ak": ["Flag of Alaska.svg"],
  "us-az": ["Flag of Arizona.svg"],
  "us-ca": ["Flag of California.svg"],
  "us-co": ["Flag of Colorado.svg"],
  "us-fl": ["Flag of Florida.svg"],
  "us-hi": ["Flag of Hawaii.svg"],
  "us-la": ["Flag of Louisiana.svg"],
  "us-md": ["Flag of Maryland.svg"],
  "us-nm": ["Flag of New Mexico.svg"],
  "us-ny": ["Flag of New York.svg", "Flag of New York (state).svg"],
  "us-oh": ["Flag of Ohio.svg"],
  "us-tx": ["Flag of Texas.svg"],
};

const url = (nome, largura) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nome.replace(/ /g, "_"))}`
  + (largura ? `?width=${largura}` : "");

/* Acima disto o SVG vira PNG. A bandeira aparece no jogo com 210 px de
   largura; 320 cobre até tela retina. Um brasão desenhado em vetor pesa
   centenas de KB — a de Louisiana tem 629 — e o app inteiro tem 3,5 MB. */
const LIMITE_KB = 40;
const LARGURA_PNG = 320;

/* O Commons não gosta de rajada. Um respiro entre os pedidos evita levar
   bloqueio no meio da lista e ter que recomeçar. */
const respirar = ms => new Promise(r => setTimeout(r, ms));

/* O Commons pede um User-Agent que identifique quem está baixando. */
const AGENTE = "KidsGameHub/1.0 (https://github.com/ElCamargo/KidsGameHub; ElCamargo Soluções em TI LTDA)";

async function baixar(nome) {
  const r = await fetch(url(nome), { headers: { "User-Agent": AGENTE }, redirect: "follow" });
  if (!r.ok) return null;
  const texto = await r.text();
  // Página de erro do Commons volta com 200 e HTML: só aceitamos SVG de verdade.
  return /<svg[\s>]/i.test(texto) ? texto : null;
}

/* O próprio Commons desenha o SVG e devolve PNG. Sem isto precisaríamos de um
   rasterizador aqui dentro, e de mais uma dependência para 12 arquivos. */
async function baixarPng(nome) {
  const r = await fetch(url(nome, LARGURA_PNG), { headers: { "User-Agent": AGENTE }, redirect: "follow" });
  if (!r.ok) return null;
  const bytes = Buffer.from(await r.arrayBuffer());
  return bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 ? bytes : null;
}

/* Limpeza que não muda um pixel: comentário, metadado e espaço entre tags.
   Não mexemos em caminhos nem em números — para isso existe o SVGO, e não
   vamos acrescentar dependência por causa de 42 arquivos. */
function enxugar(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<sodipodi:namedview[\s\S]*?\/>/gi, "")
    .replace(/>\s+</g, "><")
    .trim();
}

mkdirSync(destino, { recursive: true });

const linhas = [];
const falhas = [];
let total = 0;

for (const [codigo, candidatos] of Object.entries(ALVOS)) {
  const jaTem = [".svg", ".png"].map(e => join(destino, codigo + e)).find(existsSync);
  if (jaTem && !process.argv.includes("--refazer")) {
    const kb = readFileSync(jaTem).length / 1024;
    total += kb;
    linhas.push(`| \`${codigo}\` | (já baixada) | ${kb.toFixed(0)} KB |`);
    continue;
  }
  let ok = false;
  for (const nome of candidatos) {
    process.stdout.write(`  ${codigo} … `);
    let svg = null;
    try { svg = await baixar(nome); } catch { svg = null; }
    await respirar(400);
    if (!svg) { console.log(`✗ ${nome}`); continue; }

    const limpo = enxugar(svg);
    let conteudo = limpo, ext = ".svg", nota = "SVG";
    if (limpo.length / 1024 > LIMITE_KB) {
      let png = null;
      try { png = await baixarPng(nome); } catch { png = null; }
      await respirar(400);
      if (png) { conteudo = png; ext = ".png"; nota = `PNG ${LARGURA_PNG}px`; }
    }

    writeFileSync(join(destino, codigo + ext), conteudo);
    const kb = conteudo.length / 1024;
    total += kb;
    console.log(`✓ ${kb.toFixed(0)} KB (${nota})`);
    linhas.push(`| \`${codigo}\` | [${nome}](${url(nome)}) | ${nota}, ${kb.toFixed(0)} KB |`);
    ok = true;
    break;
  }
  if (!ok) falhas.push(codigo);
}

const fontes = [
  "# De onde vêm estas bandeiras",
  "",
  "Os SVGs deste diretório **não** vêm do pacote `flag-icons` — ele não os tem.",
  "Foram baixados uma vez do **Wikimedia Commons** por",
  "[`scripts/baixar-bandeiras.mjs`](../scripts/baixar-bandeiras.mjs) e versionados aqui,",
  "para que nem o build nem quem clona o repositório dependa da internet.",
  "",
  "São bandeiras oficiais de estados e regiões — símbolos públicos, hospedados",
  "no Commons como domínio público.",
  "",
  "Para rebaixar tudo: `npm run baixar-bandeiras -- --refazer`",
  "",
  "| Código | Arquivo no Commons | Tamanho |",
  "|---|---|---|",
  ...linhas,
  "",
].join("\n");
writeFileSync(join(destino, "FONTES.md"), fontes);

console.log(`\n🚩 ${linhas.length} bandeiras em flags-extra/ (${(total / 1024).toFixed(2)} MB)`);
if (falhas.length) {
  console.log(`\n✗ Não consegui baixar (${falhas.length}): ${falhas.join(", ")}`);
  console.log("  Confira o nome do arquivo no Commons e acrescente aos candidatos.");
  process.exit(1);
}
console.log("");
