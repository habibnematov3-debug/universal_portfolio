# Folio — student portfolio studio

A working Uzbek-language prototype for eight university faculties. React 19, TypeScript, Vinext/Vite. Sources are in `src/components`, faculty definitions and all prototype state are in `src/lib/store.ts`.

## Run locally

Node 22.13+ required. From this directory:

```sh
npm ci
npm run dev
```

Open the Local URL printed by the server (normally http://localhost:5173).

## GitHub Pages

The same portfolio editor has a static build for GitHub Pages. It deploys from `.github/workflows/pages.yml` on each push to `main` after Pages is configured in the repository's **Settings → Pages → Build and deployment → Source: GitHub Actions**.

```sh
npm run build:pages
```

The published URL is `https://habibnematov3-debug.github.io/universal_portfolio/`. This build keeps data in each visitor's browser. It does not provide accounts, shared student records, or individual public portfolio pages. Use the JSON backup feature before switching browsers or devices; data from the separate private Sites preview does not appear automatically on GitHub Pages.

## Included

- Landing page, eight faculty templates and illustrative preview portfolios.
- Shared student profile, compressed photo uploads, education, experience and skills.
- Faculty-specific project fields, create/edit/delete and image uploads.
- Separate project collections per faculty; switching faculty preserves projects.
- Immediate portfolio preview, readiness checklist and writing prompts.
- Local browser persistence with visible storage failures, JSON backup/restore.
- Standalone HTML portfolio export with embedded uploaded images; print-to-PDF CV.
- Responsive layout, native modal dialogs and reduced-motion support.

## Current boundaries

This is a browser-local prototype, not yet a commercial multi-user service. The browser stores data on this device only. Use backup/restore to move between devices. The deployed preview is owner-private. HTML export does not publish an individual student's page to the internet.

The writing helper assembles a deterministic template from student answers. It is explicitly labeled: a generative AI provider is not connected. There are no API keys, payment processing, real student accounts, shared database, employer directory or mentor verification in this version.

Demo identities and projects are illustrative, never saved as a student's actual work automatically.

## Verification

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/store.test.mjs
npm run build
```

Node 22+ is needed for the test runner's TypeScript support. Tests cover faculty isolation, editing/deletion, backup validation, unsafe input, storage failure and readiness checks. Manual browser verification is still required for upload/download, printing, responsive layout and cross-browser behavior.

## Next implementation stage

Student authentication, owner-scoped server persistence and media storage; stable public portfolio URLs; a server-side AI integration with usage limits; payments and subscription management. The parent workspace currently requires browser-local prototype state, so these services have not been introduced.
