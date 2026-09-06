# 0006 — A família silábica sem o app dizer sílaba

- **Data:** setembro de 2026
- **Situação:** aceita — tira a gravação do caminho crítico decidido na [0004](0004-a-voz-da-alfabetizacao.md)
- **Decide:** ElCamargo Soluções em TI LTDA

## O contexto

A [ADR 0004](0004-a-voz-da-alfabetizacao.md) mediu a voz do aparelho e
concluiu: ela **não diz sílaba solta**. Escreve-se `ba`, ela soletra "bê-á".
O truque do acento (`bá`) funciona em três das cinco vogais numa engine, e
`bí` e `bú` falham.

A decisão de lá foi gravar cerca de 130 áudios na voz do pai e da mãe. Ela
está certa, mas tem um custo que não é técnico: **depende de pessoas**, e a
família silábica ficou parada esperando uma sessão de gravação.

A pergunta desta ADR foi: existe outra saída?

## O que tentamos, e o que não funcionou

Antes de decidir, tentamos **decidir por máquina** se a engine soletra ou
fala — para poder varrer dezenas de grafias sem depender de ouvido. Foram
gerados 60 candidatos em WAV com a voz Microsoft pt-BR e testados três
métodos. **Os três reprovaram nos próprios controles:**

| Método | Como falhou |
|---|---|
| Cronometrar a fala | soletrar "bê-á" durou 130 ms e falar "bá" durou 120 ms — indistinguível |
| Contar picos de energia | contou **1 núcleo** em `bola` e em `bê á`, que têm 2 |
| Comparar a forma da onda com as duas hipóteses | `bola` saiu mais parecida com `pá` (1 sílaba) do que com `casa` (2) |

Fica registrado: **não achamos como medir isso sem ouvido humano.** O teste
da 0004 foi respondido de ouvido, e essa continua sendo a única via.

Uma coisa sobreviveu, e é útil: **a engine não soletra o que parece palavra.**
Todos os candidatos de três ou mais letras — `baba`, `aba`, `bah`, `bis`,
`bola` — se comportaram como palavra. O risco vive só nos tokens de duas
letras, que é exatamente onde a sílaba solta cai.

## Por que não fomos atrás do truque

Mesmo que uma grafia funcionasse na Microsoft Maria, ela não diz nada sobre o
TTS do tablet do Heitor, do Samsung do vizinho ou do celular de uma família na
Itália. É o argumento da própria 0004: **cartilha cuja correção depende da
engine instalada não é cartilha, é sorteio.** Achar o truque só trocaria um
sorteio por um sorteio com mais sorte.

## A decisão

**O app nunca diz a sílaba. Ele diz a PALAVRA, e a criança escolhe a sílaba
escrita.**

Não é contorno: é o que a cartilha de papel sempre fez. Ela nunca ensinou
"BA" no vácuo — ensinou **"BA de bala"**. A pergunta do jogo é

> 🐸 **Com que sílaba começa sapo?**  → `SE` `SA` `SI` `SU`

A voz lê *"Com que sílaba começa sapo?"* — uma palavra inteira dentro de uma
frase, que é justamente o que a 0004 mediu funcionar (8 palavras em 8, 3
frases em 3). As sílabas ficam **escritas**, em caixa alta, e ninguém as
pronuncia a não ser a criança.

Isso obrigou **uma linha** de mudança na voz: a pergunta carrega
`calaOpcoes`, e o leitor pula as alternativas. Sem isso a voz leria
"esse-é, esse-á, esse-i, esse-u" e ensinaria exatamente o contrário do jogo.

## A família não é banco de dados: ela se gera

Uma família silábica se forma **trocando a vogal**: `ba` → ba-be-bi-bo-bu;
`sol` → sal-sel-sil-sol-sul; `cro` → cra-cre-cri-cro-cru. Só a **palavra da
pergunta** precisa existir de verdade, e o banco já tem 104 delas com figura
e sílabas separadas à mão.

Por isso não foi preciso escrever nem uma palavra nova. O que foi preciso
escrever foi a regra do que é sílaba regular — consoante (ou dígrafo, ou
encontro com l/r) + vogal simples + no máximo um fechamento — porque trocar a
vogal de `ção` ou de `quei` produziria coisa que não é sílaba de língua
nenhuma. Um teste percorre as 18 famílias × 5 vogais e confere que **toda
sílaba gerada continua sendo sílaba**.

## Como a rodada endurece

| Faixa | Onde | As alternativas erradas | O que a criança precisa ouvir |
|---|---|---|---|
| Fácil | começo | mesma família: `DA DE DI DO` | a **vogal** |
| Médio | começo | mesma vogal: `LI NI ZI GI` | a **consoante** |
| Difícil | começo | as duas coisas | as duas |
| Gênio | **fim** | mesma família | a sílaba final, mais difícil de isolar |
| Mestre | fim | as duas coisas | idem |
| Lenda | sorteada | as duas coisas | idem |

## O que isto muda na 0004

**Nada do que ela mediu, e uma coisa do que ela planejou.** A gravação sai do
caminho crítico:

- **A família silábica não espera mais ninguém** — está no app, em seis
  faixas, e entrou na trilha do 1º ano, de graça.
- **O som isolado da letra** (o /b/, e não o nome "bê") continua sendo o único
  caso em que só áudio gravado resolve. Esse item continua no roadmap, e
  ficou menor: são os sons das letras, não mais as 130 sílabas.
- **Quando a gravação existir, ela entra por cima** — o áudio da mãe dizendo
  "BA" não substitui este jogo, acrescenta a ele.

## A outra saída que ficou na mesa

Gerar os 130 áudios aqui, offline, cortando a sílaba de uma palavra
sintetizada — o corte fora do aparelho é fácil e conferível, e daria
determinismo sem sessão de gravação. Não foi adiante por duas razões que não
são técnicas: exige uma ferramenta de voz na máquina de quem faz o build, e
**redistribuir áudio de voz proprietária num app MIT dado ao mundo é questão
de licença**, não de código. Fica registrado como possível, não como plano.
