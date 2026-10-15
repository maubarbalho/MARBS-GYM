import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of [
  'Aderência de 7 dias',
  'id="dietAdherenceRate"',
  'id="dietDuplicateDate"',
  'id="dietDuplicateMode"',
  'id="saveDietFavorite"',
  'id="applyDietFavorite"',
  'id="removeDietFavorite"',
  'const getDietAdherence',
  'const duplicateDietDay',
  'const saveDietFavorite',
  'const applyDietFavorite',
  'const removeDietFavorite',
  'window.confirm',
  'novos identificadores'
]) assert.ok(html.includes(token), `Onda 4 ausente: ${token}`);
assert.match(html, /registeredCount/);
assert.match(html, /copyPlanToDay\(targetDate/);
assert.match(html, /cloneDay\(sourceDate, targetDate\)/);
assert.match(html, /state\.nutrition\.favorites/);
console.log('diet-wave4-v2-check: ok');
