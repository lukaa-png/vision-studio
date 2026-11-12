# Evolução da Vision

Este registro documenta etapas anteriores de forma retrospectiva. O histórico Git começa com a organização do projeto no GitHub, sem commits retroativos.

## 12/11/2026 — Sistema de marca V2

- A assinatura principal não muda. O sistema ganha versões para cada uso: empilhada, ícone de perfil, selo, blueprint, pixel, com o fantasminha e a moldura dinâmica (os cantos do [V] enquadram outros sinais).
- Seis ícones da moldura (marca, oferta, processo, social, serviço, ideia), um por arquivo, para as capas dos destaques do Instagram.
- Logo animado de 4 s em MP4 e GIF para abrir e fechar Reels.
- SVGs com texto em contorno e prancha de apresentação em `design/logo/variacoes/`.

## 12/11/2026 — Fantasminha Social no contato

- O Fantasminha Social (o fantasminha com celular, avatar do Instagram da Vision) aparece animado no contato e leva aos bastidores da temporada no @vslvision. Também aparece no celular.
- `mascot.js` aceita `data-mascot="social"` para usar o Social em qualquer seção.

## 12/11/2026 — Ajustes de design

- Faixa "Já passaram por aqui" logo depois do hero, com Allyah Braids, Sára Zara, Solução Protect e Lan House do Black (só negócios reais; o Ateliê 27, conceitual, fica de fora).
- Valores: o pacote Completo ganha destaque e o selo "Recomendado"; a coluna da esquerda lista o que vem em todos os pacotes e acompanha a rolagem no desktop.
- Estúdio: o fantasminha 2D ocupa o espaço livre ao lado da assinatura e fica feliz quando o ponteiro passa pela seção.
- Numeração do menu igual à das seções; rótulo do processo alinhado às etapas novas.

## 12/11/2026 — Textos reescritos para o dono do negócio

- Títulos e botões trocam frases de estúdio ("Abrir possibilidades", "Construir com intenção") por frases concretas: "Quero meu site", "Do primeiro oi ao site no ar", "Preço fechado. Sem surpresa.", "Bora começar.".
- Processo descreve o que acontece em cada etapa (briefing e contrato, prévia para aprovar, no ar em 10 a 15 dias úteis).
- Título e descrição da página para busca e compartilhamento falam de sites para negócios do bairro e do preço.
- Menu ganha "Valores"; no celular, o menu aberto vira grade 2 × 2.
- A identidade (título pixelado, rótulos FIG. e mono) foi mantida.

## 12/11/2026 — Pacotes Essencial e Completo

- Landing page em dois pacotes: Essencial (R$ 500, endereço gratuito, 10 dias úteis) e Completo (R$ 990, domínio próprio, textos da Vision, perfil no Google e fotos tratadas, 15 dias úteis).
- Pagamento em duas partes: 50% para começar e 50% na entrega, com contrato.
- FAQ explica hospedagem, domínio no nome do cliente (cerca de R$ 40 por ano no Registro.br), pagamento e o que acontece ao cancelar a manutenção.

## 12/11/2026 — Melhorias de interface

- Hero com a oferta clara: landing pages para negócios do bairro, R$ 500, pronta em 10 dias úteis.
- Nova seção "Onde seu cliente decide": um celular que se endireita com a rolagem e mostra a página da Allyah Braids rolando na tela.
- Processo com linha de etapas que se preenche com a rolagem; FAQ com entrada em sequência.
- Rótulos de 8 a 10 px passaram para 11 e 12 px, para leitura no celular.
- Padrões adaptados do Ruixen UI (MIT) e reescritos em CSS e JS puros, sem dependências. Tudo para quando o movimento é pausado ou reduzido.

## 12/11/2026 — Fantasminha 2D no briefing

