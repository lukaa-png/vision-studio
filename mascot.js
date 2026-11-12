// Fantasminha da Vision no briefing.
// Ele acompanha quem preenche o formulário:
//   - olha para o ponteiro do mouse (ou para o dedo, no celular);
//   - "pensa" enquanto a pessoa digita;
//   - fica feliz quando a mensagem para o WhatsApp está pronta.
// O desenho vem do motor Open Bot Avatar (mascot-engine.js, licença MIT):
// a gente só entrega a silhueta e a posição dos olhos; volume, olhar,
// piscadas e humores são gerados por ele.
import { mountAvatar } from './mascot-engine.js';

// Silhueta validada com `avatar-validate.ts --strict`.
// Fonte e prévia: design/mascot/avatar-2d/fantasminha.json
const definition = {
  version: 1,
  id: 'vision-fantasminha',
  name: 'Fantasminha Vision',
  body: { path: 'M23 50C23 30 34.5 17 50 17C65.5 17 77 30 77 50C77.5 60 78.5 68 78 75C77.5 81 74 84.5 69 84.5C65 84.5 62.5 82.5 60.5 80.5C58 83.5 54.5 85.5 50 85.5C45.5 85.5 42 83.5 39.5 80.5C37.5 82.5 35 84.5 31 84.5C26 84.5 22.5 81 22 75C21.5 68 22.5 60 23 50ZM14.5 61C14 56.5 18.5 54 26 55L27.5 66C20.5 68 15 66 14.5 61ZM74 55C81.5 54 86 56.5 85.5 61C85 66 79.5 68 72.5 66Z' },
  eyes: { x: 50, y: 44, spacing: 17, scale: 1.2 },
};

// Cores por tema: Pérola no escuro, Visor no claro (ver design/mascot/avatar-2d/README.md).
const palette = {
  dark: { color: '#e8f1f5', eyeColor: '#080d18' },
  light: { color: '#101b2b', eyeColor: '#b5f45b' },
};

const root = document.documentElement;
const host = document.querySelector('.briefing-mascot');
const form = document.querySelector('#briefing-form');
const result = document.querySelector('.briefing-result');
const whatsapp = document.querySelector('#briefing-whatsapp');

const currentColors = () => palette[root.dataset.theme === 'light' ? 'light' : 'dark'];
// Se o visitante pausou o movimento no site, o mascote também para.
// 'system' segue a preferência do sistema (prefers-reduced-motion).
const motionSetting = () => (root.dataset.motion === 'paused' ? true : 'system');

if (host && form && result && whatsapp) {
  const bot = mountAvatar(host, {
    definition,
    ...currentColors(),
    followPointer: true,
    reducedMotion: motionSetting(),
    label: '', // decorativo: leitores de tela ignoram
  });

  // Enquanto digita: pensa. Depois de um tempo parado, volta ao normal.
  let idleTimer;
  form.addEventListener('input', () => {
    bot.update({ mood: 'thinking' });
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => bot.update({ mood: 'idle' }), 1400);
  });

  // O script.js mostra .briefing-result ao preparar a mensagem.
  // Só reagimos quando ele APARECE (quando some, o evento de input já cuidou).
  new MutationObserver(() => {
    if (result.hidden) return;
    clearTimeout(idleTimer);
    const ready = !whatsapp.hidden; // escondido = faltou preencher algo
    bot.update({ mood: ready ? 'happy' : 'idle' });
  }).observe(result, { attributes: true, attributeFilter: ['hidden'] });

  // Trocou o tema ou pausou o movimento: atualiza cores e animação.
  new MutationObserver(() => bot.update({ ...currentColors(), reducedMotion: motionSetting() }))
    .observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
}

// Outros lugares com o fantasminha (ex.: seção Estúdio), marcados com data-mascot:
// ele olha para o ponteiro e fica feliz enquanto o ponteiro está na seção.
document.querySelectorAll('[data-mascot]').forEach((stage) => {
  const extra = mountAvatar(stage, {
    definition,
    ...currentColors(),
    followPointer: true,
    reducedMotion: motionSetting(),
    label: '',
  });
  const section = stage.closest('section');
  section?.addEventListener('pointerenter', () => extra.update({ mood: 'happy' }));
  section?.addEventListener('pointerleave', () => extra.update({ mood: 'idle' }));
  new MutationObserver(() => extra.update({ ...currentColors(), reducedMotion: motionSetting() }))
    .observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
});
