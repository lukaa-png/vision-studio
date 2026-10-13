/* Vision: interação nativa, sem bibliotecas e sem envio automático de dados. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('js-ready');

  // Tema: a identidade noturna é o padrão; a escolha do visitante é lembrada.
  const themeButton = $('.theme-toggle');
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#080d18' : '#f1f4ef';
  }
  try { const saved = localStorage.getItem('vision-theme'); if (['dark', 'light'].includes(saved)) setTheme(saved); } catch { /* Preferência opcional. */ }
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('vision-theme', theme); } catch { /* Funciona sem armazenamento. */ }
  });

  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');
  menuButton.hidden = false;
  function closeMenu() { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); }
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // A animação é decorativa. Pode ser pausada e respeita a preferência do sistema.
  const motionButton = $('.motion-toggle');
  function setMotion(paused) {
    root.dataset.motion = paused ? 'paused' : 'playing';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Reproduzir animação do símbolo' : 'Pausar animação do símbolo');
    $('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  }
  setMotion(reduceMotion.matches);
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => setMotion(root.dataset.motion !== 'paused'));
  reduceMotion.addEventListener('change', event => setMotion(event.matches));

  // Campo óptico pontilhado, desenhado uma vez por mudança de tamanho.
  const canvas = $('.particle-field');
  function drawField() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(pixelRatio, pixelRatio);
    const scale = Math.min(width / 520, height / 430);
    const centerX = width / 2;
    const centerY = height / 2;
    for (let y = 12; y < height; y += 5) {
      for (let x = 12; x < width; x += 5) {
        const nx = (x - centerX) / (170 * scale);
        const ny = (y - centerY) / (157 * scale);
        const radius = Math.sqrt(nx * nx + ny * ny);
        const rim = Math.exp(-Math.pow((radius - .95) * 5, 2));
        const texture = (Math.sin(x * .83 + y * .51) + Math.cos(y * .61 - x * .13) + 2) / 4;
        const opacity = rim * (.10 + texture * .35);
        if (opacity < .04) continue;
        ctx.fillStyle = `rgba(181,244,91,${opacity.toFixed(3)})`;
        ctx.fillRect(x, y, 1.2 + rim * texture, 1.2 + rim * texture);
      }
    }
  }
  drawField();
  if ('ResizeObserver' in window) new ResizeObserver(drawField).observe(canvas);

  // Filtros mantêm os projetos reais e anunciam o número de resultados.
  $('.project-filters').hidden = false;
  const projects = $$('.project');
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let count = 0;
    projects.forEach(project => { project.hidden = filter !== 'all' && !project.dataset.category.split(' ').includes(filter); if (!project.hidden) count++; });
    $$('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
    $('.project-count').textContent = `${String(count).padStart(2, '0')} REGISTROS`;
  }));

  const galleryData = {
    vision: { title: 'Vision', category: '001 / IDENTIDADE + WEB / PROJETO PRÓPRIO', description: 'Campo de visão: enquadramento, tipografia e cor conectam a identidade às aplicações digitais.', images: [ ['assets/vision-logo-system.png', 'Direção do logotipo e suas aplicações'], ['assets/vision-direction.png', 'Direção de marca — Campo de visão'], ['assets/vision-manifesto.png', 'Manifesto — Abrir o campo'], ['assets/vision-oferta.png', 'Oferta — Ideia em sistema'], ['assets/vision-processo.png', 'Processo — Construir com intenção'] ] },
    black: { title: 'Lan House do Black', category: '002 / LANDING PAGE / ESTUDO AUTORIZADO', description: 'Estudo de desenvolvimento web publicado com autorização do proprietário. Apresentação dos serviços e presença digital de um negócio do bairro.', url: 'https://lan-house-do-black.pages.dev/', images: [ ['assets/black-web.png', 'Página inicial — Lan House do Black'] ] },
    sara: { title: 'Sára Zara', category: '003 / IDENTIDADE VISUAL', description: 'Projeto de identidade visual com logotipo, guia, paleta e materiais personalizados. Peças do portfólio original da Vision.', images: [ ['assets/sara-guia.jpg', 'Capa do guia visual'], ['assets/sara-post.jpg', 'Post — Política sem permissão'], ['assets/sara-agenda.jpg', 'Peça de agenda'], ['assets/sara-logo.png', 'Logotipo Sára Zara'] ] },
    allyah: { title: 'Allyah Braids', category: '004 / IDENTIDADE VISUAL', description: 'Identidade visual com logotipo, guia visual, paleta e materiais gráficos personalizados. Apresentação das peças originais.', images: [ ['assets/allyah-logo.png', 'Logotipo Allyah Braids'], ['assets/allyah-paleta.jpg', 'Paleta do guia visual'] ] }
  };
  const dialog = $('.project-dialog');
  let currentProject;
  let imageIndex = 0;
  function showImage() {
    const [src, caption] = currentProject.images[imageIndex];
    $('#gallery-image').src = src;
    $('#gallery-image').alt = caption;
    $('#gallery-caption').textContent = `${imageIndex + 1} / ${currentProject.images.length} — ${caption}`;
    $('#gallery-prev').hidden = $('#gallery-next').hidden = currentProject.images.length < 2;
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    currentProject = galleryData[button.dataset.project]; imageIndex = 0;
    $('#dialog-title').textContent = currentProject.title;
    $('#dialog-category').textContent = currentProject.category;
    $('#dialog-description').textContent = currentProject.description;
    $('#project-external').hidden = !currentProject.url;
    if (currentProject.url) $('#project-external').href = currentProject.url;
    showImage(); dialog.showModal(); document.body.classList.add('dialog-open');
  }));
  function stepImage(direction) { imageIndex = (imageIndex + direction + currentProject.images.length) % currentProject.images.length; showImage(); }
  $('#gallery-prev').addEventListener('click', () => stepImage(-1));
  $('#gallery-next').addEventListener('click', () => stepImage(1));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') stepImage(-1); if (event.key === 'ArrowRight') stepImage(1); });

  // Briefing local: prepara uma mensagem; o visitante confirma o envio no WhatsApp.
  const form = $('#briefing-form');
  let briefingMessage = '';
  $$('[data-interest]').forEach(link => link.addEventListener('click', () => { const radio = form.querySelector(`input[name="area"][value="${link.dataset.interest}"]`); if (radio) radio.checked = true; }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    if (!value('nome') || value('ideia').length < 10) { $('#briefing-preview').textContent = 'Preencha seu nome e conte sua ideia com pelo menos 10 caracteres.'; $('.briefing-result').hidden = false; $('#briefing-whatsapp').hidden = true; return; }
    briefingMessage = `Oi, Luiz! Quero conversar com a Vision.\n\nNome: ${value('nome')}\nE-mail: ${value('email')}\nÁrea: ${value('area')}\n\nIdeia ou desafio:\n${value('ideia')}\n\nPrazo: ${value('prazo') || 'A definir'}`;
    $('#briefing-preview').textContent = briefingMessage;
    $('#briefing-whatsapp').href = `https://wa.me/5511985169622?text=${encodeURIComponent(briefingMessage)}`;
    $('#briefing-whatsapp').hidden = false;
    $('.copy-status').textContent = '';
    $('.briefing-result').hidden = false;
    $('.briefing-result').focus({ preventScroll: true });
    $('.briefing-result').scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  $('#copy-briefing').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(briefingMessage); $('.copy-status').textContent = 'Mensagem copiada.'; }
    catch { $('.copy-status').textContent = 'Selecione a mensagem acima e copie para enviar.'; }
  });
  form.addEventListener('input', () => { $('.briefing-result').hidden = true; });
  $('#year').textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('reveal-enter'); observer.unobserve(entry.target); } }), { threshold: .12 });
    $$('.section-heading, .service-row, .studio-grid, .process-grid').forEach(element => observer.observe(element));
  }
})();
