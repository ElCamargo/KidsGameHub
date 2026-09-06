/**
 * KidsGameHub — a conta armada
 * ElCamargo Soluções em TI LTDA
 *
 * O app já treinava a conta de cabeça e o problema em texto. Faltava o que a
 * professora escreve no quadro: a conta ARMADA, uma casa embaixo da outra,
 * resolvida da direita para a esquerda — com o "vai um" da soma e o
 * "empresta um" da subtração.
 *
 * Não é a mesma habilidade que somar de cabeça. É um procedimento: alinhar as
 * casas, começar pela unidade, e lembrar do que subiu. Criança que soma bem de
 * cabeça erra a conta armada, e é essa que cai na prova.
 *
 * A criança responde da UNIDADE para a esquerda, uma casa por vez, e a
 * conferência é casa a casa: pôs o algarismo errado, ele treme e volta na
 * hora. Deixar preencher tudo para só então dizer "errado" esconde qual casa
 * ela não sabe.
 *
 * Aqui não há tela: só a conta e as reservas.
 */

/* O que cada faixa cobra. A soma sem reserva vem primeiro porque é onde a
   criança aprende a alinhar as casas; a reserva é o degrau seguinte, e a
   subtração com empréstimo é o que mais trava. */
export const FORMA_DA_FAIXA = {
  easy:   { op: "+", casas: 2, reserva: false },
  medium: { op: "+", casas: 2, reserva: true },
  hard:   { op: "+", casas: 3, reserva: true },
  genius: { op: "-", casas: 2, reserva: true },
  mestre: { op: "-", casas: 3, reserva: true },
  lenda:  { op: "±", casas: 3, reserva: true },
};

/* Quantas contas por rodada. Curta: armar uma conta leva bem mais tempo que
   marcar uma alternativa. */
export const QUANTAS_CONTAS = { easy: 3, medium: 4, hard: 4, genius: 5, mestre: 5, lenda: 6 };

const entre = (a, b, sorte) => a + Math.floor(sorte() * (b - a + 1));
const algarismos = n => String(n).split("");

/* Houve "vai um" nesta casa? Confere casa a casa, da unidade para a esquerda. */
export function reservasDaSoma(a, b) {
  const A = algarismos(a).reverse(), B = algarismos(b).reverse();
  const marcas = [];
  let sobe = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    const soma = Number(A[i] || 0) + Number(B[i] || 0) + sobe;
    sobe = soma >= 10 ? 1 : 0;
    marcas.push(sobe === 1);
  }
  return marcas;
}

/* Houve "empresta um" nesta casa? */
export function reservasDaSubtracao(a, b) {
  const A = algarismos(a).reverse(), B = algarismos(b).reverse();
  const marcas = [];
  let pega = 0;
  for (let i = 0; i < A.length; i++) {
    const cima = Number(A[i]) - pega;
    const baixo = Number(B[i] || 0);
    pega = cima < baixo ? 1 : 0;
    marcas.push(pega === 1);
  }
  return marcas;
}

/* Uma conta armada da faixa. Devolve os algarismos da resposta na ORDEM EM
   QUE SE RESPONDE — da unidade para a esquerda — porque é essa a ordem do
   procedimento que se está ensinando. */
export function montarConta(banda, sorte = Math.random) {
  const forma = FORMA_DA_FAIXA[banda] || FORMA_DA_FAIXA.easy;
  const op = forma.op === "±" ? (sorte() < 0.5 ? "+" : "-") : forma.op;
  const teto = Math.pow(10, forma.casas) - 1;
  const piso = Math.pow(10, forma.casas - 1);

  let a, b, guarda = 0;
  do {
    a = entre(piso, teto, sorte);
    b = entre(piso, op === "+" ? teto : a - 1, sorte);
    if (op === "-" && a <= b) continue;
    const marcas = op === "+" ? reservasDaSoma(a, b) : reservasDaSubtracao(a, b);
    const temReserva = marcas.some(Boolean);
    /* A faixa sem reserva não pode sortear uma conta com reserva, e a faixa
       COM reserva não pode sortear uma sem — senão o degrau vira sorteio. */
    if (temReserva === forma.reserva) break;
  } while (guarda++ < 400);

  const resultado = op === "+" ? a + b : a - b;
  return {
    a, b, op, resultado,
    /* A soma pode estourar uma casa: 87 + 45 = 132. O tamanho da resposta é o
       do resultado, e não o das parcelas. */
    digitos: algarismos(resultado).reverse(),
    reservas: op === "+" ? reservasDaSoma(a, b) : reservasDaSubtracao(a, b),
    conta: `${a} ${op === "+" ? "+" : "−"} ${b} = ${resultado}`,
  };
}

/* Uma rodada inteira, sem repetir a mesma conta. */
export function montarRodadaContas(banda, sorte = Math.random) {
  const quantas = QUANTAS_CONTAS[banda] || 3;
  const feitas = [];
  let guarda = 0;
  while (feitas.length < quantas && guarda++ < 400) {
    const c = montarConta(banda, sorte);
    if (!feitas.some(x => x.a === c.a && x.b === c.b && x.op === c.op)) feitas.push(c);
  }
  return feitas;
}
