import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const v1 = await context.newPage();
const v2 = await context.newPage();
await v1.goto('http://127.0.0.1:4176/', { waitUntil: 'networkidle' });
await v2.goto('http://127.0.0.1:4176/v2/?wave10=1', { waitUntil: 'networkidle' });

const comparison = await Promise.all([
  v1.evaluate(() => ({
    title: document.title,
    nav: [...document.querySelectorAll('.nav-item[data-page]')].map(el => el.textContent.trim()).filter(Boolean),
    screens: document.querySelectorAll('.page').length,
    hasDiet: Boolean(document.querySelector('#page-dieta')),
    hasCalc: Boolean(document.querySelector('#page-calc')),
    hasProgress: Boolean(document.querySelector('#page-progresso')),
    hasBackup: /Backup completo|backup completo/i.test(document.body.textContent)
  })),
  v2.evaluate(() => ({
    title: document.title,
    nav: [...document.querySelectorAll('.nav-item[data-screen-link]')].map(el => el.textContent.trim()).filter(Boolean),
    screens: document.querySelectorAll('.screen').length,
    hasDiet: Boolean(document.querySelector('[data-screen="diet"]')),
    hasCalc: Boolean(document.querySelector('[data-screen="calculator"]')),
    hasProgress: Boolean(document.querySelector('[data-screen="progress"]')),
    hasBackup: /Importar dados da v1|Exportar dados da v2/i.test(document.body.textContent)
  }))
]);

assert.ok(comparison[0].nav.some(label => /Dieta/i.test(label)));
assert.ok(comparison[0].nav.some(label => /Calc/i.test(label)));
assert.ok(comparison[0].nav.some(label => /Treinos/i.test(label)));
assert.ok(comparison[1].nav.some(label => /Dieta/i.test(label)));
assert.ok(comparison[1].nav.some(label => /Calculadora/i.test(label)));
assert.ok(comparison[1].nav.some(label => /Treinos/i.test(label)));
assert.equal(comparison[0].hasDiet, true); assert.equal(comparison[1].hasDiet, true);
assert.equal(comparison[0].hasCalc, true); assert.equal(comparison[1].hasCalc, true);
assert.equal(comparison[0].hasProgress, true); assert.equal(comparison[1].hasProgress, true);
assert.equal(comparison[0].hasBackup, true); assert.equal(comparison[1].hasBackup, true);

fs.mkdirSync('relatorios/evidencias', { recursive: true });
fs.writeFileSync('relatorios/evidencias/onda-10-comparacao-v1-v2.json', JSON.stringify({ viewport: { width: 390, height: 844 }, v1: comparison[0], v2: comparison[1], executedAt: new Date().toISOString() }, null, 2) + '\n');
await browser.close();
console.log('wave10-v1-v2-comparison-browser-check: ok');
