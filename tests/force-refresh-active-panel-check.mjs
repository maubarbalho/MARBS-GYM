import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const requiredHtml = [
  'id="activeWorkoutPanel"',
  'function renderActiveWorkoutPanel()',
  'Treino ativo agora',
  'Progresso da sessão',
  'Próximo exercício',
  'Continuar treino',
  'Abrir treino',
  'guided-actions-grid',
  'js-guided-timer',
  'js-guided-repeat',
  '.guided-overlay.focus-mode .guided-actions-grid',
  '.guided-overlay.focus-mode .guided-prev-btn',
  'APP_UPDATE_VERSION',
  "scriptUrl.searchParams.set('v', APP_UPDATE_VERSION)",
  'await purgeOldAppCaches();',
  "url.searchParams.set('pwa-refresh', APP_UPDATE_VERSION)",
  'persistGuidedFormBeforeReload'
];
const missingHtml = requiredHtml.filter((token) => !html.includes(token));
if (missingHtml.length) throw new Error(`Painel/atualização forçada incompletos: ${missingHtml.join(', ')}`);

const requiredSw = [
  "CACHE_NAME = 'marsb-gym-v85-mobile-fluidity-stage3'",
  'async function purgeOldCaches()',
  'purgeOldCaches()',
  "event.data.type === 'PURGE_OLD_CACHES'",
  "event.data.type === 'SKIP_WAITING'",
  'self.clients.claim()'
];
const missingSw = requiredSw.filter((token) => !sw.includes(token));
if (missingSw.length) throw new Error(`Service worker sem atualização forçada completa: ${missingSw.join(', ')}`);

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A atualização forçada não pode limpar o estado principal local.');
}
if (html.includes('guided-mobile-actions') || html.includes('guidedQuickComplete') || html.includes('guidedQuickRepeat')) {
  throw new Error('A faixa rápida separada ainda está presente no modo guiado.');
}
const actionsMarkup = html.slice(html.indexOf('<div class="guided-actions-grid"'));
const utilityIndex = actionsMarkup.indexOf('class="guided-utility-row"');
const interruptIndex = actionsMarkup.indexOf('class="guided-interrupt-row"');
if (utilityIndex < 0 || interruptIndex < 0 || utilityIndex > interruptIndex) {
  throw new Error('Os controles de encerramento não estão na última linha do bloco de ações.');
}

console.log('OK: painel do treino ativo, limpeza forçada do cache e preservação do armazenamento local validados.');
