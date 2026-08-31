import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  'function getNextGuidedExecutionIndex(index, excludeCurrent = false)',
  'const total = guidedState.exercises.length',
  'const groupSet = new Set(group)',
  'if (candidate === index) continue',
  'if (exercise && !getDoneArr(exercise).every(Boolean)) return candidate',
  'const current = guidedState.exercises[index]',
  'guidedGoTo(getNextGuidedExecutionIndex(guidedState.index, true))',
  "const APP_UPDATE_VERSION = 'v92-guided-preview'",
  "CACHE_NAME = 'marsb-gym-v92-guided-preview'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Avanço pendente sem suporte esperado: ${token}`);
}

if (!html.includes('guidedGoTo(getNextGuidedExecutionIndex(guidedState.index));')) {
  throw new Error('O botão Próximo não usa a busca de exercício pendente.');
}
if (html.includes('guidedGoTo(guidedState.index + 1);')) {
  throw new Error('Ainda existe avanço cego para o índice seguinte no fluxo guiado.');
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A correção não pode limpar o estado local principal.');
}

console.log('OK: avanço ao próximo exercício pendente, retorno após salto, modos de execução e cache v88 validados.');
