import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'function calculateWorkoutRecovery(treinoId)',
  'getExerciseMuscleGroup(ex, treinoId)',
  'Dica de recuperação',
  'summary.recovery.overallLabel',
  'summary.recovery.detailText',
  'const recovery = interrupted ? null : calculateWorkoutRecovery(treinoId);',
  'status: record.status, recovery'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Dica de recuperação incompleta: ${missing.join(', ')}`);
if (!html.includes("summary.recovery && summary.status !== 'interrupted'")) {
  throw new Error('A dica deveria aparecer somente para uma sessão concluída.');
}
if (html.includes('recovery: recovery') || html.includes('recovery: calculateWorkoutRecovery')) {
  throw new Error('A recuperação não deve ser persistida como dado histórico nesta versão.');
}
console.log('OK: dica automática de recuperação restrita ao resumo final validada.');
