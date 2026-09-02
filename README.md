# Lumus — Kids Game Hub

Hub de jogos educativos para crianças. **Sem anúncios, sem links externos, sem coleta de dados.**

Uma criação da **ElCamargo Soluções em TI LTDA**.

---

## O que é

Um agrupador de jogos onde crianças aprendem brincando, num ambiente fechado e seguro.
São **15 jogos em 6 áreas**.

### Jogos

| Área | Jogo | O que treina |
|---|---|---|
| 🌍 Geografia | Bandeiras do Mundo | 176 bandeiras, 60 fases por continente |
| 🌍 Geografia | Memória do Mundo | memória visual com bandeiras, 6 níveis até 5×8 |
| 🌍 Geografia | Capitais | 27 estados do BR → países por continente → estados dos EUA |
| 🌍 Geografia | Curiosidades do Mundo | 235 lugares reais: em que país, cidade, mar ou continente |
| 🔢 Matemática | Contas e Números | soma a decimais, até 5º ano |
| 🦁 Natureza | Memória dos Animais | 50 animais |
| 🦁 Natureza | Quiz dos Animais | classes, habitat, características |
| 🦁 Natureza | Curiosidades dos Animais | 400 perguntas de 94 animais: grupo, dieta, casa, nascimento |
| 🎨 Arte | Pintar e Colorir | 58 desenhos + gerador infinito |
| 🎨 Arte | Cores e Formas | cor, forma e as duas juntas |
| 🎨 Arte | Memória das Formas | 27 combinações |
| 🔤 Idiomas | Palavras do Mundo | 45 palavras em 6 idiomas, escolhe qual aprender |
| 🔤 Idiomas | Memória de Palavras | casa figura com a palavra no idioma escolhido |
| ✝️ Fé e Bíblia | Quiz da Bíblia | 2000+ perguntas por idioma, em 100 fases |
| ✝️ Fé e Bíblia | Memória da Bíblia | símbolos bíblicos |

O carro-chefe é **Bandeiras do Mundo**: a bandeira aparece, a criança escolhe o país entre quatro opções.

- 60 fases por continente, em escada de seis faixas (ver abaixo)
- Modo Fácil sem cronômetro; depois o tempo aperta a cada fase, até 6 segundos
- Lumicoins: cada rodada custa conforme a faixa, dicas custam, acertar rende
- Mapa-múndi que se abre continente a continente, de carro, barco e avião
- 63 conquistas em 10 categorias, valendo de 30 a 250 lumicoins cada
- Perfis de criança e de responsável, com senha opcional e presente semanal
- Avatar personalizável e loja de itens
- Vários jogadores no mesmo aparelho, com progresso separado
- 6 idiomas, todos embutidos no app

### Escada de fases

Toda trilha tem **60 fases**; o Quiz da Bíblia vai a **100**, porque o banco
dele aguenta. Todas sobem pelas mesmas **seis faixas**, na mesma proporção e
com a mesma pressão de relógio — é isso que mantém a experiência coesa entre
os jogos, e vale igual para os níveis do jogo da memória.

| Faixa | Fases (de 60) | Relógio | Perguntas na rodada | Custa |
|---|---|---|---|---|
| Fácil | 1–14 | sem cronômetro | 5 | 🪙 5 |
| Médio | 15–26 | 25s → 18s | 5 | 🪙 10 |
| Difícil | 27–36 | 16s → 13s | 10 | 🪙 15 |
| Gênio | 37–45 | 12s → 10s | 10 | 🪙 20 |
| Mestre | 46–53 | 10s → 8s | 12 | 🪙 25 |
| Lenda | 54–60 | 8s → 6s | 15 | 🪙 30 |

O cronômetro ainda ganha uma **folga de leitura**: cada 10 caracteres de
pergunta e alternativas além de uma pergunta curta valem mais um segundo, até
25. Uma bandeira não muda nada; uma pergunta bíblica de quatro frases ganha
15 segundos. O relógio mede o que a criança sabe, não o quanto ela lê rápido.

**Fase já vencida com 3 estrelas custa zero.** Cobrar de novo por algo que a
criança já dominou só a afasta de repetir, que é quando ela fixa.

O tabuleiro é paginado de 20 em 20 fases, e a página seguinte só abre quando
a anterior termina.

### Quem está jogando

O cadastro pergunta três coisas antes da aparência:

| Pergunta | Opções | Para que serve |
|---|---|---|
| Quem vai usar? | Criança · Responsável | separa quem joga de quem acompanha |
| Quantos anos? | botões de 3 a 10, ou escrever qualquer idade | responde pela leitura quando ela fica em branco |
| Já sabe ler? | Ainda não · Sim | decide o que nasce aberto |

