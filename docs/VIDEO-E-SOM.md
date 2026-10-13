# Motion, voz e som

O trailer leva a identidade ao tempo: 30 segundos, proporção 16:9 e entrega em 60 fps. Esta documentação registra a produção; não inclui os arquivos de áudio nem os masters neste repositório.

## Evolução

A V1 estabeleceu a estrutura. A V2 acrescentou revelações por máscara, digitação, rolagem de telas, montagem dos cantos do [V], traçado das diagonais e transformação do símbolo na assinatura.

## Narração

A narração anterior foi substituída integralmente por Ana Alice - Friendly & Clear, em um arquivo fornecido pelo autor. As frases foram posicionadas sem alterar a velocidade ou o tom. A tradução inglesa foi sincronizada novamente a partir da narração limpa final.

## Áudio

A trilha Glass and Shadow foi fornecida e recortada para o trailer. Samples identificados como ElevenLabs foram editados em 16 amostras e 53 eventos. A terceira tecla é uma variação editada; ambiente e cauda usam sobreposição e decaimento de samples curtos.

O silêncio entre 21,5625 e 22,5625 segundos é intencional. O PCM tem amostras zero nesse intervalo. A entrega AAC preserva um núcleo silencioso, com resíduos curtos do codec nas bordas.

## Evidência da entrega de 10/10/2026

Master 1920 x 1080 e derivada 1280 x 720; 30 segundos, 1.800 quadros e 60 fps. Medição de áudio: -11,08 LUFS integrados e -1,61 dBTP. Os créditos locais registram decodificação, conferência de streams e revisão de frames.

Esses números descrevem a entrega anterior. Não houve nova renderização do trailer para preparar este repositório. Não foram gastos novos créditos de voz, música ou efeito na atualização da narração para Ana Alice.

Para publicar o vídeo, usar o master entregue e revisar os créditos de geração e materiais. O site público não foi alterado nesta organização para GitHub.

## Player do site — 13/10/2026

A derivada leve existente (1280 × 720, 60 fps, 1.679.485 bytes) foi incorporada antes do contato, sem reexportação e sem gasto de créditos. Poster extraído do próprio vídeo. O player não define `src` até o clique; `preload="none"` sozinho não garantiria essa condição.

O WebVTT usa os 15 intervalos do relatório de sincronização da narração final. Português no alto do player para não sobrepor o inglês já embutido no trailer. Controles nativos permitem desligar as legendas, pausar, buscar e entrar em tela cheia conforme suporte do navegador. Transcrição e link direto sem JavaScript oferecem alternativas.

O MP4 de distribuição é a única exceção aos vídeos ignorados pelo Git. Masters, áudios de produção e arquivos de edição continuam fora do repositório. Atualização do repositório e deploy público são etapas distintas.
