import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of [
  'id="dietDate"',
  'id="dietTargetKcal"',
  'id="dietTargetProtein"',
  'id="dietTargetCarbs"',
  'id="dietTargetFats"',
  'id="dietTargetWater"',
  'id="dietFood"',
  'id="dietGrams"',
  'id="addDietFood"',
  'id="dietMeals"',
  'id="dietWaterInput"',
  'id="addDietWater"',
  'id="dietWaterSetInput"',
  'id="setDietWater"',
  'id="removeDietWater"',
  'marsbGym_v2_preview',
  'addFoodEntry(',
  'updateFoodEntry(',
  'removeFoodEntry(',
  'updateTargets(',
  'addWater(state.nutrition.selectedDate || today(), 250)',
  "updateNutritionDay($('#",
]) {
  assert.ok(html.includes(token), `controle ou operação ausente: ${token}`);
}
assert.match(html, /const DIET_FOODS = \[/, 'catálogo TACO da onda não encontrado');
assert.match(html, /nutritionPer100g: \{ kcal: food\.kcal, protein: food\.protein, carbs: food\.carbs, fats: food\.fats \}/, 'snapshot nutricional não é salvo no alimento');
assert.match(html, /state\.nutrition\.selectedDate = e\.target\.value \|\| today\(\)/, 'troca de data não atualiza o diário selecionado');
assert.match(html, /day\.totals = totals/, 'totais do dia não são recalculados');
console.log('diet-wave1-v2-check: ok');
