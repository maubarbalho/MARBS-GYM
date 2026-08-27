import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'updateBanner?.classList.add(\'show\')',
  'data-active-workout',
  'persistGuidedFormBeforeReload',
  'Dados salvos. Atualizando o app…',
  'updateBanner?.classList.remove(\'show\')',
  'SKIP_WAITING',
  'O app já está atualizado'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Fluxo de atualização incompleto: ${missing.join(', ')}`);

const handlerMatch = html.match(/const handleUpdateAvailable = \(registration\) => \{([\s\S]*?)\n      \};\n      const registerServiceWorker/);
const handler = handlerMatch ? handlerMatch[1] : '';
if (/hasActiveWorkout\(\)[\s\S]{0,180}activateWaitingWorker/.test(handler)) throw new Error('Atualização automática ainda pode interromper a sessão.');
if (/if \(hasActiveWorkout\(\)\) \{ showToast\('Finalize ou pause o treino antes de atualizar'/.test(html)) throw new Error('A atualização continua bloqueando uma sessão ativa sem salvá-la.');
if (!html.includes('persistGuidedNavigation();') || !html.includes('saveBeforeMobileSuspend();')) throw new Error('A atualização não salva a navegação e o estado antes do reload.');

console.log('OK: banner, adiamento, proteção de sessão e atualização manual validados.');
