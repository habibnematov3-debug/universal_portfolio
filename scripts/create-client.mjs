import { mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error('Usage: npm run client -- client-name (lowercase letters, digits, hyphens)');
const source = process.cwd();
const parent = path.resolve(source, '..', 'clients');
const destination = path.resolve(parent, slug);
if (path.dirname(destination) !== parent) throw Error('Invalid destination');
await mkdir(parent, { recursive: true });
await mkdir(destination); // Fails if already present; never overwrite another client.
const files = ['src/components/PersonalPortfolio.tsx','src/components/PortfolioApp.tsx','src/components/OwnerEditor.tsx','src/lib/portfolio-model.ts','src/lib/project-presets.ts','src/personal.css','src/portfolio-content.ts','src/published-portfolio.ts','src/main-pages.tsx','src/server-render.tsx','public','index.html','vite.pages.config.ts','scripts/build-portfolio.mjs','scripts/check-build.mjs','scripts/create-client.mjs','tests/portfolio-model.test.mjs','tests/portfolio-content.test.mjs','DELIVERY.md','.github/workflows/pages.yml'];
for (const file of files) { const target=path.join(destination,file); await mkdir(path.dirname(target),{recursive:true}); await cp(path.join(source,file),target,{recursive:true}); }
const configPath = path.join(destination, 'vite.pages.config.ts');
await writeFile(configPath, (await readFile(configPath,'utf8')).replace(/base: process\.env\.PORTFOLIO_BASE \|\| '[^']*'/, `base: process.env.PORTFOLIO_BASE || '/${slug}/'`));
const packageSource = JSON.parse(await readFile('package.json','utf8'));
const select = (list, from) => Object.fromEntries(list.map(name => [name, from[name]]));
const pkg = { name:slug,version:'1.0.0',private:true,type:'module',engines:packageSource.engines,scripts:{dev:'vite --config vite.pages.config.ts --host 127.0.0.1','build:pages':'node scripts/build-portfolio.mjs','test:portfolio':'node --experimental-strip-types --test tests/*.test.mjs',client:'node scripts/create-client.mjs'},dependencies:select(['react','react-dom','zod'],packageSource.dependencies),devDependencies:select(['@types/node','@types/react','@types/react-dom','@vitejs/plugin-react','typescript','vite'],packageSource.devDependencies)};
await writeFile(path.join(destination,'package.json'), JSON.stringify(pkg,null,2));
await writeFile(path.join(destination,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',lib:['dom','dom.iterable','esnext'],skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'ESNext',moduleResolution:'bundler',resolveJsonModule:true,jsx:'react-jsx',types:['node']},include:['src','vite.pages.config.ts'],exclude:['node_modules','pages-dist','.portfolio-render']},null,2));
await writeFile(path.join(destination,'.gitignore'), 'node_modules/\npages-dist/\n.portfolio-render/\n.env*\n*.tsbuildinfo\n');
await writeFile(path.join(destination,'README.md'), `# ${slug}\n\nRead DELIVERY.md. Run npm install once to create package-lock.json, then npm run dev.\n\nRepository name: ${slug}. URL base: /${slug}/. Set PORTFOLIO_BASE=/ for a custom domain.\n\nThis copy contains the current public portfolio and its assets. Replace all previous owner details before publishing. It has no Git history, remote, credentials, or private draft storage.\n`);
console.log(`Client source created: ${destination}\nNext: npm install, edit public/portfolio.json, then npm run build:pages. Initialize a new Git repository for this client.`);


