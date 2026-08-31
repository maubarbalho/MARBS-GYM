import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const requiredPages = ['page-home', 'page-treinos', 'page-progresso', 'page-dieta', 'page-calc', 'page-config'];
for (const pageId of requiredPages) {
  if (!html.includes(`id="${pageId}"`)) throw new Error(`Aba ausente no app: ${pageId}`);
}
const requiredVisualTokens = [
  '--primary: #c5f238',
  '--primary:#58740f',
  '--text: #f5f9e6',
  '--text-muted: #a8b391',
  'Global MARSB-GYM rebrand',
  '.header .subtitle { display: none; }',
  '.brand-logo { width: 24px; height: 24px;',
  ".brand-wordmark { font-family: 'Bebas Neue'",
  '.nav-icon',
  '.nav-icon svg',
  '.nav-item { min-width: 50px; min-height: 44px;',
  '.config-option-icon',
  '.exercise-icon-btn',
  '.guided-history-icon',
  '.section-title, .calc-section-title, .chart-section-title',
  '.btn-action.primary',
  '.guided-next-btn',
  '.guided-overlay.focus-mode .guided-actions-grid',
  '.guided-overlay.focus-mode .guided-prev-btn',
  '.form-field input, .form-field textarea'
];
for (const token of requiredVisualTokens) {
  if (!html.includes(token)) throw new Error(`Sistema visual global incompleto: ${token}`);
}
const deprecatedVisualTokens = ['#007aff', '#0a84ff', '#243044', '#8b9bb4', '#8b5cf6'];
for (const token of deprecatedVisualTokens) {
  if (html.includes(token)) throw new Error(`Cor fixa antiga ainda presente: ${token}`);
}
if (html.includes('Hipertrofia • Treino livre e progresso contínuo') || html.includes('<div class="subtitle">')) {
  throw new Error('O subtítulo removido do header voltou ao HTML.');
}
if (!html.includes("src: url('assets/fonts/bebas-neue-latin.ttf') format('truetype')")) {
  throw new Error('A fonte Box não foi incorporada localmente para uso offline.');
}
if (!html.includes('data-page="calc"><span class="nav-icon" aria-hidden="true"><svg')) {
  throw new Error('O ícone Teclas não está aplicado ao botão Calc.');
}
if (html.includes('data-page="calc"><span class="nav-icon" aria-hidden="true">＋÷</span>')) {
  throw new Error('O ícone antigo ＋÷ ainda está aplicado ao botão Calc.');
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A alteração visual não pode limpar os dados locais.');
}
for (const token of ['function renderTreinos', 'function renderProgressSnapshot', 'function renderDietDiary', 'function runMacroCalc']) {
  if (!html.includes(token)) throw new Error(`Fluxo existente ausente após rebranding: ${token}`);
}
if (!sw.includes("CACHE_NAME = 'marsb-gym-v89-guided-buttons'")) {
  throw new Error('O cache do PWA não acompanha o rebranding global.');
}
console.log('OK: abas, paleta, ícones, tipografia, header compacto, ausência do subtítulo, fluxos e preservação local validados.');
