import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const token of [
  'id="page-dieta"',
  'id="dietDate"',
  'id="dietWaterInput"',
  'diet-options-disclosure',
  'Opções do diário',
  'Duplicar dia',
  'Cardápios favoritos',
  'Receitas salvas',
  'Metas diárias e consumo',
  'Adicionar alimento ao diário',
  'Restrições e alergias',
  'Lista de compras do dia',
  'Como as metas são definidas',
  'id="dietDiaryList"'
]) {
  if (!html.includes(token)) throw new Error(`Blocos da Dieta incompletos: ${token}`);
}

const dietStart = html.indexOf('<div class="page" id="page-dieta">');
const dietEnd = html.indexOf('<div class="page" id="page-plano">', dietStart);
const dietHtml = html.slice(dietStart, dietEnd);

if (!dietHtml.includes('<details class="diet-options-disclosure">')) {
  throw new Error('As opções secundárias da Dieta não usam divulgação progressiva.');
}
if (!dietHtml.includes('<details class="diet-info-disclosure">')) {
  throw new Error('A explicação das metas não é recolhível.');
}
if (dietHtml.includes('class="diet-options-disclosure" open') || dietHtml.includes('class="diet-info-disclosure" open')) {
  throw new Error('As opções da Dieta não podem iniciar expandidas.');
}
if (!dietHtml.includes('<details class="diet-meal-add"><summary>Adicionar alimento ao diário</summary>')) {
  throw new Error('O formulário de adição de alimento não inicia recolhido.');
}
if (dietHtml.includes('<details class="diet-meal-add" open><summary>Adicionar alimento ao diário</summary>')) {
  throw new Error('O formulário de adição de alimento não deve iniciar expandido.');
}
if (!dietHtml.includes('onclick="copyDietShoppingList()"') || !dietHtml.includes('onclick="saveDietTargets()"')) {
  throw new Error('Ações da lista de compras ou metas foram removidas.');
}
if (html.includes('localStorage.clear(') || html.includes('localStorage.removeItem(STORAGE_KEY)')) {
  throw new Error('A compactação da Dieta não pode limpar dados locais.');
}

console.log('OK: opções da Dieta recolhíveis, diário principal preservado e conteúdo secundário completo.');
