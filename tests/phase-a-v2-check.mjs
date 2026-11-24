import fs from 'node:fs';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../v2/manifest.json', import.meta.url), 'utf8'));

for (const token of [
  'createV2Backup',
  'restoreV2Backup',
  'renderV2Diagnostics',
  'registerV2ServiceWorker',
  'v2RestoreFile',
  'marsbGym_v2_backup_latest'
]) {
  if (!html.includes(token)) throw new Error(`Fase A sem recurso esperado: ${token}`);
}
if (!sw.includes("marsb-gym-v2-workout-fix-20261124")) throw new Error('Service Worker sem cache versionado da Fase A.');
if (manifest.version !== '2.0.0-phase-a') throw new Error('Manifest sem versão da Fase A.');
if (!html.includes("type !== 'marsb-gym-v2-backup'") || !html.includes('before-restore')) throw new Error('Restauração sem validação ou backup de segurança.');

console.log('phase-a-v2-check: ok');
