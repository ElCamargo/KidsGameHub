/**
 * KidsGameHub — as chaves antigas viram as chaves de hoje
 * ElCamargo Soluções em TI LTDA
 *
 * O app já se chamou Mundi e Lumus. Estes testes existem porque o custo de
 * errar aqui não é uma tela feia: é a criança abrir o app e o progresso dela
 * ter sumido.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { migrarChaves, PREFIXO_ATUAL, PREFIXOS_ANTIGOS } from "../src/lib/migracao.js";

/* Um armazenamento de mentira com a mesma assinatura do window.storage —
   inclusive o `get` que LANÇA quando a chave não existe, que é o detalhe de
   que a migração depende para saber se a chave nova já está lá. */
function fingir(inicial = {}) {
  const m = new Map(Object.entries(inicial));
  return {
    dados: m,
    async get(k) { if (!m.has(k)) throw new Error("não existe: " + k); return { key: k, value: m.get(k) }; },
    async set(k, v) { m.set(k, String(v)); return { key: k, value: String(v) }; },
    async delete(k) { m.delete(k); return { key: k, deleted: true }; },
    async list(prefix = "") { return { keys: [...m.keys()].filter(k => k.startsWith(prefix)), prefix }; },
  };
}

test("o progresso guardado sob o nome antigo aparece sob o nome de hoje", async () => {
  const s = fingir({
    "lumus:profiles": '[{"id":"p1","name":"Bento"}]',
    "lumus:p:p1": '{"coins":940}',
    "lumus:familia": '{"sequencia":3}',
    "lumus:som": "0",
  });
  const n = await migrarChaves(s);
  assert.equal(n, 4);
  assert.equal(s.dados.get("clarim:profiles"), '[{"id":"p1","name":"Bento"}]');
  assert.equal(s.dados.get("clarim:p:p1"), '{"coins":940}');
  assert.equal(s.dados.get("clarim:familia"), '{"sequencia":3}');
  assert.equal(s.dados.get("clarim:som"), "0");
});

test("nunca sobrescreve o que já existe no nome de hoje", async () => {
  // O caso real: a criança jogou DEPOIS da atualização. O que ela fez agora
  // vale mais que o resto velho no armazenamento.
  const s = fingir({ "lumus:p:p1": '{"coins":10}', "clarim:p:p1": '{"coins":2030}' });
  await migrarChaves(s);
  assert.equal(s.dados.get("clarim:p:p1"), '{"coins":2030}', "o progresso novo foi atropelado");
});

test("não apaga o que estava lá: a rede de segurança fica", async () => {
  const s = fingir({ "lumus:p:p1": '{"coins":940}' });
  await migrarChaves(s);
  assert.equal(s.dados.get("lumus:p:p1"), '{"coins":940}', "apagou o original");
});

test("entre dois nomes antigos, o mais recente vence", async () => {
  // Quem instalou na época do Mundi, atualizou para o Lumus e jogou mais.
  const s = fingir({ "mundi:p:p1": '{"coins":5}', "lumus:p:p1": '{"coins":900}' });
  await migrarChaves(s);
  assert.equal(s.dados.get("clarim:p:p1"), '{"coins":900}');
  assert.equal(PREFIXOS_ANTIGOS[0], "lumus:", "a ordem da lista é o que decide");
});

test("chave que ainda nem existe também é levada", async () => {
  // A migração copia o prefixo inteiro, não uma lista escrita à mão — senão
  // esquece a chave criada daqui a um ano.
  const s = fingir({ "lumus:umaCoisaQueAindaNaoInventamos": "42" });
  await migrarChaves(s);
  assert.equal(s.dados.get("clarim:umaCoisaQueAindaNaoInventamos"), "42");
});

test("instalação nova não faz nada, e armazenamento sem list não quebra", async () => {
  assert.equal(await migrarChaves(fingir({ "clarim:profiles": "[]" })), 0);
  assert.equal(await migrarChaves({}), 0);
  assert.equal(await migrarChaves(undefined), 0);
});

test("o prefixo de hoje é o nome de hoje", () => {
  assert.equal(PREFIXO_ATUAL, "clarim:");
  assert.ok(!PREFIXOS_ANTIGOS.includes(PREFIXO_ATUAL), "o atual não pode estar na lista de antigos");
});
