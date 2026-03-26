# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom Ghost theme based on **Dawn** (by Ghost Foundation). It's a Handlebars-based theme for Ghost >= 5.0.0, with styles compiled via Gulp/PostCSS.

## Commands

```bash
yarn              # Install dependencies
yarn dev          # Build assets + watch for changes + livereload
yarn test         # Run gscan theme validation
yarn zip          # Build and package theme into dist/dawn.zip for upload
```

## Build Pipeline

Gulp handles the build (`gulpfile.js`):
- **CSS**: `assets/css/screen.css` is the entry point — uses PostCSS with `postcss-easy-import`, autoprefixer, and cssnano. Output goes to `assets/built/`.
- **JS**: Concatenates shared theme assets (`@tryghost/shared-theme-assets`), `assets/js/lib/*.js`, and `assets/js/main.js` into `assets/built/main.min.js` (uglified).
- **HBS**: Handlebars templates are livereloaded on change but not compiled by Gulp — Ghost handles rendering.

## Architecture

- **Templates**: Top-level `.hbs` files are Ghost route templates (`index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`). `default.hbs` is the base layout. `custom-*.hbs` are selectable post templates.
- **Partials**: `partials/` contains reusable Handlebars components (loop, pagination, featured posts, related posts, comments, etc.).
- **CSS structure**: `assets/css/screen.css` imports everything — organized into `general/` (fonts, basics, buttons, forms, icons), `site/` (layout, header, cover), `blog/` (feed, single post, author, tags, comments, navigation), `misc/` (utilities, animations, dark mode, owl carousel).
- **Theme config**: `package.json` `config` section defines Ghost-specific settings (posts per page, image sizes, custom design settings like navigation layout, fonts, color scheme).
