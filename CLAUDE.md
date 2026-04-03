# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Cuaderno**, a custom Ghost theme for Axel Espinosa's personal blog. It's a warm, editorial-style Handlebars theme with cinematic single-column layout, all UI in Spanish. Built for Ghost >= 5.0.0 with Gulp/PostCSS.

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Build assets + watch for changes + livereload
pnpm test                 # Run gscan theme validation
pnpm zip                  # Build and package theme into dist/cuaderno.zip for upload
pnpm version:patch        # Bump patch version (0.0.x)
pnpm version:minor        # Bump minor version (0.x.0)
pnpm version:major        # Bump major version (x.0.0)
```

## Build Pipeline

Gulp handles the build (`gulpfile.js`):

- **CSS**: `assets/css/screen.css` is the entry point — uses PostCSS with `postcss-easy-import`, autoprefixer, and cssnano. Output goes to `assets/built/`.
- **JS**: Concatenates shared theme assets (`@tryghost/shared-theme-assets`) and `assets/js/main.js` into `assets/built/main.min.js` (uglified). No jQuery — all vanilla JS.
- **HBS**: Handlebars templates are livereloaded on change but not compiled by Gulp — Ghost handles rendering.

## Architecture

- **Templates**: Top-level `.hbs` files are Ghost route templates (`index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`). `default.hbs` is the base layout. `custom-*.hbs` are selectable post templates (full/narrow/no feature image).
- **Partials**: `partials/` contains reusable Handlebars components (loop, pagination, featured posts, related posts, comments, cover/hero, article content).
- **CSS structure**: `assets/css/screen.css` imports everything — organized into `general/` (fonts, basics, buttons, forms, icons), `site/` (layout, header, cover/hero), `blog/` (feed, single post, author, tags, comments, navigation, related, featured, pagination), `misc/` (utilities, animations, dark mode).
- **Design system**: Warm editorial palette using CSS custom properties (`--cream`, `--ink`, `--terracotta`, `--gold`, `--muted`). Typography: Playfair Display (titles), Source Sans 3 (body via Google Fonts), iA Writer Mono (meta/code, self-hosted in `assets/fonts/`).
- **Theme config**: `package.json` `config` section defines Ghost-specific settings (posts per page, image sizes, custom design settings: color scheme, featured posts, author display, related posts).
- **All UI text is in Spanish** — buttons, labels, navigation, dates, CTAs.
