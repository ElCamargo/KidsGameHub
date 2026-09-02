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
| **A família no centro, com Cristo** | o app cria motivos para a família estar junta, e a fé é oferecida, nunca imposta | Momento em Família, Meu Caderno, dois jogadores no mesmo aparelho, presente semanal do responsável |
| **Acesso para todos** | criança de qualquer classe social, em qualquer aparelho, com ou sem internet | 3,4 MB no total, PWA sem loja, 100% offline depois da primeira abertura, gratuito e sem compra interna |
| **Privacidade sem asterisco** | não coletamos porque não queremos, não porque a lei exige | zero requisições a terceiros em execução, zero SDKs, tudo no armazenamento do próprio aparelho |
| **Educação de verdade** | reconhecer alternativa é o degrau mais raso; o app tem que ir além | Abordagem Educacional por Princípios: Pesquisar, Raciocinar, Relacionar, **Registrar** |
| **Respeito à criança** | nada de anúncio, vício, ranking público ou pressão para gastar | sem notificação, sem loja externa, e fase já vencida com 3 estrelas nunca cobra de novo |

## Em 30 segundos

| | |
|---|---|
| Jogos | **15**, em 6 áreas |
| Perguntas conferidas por script | **mais de 2.600** |
| Bandeiras | **176** (154 países + 22 regiões), empacotadas |
| Idiomas | **6**, com as mesmas 280 frases cada, todos embutidos |
| Tamanho total, com fontes e bandeiras | **3,4 MB** |
| JavaScript comprimido | **193 KB**, em 3 pedaços |
| Requisições a terceiros em execução | **0** |
| Dados coletados | **0** |
| Portão automático a cada alteração | 3 guardas de conteúdo + 37 testes |
| Licença | MIT |

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
| **A semana** | rodadas, acertos, estrelas, desenhos, memórias, páginas de caderno, partidas em dupla, momentos em família e lumicoins **desde domingo**, com os desenhos daquela semana |
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

### Dois jogadores no mesmo aparelho

Um celular, duas crianças — ou uma criança e o pai. Sem segundo aparelho, sem
internet, sem conta: **passando a vez**.

Funciona em dois lugares:

| Onde | Como é a vez |
|---|---|
| **Memória**, nos cinco temas | cada um vira duas cartas; **quem acerta o par joga de novo** — a regra do jogo de mesa |
| **Qualquer quiz**, em qualquer fase aberta | as perguntas se alternam, e entre uma e outra entra a tela *"passe o celular para…"* |

O parceiro sai da lista de perfis do aparelho, ou é um **convidado** — o primo
que veio passar a tarde não precisa se cadastrar para jogar uma partida.

**De quem é a vez fica grande na tela**, com o rosto e o nome de quem joga.
Sem isso, jogo em dupla vira discussão. No quiz há ainda a tela de passagem, e
ela não é enfeite: sem ela o segundo jogador vê a resposta do primeiro e o
duelo acaba antes de começar. **O cronômetro para** enquanto o aparelho troca
de mão.

**Em dupla é de graça, e paga os dois** — ganhando ou perdendo, 20 lumicoins na
primeira partida do dia. O que queremos que aconteça de novo amanhã é o irmão
chamar o irmão, não um vencer o outro. Depois disso a partida continua livre,
só não paga de novo.

**O que a dupla não mexe:** fase, estrela, recorde e rodada. As perguntas foram
divididas entre dois, e metade de uma rodada não vence fase nenhuma; recorde de
um não se faz a quatro mãos. **Dicas não existem em duelo** — comprar a vitória
sobre o irmão não é jogo.

No cartão do responsável, a coluna 👥 conta as partidas em dupla da semana.

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
[`src/data/caderno.js`](src/data/caderno.js). O sorteio é estável: a mesma
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
espanhol; francês, alemão e italiano recaem no inglês por enquanto.

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
| `tests/*.test.mjs` | 37 testes | conteúdo, idiomas, geografia, desenhos, voz, transferência |
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
dados      294 KB  →  102 KB comprimido    muda quando entra conteúdo
interface  161 KB  →   45 KB comprimido    muda toda semana
CSS         11 KB  →    1 KB comprimido
——————————————————————————————————————————————————————————
instalado, com as fontes e 161 bandeiras SVG:  3,4 MB
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

