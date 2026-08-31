# Lumus — Kids Game Hub

Hub de jogos educativos para crianças. **Sem anúncios, sem links externos, sem coleta de dados.**

Uma criação da **ElCamargo Soluções em TI LTDA**.

---

## O que é

Um agrupador de jogos onde crianças aprendem brincando, num ambiente fechado e seguro.

### Jogos

| Área | Jogo | O que treina |
|---|---|---|
| 🌍 Geografia | Bandeiras do Mundo | 176 bandeiras, 15 fases por continente |
| 🌍 Geografia | Memória do Mundo | memória visual com bandeiras |
| 🌍 Geografia | Capitais | 27 estados do BR → países por continente → estados dos EUA |
| 🔢 Matemática | Contas e Números | soma a decimais, até 5º ano |
| 🦁 Natureza | Memória dos Animais | 50 animais |
| 🦁 Natureza | Quiz dos Animais | classes, habitat, características |
| 🎨 Arte | Pintar e Colorir | 58 desenhos + gerador infinito |
| 🎨 Arte | Cores e Formas | cor, forma e as duas juntas |
| 🎨 Arte | Memória das Formas | 27 combinações |
| 🔤 Idiomas | Palavras do Mundo | 45 palavras em 6 idiomas, escolhe qual aprender |
| 🔤 Idiomas | Memória de Palavras | casa figura com a palavra no idioma escolhido |
| ✝️ Fé e Bíblia | Quiz da Bíblia | 42 perguntas narrativas por idioma |
| ✝️ Fé e Bíblia | Memória da Bíblia | símbolos bíblicos |

O carro-chefe é **Bandeiras do Mundo**: a bandeira aparece, a criança escolhe o país entre quatro opções.

- 15 fases por continente, em escada: 5 Fácil, 4 Médio, 3 Difícil, 3 Gênio
- Modo Fácil sem cronômetro; depois o tempo aperta a cada fase, até 4 segundos
- Moedas do hub: cada rodada custa, dicas custam, acertar rende
- Mapa-múndi que se abre continente a continente, de carro, barco e avião
- 25 conquistas, avatar personalizável e loja de itens
- Vários jogadores no mesmo aparelho, com progresso separado
- 6 idiomas, com pacotes baixáveis de ~3 KB

## Rodando na sua máquina

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O terminal mostra dois endereços. O `Network` é o que você abre no celular — desde que esteja no mesmo Wi-Fi.

## Publicando o site

O deploy é automático. Todo push na branch `main` dispara o workflow em `.github/workflows/deploy.yml`, que compila e publica.

Antes do primeiro deploy, no GitHub: **Settings → Pages → Source → GitHub Actions**.

### Endereços

| Página | URL |
|---|---|
| Jogo | `https://elcamargo.github.io/KidsGameHub/` |
| Política de Privacidade | `https://elcamargo.github.io/KidsGameHub/privacidade.html` |
| Termos de Uso | `https://elcamargo.github.io/KidsGameHub/termos.html` |

As duas páginas legais ficam em `public/` e são copiadas para a raiz do site no build. Elas são exigidas pelas lojas quando o app for publicado — tenha os endereços à mão.

## Instalando no celular

Não precisa de loja de aplicativos.

**Android (Chrome):** abra o site, menu ⋮ → *Instalar aplicativo*.
**iPhone (Safari):** abra o site, botão Compartilhar → *Adicionar à Tela de Início*. No iOS só funciona pelo Safari.

O ícone aparece junto dos outros apps e abre em tela cheia, sem barra de navegador. Depois da primeira partida as bandeiras ficam em cache e o jogo roda sem internet.

## Estrutura

```
src/
  App.jsx          jogo e telas (arquivo único, ainda)
  main.jsx         ponto de entrada
  lib/storage.js   persistência sobre localStorage
  index.css        base
public/            ícones do app
vite.config.js     build e configuração do PWA
```

### Sobre `src/lib/storage.js`

O app grava tudo através de `window.storage`. Esse arquivo implementa essa API sobre o `localStorage`. Quando o projeto migrar para Expo/React Native, basta trocar o corpo de quatro funções por AsyncStorage ou MMKV — o resto do app não muda.

### Sobre as bandeiras

Os SVGs vêm do pacote [`flag-icons`](https://github.com/lipis/flag-icons), instalado como dependência. Antes de cada `dev` e `build`, o script `scripts/prepare-flags.mjs` copia para `public/flags/` **apenas os códigos que o jogo usa** — ele lê `DATA` e `SUBFLAGS` direto de `src/App.jsx`, então as duas listas nunca divergem.

O script avisa quais códigos não existem no pacote e quais SVGs passam de 60 KB (candidatos a otimizar com SVGO). Para bandeiras que faltarem, baixe o SVG do Wikimedia Commons e salve em `public/flags/` com o mesmo código — o script preserva o que já está lá dentro apenas se você rodar depois de adicionar, então guarde os arquivos extras em um commit.

Nada é buscado em servidor externo em tempo de execução.

### Offline

O app não faz **nenhuma** requisição a terceiros. Bandeiras e fontes (Baloo 2 e Nunito, via `@fontsource`) estão empacotadas. O service worker precarrega tudo na instalação, então depois da primeira abertura o jogo roda em modo avião.

## Roadmap

- [ ] Bandeiras dos 27 estados brasileiros (destrava Capitais e o nível Gênio da América do Sul)
- [ ] Revisão pastoral do banco de perguntas bíblicas
- [ ] Banco bíblico em francês, alemão e italiano (hoje recai no inglês)
- [ ] Capitais com grafia própria em francês, alemão e italiano (hoje usa a forma canônica)
- [ ] Quebrar `App.jsx` em componentes
- [ ] Portar para Expo e publicar nas lojas
- [ ] Conta de responsável opcional, para sincronizar entre aparelhos

## Privacidade

O app não coleta dados, não faz requisições a serviços de análise, não exibe anúncios e não tem links que levem para fora. Tudo o que a criança cria fica no aparelho.

## Documentos legais

- [Política de Privacidade](public/privacidade.html) — PT-BR e EN
- [Termos de Uso](public/termos.html) — PT-BR e EN

## Licença

MIT — © 2026 ElCamargo Soluções em TI LTDA. Ver [LICENSE](LICENSE).

---

**ElCamargo Soluções em TI LTDA** · CNPJ 57.299.418/0001-69
elcamargo.solucoes.ti@gmail.com
