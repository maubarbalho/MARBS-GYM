import fs from 'node:fs';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');

for (const token of [
  'prefers-reduced-motion',
  'touch-action: manipulation',
  'aria-hidden="true"',
  'FOCUSABLE',
  "event.key === 'Escape'",
  'libraryEmpty',
  'aria-pressed="true"',
  'aria-selected="true"',
  'aria-live="polite"',
  'updateViaCache'
]) {
  if (!html.includes(token)) throw new Error(`Fase B sem recurso esperado: ${token}`);
}

const dialogCount = (html.match(/role="dialog"/g) || []).length;
if (dialogCount < 3) throw new Error('Diálogos acessíveis insuficientes.');
if (!html.includes('aria-describedby="copyDescription"') || !html.includes('aria-describedby="rpeDescription"')) throw new Error('Diálogos sem descrição acessível.');
if (!html.includes('Nenhum exercício encontrado')) throw new Error('Estado vazio da biblioteca ausente.');
if ((html.match(/downloadV2Backup/g) || []).length < 3) throw new Error('Exportação segura não está conectada aos pontos de acesso esperados.');

console.log('phase-b-v2-check: ok');
