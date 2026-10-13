# Publicação automática — Cloudflare Pages

Projeto Cloudflare confirmado: **vision**. URL de produção: https://vision-ckp.pages.dev/. Branch de produção: **main**. O nome do projeto não é o mesmo que o subdomínio; não recriar o projeto.

O projeto é Direct Upload/sem conexão Git. GitHub Actions e Wrangler podem publicar nele sem migrar para integração Git nativa. Referência: [Cloudflare — Direct Upload com CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Como funciona

Alteração dos arquivos do site em `main` → verificar sintaxe e referências → preparar `dist` → publicar no projeto existente. Pull requests fazem apenas verificações, sem credenciais do Cloudflare. Alteração só de documentação não publica. A opção **Run workflow** permite iniciar uma atualização manualmente pelo GitHub.

O empacotador copia apenas seis arquivos públicos da raiz e os assets permitidos; não copia `.git`, README, docs, scripts, arquivos temporários ou segredos. Não adiciona dependências ao site. Actions oficiais fixadas por SHA; Wrangler usa a versão major 4. Não cria nova conta, projeto ou plano.

Teste local do empacotador: `node scripts/prepare-deploy.test.mjs`. Ele verifica integridade dos arquivos copiados, exclusão de documentação/arquivo env, rejeição de extensão não permitida, recusa de pasta dist não vazia e links simbólicos quando suportados no ambiente.

## Ativação única, pelo dono da conta

1. Crie um API token no Cloudflare com **Account → Cloudflare Pages → Edit**, limitado à sua conta. Não use Global API Key nem permissões de DNS, Workers ou administração. O token pode editar Pages na conta selecionada, incluindo outros projetos: mantenha-o restrito e revogue-o se não precisar mais.
   Na interface atual de token de conta, essa permissão aparece como **Pages Write**. A proposta preparada tem validade de 90 dias: renovar o token e o segredo antes do vencimento para continuar publicando.
2. No repositório `lukaa-png/vision-studio`, abra **Settings → Secrets and variables → Actions → Secrets** e cadastre `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Cole o token diretamente no campo secreto do GitHub. Não envie pelo chat, não grave no código, não tire prints do valor.
3. Em **Variables**, cadastre `CLOUDFLARE_DEPLOY_ENABLED` com valor `true` somente quando autorizar que mudanças em `main` sejam publicadas.
4. Em **Actions → Vision · verificar e publicar → Run workflow**, execute na branch `main`. Confira o job **Publicar no Cloudflare** e teste o endereço público.

Sem essa variável de ativação, o job de publicação é pulado, mesmo com verificações aprovadas. Com variável ativa mas segredos ausentes, a execução falha sem publicar. Não há retentativas automáticas nem alteração de teto de cobrança. Runners hospedados usam a franquia/limites da conta GitHub; conferir o consumo da conta antes de ampliar o uso.

## Conferência após publicar

Abra o site, procure “A Vision em movimento”, clique no play, pause/avance, confira legendas e contato no celular. Se faltar o vídeo ou imagem, confira se a Action concluiu e se o commit corresponde à versão desejada. Não confundir commit salvo com deploy bem-sucedido.

## Interromper e recuperar

Mude `CLOUDFLARE_DEPLOY_ENABLED` para `false` para impedir próximos deploys. No Cloudflare restaure a implantação anterior; antes de novo push, reverta o código que causou o problema. A automação não altera nem revoga outros tokens. Não altere a visibilidade privada do repositório para ativá-la.
