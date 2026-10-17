import fs from 'node:fs';
import assert from 'node:assert/strict';
const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of ['calculateV1Bmi', 'calculateV1Macros', 'calculateV1Portions', 'calculateV1Plates', 'calculateV1Conversion', 'MARSB_V2_CALCULATORS', 'id="oneRmBtn"', 'id="unitBtn"']) assert.ok(html.includes(token), `recurso C01–C06 ausente: ${token}`);
assert.match(html, /Mifflin|TMB/);
assert.match(html, /Whey \(pó\)/);
assert.match(html, /1\.25|0\.5/);
console.log('calculators-wave6-v2-check: ok');
