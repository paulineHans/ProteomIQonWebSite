# Website rework: remaining plan

This file hands over the rest of the website rework. The content migration is done. The styling, library and polish steps below are still open. Each step lists the files involved and what "done" looks like, so the steps can be picked up one at a time.

## Where things stand

Done on branch `feature/freymaurer-rework`:

- Tailwind CSS v4 is installed (`@tailwindcss/vite`, `@tailwindcss/typography`). The brand palette and fonts live in `src/styles/global.css` as a Tailwind theme (`bg-navy`, `text-steel`, `border-line`, `shadow-offset` and so on).
- The site chrome and the landing page are Astro components: `src/components/layout/` (Brand, SiteHeader, SiteFooter) and `src/components/ui/` (Eyebrow, Button, TextLink, SectionHeading, PageHero, EntryCard, StageFlow, Banner). `src/pages/index.astro` uses only these and Tailwind utilities.
- All page content is Markdown in content collections. `src/content/tools/*.md` holds the 18 tools, `src/content/guides/*.md` the four guide pages. Schemas are in `src/content.config.ts`. The old HTML sources, `src/lib/legacyContent.ts` and `src/data/tools.ts` are gone.
- Pipeline stages are defined once in `src/lib/phases.ts`. Tool frontmatter refers to them by id, and tools are sorted by stage, then by `order` (`src/lib/tools.ts`).
- Links between Markdown files are written as relative `.md` paths (`./psm-statistics.md`, `../guides/installation.md`). `src/plugins/content-links.mjs` turns them into site routes including the base path, so the same links also work in the GitHub file preview.

Still in an in-between state:

- The tools directory, the tool pages and the guide pages still use the legacy stylesheet `src/style.css` for their page chrome (hero, sidebar, pagination, cards). `Layout.astro` loads it after `global.css`. Tailwind's preflight reset now loads first, so these pages do not look exactly like the old site. The Markdown body has a stopgap: the article carries the typography plugin's `prose` class with brand colours set in `global.css`, so headings, lists and tables are readable. Check these pages before merging to `main`, because every push to `main` deploys.
- Because `style.css` is not inside a CSS layer, its element rules (`a`, `p`, `h1`-`h3`) beat Tailwind utilities. The new components work around this with Tailwind's important modifier (`text-navy!`, `tracking-[-.035em]!`). Those `!` suffixes should go once `style.css` is deleted (step 1).

## Things to know about Astro 7 here

- Astro 7 renders Markdown with Sätteri by default. `markdown.remarkPlugins` and `markdown.rehypePlugins` do not work without installing `@astrojs/markdown-remark`. Plugins go into `satteri({ hastPlugins: [...] })` in `astro.config.mjs` instead.
- The content layer caches rendered Markdown and does not notice changes to plugin code. The link plugin's `name` includes a hash of the list of content files, so adding, renaming or deleting a file refreshes the cache. After editing the plugin code itself, bump the version constant in `content-links.mjs` or delete `.astro/` and `node_modules/.astro/`.
- The link plugin reads the list of content files when the config loads. After adding a new `.md` file, restart the dev server.
- A link to a `.md` file that does not exist is logged as a `[content-links]` warning and stays unchanged in the page. It cannot fail the build from inside the plugin: the glob loader catches plugin errors, drops the whole page and still exits successfully. A separate link check over `dist/` in CI would close this gap. Content file names must be lowercase kebab-case, because they become the URLs. A wrong `inputsFrom` entry is only logged as `[ERROR] [content] Invalid content reference` and the build still succeeds, so read the build log after editing frontmatter.
- The tools directory is linked from Markdown as `../tools/` (the folder itself). The plugin maps that to `/tools/`.
- Images referenced from Markdown with a relative path (`../../assets/images/PSM.png`) are optimized automatically. Root-relative paths (`/images/...`) are not.
- Frontmatter images (the contributor portraits in `help.md`) use the `image()` schema helper and must have a real image extension (`.jpg`, not `.jfif`).

## Decisions already made

- Plain Markdown, no MDX, so the content can be edited without knowing Astro.
- Sections are ordinary headings. The old site collapsed every section into an accordion. That was dropped on purpose because it goes against how documentation pages normally behave (searchable with Ctrl+F, linkable headings, readable without JavaScript). Long tool pages get an "On this page" table of contents instead (step 2).
- Tailwind replaces the hand-written token system. More people know Tailwind, and that matters more than keeping the custom tokens.
- No component library such as Webcore or daisyUI. Webcore is built on Sass and would add a second styling system next to Tailwind. The components the site needs are few and live in `src/components/ui/`.

## Remaining steps

Each step should end with a green `npm run build` and a look at the pages in `npx astro dev`.

### 1. Move the remaining pages to Tailwind and delete `style.css`

Files: `src/pages/tools/index.astro`, `src/pages/tools/[slug].astro`, `src/pages/guide/[slug].astro`, `src/layouts/Layout.astro`, `src/style.css`, `src/components/ui/*`.

- Split `Layout.astro` into `BaseLayout.astro` (head, header, footer, theme) plus two page layouts: `DocsLayout.astro` for guides and `ToolLayout.astro` for tool pages. The guide and tool pages then only pass data and `<Content />`.
- Add the missing components for patterns that repeat on these pages: `ToolCard` (directory card), `PhaseBadge` (stage number and label in the stage colour), `ToolSidebar` (tools of the same stage), `Pagination` (previous and next tool), `ContributorList` (help page), `SearchField` (tools directory).
- The Markdown body already uses `prose` (see above). Move that styling into the new layouts and check it against the brand look, in particular tables and images.
- Margins set by utilities on components can lose against the remaining element rules in `style.css` (`h1,h2,h3,h4,p { margin-top: 0 }`, `h1 { margin-bottom: 24px }`). This goes away with `style.css`.
- The tool page puts a second `<main class="tool-detail">` inside the layout's `<main>`. Only one `<main>` is allowed per page, so make the inner one a `<div>` or `<article>` while building `ToolLayout`.
- Delete `src/style.css` and remove the `!` important modifiers from the components.
- Replace the hard-coded "18 tools in the directory" label on the home page with the collection count.
- Move `public/images/PillarsOfCompProt.png` to `src/assets/images/` and render it with `<Image>`.

