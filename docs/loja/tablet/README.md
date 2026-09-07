# Capturas de tablet

Doze imagens, seis telas em dois tamanhos. Vão nos campos
*Recursos gráficos → Capturas de tela de tablet de 7 polegadas* e
*→ de 10 polegadas* do Play Console.

| Prefixo | Pixels | Renderizado a | Onde vai |
| --- | --- | --- | --- |
| `t7-` | 1920×1200 | 960 CSS px | tablet de 7" |
| `t10-` | 2560×1600 | 1280 CSS px | tablet de 10" |

Paisagem, 16:10, dentro dos limites da Play (mínimo 320 px, máximo 3840 px).

## Por que paisagem, e por que isso importa

O app tem um `@media (min-width: 860px)` que troca o layout inteiro: os cartões
de jogo passam de duas para quatro colunas, e os perfis deixam de empilhar. As
duas larguras escolhidas (960 e 1280) ficam **acima** desse corte, então as
capturas provam a coisa que a ficha precisa provar — que o app não é um
aplicativo de celular esticado.

É por isso que as duas medidas não são a mesma imagem redimensionada: em 960 CSS
px a tipografia ocupa proporcionalmente mais espaço, que é como um tablet de 7"
realmente se comporta.

## As telas, na mesma ordem das de celular

| # | Tela | O que ela prova |
| --- | --- | --- |
| 01 | Quem vai jogar | Vários filhos no mesmo aparelho, cada um com o seu progresso |
| 02 | Escolha um jogo | A quantidade de conteúdo, em quatro colunas |
| 03 | Monta a Palavra | Alfabetização de verdade, arrastando sílabas |
| 04 | Bandeiras do Mundo | Geografia, continente a continente |
| 05 | Leitura do Clarim | Interpretação de texto, e o selo 🐢 **SEM PRESSA** |
| 06 | Meus filhos | O acompanhamento do responsável, o presente da semana e o cartão do esforço |

## Como refazer

Existe script agora: [`scripts/capturas-loja.js`](../../../scripts/capturas-loja.js).
Com o servidor de desenvolvimento aberto, no console do navegador:

```js
const cap = await import("/KidsGameHub/scripts/capturas-loja.js");
await cap.capturar({ largura: 1280, altura: 800, escala: 2, nome: "t10-01-perfis" });
await cap.capturar({ largura: 960,  altura: 600, escala: 2, nome: "t7-01-perfis"  });
```

O cabeçalho do script explica as três armadilhas do método — canvas tingido por
blob, animação congelada no primeiro quadro, e a media query que mede o SVG em
vez do aparelho.

**Confira o tamanho de cada arquivo depois de baixar.** Os dois downloads de uma
mesma tela chegam quase juntos e a ordem não é garantida: numa das rodadas o
`t7` e o `t10` saíram trocados, e só a conferência de dimensão pegou.

## Os nomes dos perfis

**Paulo, Bento e Téo** — inventados, e os mesmos das capturas de celular em
`../`, que foram refeitas em 07/09/2026 para bater com estas. Nenhuma criança
real aparece em nenhum dos dois conjuntos.

Os números da semana nos perfis são massa de teste plausível, montada para a
tela do responsável não aparecer vazia na ficha. Nenhum dado de ninguém saiu do
aparelho para produzir isto.
