import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const required = [
  'normalizeExecutionMode',
  'executionModeLabel',
  'getExecutionGroupIndexes',
  'getNextGuidedExecutionIndex',
  'setGuidedExecutionMode',
  "startGuided(treinoId, requestedMode = 'normal')",
  'guidedState.executionMode',
  'executionMode: guidedState.executionMode',
  'guidedExecutionMode',
  'js-guided-mode',
  'buildSessionLibraryHtml',
  'renderSessionLibrary',
  'Aquecimento · 5–8 min',
  'Mobilidade · 3–5 min',
  'Volta à calma · 3–5 min',
  'O app alterna após cada série marcada',
  'guided-library-disclosure',
  'Biblioteca rápida de preparação e recuperação'
];
const missing = required.filter((token) => !html.includes(token));
if (missing.length) throw new Error(`Sprint 4 incompleta: ${missing.join(', ')}`);

const renderStart = html.indexOf('function renderTreinos()');
const renderEnd = html.indexOf('function saveRpe', renderStart);
const renderBody = html.slice(renderStart, renderEnd);
if (/\bsaveState\s*\(/.test(renderBody)) {
  throw new Error('Renderizar treinos, modo e biblioteca não deve salvar dados locais.');
}

const libraryStart = html.indexOf('function buildSessionLibraryHtml');
const libraryEnd = html.indexOf('function renderSessionLibrary', libraryStart);
if (/\bsaveState\s*\(/.test(html.slice(libraryStart, libraryEnd))) {
  throw new Error('Consultar a biblioteca não deve persistir dados locais.');
}

const navigationStart = html.indexOf('function getExecutionGroupIndexes');
const navigationEnd = html.indexOf('function buildSessionLibraryHtml', navigationStart);
const navigationBody = html.slice(navigationStart, navigationEnd);
if (!navigationBody.includes("normalized === 'superset'") || !navigationBody.includes('return Array.from({ length: total }')) {
  throw new Error('Superset e circuito precisam formar grupos de execução distintos.');
}
if (/\bsaveState\s*\(/.test(navigationBody)) {
  throw new Error('Calcular a próxima estação não deve persistir dados locais.');
}

const guidedStart = html.indexOf('function renderGuidedStep()');
const guidedEnd = html.indexOf('function renderGuidedComplete', guidedStart);
if (/\bsaveState\s*\(/.test(html.slice(guidedStart, guidedEnd))) {
  throw new Error('Renderizar o passo guiado não deve salvar dados apenas por visualizar.');
}

if (!html.includes("executionMode: ['normal', 'superset', 'circuit'].includes(source.activeWorkout.executionMode) ? source.activeWorkout.executionMode : 'normal'")) {
  throw new Error('A sessão ativa não possui normalização retrocompatível do modo de execução.');
}
if (!html.includes("if (justCompleted && guidedState.executionMode !== 'normal' && !allDone)")) {
  throw new Error('O modo superset/circuito não alterna após uma série marcada.');
}

console.log('OK: modos normal/superset/circuito, alternância de estações e biblioteca local validados sem persistência em renderização.');
