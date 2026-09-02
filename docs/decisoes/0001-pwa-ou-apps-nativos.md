# 0001 — PWA única ou aplicativos nativos por plataforma

- **Data:** setembro de 2026
- **Situação:** aceita
- **Decide:** ElCamargo Soluções em TI LTDA

## O contexto

O Lumus é hoje um **PWA** (aplicativo web progressivo) publicado no GitHub Pages,
instalável na tela inicial de Android e iPhone, funcionando integralmente offline
depois da primeira abertura.

A pergunta em aberto era: continuamos assim, ou construímos aplicativos dedicados
para web, Android (APK/Play Store) e iOS (App Store)?

A pergunta importa porque o público é **criança de 3 a 10 anos em família**, e o
projeto é gratuito, sem anúncios e sem coleta de dados — não há receita para
sustentar três bases de código.

## As opções avaliadas

### A. Só PWA (o que temos)

| | |
|---|---|
| Custo de construção | zero adicional |
| Custo de manutenção | uma base de código |
| Atualização | instantânea, sem loja, sem aprovação |
| Tamanho para o usuário | 3,3 MB no total, 171 KB de JavaScript comprimido |
| Offline | completo, por service worker |
| Descoberta | **nenhuma** presença em loja |
| Instalação no Android | banner do Chrome, um toque |
| Instalação no iPhone | Safari → Compartilhar → Adicionar à Tela de Início |

### B. PWA + TWA no Google Play

TWA (*Trusted Web Activity*) empacota **o mesmo PWA** num APK pequeno. Não há
reescrita: é o site rodando em tela cheia, sem barra de navegador, distribuído
pela Play Store.

| | |
|---|---|
| Custo de construção | baixo — configuração e verificação de domínio |
| Custo de manutenção | continua uma base de código |
| Atualização | o conteúdo continua instantâneo; só mudanças de empacotamento pedem nova versão na loja |
| Conta de desenvolvedor | US$ 25, pagamento único |
| Descoberta | presença na Play Store, elegível ao programa *Aprovado por Professores* |

### C. PWA + nativos (React Native / Expo)

| | |
|---|---|
| Custo de construção | **alto** — reescrita de toda a interface |
| Custo de manutenção | duas bases divergindo no tempo |
| Conta de desenvolvedor | US$ 25 (Google) + US$ 99 **por ano** (Apple) |
| Ganho real hoje | nenhuma funcionalidade que precisamos e não temos |

## A decisão

**Seguimos com o PWA como única base de código.** Quando for a hora de publicar,
entramos na Play Store por **TWA**, sem reescrever nada. Nativo fica fora do
plano até existir uma necessidade concreta que o PWA não atenda.

## Por quê

**1. Equidade de acesso é um pilar do projeto, não um detalhe.**
O Lumus é para crianças de todas as classes sociais. Um PWA de 3,3 MB abre num
Android de entrada, num plano de dados curto, sem download de loja e sem espaço
livre no aparelho. Um app nativo de dezenas de megabytes exclui exatamente a
família que mais precisa. Esse argumento sozinho decide a questão.

**2. Uma base de código é o que um time deste tamanho consegue manter bem.**
Somos uma empresa pequena com um produto gratuito. Três bases significam três
vezes o custo de cada correção, e — na prática — duas plataformas desatualizadas.
Preferimos um app excelente em uma tecnologia a três medianos.

**3. Correção no mesmo dia.**
Um erro que quebra a partida da criança é corrigido e publicado em minutos. Pela
loja, seria uma revisão de dias. Para um app usado por crianças pequenas, essa
diferença é de qualidade percebida, não de conveniência do desenvolvedor.

**4. Não usamos nada que exija nativo.**
Não há câmera, GPS, Bluetooth, compras, login, notificação em segundo plano nem
processamento pesado. Tudo o que o Lumus faz — desenhar, sortear, tocar voz,
guardar progresso — o navegador faz.

## O que estamos abrindo mão, com todas as letras

**Descoberta.** Pai procura app infantil na loja, não no Google. Sem loja, o
crescimento depende de indicação boca a boca. É a maior perda, e é por isso que o
TWA no Play entra assim que houver o que publicar.

**Atrito de instalação no iPhone.** No iOS a instalação só acontece pelo Safari,
por Compartilhar → Adicionar à Tela de Início. É um caminho que precisa ser
ensinado — o app já mostra as instruções, mas ainda assim é atrito real.

**Selos de loja.** *Aprovado por Professores* (Google) e a Categoria Kids (Apple)
dão confiança a um pai que não nos conhece. O TWA nos dá o primeiro; o segundo
exigiria nativo.

**Voz.** Dependemos das vozes do sistema. Filtramos apenas as que funcionam sem
rede (`localService`), o que garante o offline, mas limita o timbre ao que o
aparelho tem. Voz gravada própria seria melhor — e pesaria megabytes por idioma.

## O que já fizemos para não travar o futuro

Todo o armazenamento passa por `window.storage`, implementado sobre
`localStorage` em `src/lib/storage.js`. Se um dia formos para React Native, troca-se
o corpo de quatro funções por AsyncStorage ou MMKV e o resto do app não muda. A
decisão de hoje não é uma porta que se fecha.

## Quando revisar esta decisão

- Se a Play Store por TWA não der a descoberta esperada em seis meses.
- Se surgir necessidade real de recurso nativo (voz gravada pesada, notificação
  em segundo plano no iOS, integração com sala de aula).
- Se houver financiamento que sustente uma equipe maior que uma base de código.
