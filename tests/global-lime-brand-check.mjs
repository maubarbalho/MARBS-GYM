import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));
const requiredHtml = [
  'class="brand-lockup"',
  'class="brand-logo" src="apple-touch-icon.png"',
  'class="brand-wordmark">MARSB-GYM</span>',
  'guided-brand-lockup',
  'class="guided-kicker guided-brand-lockup"',
  'class="guided-brand-logo" src="apple-touch-icon.png"',
  '--primary: #c5f238',
  '--primary:#58740f',
  '--accent: #b8e52d',
  '--primary-ink:',
  '--accent-ink:',
  'color-mix(in srgb, var(--primary)',
  'color-mix(in srgb, var(--accent)',
  'Global MARSB-GYM rebrand',
  '.nav-icon',
  '.config-option-icon'
];
for (const token of requiredHtml) {
  if (!html.includes(token)) throw new Error(`Identidade verde-limão incompleta: ${token}`);
}
if (html.includes('--primary: #007aff') || html.includes('--primary: #0a84ff')) {
  throw new Error('Uma variável de primária azul antiga ainda está ativa.');
}
if (html.includes('Hipertrofia • Treino livre e progresso contínuo') || html.includes('<div class="subtitle">')) {
  throw new Error('O subtítulo antigo do header principal ainda está presente.');
}
if (manifest.theme_color !== '#070a04' || manifest.background_color !== '#070a04') {
  throw new Error('As cores de instalação do PWA não acompanham a identidade verde-limão.');
}
console.log('OK: logo oficial, wordmark, tema verde-limão, contraste e metadados do PWA validados.');
