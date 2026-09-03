/**
 * KidsGameHub — as chaves dos recordes da memória
 * ElCamargo Soluções em TI LTDA
 *
 * O recorde de cada tabuleiro é guardado em `memBest`, com a chave
 * "tema:nivel" — "flags:genius", "animals:easy".
 *
 * Nos saves antigos, de quando a memória só tinha bandeiras, a chave era só o
 * nível: "genius". Quem joga desde então tem as duas formas no mesmo save.
 *
 * Isto mora fora do App.jsx por um motivo prático: foi um erro que apareceu no
 * celular de uma família de verdade — a tela do responsável mostrava "geniu",
 * "har" e "eas" como se fossem nomes de jogo — e o que quebra em produção
 * precisa de um teste que rode sem abrir o navegador.
 */

/* Devolve [tema, nivel]. Chave sem ":" é do formato antigo, e o tema é o
   único que existia: bandeiras. */
export function partirChaveMemoria(chave) {
  const corte = String(chave).lastIndexOf(":");
  return corte < 0
    ? ["flags", String(chave)]
    : [chave.slice(0, corte), chave.slice(corte + 1)];
}

/* Reescreve o save no formato de hoje. Recorde velho e novo do mesmo
   tabuleiro viram um só: as melhores estrelas e o melhor tempo.

   Vale mais do que arrumar a tela: a regra de "3 estrelas não cobra de novo"
   procura por "tema:nivel", então sem migrar a criança pagava outra vez por
   um tabuleiro que já tinha vencido. */
export function migrarMemBest(memBest, niveis) {
  const saida = {};
  for (const [chave, v] of Object.entries(memBest || {})) {
    const [tema, nivel] = partirChaveMemoria(chave);
    if (!tema || !niveis.includes(nivel)) continue;   // chave que não reconhecemos
    const k = `${tema}:${nivel}`;
    const antes = saida[k];
    const tempos = [antes?.time, v?.time].filter(x => Number.isFinite(x));
    saida[k] = {
      stars: Math.max(antes?.stars || 0, v?.stars || 0),
      ...(tempos.length ? { time: Math.min(...tempos) } : {}),
    };
  }
  return saida;
}
