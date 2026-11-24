import fs from 'node:fs';
import { chromium } from '/home/ubuntu/node_modules/playwright/index.mjs';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of ['id="profileName"', 'state.profile = { ...state.profile, name:', 'id="nextExerciseBtn"', 'const goToNextGuidedExercise', 'retomando exercício pulado']) {
  if (!html.includes(token)) throw new Error(`Correção ausente: ${token}`);
}
if (html.includes('localStorage.removeItem(STORAGE_KEY)') || html.includes('localStorage.clear(')) throw new Error('A correção não pode apagar o armazenamento local.');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
const seed = { schemaVersion: 2, profile: { name: 'Mauricio', preferences: {} }, nutrition: { selectedDate: '2026-11-24', days: {}, favorites: [], recipes: [] }, workouts: {}, progress: {}, settings: { appearance: 'dark', units: 'metric', notifications: false }, guided: { active: false, index: 0, skipped: [], completed: [], startedAt: null, workout: 'Treino A' }, timer: { deadlineAt: 0, pausedRemaining: 0, running: false }, sets: [], sessions: [] };
await page.addInitScript(value => localStorage.setItem('marsbGym_v2_preview', JSON.stringify(value)), seed);
await page.goto('http://127.0.0.1:4173/v2/?profile-workout-fix=1');

if ((await page.locator('#homeGreeting').textContent()).trim() !== 'Bom dia, Mauricio.') throw new Error('o painel inicial não usa o nome salvo');

await page.evaluate(() => document.querySelector('[data-screen="settings"]').classList.add('active'));
await page.locator('#profileName').fill('Mauricio');
await page.locator('#saveV2Preferences').click();
const savedName = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')).profile.name);
if (savedName !== 'Mauricio') throw new Error('nome não foi persistido');

await page.locator('[data-open-workout]').first().click();
await page.locator('[data-screen="focus"]').waitFor();
const actionButtonsVisible = await page.locator('.bottom-actions button').evaluateAll(buttons => buttons.every(button => { const rect = button.getBoundingClientRect(); return getComputedStyle(button).display !== 'none' && rect.bottom > 0 && rect.top < window.innerHeight; }));
if (!actionButtonsVisible) throw new Error('ações do treino ficaram fora da área tocável no celular');
await page.locator('#nextExerciseBtn').click();
let guided = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')).guided);
if (guided.index !== 1 || !guided.skipped.includes(0)) throw new Error('próximo sem concluir não preservou o exercício atual como pulado');
await page.locator('#completeExercise').click();
guided = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')).guided);
if (guided.index !== 2 || !guided.completed.includes(1)) throw new Error('conclusão não abriu o próximo exercício pendente');
await page.locator('#skipExercise').click();
await page.locator('#completeExercise').click();
await page.locator('#completeExercise').click();
await page.locator('#completeExercise').click();
await page.locator('#rpeModal.open').waitFor();
if (await page.locator('#rpeModal').isHidden()) throw new Error('avaliação final não abriu após concluir os exercícios');
await page.locator('[data-rpe="8"]').click();
await page.locator('#saveRpe').click();
const finished = await page.evaluate(() => JSON.parse(localStorage.getItem('marsbGym_v2_preview')));
if (finished.guided.active || finished.sessions.length !== 1) throw new Error('treino não foi encerrado e salvo');
if (finished.sessions[0].completedExercises.length !== 4) throw new Error('exercícios concluídos não foram registrados');
console.log('profile-workout-fix-check: ok');
await browser.close();
