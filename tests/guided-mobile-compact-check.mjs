import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  '.guided-header {',
  'grid-template-columns:minmax(0,1fr);',
  '.guided-brand-logo { width:18px; height:18px;',
  '.guided-media-card { grid-template-columns:60px 1fr; gap:6px; }',
  '.guided-media-visual { width:60px; height:60px; min-height:60px;',
  '.guided-art-mark { width:30px; height:30px;',
  '.guided-set-status::before { content:\'\'; width:32px; height:32px;',
  'width:44px; height:44px; border:0; background:transparent;'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Compactação mobile ausente ou alterada: ${missing.join(', ')}`);
if (html.includes('grid-template-columns:76px 1fr') || html.includes('width:76px; height:76px; min-height:76px')) {
  throw new Error('O tamanho visual anterior de 76 px ainda está presente no modo guiado mobile.');
}
if (!html.includes('persistGuidedFormBeforeReload') || !html.includes('Dados salvos. Limpando cache e atualizando…')) {
  throw new Error('A atualização forçada segura não está protegida contra perda de dados.');
}
console.log('OK: cabeçalho guiado, imagem e ícones de série compactos no mobile, com alvos de toque preservados.');
