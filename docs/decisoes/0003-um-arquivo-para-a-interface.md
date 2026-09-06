# 0003 — Dados em arquivos separados, interface num arquivo só

- **Data:** setembro de 2026
- **Situação:** parcialmente substituída pela [0005](0005-as-telas-em-arquivos.md) — a parte dos DADOS continua valendo; a interface foi separada em setembro de 2026, quando o terceiro sinal previsto aqui apareceu
- **Decide:** ElCamargo Soluções em TI LTDA

## O contexto

`src/App.jsx` tinha 6.190 linhas. É o primeiro número que qualquer pessoa vê ao
abrir o repositório, e a reação natural é: *isto precisa ser quebrado em
componentes*.

A pergunta certa não é "está grande?", é **"o que dói ao mexer nele?"**.

## O que doía de verdade

Não era achar um componente. Era que **dado e tela moravam juntos**: os 6
idiomas da interface, os países com suas capitais, os desenhos de colorir —
tudo linha a linha no mesmo arquivo do JSX.

Isso tem custo concreto:

- Quem quer conferir uma capital ou revisar uma tradução precisa abrir um
  arquivo de seis mil linhas de React.
- Cada pergunta nova, cada país novo, engorda o arquivo da interface.
- Uma revisão de conteúdo — de um pastor, de um professor, de um tradutor —
  aparece no diff misturada com mudança de layout.

## A decisão

**Todo dado sai; a interface fica.**

Saíram para `src/data/`:

| Arquivo | O que é |
|---|---|
| `textos.js` | as 280 frases da interface, nos 6 idiomas |
| `geografia.js` | países por continente, capitais, estados do Brasil e dos EUA, bandeiras de região |
| `desenhos.js` | os desenhos de colorir, área por área |
| `biblia*.js`, `curiosidades.js`, `ciencias.js`, `versos.js` | os bancos de perguntas |
| `devocional.js`, `caderno.js` | o conteúdo de formação |

`App.jsx` caiu de 6.190 para **4.871 linhas** — e, mais importante, **nenhuma
linha dele é conteúdo**. Continua tendo a interface inteira.

## Por que a interface não foi quebrada junto

Porque quebrar por quebrar troca um problema por outro. Um arquivo de 4.800
linhas de componentes é grande; vinte arquivos com props atravessando cinco
níveis é pior — e a única pessoa que mexe neles hoje somos nós.

Os componentes já são pequenos e independentes (`Stages`, `Game`, `MemoryGame`,
`CartaoFilho`…), separados por comentários de seção. `Ctrl+F` acha qualquer um
em um segundo. O que um arquivo único **não** dá é carregamento sob demanda —
e isso a gente resolveu no build, não na pasta: o pacote sai em três pedaços
(React, dados, interface), então quem já tem o app baixa só o que mudou.

## Quando vamos quebrar a interface

Não por tamanho. Por um destes três sinais, que ainda não aconteceram:

1. **Mais de uma pessoa mexendo na interface ao mesmo tempo** — aí o conflito
   de merge passa a ser diário e a pasta paga por si.
2. **Um componente virar produto** — se o jogo de memória, por exemplo, for
   embutido em outro lugar.
3. **O tempo de build ou o hot-reload incomodar.** Hoje a build inteira, com
   todas as guardas e testes, leva menos de 3 segundos.

Até lá, quebrar seria trabalho visível com valor baixo — e a pior espécie de
refatoração é a que se faz para o arquivo parecer bem, não para funcionar bem.

## O que colocamos no lugar da promessa

Uma pasta bonita não prova nada. O que prova é o portão que roda em toda
alteração (`.github/workflows/ci.yml`):

- as guardas de conteúdo (`check-bancos`, `check-faixas`, `check-rodadas`),
- 24 testes em `tests/` — entre eles o que garante que **os 6 idiomas têm
  exatamente as mesmas 280 chaves**, e que nenhum marcador `{n}` se perdeu
  numa tradução,
- a build, com o tamanho do pacote publicado no resumo da execução.
