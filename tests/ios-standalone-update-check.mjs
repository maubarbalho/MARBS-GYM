import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const requiredHtml = [
  'apple-mobile-web-app-capable',
  "display-mode: standalone",
  'window.navigator.standalone',
  'const checkForAppUpdate = (registration)',
  'window.addEventListener(\'pageshow\'',
  "document.addEventListener('visibilitychange'",
  "window.addEventListener('online'",
  "scriptUrl.searchParams.set('v', APP_UPDATE_VERSION)",
  "url.searchParams.set('pwa-refresh', APP_UPDATE_VERSION)",
  'persistGuidedFormBeforeReload'
];
const missingHtml = requiredHtml.filter((token) => !html.includes(token));
if (missingHtml.length) throw new Error(`Atualização standalone incompleta: ${missingHtml.join(', ')}`);

if (!sw.includes("new Request(request, { cache: 'no-store' })")) {
  throw new Error('A navegação do service worker ainda pode reutilizar cache HTTP antigo.');
}
if (!sw.includes("isServiceWorkerScript") || !sw.includes("new Request(event.request, { cache: 'no-store' })")) {
  throw new Error('O próprio script do service worker não está protegido contra cache HTTP antigo.');
}
if (html.includes('localStorage.clear(') || html.includes('indexedDB.deleteDatabase(')) {
  throw new Error('A atualização standalone não pode apagar os dados locais.');
}

console.log('OK: modo standalone, checagem ao reabrir, cache-busting e preservação local do iPhone validados.');
