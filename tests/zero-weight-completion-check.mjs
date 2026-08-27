import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const toggleStart = html.indexOf('function toggleSet(');
const toggleEnd = html.indexOf('function getPreviousWorkoutSnapshot', toggleStart);
if (toggleStart < 0 || toggleEnd < 0) throw new Error('Fluxo de marcação de série não localizado.');
const toggle = html.slice(toggleStart, toggleEnd);

for (const token of [
  "const justCompleted = state.sets[exId][setIndex];",
  "if (justCompleted) {",
  "const details = getSetDetails(ex);",
  "if (detail && !normalizeWeightValue(detail.weight)) {",
  "detail.weight = '0';",
  "state.weights[exId] = latest;",
  'recordWeightHistory(exId, latest);',
  'saveState();'
]) {
  if (!toggle.includes(token)) throw new Error(`Conclusão sem peso não contém a regra esperada: ${token}`);
}

if (!toggle.includes("const latest = [...details].reverse().map((d) => d.weight).find(Boolean) || '0';")) {
  throw new Error('A carga global da sessão não recebe fallback seguro para zero.');
}
if (toggle.includes("detail.weight = '0';\n          const previous = state.weights[exId] || '';\n          const latest = '0';")) {
  throw new Error('A implementação não deve apagar pesos preenchidos de outras séries.');
}

const renderStart = html.indexOf('function renderGuidedStep(');
const renderEnd = html.indexOf('function renderGuidedComplete', renderStart);
const render = html.slice(renderStart, renderEnd);
if (render.includes("detail.weight = '0'")) {
  throw new Error('Renderização não deve persistir ou materializar peso zero automaticamente.');
}
if (!html.includes('placeholder="Ex: 2,5"')) {
  throw new Error('O exemplo atual de peso decimal foi alterado indevidamente.');
}

console.log('OK: série concluída sem peso assume 0 kg, pesos preenchidos são preservados e exemplos continuam intactos.');
