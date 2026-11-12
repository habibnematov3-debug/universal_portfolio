import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const html = await readFile('pages-dist/index.html','utf8');
const data = JSON.parse(await readFile('public/portfolio.json','utf8'));
const escape = v => v.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
assert.ok(html.includes(escape(data.headline[data.defaultLanguage])), 'Initial HTML must contain the owner headline without JavaScript');
assert.ok(html.includes('property="og:title"'), 'Share metadata missing');
assert.ok(!html.includes('/src/main-pages.tsx'), 'Source entry leaked into production');
for (const asset of await readdir('pages-dist/assets')) {
  if (!asset.endsWith('.js')) continue;
  const js = await readFile(`pages-dist/assets/${asset}`,'utf8');
  assert.ok(!js.includes('Download the React DevTools'), 'Development React must not ship');
}
assert.ok((await readFile('pages-dist/404.html','utf8')).includes('404'));
assert.ok((await readFile('pages-dist/third-party-notices.txt','utf8')).includes('MIT'));
console.log('Production HTML, metadata, React mode, 404, and dependency notices verified.');
