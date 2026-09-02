import fs from 'node:fs';
const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
const required = ['data-calc-tab="body"','data-calc-tab="nutrition"','data-calc-tab="training"','id="bmiBtn"','id="macroBtn"','id="foodBtn"','id="calcBtn"','id="progressBtn"','id="oneRmBtn"','id="unitBtn"','id="generateMenuBtn"','TACO','id="copyMenuBtn"'];
for (const token of required) if (!html.includes(token)) throw new Error(`recurso ausente: ${token}`);
console.log('calculators-menu-v2-static-check: ok');
