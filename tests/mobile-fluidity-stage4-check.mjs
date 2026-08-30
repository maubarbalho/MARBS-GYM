import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  "const APP_UPDATE_VERSION = 'v87-guided-next-pending'",
  'const derivedSummaryCache = {',
  'function invalidateDerivedSummaryCache()',
  'derivedSummaryCache.workout.clear()',
  'derivedSummaryCache.calendar.clear()',
  'derivedSummaryCache.streak.clear()',
  'const cached = derivedSummaryCache.workout.get(cacheKey)',
  'derivedSummaryCache.workout.set(cacheKey, summary)',
  'const cached = derivedSummaryCache.calendar.get(cacheKey)',
  'derivedSummaryCache.calendar.set(cacheKey, days)',
  'const dialogRoots = [...document.querySelectorAll(\'[role="dialog"]\')]',
  'dialogObserver.observe(dialogRoot, { subtree: true, attributes: true, attributeFilter: [\'class\'] })',
  "CACHE_NAME = 'marsb-gym-v87-guided-next-pending'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Etapa 4 sem suporte esperado: ${token}`);
}

const saveStart = html.indexOf('function saveState()');
const saveEnd = html.indexOf('let lastVisibilitySaveAt', saveStart);
const saveFn = html.slice(saveStart, saveEnd);
if (!saveFn.includes('invalidateDerivedSummaryCache();')) throw new Error('O cache derivado não é invalidado ao salvar estado.');

if (html.includes("dialogObserver.observe(document.body")) {
  throw new Error('O MutationObserver continua observando o body inteiro.');
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A Etapa 4 não pode limpar o estado principal local.');
}

console.log('OK: Etapa 4, cache derivado sob demanda, invalidação segura, MutationObserver restrito e cache v87 validados.');
