/**
 * KidsGameHub — a cópia de segurança
 * ElCamargo Soluções em TI LTDA
 *
 * Este arquivo é a rede embaixo do trapézio. A cópia existe justamente para os
 * casos em que não há segunda chance: o celular novo, o navegador limpo, a
 * mudança de endereço. Uma restauração que aceita lixo em silêncio é pior que
 * uma que recusa — porque a criança perde o progresso e ninguém descobre por
 * quê.
 *
 * O que se cobra aqui:
 *   1. ida e volta sem perder nada;
 *   2. arquivo estranho é RECUSADO, e com o motivo certo;
 *   3. restaurar apaga o que estava antes — é substituição, não mistura;
 *   4. o cache de idioma fica de fora, na ida e na volta.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FORMATO, montarCopia, lerCopia, aplicarCopia, nomeDoArquivo, quantosPerfis,
} from "../src/lib/copia.js";

/* Um armazenamento de mentira com a mesma assinatura do window.storage —
   inclusive o `get` que LANÇA quando a chave não existe, que é onde o de
   verdade já mordeu antes. */
function aparelho(inicial = {}) {
  const m = new Map(Object.entries(inicial));
  return {
    dump: () => Object.fromEntries(m),
    async get(key) {
      if (!m.has(key)) throw new Error(`Chave não encontrada: ${key}`);
      return { key, value: m.get(key) };
    },
    async set(key, value) { m.set(key, String(value)); return { key, value }; },
    async delete(key) { m.delete(key); return { key, deleted: true }; },
    async list(prefix = "") {
      return { keys: [...m.keys()].filter(k => k.startsWith(prefix)), prefix };
    },
  };
}

const CHEIO = {
  "lumus:profiles": JSON.stringify([{ id: "a", name: "Heitor" }, { id: "b", name: "Miguel" }]),
  "lumus:p:a": JSON.stringify({ coins: 120, stars: { flags: 3 } }),
  "lumus:p:b": JSON.stringify({ coins: 40 }),
  "lumus:familia": JSON.stringify({ semana: 12 }),
  "lumus:som": "1",
  "lumus:lang": "pt",
  "lumus:lang:fr": JSON.stringify({ play: "Jouer" }),
};

test("a ida e a volta não perdem nada", async () => {
  const antes = aparelho(CHEIO);
  const doc = await montarCopia(antes);
  const lido = lerCopia(JSON.stringify(doc));

  const vazio = aparelho();
  const n = await aplicarCopia(lido, vazio);

  const esperado = { ...CHEIO };
  delete esperado["lumus:lang:fr"];          // cache de idioma não viaja
  assert.deepEqual(vazio.dump(), esperado);
  assert.equal(n, Object.keys(esperado).length);
});

test("o cache de idioma fica de fora da cópia", async () => {
  const doc = await montarCopia(aparelho(CHEIO));
  assert.ok(!("lumus:lang:fr" in doc.dados), "cache de idioma entrou no arquivo");
  assert.equal(doc.dados["lumus:lang"], "pt", "o idioma ESCOLHIDO tem que viajar");
});

test("restaurar substitui, não mistura", async () => {
  /* O aparelho de destino já tem gente dentro. Depois da restauração, o que
     estava aqui não pode sobreviver escondido — dois progressos misturados
     inventam um histórico que não aconteceu. */
  const destino = aparelho({
    "lumus:profiles": JSON.stringify([{ id: "z", name: "Outro" }]),
    "lumus:p:z": JSON.stringify({ coins: 9999 }),
    "lumus:lang:de": JSON.stringify({ play: "Spielen" }),
  });
  const doc = lerCopia(JSON.stringify(await montarCopia(aparelho(CHEIO))));
  await aplicarCopia(doc, destino);

  assert.ok(!("lumus:p:z" in destino.dump()), "sobrou perfil do aparelho antigo");
  assert.equal(JSON.parse(destino.dump()["lumus:profiles"]).length, 2);
  assert.ok("lumus:lang:de" in destino.dump(), "o cache de idioma do aparelho não devia ser apagado");
});

