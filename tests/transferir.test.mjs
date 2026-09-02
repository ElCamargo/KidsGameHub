/**
 * KidsGameHub — levar o progresso para outro aparelho
 * ElCamargo Soluções em TI LTDA
 *
 * Ler um arquivo é fronteira de confiança: o que chega pode ter sido editado
 * à mão, trocado por outro, ou corrompido pelo aplicativo de mensagens. Estes
 * testes existem para que nada disso vire progresso dentro do app.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { montarCopia, lerCopia, nomeDoArquivo, MARCA, VERSAO } from "../src/lib/transferir.js";

const PERFIL = { name: "Bento", avatar: { skin: "#F2C9A0" }, papel: "filho", idade: 6, leitor: true, pin: "1234" };
const SAVE = { coins: 320, stats: { rounds: 12 }, caderno: [{ d: "2026-09-01", t: "aprendi" }] };
const copiaCrua = (extra = {}) => JSON.stringify({ ...montarCopia(PERFIL, SAVE), ...extra });

test("a cópia leva a ficha e o save, e o que sai volta igual", () => {
  const { erro, perfil, save } = lerCopia(copiaCrua());
  assert.equal(erro, undefined);
  assert.equal(perfil.name, "Bento");
  assert.equal(perfil.idade, 6);
  assert.equal(perfil.leitor, true);
  assert.deepEqual(save, SAVE);
});

test("a senha do responsável nunca viaja no arquivo", () => {
  const cru = copiaCrua();
  assert.ok(!cru.includes("1234"), "a senha foi parar dentro do arquivo");
  assert.equal(lerCopia(cru).perfil.pin, null);
  // e nem sequer entrando à força ela é aceita de volta
  const forjado = JSON.stringify({ marca: MARCA, v: VERSAO, perfil: { ...PERFIL, pin: "9999" }, save: SAVE });
  assert.equal(lerCopia(forjado).perfil.pin, null);
});

test("arquivo que não é do Lumus é recusado", () => {
  assert.equal(lerCopia("").erro, "formato");
  assert.equal(lerCopia("isto não é json").erro, "formato");
  assert.equal(lerCopia("null").erro, "outro");
  assert.equal(lerCopia(JSON.stringify({ ola: "mundo" })).erro, "outro");
  assert.equal(lerCopia(JSON.stringify([1, 2, 3])).erro, "outro");
});

test("cópia de uma versão mais nova é recusada em vez de adivinhada", () => {
  assert.equal(lerCopia(copiaCrua({ v: VERSAO + 1 })).erro, "versao");
  assert.equal(lerCopia(copiaCrua({ v: "1" })).erro, "versao");
});

test("cópia sem nome ou sem save não vira jogador", () => {
  assert.equal(lerCopia(JSON.stringify({ marca: MARCA, v: 1, perfil: { name: "  " }, save: SAVE })).erro, "vazio");
  assert.equal(lerCopia(JSON.stringify({ marca: MARCA, v: 1, perfil: PERFIL, save: {} })).erro, "vazio");
});

test("campo torto vira campo são, não vira erro no meio do jogo", () => {
  const torto = JSON.stringify({
    marca: MARCA, v: 1, save: SAVE,
    perfil: { name: "x".repeat(500), avatar: "não é objeto", papel: "administrador", idade: 9999, leitor: "sim" },
  });
  const { perfil } = lerCopia(torto);
  assert.ok(perfil.name.length <= 60, "nome sem limite");
  assert.deepEqual(perfil.avatar, {}, "avatar precisa ser objeto");
  assert.equal(perfil.papel, "filho", "papel desconhecido não pode virar responsável");
  assert.ok(perfil.idade <= 120, "idade sem limite");
  assert.equal(perfil.leitor, null, "leitor só aceita booleano");
});

test("o nome do arquivo é reconhecível e sem acento", () => {
  const dia = new Date(2026, 8, 2);
  assert.equal(nomeDoArquivo("José Ângelo", dia), "lumus-jose-angelo-2026-09-02.json");
  assert.equal(nomeDoArquivo("", dia), "lumus-jogador-2026-09-02.json");
  assert.match(nomeDoArquivo("../../etc/passwd", dia), /^lumus-[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.json$/);
});
