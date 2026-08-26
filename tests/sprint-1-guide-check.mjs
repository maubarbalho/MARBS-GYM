import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'exerciseGuideModal',
  'EXERCISE_GUIDE_RULES',
  'getExerciseGuide',
  'openExerciseGuide',
  'closeExerciseGuide',
  'Ver ficha local do exercício',
  'js-guide-exercise',
  'js-guided-exercise-guide',
  'guide-steps',
  'guide-attention'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Ficha local incompleta: ${missing.join(', ')}`);

const guideStart = html.indexOf('function openExerciseGuide');
const guideEnd = html.indexOf('function closeExerciseGuide', guideStart);
const guideBody = html.slice(guideStart, guideEnd);
if (/state\s*\./.test(guideBody) || /localStorage\s*\./.test(guideBody)) {
  throw new Error('A abertura da ficha não deve alterar nem persistir o estado do usuário.');
}
if (!html.includes("addEventListener('click', () => openExerciseGuide(ex.id, guidedState.treinoId))")) {
  throw new Error('A ficha local não está conectada ao treino guiado.');
}
if (!html.includes("addEventListener('click', (event) => { event.stopPropagation(); openExerciseGuide(ex.id, treino.id); })")) {
  throw new Error('A ficha local não está conectada ao treino livre.');
}
console.log('OK: ficha local de exercício disponível no treino livre e guiado sem alterar o estado salvo.');
