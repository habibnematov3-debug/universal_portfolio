# Folio — individual portfolio delivery kit

A personal portfolio in Uzbek, Russian, and English, with a separate browser editor, eight faculty themes, and GitHub Pages publishing.

Start with [DELIVERY.md](DELIVERY.md) for the complete Uzbek owner and customer delivery guide.

## Run

```sh
npm ci
npm run dev:portfolio
```

Public preview: http://127.0.0.1:5173/universal_portfolio/
Editor: http://127.0.0.1:5173/universal_portfolio/?edit=1

## Content

`public/portfolio.json` is the single published source of owner information. Use the editor to change it, download the JSON, replace that file, then commit and push. Browser drafts never change the live site. The editor has no server write privileges or login.

`src/portfolio-content.ts` contains translated interface labels and faculty themes. `src/personal.css` contains layout and styling. The old studio files are retained for history but are not part of this portfolio's page bundle.

## Validation and production build

```sh
npm run test:portfolio
npx tsc --noEmit
npm run build:pages
```

The build creates static HTML, metadata, assets, and a 404 page in `pages-dist/`. GitHub Actions runs tests, TypeScript checks, and the build before deployment. Set `REQUIRE_CLIENT_CONTENT=1` to reject incomplete customer profiles. Set `PORTFOLIO_BASE=/` for a root domain, or `/repository-name/` for another GitHub repository.

## Separate customer projects

```sh
npm run client -- customer-portfolio
```

Creates `../clients/customer-portfolio` without Git identity, hosted Site credentials, local storage, or unused studio dependencies. Run `npm install` there to create its lockfile, then use its `npm run dev`. The destination must not exist. Copied public content must be replaced for the new owner.

Current content is explicitly a sample. No real customer's biography, project achievements, photo, or contact information has been invented.
