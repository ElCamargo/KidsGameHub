# Publicar o Lumus na Play Store — pela conta CNPJ

> **O que este documento é:** o passo a passo completo para levar o Lumus à Google
> Play como **TWA**, usando a conta de desenvolvedor da **ElCamargo Soluções em TI
> LTDA**. A decisão de entrar por TWA em vez de reescrever em nativo está na
> [ADR 0001](decisoes/0001-pwa-ou-apps-nativos.md); aqui é só a execução.
>
> **Estado:** o domínio está resolvido (seção 0). O que trava agora é o D-U-N-S.
> Cada passo diz quem executa — há coisas que só
> o Ederson pode fazer (a conta, o pagamento, a assinatura) e coisas que são
> técnicas e podem ser preparadas antes.

---

## 0. O domínio — resolvido

**Feito em 06/09/2026.** `elcamargo.com.br` registrado no Registro.br em nome da
**ElCamargo Soluções em TI LTDA** (CNPJ 057.299.418/0001-69), válido até 06/09/2028.

Isto era o que travava tudo. Um TWA só abre em tela cheia — sem a barra de
endereço do Chrome por cima — se o site provar que autoriza aquele app, e a prova
é um arquivo que o Android procura **na raiz do domínio**:

```
https://lumus.elcamargo.com.br/.well-known/assetlinks.json
```

Enquanto o Lumus morava em `elcamargo.github.io/KidsGameHub/`, isso era
impossível: o GitHub Pages não deixa um repositório de projeto publicar arquivo na
raiz de `elcamargo.github.io`. Num subdomínio próprio, a raiz é nossa — e o
arquivo sai direto de `public/.well-known/`.

O que já está no repositório:

| Arquivo | Estado |
|---|---|
| `public/CNAME` | ✅ `lumus.elcamargo.com.br` |
| `vite.config.js` → `base` | ✅ `"/"` (era `"/KidsGameHub/"`) |
| `public/.well-known/assetlinks.json` | ✅ criado, faltando só a impressão digital (seção 3) |

### O que falta no DNS — painel do Registro.br

**Não precisa de Cloudflare.** O DNS do próprio Registro.br dá conta, e é uma
conta a menos para manter. Em *Painel → ELCAMARGO.COM.BR → DNS*:

```
lumus    CNAME    elcamargo.github.io.
```

E no repositório KidsGameHub, em *Settings → Pages → Custom domain*, digitar
`lumus.elcamargo.com.br` e marcar **Enforce HTTPS** depois que o certificado sair
(leva de minutos a uma hora).

Para o site da empresa no apex (`elcamargo.com.br`), são quatro registros A:

```
@    A    185.199.108.153
@    A    185.199.109.153
@    A    185.199.110.153
@    A    185.199.111.153
```

> **O endereço antigo não quebra.** O GitHub redireciona
> `elcamargo.github.io/KidsGameHub/` para o domínio novo, então quem já instalou o
> PWA é levado junto na próxima abertura.

## 1. A conta de desenvolvedor — o que só você faz

Conta de **organização** (CNPJ), não pessoal. A diferença é grande e vale dinheiro
e tempo:

- A conta pessoal criada hoje precisa de **12 testadores por 14 dias seguidos** em
  teste fechado antes de poder publicar em produção. A conta de organização **não
  passa por isso**.
- A conta de organização exige um **número D-U-N-S** da empresa. É gratuito, sai
  pela Dun & Bradstreet, e costuma levar de alguns dias a duas semanas. **Comece
  por aqui, porque é o que demora.** Se a ElCamargo já tem D-U-N-S de outra
  operação, é o mesmo número.

Ordem:

1. **Conseguir o D-U-N-S** no site da Dun & Bradstreet, com a razão social e o
   endereço exatamente como estão no CNPJ. Divergência de endereço é o motivo mais
   comum de a verificação do Google emperrar depois.
2. **Criar a conta** em `play.google.com/console`, escolhendo **Organização**.
   Taxa única de **US$ 25**.
3. **Verificação**: razão social, endereço, D-U-N-S, telefone, e-mail e site da
   empresa. O Google confere contra a base da D&B.
4. Definir o **nome de desenvolvedor** que aparece na loja — sugestão:
   `ElCamargo Soluções em TI`.

> ⚠️ **Eu não crio a conta, não pago a taxa e não preencho documento fiscal por
> você.** Isso é conta e dinheiro seu, e nenhuma automação deve chegar perto.
> A partir do momento em que a conta existir, eu preparo tudo o que é técnico e
> te entrego pronto para colar.

---

## 2. O pacote — o TWA

O TWA é um APK/AAB pequeno que abre o mesmo PWA em tela cheia. **Não há
reescrita**: o conteúdo continua sendo o site, e continua se atualizando sozinho
sem passar pela loja. Só mudanças de empacotamento (ícone, nome, permissões)
pedem versão nova na Play.

