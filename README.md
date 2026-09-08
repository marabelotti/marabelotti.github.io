# marabelotti.github.io

Personal site — home, a blog, a travel gallery, and past maths research.

Built with [Analog](https://analogjs.org) (Angular + Vite), prerendered to static
HTML and deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # -> dist/analog/public  (fully static)
npm run preview    # serve the built output
```

`npm run build` prerenders every route to static HTML, writes `sitemap.xml`, and
copies the not-found page to `404.html` (what GitHub Pages serves for unknown
paths).

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages. One-time setup: repo **Settings → Pages → Source =
GitHub Actions**.

## Writing a blog post

Add a Markdown file at `src/content/<slug>.md`:

```md
---
kind: post
title: The title
slug: the-title            # must match the filename
date: 2026-03-01           # ISO; posts are sorted by this
description: One line for listings and social cards.
tags: [maths, misc]        # optional
draft: false               # true = hidden from the site and the build
---

Body in Markdown.
```

It appears at `/blog/the-title`.

## Adding a trip

A trip is **one Markdown file plus a photo folder**:

- text: `src/content/<slug>.md`
- photos: `src/content/travels/<slug>/` — JPEGs, long edge ≈ 2400px, named so
  they sort the way you want (`01-…`, `02-…`). Stored with **Git LFS** (see
  `.gitattributes`); run `git lfs install` once on a new machine.

`src/content/<slug>.md`:

```md
---
kind: trip
title: Trip name
slug: trip-name            # must match the filename
date: 2025-06-10           # start date
dateEnd: 2025-06-18        # optional
place: Region, Country
summary: One or two lines. Shown when there's no intro text.
cover: 03-evening          # filename (no extension) of the cover photo
order: 2                   # optional manual ordering; else newest first
draft: false
captions:                  # optional, keyed by filename without extension
  03-evening: Golden hour over the bay.
---

Optional Markdown intro shown above the photo grid.
```

The build turns each photo into a responsive WebP `srcset` via `vite-imagetools`.
The Markdown file sits at the top level of `src/content/` (not under `travels/`)
so its route doesn't clash with the `/travels/:slug` page.

## Editing research / bio

- Bio: `src/app/pages/index.page.ts`
- Publications and figure cards: `src/app/pages/research.page.ts`
- CV: replace `public/CV.pdf`

## Design

Tokens (colours, type scale, spacing) live in `src/styles.css`. Light/dark are
both defined there; the toggle in the header cycles system → light → dark and
persists the choice. The drifting maths figures behind the home hero are
`src/app/components/math-figures.ts` (disabled under `prefers-reduced-motion`).
