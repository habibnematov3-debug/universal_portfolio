import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/portfolio-content.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { ui, themes } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const portfolio = JSON.parse(await readFile(new URL('../public/portfolio.json', import.meta.url), 'utf8'));

test('all translated UI and portfolio content includes three nonempty languages', () => {
  let translations = 0;
  function inspect(value, path) {
    if (!value || typeof value !== 'object') return;
    if (['uz', 'ru', 'en'].some(key => key in value)) {
      for (const lang of ['uz', 'ru', 'en']) {
        assert.equal(typeof value[lang], 'string', `${path}.${lang}`);
        assert.ok(value[lang].trim(), `${path}.${lang} must not be blank`);
      }
      translations++;
    } else {
      for (const [key, entry] of Object.entries(value)) inspect(entry, `${path}.${key}`);
    }
  }
  inspect({ portfolio, ui }, 'content');
  assert.ok(translations > 0, 'translation traversal must inspect actual content');
});

test('default language, faculty, and theme customization are valid', () => {
  assert.ok(['uz', 'ru', 'en'].includes(portfolio.defaultLanguage));
  assert.ok(themes[portfolio.field]);
  assert.equal(Object.keys(themes).length, 8);
  for (const theme of Object.values(themes)) {
    assert.match(theme.accent, /^#[a-f0-9]{6}$/i);
    assert.match(theme.paper, /^#[a-f0-9]{6}$/i);
    assert.ok(['technical', 'editorial', 'classic'].includes(theme.style));
  }
});

test('projects have unique identities and translated case study content', () => {
  assert.equal(new Set(portfolio.projects.map(p => p.id)).size, portfolio.projects.length);
  for (const project of portfolio.projects) {
    for (const key of ['title', 'category', 'summary', 'contribution', 'result']) {
      assert.ok(project[key].uz && project[key].ru && project[key].en);
    }
  }
});
