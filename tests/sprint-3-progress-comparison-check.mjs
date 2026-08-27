import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'buildMetricChartSVG',
  'buildProgressionVisualsHtml',
  'Volume por sessão',
  'Carga máxima por sessão',
  'Indicadores por sessão',
  'Comparativo planejado × realizado',
  'parseExerciseRepRange',
  'getLatestExerciseSession',
  'selectProgressComparison',
  'O comparativo é informativo; nenhuma carga ou marcação é alterada automaticamente.',
  'estimateOneRepMax(set.weight, set.reps)',
  'getRecordedSessionMetrics'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Sprint 3 incompleta: ${missing.join(', ')}`);

const renderStart = html.indexOf('function renderProgressionPanel()');
const renderEnd = html.indexOf('function saveProgressionRule', renderStart);
const renderBody = html.slice(renderStart, renderEnd);
if (/\bsaveState\s*\(/.test(renderBody)) {
  throw new Error('Renderizar o painel de evolução não deve salvar nem modificar os dados locais.');
}

const visualsStart = html.indexOf('function buildProgressionVisualsHtml');
const visualsEnd = html.indexOf('function renderProgressionPanel', visualsStart);
const visualsBody = html.slice(visualsStart, visualsEnd);
if (/\bsaveState\s*\(/.test(visualsBody)) {
  throw new Error('Renderizar os gráficos não deve persistir dados locais.');
}

const compareStart = html.indexOf('function buildExerciseComparisonHtml');
const compareEnd = html.indexOf('function selectProgressComparison', compareStart);
const compareBody = html.slice(compareStart, compareEnd);
if (/\bsaveState\s*\(/.test(compareBody)) {
  throw new Error('Consultar o comparativo não deve persistir dados locais.');
}
if (html.includes('state.progressComparison')) {
  throw new Error('O comparativo não deve criar estado persistido adicional.');
}

const chartStart = html.indexOf('function openChart');
const chartEnd = html.indexOf('function closeChartModal', chartStart);
const chartBody = html.slice(chartStart, chartEnd);
if (!chartBody.includes('buildExerciseComparisonHtml(exId)') || !chartBody.includes('buildMetricChartSVG')) {
  throw new Error('O modal de evolução precisa exibir comparativo e indicadores derivados.');
}
if (/\bsaveState\s*\(/.test(chartBody)) {
  throw new Error('Abrir o gráfico não deve salvar nem modificar os dados locais.');
}

console.log('OK: gráficos essenciais e comparativo planejado versus realizado validados sem persistência ao consultar/renderizar.');
