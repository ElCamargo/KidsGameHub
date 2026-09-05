# Lumus — Kids Game Hub

[![CI](https://github.com/ElCamargo/KidsGameHub/actions/workflows/ci.yml/badge.svg)](https://github.com/ElCamargo/KidsGameHub/actions/workflows/ci.yml)
[![Deploy](https://github.com/ElCamargo/KidsGameHub/actions/workflows/deploy.yml/badge.svg)](https://github.com/ElCamargo/KidsGameHub/actions/workflows/deploy.yml)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)](LICENSE)
[![PWA offline](https://img.shields.io/badge/PWA-100%25%20offline-00B894)](#offline)
[![Sem coleta de dados](https://img.shields.io/badge/dados%20coletados-nenhum-E84393)](#privacidade)

**Jogos educativos para crianças, de graça, para o mundo todo.** Sem anúncios,
sem links para fora, sem cadastro, sem coleta de dados, funcionando offline num
celular de entrada.

Uma criação da **ElCamargo Soluções em TI LTDA** · CNPJ 57.299.418/0001-69 ·
Blumenau, Santa Catarina, Brasil.

🎮 **[Jogar agora](https://elcamargo.github.io/KidsGameHub/)** — abre no
navegador, dá para instalar na tela inicial, e depois disso funciona sem
internet nenhuma.

---

## Por que isto existe

O Lumus começou porque dois filhos, de 5 e 6 anos, pediam o celular — e o que
havia do outro lado era anúncio, compra dentro do jogo e um algoritmo medindo
quanto tempo a criança consegue ficar presa ali.

Fizemos o contrário. **O Lumus não quer o tempo da criança: quer o tempo da
família junta.** Ele não tem anúncio para vender, não tem dado para coletar e
não tem nada que empurre a criança a voltar sozinha. O que ele tem é motivo
para pai e filho abrirem o app na mesma mesa.

E tem um centro declarado, sem letra miúda: **o bem-estar da família com
Cristo.** Não como enfeite no rodapé — como a coisa em volta da qual o resto
foi construído. O **Momento em Família** (um devocional curto por dia, para ser
lido junto) e o **Meu Caderno** (onde a criança registra o que aprendeu) são o
coração do projeto, não um extra.

Isso não fica escondido no repositório: a **tela de abrir o app** mostra a
missão, a visão e os valores num carrossel embaixo dos jogadores — porque quem
abre o app é criança querendo jogar, mas quem instala é adulto, e ele merece
saber em dois toques o que este app é e o que ele nunca vai fazer.

**E é escolha da família.** No primeiro acesso, só o responsável vê o convite:
*"sua família quer isso no Lumus?"*. Quem diz não tem um app de jogos
educativos completo, sem uma única menção a fé. Esconder o que somos seria
desonesto; empurrar seria pior.

## Meta, visão e pilares

**Meta.** Colocar nas mãos de um milhão de crianças um app que ensina de
verdade, que não custa nada, que funciona no aparelho que a família já tem — e
que aproxima pais e filhos em vez de separá-los.

**Visão.** Que "aplicativo infantil" deixe de ser sinônimo de tela que rouba
atenção, e volte a ser o que sempre deveria ter sido: uma ferramenta na mão de
uma família.

Cinco pilares. Cada um tem consequência técnica — é por isso que estão aqui, e
não numa apresentação:

| Pilar | O que significa no produto | Onde isso aparece no código |
|---|---|---|
| **A família no centro, com Cristo** | o app cria motivos para a família estar junta, e a fé é oferecida, nunca imposta | Momento em Família, Meu Caderno, até quatro jogadores no mesmo aparelho, presente semanal do responsável |
| **Acesso para todos** | criança de qualquer classe social, em qualquer aparelho, com ou sem internet | 3,8 MB no total, PWA sem loja, 100% offline depois da primeira abertura, gratuito e sem compra interna |
| **Privacidade sem asterisco** | não coletamos porque não queremos, não porque a lei exige | zero requisições a terceiros em execução, zero SDKs, tudo no armazenamento do próprio aparelho |
| **Educação de verdade** | reconhecer alternativa é o degrau mais raso; o app tem que ir além | a Abordagem Educacional por Princípios, descrita logo abaixo |
| **Respeito à criança** | nada de anúncio, vício, ranking público ou pressão para gastar | sem notificação, sem loja externa, e fase já vencida com 3 estrelas nunca cobra de novo |

## A espinha pedagógica: a Abordagem Educacional por Princípios

Este é o pilar que mais decide o que entra e o que não entra no Lumus, e por
isso ele não cabe numa linha de tabela.

Um app que mostra um estímulo e pede que a criança reconheça a resposta certa
entre quatro está no **degrau mais raso** do aprendizado. É um bom quiz. Não é
formação. A **AEP — Abordagem Educacional por Princípios**, do trabalho de Hall
e Rosalie Slater, é o método que os filhos dos fundadores encontram na escola,
e é o que o Lumus adota — por convicção, e por coerência: a criança não deveria
achar em casa um jeito de aprender que contradiz o da escola.

### Os 4 R, e onde cada um vive no app

| Passo | O que é | Onde ele está |
|---|---|---|
| **Pesquisar** | buscar o fato, a origem, a definição | a rodada de perguntas, em todas as trilhas |
| **Raciocinar** | entender o **porquê**, a causa por trás do fato | ao errar, o app não diz "errou": diz por que a resposta certa é aquela, e há guarda de build que impede pergunta sem porquê |
| **Relacionar** | ligar o que se aprendeu à vida, a outras áreas e a um princípio | o Momento em Família, e a pergunta de fim de rodada que amarra o conteúdo a um dos 7 princípios |
| **Registrar** | escrever ou desenhar o que ficou — o caderno como domínio pessoal do aprendizado | o **Meu Caderno**, com carimbos para quem ainda não escreve |

O raciocínio de **causa e efeito** atravessa os quatro. É por isso que a tela do
porquê existe mesmo custando ritmo de jogo: sem ela o app volta a ser quiz.

### Os 7 princípios

Soberania · Individualidade · Autogoverno · Caráter · Aliança (União) ·
Semeadura e Colheita · Mordomia.

São o vocabulário das reflexões do Meu Caderno e o ciclo dos 49 devocionais do
Momento em Família — sete princípios, sete semanas.

### A regra para o que vier depois

Toda funcionalidade nova do Lumus **declara qual dos 4 R ela serve**, e nenhuma
entra existindo só como exercício. Um jogo que só pergunta e corrige está no
Pesquisar e para por aí; para entrar, precisa dizer onde estão o porquê, a
ligação com a vida da criança e o registro dela.

Isso vale para a etapa de alfabetização e reforço escolar que vem a seguir, e é
a régua pela qual ela deve ser cobrada.

Detalhes e o histórico da decisão em
[docs/decisoes/0002](docs/decisoes/0002-aep-no-lumus.md).

## Em 30 segundos

| | |
|---|---|
| Jogos | **24**, em 7 áreas |
| Perguntas conferidas por script | **mais de 2.600** |
| Bandeiras | **203** (154 países + 49 regiões e estados), empacotadas |
| Idiomas | **6**, com as mesmas 280 frases cada, todos embutidos |
| Tamanho total, com fontes e bandeiras | **3,4 MB** |
| JavaScript comprimido | **261 KB**, em 3 pedaços |
| Requisições a terceiros em execução | **0** |
| Dados coletados | **0** |
| Portão automático a cada alteração | 3 guardas de conteúdo + 94 testes |
| Licença | MIT |

---

## O que é

Um agrupador de jogos onde crianças aprendem brincando, num ambiente fechado e seguro.
São **24 jogos em 7 áreas**.

### Jogos

| Área | Jogo | O que treina |
|---|---|---|
| 📚 Ler e Escrever | Monta a Palavra | ouve a palavra inteira e monta com as sílabas |
| 📚 Ler e Escrever | Que Letra Começa | a figura e a letra inicial |
| 📚 Ler e Escrever | Rimas | consciência fonológica: o que termina igual |
| 🌍 Geografia | Bandeiras do Mundo | 203 bandeiras — países, estados e regiões — em 60 fases por continente |
| 🌍 Geografia | Memória do Mundo | memória visual com bandeiras, 6 níveis até 5×8 |
| 🌍 Geografia | Capitais | 27 estados do BR **com a bandeira de cada um** → países por continente → estados dos EUA |
| 🌍 Geografia | Curiosidades do Mundo | 235 lugares reais: em que país, cidade, mar ou continente |
| 🌍 Geografia | Quebra-cabeça do Mundo | monta a bandeira peça por peça, de 4 a 24 peças |
| 🔢 Matemática | Contas e Números | soma a decimais, até 5º ano |
| 🔢 Matemática | Quebra-cabeça dos Números | monta um cartaz de quantidades: conta as figuras, acha o número |
| 🦁 Natureza | Memória dos Animais | 50 animais |
| 🦁 Natureza | Quebra-cabeça dos Animais | monta um cartaz de bichos |
| 🦁 Natureza | Quiz dos Animais | classes, habitat, características |
| 🦁 Natureza | Curiosidades dos Animais | 400 perguntas de 94 animais: grupo, dieta, casa, nascimento |
| 🎨 Arte | Pintar e Colorir | 58 desenhos + gerador infinito |
| 🎨 Arte | Cores e Formas | cor, forma e as duas juntas |
| 🎨 Arte | Memória das Formas | 27 combinações |
| 🎨 Arte | Quebra-cabeça de Arte | monta **o desenho que a própria criança pintou** |
| 🔤 Idiomas | Palavras do Mundo | 45 palavras em 6 idiomas, escolhe qual aprender |
| 🔤 Idiomas | Memória de Palavras | casa figura com a palavra no idioma escolhido |
| 🔤 Idiomas | Quebra-cabeça de Palavras | monta um cartaz de figura e palavra, no idioma do app |
| ✝️ Fé e Bíblia | Quiz da Bíblia | 2000+ perguntas por idioma, em 100 fases |
| ✝️ Fé e Bíblia | Memória da Bíblia | símbolos bíblicos |
| ✝️ Fé e Bíblia | Quebra-cabeça da Bíblia | monta um cartaz de símbolos bíblicos |

O carro-chefe é **Bandeiras do Mundo**: a bandeira aparece, a criança escolhe o país entre quatro opções.

- 60 fases por continente, em escada de seis faixas (ver abaixo)
- Nas fases altas entram estados e regiões: os 27 do Brasil, doze dos EUA, e as regiões da Europa
- Modo Fácil sem cronômetro; depois o tempo aperta a cada fase, até 6 segundos
- Lumicoins: cada rodada custa conforme a faixa, dicas custam, acertar rende
- Mapa-múndi que se abre continente a continente, de carro, barco e avião
- 74 conquistas em 10 categorias, valendo de 30 a 250 lumicoins cada
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
| **A semana** | rodadas, acertos, estrelas, desenhos, memórias, páginas de caderno, partidas em grupo, momentos em família e lumicoins **desde domingo**, com os desenhos daquela semana |
| ∑ No total | rodadas, estrelas, conquistas, dias seguidos e lumicoins de sempre |
| 📔 Meu Caderno | as **três últimas páginas da semana**, com as palavras da criança |
| 🎨 Pintar e Colorir | os **últimos cinco desenhos**, desenhados ali — não um número dizendo quantos |
| 🧠 Memória | o maior tabuleiro vencido em cada tema, com estrelas e melhor tempo |
| Por jogo | quantas fases de cada trilha, com barra de progresso |

**A semana começa no domingo** e vem primeiro no cartão, porque é a pergunta
que o adulto faz ao pegar o celular: *o que ele fez esta semana?* Um total de
1.240 acertos não diz se a criança jogou ontem.

Dá para folhear as semanas anteriores com ◀ e ▶ — ficam guardadas as **12
últimas**, três meses, que é o quanto alguém olha para trás sem virar entulho
no aparelho. O presente do responsável reinicia no mesmo domingo: uma semana
só para a família toda.

O histórico começa a existir a partir de agora — os totais de antes continuam
em *No total*, mas não dá para saber em que semana aconteceram, porque o app
não gravava isso.

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

E o gesto chega do outro lado. Quando a criança abre o perfil dela, um
**bônus de mérito** aparece na tela: *"Papai viu o seu esforço e te deu um
presente: 🪙 +35. Parabéns! Continue assim."* Sem isso o presente era um
número que mudava sozinho no canto da tela, e ninguém saberia que veio de
alguém. Presentes dados antes de a criança entrar somam num aviso só.

### As bandeiras dos 27 estados

O pacote `flag-icons` traz países e algumas regiões, mas **não** os estados
brasileiros. Sem eles, a América do Sul travava: são doze países, e uma rodada
Lenda pede quinze bandeiras diferentes — ela terminava curta, com doze.

Agora os 27 estados entram nas fases mais altas: **uma pergunta no Difícil,
cinco no Gênio e no Mestre, sete no Lenda**, sempre em posições ímpares, para
nunca abrirem a partida nem caírem duas seguidas. A América do Sul passou a
ter a rodada Lenda cheia — e o Brasil de uma criança brasileira agora começa
pelo estado dela.

Junto vieram as 15 que já eram citadas no jogo e faltavam: Andaluzia,
Canárias, Baleares e doze estados americanos, que até então apareciam como
desenho de reserva.

**E elas apareceram também no jogo de Capitais.** Perguntar *"qual é a capital
do Rio Grande do Norte?"* para quem tem seis anos é pedir que ela leia uma
parede de texto antes de pensar na resposta; com a bandeira em cima do nome,
ela reconhece o estado pelo desenho. Vale para os 27 do Brasil e para os onze
estados americanos cujas bandeiras temos — os outros seguem só com o nome, sem
buraco na tela. **País continua sem bandeira ali**: a bandeira do país já é o
jogo ao lado, e mostrá-la aqui transformaria a pergunta de capital numa
pergunta de bandeira.

**De onde vêm, e por que estão versionadas.** Foram baixadas uma vez do
**Wikimedia Commons** por
[`scripts/baixar-bandeiras.mjs`](scripts/baixar-bandeiras.mjs) e commitadas em
`flags-extra/`, com a procedência de cada arquivo em
[`flags-extra/FONTES.md`](flags-extra/FONTES.md). Nem o build nem quem clona o
repositório depende da internet — o script roda quando a lista muda, e só.
São bandeiras oficiais de estados e regiões: símbolos públicos, hospedados no
Commons como domínio público.

**Doze delas viraram PNG, e isso é o ponto interessante.** Bandeira com brasão
desenhada em vetor é pesada: a de Louisiana tem **629 KB**, a de Nova York
584, a do Rio de Janeiro 342. As 42 somavam **3,03 MB** — quase dobrariam o
app. As que passam de 40 KB são baixadas já rasterizadas pelo próprio Commons,
a 320 px de largura, o suficiente para os 210 px em que a bandeira aparece na
tela. As mesmas 42 agora somam **0,33 MB**.

Qual é PNG e qual é SVG não é decidido no chute: o
[`prepare-flags.mjs`](scripts/prepare-flags.mjs) gera
`src/data/bandeiras-png.js` com a lista, e o app monta o endereço a partir
dela. Errar a extensão mostraria o desenho de reserva no lugar da bandeira.

### O banco bíblico nos seis idiomas

O banco nasceu em português, inglês e espanhol. Francês, alemão e italiano
agora leem **99% das perguntas no próprio idioma** — e o 1% que falta é
escolha, não descuido.

O que foi traduzido, em [`biblia-idiomas.js`](src/data/biblia-idiomas.js):

| | |
|---|---|
| Os 66 livros | *Genèse · 1. Mose · Genesi* — a grafia que cada Bíblia usa |
| Grupos, autores tradicionais e papéis | *Loi (Pentateuque) · Große Propheten · Profeti minori* |
| 201 personagens | nome **e** o que cada um fez |
| 96 lugares, 33 milagres, 28 parábolas | o lugar, o evento, a obra e o ensino |
| 97 perguntas de número e 28 fatos | com as alternativas |

**O que ficou em inglês de propósito: a citação de Escritura.** Os versículos
(`VERSICULOS`) e as falas (`CITACOES`) são texto bíblico. Traduzir texto
bíblico de cabeça é inventá-lo, e uma frase bonita e errada, num app cristão
para criança, é pior que uma frase certa em outro idioma. Eles só mudam quando
alguém trouxer a edição em domínio público de cada idioma — **Louis Segond
1910, Luther 1912, Diodati** — e conferir palavra por palavra.

Isso não é uma promessa no README: é um **teste**. Se alguém acrescentar
`fr`, `de` ou `it` a um versículo, o build falha, com a mensagem dizendo por
quê. As listas fechadas (os Dez Mandamentos, as pragas, os dias da criação)
seguem a mesma regra, pelo mesmo motivo.

**Como isso foi feito sem tocar nas tabelas.** Os arquivos de fatos continuam
com pt/en/es escritos à mão, do jeito que um revisor os lê. `biblia-idiomas.js`
é um mapa à parte, indexado pela frase em português, e cada tabela consulta
esse mapa ao montar a linha. Quem revisa conteúdo abre um arquivo; quem revisa
tradução abre o outro.

**O que isso custou:** o pacote de dados foi de 102 KB para **160 KB
comprimidos**, e o app inteiro de 3,4 para **3,5 MB**. Todo mundo baixa os
seis idiomas, inclusive quem só joga em português — é o preço de um app que
funciona offline sem baixar nada depois, e a conta continua fechando num
celular de entrada.

### Levar o progresso para outro aparelho

O Lumus não tem conta e não tem servidor — e não vai ter. Mas o celular
quebra, a família troca de aparelho, e **dois anos de fases vencidas não podem
morrer com o telefone**.

A solução é a mais velha que existe: **um arquivo**. No modo de edição da tela
de jogadores, o 💾 de cada criança salva uma cópia; o adulto guarda ou manda
para si mesmo como mandaria uma foto, e no aparelho novo abre em
📥 **Restaurar de um arquivo**. Nada sobe para lugar nenhum, e funciona em
modo avião.

**Restaurar nunca escreve por cima.** Cria sempre um jogador novo, com
identificador novo — quem já joga naquele aparelho continua intacto.

**A senha do responsável não viaja.** Um arquivo que carrega a tranca é um
arquivo que abre a tranca; e mesmo que alguém escreva uma senha dentro dele à
mão, ela é descartada na leitura.

**O caderno da criança vai junto**, e a tela avisa isso em amarelo antes de
salvar: são as palavras dela, e o arquivo se guarda como se guardaria um
caderno de verdade.

Ler um arquivo é **fronteira de confiança** — o que chega pode ter sido
editado à mão, trocado por outro ou corrompido pelo aplicativo de mensagens.
Por isso nada é aproveitado sem passar por `lerCopia`, que confere campo por
campo, recorta o que é grande demais e **devolve só o que reconhece**: nome
sem tamanho, avatar que não é objeto, papel inventado, idade de 9999 anos —
tudo isso vira campo são ou vira recusa, nunca vira erro no meio da partida.
São 7 testes só para isso, em
[`tests/transferir.test.mjs`](tests/transferir.test.mjs).

### A voz do Lumus

Ler a pergunta em voz alta. É o pedaço do app que mais muda **quem consegue
jogar**: uma criança de quatro anos não lê *"Qual destes voa?"*, mas escuta.

Ela lê o enunciado **e as alternativas** — sem as alternativas, quem não lê
ouve a pergunta e continua sem saber em que tocar. Emoji não é falado: o
sintetizador leria *"rosto de coelho"* no meio da frase.

**Dois tons, de propósito:**

| Tom | Onde | Como soa |
|---|---|---|
| **Lumus** | as perguntas e o porquê do erro | agudo e animado, um pouco devagar — criança pequena precisa de tempo entre as palavras |
| **Palavra** | o versículo do Momento em Família | grave, pausado e firme: uma voz de pai lendo para a família, não de locutor |

**Só voz do próprio aparelho.** O navegador também oferece vozes que falam
pela internet — melhores, e proibidas aqui. O filtro é `localService`. Num
aparelho sem voz instalada, **nada aparece**: nem o botão, nem o interruptor.
Prometer voz e ficar mudo é pior que não ter, porque a criança que mais
precisa dela é justamente a que joga em modo avião.

Nada é gravado, enviado ou medido — é síntese local, e só.

**Quem ainda não lê nasce com a voz ligada**, porque para essa criança a voz
*é* a pergunta. E a voz **abre jogos**: o Quiz dos Animais e o Cores e Formas
perguntam por escrito mas respondem por figura — ouvindo a pergunta, uma
criança de quatro anos joga os dois. Os de alternativa escrita (bandeiras,
capitais, ciências, curiosidades) continuam de fora: ouvir quatro frases e
lembrar em qual tocar é outra dificuldade, e não é a que a voz resolve.
Desligar a voz nunca tira da mão dela um jogo que já estava aberto. Quem já lê liga quando quiser, na ficha do jogador. Durante
uma partida há o 🔊 para ouvir de novo. Em duelo a voz cala: o outro jogador
ouviria a pergunta antes da vez dele.

### Raciocinar — o porquê de quem errou

O **2º R** da Abordagem Educacional por Princípios. Quando a criança erra, a
rodada **para** e mostra a frase verdadeira que faltava:

> 💡 **A RESPOSTA CERTA ERA**
> **Paraguai**
> Paraguai fica na América do Sul, e a capital é Assunção.

**Acertar não interrompe.** Quem já sabe não precisa de aula, e o ritmo é
metade da graça do jogo. O cronômetro **para** enquanto a criança lê, e a
pergunta seguinte começa com o tempo cheio — ler o porquê não pode custar a
fase.

De onde vem a frase, por trilha:

| Trilha | O que a explicação acrescenta |
|---|---|
| Bandeiras | o continente **e** a capital do país — dois fatos que a pergunta não tinha |
| Bandeiras (regiões) | de que país aquela região faz parte |
| Capitais | a frase inteira: *"São Luís é a capital do Maranhão."* |
| Matemática | a conta resolvida: `833 + 203 = 1036` |
| Bíblia | **85% do banco** traz o fato escrito na própria tabela: o que a pessoa fez e em que livro está, o Evangelho do milagre e da parábola, o grupo e o autor do livro, quem disse a frase |
| Bichos, Cores, Idiomas, Curiosidades, Ciências | a própria pergunta com a resposta ao lado — *"🐰 O que este animal come? Só plantas"* |

A última linha é deliberada, não preguiça. Numa pergunta de fato, a frase
completa e verdadeira **é** a explicação: a criança viu a pergunta e escolheu
errado; o que faltava era ver as duas coisas juntas. Onde havia fato a
acrescentar, ele foi acrescentado; onde não havia, não inventamos um.

Nas perguntas bíblicas, **85% do banco** tem a explicação escrita nas próprias
tabelas de fatos — revisá-la é revisar a tabela, não caçar frase no meio do
código. Os 15% restantes são as perguntas de ordem dos livros ("qual vem
depois de Josué?"), de número e de lista: ali não existe porquê, a ordem é a
ordem, e inventar um seria pior do que a pergunta com a resposta ao lado.

**A guarda cuida disso.** O `check-rodadas` monta uma rodada de cada trilha em
cada faixa e falha o build se **uma única pergunta** ficar sem explicação — ou
se a frase montada não disser a resposta certa. Não dá para acrescentar um
quiz novo e esquecer do porquê.

Com isto o ciclo fecha: **Pesquisar** (a rodada) → **Raciocinar** (esta tela)
→ **Relacionar** e **Registrar** ([Meu Caderno](#meu-caderno), no fim da
rodada).

### Até quatro jogadores no mesmo aparelho

Um celular e a família inteira à mesa — duas crianças, ou os dois filhos, o pai
e a mãe. Sem segundo aparelho, sem internet, sem conta: **passando a vez**.

Funciona em dois lugares:

| Onde | Como é a vez |
|---|---|
| **Memória**, nos cinco temas | cada um vira duas cartas; **quem acerta o par joga de novo** — a regra do jogo de mesa |
| **Qualquer quiz**, em qualquer fase aberta | as perguntas giram de um para o outro, e entre uma e outra entra a tela *"passe o celular para…"* |

Quem joga sai da lista de perfis do aparelho, e quem não tem perfil entra como
**convidado** — o primo que veio passar a tarde não precisa se cadastrar para
jogar uma partida. Cada convidado ganha uma cara diferente, porque com quatro
na mesa o nome escrito não resolve para quem ainda não lê.

**De quem é a vez fica grande na tela**, com o rosto e o nome de quem joga.
Sem isso, jogo junto vira discussão. No quiz há ainda a tela de passagem, e
ela não é enfeite: sem ela o jogador seguinte vê a resposta do anterior e a
rodada acaba antes de começar. **O cronômetro para** enquanto o aparelho troca
de mão.

**A rodada é cortada para caber igual em todo mundo.** Dez perguntas entre
quatro dariam 3, 3, 2, 2 — e quem respondeu duas perderia de quem respondeu
três sem ter errado nada. Então jogam-se oito, duas para cada.

**Jogar junto é de graça, e paga todo mundo** — ganhando ou perdendo, 20
lumicoins na primeira partida do dia, inclusive para quem não estava com o app
aberto. O que queremos que aconteça de novo amanhã é o irmão chamar o irmão, e
os dois chamarem a mãe; não um vencer o outro. Depois disso a partida continua
livre, só não paga de novo.

**Empate no topo é empate**, com dois ou com quatro: ninguém ganha por ter
chegado antes.

**O que a partida em grupo não mexe:** fase, estrela, recorde e rodada. As
perguntas foram divididas, e um pedaço de rodada não vence fase nenhuma;
recorde de um não se faz a oito mãos. **Dicas não existem em grupo** — comprar
a vitória sobre o irmão não é jogo.

No cartão do responsável, a coluna 👥 conta as partidas em grupo da semana.

### Quebra-cabeça

Arrastar e soltar, sem uma palavra na tela. É o jogo mais completo do hub para
quem ainda não lê — e por isso nasce aberto para as crianças pequenas, **um em
cada uma das seis áreas**, sempre no começo da fila da área: deixá-lo no fim
significaria a criança pequena ter que comprar os jogos de leitura antes de
chegar no dela.

| Nível | Fácil | Médio | Difícil | Gênio | Mestre | Lenda |
|---|---|---|---|---|---|---|
| **peças** | 4 | 6 | 9 | 12 | 16 | 24 |

**A imagem sai do que a criança já tem.** No de Geografia, uma bandeira sorteada
entre os continentes que ela abriu. No de Arte, **um desenho que ela mesma
pintou** — e é isso que nenhum app de loja consegue fazer, porque nenhum deles
tem o desenho dela. Enquanto ela não pintou nada, o desenho vem colorido por
nós: quebra-cabeça branco não tem como ser montado.

Nas outras quatro áreas a imagem é um **cartaz quadriculado**, uma figura em
cada quadrado, cada quadrado de uma cor: bichos, símbolos bíblicos, figura com
a palavra no idioma do app, ou quantidades para contar com o número embaixo.
Uma figura só, esticada no tabuleiro, não daria quebra-cabeça — em 24 pedaços
vira mancha, e as peças do fundo ficam todas iguais. O cartaz cresce com o
nível, e **nunca no mesmo passo do corte**: são contas diferentes de propósito,
para a peça não cair certinha em cima de uma figura só.

**As peças têm encaixe de verdade**, com dente e buraco, sorteados a cada
partida. Não é enfeite: numa bandeira de duas cores, seis peças quadradas
ficariam idênticas e a criança acertaria por sorte. Com o encaixe, a **forma**
já diz onde a peça vai — e é a primeira leitura que ela aprende a fazer, antes
da letra. O corte de duas peças vizinhas é um só, e há teste garantindo que o
que sai de uma é exatamente o buraco da outra.

**O tabuleiro mostra o desenho apagado e os cortes por cima**, para ela comparar
a forma que está na mão com o buraco que está na tela — como se faz num
quebra-cabeça de madeira desde sempre.

**Duas formas de jogar**, porque dedo de criança de quatro anos erra o alvo:
arrastar a peça até o lugar, ou tocar na peça e depois tocar no lugar. A
segunda é a única que funciona por teclado e por toque assistido. Soltou perto,
gruda. Errou, a peça treme e volta — sem punição, sem perder nada.

Estrelas pelo tempo, recorde por imagem e nível, e montar de novo depois das
três estrelas é de graça. A ficha do responsável conta as partidas na coluna 🧩.

Nada disto pede biblioteca de arrastar-e-soltar: são Pointer Events e um
`clipPath` de SVG por peça, que o navegador aplica na mesma imagem tanto na
peça grande do tabuleiro quanto na pequena da bandejinha.

### O app lembra o que a criança errou

Até aqui o Lumus guardava estrela por fase e nada mais. A criança errava
"girafa é mamífero" na segunda, acertava por sorte na quinta, e ninguém
aprendia nada. Agora **a pergunta errada volta**.

| Acertou na volta | A pergunta volta em |
|---|---|
| 1ª vez | 1 dia |
| 2ª | 3 dias |
| 3ª | 7 dias |
| 4ª | 21 dias — e depois **sai da fila**, aprendida |

Errou de novo, volta ao começo. Espaçamento crescente é o que fixa a memória;
revisar tudo todo dia cansa e ensina menos. E a pergunta **sai** quando é
aprendida: insistir depois disso vira castigo.

Na tela inicial aparece **🔁 Lembrar o que errei**, com quantas venceram hoje.
**É de graça** — cobrar da criança para consertar o próprio erro seria o
avesso do que este app quer ser — e paga 4 lumicoins por pergunta lembrada.
Não mexe em fase, estrela nem recorde: consertar não é conquista nova, é a
mesma conquista ficando de pé.

**Guardamos a pergunta inteira, não um código dela.** As rodadas são montadas
na hora, sorteando de bancos grandes; refazer exatamente aquela pergunta
pediria que cada um dos dez montadores soubesse montar um item específico.
Guardar o objeto custa uns 300 bytes, não mexe em montador nenhum, e a fila
tem teto de 120 — cheia, sai quem está mais perto de ser aprendida.

**E é isso que faz a ficha do responsável dizer o que interessa.** Antes ela
contava quanto o filho jogou. Agora ela responde a pergunta que o pai
realmente tem:

> **ONDE ELE ESTÁ DEVENDO**
> Bandeiras do Mundo · América do Sul — 3
> Contas e Números — 2
> Que Letra Começa — 2

Não é lista de vergonha: é onde ajudar, e some sozinha quando a criança
aprende.

### Ler e Escrever

A área que faltava, e a razão de existir da próxima etapa: o Lumus tinha
"Idiomas" — palavras em seis línguas — e **nada que ensinasse uma criança
brasileira a ler a própria língua**, que é o conteúdo dos 4 aos 7 anos.

| Jogo | Como é |
|---|---|
| **Monta a Palavra** | a figura aparece, a voz diz a palavra **inteira**, e a criança monta com as sílabas |
| **Que Letra Começa** | a figura pergunta, as letras respondem |
| **Rimas** | qual palavra termina igual — consciência fonológica, que vem antes de ler |

**O app nunca fala a sílaba, e isso é decisão de ensino, não limitação.** A
criança ouve *"bola"* e monta **BO** + **LA**: quem faz a separação é ela, e é
essa a habilidade que se está ensinando. Se o app dissesse "bo" e "la", ela só
casaria som com peça. ([ADR 0004](docs/decisoes/0004-a-voz-da-alfabetizacao.md)
conta como o teste de voz levou a isso.)

**A conferência é sílaba a sílaba, não no fim.** Encaixou errado, a peça treme
e volta na hora. Deixar montar a palavra toda para só então dizer "errado"
ensina menos e frustra mais.

**As sílabas foram separadas à mão**, uma a uma, e não por algoritmo. Separação
silábica em português é regra cheia de exceção — dígrafo que não separa (ch,
lh, nh), dígrafo que separa (rr, ss), encontro com l e r que fica junto, hiato
que parte. Um algoritmo erra baixinho, e aqui um erro baixinho é uma criança
aprendendo a separar errado. Um teste garante que as sílabas remontam a
palavra, e outro que a bandeja nunca traz uma isca que também serviria.

**As estrelas contam erro, não relógio.** Aprender a ler não é corrida, e
cronômetro em quem está começando só atrapalha. Montar de novo depois das três
estrelas é de graça, como no resto do app.

### Toda rodada termina com uma palavra de incentivo

Não "Fim da rodada" e um número. Uma frase, sorteada entre três para não
cansar, e **também quando a criança foi mal** — aí ela nunca cobra, convida:
*"Quase lá!"*, *"Bora de novo?"*, *"Cada vez melhor!"*. No Monta a Palavra o
elogio aparece na hora em que a palavra fecha, que é o momento em que ela
acabou de conseguir.

### O som do Lumus

Duas coisas diferentes, e as duas se desligam num toque.

**A voz** lê a pergunta em voz alta, com as vozes já instaladas no aparelho —
nada é baixado. O alto-falante **também cala**: tocar nele no meio da leitura
para a fala, e tocar de novo lê outra vez. Quem tocou de novo queria silêncio,
não a mesma frase por cima da que estava saindo.

**O som de fundo** é uma musiquinha bem baixa que acompanha o app desde a tela
de escolher jogador. Não é arquivo de áudio: as notas nascem na hora, no Web
Audio, o que custa **zero byte** no pacote — trilha sonora gravada pesaria
megabytes, e o app inteiro tem que caber num celular de entrada.

Três decisões que a fazem não incomodar:

- **a escala é pentatônica**, onde não existe intervalo que soe errado. Numa
  escala comum, uma sequência sorteada cedo ou tarde acerta um meio-tom e sai
  uma nota torta no meio da fase, com criança do lado;
- **o passo acompanha o relógio da pergunta** e só acelera de verdade no fim —
  numa fase de 19 segundos, o intervalo entre as notas vai de 907 a 723 ms.
  Acelerar desde o começo deixaria a criança apressada a rodada inteira, e
  pressa é o contrário do que queremos;
- **ela se cala enquanto o Lumus fala**, e nas telas do Momento em Família e do
  Meu Caderno — que são para ler junto e para pensar, não para correr.

O interruptor fica em dois lugares: na **tela de escolher jogador**, ao lado do
idioma, e na ficha do jogador. Ele mora no aparelho, e não no perfil: é a
resposta a uma pergunta da casa — quanto barulho este app faz aqui.

*Nota de navegador:* nenhum navegador deixa um site fazer som antes do primeiro
toque da pessoa. A música entra no primeiro toque, que na prática é a criança
escolhendo o perfil.

### Meu Caderno

O **4º R** da Abordagem Educacional por Princípios: *Registrar*.

Ao fim de cada rodada, antes dos botões de jogar de novo, aparece uma
pergunta que liga o que acabou de acontecer a um dos sete princípios — *"teve
alguma hora que você quis desistir e continuou?"*, *"quem você quer ensinar o
que aprendeu hoje?"*. Nunca é sobre o conteúdo da rodada; é sobre quem jogou.
Esse é o passo **Relacionar**. O que a criança responde vira a página do
caderno: o passo **Registrar**.

**Não é corrigido, não vale ponto e não é comparado com nada.** É o único
lugar do app onde não existe resposta certa, e isso é o ponto: o resto mede
acerto, aqui a criança pensa.

**Quem ainda não escreve também registra.** São oito carimbos — *foi
divertido*, *foi difícil*, *aprendi algo novo*, *não desisti*, *errei e tentei
de novo*... — que a criança de quatro anos toca com o dedo. Eles vêm **antes**
do campo de texto na tela, de propósito: quem não digita precisa encontrar o
seu jeito primeiro, não depois de um campo que não sabe usar. Uma página só de
carimbos vale tanto quanto uma página escrita.

Dá para escrever também fora da rodada, pelo botão 📔 no hub — aí a pergunta
do dia é a mesma para o dia inteiro.

**15 lumicoins na primeira página do dia, e só nela.** Escrever tem que valer
a pena, mas não pode virar torneira de moedas: sem esse limite a criança
escreve dez linhas vazias e o caderno morre no mesmo dia em que nasceu. Depois
disso são quatro conquistas — 1, 10, 30 e 100 páginas.

O caderno guarda as **200 páginas mais recentes** (uma por dia é mais de meio
ano) e fica no save do próprio perfil. **O responsável lê as três últimas da
semana** direto no cartão da criança, com as palavras dela — é a parte do
cartão que ele lê inteira; o resto ele confere. Nada sai do aparelho.

As 28 perguntas — quatro por princípio — estão em
[`src/data/caderno.js`](src/data/caderno.js), **nos seis idiomas**: ao
contrário dos versículos, este texto é nosso, e traduzir não depende de
conferir edição nenhuma. O sorteio é estável: a mesma
rodada devolve sempre a mesma pergunta, senão ela trocaria a cada tecla
digitada.

### Momento em Família

Um devocional curto por dia, para a família fazer **junta**: um versículo, uma
pergunta para conversar e uma pequena atitude para hoje. Leva poucos minutos e
cabe na mesa do jantar.

A estrutura vem da **Abordagem Educacional por Princípios** — a mesma que os
filhos dos fundadores têm na escola. Cada semana fica num dos sete princípios
(Soberania, Individualidade, Autogoverno, Caráter, Aliança, Semeadura e
Colheita, Mordomia) e os sete dias daquela semana o aprofundam. Demorar numa
ideia é o método; sete assuntos soltos em sete dias não é.

**É opcional, e a família decide.** Na primeira vez, só o responsável vê o
convite: *"Sua família quer isso no Lumus?"*. Quem diz "agora não" tem um app
de jogos educativos completo, sem nenhuma menção a fé; quem diz "queremos" tem
o cartão no alto do hub, e o responsável pode reativar depois se mudar de
ideia.

O que fica marcado é do **lar, não do jogador**: mora em `lumus:familia`, fora
dos saves de cada perfil, e a sequência de dias é da família inteira — irmão
não reinicia a do irmão. Já o crédito individual (quem estava ali) vai para o
perfil de quem marcou, e aparece na semana do cartão do responsável, na coluna
🕊️.

**Não paga lumicoin nenhuma, de propósito.** Todo o resto do app recompensa
acerto; se a fé virasse moeda, ela viraria tarefa. A recompensa é a sequência,
e quatro conquistas ao longo do caminho — 1, 7, 30 e 100 momentos.

Três regras amarram o conteúdo, e estão escritas em
[`src/data/devocional.js`](src/data/devocional.js):

1. **Nada de doutrina que divida igrejas.** Salmos, Provérbios e os princípios
   são terreno comum; escatologia, batismo e governo eclesiástico ficam de
   fora. A mesa de cada família é da igreja dela.
2. **A pergunta é para conversar, não para acertar.** Não existe alternativa
   certa ali, e é o único lugar do app onde isso acontece.
3. **A atitude é pequena, concreta e cabe hoje.** "Ame mais" não é atitude;
   "diga obrigado a quem fez o seu almoço" é.

Os versículos são curtos e de traduções em domínio público (Almeida, KJV,
Reina-Valera 1909). São 49 devocionais, 7 por princípio, em português, inglês e
espanhol. Francês, alemão e italiano ainda recaem no inglês: o versículo
precisa vir de uma edição em domínio público daquele idioma — Louis Segond,
Luther, Diodati — e conferir isso é trabalho de gente, não de tradução
automática nossa.

O porquê de tudo isto está em
[`docs/decisoes/0002-aep-no-lumus.md`](docs/decisoes/0002-aep-no-lumus.md).

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

## Para quem vai avaliar tecnicamente

Esta seção é para quem abriu o repositório querendo saber **o que exatamente foi
construído, e se foi bem construído**. Ela não esconde o que está fraco.

### A arquitetura, em cinco linhas

**Vite 6 + React 18**, sem TypeScript, sem gerenciador de estado, sem roteador.
O app é uma tela só que troca de conteúdo por um estado `screen` — para um app
offline de 15 jogos, um roteador seria peso sem retorno. A persistência inteira
passa por uma API própria de quatro funções (`window.storage`), implementada
sobre `localStorage` em [`src/lib/storage.js`](src/lib/storage.js): trocar por
AsyncStorage ou MMKV, no dia de um app nativo, é trocar o corpo de quatro
funções e mais nada.

### Onde mora o quê

| | Tamanho | O que é |
|---|---|---|
| `src/App.jsx` | 4.882 linhas | a interface inteira: ~40 componentes, e nenhuma linha de conteúdo |
| `src/data/*.js` | 4.269 linhas | **só dados** — perguntas, textos, países, desenhos, devocionais |
| `tests/*.test.mjs` | 44 testes | conteúdo, idiomas, geografia, desenhos, voz, transferência |
| `scripts/check-*.mjs` | 3 guardas | rodam antes de todo `dev` e `build` |

A separação não é estética: um pastor consegue revisar
[`biblia-pessoas.js`](src/data/biblia-pessoas.js) e um tradutor consegue revisar
[`textos.js`](src/data/textos.js) **sem abrir uma linha de React**. Por que a
interface continua num arquivo só, e sob que condições isso muda, está escrito
em [ADR 0003](docs/decisoes/0003-um-arquivo-para-a-interface.md).

### O portão de qualidade

É a parte de que temos mais orgulho, e o que separa isto de um protótipo. **Nada
entra sem passar por aqui** — e o mesmo portão roda no `npm run build` da
máquina de qualquer pessoa, não só na nuvem:

| Guarda | O que impede |
|---|---|
| `check-bancos` | pergunta ambígua, alternativa repetida, resposta certa aparecendo entre as erradas, banco que encolheu por acidente |
| `check-faixas` | uma faixa de dificuldade existir num mapa e faltar em outro |
| `check-rodadas` | **monta uma rodada de verdade** de cada trilha em cada faixa e confere se ela é jogável |
| `npm test` | 37 testes: paridade das chaves nos 6 idiomas, marcadores `{n}` preservados na tradução, todo país com capital, todo desenho com área pintável, nenhum emoji indo para a fala, nenhum arquivo de fora virando progresso |

Eles não são teatro. O `check-rodadas` nasceu de um bug real — as fases Lenda
quebravam o app na 13ª pergunta, porque a rodada pedia 15 bandeiras e o
continente tinha 12 — e **na primeira execução já encontrou outro**: o Quiz dos
Animais montava a rodada inteira sem enunciado nas duas faixas do topo. Os dois
só apareciam jogando até o fim, no celular. Hoje aparecem em dois segundos.

### O que a criança baixa

```
react      142 KB  →   45 KB comprimido    quase nunca muda
dados      449 KB  →  160 KB comprimido    muda quando entra conteúdo
interface  169 KB  →   48 KB comprimido    muda toda semana
CSS         11 KB  →    1 KB comprimido
——————————————————————————————————————————————————————————
instalado, com as fontes e 203 bandeiras:      3,8 MB
```

Três pedaços em vez de um só: quem já tem o app baixa apenas o que mudou de
verdade.

### Offline e privacidade, verificáveis

Não é promessa de marketing — é propriedade do build, e dá para conferir:

- **Zero `runtimeCaching`** na configuração do service worker, porque não há
  servidor com quem falar. Está em [`vite.config.js`](vite.config.js).
- **Zero SDK de terceiro** no `package.json`: cinco dependências, todas de
  interface (React, duas fontes, as bandeiras).
- As bandeiras vêm do pacote npm `flag-icons` e são **copiadas no build** — o
  script lê a lista de países do próprio código, então as duas nunca divergem.
- Os nomes dos países vêm de `Intl.DisplayNames`, do próprio navegador: ~100
  idiomas de graça, nenhum arquivo, nenhuma tradução para manter.
- Abra o painel de rede e jogue uma partida inteira: não sai um pedido sequer.

### Acessibilidade

Feito, e verificável: todo botão de ícone tem nome (`aria-label`), o
`<html lang>` acompanha o idioma escolhido, há foco visível para quem navega
por teclado, `prefers-reduced-motion` desliga todas as animações, e o **zoom
não é bloqueado** — `user-scalable=no` saiu, e o toque duplo acidental é
resolvido com `touch-action: manipulation`, que é o certo.

O que ainda não é bom: o app **não foi testado com leitor de tela de verdade**,
e a bandeira da pergunta tem `alt=""` de propósito — um texto alternativo
entregaria a resposta —, o que significa que uma criança cega não joga o quiz
de bandeiras. Não temos solução para isso ainda, e preferimos escrever aqui a
fingir que está resolvido.

### O que sabemos que está fraco

- As perguntas bíblicas **ainda não passaram por revisão pastoral**. São geradas
  a partir de tabelas de fatos justamente para poderem ser revisadas — mas a
  revisão está no roadmap, não no passado.
- Não há teste de interface, só de dados e de montagem de rodada. A verificação
  de tela é feita à mão, no navegador, a 375 px.
- Sem presença em loja: hoje a distribuição depende de indicação. O caminho e o
  porquê estão em [ADR 0001](docs/decisoes/0001-pwa-ou-apps-nativos.md).
- A voz depende do que o aparelho tem instalado. Um Android de entrada sem voz
  local não fala — e é justamente ele o alvo do projeto. Voz gravada por nós
  resolveria, e pesaria megabytes por idioma; a conta ainda não fecha.
- No iPhone, a fala automática só começa depois do primeiro toque da criança
  na tela — é regra do Safari, não escolha nossa. O botão 🔊 funciona sempre.

### Registros de decisão

As três decisões que moldaram o projeto estão escritas, com as alternativas que
estavam na mesa e o que abrimos mão em cada uma:

| # | Decisão |
|---|---|
| [0001](docs/decisoes/0001-pwa-ou-apps-nativos.md) | PWA única ou aplicativos nativos por plataforma |
| [0002](docs/decisoes/0002-aep-no-lumus.md) | Como a Abordagem Educacional por Princípios entra no Lumus |
| [0003](docs/decisoes/0003-um-arquivo-para-a-interface.md) | Dados em arquivos separados, interface num arquivo só |

## Rodando na sua máquina

Requer Node.js 20 ou superior (a CI roda em 22).

```bash
npm install
npm run dev
```

O terminal mostra dois endereços. O `Network` é o que você abre no celular — desde que esteja no mesmo Wi-Fi.

### Conferindo tudo antes de confiar

```bash
npm ci && npm run build
```

O `build` é o portão inteiro: prepara as bandeiras, confere os três bancos de
perguntas, confere as faixas de dificuldade, **monta uma rodada de cada trilha
em cada faixa** e roda os 44 testes — antes de gerar um único arquivo. Se
qualquer um falhar, não sai build. Leva menos de 5 segundos.

Só os testes:

```bash
npm test
```

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
  App.jsx          a interface inteira: ~52 componentes, nenhum dado (6.370 linhas)
  main.jsx         ponto de entrada
  lib/storage.js   persistência — as 4 funções que um app nativo trocaria
  lib/voz.js       a voz do Lumus: só vozes locais, dois tons
  lib/transferir.js  salvar e restaurar o progresso por arquivo, sem conta
  lib/turma.js     jogar junto: quantos cabem, quem venceu, perguntas iguais para todos
  lib/quebracabeca.js  o quebra-cabeça: grade por nível, estrelas e o desenho do encaixe
  lib/som.js       o som de fundo: escala, ritmo e as notas geradas na hora
  lib/alfabetizacao.js  as regras do Monta a Palavra: bandeja, iscas e estrelas
  lib/revisao.js   a memória do erro: quando a pergunta volta, e quando sai da fila
  index.css        base
  data/            SÓ DADOS: nenhuma lógica de jogo, nenhum componente
    textos.js            as 280 frases da interface, nos 6 idiomas
    geografia.js         154 países com tier, capitais em 6 grafias, estados do BR e dos EUA
    desenhos.js          os 58 desenhos de colorir, área por área
    curiosidades.js      235 lugares do mundo
    ciencias.js          94 animais e os moldes de pergunta
    biblia.js            junta as tabelas e monta o banco
    biblia-livros.js     os 66 livros: grupo, capítulos, autor
    biblia-pessoas.js    201 personagens, parentescos e papéis
    biblia-lugares.js    lugares, milagres e parábolas
    biblia-fatos.js      versículos, falas, números e fatos avulsos
    biblia-idiomas.js    fr/de/it do banco bíblico — sem a citação de Escritura
    bandeiras-png.js     GERADO: quais bandeiras são servidas em PNG
    versos.js            o versículo do dia, de Salmos e Provérbios
    devocional.js        os 7 princípios e os 49 devocionais do Momento em Família
    caderno.js           as 28 perguntas do Meu Caderno e os carimbos
    palavras.js          104 palavras com as sílabas separadas à mão, figura e rima
tests/             94 testes em node --test, sem framework nenhum
docs/decisoes/     registros de decisão: por que o app é assim
scripts/
  prepare-flags.mjs  copia só as bandeiras usadas
  check-bancos.mjs   confere os bancos de perguntas
  check-faixas.mjs   garante que toda faixa existe em todo mapa que depende dela
  check-rodadas.mjs  monta uma rodada de cada trilha e faixa e confere se é jogável
  baixar-bandeiras.mjs  busca no Wikimedia Commons o que o flag-icons não tem
flags-extra/       as 42 bandeiras baixadas à mão, com FONTES.md ao lado
.github/workflows/
  ci.yml             guardas, testes e build em toda alteração
  deploy.yml         publica no GitHub Pages
public/            ícones do app
vite.config.js     build, PWA e a divisão do pacote em três pedaços
```

### Sobre `src/lib/storage.js`

O app grava tudo através de `window.storage`. Esse arquivo implementa essa API sobre o `localStorage`. Quando o projeto migrar para Expo/React Native, basta trocar o corpo de quatro funções por AsyncStorage ou MMKV — o resto do app não muda.

### Sobre as bandeiras

Os SVGs vêm do pacote [`flag-icons`](https://github.com/lipis/flag-icons), instalado como dependência, mais 42 baixadas do Wikimedia Commons que ele não tem (ver acima). Antes de cada `dev` e `build`, o script `scripts/prepare-flags.mjs` copia para `public/flags/` **apenas os códigos que o jogo usa** — ele lê `DATA` e `SUBFLAGS` direto de `src/data/geografia.js`, então as duas listas nunca divergem.

O script avisa quais códigos ainda faltam e quais SVGs passam de 60 KB. Para incluir uma bandeira nova, acrescente o código em `scripts/baixar-bandeiras.mjs` e rode `npm run baixar-bandeiras`: ela é baixada para `flags-extra/`, que é versionado. `public/flags/` é apagado e refeito a cada execução, então nada manual sobrevive lá.

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

### A próxima etapa: de hub de jogos a reforço escolar

O Lumus faz bem o que se propôs em [v1.0.0](https://github.com/ElCamargo/KidsGameHub/releases/tag/v1.0.0).
O que ele **não** faz é ensinar uma criança brasileira a ler a própria língua —
e é justamente o conteúdo dos 4 aos 7 anos. Esta é a etapa em curso, e cada
item abaixo diz **qual dos 4 R da [AEP](#a-espinha-pedagógica-a-abordagem-educacional-por-princípios) ele serve**.

- [x] **Testar a voz do aparelho com letras e sílabas** — feito, e decidiu o resto: a voz do aparelho lê **frases e palavras muito bem**, diz o **nome** da letra e não o som, e **soletra sílaba solta**. Escrever com acento (`bá`) faz ela falar, mas só nas vogais a, e, o — `bí` e `bú` continuam soletrados. Conclusão e consequências na [ADR 0004](docs/decisoes/0004-a-voz-da-alfabetizacao.md)
- [x] **Memória de erro e revisão espaçada** *(Raciocinar)* — feito: a pergunta errada volta em 1, 3, 7 e 21 dias e sai da fila quando é aprendida
- [ ] **Área 📚 Ler e Escrever, primeira versão** *(Pesquisar → Registrar)* — montar a palavra arrastando sílabas, que letra começa, rimas e ditado. Todos usam **palavra inteira** falada pelo aparelho, que funciona bem — e por isso esta versão **não espera a gravação**. O motor de arrastar do quebra-cabeça serve inteiro
- [ ] **Gravar os sons das letras e as famílias silábicas** — cerca de 130 áudios curtos (~400 KB), na voz do pai e da mãe. Desbloqueia a cartilha silábica, que a voz sintetizada não sustenta ([ADR 0004](docs/decisoes/0004-a-voz-da-alfabetizacao.md))
- [x] **Ficha do responsável dizendo onde o filho está devendo** *(Relacionar)* — feito, e saiu de graça da memória de erro
- [ ] **Matemática: tabuada, dinheiro brasileiro e horas** *(Pesquisar)* — hoje é uma trilha só; falta o que a escola cobra
- [ ] **Trilha do ano escolar** *(Relacionar)* — o app se organiza por dificuldade e por moeda; a escola se organiza por ano. Conteúdo de escola não deve ser trancado por lumicoin
- [ ] **Separar as telas de jogo em arquivos** — `src/App.jsx` tem 5.7 mil linhas e a alfabetização o levaria a 8 mil; revisita a [ADR 0003](docs/decisoes/0003-um-arquivo-para-a-interface.md)

**Onde decidimos não ir:** 6º ao 8º ano. Um menino de 13 anos não abre um app
com mascote e lumicoins, e mudar a cara do Lumus para atendê-lo estragaria o
que funciona para uma criança de cinco. O Lumus é dos 3 aos 10; atender os
maiores seria outro app, reusando esta base.

### Depende de outras pessoas

- [ ] Revisão pastoral do banco de perguntas bíblicas (2000+ por idioma)
- [ ] Versículos e falas em francês, alemão e italiano, de edição em domínio público conferida
- [ ] Publicar na Play Store por TWA, sem reescrever ([ADR 0001](docs/decisoes/0001-pwa-ou-apps-nativos.md))
- [ ] Devocionais em francês, alemão e italiano (o versículo pede edição em domínio público conferida)

## Privacidade

O app não coleta dados, não faz requisições a serviços de análise, não exibe anúncios e não tem links que levem para fora. Tudo o que a criança cria fica no aparelho.

## Documentos legais

- [Política de Privacidade](public/privacidade.html) — PT-BR e EN
- [Termos de Uso](public/termos.html) — PT-BR e EN

## In English, briefly

**Lumus** is a free, ad-free, offline-first educational game hub for children,
built by **ElCamargo Soluções em TI LTDA** (Blumenau, Brazil) and given away to
families worldwide.

15 games across 6 subject areas, 2,600+ script-verified questions, 6 interface
languages and 176 flags — in a 3.8 MB installable PWA that makes **zero
third-party requests at runtime** and collects **no data whatsoever**. Progress
lives in the device's own storage and never leaves it.

Its pedagogy follows the **Principle Approach** (Research, Reason, Relate,
Record), and its centre is the well-being of the family — including a short
daily devotional meant to be read together, which each family **opts into** at
sign-up and which is entirely absent for those who decline.

Every change passes a build gate that checks the question banks for ambiguity,
**builds a real round of every track at every difficulty** to prove it is
playable, and runs 44 tests — among them one that guarantees all six languages
carry exactly the same 280 interface strings.

The code is MIT-licensed. The reasoning behind the main technical choices is
recorded in [`docs/decisoes/`](docs/decisoes/), in Portuguese.

## Contato

**ElCamargo Soluções em TI LTDA** — CNPJ 57.299.418/0001-69 · Blumenau/SC,
Brasil · [github.com/ElCamargo](https://github.com/ElCamargo)

## Licença

MIT — © 2026 ElCamargo Soluções em TI LTDA. Ver [LICENSE](LICENSE).

---

**ElCamargo Soluções em TI LTDA** · CNPJ 57.299.418/0001-69
elcamargo.solucoes.ti@gmail.com
