# 0005 — As telas em arquivos

- **Data:** setembro de 2026
- **Situação:** aceita — substitui a segunda metade da [0003](0003-um-arquivo-para-a-interface.md)
- **Decide:** ElCamargo Soluções em TI LTDA

## O contexto

A [ADR 0003](0003-um-arquivo-para-a-interface.md) tirou todo o **dado** do
`src/App.jsx` e decidiu manter a **interface** num arquivo só. Ela listou três
sinais que fariam a gente quebrar a interface — e escreveu, com todas as
letras, que não seria por tamanho.

Um ano de features depois, o arquivo estava em **6.689 linhas** e o terceiro
sinal apareceu: o hot-reload passou a reprocessar o app inteiro a cada vírgula
mexida numa tela, e cada busca no arquivo passava por 53 componentes que nada
tinham a ver com o que estava sendo mexido. Somou-se a isso um custo que a
0003 não previu: **as guardas de build liam o `App.jsx` como texto** — a
`check-faixas` procurava `const BAND_COLOR = {` com contagem de chaves, e a
`check-rodadas` passava o arquivo inteiro pelo esbuild e gravava um `.tmp.mjs`
dentro de `src/` só para conseguir importar uma função.

## A decisão

Separar, **sem reescrever nada**. Cada bloco saiu recortado e colado como
estava; o que mudou foram os `import` no topo dos arquivos.

| Arquivo | Linhas | O que é |
|---|---|---|
| `src/App.jsx` | 1.378 | o miolo: estado do jogador, gravação e qual tela aparece |
| `src/lib/catalogo.js` | 662 | catálogo de jogos, escada de fases, preços, economia, loja e conquistas |
| `src/lib/rodadas.js` | 975 | como cada rodada é sorteada, trilha por trilha |
| `src/telas/base.jsx` | 340 | avatar, botão, moeda, topo, mascote e os dois hooks de voz e som |
| `src/telas/hub.jsx` | 525 | escolher jogo, ano escolar, mapa, capitais e fase |
| `src/telas/jogo.jsx` | 498 | a rodada de perguntas e os placares |
| `src/telas/familia.jsx` | 810 | a área do responsável, o caderno e o Momento em Família |
| `src/telas/inicio.jsx` | 496 | quem vai jogar, o cadastro e a senha |
| `src/telas/quebracabeca.jsx` | 434 | o quebra-cabeça inteiro |
| `src/telas/desenho.jsx` | 326 | desenhar, pintar e a galeria |
| `src/telas/memoria.jsx` | 269 | o jogo da memória |
| `src/telas/palavra.jsx` | 201 | Monta a Palavra |
| `src/telas/loja.jsx` | 136 | a loja e as conquistas |

## Como, sem quebrar nada no caminho

Recortar 5.300 linhas à mão erra em um lugar só e o erro aparece na tela de
uma criança — não no build, porque **JavaScript não reclama de um nome que
falta até a hora de executar aquela linha**, e o projeto não tem linter.

Então a separação foi feita por um script:

1. cortar o `App.jsx` em blocos, um por declaração de primeiro nível, levando
   junto os comentários que vêm acima dela;
2. distribuir os blocos pelos arquivos de destino;
3. para cada arquivo, procurar **todo nome de primeiro nível do App antigo**
   que aparece no texto e não é declarado ali — e gerar o `import` dele.

O passo 3 é o que dá a garantia: um nome usado e não importado vira erro de
build no Vite, que confere se o módulo realmente exporta aquilo.

Duas coisas o script pegou e um humano não pegaria:

- **um ciclo**: a tela do hub importava `CartaoMomento` da família, e a família
  importava `nomeDoAno` do hub. O nome do ano foi para `lib/escola.js`, que é
  de onde os dois deviam tê-lo pegado desde o começo.
- **um import sombreado**: `POR_PAGINA` existe na galeria e, com outro valor,
  dentro do `Stages` e do caderno. O script importava o da galeria e o local
  vencia — sem efeito nenhum, mas era uma dependência inventada entre telas.

Depois disso, **cada tela do app foi aberta no navegador**, uma a uma — da
escolha de perfil ao placar da revisão, passando por pintar, montar palavra,
quebra-cabeça, memória e a área do responsável. É o único jeito de provar que
nenhum import faltou, porque a tela é exatamente onde a falta apareceria.

## O que a separação deu de brinde

As guardas pararam de ler código como texto:

- `check-faixas.mjs` **importa** `BAND_COLOR`, `MEM_LEVELS`, `FAIXA_TEMPO` e o
  resto de `lib/catalogo.js`, em vez de procurar `const X = {` e contar
  chaves. Confere o objeto de verdade, e não uma cópia em string.
- `check-rodadas.mjs` **importa** `lib/rodadas.js` direto. Foram embora o
  esbuild, o arquivo temporário gravado dentro de `src/`, e a lista de nomes
  que precisava ser mantida à mão a cada trilha nova.

Também caiu a conta do hot-reload: mexer numa tela reprocessa aquele arquivo,
não os treze.

## O que continua valendo da 0003

**Tudo o que ela disse sobre dados.** `src/data/` continua sendo só conteúdo,
sem uma linha de lógica, e é lá que um pastor, um professor ou um tradutor
mexe sem abrir React. A 0003 também continua certa no princípio: não se quebra
por tamanho, se quebra quando dói. Desta vez doeu.

E continua valendo o que ela colocou no lugar da promessa: pasta bonita não
prova nada. O que prova é o portão que roda em toda alteração — as guardas de
conteúdo e os 116 testes.
