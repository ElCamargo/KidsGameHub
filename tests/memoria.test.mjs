/**
 * KidsGameHub — os recordes da memória
 * ElCamargo Soluções em TI LTDA
 *
 * A chave do recorde é "tema:nivel". Nos saves antigos, de quando a memória
 * só tinha bandeiras, era só o nível — "genius", sem tema.
 *
 * Sem tratar isso, a tela do responsável mostrava "geniu", "har" e "eas" como
 * se fossem nomes de jogo (o último caractere ia embora no corte), e o recorde
 * velho não contava para a regra de "3 estrelas não cobra de novo".
 *
 * Este teste existe porque o erro apareceu no celular de uma família de
 * verdade, num save com dois anos de partidas.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { partirChaveMemoria, migrarMemBest } from "../src/lib/memoria.js";

/* As seis faixas, escritas aqui de propósito: se alguém renomear uma no
   App.jsx sem passar por aqui, o teste avisa em vez de passar calado. */
const NIVEIS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];

test("chave nova continua como está", () => {
  assert.deepEqual(partirChaveMemoria("flags:genius"), ["flags", "genius"]);
  assert.deepEqual(partirChaveMemoria("animals:easy"), ["animals", "easy"]);
});

test("chave antiga, sem tema, é a das bandeiras", () => {
  for (const nivel of ["easy", "medium", "hard", "genius", "mestre", "lenda"])
    assert.deepEqual(partirChaveMemoria(nivel), ["flags", nivel],
      `"${nivel}" sozinho tem que virar bandeiras`);
});

test("o nome do tema nunca vira o nível cortado", () => {
  // Era exatamente isto na tela: "geniu", "har", "eas".
  for (const ruim of ["geniu", "har", "eas", "mestr", "lend"])
    assert.notEqual(partirChaveMemoria("genius")[0], ruim);
  assert.equal(partirChaveMemoria("hard")[0], "flags");
});

test("a migração junta o recorde velho com o novo, ficando com o melhor", () => {
  const migrado = migrarMemBest({
    "genius": { stars: 2, time: 120 },
    "flags:genius": { stars: 3, time: 150 },
    "animals:easy": { stars: 1, time: 40 },
  }, NIVEIS);
  assert.deepEqual(Object.keys(migrado).sort(), ["animals:easy", "flags:genius"]);
  assert.equal(migrado["flags:genius"].stars, 3, "fica com as melhores estrelas");
  assert.equal(migrado["flags:genius"].time, 120, "fica com o melhor tempo");
});

test("a migração não inventa chave a partir de lixo", () => {
  const migrado = migrarMemBest({ "": {}, "coisa": { stars: 3 }, "flags:inexistente": { stars: 3 } }, NIVEIS);
  assert.deepEqual(migrado, {}, "só entra o que tem nível conhecido");
});

test("save vazio ou ausente não quebra", () => {
  assert.deepEqual(migrarMemBest(undefined, NIVEIS), {});
  assert.deepEqual(migrarMemBest(null, NIVEIS), {});
  assert.deepEqual(migrarMemBest({}, NIVEIS), {});
});
