import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'TIMER_STORAGE_KEY',
  'timerDeadlineAt',
  'persistTimerState',
  'restoreTimerState',
  'syncTimerClock',
  'handleTimerVisibility',
  "document.addEventListener('visibilitychange', handleTimerVisibility",
  "window.addEventListener('pagehide'",
  "window.addEventListener('focus', handleTimerVisibility",
  'timerPausedRemaining'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Timer em segundo plano incompleto: ${missing.join(', ')}`);
if (!html.includes('Math.ceil((timerDeadlineAt - Date.now()) / 1000)')) {
  throw new Error('O timer ainda não calcula o restante a partir de um prazo absoluto.');
}
if (html.includes('timerSeconds--')) {
  throw new Error('O timer voltou a depender de decremento por intervalo.');
}
if (!html.includes('deadlineAt: timerPaused ? 0 : timerDeadlineAt')) {
  throw new Error('O estado persistido do timer não diferencia execução e pausa explícita.');
}
console.log('OK: timer absoluto, persistência e retorno ao app validados.');
