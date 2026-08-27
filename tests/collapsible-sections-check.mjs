import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const token of [
  'id="sessionLibraryPanel"',
  'id="workoutSummary"',
  'session-library-collapsible',
  'session-library-toggle',
  'session-library-content',
  'workout-summary-disclosure',
  'workout-summary-disclosure-toggle',
  'workout-summary-details',
  'Aquecimento · 5–8 min',
  'Mobilidade · 3–5 min',
  'Volta à calma · 3–5 min',
  'Recordes pessoais'
]) {
  if (!html.includes(token)) throw new Error(`Bloco recolhível incompleto: ${token}`);
}

const libraryFnStart = html.indexOf('function buildSessionLibraryHtml');
const libraryFnEnd = html.indexOf('function renderSessionLibrary', libraryFnStart);
const libraryFn = html.slice(libraryFnStart, libraryFnEnd);
if (!libraryFn.includes('<details class="session-library session-library-collapsible">')) {
  throw new Error('A Biblioteca rápida não é recolhível por padrão.');
}
if (!libraryFn.includes('<summary class="session-library-toggle">')) {
  throw new Error('A Biblioteca rápida não possui acionador semântico de expansão.');
}
if (libraryFn.includes('<details class="session-library session-library-collapsible" open')) {
  throw new Error('A Biblioteca rápida não pode iniciar expandida.');
}

const summaryFnStart = html.indexOf('function renderWorkoutSummary');
const summaryFnEnd = html.indexOf('function renderActiveWorkoutPanel', summaryFnStart);
const summaryFn = html.slice(summaryFnStart, summaryFnEnd);
if (!summaryFn.includes('<details class="workout-summary-disclosure">')) {
  throw new Error('O Resumo do treino não é recolhível por padrão.');
}
if (!summaryFn.includes('class="workout-summary-disclosure-toggle"')) {
  throw new Error('O Resumo do treino não possui acionador semântico de expansão.');
}
if (!summaryFn.includes('class="workout-summary-details"')) {
  throw new Error('Os detalhes do Resumo do treino não foram preservados.');
}
if (summaryFn.includes('<details class="workout-summary-disclosure" open')) {
  throw new Error('O Resumo do treino não pode iniciar expandido.');
}

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A compactação visual não pode limpar dados locais.');
}

console.log('OK: Biblioteca rápida e Resumo do treino recolhíveis, completos e fechados por padrão.');
