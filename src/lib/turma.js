/**
 * KidsGameHub — jogar junto, no mesmo aparelho
 * ElCamargo Soluções em TI LTDA
 *
 * São até quatro: o dono do perfil e mais três. As regras que valem para dois
 * valem para quatro — e é só isso que mora aqui. O resto é tela.
 */

/* Quatro é o tamanho de uma família à mesa, e é o que ainda cabe na largura
   de um celular sem espremer nome e placar até ninguém conseguir ler. */
export const MAX_JOGADORES = 4;

/* Quem venceu, ou null se houve empate no topo. Empate de três continua
   empate: ninguém "ganha por chegar antes" numa partida da família. */
export function vencedorDe(pontos) {
  if (!pontos?.length) return null;
  const maior = Math.max(...pontos);
  return pontos.filter(p => p === maior).length > 1 ? null : pontos.indexOf(maior);
}

/* A rodada em grupo é cortada para caber igual em todo mundo: dez perguntas
   entre quatro dariam 3, 3, 2, 2 — e quem respondeu duas perderia de quem
   respondeu três sem ter errado nada. Perguntas de menos que jogadores ficam
   como estão: aí não há divisão justa possível, e sobra jogar assim mesmo. */
export function perguntasParaTodos(qs, jogadores) {
  const cada = Math.floor(qs.length / jogadores);
  return cada < 1 ? qs : qs.slice(0, cada * jogadores);
}
