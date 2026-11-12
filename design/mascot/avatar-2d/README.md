# Fantasminha 2D vivo

Versão leve do mascote oficial para a web, feita com o motor
[Open Bot Avatar](https://github.com/DominikScholz/open-bot-avatar) (MIT).
A forma está em `fantasminha.json`: um path SVG e a posição dos olhos. O motor gera
o volume, o giro, o olhar que segue o mouse, as piscadas e os humores
(`idle`, `thinking`, `happy`). Não usa imagem, vídeo nem dependência instalada.

Uso pensado: avatar do chat ou do briefing no site, ícone, estado de "pensando"
enquanto o formulário monta a mensagem, e reação feliz quando a mensagem fica pronta.
O modelo 3D em `../official/` continua sendo a peça dos comerciais.

## Arquivos
| Arquivo | O que é |
|---|---|
| `fantasminha.json` | Definição validada (`--strict`): silhueta com barra ondulada e bracinhos |
| `index.html` | Prévia com as três cores, os humores, o olhar e os tamanhos de uso |
| `fantasminha-perola.svg`, `-pulse.svg`, `-feliz.svg` | Imagens estáticas para usos sem JavaScript |

## Cores testadas
| Variação | Corpo | Olhos | Onde usar |
|---|---|---|---|
| A · Pérola | `#e8f1f5` | `#080d18` | Fundo escuro, principal |
| B · Pulse | `#b5f45b` | `#080d18` | Destaque, chamadas |
| C · Visor | `#101b2b` | `#b5f45b` | Fundo claro |

## Usar em uma página
```html
<div id="mascote" style="width:160px;aspect-ratio:1"></div>
<script type="module">
  import { mountAvatar } from 'https://cdn.jsdelivr.net/npm/open-bot-avatar@0.2.1/dist/dom/index.js';
  const definition = await fetch('fantasminha.json').then((r) => r.json());
  const bot = mountAvatar(document.querySelector('#mascote'), {
    definition, color: '#e8f1f5', eyeColor: '#080d18', followPointer: true,
  });
  // bot.update({ mood: 'thinking' }) · bot.update({ mood: 'happy' })
</script>
```
O motor respeita `prefers-reduced-motion` por padrão.

## Ver a prévia
Sirva esta pasta por HTTP (o `fetch` não funciona em `file://`):
```
powershell -ExecutionPolicy Bypass -File "$HOME\.claude\skills\vision-qa\serve.ps1" -Root . -Port 8080
```

## Limites
O motor desenha uma cor só, sem sombreamento. O visor escuro, os cantos de
enquadramento e o V no peito do modelo 3D não cabem nesse formato. Para mudar a
forma, edite o JSON e valide de novo:
```
node <pasta-do-open-bot-avatar>/packages/core/scripts/avatar-validate.ts --strict fantasminha.json
```
