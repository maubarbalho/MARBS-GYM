import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
const requiredScreens = ['home', 'workouts', 'focus', 'progress', 'diet', 'library'];
const requiredLabels = [
  'Feito nesta semana',
  'Pendente nesta semana',
  'Treino de hoje',
  'Usar último treino',
  'Último treino',
  'Concluir exercício',
  'Pular exercício',
  'Como foi esta atividade?',
  'Progresso',
  'Dieta',
  'Biblioteca',
  'Importar dados da v1',
  'Exportar dados da v2'
];

for (const screen of requiredScreens) {
  assert.match(html, new RegExp(`data-screen="${screen}"`), `tela ausente: ${screen}`);
}
for (const label of requiredLabels) {
  assert.ok(html.includes(label), `rótulo ausente: ${label}`);
}
assert.match(html, /\.bottom-actions\s*\{\s*position:\s*fixed[\s\S]*?z-index:\s*30/, 'ações do treino não estão fixas');
assert.match(html, /--safe-bottom:\s*env\(safe-area-inset-bottom/, 'safe area do aparelho não foi considerada');
assert.match(html, /localStorage\.getItem\(KEY\)/, 'estado local da v2 ausente');
assert.match(html, /localStorage\.getItem\('marsbGym_v2'\)/, 'importação explícita da v1 ausente');
assert.match(html, /download = 'marsb-gym-v2-backup\.json'/, 'exportação da v2 ausente');
assert.match(html, /inputmode="decimal"/, 'carga decimal ausente');
assert.match(html, /selectedRpe/, 'registro de esforço ausente');
console.log('v2-prototype-check: ok');
