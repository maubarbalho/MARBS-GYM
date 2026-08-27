import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'muscleFilter',
  'equipmentFilter',
  'getExerciseEquipment',
  'syncWorkoutFilterOptions',
  'matchesMuscle',
  'matchesEquipment',
  'swapExerciseHint',
  'currentGroup',
  'related.length',
  'Alternativas do mesmo grupo aparecem primeiro'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Sprint 2 incompleta: ${missing.join(', ')}`);

const renderStart = html.indexOf('function renderTreinos()');
const renderEnd = html.indexOf('function saveRpe', renderStart);
const renderBody = html.slice(renderStart, renderEnd);
if (/\bsaveState\s*\(/.test(renderBody)) {
  throw new Error('Filtrar a lista não deve salvar nem modificar os dados locais.');
}

const swapStart = html.indexOf('function openSwapExercise');
const swapEnd = html.indexOf('function closeSwapExercise', swapStart);
const swapBody = html.slice(swapStart, swapEnd);
if (!swapBody.includes('getExerciseMuscleGroup') || !swapBody.includes('getExerciseEquipment')) {
  throw new Error('A substituição não está contextualizada por grupo e equipamento.');
}
if (!html.includes("state.exerciseOverrides[exId] = { nome: source.nome")) {
  throw new Error('A substituição explícita não preserva o mecanismo de override existente.');
}
console.log('OK: filtros por grupo/equipamento e alternativas contextuais validados sem persistência ao filtrar.');
