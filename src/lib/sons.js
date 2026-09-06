/**
 * KidsGameHub — o som com que a palavra começa
 * ElCamargo Soluções em TI LTDA
 *
 * Agrupar por LETRA aqui seria ensinar errado: em português, *casa* e
 * *cebola* começam com a mesma letra e com sons diferentes, e *casa* e
 * *queijo* começam com letras diferentes e o mesmo som. Um jogo de "começa
 * igual" que use a letra estaria mentindo justamente na hora em que a criança
 * está formando a regra na cabeça.
 *
 * Então aqui mora a conversão de LETRA para SOM, escrita à mão, como as
 * sílabas do banco — e pelo mesmo motivo: é regra cheia de exceção, e um
 * algoritmo genérico erraria baixinho.
 *
 * A notação é nossa e serve só para comparar: "k", "s", "Z" (o som de *jogo*
 * e *gelo*), "X" (o de *chave*), "R" (o erre forte de *rato*). Não é IPA e
 * não precisa ser — o que o jogo pergunta é se dois sons são o MESMO.
 *
 * Aqui não há tela nem voz: só a regra.
 */

/* Vogais, com acento e sem: o som inicial de uma palavra que começa por vogal
   é a própria vogal. */
const VOGAIS = "aeiouáéíóúâêôãõà";
const semAcento = v => ({ á: "a", â: "a", ã: "a", à: "a", é: "e", ê: "e", í: "i", ó: "o", ô: "o", õ: "o", ú: "u" })[v] || v;

/* Com que som a palavra começa. Devolve null para o que não sabemos ler. */
export function somInicial(palavra) {
  const w = String(palavra || "").toLowerCase();
  if (!w) return null;
  const [a, b, c] = w;

  /* Dígrafos primeiro: "ch" não é c + h, e "qu"/"gu" antes de e/i são um som
     só, com o u mudo. */
  if (a === "c" && b === "h") return "X";
  if (a === "q" && b === "u") return "k";
  if (a === "g" && b === "u") return "eiéê".includes(c) ? "g" : "gu";

  /* As duas letras que mudam de som conforme a vogal seguinte — e que são,
     não por acaso, as que a escola mais cobra. */
  if (a === "c") return "eiéêí".includes(b) ? "s" : "k";
  if (a === "g") return "eiéêí".includes(b) ? "Z" : "g";
  if (a === "ç") return "s";

  /* O h inicial é mudo: o som é o da letra seguinte. */
  if (a === "h") return somInicial(w.slice(1));

  if (a === "j") return "Z";
  if (a === "x") return "X";
  if (a === "r") return "R";        // erre inicial é sempre o forte
  if (a === "z") return "z";
  if (a === "s") return "s";

  if (VOGAIS.includes(a)) return semAcento(a);
  if ("bdfklmnptv".includes(a)) return a;
  return null;
}

export const comecamIgual = (a, b) => {
  const x = somInicial(a);
  return x != null && x === somInicial(b);
};

/* Mesma letra, som diferente — a armadilha que a escola cobra e que a criança
   erra: casa/cebola, gato/gelo. Só existe com c e g, e é de propósito: são as
   únicas letras do português que fazem isso no começo da palavra. */
export const mesmaLetraOutroSom = (a, b) =>
  String(a || "")[0]?.toLowerCase() === String(b || "")[0]?.toLowerCase() && !comecamIgual(a, b);

/* Pares que se confundem de ouvido: mudam só por uma coisa (a voz), e é onde
   a criança troca uma letra pela outra ao escrever. Serve de isca difícil
   para qualquer som, e não só para c e g. */
export const PARES_DE_SOM = [["b", "p"], ["d", "t"], ["f", "v"], ["g", "k"], ["s", "z"], ["m", "n"], ["Z", "X"]];

export function somIrmao(som) {
  const par = PARES_DE_SOM.find(p => p.includes(som));
  return par ? par.find(x => x !== som) : null;
}

/* Que tipo de isca cada faixa usa:
     nenhuma — sons bem diferentes, e a criança só precisa ouvir o começo
     irmao   — uma isca do som irmão (bola/pato), que muda só pela voz
     letra   — mais a armadilha da MESMA LETRA com outro som (casa/cebola),
               que é a que a escola cobra e a criança erra ao escrever */
export const ARMADILHA_DA_FAIXA = {
  easy: "nenhuma", medium: "nenhuma", hard: "irmao",
  genius: "irmao", mestre: "letra", lenda: "letra",
};

/* Agrupa um banco de palavras pelo som inicial. Grupo com uma palavra só não
   serve para perguntar "qual começa igual" — não há com quem parear. */
export function gruposDeSom(banco) {
  const grupos = new Map();
  for (const p of banco) {
    const som = somInicial(p.w);
    if (!som) continue;
    if (!grupos.has(som)) grupos.set(som, []);
    grupos.get(som).push(p);
  }
  return grupos;
}
