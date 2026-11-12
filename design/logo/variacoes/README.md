# Sistema de marca · V2 (variações)

Expansão do sistema do logotipo (`assets/vision-logo-system.png`), sem mudar a assinatura
principal. Referência de direção: galerias de sistemas de marca como o Logosystem
(logosystem.co), sem copiar nenhum logo de lá.

Todos os SVGs têm o texto convertido em contorno: abrem no Figma, Illustrator ou navegador sem
precisar das fontes. A prancha está em `prancha-sistema-v2.png`.

| Arquivo | Versão | Onde usar |
|---|---|---|
| `00-principal-escuro/claro/pulse.svg` | Assinatura principal | Site, documentos, proposta |
| `01-empilhado-escuro/claro.svg` | Empilhada | Capas, posts quadrados |
| `02-icone-perfil-pulse/escuro.svg` | Ícone (1080 × 1080) | Foto de perfil, favicon |
| `03-pixel.svg` | Wordmark pixel `vision_` | Títulos da temporada, vídeos |
| `04-selo.svg` | Selo circular | Adesivo, assinatura de entrega |
| `05-blueprint.svg` | Construção do sinal | Apresentação, processo |
| `06-moldura-sistema.svg` | Moldura dinâmica: os cantos enquadram outros sinais | Ícones de seção, destaques, stories |
| `07-fantasminha-assinatura.svg` | Com o fantasminha | Conteúdo, bastidores |
| `08-icone-marca/oferta/processo/social/servico/ideia.svg` | Ícones da moldura, um por arquivo (1080 × 1080), sinal centralizado pela caixa do desenho | Capas dos destaques do Instagram |
| `../animacao/vision-logo-animado.mp4` e `.gif` | Animado, 4 s | Abertura e fechamento de Reels |

## Regras que continuam valendo
- Não comprimir, inclinar ou fechar os cantos do [V]; respiro de ¼ da altura do símbolo.
- Uma cor por aplicação, sem gradiente. Verde #B5F45B como pulso, nunca como fundo de texto longo.
- A barra do cursor é do site (cabeçalho e animação), não da assinatura oficial.

## Gerar de novo
`node <pasta-de-ferramentas>/logo/gerar-variacoes.mjs design/logo/variacoes`
(script local fora deste repositório; usa `opentype.js` e as fontes da marca baixadas do Google Fonts).
