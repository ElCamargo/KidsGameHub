/**
 * KidsGameHub — a situação-problema
 * ElCamargo Soluções em TI LTDA
 *
 * A prova de matemática não pergunta "quanto é 8 − 3": ela conta uma história
 * e espera que a criança descubra que ali cabe uma subtração. É esse pulo —
 * do texto para a conta — que reprova, e o app só treinava a conta.
 *
 * O problema é GERADO, e não escrito à mão, porque o que muda de um para o
 * outro é só o nome, a coisa e os números: escrever cem à mão daria cem
 * histórias parecidas e nenhuma garantia de que a conta fecha.
 *
 * AS ALTERNATIVAS ERRADAS SÃO OS ERROS DE VERDADE. Numa subtração, a isca
 * principal é a SOMA daqueles números — porque o erro clássico não é errar a
 * conta, é escolher a operação errada. Alternativa sorteada ao acaso deixaria
 * a criança acertar por eliminação sem ler o enunciado, que é justamente o que
 * este jogo quer impedir.
 *
 * Aqui não há tela nem voz: só a história e a conta.
 */

export const NOMES = ["Ana", "Bento", "Clara", "Davi", "Elis", "Heitor", "Lia", "Miguel", "Sofia", "Téo"];

/* Coisa de contar, no singular, no plural e com o gênero — que não é
   preciosismo: "Com quantos ficou?" para flores está errado, e é a primeira
   coisa que um pai brasileiro vê. */
export const COISAS = [
  { s: "bala", p: "balas", g: "f", e: "🍬" },
  { s: "figurinha", p: "figurinhas", g: "f", e: "🃏" },
  { s: "lápis", p: "lápis", g: "m", e: "✏️" },
  { s: "bolinha de gude", p: "bolinhas de gude", g: "f", e: "🔮" },
  { s: "adesivo", p: "adesivos", g: "m", e: "⭐" },
  { s: "maçã", p: "maçãs", g: "f", e: "🍎" },
  { s: "biscoito", p: "biscoitos", g: "m", e: "🍪" },
  { s: "carrinho", p: "carrinhos", g: "m", e: "🚗" },
  { s: "flor", p: "flores", g: "f", e: "🌼" },
  { s: "ovo", p: "ovos", g: "m", e: "🥚" },
];

/* "quantos" ou "quantas", conforme a coisa contada. */
export const quantos = coisa => coisa.g === "f" ? "quantas" : "quantos";

/* Que operações cada faixa cobra, na ordem em que a escola ensina. */
export const OPERACOES = {
  easy:   ["soma"],
  medium: ["soma", "tira"],
  hard:   ["soma", "tira"],
  genius: ["vezes"],
  mestre: ["vezes", "divide"],
  lenda:  ["soma", "tira", "vezes", "divide"],
};

/* Até quanto vão os números de cada faixa. */
export const TAMANHO = {
  easy:   { max: 10 },
  medium: { max: 20 },
  hard:   { max: 100 },
  genius: { max: 10 },
  mestre: { max: 10 },
  lenda:  { max: 100 },
};

const sortear = (lista, sorte) => lista[Math.floor(sorte() * lista.length)];
const entre = (a, b, sorte) => a + Math.floor(sorte() * (b - a + 1));
const quanto = (n, c) => `${n} ${n === 1 ? c.s : c.p}`;

/* Um problema, com o texto, a pergunta, a resposta e as iscas.
   As iscas saem das operações ERRADAS sobre os mesmos números: é o erro que a
   criança comete de verdade quando lê rápido demais. */
export function montarProblema(banda, sorte = Math.random) {
  const op = sortear(OPERACOES[banda] || OPERACOES.easy, sorte);
  const max = (TAMANHO[banda] || TAMANHO.easy).max;
  const quem = sortear(NOMES, sorte);
  const coisa = sortear(COISAS, sorte);

  if (op === "soma") {
    const a = entre(2, max, sorte);
    const b = entre(1, Math.max(1, max - a), sorte);
    return montar({
      figura: coisa.e,
      texto: `${quem} tinha ${quanto(a, coisa)}. Ganhou mais ${b}.`,
      pergunta: `Com ${quantos(coisa)} ficou?`,
      resposta: a + b,
      iscas: [a - b, a, b],
      conta: `${a} + ${b} = ${a + b}`,
    });
  }

  if (op === "tira") {
    const a = entre(4, max, sorte);
    const b = entre(1, a - 1, sorte);
    return montar({
      figura: coisa.e,
      texto: `${quem} tinha ${quanto(a, coisa)}. Deu ${b} para um amigo.`,
      pergunta: `Com ${quantos(coisa)} ficou?`,
      resposta: a - b,
      /* A soma vem primeiro de propósito: é a isca que pega quem viu dois
         números e somou sem ler o enunciado. */
      iscas: [a + b, a, b],
      conta: `${a} − ${b} = ${a - b}`,
    });
  }

  if (op === "vezes") {
    const a = entre(2, max, sorte);
    const b = entre(2, max, sorte);
    return montar({
      figura: coisa.e,
      texto: `${quem} tem ${a} caixas. Em cada caixa há ${quanto(b, coisa)}.`,
      pergunta: `${quantos(coisa) === "quantas" ? "Quantas" : "Quantos"} há ao todo?`,
      resposta: a * b,
      iscas: [a + b, a * b - b, a * b + b],
      conta: `${a} × ${b} = ${a * b}`,
    });
  }

  /* divide: a conta é armada ao contrário, para dar sempre resultado exato —
     resto num problema de 5º ano é outra aula. */
  const b = entre(2, max, sorte);
  const r = entre(2, max, sorte);
  const total = b * r;
  return montar({
    figura: coisa.e,
    texto: `${quem} vai repartir ${quanto(total, coisa)} entre ${b} amigos, em partes iguais.`,
    pergunta: `${quantos(coisa) === "quantas" ? "Quantas" : "Quantos"} cada um recebe?`,
    resposta: r,
    iscas: [total - b, total + b, b],
    conta: `${total} ÷ ${b} = ${r}`,
  });
}

/* Fecha o problema: descarta isca repetida, negativa ou igual à resposta, e
   completa com vizinhos se faltar. Uma alternativa repetida deixaria a
   pergunta com três opções na prática. */
function montar({ figura, texto, pergunta, resposta, iscas, conta }) {
  const usadas = [resposta];
  const boas = [];
  for (const v of iscas) {
    if (boas.length >= 3) break;
    if (Number.isInteger(v) && v > 0 && !usadas.includes(v)) { boas.push(v); usadas.push(v); }
  }
  for (let d = 1; boas.length < 3 && d < 40; d++)
    for (const v of [resposta + d, resposta - d]) {
      if (boas.length >= 3) break;
      if (v > 0 && !usadas.includes(v)) { boas.push(v); usadas.push(v); }
    }
  return { figura, texto, pergunta, resposta, erradas: boas, conta };
}
