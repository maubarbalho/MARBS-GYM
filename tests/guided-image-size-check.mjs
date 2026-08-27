import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'grid-template-columns:88px 1fr',
  'width:88px; height:84px; min-height:84px',
  '@media (max-width:430px)',
  'grid-template-columns:60px 1fr',
  'width:60px; height:60px; min-height:60px',
  ".guided-media-visual::after { inset:6px; }",
  '.guided-art-mark { width:30px; height:30px;'
];
for (const token of required) {
  if (!html.includes(token)) throw new Error(`A área compacta da imagem não contém: ${token}`);
}
if (html.includes('grid-template-columns:130px 1fr') || html.includes('grid-template-columns:108px 1fr') || html.includes('grid-template-columns:76px 1fr') || html.includes('min-height:138px') || html.includes('min-height:104px')) {
  throw new Error('Os valores grandes anteriores da imagem ainda estão ativos.');
}
if (!html.includes('role="img" aria-label="Elemento visual da atividade"')) {
  throw new Error('A imagem visual perdeu sua identificação acessível.');
}
console.log('OK: imagem do exercício compacta no layout padrão e no celular, com identificação acessível preservada.');
