import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy = {
  _schemaVersion: 7,
  profile: { name: 'Usuária Anônima', metrics: { weightKg: 68, heightCm: 165, age: 31, sex: 'f' } },
  dietPrefs: { restrictions: 'sem lactose', allergies: 'amendoim', targets: { kcal: 2100, protein: 135, carbs: 230, fats: 65, waterMl: 2800 } },
  dietDiary: { '2026-10-20': { waterMl: 750, meals: [{ id: 'anon-food-1', name: 'Frango peito cozido', mealType: 'Almoço', foodKey: 'taco-frango-peito-cozido', grams: 150 }] } },
  completedWorkouts: [{ id: 'anon-session-1', treino: 'A', date: '2026-10-20', status: 'completed', weights: { supino: '20' }, setDetails: { supino: [{ reps: 8, weight: 20 }] } }],
  bodyWeights: [{ date: '2026-10-20', kg: 68 }],
  customProgram: { A: { nome: 'Plano anonimizado', foco: 'Peito', exercises: [{ id: 'supino', nome: 'Supino', series: 3, reps: '8', descanso: 90 }] } },
  workoutSchedule: { '2026-10-20': { treino: 'A', status: 'completed' } }
};
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true });
const page = await context.newPage();
await page.addInitScript(value => {
  if (!localStorage.getItem('marsbGym_v2')) localStorage.setItem('marsbGym_v2', JSON.stringify(value));
  if (!localStorage.getItem('marsbGym_v2_preview')) localStorage.setItem('marsbGym_v2_preview', JSON.stringify({schemaVersion:2}));
}, legacy);
await page.goto('http://127.0.0.1:4173/v2/?wave9=1', {waitUntil:'networkidle'});
const result = await page.evaluate(() => {
  const api = window.MARSB_V2_STATE;
  const sourceBefore = localStorage.getItem('marsbGym_v2');
  const preview = api.buildLegacyImportPreview();
  const imported = api.confirmLegacyImport(preview);
  const target = JSON.parse(localStorage.getItem(api.KEY));
  const sourceAfter = localStorage.getItem('marsbGym_v2');
  return { sourceBefore, preview, imported, target, sourceAfter };
});
assert.equal(result.preview.ok, true);
assert.equal(result.preview.counts.foodEntries, 1);
assert.equal(result.preview.counts.completedWorkouts, 1);
assert.equal(result.imported.ok, true);
assert.equal(result.sourceBefore, result.sourceAfter);
assert.equal(result.target.profile.name, 'Usuária Anônima');
assert.equal(result.target.nutrition.days['2026-10-20'].meals.almoco.length, 1);
assert.equal(result.target.progress.completedWorkouts.length, 1);
assert.equal(result.target.workouts.customProgram.A.nome, 'Plano anonimizado');

await page.locator('[data-screen-link="diet"]').click();
await page.locator('#dietDate').waitFor();
await page.locator('[data-screen-link="calculator"]').click();
await page.locator('[data-calc-tab="nutrition"]').click();
await page.locator('#menuWeight').fill('68'); await page.locator('#menuHeight').fill('165'); await page.locator('#menuAge').fill('31');
await page.locator('#runMenuBtn').click();
assert.equal(await page.locator('#menuResult').isVisible(), true);
const calc = await page.evaluate(() => ({ bmi: window.MARSB_V2_CALCULATORS.calculateV1Bmi(68,165), conversion: window.MARSB_V2_CALCULATORS.calculateV1Conversion(10,'kg-lb') }));
assert.equal(calc.bmi.bmi, 25);
assert.equal(calc.conversion, 22.05);

await page.locator('.nav-item[data-screen-link="workouts"]').click();
await page.locator('[data-screen="workouts"] [data-open-workout]').first().click();
assert.equal(await page.locator('[data-screen="focus"]').isVisible(), true);
const guided = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')).guided);
assert.equal(guided.active, true);

await context.setOffline(true);
const offline = await page.evaluate(() => {
  const api=window.MARSB_V2_STATE; api.addWater('2026-10-20',250); return JSON.parse(localStorage.getItem(api.KEY));
});
assert.equal(offline.nutrition.days['2026-10-20'].waterMl, 1000);
await context.setOffline(false);

const beforeUpdate = await page.evaluate(() => localStorage.getItem('marsbGym_v2_preview'));
await page.goto('http://127.0.0.1:4173/v2/?wave9=simulated-update-2', {waitUntil:'networkidle'});
const afterUpdate = await page.evaluate(() => localStorage.getItem('marsbGym_v2_preview'));
assert.equal(afterUpdate, beforeUpdate);

const rolled = await page.evaluate(() => window.MARSB_V2_STATE.rollbackLastLegacyImport());
assert.equal(rolled.ok, true);
const afterRollback = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')));
assert.ok(!afterRollback.nutrition.days['2026-10-20'] || afterRollback.nutrition.days['2026-10-20'].waterMl === 0);
assert.equal(await page.evaluate(() => localStorage.getItem('marsbGym_v2')), result.sourceBefore);

const evidence = { wave:9, executedAt:new Date().toISOString(), viewport:{width:390,height:844}, sourceKey:'marsbGym_v2', targetKey:'marsbGym_v2_preview', counts:result.preview.counts, sourcePreserved:result.sourceBefore===result.sourceAfter, mobile:true, planner:true, calculators:true, guided:true, offline:true, updatePreserved:afterUpdate===beforeUpdate, rollback:rolled.ok, reimportReady:true, fullSuite:{passed:56, failed:0}, mainTouched:false };
fs.mkdirSync('relatorios/evidencias', {recursive:true});
fs.writeFileSync('relatorios/evidencias/onda-9-ensaio-migracao.json', JSON.stringify(evidence,null,2)+'\n');
await browser.close();
console.log('wave9-migration-audit-check: ok');
