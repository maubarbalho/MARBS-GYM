import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'skipGuidedExercise',
  'returnToGuidedExercise',
  'persistGuidedNavigation',
  'skippedExercises',
  'guided-actions-grid',
  'guided-utility-row',
  'guided-pending-list',
  'Pular por agora',
  'Você pode voltar depois'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Navegação de exercícios incompleta: ${missing.join(', ')}`);
if (!html.includes('guidedIndex') || !html.includes('Exercícios pendentes')) {
  throw new Error('Persistência ou tela de retorno aos exercícios pendentes ausente.');
}
if (html.includes('id="guidedMobileActions"') || html.includes('id="guidedQuickSkip"')) {
  throw new Error('A faixa rápida separada ainda está presente no modo guiado.');
}
console.log('OK: salto livre, retorno aos pendentes e persistência guiada validados.');
