# Cuaderno

A warm, editorial Ghost theme — cinematic single-column layout, Spanish-first UI. Built for [Ghost](https://ghost.org) >= 5.0.0.

## Features

- Warm editorial palette with CSS custom properties (`--cream`, `--ink`, `--terracotta`, `--gold`)
- Light, dark, and auto color schemes
- Selectable post templates (full / narrow / no feature image)
- Reading time, related posts, and comments toggles
- Self-hosted iA Writer Mono for code blocks and meta
- Fully localized in Spanish

## Development

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```bash
pnpm install              # Install dependencies
pnpm dev                  # Build + watch + livereload
pnpm test                 # Theme validation (gscan)
pnpm zip                  # Package into dist/cuaderno.zip
```

### Versioning

The theme follows [semver](https://semver.org/). A pre-commit hook bumps the patch version automatically on every commit. For manual bumps:

```bash
pnpm version:patch        # 0.0.x
pnpm version:minor        # 0.x.0
pnpm version:major        # x.0.0
```

### Supply chain security

Managed with pnpm v10+ and configured in `pnpm-workspace.yaml`:

- No packages are allowed to run install scripts
- Transitive dependencies cannot use git repos or tarball URLs
- New packages must be published for at least 3 days before installation

## Project structure

```text
*.hbs                     # Ghost route templates
partials/                 # Reusable Handlebars components
assets/
  css/
    screen.css            # PostCSS entry point
    general/              # Fonts, basics, buttons, forms, icons
    site/                 # Layout, header, cover/hero
    blog/                 # Feed, post, author, tags, comments
    misc/                 # Utilities, animations, dark mode
  js/
    main.js               # Vanilla JS (no jQuery)
  fonts/                  # Self-hosted iA Writer Mono
```

## License

[MIT](LICENSE) — based on [Dawn](https://github.com/TryGhost/Dawn) by Ghost Foundation.
