(() => {
  'use strict';
  const section = document.querySelector('#filme');
  if (!section) return;
  const video = section.querySelector('video');
  const button = section.querySelector('.trailer-play');
  const track = video.querySelector('track');
  const status = section.querySelector('.trailer-status');
  const fallback = section.querySelector('.trailer-fallback');
  let loaded = false;
  const report = (message) => {
    status.textContent = message;
    status.hidden = !message;
  };
  // Sem src e sem controles até o gesto: nenhum MP4 é pedido na visita inicial.
  video.controls = false;
  button.hidden = false;
  video.addEventListener('playing', () => report(''));
  video.addEventListener('error', () => {
    button.hidden = true;
    video.controls = true;
    report('Não foi possível carregar o trailer. Você pode tentar abrir o arquivo abaixo.');
    fallback.hidden = false;
  });
  button.addEventListener('click', () => {
    if (!loaded) {
      track.src = track.dataset.src;
      video.src = video.dataset.src;
      loaded = true;
      video.load();
    }
    video.controls = true;
    button.hidden = true;
    report('Carregando o trailer…');
    video.focus();
    // play() permanece no gesto do visitante; não há reprodução automática.
    const request = video.play();
    if (request) request.catch(() => {
      report('Use o botão de reprodução do vídeo para assistir.');
      fallback.hidden = false;
    });
  });
})();
