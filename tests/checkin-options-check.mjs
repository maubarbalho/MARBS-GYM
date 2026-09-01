import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  'Como foi esta sessão?',
  'complete-checkin-help',
  'complete-checkin-score',
  'data-checkin-value',
  'aria-pressed',
  "scoreButtons('effort', 'Esforço'",
  "scoreButtons('energy', 'Energia'",
  "scoreButtons('discomfort', 'Desconforto'",
  'is-selected',
  'state.workoutCheckins[summary.recordId]'
]) {
  if (!html.includes(token)) throw new Error(`Check-in sem suporte esperado: ${token}`);
}

const completeStart = html.indexOf('function showWorkoutComplete');
const completeEnd = html.indexOf('function closeWorkoutComplete', completeStart);
const completeFn = html.slice(completeStart, completeEnd);
for (const field of ['effort', 'energy', 'discomfort']) {
  const fieldButtons = completeFn.match(new RegExp(`scoreButtons\\('${field}'`, 'g')) || [];
  if (fieldButtons.length !== 1) throw new Error(`Campo ${field} não possui um grupo visível de opções.`);
}
if (!completeFn.includes('[0, ...Array.from({ length: 10 }')) {
  throw new Error('O check-in não oferece a opção vazia e a escala completa de 1 a 10.');
}
if (!completeFn.includes("dataset.checkinValue") || !completeFn.includes("content.querySelector(`[data-checkin=\"${field}\"].is-selected`)") ) {
  throw new Error('O salvamento do check-in não lê a opção visível selecionada.');
}
if (!html.includes('.complete-checkin-score { min-height:44px')) {
  throw new Error('As opções do check-in não mantêm alvo de toque mínimo de 44px.');
}
if (!sw.includes("CACHE_NAME = 'marsb-gym-v96-focus-reference'")) {
  throw new Error('O service worker não foi versionado para a correção do check-in.');
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A correção não pode limpar os dados locais.');
}

console.log('OK: opções visíveis 1–10, seleção acessível, salvamento retrocompatível, toque mínimo e cache v87 validados.');
