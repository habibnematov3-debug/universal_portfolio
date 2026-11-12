import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { portfolioSchema, safeLink, safeImage, readiness, textOnColor } from '../src/lib/portfolio-model.ts';
const content = JSON.parse(await readFile(new URL('../public/portfolio.json', import.meta.url), 'utf8'));
test('published content and JSON roundtrip are valid', () => {
  const parsed = portfolioSchema.parse(content);
  assert.deepEqual(portfolioSchema.parse(JSON.parse(JSON.stringify(parsed))), parsed);
});
test('unsafe schemes, credentials, traversal, and SVG data are rejected', () => {
  for (const value of ['javascript:alert(1)', '//evil.example', 'https://user:pass@example.com', '../secret', 'images/../../secret', 'https://a.com\\evil', 'data:text/html,hello']) assert.equal(safeLink(value), undefined, value);
  assert.equal(safeImage('data:image/svg+xml;base64,PHN2Zz4='), undefined);
  assert.ok(safeLink('https://example.com/project'));
  assert.ok(safeLink('portrait.jpg'));
  assert.ok(safeImage('data:image/png;base64,YQ=='));
});
test('malformed imports cannot replace a portfolio', () => {
  assert.equal(portfolioSchema.safeParse({}).success, false);
  assert.equal(portfolioSchema.safeParse({...content, field:'unknown'}).success, false);
  assert.equal(portfolioSchema.safeParse({...content, email:'bad\nBcc:evil@example.com'}).success, false);
  assert.equal(portfolioSchema.safeParse({...content, photo:'javascript:alert(1)'}).success, false);
  assert.equal(portfolioSchema.safeParse({...content, projects:[content.projects[0],content.projects[0]]}).success, false);
  assert.equal(portfolioSchema.safeParse({...content, name:{uz:'Name'}}).success, false);
});
test('sales checklist detects sample content and missing employer contact', () => {
  assert.ok(readiness(portfolioSchema.parse(content)).length);
  const ready={...content,demo:false,email:'owner@example.com',photo:'portrait.jpg'};
  assert.equal(readiness(portfolioSchema.parse(ready)).length,0);
});
test('custom theme foreground remains readable on light and dark accents', () => {
  assert.equal(textOnColor('#ffffff'), '#111111');
  assert.equal(textOnColor('#000000'), '#ffffff');
  assert.equal(textOnColor('#ffff00'), '#111111');
  assert.equal(textOnColor('#315d4d'), '#ffffff');
});
