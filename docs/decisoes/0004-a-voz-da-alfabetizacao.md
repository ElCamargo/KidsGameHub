# 0004 — A voz da alfabetização: sintetizada ou gravada

- **Data:** setembro de 2026
- **Situação:** aceita
- **Decide:** ElCamargo Soluções em TI LTDA

## O contexto

A próxima etapa do Lumus é uma área de **alfabetização** — o buraco maior do
app hoje, e o conteúdo dos 4 aos 7 anos. Ela precisa fazer o aparelho **falar
sons de letra e sílabas**: "que som começa com…", as famílias BA-BE-BI-BO-BU,
ditado.

O app já fala. A `voz do Lumus` usa o `speechSynthesis` do próprio aparelho,
filtrado para vozes **locais** — nada é baixado, e ela lê as perguntas em voz
alta desde a v1.0.0. A pergunta era simples: **essa mesma voz serve para
ensinar a ler?**

Ninguém tinha a resposta, e ela decidia o desenho da área inteira. Então em vez
de supor, medimos.

## O teste

Uma página de teste com a voz do aparelho, respondida de ouvido por um adulto,
em três partes: as letras, as sílabas escritas de cinco maneiras diferentes, as
palavras soltas, as palavras dentro de frase, e as sílabas com acento.

Aparelho: Windows, `Microsoft Daniel — pt-BR`, voz local. Velocidade 0,85.

## O que a voz fez

| O que | Resultado |
|---|---|
| Frases inteiras | ✅ as três |
| Palavras soltas | ✅ as oito |
| Palavra dentro de frase mínima ("A bola.") | ✅ as três |
| As letras | diz o **nome** ("bê"), nunca o **som** |
| Sílabas em maiúscula (`BA`) | ❌ soletra |
| Sílabas em minúscula (`ba`) | ❌ soletra |
| Sílaba com ponto (`ba.`) ou em frase | ❌ soletra |
| **Sílaba com acento** (`bá`) | ✅ **fala** |

O acento resolvia — a engine para de tratar o pedaço como sigla e lê como
palavra tônica. Mas só até a Parte 3, que testou as cinco vogais:

| `bá` | `bê` | `bí` | `bô` | `bú` |
|---|---|---|---|---|
| ✅ | ✅ | ❌ | ✅ | ❌ |

**`í` e `ú` falham** — quase não existem sozinhos em português, e a engine
volta a soletrar. Duas das três famílias inteiras testadas com acento também
falharam, pelo mesmo motivo: basta uma sílaba torta em cinco para a família
não servir.

## A decisão

**A voz sintetizada não sustenta o núcleo fônico. Os sons de letra e as
famílias silábicas serão gravados — pela própria família.**

E, junto, uma decisão de desenho que veio do mesmo teste:

**Nenhum jogo da alfabetização vai depender do app falar uma sílaba.**

| O jogo | O que o app fala | Por quê |
|---|---|---|
| Monta a palavra | a palavra inteira: *"bola"* | a criança separa BO + LA sozinha — **é ela quem faz o trabalho fonológico** |
| Que letra começa | a palavra inteira | idem |
| Rimas | duas palavras inteiras | idem |
| Ditado do Lumus | a palavra inteira | idem |
| Som das letras · famílias silábicas | **áudio gravado** | é o único caso em que o som isolado é o conteúdo |

Isto não é consolo por falta de recurso. Se o app dissesse "bo" e "la", a
criança só casaria som com peça; dizendo *"bola"*, ela é quem separa — que é
exatamente a habilidade que se quer ensinar. O teste melhorou a pedagogia.

## O que isso custa, e o que devolve

**Custa** uma sessão de gravação: cerca de 130 arquivos curtos — os sons das
letras e as famílias silábicas. Em AAC mono de baixa taxa, algo perto de
**400 KB**, contra os 3,4 MB que o app tem hoje.

**Devolve** três coisas:

1. **Determinismo.** Áudio gravado soa igual em todo aparelho. Uma cartilha
   cuja correção depende de qual engine de voz a família tem instalada não é
   uma cartilha — é um sorteio. Este é o argumento mais forte, e ele torna
   desnecessário testar em cada celular: não vamos depender disso.
2. **A voz de quem a criança conhece.** Quem grava é o pai e a mãe. Um menino
   de cinco anos aprendendo a ler ouvindo a voz da mãe é melhor do que
   qualquer voz sintética — e combina com o pilar da família no centro muito
   mais do que um truque de acento combinaria.
3. **Uma primeira versão que não espera.** Como nenhum jogo depende de sílaba
   falada, a área de Ler e Escrever pode sair **antes** da gravação, com os
   jogos de palavra inteira. As famílias silábicas entram depois, quando os
   áudios existirem.

## O que estamos abrindo mão

- **Do idioma automático.** A voz sintetizada falaria os seis idiomas de
  graça; o áudio gravado é em português. A alfabetização nasce só em português
  — o que é honesto: alfabetizar é ensinar a ler a língua da criança, e a
  nossa é essa.
- **Do truque do acento.** Ele funciona em 3 das 5 vogais neste aparelho, e
  ninguém sabe em quantas no próximo. Fica registrado aqui como curiosidade,
  não como plano.
- **De adiar.** A gravação vira uma dependência de pessoas, e dependência de
  pessoas atrasa. Por isso a primeira versão foi desenhada para não precisar
  dela.

## Como conferir

A página de teste continua respondida, com um registro por aparelho. Refazer o
teste em outro celular é abrir o mesmo link e marcar de ouvido — mas, pela
decisão acima, o resultado não muda mais o rumo: ele só diria se a voz
sintetizada serviria de reserva para algo que já vamos gravar.