- Versão 2D viva do mascote, feita com o motor Open Bot Avatar (MIT). Definição, prévia e SVGs em `design/mascot/avatar-2d/`.
- O fantasminha acompanha o briefing: olha para o ponteiro, pensa enquanto a pessoa digita e fica feliz quando a mensagem para o WhatsApp está pronta. Muda de cor com o tema e para quando o movimento é pausado ou reduzido.
- Motor hospedado no próprio site (`mascot-engine.js`), sem depender de CDN. `mascot.js` e `mascot-engine.js` entram no pacote de deploy.

## 10/11/2026 — Comercial V5 e mascote oficial

- Comercial de 24 segundos com Allyah Braids, Solução Protect e Ateliê 27. A versão leve e a composição visual estão em `design/motion/v5/`.
- O fantasminha 3D da V5 foi aprovado como mascote oficial da Vision. O modelo editável, o GLB e quatro animações com fundo transparente estão em `design/mascot/official/`.

## 10/11/2026 — Solução Protect no portfólio

- Novo case de landing page no filtro Web, com capturas da abertura e dos serviços.

## 08/11/2026 — Portfólio de landing pages

- Allyah Braids passa a reunir identidade visual e site, com capturas da página inicial e do pedido de horário pelo WhatsApp.
- Ateliê 27 entra como projeto conceitual de barbearia, com demonstração do pedido de horário.
- Os dois cases incluem link para a página publicada.

## 02/11/2026 — V4 e primeiro protótipo 3D do mascote

- Direção clara da V4 e revisão de presença do mascote, com prévias leves e legendas em `design/motion/v4/`.
- Conceito e atlas de partes gerados por IA registrados como referências, com autoria e limites documentados.
- Protótipo mecânico 3D construído em Blender: 58 malhas no GLB, controles de corpo/cabeça/braços e teste de flutuação, giro e gesto.
- Fonte `.blend`, GLB com uma animação, prévia de cinco segundos e amostra transparente em `design/mascot/3d/`.
- Scripts portáveis do Blender e registros das verificações. Acabamento visual ainda em protótipo.
- IA para empresas identificada como visão futura, sem alegar um produto lançado.

## 13/10/2026 - Preparação da publicação automática

- GitHub Actions com verificação de sintaxe/referências antes do deploy.
- Empacotamento explícito dos arquivos públicos, sem documentação ou segredos.
- Projeto Cloudflare confirmado como `vision`, com URL `vision-ckp.pages.dev`.
- Publicação protegida por variável de ativação; credenciais cadastradas pelo dono no GitHub Secrets.
- Esta preparação não comprova a ativação nem o sucesso do deploy.

## 13/10/2026 - Trailer no site

- Seção “A Vision em movimento” antes do contato, com poster e play manual.
- V2 leve 720p60 preservada, sem autoplay/loop e sem carregar MP4 antes do clique.
- Controles nativos, legendas WebVTT em português e transcrição.
- Implementação em CSS/JS separados, sem alterar as interações anteriores.
- Pacote para Cloudflare preparado separadamente; commit no GitHub não é deploy.

## 13/10/2026 - Organização para GitHub

- Separação do código do site, documentação e capturas.
- README em português e roteiro de estudo de HTML/CSS/JavaScript.
- Primeiro repositório da Vision definido como privado para revisão.
- Nenhuma mudança de comportamento ou deploy do site neste preparo.

## 13/10/2026 - Apresentação do processo

- Documentação da jornada de identidade, site e trailer.
- Separação entre apresentação visual para LinkedIn e case documental para Behance.
- Capturas do site público em desktop e mobile.

## 10/10/2026 - Trailer V2

- Revisão do movimento, transições, tipografia e símbolo.
- Substituição da narração anterior pela voz Ana Alice fornecida pelo autor.
- Edição dos efeitos recebidos e sincronização das legendas.
- Master de 30 segundos em 1080p60 e versão leve em 720p.

## 09/10/2026 - Landing page

- Implementação em HTML, CSS e JavaScript nativos.
- Capas editoriais para os projetos do portfólio.
- Tema, menu, filtros, galeria e briefing local.
- Verificações registradas em desktop e larguras móveis de 390 px e 320 px.
