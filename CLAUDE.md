# found-presentations — Claude Code Instructions

This repo is a static HTML/JS presentation system for Found AI.
Presentations live in `presentations/<slug>/`, each with a `script.json` (content)
and `index.html` (entry point). The engine, templates, and theme live in `_shared/`.

## Architecture

```
_shared/
  branding/tokens.css       — Design tokens (colors, type, spacing)
  engine/slide-engine.js    — Navigation, transitions, animation
  engine/templates.js       — All slide templates (functions: slide → HTML)
  engine/theme-found.css    — Full CSS for every template

presentations/<slug>/
  script.json               — THE spec. All content lives here.
  index.html                — Thin shell. Load order: tokens → theme → templates → engine
  assets/videos/            — Drop .mp4 here, reference as "assets/videos/name.mp4"
  assets/images/            — Drop images here
```

## The three agents

Use these slash commands or invoke by name:

| Agent | Command | Purpose |
|-------|---------|---------|
| Edit  | `/edit-presentation` | Visual editing loop on an existing presentation |
| Create | `/create-presentation` | Scaffold a new presentation from scratch |
| Review | `/review-presentation` | QA pass — render issues, content gaps, flow |

## Key rules

- **All content changes go in `script.json` only.** Never hardcode content into `index.html`.
- **Template changes go in `_shared/engine/templates.js`.** One function per template.
- **CSS changes go in `_shared/engine/theme-found.css`.** Scoped by template class.
- **Never break the engine API** (`FoundEngine`, `FoundTemplates` globals).
- After any change to `_shared/`, all presentations are affected — test `platform-walkthrough` as the reference.
- Videos: `null` = placeholder state (styled, non-broken). Don't remove video fields, just leave null.

## Available templates

hero · phase-intro · split · video-full · phases-map · flow · principles · value-prop · cta · default

## Design tokens (key values)

- bg: `#F0EDE6` (parchment), dark: `#1A1A18`, green: `#7DB896`
- fonts: DM Serif Display (headlines) · DM Sans (body) · DM Mono (labels/tags)
- All tokens in `_shared/branding/tokens.css`

## Local dev

```bash
python3 -m http.server 8080
# open http://localhost:8080/presentations/platform-walkthrough/
```
