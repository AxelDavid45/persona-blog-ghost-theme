# Product Overview

**Cuaderno** is a custom Ghost theme for a personal blog. It's a warm, editorial-style theme with a cinematic single-column layout.

- Built for Ghost >= 5.0.0
- Based on the [Dawn](https://github.com/TryGhost/Dawn) theme by Ghost Foundation
- All UI text is in **Spanish** — buttons, labels, navigation, dates, CTAs, ARIA labels
- Licensed under MIT

## Key Features

- Light, dark, and auto color schemes (CSS custom properties)
- Three selectable post templates: full / narrow / no feature image
- Configurable toggles: reading time, author, date, related posts, comments
- Two feed layouts: standard list and compact list
- Font size controls (A−/A+) persisted in localStorage
- Manual theme toggle persisted in localStorage
- "Load more" pagination via fetch (no full page reload)
- Reading analytics integration with Plausible (scroll depth, time on page)
- Responsive images with avif/webp/fallback via `<picture>` elements

## Design System

- **Palette**: warm editorial — `--cream`, `--ink`, `--terracotta`, `--gold`, `--muted`
- **Typography**: Lora (titles), Source Sans 3 (body, Google Fonts), IBM Plex Mono (meta/code)
- **CSS class prefix**: `c-` (e.g., `c-header`, `c-article`, `c-btn`)

## Important Conventions

- All user-facing strings must be in Spanish
- New UI text should match the warm, editorial tone of existing copy
