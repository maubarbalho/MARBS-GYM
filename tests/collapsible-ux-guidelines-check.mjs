import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const token of [
  'home-rhythm-disclosure',
  'history-item-disclosure',
  'about-disclosure',
  'class="ux-disclosure"',
  'min-height:44px',
  'cursor:pointer',
  'prefers-reduced-motion',
  'Ver detalhes',
  'Ver instruções',
  'Ritmo de treino',
  'Histórico de Treinos',
  'Como o personal usa',
  'Uso offline e atualizações',
  'Sobre os avisos'
]) {
  if (!html.includes(token)) throw new Error(`Diretriz recolhível ausente: ${token}`);
}

const homeRender = html.slice(html.indexOf('function renderDailyHome()'), html.indexOf('let workoutFilterState'));
if (!homeRender.includes('home-rhythm-disclosure') || !homeRender.includes('Ver evolução completa')) {
  throw new Error('Ritmo de treino não preserva a expansão e as ações principais.');
}

const historyRender = html.slice(html.indexOf('function renderHistory()'), html.indexOf('function findExercise'));
for (const token of [
  "document.createElement('details')",
  'history-item-summary',
  'history-item-details',
  'Apagar registro'
]) {
  if (!historyRender.includes(token)) throw new Error(`Histórico recolhível incompleto: ${token}`);
}

const aboutStart = html.indexOf('<div class="page" id="page-sobre">');
const aboutEnd = html.indexOf('<button type="button" class="scroll-top-btn"', aboutStart);
const about = html.slice(aboutStart, aboutEnd);
if ((about.match(/<details class="about-section about-disclosure ux-disclosure">/g) || []).length !== 5) {
  throw new Error('A tela Sobre não possui os cinco blocos informativos recolhíveis.');
}

for (const pageId of ['page-plano', 'page-dados', 'page-notificacoes']) {
  const start = html.indexOf(`<div class="page" id="${pageId}"`);
  const next = html.indexOf('<div class="page" id="page-', start + 10);
  const chunk = html.slice(start, next < 0 ? html.length : next);
  if (!chunk.includes('class="ux-disclosure"')) throw new Error(`${pageId} não possui a expansão informativa prevista.`);
}

for (const token of [
  "onclick=\"startWorkoutSession('",
  'onclick="exportBackupJSON()',
  'onclick="testTimerNotification()"',
  'onclick="planoSaveProgram()"',
  'id="dietDiaryList"'
]) {
  if (!html.includes(token)) throw new Error(`Ação principal ausente após compactação: ${token}`);
}

if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('Expansões de UX não podem limpar dados locais.');
}

console.log('OK: expansões progressivas nas telas prioritárias, ações principais visíveis e dados locais protegidos.');
