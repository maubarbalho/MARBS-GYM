import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of [
  'id="copyV2MenuBtn"',
  'copyGeneratedMenuToDiary()',
  'function menuPlanToDiaryPlan(plan)',
  'copyPlanToDay(date, diaryPlan)',
  'state.menuPlanCopiedAt',
  'id="menuWeight"',
  'id="menuHeight"',
  'id="menuAge"',
  'id="runMenuBtn"',
  "$('#runMenuBtn').addEventListener('click', runMenuCalc)",
  'As refeições e gramas serão adicionadas ao dia selecionado',
]) {
  assert.ok(html.includes(token), `integração da Onda 2 ausente: ${token}`);
}
assert.match(html, /if \(current\.targets\[key\] == null && plan\.targets\?\.,?\[key\] != null\)/, 'metas existentes não devem ser sobrescritas');
assert.match(html, /const added = Object\.values\(diaryPlan\.meals\)/, 'contagem de itens copiados ausente');
assert.match(html, /nutritionPer100g: \{ kcal: it\.food\.k/, 'plano gerado deve carregar snapshot nutricional');
console.log('diet-wave2-v2-check: ok');
