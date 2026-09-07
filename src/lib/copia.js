/**
 * KidsGameHub — a cópia de segurança do progresso
 * ElCamargo Soluções em TI LTDA
 *
 * O app não tem login e não tem servidor: tudo o que a criança conquista mora
 * no `localStorage` deste aparelho e de mais nenhum. Isso é a promessa do
 * projeto — e é também o único jeito de perder tudo. Celular novo, navegador
 * limpo, "limpar dados do site": some.
 *
 * E some também quando o ENDEREÇO muda. `localStorage` é por origem, não por
 * app: o mesmo Lumus servido de outro domínio abre com o armazenamento vazio.
 * Foi o que quase aconteceu na mudança para lumus.elcamargo.com.br, e é por
 * isso que esta cópia existe antes daquela mudança, e não depois.
 *
 * O formato é um JSON só, com todas as chaves do aparelho dentro. Sem
 * compressão, sem binário e sem criptografia: é um arquivo que o responsável
 * consegue abrir, ler e guardar no lugar que ele quiser — e que nós conseguimos
 * conferir se um dia alguém disser que a restauração veio errada.
 *
 * Fora vai só o cache de idioma (`lumus:lang:*`): ele é uma cópia do que já
 * viaja embutido no app, e sozinho dobraria o tamanho do arquivo.
 */

/* Sobe de 1 quando o formato mudar de um jeito que a versão antiga não leia.
   Arquivo com formato MAIOR que este é recusado: o app velho não sabe o que
   fazer com o que ainda não existia. */
export const FORMATO = 1;

/* A marca é o que separa "não é uma cópia do Lumus" de "é, e está corrompida".
   Sem ela, um JSON qualquer viraria uma restauração vazia e silenciosa. */
const MARCA = "copia-do-lumus";

const EH_CACHE_DE_IDIOMA = k => k.startsWith("lumus:lang:");

/* Monta o documento com tudo o que o app guardou neste aparelho. */
export async function montarCopia(st = globalThis.window?.storage) {
  const { keys } = await st.list("");
  const dados = {};
  for (const k of keys) {
    if (EH_CACHE_DE_IDIOMA(k)) continue;
    try {
      const r = await st.get(k);
      if (typeof r?.value === "string") dados[k] = r.value;
    } catch {
      /* Chave que sumiu entre listar e ler. Não é motivo para perder o resto. */
    }
  }
  return { lumus: MARCA, formato: FORMATO, quando: new Date().toISOString(), dados };
}

/**
 * Lê e confere um arquivo. Não toca em armazenamento nenhum de propósito: é a
 * parte que decide se a restauração pode acontecer, e por isso é a parte que o
 * teste cobre inteira.
 *
 * Lança com um motivo curto — quem chama traduz para o responsável.
 */
export function lerCopia(texto) {
  let doc;
  try { doc = JSON.parse(texto); } catch { throw new Error("nao-e-json"); }
  if (!doc || typeof doc !== "object" || doc.lumus !== MARCA) throw new Error("nao-e-copia");
  if (!Number.isInteger(doc.formato) || doc.formato < 1) throw new Error("nao-e-copia");
  if (doc.formato > FORMATO) throw new Error("formato-novo");
  if (!doc.dados || typeof doc.dados !== "object" || Array.isArray(doc.dados)) throw new Error("sem-dados");

  /* Só entra chave `lumus:` com valor de texto. O `localStorage` guarda string;
     qualquer outra coisa aqui é arquivo remendado à mão, e escrever isso
     quebraria o app de um jeito que a criança veria e o adulto não entenderia.
     O prefixo fecha a outra ponta: arquivo editado não semeia chave estranha
     no armazenamento de quem restaura. */
  const dados = {};
  for (const [k, v] of Object.entries(doc.dados)) {
    if (typeof v !== "string" || !k.startsWith("lumus:") || EH_CACHE_DE_IDIOMA(k)) continue;
    dados[k] = v;
  }
  if (!Object.keys(dados).length) throw new Error("sem-dados");
  return { formato: doc.formato, quando: doc.quando, dados };
}

/**
 * Substitui o que está no aparelho pelo que veio no arquivo.
 *
 * É substituição, e não mistura, de propósito. Fundir dois progressos exigiria
 * decidir quem ganha em cada fase, em cada moeda e em cada página do caderno —
 * e qualquer decisão dessas inventaria um histórico que não aconteceu. Melhor
 * perguntar antes, com todas as letras, e trocar por inteiro.
 */
export async function aplicarCopia(doc, st = globalThis.window?.storage) {
  const { keys } = await st.list("");
  for (const k of keys) {
    if (!EH_CACHE_DE_IDIOMA(k)) await st.delete(k);
  }
  for (const [k, v] of Object.entries(doc.dados)) await st.set(k, v);
  return Object.keys(doc.dados).length;
}

/* Nome com data, porque o responsável vai acabar com várias no celular e
   precisa saber qual é a de ontem. */
export function nomeDoArquivo(quando = new Date()) {
  return `lumus-copia-${quando.toISOString().slice(0, 10)}.json`;
}

/* Quantos perfis a cópia traz — é o que se mostra antes de perguntar
   "tem certeza?". Número é mais concreto que "seus dados". */
export function quantosPerfis(doc) {
  try {
    const p = JSON.parse(doc.dados["lumus:profiles"] ?? "[]");
    return Array.isArray(p) ? p.length : 0;
  } catch { return 0; }
}
