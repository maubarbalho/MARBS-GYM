import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');

assert.match(html, /const KEY = 'marsbGym_v2_preview'/, 'a v2 deve usar a chave de preview contratual');
assert.doesNotMatch(html, /localStorage\.setItem\(['"]marsbGym_v2['"]/, 'a v2 não pode escrever na chave da v1');
assert.doesNotMatch(html, /localStorage\.clear\(\)/, 'a v2 não pode limpar o armazenamento inteiro');
assert.match(html, /schemaVersion: 2/, 'schemaVersion 2 ausente no estado-base');
for (const operation of [
  'loadState',
  'saveState',
  'migrateState',
  'getNutritionDay',
  'updateNutritionDay',
  'addFoodEntry',
  'updateFoodEntry',
  'removeFoodEntry',
  'updateTargets',
  'addWater',
  'copyPlanToDay',
  'cloneDay',
  'recalculateDay'
]) {
  assert.match(html, new RegExp(`function ${operation}\\s*\\(`), `operação ausente: ${operation}`);
}
assert.match(html, /function saveState\(nextState\)[\s\S]*?localStorage\.setItem\(KEY, JSON\.stringify\(validated\)\)/, 'saveState não valida antes de persistir');
assert.match(html, /const migrated = \{ \.\.\.base, \.\.\.source, schemaVersion: 2 \}/, 'migração não preserva campos desconhecidos');
assert.match(html, /const replace = options\.replace === true/, 'copyPlanToDay deve ser aditiva por padrão');
assert.match(html, /\{ \.\.\.entry, id: newId\('food-entry'\) \}/, 'cópia do plano deve gerar ids novos');
assert.match(html, /source\.meals\[meal\]\.map\(entry => normalizeFoodEntry\(\{ \.\.\.entry, id: newId\('food-entry'\) \}/, 'cloneDay deve gerar ids novos');
assert.match(html, /function undoLastFoodRemoval\(\)/, 'remoção deve manter uma operação de desfazer');
assert.match(html, /window\.MARSB_V2_STATE = \{ KEY, loadState, saveState/, 'operações devem ficar disponíveis na camada nomeada de estado');
assert.match(html, /addWater\(state\.nutrition\.selectedDate \|\| today\(\), 250\)/, 'o registro de água deve usar a operação centralizada');

console.log('state-contract-v2-check: ok');
