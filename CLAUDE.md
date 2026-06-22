# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local development

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`. No build step — changes to HTML/CSS/JS are immediately reflected on refresh.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/pages.yml`), which copies all `.html` files, `CNAME`, `.nojekyll`, and `assets/` into a `dist/` folder and deploys to GitHub Pages at **https://jansvaty.com**.

## Architecture

This is a static HTML/CSS/JS site with no framework or build tooling.

- **Pages**: Each case study is its own `.html` file at the root (`index.html`, `about.html`, `contact.html`, `copilot-agent.html`, `copilot-chat.html`, `sharesies-investing-101.html`, `impact-investing-network.html`, `stake-design-system.html`, `customs-resources.html`).
- **Styles**: `assets/site3.css` is the current active stylesheet (site.css and site2.css are legacy versions). CSS variables are defined in `:root` on `site3.css` — all theming goes there.
- **JavaScript**: `assets/site.js` handles the intro overlay animation (once-per-session via `sessionStorage`), mobile nav toggle, and scroll-triggered `.reveal` animations via `IntersectionObserver`.
- **CSS versioning**: All pages reference the stylesheet and JS with a `?v=N` query string for cache busting. When editing `site3.css` or `site.js`, bump the version number in **every** HTML file.
- **Fonts**: DM Sans and DM Serif Display loaded from Google Fonts. Manrope is referenced in the body font-family fallback in `site.css` but DM Sans is the active font in `site3.css`.
- **Intro animation**: The `<script>` inline in each page's `<head>` checks `sessionStorage` and adds `intro-skip` class to `<html>` before CSS loads, preventing a flash of the overlay on return visits.

## Workflow note

After every edit, commit and push to `main` so the live site at jansvaty.com stays in sync.