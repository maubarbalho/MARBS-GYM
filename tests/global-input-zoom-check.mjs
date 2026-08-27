import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mobileRule = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), select, textarea { font-size: 16px !important; }';
if (!html.includes(mobileRule)) {
  throw new Error('A regra mobile de fonte mínima para os controles não foi encontrada.');
}
if (!html.includes('inputmode="decimal"') || !html.includes('placeholder="Ex: 2,5"')) {
  throw new Error('A entrada decimal de pesos foi alterada indevidamente.');
}
if (!html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />')) {
  throw new Error('A meta viewport mobile foi alterada ou não está presente.');
}
if (/user-scalable\s*=\s*no/i.test(html) || /maximum-scale\s*=\s*1(?:\.0)?/i.test(html)) {
  throw new Error('O ajuste não deve bloquear o zoom manual de acessibilidade.');
}
const inputTypes = [...html.matchAll(/<input\b[^>]*\btype="([^"]+)"/g)].map((match) => match[1]);
if (!inputTypes.includes('search') || !inputTypes.includes('number') || !inputTypes.includes('text')) {
  throw new Error('A regressão não encontrou os principais tipos de campo do app.');
}
console.log('OK: controles editáveis recebem fonte mínima de 16 px no mobile, entrada decimal e zoom manual permanecem preservados.');
