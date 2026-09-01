import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const start = html.indexOf('function resetCompletedWorkoutForNewSession');
const end = html.indexOf('function startWorkoutSession', start);
if (start < 0 || end < 0) throw new Error('Rotina de nova sessão não foi encontrada.');
const reset = html.slice(start, end);

for (const token of [
  'if (!isTreinoComplete(treinoId)) return false;',
  'state.sets[ex.id] = Array.from({ length: ex.series }, () => false);',
  "state.setDetails[ex.id] = Array.from({ length: ex.series }, () => ({ reps: '', weight: '' }));",
  'if (state.activeWorkout?.treino === treinoId) state.activeWorkout = null;',
  'resetCompletedWorkoutForNewSession(treinoId);',
  "const resetCompleted = resetCompletedWorkoutForNewSession(treinoId);",
  "const APP_UPDATE_VERSION = 'v98-focus-fixed-bar'",
  "CACHE_NAME = 'marsb-gym-v98-focus-fixed-bar'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Correção de sessão sem suporte esperado: ${token}`);
}

if (/delete\s+state\.(sets|setDetails|weights)/.test(reset)) {
  throw new Error('O reset de sessão não pode remover dados de pesos ou séries.');
}
if (reset.includes('localStorage.clear(') || reset.includes('localStorage.removeItem(')) {
  throw new Error('O reset de sessão não pode limpar o armazenamento local.');
}
if (!html.includes('if (active) state.activeWorkout = null;')) {
  throw new Error('A conclusão não encerra a sessão ativa registrada.');
}
if (!html.includes('state.completedWorkouts.push(record);')) {
  throw new Error('O histórico não está sendo registrado antes do novo treino.');
}

console.log('OK: sessão concluída encerrada, nova sessão vazia, histórico e pesos preservados, cache v88 validados.');
