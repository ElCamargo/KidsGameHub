# Imagens da ficha da Play Store

O que subir no Play Console, e onde.

| Arquivo | Tamanho | Onde vai |
| --- | --- | --- |
| `destaque-1024x500.png` | 1024×500 | *Recursos gráficos → Gráfico de destaque* |
| `01-perfis.png` … `06-familia.png` | 1080×1920 | *Recursos gráficos → Capturas de tela do smartphone* |

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

Os dados dos perfis são de teste. **Nenhuma criança real aparece**, e nenhum
dado de ninguém saiu do aparelho para produzir isto.

## Quando refazer

Sempre que a interface mudar de um jeito que apareça nestas telas — cor,
tipografia, nome de jogo, ou jogo novo na tela 02. Refazer é meia hora, e uma
ficha com captura de uma versão antiga é a primeira coisa que um pai atento
percebe.

## O que ainda falta

- **Capturas de tablet 7" e 10"** — opcionais, mas sem elas o app não aparece
  nas buscas feitas em tablet.
- **Ícone maskable próprio.** O `vite.config.js` usa o mesmo `icon-512.png`
  para `any` e para `maskable`, e maskable é recortado em círculo: só os 80%
  centrais sobrevivem. É a primeira coisa que um pai vê.