A idade não tem teto. Os botões de 3 a 10 são o caminho rápido para o público
principal; ao lado deles há um campo para escrever qualquer idade. O jogo é
feito para criança, mas geografia, Bíblia e ciências servem em qualquer uma —
ninguém precisa mentir a idade para usar.

**Quem ainda não lê** começa com os jogos que se joga olhando: as memórias, a
pintura e as contas, onde o conteúdo são números e figuras. Os de texto
aparecem trancados, com o preço à vista e a razão escrita — a criança não acha
que quebrou, nem o adulto que faltou jogo. **Quem já lê** começa pelos mesmos
jogos grátis de sempre.

Cada jogo declara se exige leitura, e é esse campo — não o preço — que decide o
que nasce aberto. Se a pergunta da leitura ficar sem resposta, a idade responde
por ela: 5 anos é a linha.

Dá para **editar a ficha de quem já existe** pelo lápis, no modo de edição da
tela de jogadores. A ficha (nome, avatar, papel, idade, leitura) mora em
`lumus:profiles`; o progresso mora em `lumus:p:<id>`, outro arquivo — editar
uma nunca encosta no outro. E editar só acrescenta jogos: nunca tira da mão de
quem já estava jogando.

### O responsável

Um perfil marcado como responsável abre a tela **Meus filhos**. Cada criança do
aparelho aparece num cartão com idade, se já lê, e o que ela andou fazendo:

| No cartão | O que mostra |
|---|---|
| Os números | rodadas, estrelas, conquistas, dias seguidos e lumicoins |
| 🎨 Pintar e Colorir | os **últimos cinco desenhos**, desenhados ali — não um número dizendo quantos |
| 🧠 Memória | o maior tabuleiro vencido em cada tema, com estrelas e melhor tempo |
| Por jogo | quantas fases de cada trilha, com barra de progresso |

Os desenhos estão ali por um motivo. A tela só mostrava progresso de quiz, e
**criança que ainda não lê joga memória e pintura** — era justamente ela que
aparecia com o cartão zerado, logo ela, que é quem mais precisa do adulto por
perto. O pai ver o peixe que a filha pintou vale mais que ler "8 desenhos".

Quando a criança ainda não começou, o cartão diz isso, em vez de ficar mudo.

Nada sai do aparelho — é o mesmo armazenamento, aberto por outra porta.

**Ele também joga.** É um perfil como os outros, com progresso próprio; a tela
de acompanhamento tem um botão *Jogar*, e o hub tem o caminho de volta.

**Presente da semana: 100 lumicoins.** Toda semana o responsável recebe cem
lumicoins que não são para ele gastar — são para dar de presente a quem ele
quiser, em parcelas de 10, 25 ou 50, direto no cartão de cada filho. O que
sobra não acumula.

O ponto não é o dinheiro: é dar ao adulto um motivo concreto para abrir o app,
olhar como cada filho está indo e escolher quem premiar. Acompanhar vira um
gesto, não um relatório.

### Senha do responsável

O perfil do responsável aceita quatro números. Com eles, **as quatro ações do
perfil** pedem a senha: abrir, editar a ficha, zerar e apagar. Trancar só a
entrada seria teatro — bastaria a criança apagar o perfil protegido.

O que isto é, e o que não é:

- **É** uma tranca contra criança, e resolve o problema real: a criança de 6
  anos não entra na tela do pai nem apaga nada.
- **Não é** segurança. Tudo mora no aparelho, em `localStorage`; quem souber
  abrir o navegador por dentro passa em um minuto, e não há como ser diferente
  num app sem servidor e sem conta. Quatro dígitos também se quebram por
  tentativa e erro.

Por isso o que fica gravado é o resumo SHA-256 temperado com o id do perfil,
nunca a senha — o resumo evita a leitura casual do armazenamento, e só isso. O
próprio cadastro avisa em texto: *não é senha de banco, não repita uma que você
usa em outro lugar*.

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
  data/            bancos de perguntas (só dados, nenhuma lógica de jogo)
    curiosidades.js      235 lugares do mundo
    ciencias.js          94 animais e os moldes de pergunta
    biblia.js            junta as tabelas e monta o banco
    biblia-livros.js     os 66 livros: grupo, capítulos, autor
    biblia-pessoas.js    201 personagens, parentescos e papéis
    biblia-lugares.js    lugares, milagres e parábolas
    biblia-fatos.js      versículos, falas, números e fatos avulsos
