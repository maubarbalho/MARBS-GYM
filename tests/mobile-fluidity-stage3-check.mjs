import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  "const APP_UPDATE_VERSION = 'v93-activity-flow'",
  'function updateGuidedSetProgress(ex)',
  'updateGuidedSetProgress(ex);',
  "row.classList.toggle('done', done)",
  "button.setAttribute('aria-pressed', String(done))",
  "guidedBody.querySelector('.guided-focus-set strong')",
  "guidedBody.querySelector('.js-guided-next')",
  "CACHE_NAME = 'marsb-gym-v93-activity-flow'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Etapa 3 sem suporte esperado: ${token}`);
}

const refreshStart = html.indexOf('function refreshGuidedAfterToggle(');
const refreshEnd = html.indexOf('function getLastWorkoutSetDetails', refreshStart);
const refreshFn = html.slice(refreshStart, refreshEnd);
if (!refreshFn.includes('updateGuidedSetProgress(ex);')) throw new Error('O refresh guiado não usa atualização parcial.');
if (refreshFn.includes('renderGuidedStep();')) throw new Error('O refresh após série ainda reconstrói o guidedBody inteiro.');

const partialStart = html.indexOf('function updateGuidedSetProgress(');
const partialEnd = html.indexOf('function refreshGuidedAfterToggle', partialStart);
const partialFn = html.slice(partialStart, partialEnd);
if (partialFn.includes('guidedBody.innerHTML')) throw new Error('A função parcial não pode substituir o guidedBody.');

const renderStart = html.indexOf('function renderGuidedStep(');
const renderEnd = html.indexOf('function renderGuidedComplete', renderStart);
const renderFn = html.slice(renderStart, renderEnd);
if (!renderFn.includes('guidedBody.innerHTML')) throw new Error('A renderização completa inicial do guidedBody desapareceu.');

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A Etapa 3 não pode limpar o estado principal local.');
}

console.log('OK: Etapa 3, atualização parcial das séries guiadas, acessibilidade, guidedBody preservado e cache v91 validados.');
