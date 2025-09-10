document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('botao-acessibilidade');
  const opcoes = document.getElementById('opcoes-acessibilidade');
  const aumentar = document.getElementById('aumentar-fonte');
  const diminuir = document.getElementById('diminuir-fonte');
  const resetar = document.getElementById('resetar-fonte');
  const status = document.getElementById('a11y-status');

  if (!botao || !opcoes || !aumentar || !diminuir || !resetar) {
    console.warn('Elemento de acessibilidade ausente: verifique IDs no HTML.');
    return;
  }

  // Persistência (localStorage)
  const LS_FONT = 'edu_font_px';
  const root = document.documentElement;
  let baseFont = localStorage.getItem(LS_FONT)
    ? parseFloat(localStorage.getItem(LS_FONT))
    : parseFloat(getComputedStyle(root).fontSize) || 16;

  // aplica valor salvo
  root.style.fontSize = baseFont + 'px';

  // abre/fecha painel
  function openPanel() {
    opcoes.classList.add('open');
    opcoes.setAttribute('aria-hidden', 'false');
    botao.setAttribute('aria-expanded', 'true');
    // foco no primeiro controle para acessibilidade
    setTimeout(() => aumentar.focus(), 80);
  }
  function closePanel() {
    opcoes.classList.remove('open');
    opcoes.setAttribute('aria-hidden', 'true');
    botao.setAttribute('aria-expanded', 'false');
    botao.focus();
  }
  function togglePanel() {
    if (opcoes.classList.contains('open')) closePanel();
    else openPanel();
  }

  botao.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });
  botao.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); }
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (opcoes.classList.contains('open') && !opcoes.contains(e.target) && e.target !== botao) {
      closePanel();
    }
  });

  // Esc fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && opcoes.classList.contains('open')) closePanel();
  });

  // helpers de fonte
  const MIN = 12;
  const MAX = 28;
  const STEP = 2;
  function setFont(px) {
    baseFont = Math.max(MIN, Math.min(MAX, px));
    root.style.fontSize = baseFont + 'px';
    localStorage.setItem(LS_FONT, String(baseFont));
    if (status) status.textContent = `Tamanho da fonte: ${Math.round(baseFont)}px`;
  }

  aumentar.addEventListener('click', () => setFont(baseFont + STEP));
  diminuir.addEventListener('click', () => setFont(baseFont - STEP));
  resetar.addEventListener('click', () => {
    const defaultSize = 16;
    setFont(defaultSize);
    localStorage.removeItem(LS_FONT);
  });

  // inicializa (se quiser abrir por padrão, chame openPanel())
});
