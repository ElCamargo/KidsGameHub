/**
 * KidsGameHub — as chaves antigas viram as chaves de hoje
 * ElCamargo Soluções em TI LTDA
 *
 * O app já se chamou **Mundi**, depois **Lumus**, e desde 07/09/2026 se chama
 * **Clarim**. Cada nome deixou um prefixo de chave no armazenamento do
 * aparelho. Uma família que instalou na época do Mundi e nunca desinstalou tem
 * o progresso guardado sob `mundi:`; a que chegou depois, sob `lumus:`.
 *
 * A alternativa seria congelar o prefixo antigo para sempre — foi o que se fez
 * na primeira troca, e o resultado é um código onde a chave contradiz o nome
 * do produto e todo mundo que passa por ali precisa de um comentário para não
 * "arrumar". Este arquivo existe para não precisar mais disso: o prefixo
 * acompanha o nome, e a mudança é feita uma vez, na primeira abertura.
 *
 * DUAS REGRAS QUE FAZEM ISTO SER SEGURO:
 *
 * 1. NÃO SOBRESCREVE. Se a chave nova já existe, a antiga é ignorada. Quem já
 *    jogou depois da atualização não perde o que fez por causa de um resto
 *    velho no armazenamento.
 * 2. NÃO APAGA. As chaves antigas ficam onde estão. Custam alguns kilobytes e
 *    são a rede de segurança: se algo der errado aqui, o progresso continua
 *    gravado no aparelho e dá para voltar atrás. Apagar é irreversível, e
 *    irreversível não combina com o caderno de uma criança.
 *
 * Copia TODAS as chaves do prefixo, não uma lista escrita à mão: perfis,
 * saves, momento em família, som, idioma, dica de instalação, e o que for
 * criado depois. Lista escrita à mão esquece a chave nova de daqui a um ano.
 */

export const PREFIXO_ATUAL = "clarim:";

/* Do mais recente para o mais antigo. A ordem importa: quem tem `lumus:` e
   `mundi:` ao mesmo tempo deve ficar com o `lumus:`, que é o mais novo. */
export const PREFIXOS_ANTIGOS = ["lumus:", "mundi:"];

/**
 * Copia o que estiver sob os prefixos antigos para o atual.
 * Devolve quantas chaves foram trazidas — zero é o caso normal, de quem já
 * está em dia ou instalou agora.
 */
export async function migrarChaves(storage) {
  if (!storage?.list) return 0;
  let trazidas = 0;

  for (const antigo of PREFIXOS_ANTIGOS) {
    let chaves = [];
    try { ({ keys: chaves = [] } = await storage.list(antigo)); }
    catch { continue; }

    for (const chave of chaves) {
      const nova = PREFIXO_ATUAL + chave.slice(antigo.length);

      // Regra 1: a chave nova manda. `get` lança quando não existe.
      try { await storage.get(nova); continue; } catch { }

      try {
        const r = await storage.get(chave);
        if (r?.value != null) { await storage.set(nova, r.value); trazidas++; }
      } catch { }
      // Regra 2: nada de delete aqui. De propósito.
    }
  }
  return trazidas;
}