Done when no page uses a legacy class name and `style.css` no longer exists.

### 2. Table of contents for long pages

Files: `ToolLayout.astro`, `DocsLayout.astro`, a new `src/components/ui/TableOfContents.astro`.

`render(entry)` already returns `headings`. List the `##` and `###` headings in a sticky sidebar on wide screens and as a collapsible block above the content on small screens. Mark the current section while scrolling (IntersectionObserver, about 20 lines of script).

### 3. Code blocks with Expressive Code

`npm install astro-expressive-code` (0.44.x supports Astro 7 and Sätteri). Add `expressiveCode()` to `integrations` before `react()`. It registers its own Sätteri plugin and turns off Astro's built-in highlighting. Pick a light and a dark theme that fit the navy palette and enable the copy button. The site has about 76 code blocks, 61 of them on tool pages, most of them shell commands tagged `sh`.

### 4. Icons, sitemap, search

- `astro-icon` with `@iconify-json/lucide` for the arrows, the search icon and the external-link marker that are now text characters (`↗`, `→`, `⌕`).
- `@astrojs/sitemap`. It needs the final `site` value (see open questions).
- Pagefind (`astro-pagefind`, supports Astro 7) for full-text search across all tool pages. It indexes the built `dist/`, so it replaces the client-side name filter on the tools directory, or sits next to it. Check that results respect the `/ProteomIQonWebSite` base path.

### 5. Pipeline graph

`@xyflow/react` is already a dependency and still unused. Each tool's frontmatter has `inputsFrom`, a list of tools whose output it reads. That is enough to draw the pipeline.

- `src/components/PipelineGraph.tsx`, loaded with `client:visible`. One node per tool, one column per stage (positions computed from `phases` and `order`, no layout library needed), edges from `inputsFrom`, nodes coloured by stage and linking to the tool page.
- The full graph goes on `/tools/`. A small version on each tool page highlights the current tool and its direct neighbours.
- Check `inputsFrom` in the Markdown files first. It was filled from the links in each tool's "Comes from" column and may be incomplete where the old text named a tool without linking it.

### 6. Polish

Keep the existing look and add motion sparingly. Everything respects `prefers-reduced-motion`.

- View transitions: `<ClientRouter />` from `astro:transitions` in `BaseLayout`. Give the tool name on cards and in the tool page header the same `transition:name` so it moves between the pages. Scripts that bind events must rerun on `astro:page-load`.
- Dark mode: the dark colour values already exist in `global.css` under `[data-theme="dark"]`, but only for the semantic colours (`paper`, `surface`, `surface-muted`, `ink`, `muted`, `line`). The components still use the fixed brand colours for text (`text-navy`, `text-steel`, `bg-navy`), and `Banner` uses hex values. Switch those to the semantic colours first, or navy text ends up on a navy background. Then add a toggle in the header, store the choice in `localStorage`, and set `data-theme` before first paint (inline script in `<head>`, and again on `astro:after-swap`).
- Stage colour per tool page: set a `--phase` CSS variable from the tool's stage and use it for the eyebrow dot, the active sidebar item and link underlines.
- Landing page: small "data packets" travelling along the stage flow arrows (CSS animation), and an SVG spectrum line drawn in with a stroke animation behind the hero.
- Scroll reveals for cards and sections with CSS `animation-timeline: view()`, no JavaScript.
- Hover: the offset shadow on cards and buttons moves a few pixels on hover, as the primary button already does.

## Content follow-ups

These were kept as they were during the migration, so the text matches the old site. They need someone who knows the tools:

- Typos: "Installtion" in two guide headings, "Comparision", "choosen", "Protein Infrence" (image alt text in `protein-inference.md` and `psm-statistics.md`). In `psm-statistics.md` the alt text is also wrong, because that image shows semi-supervised scoring.
- The PSM tool page has a step called "How does PeptideDB work?", which looks like a copy-paste leftover.
- `ratio-lfq.md` ends a sentence with "of each run." and seems to be missing text before it.
- `add-deduced-peptides.md` had placeholder links (`/your-link/`). They now point to Alignment-Based Quantification and Protein Inference. Please confirm.
- The tool on `join-quant-with-peptide-ions.md` is called JoinQuantPepIonsWithProteins in its own heading and NuGet package (`ProteomIQon.JoinQuantPepIonsWithProteins`), but its display name is JoinQuantWithPepIons. Decide which name the site shows.
- Several display names differ from the tool names used in the commands and packages (for example "MSFragger to PSM", "Quant-Based Alignment"). They come from the old `src/data/tools.ts`. Decide on one naming style.
- Some tool summaries in the frontmatter were written during the migration because the page had no usable first sentence: join-quant-with-peptide-ions, psm-statistics, label-free-protein-quantification, ratio-lfq, alignment-based-quantification. Please check them.

## Open questions

- `site` in `astro.config.mjs` is `https://paulineHans.github.io`. Does it stay there or move to the CSBiology organisation? The sitemap and canonical URLs depend on it.

> For now. Will be moved to CSBiology at some point

- Should the "construction site" banner on the home page stay?

> For now. remove when finished
