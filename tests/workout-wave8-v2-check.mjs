import fs from 'node:fs';
const html = fs.readFileSync('v2/index.html', 'utf8');
const required = [
  'GUIDED_EXERCISES', 'startGuided', 'skipGuidedExercise', 'returnSkippedExercise', 'completeGuidedExercise',
  'finishGuidedWorkout', 'nextPendingGuidedIndex', 'skippedExercises', 'completedExercises',
  'rpeEnergy', 'rpeDiscomfort', 'rpeNote', 'timerRemaining', 'deadlineAt',
  'Math.ceil((t.deadlineAt - Date.now()) / 1000)', 'restoreTimer',
  "document.addEventListener('visibilitychange', restoreTimer)",
  "window.addEventListener('pagehide'", "window.addEventListener('pageshow', restoreTimer)",
  "tag:'marsb-gym-rest-finished'", 'notifications'
];
for (const token of required) if (!html.includes(token)) throw new Error(`token ausente: ${token}`);
if (html.includes('timerSeconds--')) throw new Error('timer baseado em decremento simples');
if (!html.includes('g.active=false')) throw new Error('sessão guiada não é encerrada');
console.log('workout-wave8-v2-check: ok');
