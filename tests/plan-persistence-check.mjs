import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  "const PLAN_BACKUP_STORAGE_KEY = 'marsbGym_plan_backup_v1'",
  'function saveCustomProgramBackup',
  'function verifyCustomProgramPersisted',
  'function restoreCustomProgramBackup',
  'localStorage.setItem(PLAN_BACKUP_STORAGE_KEY, payload)',
  'sanitizePlanCustomExercises',
  'const planRecovered = !migrated.customProgram && restoreCustomProgramBackup(migrated)',
  'if (migrated.customProgram && !localStorage.getItem(PLAN_BACKUP_STORAGE_KEY)) saveCustomProgramBackup(migrated)',
  'const stateVerified = stateSaved && verifyCustomProgramPersisted(state.customProgram)',
  'const planBackupSaved = saveCustomProgramBackup()',
  'localStorage.removeItem(PLAN_BACKUP_STORAGE_KEY)'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Proteção do plano incompleta: ${missing.join(', ')}`);
if (!html.includes('if (hasActiveWorkout()) { showToast(\'Finalize ou pause o treino antes de atualizar\'); return; }')) {
  throw new Error('A atualização ainda precisa proteger uma sessão de treino ativa.');
}
if (!html.includes("return state.customProgram;\n      }\n      return TREINOS_BASE;")) {
  throw new Error('O plano personalizado não tem prioridade explícita sobre o plano padrão.');
}
console.log('OK: persistência, verificação, backup local e restauração do plano validados.');