scripts/
  prepare-flags.mjs  copia só as bandeiras usadas
  check-bancos.mjs   confere os bancos de perguntas e as faixas
  check-faixas.mjs   garante que toda faixa existe em todo mapa que depende dela
  check-rodadas.mjs  monta uma rodada de cada trilha e faixa e confere se é jogável
public/            ícones do app
vite.config.js     build e configuração do PWA
```

### Sobre `src/lib/storage.js`

O app grava tudo através de `window.storage`. Esse arquivo implementa essa API sobre o `localStorage`. Quando o projeto migrar para Expo/React Native, basta trocar o corpo de quatro funções por AsyncStorage ou MMKV — o resto do app não muda.

### Sobre as bandeiras

Os SVGs vêm do pacote [`flag-icons`](https://github.com/lipis/flag-icons), instalado como dependência. Antes de cada `dev` e `build`, o script `scripts/prepare-flags.mjs` copia para `public/flags/` **apenas os códigos que o jogo usa** — ele lê `DATA` e `SUBFLAGS` direto de `src/App.jsx`, então as duas listas nunca divergem.

O script avisa quais códigos não existem no pacote e quais SVGs passam de 60 KB (candidatos a otimizar com SVGO). Para bandeiras que faltarem, baixe o SVG do Wikimedia Commons e salve em `public/flags/` com o mesmo código — o script preserva o que já está lá dentro apenas se você rodar depois de adicionar, então guarde os arquivos extras em um commit.

Nada é buscado em servidor externo em tempo de execução.

### Sobre os bancos de perguntas

Os três bancos maiores não são listas escritas à mão: são **tabelas de fatos**
que moldes transformam em perguntas. `biblia-pessoas.js` guarda quem a pessoa
foi, o que fez, em que livro está e que papel teve; daí saem quatro perguntas
por personagem. `ciencias.js` guarda os fatos de cada animal; daí saem cinco.

Isso foi escolhido por um motivo prático: uma tabela é **revisável**. Um pastor
consegue ler os 66 livros e os 201 personagens e apontar o que está errado.
Duas mil perguntas soltas ninguém revisa. E acrescentar um personagem
acrescenta quatro perguntas de uma vez.

A regra que vale mais que o total: **pergunta com duas respostas certas é
pergunta errada**. Os moldes pulam nomes repetidos, livros com o mesmo número
de capítulos e tudo que não tenha resposta única.

`scripts/check-bancos.mjs` roda antes de todo `dev` e `build`. Ele conta o que
os geradores realmente produzem, exige um mínimo e procura pergunta ambígua,
alternativa repetida, resposta certa entre as erradas e referência a livro que
não existe. Se um banco encolher por acidente, o build quebra em vez de sair
calado para as crianças.

```
📖 Bíblia        pt 2013 · en 2029 · es 2023 perguntas
🗺️  Curiosidades  235 lugares do mundo
🔬 Ciências      400 perguntas de 94 animais
```

Os versículos vêm de traduções em domínio público (Almeida, KJV,
Reina-Valera 1909) e são sempre curtos.

### Sobre as rodadas

Banco cheio não garante rodada boa. `scripts/check-rodadas.mjs` monta uma
rodada **de verdade** de cada trilha em cada faixa — a primeira, a do meio e a
última de cada uma — e confere que ela é jogável: enunciado, quatro
alternativas distintas, a resposta certa entre elas e, nas bandeiras, uma
bandeira em cada pergunta. São 6 continentes, 8 regiões de capitais, 6 quizzes
e 3 idiomas, antes de todo build.

Ele existe por um motivo concreto: as fases Lenda das bandeiras quebravam o
app na 13ª pergunta, porque a rodada pedia 15 bandeiras e o continente tinha
12. O erro só aparecia jogando até o fim, no celular. Agora aparece no build,
em dois segundos — e na primeira execução ele já achou outro: o Quiz dos
Animais montava a rodada inteira sem enunciado nas duas faixas do topo.

Por isso `poolFor` e `buildRound` ficam fora do componente, com o idioma como
parâmetro. Não é arrumação: a função que ninguém conseguia testar foi
justamente a que quebrou.

### Offline

O app não faz **nenhuma** requisição a terceiros. Bandeiras e fontes (Baloo 2 e Nunito, via `@fontsource`) estão empacotadas. O service worker precarrega tudo na instalação, então depois da primeira abertura o jogo roda em modo avião.

## Roadmap

- [ ] Bandeiras dos 27 estados brasileiros (destrava Capitais e o nível Gênio da América do Sul)
- [ ] Revisão pastoral do banco de perguntas bíblicas (2000+ por idioma)
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
