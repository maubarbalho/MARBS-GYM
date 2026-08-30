import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  "const APP_UPDATE_VERSION = 'v86-mobile-fluidity-stage4'",
  'function refreshVisibleWorkoutView()',
  'if (guidedState.active) return;',
  'persistGuidedNavigation(false);',
  'if (currentPage === \'progresso\')',
  'renderProgressionPanel();',
  'renderProgressSnapshot();',
  'renderAdherenceCard();',
  "CACHE_NAME = 'marsb-gym-v86-mobile-fluidity-stage4'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Etapa 2 sem suporte esperado: ${token}`);
}

const toggleStart = html.indexOf('function toggleSet(');
const toggleEnd = html.indexOf('function getPreviousWorkoutSnapshot', toggleStart);
const toggleFn = html.slice(toggleStart, toggleEnd);
if (!toggleFn.includes('refreshVisibleWorkoutView();')) throw new Error('toggleSet não usa a atualização da tela visível.');
if (toggleFn.includes('renderTreinos();') || toggleFn.includes('renderQuickStart();') || toggleFn.includes('renderDailyHome();')) {
  throw new Error('toggleSet voltou a reconstruir telas individualmente.');
}
if (!toggleFn.includes('persistGuidedNavigation(false);') || !toggleFn.includes('saveState();')) {
  throw new Error('toggleSet não agrupa a persistência guiada em uma única gravação.');
}

const switchStart = html.indexOf('function switchPage(');
const switchEnd = html.indexOf('function getContinuousPeriodNumber', switchStart);
const switchFn = html.slice(switchStart, switchEnd);
if (switchFn.includes('requestAnimationFrame(renderAdherenceCard)')) {
  throw new Error('switchPage ainda possui renderização duplicada do painel de adesão.');
}

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A Etapa 2 não pode limpar o estado principal local.');
}

console.log('OK: Etapa 2, tela visível, persistência única, renderizações duplicadas removidas e cache v86 validados.');