- O banco bíblico existe em português, inglês e espanhol; **francês, alemão e
  italiano recaem no inglês**.
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
em cada faixa** e roda os 37 testes — antes de gerar um único arquivo. Se
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
  App.jsx          a interface inteira: ~40 componentes, nenhum dado (4.882 linhas)
  main.jsx         ponto de entrada
  lib/storage.js   persistência — as 4 funções que um app nativo trocaria
  lib/voz.js       a voz do Lumus: só vozes locais, dois tons
  lib/transferir.js  salvar e restaurar o progresso por arquivo, sem conta
  index.css        base
  data/            SÓ DADOS: nenhuma lógica de jogo, nenhum componente
    textos.js            as 280 frases da interface, nos 6 idiomas
    geografia.js         154 países com tier, capitais, estados do BR e dos EUA
    desenhos.js          os 58 desenhos de colorir, área por área
    curiosidades.js      235 lugares do mundo
    ciencias.js          94 animais e os moldes de pergunta
    biblia.js            junta as tabelas e monta o banco
    biblia-livros.js     os 66 livros: grupo, capítulos, autor
    biblia-pessoas.js    201 personagens, parentescos e papéis
    biblia-lugares.js    lugares, milagres e parábolas
    biblia-fatos.js      versículos, falas, números e fatos avulsos
    versos.js            o versículo do dia, de Salmos e Provérbios
    devocional.js        os 7 princípios e os 49 devocionais do Momento em Família
    caderno.js           as 28 perguntas do Meu Caderno e os carimbos
tests/             37 testes em node --test, sem framework nenhum
docs/decisoes/     registros de decisão: por que o app é assim
scripts/
  prepare-flags.mjs  copia só as bandeiras usadas
  check-bancos.mjs   confere os bancos de perguntas
  check-faixas.mjs   garante que toda faixa existe em todo mapa que depende dela
  check-rodadas.mjs  monta uma rodada de cada trilha e faixa e confere se é jogável
.github/workflows/
  ci.yml             guardas, testes e build em toda alteração
  deploy.yml         publica no GitHub Pages
public/            ícones do app
vite.config.js     build, PWA e a divisão do pacote em três pedaços
```

### Sobre `src/lib/storage.js`

O app grava tudo através de `window.storage`. Esse arquivo implementa essa API sobre o `localStorage`. Quando o projeto migrar para Expo/React Native, basta trocar o corpo de quatro funções por AsyncStorage ou MMKV — o resto do app não muda.

### Sobre as bandeiras

Os SVGs vêm do pacote [`flag-icons`](https://github.com/lipis/flag-icons), instalado como dependência. Antes de cada `dev` e `build`, o script `scripts/prepare-flags.mjs` copia para `public/flags/` **apenas os códigos que o jogo usa** — ele lê `DATA` e `SUBFLAGS` direto de `src/data/geografia.js`, então as duas listas nunca divergem.

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
- [ ] Publicar na Play Store por TWA, sem reescrever ([ADR 0001](docs/decisoes/0001-pwa-ou-apps-nativos.md))
- [ ] Devocionais e perguntas do caderno em francês, alemão e italiano

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
languages and 176 flags — in a 3.4 MB installable PWA that makes **zero
third-party requests at runtime** and collects **no data whatsoever**. Progress
lives in the device's own storage and never leaves it.

Its pedagogy follows the **Principle Approach** (Research, Reason, Relate,
Record), and its centre is the well-being of the family — including a short
daily devotional meant to be read together, which each family **opts into** at
sign-up and which is entirely absent for those who decline.

Every change passes a build gate that checks the question banks for ambiguity,
**builds a real round of every track at every difficulty** to prove it is
playable, and runs 37 tests — among them one that guarantees all six languages
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
