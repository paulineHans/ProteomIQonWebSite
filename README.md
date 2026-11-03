# ProteomIQon website

This is the Astro-powered documentation site for the ProteomIQon proteomics toolchain.

## Structure

- `src/pages/index.astro` is the landing page with the five entry points.
- `src/pages/guide/[slug].astro` generates the four documentation routes from the `guides` collection.
- `src/pages/tools/index.astro` is the searchable tool directory.
- `src/pages/tools/[slug].astro` generates one detail page for every entry of the `tools` collection.
- `src/layouts/Layout.astro` provides the shared page shell, metadata and styles.
- `src/components/layout` holds the header and footer. `src/components/ui` holds the shared UI pieces such as buttons, cards and headings.
- `src/styles/global.css` is the Tailwind theme with the brand colours and fonts.
- `src/lib/phases.ts` defines the five pipeline stages.
- `src/content/tools/` and `src/content/guides/` hold the page copy as Markdown. Frontmatter (name, stage, order, summary, inputs) is validated by the schemas in `src/content.config.ts`.
- `src/plugins/content-links.mjs` rewrites relative links between those Markdown files (`./peptide-db.md`) to the page routes, including the site base.
- `src/lib/tools.ts` returns the tools sorted by stage and order and builds tool URLs.
- `src/assets/images` holds the images used in content. They are optimized at build time.

## Writing content

- Tool pages are `src/content/tools/<slug>.md`. The file name is the URL, so use lowercase kebab-case.
- Link to other pages with relative `.md` paths, for example `./peptide-db.md`.
- Add images with relative paths into `src/assets/images`.
- A link to a missing page is reported as a `[content-links]` warning in the build output.

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
