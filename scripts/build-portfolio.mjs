import { build, resolveConfig } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const configFile = path.resolve('vite.pages.config.ts');
process.env.NODE_ENV = 'production';
const config = await resolveConfig({ configFile, mode: 'production' }, 'build', 'production');
await build({ configFile });
await build({ configFile, publicDir: false, build: { ssr: 'src/server-render.tsx', outDir: '.portfolio-render', emptyOutDir: true } });
const { render, data, issues } = await import(pathToFileURL(path.resolve('.portfolio-render/server-render.js')).href);
if (process.env.REQUIRE_CLIENT_CONTENT === '1' && issues.length) throw new Error(`Client content is incomplete: ${issues.join('; ')}`);
const escape = v => v.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
let html = await readFile('pages-dist/index.html', 'utf8');
const lang = data.defaultLanguage;
const title = escape(`${data.name[lang]} — ${data.role[lang]}`);
html = html.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`)
  .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
  .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
  .replace(/<meta name="description" content="[^"]*"\s*\/>/, () => `<meta name="description" content="${escape(data.intro[lang])}" />`);
const metadata = `<meta property="og:type" content="profile" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${escape(data.intro[lang])}" /><meta name="twitter:card" content="summary" />${data.demo ? '<meta name="robots" content="noindex,follow" />' : ''}`;
html = html.replace('</head>', () => `${metadata}</head>`);
await writeFile('pages-dist/index.html', html);
const licenses = await Promise.all(['react','react-dom','scheduler','zod'].map(async name => `${name}\n${await readFile(`node_modules/${name}/LICENSE`, 'utf8')}`));
await writeFile('pages-dist/third-party-notices.txt', licenses.join('\n\n--------------------\n\n'));
await writeFile('pages-dist/404.html', '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found</title><body style="font-family:Arial;padding:10%;background:#f2f3ed"><h1>404</h1><p>Sahifa topilmadi / Страница не найдена / Page not found</p><a href="'+escape(config.base)+'">Portfolio →</a></body></html>');
console.log(`Portfolio rendered as HTML (${lang}). ${issues.length ? 'Sample/incomplete content: '+issues.join('; ') : 'Client content checks passed.'}`);
await import('./check-build.mjs');
