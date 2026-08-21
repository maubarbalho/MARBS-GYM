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
  'guidedRestPanel',
  'syncGuidedRestPanel',
  'profileAllowReuse',
  'dietFoodSearch',
  'renderDietWeekAdherence',
  'backupReminder',
  'switchPage(\'progresso\')',
  'Coach indisponível offline',
  'planoAddWorkout',
  'planoDuplicateWorkout',
  'planoArchiveWorkout',
  'getContinuousPeriodNumber',
  'setWorkoutScheduleStatus',
  'renderAdherenceCard',
  'getSetTypes',
  'saveSetType',
  'workoutCheckins',
  'dietRecent',
  'dietFavoriteSelect'
];

const missing = requiredTokens.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Fluxos esperados ausentes: ${missing.join(', ')}`);

if (html.includes('.guided-set-row:not(.focus-active)')) {
  throw new Error('O modo foco ainda está ocultando as séries que não estão ativas.');
}

if (!html.includes('Object.keys(map || {})')) {
  throw new Error('A normalização ainda não aceita uma quantidade livre de treinos.');
}

if (html.includes("var keys = ['A', 'B', 'C', 'D'];")) {
  throw new Error('A importação ainda possui o limite fixo A/B/C/D.');
}

if (html.includes('Limite de segurança de 40 treinos por plano')) {
  throw new Error('Ainda existe um limite artificial para a quantidade de treinos.');
}

console.log(`OK: ${scripts.length} script(s) compilado(s) e ${requiredTokens.length} fluxos essenciais encontrados.`);
