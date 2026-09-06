/**
 * KidsGameHub — a memória do erro
 * ElCamargo Soluções em TI LTDA
 *
 * Até aqui o app guardava estrela por fase, e nada mais: a criança errava
 * "girafa é mamífero" na segunda-feira, acertava por sorte na quinta, e
 * ninguém aprendia nada. Este arquivo é o que faz o conteúdo que já existe
 * render o dobro — sem escrever uma pergunta nova.
 *
 * A pergunta errada volta em 1, 3, 7 e 21 dias. Acertou na volta, sobe um
 * degrau; errou, volta ao começo. Passou do último degrau acertando, sai da
 * lista: está aprendida, e insistir vira castigo.
 *
 * POR QUE GUARDAMOS A PERGUNTA INTEIRA, e não só um código dela: as rodadas
 * são montadas na hora, sorteando de bancos grandes. Refazer exatamente
 * aquela pergunta pediria que cada um dos dez montadores soubesse montar um
 * item específico. Guardar o objeto custa uns 300 bytes e não mexe em
 * montador nenhum.
 */

/* Os degraus, em dias. Espaçamento crescente é o que fixa a memória —
   revisar tudo todo dia cansa e ensina menos. */
export const INTERVALOS = [1, 3, 7, 21];

/* Teto da lista. O armazenamento é do aparelho e não é elástico; e uma fila
   de revisão sem fim desanima em vez de ajudar. */
export const LIMITE = 120;

/* O nome de uma pergunta: a bandeira quando existe, senão o enunciado —
   cortado, porque pergunta de Bíblia tem quatro linhas e isto vai para o
   armazenamento do celular. Duas perguntas que colidam dividem a mesma vaga
   de revisão, o que é inofensivo: as duas voltam. */
export function chaveDaPergunta(cont, q) {
  /* A figura sozinha não distingue: duas perguntas de ciências podem ter o
     mesmo 🦴, e duas de geografia o mesmo 🗺️. Junta figura e enunciado — a
     bandeira continua bastando sozinha, porque ela já é única. */
  const base = q?.flag
    || [q?.prompt, q?.fala, q?.ask].filter(Boolean).join(" ")
    || String(q?.answer ?? "");
  return `${cont}:${String(base).slice(0, 60)}`;
}

export function diasEntre(de, ate) {
  const a = Date.parse(`${de}T00:00:00Z`), b = Date.parse(`${ate}T00:00:00Z`);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.round((b - a) / 864e5) : 0;
}

/* Errou: entra na lista, ou volta ao primeiro degrau se já estava nela. */
export function guardarErro(lista, cont, q, hoje) {
  const chave = chaveDaPergunta(cont, q);
  const antes = (lista || []).find(x => x.chave === chave);
  const item = { chave, cont, q, vezes: (antes?.vezes || 0) + 1, nivel: 0, quando: hoje };
  const nova = [...(lista || []).filter(x => x.chave !== chave), item];
  if (nova.length <= LIMITE) return nova;
  /* Cheia: sai quem está mais perto de ser aprendida e, entre iguais, a mais
     antiga. Nunca a que acabou de ser errada. */
  const ordem = [...nova].sort((a, b) => (b.nivel - a.nivel) || (a.quando < b.quando ? -1 : 1));
  const fora = ordem.find(x => x.chave !== chave);
  return nova.filter(x => x !== fora);
}

/* Acertou na revisão: sobe um degrau. No último, sai da lista — aprendida. */
export function acertouNaRevisao(lista, chave, hoje) {
  let aprendida = false;
  const nova = (lista || []).map(x => {
    if (x.chave !== chave) return x;
    const nivel = x.nivel + 1;
    if (nivel >= INTERVALOS.length) { aprendida = true; return null; }
    return { ...x, nivel, quando: hoje };
  }).filter(Boolean);
  return { lista: nova, aprendida };
}

/* Errou de novo: volta ao começo e conta mais uma vez — é esse número que
   diz ao responsável no que o filho está devendo. */
export function errouNaRevisao(lista, chave, hoje) {
  return (lista || []).map(x =>
    x.chave === chave ? { ...x, nivel: 0, vezes: x.vezes + 1, quando: hoje } : x);
}

/* O que venceu hoje. A mais errada na frente: é a que mais dói. */
export function aRevisar(lista, hoje, quantas = 10) {
  return (lista || [])
    .filter(x => diasEntre(x.quando, hoje) >= (INTERVALOS[x.nivel] ?? INTERVALOS[0]))
    .sort((a, b) => b.vezes - a.vezes)
    .slice(0, quantas);
}

/* O resumo para a ficha do responsável: em que trilha o filho está devendo,
   e quanto. Não é lista de vergonha — é onde ajudar. */
export function ondeEstaDevendo(lista, quantas = 4) {
  const por = {};
  for (const x of lista || []) por[x.cont] = (por[x.cont] || 0) + x.vezes;
  return Object.entries(por)
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantas)
    .map(([cont, vezes]) => ({ cont, vezes }));
}
