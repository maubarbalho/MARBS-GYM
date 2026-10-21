import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
const matrix = fs.readFileSync(new URL('../v2/v1-feature-parity.md', import.meta.url), 'utf8');
const contract = fs.readFileSync(new URL('../v2/state-contract-v2.md', import.meta.url), 'utf8');
const evidence = JSON.parse(fs.readFileSync(new URL('../relatorios/evidencias/onda-9-ensaio-migracao.json', import.meta.url), 'utf8'));

assert.match(html, /const KEY = 'marsbGym_v2_preview'/);
assert.doesNotMatch(html, /localStorage\.setItem\(['"]marsbGym_v2['"]/);
assert.match(contract, /origem `marsbGym_v2` permanece byte a byte inalterada/);
assert.match(matrix, /\| 9 — Ensaio de migração e auditoria final \|/);
assert.match(matrix, /56\/56 aprovados/);
assert.equal(evidence.sourcePreserved, true);
assert.equal(evidence.updatePreserved, true);
assert.equal(evidence.rollback, true);
assert.equal(evidence.fullSuite.failed, 0);
assert.equal(evidence.mainTouched, false);

// O portão final permanece explicitamente fechado até a validação em dispositivos reais e aprovação do usuário.
assert.match(contract, /iOS\/PWA há limitações/);
console.log('wave10-final-validation-check: ok');
