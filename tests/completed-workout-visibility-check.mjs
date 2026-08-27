import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'keepCompletedVisible',
  "card.className = `card${complete ? ' is-complete' : ''}`",
  'complete-state-badge',
  '✓ Concluído',
  'Este card permanece visível para revisão',
  'Treino concluído'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Visibilidade de treino concluído incompleta: ${missing.join(', ')}`);

const renderStart = html.indexOf('function renderTreinos()');
const renderEnd = html.indexOf('function saveRpe', renderStart);
const renderBody = html.slice(renderStart, renderEnd);
if (/\bsaveState\s*\(/.test(renderBody)) {
  throw new Error('A renderização da lista não deve gravar ou modificar o estado do usuário.');
}
if (!html.includes('if (!exercises.length) return;') || !html.includes('keepCompletedVisible')) {
  throw new Error('A lista não combina corretamente a visibilidade de treinos completos com os filtros.');
}
console.log('OK: treinos concluídos permanecem visíveis, identificados e sem alteração do estado salvo.');
