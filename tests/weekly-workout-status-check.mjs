import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'function getWeekStartKey',
  'function isDateInCurrentWeek',
  'function getCompletedWorkoutIdsThisWeek',
  'function isWorkoutCompletedThisWeek',
  'entry.status === \'completed\'',
  'isWorkoutCompletedThisWeek(t.id)',
  'Feito nesta semana',
  'Pendente nesta semana',
  'state.completedWorkouts'
];
for (const token of required) {
  if (!html.includes(token)) throw new Error(`Status semanal ausente: ${token}`);
}
if (html.includes('localStorage.clear()')) throw new Error('A atualização semanal não pode limpar dados locais.');
console.log('OK: primeira página identifica treinos feitos e pendentes na semana atual, preservando o histórico.');
