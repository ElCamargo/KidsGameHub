/**
 * KidsGameHub — a família silábica, sem o app falar sílaba
 * ElCamargo Soluções em TI LTDA
 *
 * A [ADR 0004](../../docs/decisoes/0004-a-voz-da-alfabetizacao.md) mediu e
 * concluiu: a voz do aparelho **não diz sílaba solta** — ela soletra "bê-á"
 * onde deveria dizer "ba". O truque do acento (`bá`) funciona em três das
 * cinco vogais numa engine, e ninguém sabe em quantas na próxima.
 *
 * Este arquivo é a saída. A cartilha de papel nunca ensinou sílaba solta:
 * ensinou **"BA de bala"**. Então o app fala a PALAVRA — que toda engine
 * acerta — e a criança escolhe, entre as sílabas escritas, qual delas abre
 * aquela palavra. O app nunca precisa dizer "ba"; quem diz é a criança.
 *
 * A família não é banco de dados: ela se GERA trocando a vogal da sílaba.
 * "ba" vira ba-be-bi-bo-bu; "sol" vira sal-sel-sil-sol-sul; "cro" vira
 * cra-cre-cri-cro-cru. Só a palavra da pergunta precisa existir de verdade.
 *
 * Aqui não há tela nem voz: só as regras de formar sílaba.
 */

export const VOGAIS = ["a", "e", "i", "o", "u"];

/* As consoantes que abrem família em português. Ficam de fora as que não
   formam sílaba sozinhas (h) e o q, que só anda com u. */
export const ONSETS = [
  "b", "c", "d", "f", "g", "j", "l", "m", "n", "p", "r", "s", "t", "v", "z",
  "ch", "lh", "nh",
  "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr",
];

/* Sílaba REGULAR: consoante (ou dígrafo, ou encontro com l/r) + uma vogal
   simples + no máximo uma consoante de fechamento.
   O filtro existe porque a família se forma trocando a vogal, e isso só faz
   sentido em sílaba assim: trocar a vogal de "ção" ou de "quei" produziria
   coisa que não é sílaba de língua nenhuma. */
const REGULAR = /^([bcdfgjlmnpqrstvz]|ch|lh|nh|[bcdfgpt][lr])([aeiou])([slrmnz]?)$/;

export const ehRegular = silaba => REGULAR.test(String(silaba || ""));

export function partesDa(silaba) {
  const m = String(silaba || "").match(REGULAR);
  return m ? { onset: m[1], vogal: m[2], coda: m[3] } : null;
}

export const trocarVogal = (silaba, vogal) => {
  const p = partesDa(silaba);
  return p ? p.onset + vogal + p.coda : null;
};

export const trocarOnset = (silaba, onset) => {
  const p = partesDa(silaba);
  return p ? onset + p.vogal + p.coda : null;
};

/* A família inteira, na ordem da cartilha: a-e-i-o-u. */
export const familiaDe = silaba => {
  const p = partesDa(silaba);
  return p ? VOGAIS.map(v => p.onset + v + p.coda) : [];
};

const sortear = (lista, sorte) => lista[Math.floor(sorte() * lista.length)];

/* Iscas da MESMA família: muda só a vogal. A criança tem que ouvir a vogal. */
export function iscasPorVogal(silaba, quantas, sorte = Math.random) {
  const fora = familiaDe(silaba).filter(s => s !== silaba);
  return embaralhar(fora, sorte).slice(0, quantas);
}

/* Iscas da MESMA vogal: muda só a consoante. Agora o que ela tem que ouvir é
   o começo — que é o outro metade do trabalho. */
export function iscasPorConsoante(silaba, quantas, sorte = Math.random) {
  const p = partesDa(silaba);
  if (!p) return [];
  const fora = ONSETS.filter(o => o !== p.onset).map(o => o + p.vogal + p.coda);
  return embaralhar(fora, sorte).slice(0, quantas);
}

/* Metade de cada, para quem já passou das duas anteriores. */
export function iscasMistas(silaba, quantas, sorte = Math.random) {
  const metade = Math.ceil(quantas / 2);
  const v = iscasPorVogal(silaba, metade, sorte);
  const c = iscasPorConsoante(silaba, quantas, sorte).filter(s => !v.includes(s));
  return [...v, ...c].slice(0, quantas);
}

function embaralhar(lista, sorte) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(sorte() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Como a rodada endurece:
   1. mesma família, só a vogal muda        — ouvir a vogal
   2. mesma vogal, a consoante muda         — ouvir o começo
   3. as duas coisas ao mesmo tempo
   4. a sílaba do FIM da palavra            — a mais difícil de isolar de ouvido
   5. e 6. o fim, com iscas de todo tipo, e a posição sorteada */
export const MODO_DA_FAIXA = {
  easy:   { onde: "inicio", iscas: "vogal" },
  medium: { onde: "inicio", iscas: "consoante" },
  hard:   { onde: "inicio", iscas: "mistas" },
  genius: { onde: "fim", iscas: "vogal" },
  mestre: { onde: "fim", iscas: "mistas" },
  lenda:  { onde: "sorteia", iscas: "mistas" },
};

export const ISCAS = { vogal: iscasPorVogal, consoante: iscasPorConsoante, mistas: iscasMistas };

/* Qual sílaba a pergunta cobra, e se a palavra serve para essa faixa. Uma
   palavra só serve se a sílaba cobrada for regular — senão não há família. */
export function silabaCobrada(palavra, onde, sorte = Math.random) {
  const s = palavra?.s || [];
  if (s.length < 2) return null;
  const pos = onde === "inicio" ? 0
    : onde === "fim" ? s.length - 1
    : sorte() < 0.5 ? 0 : s.length - 1;
  const silaba = s[pos];
  return ehRegular(silaba) ? { silaba, pos, noFim: pos === s.length - 1 } : null;
}

/* Quantas palavras do banco servem numa faixa. Serve para o teste provar que
   a rodada nunca fica sem pergunta. */
export const palavrasQueServem = (banco, onde) =>
  banco.filter(p => silabaCobrada(p, onde === "sorteia" ? "inicio" : onde, () => 0));
