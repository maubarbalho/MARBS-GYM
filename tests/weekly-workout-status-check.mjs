import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const token of [
  'function getWeekStartKey',
  'function isDateInCurrentWeek',
  'function getCompletedWorkoutIdsThisWeek',
  'function isWorkoutCompletedThisWeek',
  "entry.status === 'completed'",
  'isWorkoutCompletedThisWeek(t.id)',
  'Feito nesta semana',
  'Pendente nesta semana',
  'state.completedWorkouts'
]) {
  if (!html.includes(token)) throw new Error(`Status semanal ausente: ${token}`);
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('O status semanal não pode apagar dados locais.');
}
console.log('OK: primeira página identifica treinos feitos e pendentes na semana atual, preservando o histórico.');