Dados do pacote, para ficar decidido antes de gerar:

| Campo | Valor sugerido | Por quê |
|---|---|---|
| `applicationId` | `br.com.elcamargo.lumus` | domínio da empresa invertido; **nunca muda depois de publicado** |
| Nome do app | `Lumus — Kids Game Hub` | igual ao `name` do manifest |
| Nome curto | `Lumus` | é o que cabe embaixo do ícone |
| `versionCode` | `1`, e +1 a cada envio | número inteiro, só cresce |
| `versionName` | `1.1.0` | acompanha o `package.json` |
| Orientação | retrato | igual ao manifest |
| Cor da barra | `#3C4FC4` | igual ao `theme_color` |
| Splash | `#1B2A6B` | igual ao `background_color` |

**A ferramenta.** O empacotador oficial é o **Bubblewrap** (`@bubblewrap/cli`),
que roda em Node e baixa por conta própria o JDK 17 e o Android SDK que precisa.
Não é dependência do projeto — é ferramenta de máquina, instalada global.

> **Preciso da sua autorização para instalar.** A regra do projeto é não instalar
> nada além do `package.json` sem perguntar, e ela vale aqui mesmo sendo global.
> A alternativa sem instalar nada é o **PWABuilder** (site do próprio time do
> Microsoft/Google Chrome), que gera o pacote assinado a partir da URL. Ele é um
> serviço externo: o site é público, então não há segredo indo para lá, mas a
> escolha é sua.

---

## 3. A assinatura — onde quase todo mundo erra

O Google guarda a chave definitiva do app (**Play App Signing**); você guarda uma
**chave de upload**. São duas chaves diferentes, e isso importa por um motivo:

> O `assetlinks.json` tem que levar a impressão digital **SHA-256 da chave de
> assinatura do app**, que só aparece no Play Console depois do primeiro envio —
> em *Configuração → Integridade do app → Assinatura de apps*. **Não é** a
> impressão da chave de upload que o Bubblewrap mostra ao gerar o pacote.

Errar isso é o motivo nº 1 de o TWA abrir com a barra do navegador aparecendo. E o
sintoma engana, porque em teste local funciona.

A ordem certa, então, é:

1. Gerar e enviar o pacote (o app ainda abre com a barra — é esperado).
2. Copiar a SHA-256 da **chave de assinatura** no Play Console.
3. Publicar o `assetlinks.json` com ela.
4. Reabrir o app: a barra some.

O arquivo fica assim — o campo `sha256_cert_fingerprints` é o único que você
preenche:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "br.com.elcamargo.lumus",
    "sha256_cert_fingerprints": ["<a SHA-256 do Play Console, com dois-pontos>"]
  }
}]
```

**Guarde a chave de upload e a senha dela fora da máquina.** Perder a chave de
upload é recuperável pelo suporte do Google; perder as duas, não — e o app fica
órfão, sem poder receber atualização nunca mais.

---

## 4. A ficha da loja

O que a Play pede, e o que já existe:

| Item | Situação |
|---|---|
| Ícone 512×512 PNG | ✅ `public/icon-512.png` |
| Gráfico de destaque 1024×500 | ❌ **falta** — posso desenhar |
| Capturas de tela do celular (mín. 2, ideal 8) | ❌ **faltam** — posso gerar do app rodando |
| Capturas de tablet 7" e 10" | ❌ faltam — opcionais, mas sem elas o app não aparece nas buscas de tablet |
| Política de privacidade (URL pública) | ✅ `/privacidade.html` |
| Termos de uso | ✅ `/termos.html` |
| E-mail de contato | ⚠️ decidir qual — vai aparecer **público** na ficha |
| Descrição curta (80 caracteres) | rascunho abaixo |
| Descrição completa (4000 caracteres) | rascunho abaixo |

### Descrição curta (80 caracteres)

```
Jogos educativos para crianças. Sem anúncios, sem cobrança, funciona offline.
```

### Descrição completa (rascunho)

```
O Lumus é um hub de jogos educativos para crianças de 3 a 10 anos, feito por uma
família e dado de graça a outras famílias.

SEM NADA DO QUE VOCÊ ESTÁ CANSADO
• Sem anúncios. Nenhum, em lugar nenhum.
• Sem compras dentro do app. Nada é bloqueado, nada é vendido.
• Sem cadastro e sem login. A criança abre e joga.
• Sem coleta de dados. O progresso fica no aparelho e não sai dele.
• Sem links para fora. Não há como a criança sair do app sem querer.

FUNCIONA SEM INTERNET
Depois da primeira abertura, tudo funciona offline — no carro, na viagem, na casa
da avó, no plano de dados que acabou.

O QUE TEM DENTRO
• Alfabetização: montar palavras por sílabas, ditado, rimas e som inicial
• Ortografia: as regras que o caderno cobra, sem nunca mostrar a palavra errada
• Interpretação de texto: textos curtos com perguntas, e a voz lendo para quem
  ainda não lê sozinho
