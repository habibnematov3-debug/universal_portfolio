# Personal portfolio — UZ / RU / ENG

The public homepage opens a single person's portfolio. Visitors can view projects, expand project details, read about the owner, and switch between Uzbek, Russian, and English. Language choices are remembered on the device and can be shared with `?lang=uz`, `?lang=ru`, or `?lang=en`.

## Change the owner

Edit `src/portfolio-content.ts`. This is the source of the published content; browser storage only remembers the visitor's language.

1. Replace `name`, `initials`, `role`, `headline`, `intro`, `location`, and `about`. Each text has three versions, in this order: Uzbek, Russian, English. Translations are entered manually, not generated automatically.
2. Add your real `email`, skills, experience, and projects. Each project has a description, your contribution, and the outcome. Empty project URLs are hidden.
3. Put your portrait, project images, and résumé in `public/`. Set `photo: 'portrait.jpg'`, `resume: 'resume.pdf'`, and project `image` paths accordingly. Use relative paths so they work on GitHub Pages.
4. Choose `field` from the eight options below. Optionally override the accent color, background, and heading font in `appearance`.
5. Set `demo: false` when all sample content has been replaced. Publishing these changes updates the same website link for everyone.

Fields: `computer-engineering`, `it-business`, `business`, `english-philology`, `korean-philology`, `architecture`, `civil-engineering`, `interior-design`.

The field controls the starting colors, typography, and visual treatment. Changing it does not rewrite the owner's profession or project content. Edit those to match the owner in all three languages.

## Local preview

Requires Node 22.13+.

```sh
npm ci
npx vite --config vite.pages.config.ts --host 127.0.0.1
```

Open the URL printed by Vite, including `/universal_portfolio/`.

## Verify

```sh
npm run build:pages
npx tsc --noEmit
node --test tests/portfolio-content.test.mjs
```

## Publish to GitHub Pages

The existing `.github/workflows/pages.yml` builds and deploys pushes to `main`. Repository Settings → Pages → Source must be GitHub Actions.

After reviewing your changes, run from this folder:

```sh
git add src app index.html README.md tests/portfolio-content.test.mjs
git commit -m "Simplify portfolio and add Uzbek Russian English"
git push origin main
```

Once the workflow succeeds, the public URL is:
https://habibnematov3-debug.github.io/universal_portfolio/

This version has no owner login or online editor. Editing the source file and publishing it changes the public portfolio. The earlier studio files remain in the repository but are not used by the homepage. The separate older Sites preview is not updated by GitHub Pages deployment.
