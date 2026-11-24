import fs from 'node:fs';
import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of ['const resetGuidedSessionSets', "reps:'', weight:'', done:false", 'const resuming = g.active']) {
  if (!html.includes(token)) throw new Error(`Reset de nova sessão ausente: ${token}`);
}
if (html.includes('localStorage.clear(')) throw new Error('O reset não pode limpar todo o armazenamento.');

const seed = {
  schemaVersion: 2,
  profile: { name: 'Mauricio', preferences: {} },
  nutrition: { selectedDate: '2026-11-24', days: {}, favorites: [], recipes: [] },
  workouts: {}, progress: {},
  settings: { appearance: 'dark', units: 'metric', notifications: true },
  guided: { active: false, index: 3, skipped: [], completed: [0, 1, 2, 3], startedAt: '2026-11-23T20:00:00Z', workout: 'Treino A' },
  timer: { deadlineAt: 0, pausedRemaining: 0, running: false },
  sets: [
    { reps: '12', weight: '25', previous: '10 × 20 kg', done: true },
    { reps: '10', weight: '30', previous: '8 × 25 kg', done: true }
  ],
  sessions: [{ id: 'old-session', date: '2026-11-23', workout: 'Treino A', status: 'completed', completedExercises: [0, 1, 2, 3], sets: [] }]
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await page.addInitScript(value => localStorage.setItem('marsbGym_v2_preview', JSON.stringify(value)), seed);
await page.goto('http://127.0.0.1:4173/v2/?new-session-reset=1');
await page.locator('[data-open-workout]').first().click();
const result = await page.evaluate(() => ({
  guided: JSON.parse(localStorage.getItem('marsbGym_v2_preview')).guided,
  sets: JSON.parse(localStorage.getItem('marsbGym_v2_preview')).sets,
  visibleValues: [...document.querySelectorAll('#setRows input.set-input')].map(input => input.value),
  checked: [...document.querySelectorAll('#setRows input.check')].map(input => input.checked)
}));
if (!result.guided.active || result.guided.index !== 0 || result.guided.completed.length) throw new Error('A nova sessão guiada não começou limpa.');
if (result.sets.some(set => set.reps || set.weight || set.done)) throw new Error('A nova sessão reutilizou execução anterior.');
if (result.visibleValues.some(value => value !== '') || result.checked.some(Boolean)) throw new Error('A tela exibiu peso ou série marcada da sessão anterior.');
if (result.sets.some(set => !set.previous)) throw new Error('A referência do treino anterior foi apagada.');
console.log('new-session-reset-check: ok');
await browser.close();
