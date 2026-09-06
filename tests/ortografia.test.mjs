/**
 * KidsGameHub — a ortografia
 * ElCamargo Soluções em TI LTDA
 *
 * Dois defeitos matariam este jogo em silêncio: uma lacuna que aceita duas
 * respostas ("ca__a" vira casa e vira caça), e a palavra certa aparecendo
 * escrita na tela, o que transformaria o exercício em cópia.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ORTOGRAFIA, NIVEIS_DA_ORTOGRAFIA } from "../src/data/ortografia.js";
import { montarRodadaOrtografia } from "../src/lib/rodadas.js";
import { chaveDaPergunta } from "../src/lib/revisao.js";
import { T } from "../src/data/textos.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const PERGUNTAS = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };
const FASE = { easy: 1, medium: 15, hard: 27, genius: 37, mestre: 46, lenda: 54 };

test("a lacuna preenchida com a resposta certa dá a palavra de volta", () => {
  for (const x of ORTOGRAFIA)
    assert.equal(x.a + x.c + x.d, x.w,
      `${x.w}: "${x.a}" + "${x.c}" + "${x.d}" não remonta a palavra`);
});

test("toda palavra tem figura — é ela que diz qual palavra é", () => {
  // Sem a figura, "ca__a" pode ser casa ou caça: a pergunta teria duas
  // respostas certas e a criança seria reprovada por acertar.
  for (const x of ORTOGRAFIA) assert.ok(x.e?.trim(), `${x.w}: sem figura`);
});

test("quatro alternativas distintas, com a certa entre elas", () => {
  for (const x of ORTOGRAFIA) {
    assert.equal(x.o.length, 4, `${x.w}: ${x.o.length} alternativas`);
    assert.equal(new Set(x.o).size, 4, `${x.w}: alternativa repetida`);
    assert.ok(x.o.includes(x.c), `${x.w}: a resposta certa não está entre as alternativas`);
    for (const o of x.o) assert.ok(/^[a-zç]{1,2}$/.test(o), `${x.w}: alternativa estranha "${o}"`);
  }
});

test("toda regra diz a palavra de que está falando", () => {
  // A explicação é o que a criança leva quando erra. Regra genérica não ensina
  // nada; a regra com a palavra dentro gruda.
  for (const x of ORTOGRAFIA)
    assert.ok(x.r.toLowerCase().includes(x.w.toLowerCase()),
      `${x.w}: a regra não cita a palavra — "${x.r}"`);
});

test("toda faixa tem palavras de sobra para a rodada inteira", () => {
  for (const banda of DIFFS) {
    const quantas = ORTOGRAFIA.filter(x => NIVEIS_DA_ORTOGRAFIA[banda].includes(x.n)).length;
    assert.ok(quantas >= PERGUNTAS[banda],
      `${banda}: ${quantas} palavras para uma rodada de ${PERGUNTAS[banda]}`);
  }
});

test("a rodada não repete palavra, e a palavra nunca aparece escrita", () => {
  for (const banda of DIFFS)
    for (let i = 0; i < 20; i++) {
      const { qs } = montarRodadaOrtografia(FASE[banda], T.pt);
      assert.equal(qs.length, PERGUNTAS[banda], `${banda}: rodada com ${qs.length}`);
      assert.equal(new Set(qs.map(q => q.fala)).size, qs.length, `${banda}: palavra repetida`);
      for (const q of qs) {
        const naTela = [q.ask, q.antes, q.depois, ...q.options].join(" ");
        assert.ok(!naTela.includes(q.fala),
          `${q.fala}: a palavra inteira apareceu na tela — bastaria copiar`);
        assert.ok(q.calaOpcoes, "as alternativas não podem ser lidas em voz alta");
      }
    }
});

test("a revisão distingue uma palavra da outra", () => {
  /* Todas as perguntas têm o mesmo enunciado. Sem a palavra na chave, a fila
     de revisão juntaria as 64 numa só. */
  const { qs } = montarRodadaOrtografia(54, T.pt);
  const chaves = qs.map(q => chaveDaPergunta("ortografia", q));
  assert.equal(new Set(chaves).size, qs.length, "duas perguntas com a mesma chave de revisão");
});

test("as regras cobrem o que a escola cobra", () => {
  const junto = ORTOGRAFIA.map(x => x.r).join(" ").toLowerCase();
  for (const tema of ["antes de p e b", "ss", "ç", "rr", "z", "x", "ch"])
    assert.ok(junto.includes(tema), `nenhuma regra fala de "${tema}"`);
  // Onde não há regra, a explicação tem que admitir isso em vez de inventar.
  assert.ok(ORTOGRAFIA.some(x => x.r.includes("decora")), "nenhuma palavra é apresentada como decoreba");
});
