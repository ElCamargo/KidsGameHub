/**
 * KidsGameHub — camada de persistência
 * ElCamargo Soluções em TI LTDA
 *
 * O protótipo foi escrito contra a API window.storage. Fora daquele ambiente
 * ela não existe, então instalamos aqui uma implementação equivalente sobre o
 * localStorage do navegador. Mesma assinatura, mesmo comportamento — inclusive
 * o de lançar erro quando a chave não existe, que o app já trata.
 *
 * Quando o projeto migrar para Expo/React Native, basta trocar o corpo destas
 * quatro funções por AsyncStorage ou MMKV. O resto do app não muda.
 */

const PREFIX = "kgh:";

function ok(key, value, shared) {
  return { key, value, shared: !!shared };
}

const impl = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) throw new Error(`Chave não encontrada: ${key}`);
    return ok(key, raw, shared);
  },

  async set(key, value, shared = false) {
    try {
      localStorage.setItem(PREFIX + key, String(value));
      return ok(key, String(value), shared);
    } catch (e) {
      // Cota estourada ou modo privado: falha silenciosa é pior que aviso.
      console.error("Falha ao gravar", key, e);
      return null;
    }
  },

  async delete(key, shared = false) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true, shared: !!shared };
  },

  async list(prefix = "", shared = false) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
    }
    return { keys, prefix, shared: !!shared };
  },
};

export function installStorage() {
  if (typeof window === "undefined") return;
  if (!window.storage) window.storage = impl;
}

export default impl;
