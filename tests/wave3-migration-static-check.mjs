import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of [
  "const LEGACY_IMPORT_KEYS = ['marsbGym_v2', 'marsbGym_v1']",
  'function readLegacyStorage()',
  'function buildLegacyImportPreview',
  'function previewLegacyImport()',
  'function confirmLegacyImport',
  'function rollbackLastLegacyImport',
  'MIGRATION_BACKUP_PREFIX',
  'localStorage.setItem(backupKey',
  'A v1 não será alterada',
  'window.MARSB_V2_STATE =',
  'id="v2ImportSettings"',
  'id="importDataBtn"'
]) assert.ok(html.includes(token), `fluxo de migração ausente: ${token}`);
assert.match(html, /imported\.nutrition\.days/);
assert.match(html, /imported\.progress =/);
assert.match(html, /imported\.workouts =/);
assert.doesNotMatch(html, /localStorage\.removeItem\(['"]marsbGym_v2['"]\)/, 'a migração não pode apagar a origem');
assert.doesNotMatch(html, /localStorage\.clear\(\)/, 'a migração não pode limpar o armazenamento');
console.log('wave3-migration-static-check: ok');
