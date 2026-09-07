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
import { montarCopia, lerCopia, nomeDoArquivo, juntarSave, MARCA, VERSAO } from "../src/lib/transferir.js";

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

test("arquivo que não é do Clarim é recusado", () => {
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
  assert.equal(nomeDoArquivo("José Ângelo", dia), "clarim-jose-angelo-2026-09-02.json");
  assert.equal(nomeDoArquivo("", dia), "clarim-jogador-2026-09-02.json");
  assert.match(nomeDoArquivo("../../etc/passwd", dia), /^clarim-[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.json$/);
});


/* ---------- save velho chegando em app novo ----------
   Uma cópia salva hoje pode ser aberta daqui a seis meses, num Clarim que
   ganhou campo novo no meio do caminho. E o mesmo vale para o save que só
   envelheceu no próprio aparelho, sem nunca ter virado arquivo: era ali que o
   app caía na tela de erro, lendo `stats.rounds` de um `stats` inexistente. */

const vazio = () => ({
  coins: 100, progress: {}, owned: [], caderno: [],
  stats: { rounds: 0, perfect: 0, maxCoins: 100 },
});

test("save de versão antiga ganha o campo que falta, sem perder o que tinha", () => {
  const d = juntarSave(vazio(), { coins: 940, progress: { sa: 3 } });   // nem stats existia
  assert.equal(d.coins, 940, "o que o save trazia tem que vencer");
  assert.deepEqual(d.progress, { sa: 3 });
  assert.equal(d.stats.rounds, 0, "o campo que faltava tem que aparecer");
  assert.deepEqual(d.owned, [], "campo novo entra com o padrão");
});

test("stats é misturado por dentro, e não trocado inteiro", () => {
  // Era o defeito: espalhar só o nível de cima trazia o stats antigo com
  // buraco e tudo, e o app lia undefined lá de dentro.
  const d = juntarSave(vazio(), { stats: { rounds: 57 } });
  assert.equal(d.stats.rounds, 57, "o que o save tinha tem que vencer");
  assert.equal(d.stats.perfect, 0, "o campo novo de dentro do stats sumiu");
});

test("save quebrado não vira app quebrado", () => {
  for (const lixo of [null, undefined, "texto", 42, [], [1, 2]]) {
    const d = juntarSave(vazio(), lixo);
    assert.equal(d.stats.rounds, 0, `${JSON.stringify(lixo)} passou`);
    assert.equal(d.coins, 100);
  }
  // `stats` que não é objeto é o caso traiçoeiro: o nível de cima parece bom
  // e o app só quebra lá dentro.
  const d = juntarSave(vazio(), { coins: 7, stats: "nada" });
  assert.equal(d.coins, 7);
  assert.equal(d.stats.rounds, 0);
});


/* ---------- o selo não muda de nome ----------
   O app se chamou Lumus até 07/09/2026. As cópias salvas naquela época trazem
   `marca: "lumus:copia"` dentro, e é por esse campo que `lerCopia` reconhece
   um arquivo nosso. Este teste escreve a string à mão, sem passar por MARCA,
   justamente para falhar se alguém "arrumar" a constante numa busca-e-troca
   de nome: quem fizer isso faria o app recusar os próprios arquivos, e a
   família que guardou o progresso perderia tudo na hora de restaurar. */
test("cópia salva com o nome antigo do app continua sendo aceita", () => {
  const antiga = JSON.stringify({
    marca: "lumus:copia", v: 1,
    app: "Lumus — Kids Game Hub",
    perfil: { id: "p2", name: "Heitor", papel: "filho", leitor: true },
    save: { coins: 50, stats: { rounds: 0 } },
  });
  const { erro, perfil, save } = lerCopia(antiga);
  assert.equal(erro, undefined, "o app novo recusou um arquivo do app antigo");
  assert.equal(perfil.name, "Heitor");
  assert.equal(save.coins, 50);
});
