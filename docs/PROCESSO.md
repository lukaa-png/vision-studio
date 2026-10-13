# Do campo de visão à interface

## Intenção

A Vision é um projeto autoral de Luiz Albuquerque, unindo design e código. Aproximar negócios do bairro do digital é a direção desejada, não um resultado comercial já demonstrado.

## Direção visual

O conceito de campo de visão usa enquadramento e abertura. O [V] reúne quatro cantos e duas diagonais. O preto #080D18 sustenta a base; #E8F1F5 dá contraste; verde #B5F45B marca ênfase; ciano #8EDDD8 organiza informação.

Space Grotesk aparece em títulos e assinatura. IBM Plex Mono dá precisão a índices e metadados. Pixelify Sans é um acento experimental do título principal do site.

## Como a ideia virou código

O HTML organiza navegação, apresentação, projetos, serviços e contato. O CSS centraliza a linguagem em propriedades personalizadas, compõe as capas e reorganiza o layout em diferentes larguras. O JavaScript adiciona funções específicas sem framework.

Os tokens reais estão no início de `styles.css`, em `:root`: `--ink`, `--text`, `--pulse` e `--info`. As capas têm um arquivo próprio, `project-covers.css`, para que a composição não dependa de editar as imagens originais.

## Interações

O tema pode lembrar uma preferência no navegador. O menu anuncia seu estado com `aria-expanded`. Os filtros mantêm os projetos e atualizam a contagem. A galeria usa `<dialog>` e navegação por teclado. O briefing lê os campos, monta uma mensagem e oferece um caminho para WhatsApp, sem envio automático.

## Movimento e acessibilidade

O efeito óptico usa SVG e canvas. O botão de pausa e `prefers-reduced-motion` permitem reduzir a animação decorativa. Os rótulos e a estrutura semântica são recursos implementados, não uma auditoria integral de acessibilidade.

## Verificação e limites

Os registros da entrega de 09/10/2026 incluem sintaxe de JavaScript, referências locais, âncoras, capturas e testes de menu, tema, filtros e galeria. A preparação do GitHub repete a checagem de sintaxe e estrutura, preservando a fonte do site.

Não foram apresentados dados de conversão, leads ou faturamento. Preços e contatos presentes na implementação são informações da entrega original; revisar antes de uma nova campanha ou publicação.

## IA no processo

A IA apoiou organização, implementação, edição e conferência. Luiz escolheu referências, direção, materiais, aprovações e revisões. Este registro não afirma que todo o código tenha sido escrito manualmente pelo autor.
