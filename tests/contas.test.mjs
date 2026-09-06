/**
 * KidsGameHub — a conta armada
 * ElCamargo Soluções em TI LTDA
 *
 * A conta armada é um PROCEDIMENTO, e o degrau é justamente a reserva. Se a
 * faixa "sem reserva" sortear uma conta com vai-um, a criança que ainda não
 * aprendeu isso trava sem entender por quê — e se a faixa com reserva sortear
 * uma sem, o degrau vira sorteio.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FORMA_DA_FAIXA, QUANTAS_CONTAS, montarConta, montarRodadaContas,
  reservasDaSoma, reservasDaSubtracao,
} from "../src/lib/contas.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const dado = () => { let n = 17; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("o vai-um é marcado na casa certa", () => {
  assert.deepEqual(reservasDaSoma(61, 33), [false, false]);
  assert.deepEqual(reservasDaSoma(47, 25), [true, false]);   // 7+5=12, vai um
  assert.deepEqual(reservasDaSoma(90, 38), [false, true]);   // 9+3=12 na dezena
  assert.deepEqual(reservasDaSoma(99, 99), [true, true]);
});

test("o empresta-um é marcado na casa certa", () => {
  assert.deepEqual(reservasDaSubtracao(54, 29), [true, false]);  // 4−9 pede emprestado
  assert.deepEqual(reservasDaSubtracao(78, 25), [false, false]);
  assert.deepEqual(reservasDaSubtracao(483, 187), [true, true, false]);
});

test("a conta fecha, em mil sorteios por faixa", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 1000; i++) {
      const c = montarConta(banda, sorte);
      const esperado = c.op === "+" ? c.a + c.b : c.a - c.b;
      assert.equal(c.resultado, esperado, `${banda}: ${c.conta} está errada`);
      assert.ok(c.resultado > 0, `${banda}: ${c.conta} deu ${c.resultado}`);
      // Os algarismos vêm da unidade para a esquerda: remontados dão o número.
      assert.equal(Number([...c.digitos].reverse().join("")), c.resultado,
        `${banda}: os algarismos ${c.digitos.join("")} não remontam ${c.resultado}`);
    }
  }
});

test("cada faixa entrega exatamente a reserva que promete", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    const forma = FORMA_DA_FAIXA[banda];
    for (let i = 0; i < 500; i++) {
      const c = montarConta(banda, sorte);
      assert.equal(c.reservas.some(Boolean), forma.reserva,
        `${banda} pede reserva=${forma.reserva} e veio "${c.conta}"`);
      if (forma.op !== "±") assert.equal(c.op, forma.op, `${banda}: veio ${c.op}`);
      assert.equal(String(c.a).length, forma.casas, `${banda}: ${c.a} não tem ${forma.casas} casas`);
    }
  }
});

test("a subtração nunca fica negativa", () => {
  for (const banda of ["genius", "mestre", "lenda"]) {
    const sorte = dado();
    for (let i = 0; i < 800; i++) {
      const c = montarConta(banda, sorte);
      if (c.op === "-") assert.ok(c.a > c.b, `${c.conta}: o de cima é menor`);
    }
  }
});

test("a escada endurece: casas e operação", () => {
  assert.equal(FORMA_DA_FAIXA.easy.reserva, false, "o Fácil não pode ter vai-um");
  assert.equal(FORMA_DA_FAIXA.medium.reserva, true);
  assert.equal(FORMA_DA_FAIXA.genius.op, "-", "a subtração entra no Gênio");
  assert.equal(FORMA_DA_FAIXA.lenda.op, "±", "a Lenda mistura as duas");
  for (let i = 1; i < DIFFS.length; i++)
    assert.ok(FORMA_DA_FAIXA[DIFFS[i]].casas >= FORMA_DA_FAIXA[DIFFS[i - 1]].casas
      || FORMA_DA_FAIXA[DIFFS[i]].op !== FORMA_DA_FAIXA[DIFFS[i - 1]].op,
      `${DIFFS[i]} não é mais difícil que ${DIFFS[i - 1]}`);
});

test("a rodada não repete a mesma conta", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 40; i++) {
      const r = montarRodadaContas(banda, sorte);
      assert.equal(r.length, QUANTAS_CONTAS[banda], `${banda}: ${r.length} contas`);
      const vistas = r.map(c => `${c.a}${c.op}${c.b}`);
      assert.equal(new Set(vistas).size, vistas.length, `${banda}: conta repetida na rodada`);
    }
  }
});

test("a soma que estoura a casa ganha um algarismo a mais", () => {
  // 87 + 45 = 132: a resposta tem três casas onde as parcelas têm duas, e a
  // tela precisa desenhar a caixa a mais.
  const c = { a: 87, b: 45 };
  assert.equal(String(c.a + c.b).length, 3);
  const sorte = dado();
  let viu = false;
  for (let i = 0; i < 500; i++) {
    const x = montarConta("medium", sorte);
    if (x.digitos.length > String(x.a).length) viu = true;
  }
  assert.ok(viu, "nenhuma soma do Médio estourou a casa em 500 sorteios");
});
