# found-presentations

Hosted presentation system for Found AI. Static HTML/JS, deployed to GitHub Pages at `content.foundai.cloud`.

## Quick start

```bash
# Serve locally
python3 -m http.server 8080
# open http://localhost:8080

# Scaffold a new presentation
chmod +x scripts/new-presentation.sh
./scripts/new-presentation.sh <slug> [audience] [transition]
# e.g.: ./scripts/new-presentation.sh product-vision investor fade
```

## Keyboard controls (in any presentation)

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `f` | Toggle fullscreen |
| Touch swipe | Navigate |

## Structure

```
found-presentations/
├── index.html                     # Landing page (all presentations)
├── _shared/
│   ├── branding/tokens.css        # Found design tokens (colors, type, spacing)
│   └── engine/
│       ├── slide-engine.js        # Core renderer + navigation
│       ├── templates.js           # All slide templates
│       └── theme-found.css        # Full visual system
└── presentations/
    └── <slug>/
        ├── index.html             # Presentation entry point
        ├── script.json            # Slide content + config
        └── assets/
            ├── videos/            # Drop .mp4 files here
            └── images/            # Drop images here
```

## The agent interface — script.json

Drop a `script.json` in any presentation folder and the engine renders it. Minimal schema:

```json
{
  "meta": {
    "title": "Presentation Title",
    "audience": "design-partner",   // design-partner | investor | internal
    "transition": "fade"            // fade | slide | reveal
  },
  "slides": [
    {
      "id": "unique-id",
      "template": "hero",           // see templates below
      "eyebrow": "Label text",
      "headline": "Main headline",
      "subhead": "Supporting line",
      "video": "assets/videos/demo.mp4",    // optional
      "image": "assets/images/diagram.png"  // optional
    }
  ]
}
```

## Templates

| Template | Use for |
|----------|---------|
| `hero` | Opening/closing dark full-bleed slide |
| `phase-intro` | Phase transition card (dark) |
| `split` | Left text + right video/image |
| `video-full` | Full-bleed video with caption overlay |
| `phases-map` | 4-column phase journey grid |
| `flow` | Horizontal pipeline/flow diagram |
| `principles` | Numbered principle rows with tags |
| `value-prop` | 3-column value grid |
| `cta` | Closing dark slide with steps |
| `default` | Simple headline + body |

## Adding videos

1. Drop `.mp4` into `presentations/<slug>/assets/videos/`
2. Reference in `script.json` as `"video": "assets/videos/filename.mp4"`
3. Videos autoplay muted on slide entry; set `"autoplay": false` to disable

## Deploying

Push to `main` → GitHub Actions auto-deploys to GitHub Pages.

For `content.foundai.cloud`:
1. In repo Settings → Pages → set source to "GitHub Actions"
2. Add CNAME: `content.foundai.cloud` → `found-ai.github.io`
3. In your DNS: `CNAME content foundai.github.io`

## Presenting

- Add `#5` to the URL to jump to slide 5
- Share a specific slide: `content.foundai.cloud/presentations/platform-walkthrough/#3`
- Full screen: press `f`
