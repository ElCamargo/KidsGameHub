# Imagens da ficha da Play Store

O que subir no Play Console, e onde.

| Arquivo | Tamanho | Onde vai |
| --- | --- | --- |
| `destaque-1024x500.png` | 1024×500 | *Recursos gráficos → Gráfico de destaque* |
| `01-perfis.png` … `06-familia.png` | 1080×1920 | *Recursos gráficos → Capturas de tela do smartphone* |
| `tablet/t7-*.png` | 1920×1200 | *→ Capturas de tela de tablet de 7 polegadas* |
| `tablet/t10-*.png` | 2560×1600 | *→ Capturas de tela de tablet de 10 polegadas* |

As de tablet têm o próprio [LEIA-ME](tablet/README.md).

Todas em PNG, 9:16 nas capturas, dentro dos limites da Play (mínimo 320 px,
máximo 3840 px, no máximo 8 capturas de telefone).

## A ordem importa

A Play mostra **as duas primeiras** nos resultados de busca. Elas foram
escolhidas para responder, nessa ordem, as duas perguntas que um pai faz:
*"serve para os meus filhos?"* e *"o que tem dentro?"*.

| # | Tela | O que ela prova |
| --- | --- | --- |
| 01 | Quem vai jogar | Vários filhos no mesmo aparelho, cada um com o seu progresso |
| 02 | Escolha um jogo | A quantidade de conteúdo, em áreas separadas |
| 03 | Monta a Palavra | Alfabetização de verdade, arrastando sílabas |
| 04 | Bandeiras do Mundo | Geografia, continente a continente |
| 05 | Leitura do Lumus | Interpretação de texto — e o selo 🐢 **SEM PRESSA**, que diz que não há cronômetro |
| 06 | Meus filhos | O responsável acompanha; o Momento em Família existe |

## Como foram feitas

Não são fotos de tela de celular: são o app renderizado a 360 CSS px e
rasterizado a 3× via SVG `foreignObject`, o que dá 1080×1920 com **texto
vetorial** — mais nítido que a captura de um aparelho real, e sem barra de
status, relógio ou bateria para recortar.

O gráfico de destaque é desenhado em `canvas` dentro da própria página do app,
para usar as fontes reais (Baloo 2 e Nunito) e o mascote do
`src/telas/base.jsx`, e não uma imitação.

Nenhum dado de ninguém saiu do aparelho para produzir isto.

> ⚠️ **CORREÇÃO.** Esta seção dizia "os dados dos perfis são de teste, nenhuma
> criança real aparece". **A segunda metade era falsa**: os perfis destas seis
> imagens são *Ederson, Heitor e Miguel* — nomes reais da família. Os avatares
> são desenhos e não há foto, sobrenome nem idade exposta, mas são primeiros
> nomes de crianças reais numa ficha de loja pública, global e permanente, ao
> lado do CNPJ e do endereço da empresa.
>
> As capturas de tablet em `tablet/` foram feitas com nomes inventados (Paulo,
> Bento, Téo). Os dois conjuntos estão inconsistentes **de propósito**, à espera
> de decisão: refazer estas seis com nomes inventados, ou refazer as de tablet
> com os nomes reais. Refazer qualquer um dos lados são poucos minutos agora que
> existe `scripts/capturas-loja.js`.

## Quando refazer

Sempre que a interface mudar de um jeito que apareça nestas telas — cor,
tipografia, nome de jogo, ou jogo novo na tela 02. Uma ficha com captura de uma
versão antiga é a primeira coisa que um pai atento percebe.

**Agora existe script**: [`scripts/capturas-loja.js`](../../scripts/capturas-loja.js),
que faz o trabalho todo e traz anotadas as três armadilhas do método. Deixou de
ser meia hora.

## O que ainda falta

~~**Capturas de tablet 7" e 10".**~~ Feitas: `tablet/`, doze imagens.
~~**Ícone maskable próprio.**~~ Feito: `public/icon-maskable-512.png`. Fundo
sangrando até a borda e o desenho a 78,5%, o que põe tudo dentro da zona
segura (raio 190 dos 204,8 permitidos). O antigo perdia as pontas dos raios e
as beiradas do livro no recorte circular.
