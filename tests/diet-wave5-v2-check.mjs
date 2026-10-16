import fs from 'node:fs';
import assert from 'node:assert/strict';
const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
for (const token of ['Receitas salvas','id="dietRecipeName"','id="applyDietRecipe"','Restrições e alergias','id="dietRestrictionsV2"','Lista de compras','id="dietShoppingV2"','Como as metas são calculadas?','const saveDietRecipe','const applyDietRecipe','const saveDietPreferences','const getDietShopping','Mifflin–St Jeor']) assert.ok(html.includes(token), `Onda 5 ausente: ${token}`);
assert.match(html, /state\.nutrition\.recipes/);
assert.match(html, /copyDietShoppingV2/);
assert.match(html, /não alteramos o histórico automaticamente/);
console.log('diet-wave5-v2-check: ok');
