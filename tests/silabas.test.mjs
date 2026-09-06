/**
 * KidsGameHub — a família silábica
 * ElCamargo Soluções em TI LTDA
 *
 * A família aqui é GERADA, não escrita à mão: trocar a vogal de uma sílaba
 * tem que dar sílaba de verdade, ou a criança vê "çãe" na tela como se fosse
 * português. E a isca errada tem que ser mesmo diferente da certa — isca
 * igual à resposta é pergunta com duas respostas certas.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  VOGAIS, ONSETS, ehRegular, partesDa, trocarVogal, trocarOnset, familiaDe,
  iscasPorVogal, iscasPorConsoante, iscasMistas, MODO_DA_FAIXA, ISCAS,
  silabaCobrada, palavrasQueServem,
} from "../src/lib/silabas.js";
import { PALAVRAS } from "../src/data/palavras.js";
import { NIVEIS_DA_FAIXA } from "../src/lib/alfabetizacao.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const dado = () => { let n = 7; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("sílaba regular é consoante + vogal, com no máximo um fechamento", () => {
  for (const s of ["ba", "cro", "sol", "nha", "tri", "vez"]) assert.ok(ehRegular(s), `${s} deveria valer`);
  for (const s of ["a", "ão", "quei", "lei", "es", "pás", ""]) assert.ok(!ehRegular(s), `${s} não deveria valer`);
});

test("a família se forma trocando a vogal, e mantém o fechamento", () => {
  assert.deepEqual(familiaDe("ba"), ["ba", "be", "bi", "bo", "bu"]);
  assert.deepEqual(familiaDe("cro"), ["cra", "cre", "cri", "cro", "cru"]);
  assert.deepEqual(familiaDe("sol"), ["sal", "sel", "sil", "sol", "sul"]);
  assert.deepEqual(familiaDe("nha"), ["nha", "nhe", "nhi", "nho", "nhu"]);
  assert.deepEqual(familiaDe("ão"), []);
  assert.equal(trocarVogal("ba", "u"), "bu");
  assert.equal(trocarOnset("ba", "tr"), "tra");
  assert.equal(trocarVogal("ão", "a"), null);
});

test("toda sílaba gerada continua sendo sílaba", () => {
  // Se trocar a vogal produzisse algo irregular, a isca não pertenceria a
  // família nenhuma — e a criança leria uma coisa que não existe.
  for (const onset of ONSETS)
    for (const v of VOGAIS) {
      const s = onset + v;
      assert.ok(ehRegular(s), `${s} saiu irregular`);
      assert.deepEqual(partesDa(s), { onset, vogal: v, coda: "" });
    }
});

test("as iscas nunca repetem a resposta, e são sílabas de verdade", () => {
  const sorte = dado();
  for (const alvo of ["ba", "cro", "sol", "nhe", "tri"])
    for (const tipo of Object.keys(ISCAS)) {
      const fora = ISCAS[tipo](alvo, 3, sorte);
      assert.equal(fora.length, 3, `${tipo}/${alvo}: vieram ${fora.length} iscas`);
      assert.equal(new Set(fora).size, 3, `${tipo}/${alvo}: isca repetida`);
      assert.ok(!fora.includes(alvo), `${tipo}/${alvo}: a resposta certa entrou como isca`);
      for (const s of fora) assert.ok(ehRegular(s), `${tipo}/${alvo}: "${s}" não é sílaba`);
    }
});

test("a isca por vogal só muda a vogal, e a por consoante só a consoante", () => {
  const sorte = dado();
  const p = partesDa("sol");
  for (const s of iscasPorVogal("sol", 3, sorte)) {
    const q = partesDa(s);
    assert.equal(q.onset, p.onset);
    assert.equal(q.coda, p.coda);
    assert.notEqual(q.vogal, p.vogal);
  }
  for (const s of iscasPorConsoante("sol", 3, sorte)) {
    const q = partesDa(s);
    assert.equal(q.vogal, p.vogal);
    assert.equal(q.coda, p.coda);
    assert.notEqual(q.onset, p.onset);
  }
});

test("a mistura traz os dois tipos de isca", () => {
  const sorte = dado();
  const p = partesDa("ba");
  let viuVogal = false, viuConsoante = false;
  for (let i = 0; i < 40; i++)
    for (const s of iscasMistas("ba", 3, sorte)) {
      const q = partesDa(s);
      if (q.onset === p.onset) viuVogal = true; else viuConsoante = true;
    }
  assert.ok(viuVogal && viuConsoante, "a mistura não estava misturando");
});

test("toda faixa tem palavra de sobra para uma rodada inteira", () => {
  // 15 é a rodada mais longa do app. Faixa sem palavra é rodada vazia — que
  // é exatamente o defeito que a guarda de rodadas existe para pegar.
  for (const banda of DIFFS) {
    const { onde } = MODO_DA_FAIXA[banda];
    const cabem = PALAVRAS.filter(p => NIVEIS_DA_FAIXA[banda].includes(p.n));
    const servem = palavrasQueServem(cabem, onde);
    assert.ok(servem.length >= 15,
      `${banda}: só ${servem.length} palavra(s) servem para cobrar a sílaba do ${onde}`);
  }
});

test("a sílaba cobrada é sempre a da posição que a faixa pede", () => {
  const sorte = dado();
  for (const p of PALAVRAS) {
    const ini = silabaCobrada(p, "inicio", sorte);
    if (ini) { assert.equal(ini.silaba, p.s[0]); assert.equal(ini.pos, 0); }
    const fim = silabaCobrada(p, "fim", sorte);
    if (fim) { assert.equal(fim.silaba, p.s[p.s.length - 1]); assert.ok(fim.noFim); }
  }
  assert.equal(silabaCobrada({ s: ["a"] }, "inicio", sorte), null, "palavra de uma sílaba não serve");
  assert.equal(silabaCobrada({ s: ["quei", "jo"] }, "inicio", sorte), null, "sílaba irregular não serve");
});
