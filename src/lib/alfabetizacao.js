/**
 * KidsGameHub — a alfabetização
 * ElCamargo Soluções em TI LTDA
 *
 * As regras do "Monta a palavra": quantas palavras tem uma rodada, quais
 * palavras cabem em cada degrau, e quais sílabas soltas entram na bandeja
 * para atrapalhar.
 *
 * O que este arquivo NÃO faz, de propósito: mandar o aparelho falar sílaba.
 * A criança ouve a palavra INTEIRA — "bola" — e separa BO + LA sozinha. Se o
 * app dissesse "bo" e "la", ela só casaria som com peça; dizendo a palavra
 * toda, quem faz o trabalho é ela, e é esse o trabalho que se quer ensinar.
 * (Ver docs/decisoes/0004.)
 */

/* Que degraus do banco entram em cada faixa. As faixas altas continuam
   sorteando palavra curta: repetir o fácil no meio do difícil é o que faz a
   criança sentir que domina, e domínio é o que segura ela ali. */
export const NIVEIS_DA_FAIXA = {
  easy:   [1],
  medium: [1, 2],
  hard:   [2, 3],
  genius: [2, 3, 4],
  mestre: [3, 4],
  lenda:  [3, 4],
};

/* Quantas palavras por rodada. Curta de propósito: montar uma palavra leva
   muito mais tempo que responder uma alternativa. */
export const QUANTAS_PALAVRAS = { easy: 4, medium: 5, hard: 5, genius: 6, mestre: 6, lenda: 7 };

/* Sílabas a mais na bandeja, que não pertencem à palavra. Sem elas, a criança
   monta por eliminação — no Fácil isso é bom, depois vira muleta. */
export const SILABAS_EXTRAS = { easy: 0, medium: 1, hard: 1, genius: 2, mestre: 2, lenda: 3 };

const sortear = (lista, sorte) => lista[Math.floor(sorte() * lista.length)];

export const palavrasDaFaixa = (banco, banda) =>
  banco.filter(p => (NIVEIS_DA_FAIXA[banda] || NIVEIS_DA_FAIXA.easy).includes(p.n));

/* Sílabas de OUTRAS palavras, que não existam na palavra em jogo — senão a
   peça errada encaixaria e o jogo mentiria para a criança. */
export function silabasExtras(palavra, banco, quantas, sorte = Math.random) {
  if (quantas <= 0) return [];
  const dela = new Set(palavra.s);
  const fora = [...new Set(banco.flatMap(p => p.s))].filter(s => !dela.has(s));
  const escolhidas = [];
  let guarda = 0;
  while (escolhidas.length < quantas && guarda++ < 200) {
    const s = sortear(fora, sorte);
    if (s && !escolhidas.includes(s)) escolhidas.push(s);
  }
  return escolhidas;
}

/* Uma rodada: as palavras sorteadas, cada uma com a bandeja já embaralhada.
   Embaralhada aqui e não na tela, senão as peças dançariam a cada toque. */
export function montarRodadaPalavras(banco, banda, sorte = Math.random) {
  const cabem = palavrasDaFaixa(banco, banda);
  const quantas = Math.min(QUANTAS_PALAVRAS[banda] || 4, cabem.length);
  const usadas = [];
  let guarda = 0;
  while (usadas.length < quantas && guarda++ < 400) {
    const p = sortear(cabem, sorte);
    if (p && !usadas.some(u => u.w === p.w)) usadas.push(p);
  }
  return usadas.map(p => {
    const extras = silabasExtras(p, banco, SILABAS_EXTRAS[banda] || 0, sorte);
    const pecas = [...p.s, ...extras]
      .map(s => ({ s, ordem: sorte() }))
      .sort((a, b) => a.ordem - b.ordem)
      .map(x => x.s);
    return { e: p.e, w: p.w, s: p.s, pecas };
  });
}


/* ---------- O ditado ----------
   Montar a palavra dá as SÍLABAS prontas; o ditado dá as LETRAS. É a mesma
   escuta e um trabalho diferente: lá ela ordena pedaços que já são unidades
   de som, aqui ela precisa saber com que letra cada som se escreve — que é
   o que a professora cobra quando dita.

   O app continua dizendo só a palavra inteira. Nada aqui depende de o
   aparelho falar letra ou sílaba (ver docs/decisoes/0004 e 0006). */

/* Palavra de ditado é mais curta que de montar: onze letras na bandeja
   viram parede para quem está aprendendo. */
export const LETRAS_NO_MAXIMO = 8;
export const QUANTAS_DITADO = { easy: 3, medium: 4, hard: 4, genius: 5, mestre: 5, lenda: 6 };

/* Letras a mais na bandeja, que não estão na palavra. No Fácil nenhuma: as
   letras certas já bastam de desafio para quem escreve a primeira palavra. */
export const LETRAS_EXTRAS = { easy: 0, medium: 1, hard: 2, genius: 3, mestre: 3, lenda: 4 };

export const palavrasDoDitado = (banco, banda) =>
  palavrasDaFaixa(banco, banda).filter(p => [...p.w].length <= LETRAS_NO_MAXIMO);

/* Letras que NÃO estão na palavra — senão a isca encaixaria e o jogo
   mentiria, do mesmo jeito que a sílaba extra mentiria lá em cima. */
export function letrasExtras(palavra, alfabeto, quantas, sorte = Math.random) {
  if (quantas <= 0) return [];
  const dela = new Set([...palavra.w]);
  const fora = alfabeto.filter(l => !dela.has(l));
  const escolhidas = [];
  let guarda = 0;
  while (escolhidas.length < quantas && guarda++ < 200) {
    const l = sortear(fora, sorte);
    if (l && !escolhidas.includes(l)) escolhidas.push(l);
  }
  return escolhidas;
}

export function montarRodadaDitado(banco, alfabeto, banda, sorte = Math.random) {
  const cabem = palavrasDoDitado(banco, banda);
  const quantas = Math.min(QUANTAS_DITADO[banda] || 3, cabem.length);
  const usadas = [];
  let guarda = 0;
  while (usadas.length < quantas && guarda++ < 400) {
    const p = sortear(cabem, sorte);
    if (p && !usadas.some(u => u.w === p.w)) usadas.push(p);
  }
  return usadas.map(p => {
    const letras = [...p.w];
    const extras = letrasExtras(p, alfabeto, LETRAS_EXTRAS[banda] || 0, sorte);
    const pecas = [...letras, ...extras]
      .map(l => ({ l, ordem: sorte() }))
      .sort((a, b) => a.ordem - b.ordem)
      .map(x => x.l);
    return { e: p.e, w: p.w, s: letras, pecas };
  });
}

/* As estrelas contam ERRO, não relógio: montar palavra não é corrida, e
   cronômetro em quem está aprendendo a ler só atrapalha. */
export function estrelasDaPalavra(erros, quantasPalavras) {
  if (erros === 0) return 3;
  if (erros <= 1) return 2;
  return erros <= Math.max(2, Math.round(quantasPalavras / 2)) ? 1 : 0;
}
