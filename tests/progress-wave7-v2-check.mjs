import fs from 'node:fs';
const html = fs.readFileSync('v2/index.html', 'utf8');
const required = [
  'data-screen="progress"', 'progressFrom', 'progressTo', 'progressExercise',
  'progressSessionCount', 'progressVolumeTotal', 'progressWeeklyAverage',
  'progressEvolution', 'progressHistory', 'data-screen="settings"',
  'v2Appearance', 'v2Units', 'v2Notifications', 'saveV2Preferences',
  'sessionRecords', 'getProgressData', 'saveV2Preferences', 'source: \'v1-import\'',
  'state.settings', 'sem alterar treinos ou histórico'
];
for (const token of required) if (!html.includes(token)) throw new Error(`token ausente: ${token}`);
if (html.includes("toast(btn.dataset.settingsAction + ' em preparação')")) throw new Error('preferências ainda estão em placeholder');
if (!html.includes("status:'completed'")) throw new Error('sessão real não é registrada');
console.log('progress-wave7-v2-check: ok');
