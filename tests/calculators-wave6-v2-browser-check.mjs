import assert from 'node:assert/strict';
import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await page.goto('http://127.0.0.1:4174/v2/?wave6=1', { waitUntil: 'networkidle' });
const result = await page.evaluate(() => {
  const c = window.MARSB_V2_CALCULATORS;
  return {
    bmi: c.calculateV1Bmi(78.4, 175),
    macros: c.calculateV1Macros({ weight: 80, height: 175, age: 28, sex: 'm', activity: 1.375, surplus: 300 }),
    portions: c.calculateV1Portions(80),
    plates: c.calculateV1Plates(100, 20),
    kgLb: c.calculateV1Conversion(100, 'kg-lb'),
    lbKg: c.calculateV1Conversion(220.462262, 'lb-kg'),
    cmIn: c.calculateV1Conversion(175, 'cm-in'),
    inCm: c.calculateV1Conversion(68.8976, 'in-cm')
  };
});
assert.deepEqual(result.bmi, { bmi: 25.6, classification: 'acima do intervalo de referência' });
assert.deepEqual(result.macros, { bmr: 1759, tdee: 2418, calories: 2718, protein: 160, carbs: 376, fats: 64, waterMl: 2960 });
assert.equal(result.portions.protein.length, 3);
assert.equal(result.portions.protein[1].food.n, 'Whey (pó)');
assert.equal(result.portions.protein[1].grams, 200);
assert.equal(result.portions.targets.protein, 160);
assert.equal(result.plates.perSide, 40);
assert.ok(result.plates.alternatives.every((item) => item.plates.includes(1.25) || item.remainder === 0));
assert.equal(result.kgLb, 220.46);
assert.equal(result.lbKg, 100);
assert.equal(result.cmIn, 68.9);
assert.equal(result.inCm, 175);
await browser.close();
console.log('calculators-wave6-v2-browser-check: ok');
