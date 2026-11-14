import { copyFile, mkdir, writeFile } from "node:fs/promises";
// GitHub Pages serves this shell for arbitrary usernames; the app loads their data.
await copyFile("dist/index.html", "dist/404.html");
for (const route of ["login", "edit", "onboarding", "auth/callback", "auth/confirm"]) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile("dist/index.html", `dist/${route}/index.html`);
}
await writeFile("dist/.nojekyll", "");
