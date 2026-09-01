import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const token of [
  '.guided-prev-btn',
  '.guided-next-btn',
  '.guided-utility-btn',
  '.guided-interrupt-btn',
  '.guided-focus-rest',
  '.guided-rest-action',
  'min-height:48px',
  '-webkit-tap-highlight-color:transparent',
  ':focus-visible',
  'translateY(1px) scale(.985)',
  'guided-next-btn.ready',
  'guided-copy-btn',
  'Completar atividade',
  'Último treino',
  'guided-checkin-scale',
  'guidedActivityCheckinModal',
  'guided-complete-activity',
  'guidedStepLabel',
  'guided-segment-track-top',
  'Treino A',
  'copyLastGuidedWorkout',
  'guided-next-card',
  'Ver execução do exercício',
  "updateViaCache: 'none'",
  'checkRemoteAppVersion',
  "cache: 'no-store'",
  'Pular por agora →',
  'Encerrar exercício',
  'Encerrar treino agora',
  "const APP_UPDATE_VERSION = 'v95-weekly-card-layout'",
  "CACHE_NAME = 'marsb-gym-v95-weekly-card-layout'"
]) {
  if (!html.includes(token) && !sw.includes(token)) throw new Error(`Refinamento de botões sem suporte esperado: ${token}`);
}

for (const legacyButton of ['js-guided-prev', 'js-guided-next', 'js-guided-timer', 'js-guided-repeat', 'js-end-exercise', 'js-end-workout']) {
  if (!html.includes(legacyButton)) throw new Error(`Handler atual removido indevidamente: ${legacyButton}`);
}

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('O refinamento visual não pode apagar dados locais.');
}

console.log('OK: botões atuais preservados, toque mínimo, foco visível, estados de ação e cache v93 validados.');
