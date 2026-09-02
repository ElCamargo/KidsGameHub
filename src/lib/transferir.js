/**
 * KidsGameHub — levar o progresso para outro aparelho
 * ElCamargo Soluções em TI LTDA
 *
 * O Lumus não tem conta, não tem servidor e não quer ter. Mas o celular
 * quebra, a família troca de aparelho, e dois anos de fases vencidas não
 * podem morrer com o telefone.
 *
 * A solução é a mais velha que existe: um ARQUIVO. O responsável salva uma
 * cópia, manda para si mesmo como mandaria uma foto, e abre no aparelho novo.
 * Nada sobe para lugar nenhum, e funciona em modo avião.
 *
 * O QUE VAI DENTRO: a ficha (nome, avatar, idade, leitura) e o save inteiro —
 * inclusive o caderno da criança. É por isso que a tela avisa: o arquivo tem
 * as palavras dela, e se guarda como se guardaria um caderno de verdade.
 *
 * O QUE NÃO VAI: a senha do responsável. Um arquivo que carrega a tranca é
 * um arquivo que abre a tranca.
 *
 * LER ARQUIVO É FRONTEIRA DE CONFIANÇA. O que chega aqui pode ser qualquer
 * coisa — arquivo trocado, editado à mão, corrompido pelo aplicativo de
 * mensagens. Por isso nada é aproveitado sem passar por `lerCopia`, que
 * confere campo por campo e devolve só o que reconhece.
 */

export const VERSAO = 1;
export const MARCA = "lumus:copia";

/* 8 MB: um save com galeria cheia não passa de algumas centenas de KB. Acima
   disso é outra coisa, e nem tentamos ler. */
export const TAMANHO_MAX = 8 * 1024 * 1024;

const texto = (v, max = 60) => typeof v === "string" ? v.slice(0, max) : "";
const objeto = v => (v && typeof v === "object" && !Array.isArray(v)) ? v : {};

/* Monta o conteúdo do arquivo. */
export function montarCopia(perfil, save) {
  const { pin, ...fichaSemSenha } = objeto(perfil);   // a tranca não viaja
  return {
    marca: MARCA,
    v: VERSAO,
    app: "Lumus — Kids Game Hub",
    criado: new Date().toISOString(),
    perfil: fichaSemSenha,
    save: objeto(save),
  };
}

/* Nome de arquivo que o adulto reconhece na lista de downloads. */
export function nomeDoArquivo(nome, quando = new Date()) {
  const limpo = String(nome || "").normalize("NFD")
    .replace(/[̀-ͯ]/g, "")   // tira acento: nem todo sistema aceita
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "jogador";
  const d = quando.toISOString().slice(0, 10);
  return `lumus-${limpo}-${d}.json`;
}

/* Lê o que veio do arquivo. Devolve { erro } ou { perfil, save }.
   Nada aqui confia no conteúdo: cada campo é conferido e recortado. */
export function lerCopia(cru) {
  let dados;
  try { dados = JSON.parse(cru); }
  catch { return { erro: "formato" }; }

  if (!dados || typeof dados !== "object" || dados.marca !== MARCA) return { erro: "outro" };
  // Versão maior que a nossa: o arquivo veio de um app mais novo, e adivinhar
  // o que mudou é pior do que dizer que não dá.
  if (!Number.isInteger(dados.v) || dados.v > VERSAO) return { erro: "versao" };

  const p = objeto(dados.perfil);
  const nome = texto(p.name).trim();
  if (!nome) return { erro: "vazio" };

  const perfil = {
    name: nome,
    avatar: objeto(p.avatar),
    papel: p.papel === "pai" ? "pai" : "filho",
    idade: Number.isFinite(p.idade) ? Math.max(0, Math.min(120, Math.trunc(p.idade))) : null,
    leitor: typeof p.leitor === "boolean" ? p.leitor : null,
    pin: null,                                // a senha nunca vem do arquivo
  };

  const save = objeto(dados.save);
  if (!Object.keys(save).length) return { erro: "vazio" };

  return { perfil, save, criado: texto(dados.criado, 40) };
}

/* Entrega o arquivo ao aparelho. Fora do navegador (ou se o download for
   bloqueado) devolve false, e a tela avisa em vez de fingir que salvou. */
export function baixar(nomeArquivo, conteudo) {
  try {
    const blob = new Blob([conteudo], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Um instante antes de soltar: alguns navegadores ainda estão lendo.
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch { return false; }
}
