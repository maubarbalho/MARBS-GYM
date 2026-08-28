import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const focusStart = html.indexOf('.guided-overlay.focus-mode .guided-media-card');
const focusEnd = html.indexOf('@media (max-width:430px)', focusStart);
const focusCss = html.slice(focusStart, focusEnd);
const requiredFocusTokens = [
  '.guided-overlay.focus-mode .guided-actions-grid { display:grid; }',
  '.guided-overlay.focus-mode .guided-nav-row { display:flex; }',
  '.guided-overlay.focus-mode .guided-utility-row',
  '.guided-overlay.focus-mode .guided-interrupt-row',
  '.guided-overlay.focus-mode .guided-prev-btn { display:block; }'
];
const missing = requiredFocusTokens.filter((token) => !focusCss.includes(token));
if (missing.length) throw new Error(`Ações ausentes no modo foco: ${missing.join(', ')}`);
if (focusCss.includes('.guided-overlay.focus-mode .guided-prev-btn { display:none; }')) {
  throw new Error('O botão Anterior continua oculto no modo foco.');
}

const actionsMarkup = html.slice(html.indexOf('<div class="guided-actions-grid"'));
const navIndex = actionsMarkup.indexOf('class="guided-nav-row"');
const utilityIndex = actionsMarkup.indexOf('class="guided-utility-row"');
const interruptIndex = actionsMarkup.indexOf('class="guided-interrupt-row"');
for (const [label, index] of [['navegação', navIndex], ['utilidades', utilityIndex], ['encerramento', interruptIndex]]) {
  if (index < 0) throw new Error(`Linha de ${label} ausente no grupo de ações.`);
}
if (!(navIndex < utilityIndex && utilityIndex < interruptIndex)) {
  throw new Error('A ordem do grupo de ações deve ser navegação, utilidades e encerramento.');
}
for (const token of ['js-guided-prev', 'js-guided-next', 'js-guided-timer', 'js-guided-repeat', 'js-end-exercise', 'js-end-workout']) {
  if (!actionsMarkup.includes(token)) throw new Error(`Handler do modo foco ausente: ${token}`);
}

console.log('OK: grupo completo de ações, ordem, handlers e visibilidade no modo foco validados.');
