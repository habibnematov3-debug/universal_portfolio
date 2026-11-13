import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { portfolioSchema, safeLink, safeImage, readiness, textOnColor, visibleProjects } from '../src/lib/portfolio-model.ts';
import { createProject, duplicateProject, projectPrompts } from '../src/lib/project-presets.ts';
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
test('older portfolio files gain layout and project defaults without losing content', () => {
  const migrated = portfolioSchema.parse(content);
  assert.equal(migrated.appearance.layout, 'showcase');
  assert.equal(migrated.projects[0].visible, true);
  assert.equal(migrated.projects[0].featured, false);
  assert.deepEqual(migrated.projects[0].details, []);
  assert.deepEqual(migrated.projects[0].gallery, []);
  assert.deepEqual(migrated.projects[0].title, content.projects[0].title);
});
test('all eight faculty presets produce valid projects with translated prompts', () => {
  for (const faculty of Object.keys(projectPrompts)) {
    const project = createProject(faculty,faculty);
    assert.ok(portfolioSchema.safeParse({...content,projects:[project]}).success);
    assert.equal(project.details.length,3);
    for (const detail of project.details) for (const language of ['uz','ru','en']) assert.ok(detail.label[language]);
  }
});
test('duplicating a project preserves content independently and starts hidden', () => {
  const original = createProject('architecture','original');
  original.title.uz='Uy'; original.featured=true;
  original.gallery.push({image:'house.jpg',caption:{uz:'Uy',ru:'Дом',en:'House'}});
  const copy = duplicateProject(original,'copy');
  assert.equal(copy.id,'copy'); assert.equal(copy.visible,false); assert.equal(copy.featured,false);
  assert.deepEqual(copy.gallery,original.gallery);
  copy.gallery[0].caption.uz='Boshqa uy';
  assert.equal(original.gallery[0].caption.uz,'Uy');
});
test('public projects omit hidden items and feature selected work without mutating saved order', () => {
  const p=portfolioSchema.parse(content);
  const first=createProject('business','first'), hidden=createProject('business','hidden'), featured=createProject('business','featured');
  hidden.visible=false;featured.featured=true;p.projects=[first,hidden,featured];
  assert.deepEqual(visibleProjects(p).map(x=>x.id),['featured','first']);
  assert.deepEqual(p.projects.map(x=>x.id),['first','hidden','featured']);
});
test('gallery content rejects unsafe images and excess entries', () => {
  const project=createProject('architecture','gallery');
  project.gallery=[{image:'javascript:alert(1)',caption:{uz:'',ru:'',en:''}}];
  assert.equal(portfolioSchema.safeParse({...content,projects:[project]}).success,false);
  project.gallery=Array.from({length:7},()=>({image:'house.jpg',caption:{uz:'',ru:'',en:''}}));
  assert.equal(portfolioSchema.safeParse({...content,projects:[project]}).success,false);
});