• Matemática: contas armadas com vai-um e empresta-um, e problemas em texto
• Geografia: bandeiras e capitais do mundo inteiro, começando pelo Brasil
• Ciências: os animais, o corpo humano, as plantas, a água
• Bíblia: livros, personagens, milagres e parábolas
• Momento em Família: um devocional curto por dia, para fazer junto
• Memória, quebra-cabeça e desenho livre

ATÉ QUATRO CRIANÇAS NO MESMO APARELHO
Cada uma com o seu perfil, o seu progresso e o seu caderno. Ninguém compete com
ninguém.

CRESCE COM A CRIANÇA
Seis faixas de dificuldade em cada trilha. O jogo acompanha o ano escolar em vez
de repetir sempre a mesma coisa.

Feito por ElCamargo Soluções em TI LTDA, em Blumenau, Santa Catarina.
```

---

## 5. Os formulários — a parte que decide se o app entra

Estas respostas saem direto do que o app é. Guardadas aqui para não ter que
pensar de novo a cada atualização.

### Segurança dos dados (Data Safety)

| Pergunta | Resposta |
|---|---|
| O app coleta ou compartilha algum dado de usuário? | **Não** |
| Os dados são criptografados em trânsito? | não se aplica — não há trânsito |
| O usuário pode pedir exclusão dos dados? | não se aplica — nada sai do aparelho |

O progresso fica em `localStorage`, no próprio aparelho. Isso **não** conta como
coleta: o dado nunca é transmitido a lugar nenhum. Se um dia o app passar a
sincronizar entre aparelhos, esta resposta muda no mesmo dia.

### Público-alvo e conteúdo

| Pergunta | Resposta |
|---|---|
| Faixas etárias | **até 5**, **6 a 8**, **9 a 12** |
| O app é direcionado a crianças? | **Sim** |
| Programa **Designed for Families** | **participar** — é o que dá o selo e a vitrine de família |
| Contém anúncios? | **Não** |
| Contém compras? | **Não** |

Marcar "direcionado a crianças" liga a **Política de Famílias** do Google, que é
mais dura: nada de publicidade comportamental, nada de coletar identificador de
anúncio, nada de link para fora sem barreira de adulto. O Lumus já cumpre todas —
por decisão de projeto, não por causa da loja. É a vantagem de ter construído
assim desde o começo.

### Classificação de conteúdo (questionário IARC)

Violência, sexo, drogas, linguagem, jogos de azar, conteúdo gerado por usuário,
compartilhamento de localização, compartilhamento de dados pessoais:
**não** em todas. O desenho livre fica só no aparelho e não é compartilhável, então
não conta como conteúdo gerado por usuário.

Resultado esperado: **Livre / Everyone**.

### Aprovado por Professores (*Teacher Approved*)

Não se pede: o Google escolhe. Entra na fila automaticamente quem está no
Designed for Families. Ajuda ter as capturas de tela boas e a descrição honesta.

---

## 6. Ordem de execução

```
    VOCÊ                                    EU
 1. Pedir o D-U-N-S ──────────┐      2. ✅ domínio e assetlinks — feito
    (dias a semanas)          │         (falta só o CNAME no DNS)
                              │      3. Gerar ícones e capturas de tela
 4. Criar a conta CNPJ  ◄─────┘      5. Gerar o pacote TWA (com sua autorização
    (US$ 25)                            para instalar o Bubblewrap)
 6. Enviar o primeiro pacote
 7. Copiar a SHA-256  ────────►      8. Publicar o assetlinks.json
 9. Preencher os formulários         (respostas prontas na seção 5)
10. Enviar para revisão
```

A revisão do Google costuma levar de alguns dias a duas semanas para conta nova
de organização — a primeira é sempre a mais demorada.

---

## 7. O que eu já vi que vai dar trabalho

**O ícone maskable.** O `vite.config.js` usa o mesmo `icon-512.png` para `any` e
para `maskable`. Ícone maskable é recortado em círculo pelo Android, e só os 80%
centrais sobrevivem — se o desenho ocupa a imagem toda, as bordas somem. Vale
gerar um segundo arquivo com a arte reduzida e margem de segurança antes de
mandar para a loja, porque o ícone é a primeira coisa que o pai vê.

**As capturas de tela.** A Play mostra as duas primeiras nos resultados de busca.
Valem mais um jogo em andamento com a criança acertando do que a tela inicial com
o menu.

**O e-mail público.** A ficha exibe o e-mail de contato para qualquer um. Vale um
endereço da empresa em vez do pessoal.

**A atualização continua instantânea.** Vale repetir, porque muda como você
trabalha: o conteúdo do app é o site. Corrigir uma pergunta errada continua sendo
publicar uma tag — não precisa passar pela loja. Só o empacotamento passa.
