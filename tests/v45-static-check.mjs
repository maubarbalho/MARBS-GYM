import fs from 'node:fs';

const sourcePath = new URL('../index.html', import.meta.url);
const html = fs.readFileSync(sourcePath, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

if (!scripts.length) throw new Error('Nenhum script incorporado foi localizado.');
for (const [index, script] of scripts.entries()) {
  try {
    new Function(script);
  } catch (error) {
    throw new Error(`Erro de sintaxe no script ${index + 1}: ${error.message}`);
  }
}

const requiredTokens = [
  'guidedFocusToggle',
  'toggleGuidedFocus',
  'profileAllowReuse',
  'dietFoodSearch',
  'renderDietWeekAdherence',
  'backupReminder',
  'switchPage(\'progresso\')',
  'Coach indisponível offline'
];

const missing = requiredTokens.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Fluxos esperados ausentes: ${missing.join(', ')}`);

console.log(`OK: ${scripts.length} script(s) compilado(s) e ${requiredTokens.length} fluxos essenciais encontrados.`);
