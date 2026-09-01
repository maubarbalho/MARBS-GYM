import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const required = [
  "const APP_UPDATE_VERSION = 'v94-weekly-guided-ui'",
  "const CACHE_NAME = 'marsb-gym-v94-weekly-guided-ui'",
  "field.addEventListener('change'",
  'let dietFoodSearchTimer = null',
  'setTimeout(() => renderDietFoodOptions(search.value), 180)',
  'let exerciseFilterTimer = null',
  'setTimeout(() => renderTreinos(), 180)',
  'let touchScrollFrame = null',
  'const scheduleTouchScroll = (y, delta)',
  'scheduleTouchScroll(y, touchDelta)'
];
const missing = required.filter((token) => !html.includes(token) && !sw.includes(token));
if (missing.length) throw new Error(`Etapa 1 sem suporte esperado: ${missing.join(', ')}`);

const guidedFields = html.slice(html.indexOf("guidedBody.querySelectorAll('.js-guided-set-field')"), html.indexOf("guidedBody.querySelectorAll('.js-guided-set-toggle')"));
if (guidedFields.includes("field.addEventListener('blur'")) {
  throw new Error('O salvamento dos campos guiados voltou a duplicar a gravação no blur.');
}

const filterBlock = html.slice(html.indexOf('const exerciseFilter ='), html.indexOf('setWeek(getContinuousPeriodNumber())'));
if (!filterBlock.includes('clearTimeout(exerciseFilterTimer)') || !filterBlock.includes('setTimeout(() => renderTreinos(), 180)')) {
  throw new Error('O filtro de exercícios não possui debounce seguro.');
}

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A Etapa 1 não pode limpar o estado principal local.');
}

console.log('OK: fluidez mobile da Etapa 1, salvamento sem blur duplicado, debounces, toque agrupado e cache v88 validados.');
