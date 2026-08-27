import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const requiredHtml = [
  "timerEnd: false",
  'timerNotificationSupported',
  'requestTimerNotificationPermission',
  'showTimerFinishedNotification',
  'toggleTimerNotificationPref',
  'testTimerNotification',
  'toggleTimerNotification',
  'timerNotificationStatus',
  'testTimerNotificationBtn',
  'Notification.requestPermission()',
  'navigator.serviceWorker.ready',
  'registration.showNotification',
  'void showTimerFinishedNotification();',
  'As notificações do timer estão funcionando.',
  'timer, o aviso dentro do app e a vibração continuam funcionando sem essa permissão'
];
const missingHtml = requiredHtml.filter((token) => !html.includes(token));
if (missingHtml.length) throw new Error(`Notificação do timer incompleta no HTML: ${missingHtml.join(', ')}`);

if (!sw.includes("CACHE_NAME = 'marsb-gym-v76-compact-shell-auto-update'")) {
  throw new Error('O cache do PWA não foi atualizado para a versão atual do timer.');
}
if (!sw.includes("self.addEventListener('notificationclick'")) {
  throw new Error('O service worker não trata o toque na notificação.');
}
if (!sw.includes("notification.data.type === 'timer-finished'")) {
  throw new Error('A notificação do timer não possui um fluxo de retorno identificável.');
}

const notificationFnStart = html.indexOf('async function showTimerFinishedNotification');
const notificationFnEnd = html.indexOf('async function toggleTimerNotificationPref', notificationFnStart);
const notificationFn = html.slice(notificationFnStart, notificationFnEnd);
if (!notificationFn.includes("if (!testOnly && !prefs.timerEnd) return false")) {
  throw new Error('O aviso normal do timer precisa respeitar a preferência explícita.');
}
if (!notificationFn.includes("Notification.permission !== 'granted'")) {
  throw new Error('O aviso do timer precisa respeitar o estado de permissão.');
}
if (!notificationFn.includes("tag: 'marsb-gym-rest-finished'")) {
  throw new Error('O aviso do timer precisa evitar duplicações com uma tag estável.');
}

if (html.includes('pushManager') || html.includes('PushSubscription')) {
  throw new Error('A implementação local não deve introduzir Web Push ou inscrição externa.');
}

const normalizeStart = html.indexOf('clean.notifications =');
const normalizeEnd = html.indexOf('clean.coachPrefs', normalizeStart);
if (!html.slice(normalizeStart, normalizeEnd).includes('timerEnd: Boolean(source.notifications?.timerEnd)')) {
  throw new Error('A preferência do timer não possui normalização retrocompatível.');
}

console.log('OK: permissão explícita, aviso local via service worker, retorno ao treino, fallback e ausência de Web Push externo validados.');
