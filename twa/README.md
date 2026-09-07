# O pacote Android (TWA)

O Clarim é um site. O que vai para a Play Store é uma casca fina de Android que
abre esse site em tela cheia, sem barra de navegador — um **TWA** (*Trusted Web
Activity*). Não há código Android nosso: o app É o site, e atualizar o site
atualiza o app, sem passar por revisão da loja.

`twa-manifest.json` é a fonte da verdade. O projeto Android inteiro é **gerado**
a partir dele e não entra no repositório (ver `.gitignore`).

## Estado: preparado, não construído

O ambiente está pronto e o manifesto está escrito. O pacote **não pode ser
gerado ainda**, e por dois motivos que não dependem de código:

**1. O endereço ainda não responde.** O manifesto aponta para
`clarim.elcamargo.com.br`, que já está no DNS mas devolve 404: o repositório
ainda não tem domínio próprio, porque a troca de endereço está esperando todas
as famílias salvarem a cópia do progresso. Gerar o pacote agora produziria um
app que abre numa página de erro.

**2. A impressão digital do certificado ainda não existe.** É um ovo-e-galinha
do Google, e vale entender antes de bater a cabeça:

```
  gera o pacote com a SUA chave  ──►  envia para a Play
                                       │
  a Google RE-ASSINA com a chave dela ─┘
                                       │
  ela te mostra a SHA-256 dela  ◄──────┘
                                       │
  essa é a que vai no assetlinks.json ─┘
```

A impressão que vale é a do **Play App Signing**, não a da chave que você usou
para enviar. Pôr a errada faz o app abrir com a barra do navegador aparecendo —
o sintoma clássico, e o motivo pelo qual quase todo mundo erra aqui.

## O que já está feito

- Bubblewrap instalado (`npm i -g @bubblewrap/cli`)
- `~/.bubblewrap/config.json` apontando para o JDK 17 e o SDK que já existem
  nesta máquina — o Bubblewrap **não** precisou baixar os seus próprios
- `twa-manifest.json` escrito com o id, as cores, os ícones e a versão do app
- `public/.well-known/assetlinks.json` já existe no repositório, esperando só a
  impressão digital

## O que falta no ambiente

Duas mudanças no SDK do Android desta máquina. As duas são **aditivas e
reversíveis**, mas o SDK é compartilhado com o Collectors, então ficam aqui como
comando em vez de terem sido feitas por conta:

```bash
# 1. O Bubblewrap exige build-tools 36.1.0 (há 35.0.0 e 36.0.0 instaladas)
"$LOCALAPPDATA/Android/Sdk/cmdline-tools/latest/bin/sdkmanager.bat" "build-tools;36.1.0"
```

```powershell
# 2. O Bubblewrap valida o SDK procurando a pasta `tools/`, do layout antigo.
#    O SDK moderno põe isso em cmdline-tools/latest. Uma junção resolve:
New-Item -ItemType Junction -Path "$env:LOCALAPPDATA\Android\Sdk\tools" `
         -Target "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest"
```

Para desfazer a segunda: `Remove-Item "$env:LOCALAPPDATA\Android\Sdk\tools"` —
apaga só a junção, nunca o alvo.

Confirme com `bubblewrap doctor`.

## A chave de assinatura — leia antes de gerar

A chave de envio (*upload key*) **não é gerada aqui de propósito**. Ela é sua, a
senha é sua, e ninguém além de você deve escolhê-la ou vê-la.

```bash
keytool -genkeypair -v -keystore twa/android.keystore \
  -alias clarim -keyalg RSA -keysize 2048 -validity 10000
```

**Perder este arquivo ou a senha significa não conseguir mais atualizar o app.**
Guarde os dois fora deste computador — o `.keystore` está no `.gitignore` e
nunca deve ser commitado.

## Quando as duas travas caírem

```bash
cd twa
bubblewrap build          # gera o .aab a partir do twa-manifest.json
```

Envie o `.aab`, copie a SHA-256 que a Play Console mostra em *Configuração →
Integridade do app → Play App Signing*, e cole em
`public/.well-known/assetlinks.json`. Um deploy depois, o app abre sem barra.
