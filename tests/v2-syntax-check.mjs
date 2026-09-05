import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../v2/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(Boolean);
if (!scripts.length) throw new Error('nenhum script encontrado');
for (const [index, source] of scripts.entries()) {
  new vm.Script(source, { filename: `v2/index.html#script-${index + 1}` });
}
console.log('v2-syntax-check: ok');
