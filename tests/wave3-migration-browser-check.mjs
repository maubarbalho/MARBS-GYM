import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';

const legacy = {
  _schemaVersion: 7,
  profile: { name: 'Usuário Teste', metrics: { weightKg: 80, heightCm: 180, age: 35, sex: 'f' } },
  dietPrefs: { restrictions: 'sem lactose', allergies: 'amendoim', targets: { kcal: 2200, protein: 160, carbs: 240, fats: 70, waterMl: 3000 } },
  dietDiary: { '2026-10-11': { waterMl: 750, meals: [{ id: 'old-1', name: 'Frango peito cozido', mealType: 'Almoço', foodKey: 'taco-frango-peito-cozido', grams: 150 }] } },
  completedWorkouts: [{ id: 'session-1', treino: 'A', date: '2026-10-11', status: 'completed', weights: { supino: '20' } }],
  bodyWeights: [{ date: '2026-10-11', kg: 80 }],
  customProgram: { A: { nome: 'Plano salvo', foco: 'Peito', exercises: [{ id: 'supino', nome: 'Supino', series: 3, reps: '8', descanso: 90 }] } },
  workoutSchedule: { '2026-10-11': { treino: 'A', status: 'completed' } }
};
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await page.addInitScript(value => localStorage.setItem('marsbGym_v2', JSON.stringify(value)), legacy);
await page.goto('http://127.0.0.1:4173/v2/?wave3=1', { waitUntil: 'networkidle' });
const result = await page.evaluate(() => {
  const api = window.MARSB_V2_STATE;
  const sourceBefore = localStorage.getItem('marsbGym_v2');
  const preview = api.buildLegacyImportPreview();
  const imported = api.confirmLegacyImport(preview);
  const migrated = JSON.parse(localStorage.getItem(api.KEY));
  const sourceAfter = localStorage.getItem('marsbGym_v2');
  const rolled = api.rollbackLastLegacyImport();
  const restored = JSON.parse(localStorage.getItem(api.KEY));
  return { preview, imported, migrated, sourceBefore, sourceAfter, rolled, restored };
});
assert.equal(result.preview.ok, true);
assert.equal(result.preview.counts.foodEntries, 1);
assert.equal(result.preview.counts.completedWorkouts, 1);
assert.equal(result.imported.ok, true);
assert.equal(result.migrated.profile.name, 'Usuário Teste');
assert.equal(result.migrated.profile.sex, 'F');
assert.equal(result.migrated.nutrition.days['2026-10-11'].meals.almoco.length, 1);
assert.equal(result.migrated.progress.completedWorkouts.length, 1);
assert.equal(result.migrated.workouts.customProgram.A.nome, 'Plano salvo');
assert.equal(result.sourceBefore, result.sourceAfter);
assert.equal(result.rolled.ok, true);
const restoredDay = result.restored.nutrition.days['2026-10-11'];
assert.ok(!restoredDay || (restoredDay.waterMl === 0 && Object.values(restoredDay.meals).every(items => items.length === 0)));
await browser.close();
console.log('wave3-migration-browser-check: ok');
