# Project Structure

```
├── default.hbs                    # Base layout (HTML shell, header, footer, mobile menu)
├── index.hbs                      # Homepage (hero + post list)
├── post.hbs                       # Single post (default template)
├── page.hbs                       # Static page
├── author.hbs                     # Author archive
├── tag.hbs                        # Tag archive
├── error.hbs                      # Generic error (standalone, no default.hbs)
├── error-404.hbs                  # 404 page (extends default.hbs)
├── custom-full-feature-image.hbs  # Post template: full-width feature image
├── custom-narrow-feature-image.hbs# Post template: narrow feature image
├── custom-no-feature-image.hbs   # Post template: no feature image
│
├── partials/
│   ├── content.hbs                # Article body (header, content, footer, author box)
│   ├── loop.hbs                   # Single post item in feed lists
│   ├── pagination.hbs             # "Load more" button
│   ├── related-posts.hbs          # Related posts section
│   ├── comments.hbs               # Comments section
│   ├── pswp.hbs                   # PhotoSwipe lightbox markup
│   ├── srcset.hbs                 # Responsive image srcset helper
│   └── icons/
│       └── search.hbs             # Search icon SVG
│
├── assets/
│   ├── css/
│   │   ├── screen.css             # PostCSS entry point (imports all below)
│   │   ├── general/               # fonts, basics, buttons, forms, icons
│   │   ├── site/                  # layout, header, cover/hero
│   │   ├── blog/                  # feed, single post, author, tags, comments, nav, related, featured, pagination
│   │   └── misc/                  # utilities, animations, dark mode, error page
│   ├── js/
│   │   └── main.js                # All custom JS (font size, theme toggle, mobile menu, load-more, analytics)
│   ├── fonts/                     # Self-hosted fonts (currently empty — iA Writer Mono removed)
│   └── built/                     # Compiled output (committed, deployed with theme)
│       ├── screen.css
│       ├── screen.css.map
│       ├── main.min.js
│       └── main.min.js.map
│
├── package.json                   # Theme metadata, Ghost config, scripts, dependencies
├── gulpfile.js                    # Build pipeline (CSS, JS, zip)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml            # Supply-chain security settings
└── dist/                          # Packaged theme zip (gitignored output)
```

## Template Hierarchy

Ghost resolves templates in this order:
1. `custom-*.hbs` — user-selectable post templates (set per-post in Ghost admin)
2. `post.hbs` / `page.hbs` — default for posts and pages
3. `tag.hbs` / `author.hbs` — archive pages
4. `index.hbs` — homepage
5. `default.hbs` — base layout wrapping all of the above (except `error.hbs`)

## CSS Organization

`screen.css` imports in this order:
1. `@tryghost/shared-theme-assets` base CSS
2. `general/` — fonts, basics, buttons, forms, icons
3. `site/` — layout, header, cover
4. `blog/` — feed, featured, pagination, single, author, navigation, related, comment, tag
5. `misc/` — utilities, animations, dark mode, error

## Key Conventions

- Route templates live at the project root as `*.hbs` files
- Reusable components go in `partials/`
- Custom post templates are named `custom-{slug}.hbs`
- CSS files map roughly 1:1 to components/sections
- All built output goes to `assets/built/` and is committed
- The `dist/` folder is for zip packaging only and is gitignored
