import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'function parseLocalizedNumber(value)',
  "replace(',', '.')",
  'function normalizeWeightValue(value)',
  'inputmode="decimal"',
  'placeholder="Ex: 2,5"',
  'placeholder="80,0"',
  'const kg = parseLocalizedNumber(input && input.value);',
  'const weight = parseLocalizedNumber(document.getElementById(\'calcWeight\').value);',
  'var target = parseLocalizedNumber(document.getElementById(\'plateTarget\').value);'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Suporte decimal incompleto: ${missing.join(', ')}`);

const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || '';
if (!script.includes('type="text" id="weight-${encodeData(ex.id)}"')) {
  throw new Error('O campo de peso do exercício ainda depende de input numérico nativo.');
}
if (!script.includes('type="text" inputmode="decimal" min="0" max="1000"')) {
  throw new Error('O campo de peso do treino guiado não aceita entrada textual decimal.');
}
if (html.includes("parseFloat(document.getElementById('calcWeight').value)")) {
  throw new Error('A calculadora de macros ainda lê o peso sem normalizar a vírgula.');
}
console.log('OK: pesos com vírgula/ponto e duas casas decimais validados.');
