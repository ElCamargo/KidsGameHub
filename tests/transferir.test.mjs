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
import { montarCopia, lerCopia, nomeDoArquivo, juntarSave, baixar, ehAppleMovel, MARCA, VERSAO } from "../src/lib/transferir.js";

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


/* ---------- o selo de ontem continua valendo ----------
   O app se chamou Mundi, depois Lumus, e desde 07/09/2026 se chama Clarim. O
   arquivo NOVO sai com o selo de hoje, mas há cópias salvas com os selos
   antigos guardadas em celular de gente de verdade, esperando o dia em que o
   aparelho quebrar. Recusar aquele arquivo seria destruir o seguro da família
   — e ela só descobriria no pior momento possível.

   Os selos são escritos à mão aqui, sem passar por MARCAS_ACEITAS, para que
   este teste falhe se alguém tirar um nome da lista em vez de acrescentar. */
for (const [selo, quando] of [["lumus:copia", "Lumus"], ["mundi:copia", "Mundi"]]) {
  test(`cópia salva na época do ${quando} continua sendo aceita`, () => {
    const antiga = JSON.stringify({
      marca: selo, v: 1,
      app: `${quando} — Kids Game Hub`,
      perfil: { id: "p2", name: "Heitor", papel: "filho", leitor: true },
      save: { coins: 50, stats: { rounds: 0 } },
    });
    const { erro, perfil, save } = lerCopia(antiga);
    assert.equal(erro, undefined, "o app novo recusou um arquivo do app antigo");
    assert.equal(perfil.name, "Heitor");
    assert.equal(save.coins, 50);
  });
}

test("o arquivo novo sai com o selo de hoje", () => {
  assert.equal(JSON.parse(copiaCrua()).marca, "clarim:copia");
});


/* ---------- salvar o arquivo no aparelho ----------
   O download comum, no iPhone com o app aberto pelo ícone da tela inicial,
   pode não salvar nada e não avisar. Ali o caminho é o menu Compartilhar.
   Estes testes fingem cada aparelho; o navegador de verdade não roda aqui. */
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)";
const IPAD = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8)";

function aparelho(ua, { toque = 0, share } = {}) {
  const chamadas = [];
  return {
    chamadas,
    nav: {
      userAgent: ua, maxTouchPoints: toque,
      canShare: share ? () => true : undefined,
      share: share ? async (dados) => { chamadas.push(dados); return share(); } : undefined,
    },
  };
}

test("reconhece iPhone e iPad, inclusive o iPad que diz ser Mac", () => {
  assert.equal(ehAppleMovel({ userAgent: IPHONE }), true);
  assert.equal(ehAppleMovel({ userAgent: IPAD, maxTouchPoints: 5 }), true);
  assert.equal(ehAppleMovel({ userAgent: IPAD, maxTouchPoints: 0 }), false, "Mac de verdade não é celular");
  assert.equal(ehAppleMovel({ userAgent: ANDROID, maxTouchPoints: 5 }), false);
});

test("no iPhone a cópia sai pelo menu Compartilhar, com o arquivo inteiro", async () => {
  const { nav, chamadas } = aparelho(IPHONE, { share: () => undefined });
  assert.equal(await baixar("clarim-bento.json", "{\"a\":1}", nav), true);
  assert.equal(chamadas.length, 1);
  const [arquivo] = chamadas[0].files;
  assert.equal(arquivo.name, "clarim-bento.json");
  assert.equal(await arquivo.text(), "{\"a\":1}");
});

test("fechar o menu sem salvar não é erro: a tela fica quieta", async () => {
  const desistiu = () => { throw Object.assign(new Error("x"), { name: "AbortError" }); };
  const { nav } = aparelho(IPHONE, { share: desistiu });
  assert.equal(await baixar("c.json", "{}", nav), null);
});

test("no Android o menu Compartilhar nem é tentado", async () => {
  const { nav, chamadas } = aparelho(ANDROID, { toque: 5, share: () => undefined });
  await baixar("c.json", "{}", nav);   // sem document aqui, o download devolve false
  assert.equal(chamadas.length, 0);
});
