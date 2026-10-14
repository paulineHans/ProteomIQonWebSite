# ProteomIQon website

This is the Astro-powered documentation site for the ProteomIQon proteomics toolchain.

## Structure

- `src/pages/index.astro` is the landing page with the five entry points.
- `src/pages/guide/` contains the four documentation routes.
- `src/pages/tools/index.astro` is the searchable tool directory.
- `src/pages/tools/[slug].astro` generates one detail page for every tool in `src/data/tools.ts`.
- `src/layouts/Layout.astro` provides the shared header, navigation, metadata and footer.
- `src/singleFields/` remains the source material for the existing page copy. `src/lib/legacyContent.ts` extracts that copy into the Astro layout while the content is migrated.

## Commands

Run from the repository root:

```sh
npm install
astro dev --background
astro dev status
astro dev logs
astro dev stop
npm run build
npm run preview
```

The production build is written to `dist/`.