test("uma chave que some entre listar e ler não derruba a cópia", async () => {
  const st = aparelho(CHEIO);
  const listar = st.list.bind(st);
  st.list = async p => {
    const r = await listar(p);
    return { ...r, keys: [...r.keys, "lumus:fantasma"] };
  };
  const doc = await montarCopia(st);
  assert.ok(!("lumus:fantasma" in doc.dados));
  assert.ok("lumus:profiles" in doc.dados, "perdeu o resto por causa de uma chave");
});

test("arquivo que não é cópia é recusado, com o motivo certo", () => {
  const recusa = (texto, motivo) =>
    assert.throws(() => lerCopia(texto), e => e.message === motivo,
      `esperava "${motivo}" para ${String(texto).slice(0, 40)}`);

  recusa("isto não é json", "nao-e-json");
  recusa("", "nao-e-json");
  recusa("null", "nao-e-copia");
  recusa('"só um texto"', "nao-e-copia");
  recusa(JSON.stringify({ dados: { "lumus:som": "1" } }), "nao-e-copia");
  recusa(JSON.stringify({ lumus: "outra-coisa", formato: 1, dados: {} }), "nao-e-copia");
  recusa(JSON.stringify({ lumus: "copia-do-lumus", formato: 0, dados: {} }), "nao-e-copia");
  recusa(JSON.stringify({ lumus: "copia-do-lumus", dados: {} }), "nao-e-copia");
});

test("cópia de uma versão futura é recusada em vez de adivinhada", () => {
  const futura = JSON.stringify({
    lumus: "copia-do-lumus", formato: FORMATO + 1,
    dados: { "lumus:som": "1" },
  });
  assert.throws(() => lerCopia(futura), e => e.message === "formato-novo");
});

test("cópia sem nada dentro é recusada", () => {
  const semNada = f => JSON.stringify({ lumus: "copia-do-lumus", formato: 1, ...f });
  assert.throws(() => lerCopia(semNada({ dados: {} })), e => e.message === "sem-dados");
  assert.throws(() => lerCopia(semNada({})), e => e.message === "sem-dados");
  assert.throws(() => lerCopia(semNada({ dados: [] })), e => e.message === "sem-dados");
  /* Um arquivo em que TODO valor foi remendado para não ser texto não sobra
     nada de aproveitável — melhor recusar do que restaurar um perfil vazio. */
  assert.throws(() => lerCopia(semNada({ dados: { "lumus:som": 1, "lumus:x": null } })),
    e => e.message === "sem-dados");
});

test("valor remendado é descartado sem levar o resto junto", () => {
  const doc = lerCopia(JSON.stringify({
    lumus: "copia-do-lumus", formato: 1,
    dados: { "lumus:profiles": "[]", "lumus:ruim": { a: 1 }, "lumus:som": "1" },
  }));
  assert.deepEqual(Object.keys(doc.dados).sort(), ["lumus:profiles", "lumus:som"]);
});

test("arquivo editado não semeia chave estranha no aparelho de quem restaura", () => {
  const doc = lerCopia(JSON.stringify({
    lumus: "copia-do-lumus", formato: 1,
    dados: { "lumus:som": "1", "intruso": "x", "../fora": "x", "lumus:lang:fr": "{}" },
  }));
  assert.deepEqual(Object.keys(doc.dados), ["lumus:som"]);
});

test("o nome do arquivo leva a data, para o responsável saber qual é qual", () => {
  assert.equal(nomeDoArquivo(new Date("2026-09-07T13:45:00Z")), "lumus-copia-2026-09-07.json");
});

test("a cópia sabe dizer quantos perfis traz, antes de perguntar 'tem certeza?'", async () => {
  const doc = await montarCopia(aparelho(CHEIO));
  assert.equal(quantosPerfis(doc), 2);
  assert.equal(quantosPerfis({ dados: {} }), 0);
  assert.equal(quantosPerfis({ dados: { "lumus:profiles": "{quebrado" } }), 0);
});
