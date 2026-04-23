# Tech Stack & Build System

## Core Technologies

| Layer      | Technology                                                    |
|------------|---------------------------------------------------------------|
| Platform   | [Ghost](https://ghost.org) >= 5.0.0                          |
| Templating | Handlebars (`.hbs`) — rendered by Ghost, not compiled by Gulp |
| CSS        | PostCSS (postcss-easy-import, autoprefixer, cssnano)          |
| JS         | Vanilla ES5 (no jQuery, no modules, IIFE pattern)             |
| Build      | Gulp 5                                                        |
| Package    | pnpm (v10+, strict supply-chain settings)                     |
| Linting    | gscan (Ghost theme validator)                                 |
| Git hooks  | Husky — pre-commit auto-bumps patch version                   |

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Build + watch + livereload (long-running)
pnpm test                 # Theme validation via gscan
pnpm zip                  # Build and package into dist/cuaderno.zip
pnpm version:patch        # Manual patch bump (0.0.x)
pnpm version:minor        # Manual minor bump (0.x.0)
pnpm version:major        # Manual major bump (x.0.0)
```

## Build Pipeline (gulpfile.js)

- **CSS**: `assets/css/screen.css` → PostCSS (easy-import, autoprefixer, cssnano) → `assets/built/screen.css`
- **JS**: `@tryghost/shared-theme-assets` v1 libs + `assets/js/main.js` → concat + uglify → `assets/built/main.min.js`
- **HBS**: Livereloaded on change, not compiled (Ghost handles rendering)
- **Zip**: Packages everything (excluding `node_modules/` and `dist/`) into `dist/cuaderno.zip`

## Versioning

- Pre-commit hook auto-bumps patch version unless `package.json` version was already changed in the staged files
- Theme follows semver

## Key Dependencies

- `@tryghost/shared-theme-assets` — Ghost's shared JS/CSS base (v1 API)
- `gscan` — Ghost theme validation tool
- External CDN: Prism.js for syntax highlighting (loaded on post/page templates only)
- External CDN: Google Fonts (Lora, Source Sans 3, IBM Plex Mono)

## Code Style Rules

- JavaScript: ES5 strict mode, IIFE wrapper, `var` declarations, no arrow functions
- CSS: Use PostCSS imports, not Sass. All custom properties defined at `:root`
- Handlebars: Use Ghost helpers (`{{#is}}`, `{{#match}}`, `{{#get}}`, `{{#foreach}}`)
- All classes use the `c-` prefix (e.g., `c-header`, `c-article-title`, `c-btn-ghost`)
- Built assets in `assets/built/` are committed to the repo (Ghost themes are deployed as zip files)
