import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'densityMode',
  'setDensityMode',
  'data-density',
  'progressSnapshot',
  'renderProgressSnapshot',
  'guided-overlay.focus-mode',
  'scrollTopBtn',
  'syncScrollTopButton'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Sprints 3/4 incompletas: ${missing.join(', ')}`);
if (!html.includes('último treino concluído') || !html.includes('dias de sequência atual')) {
  throw new Error('Resumo de progresso acionável ausente.');
}
console.log('OK: foco, densidade, resumo de progresso e navegação mobile validados.');
