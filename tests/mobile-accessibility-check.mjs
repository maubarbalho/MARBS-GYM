import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
for (const [index, script] of scripts.entries()) {
  try {
    new Function(script);
  } catch (error) {
    throw new Error(`Erro de sintaxe no script ${index + 1}: ${error.message}`);
  }
}

const forbiddenAiExecution = [
  'Puter', 'sendAiMessage', 'callFreePuterAI', 'callCustomOpenAI', 'AI_STORE_KEY',
  'initAiPage', 'openAiSettings', 'aiSettingsModal', 'aiInput', 'coachConnection'
];
const remainingAi = forbiddenAiExecution.filter((token) => html.includes(token));
if (remainingAi.length) throw new Error(`Execução legada de IA encontrada: ${remainingAi.join(', ')}`);

const buttons = [...html.matchAll(/<button\b[^>]*>/gi)].map((match) => match[0]);
const buttonsWithoutType = buttons.filter((tag) => !/\btype\s*=\s*["'][^"']+["']/i.test(tag));
if (buttonsWithoutType.length) throw new Error(`${buttonsWithoutType.length} botão(ões) sem type explícito.`);

const controls = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)].map((match) => match[0]);
const controlsWithoutName = controls.filter((tag) => !/\baria-label\s*=|\btitle\s*=|\bid\s*=/i.test(tag));
if (controlsWithoutName.length) throw new Error(`${controlsWithoutName.length} controle(s) sem nome ou id detectável.`);

const dialogs = [...html.matchAll(/<[^>]+role\s*=\s*["']dialog["'][^>]*>/gi)].map((match) => match[0]);
if (dialogs.some((tag) => !/\baria-modal\s*=\s*["']true["']/i.test(tag))) throw new Error('Há diálogo sem aria-modal=true.');
if (!html.includes('MOBILE ACCESSIBILITY') || !html.includes('scrollIntoView') || !html.includes('keyboard-open')) {
  throw new Error('Controlador de acessibilidade móvel incompleto.');
}
if (/<script[^>]+src=["']xlsx\.full\.min\.js["']/i.test(html)) {
  throw new Error('A biblioteca Excel ainda está sendo carregada no boot.');
}
if (!html.includes('ensureXlsxLibrary') || !html.includes('pagehide') || !html.includes('visibilitychange')) {
  throw new Error('Carregamento tardio ou salvamento defensivo ausente.');
}

console.log(`OK: ${scripts.length} script(s), ${buttons.length} botões, ${controls.length} controles e ${dialogs.length} diálogos validados.`);
