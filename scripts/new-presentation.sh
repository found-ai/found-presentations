#!/bin/bash
# ============================================================
# Found Presentations — New Presentation Scaffolder
# Usage: ./scripts/new-presentation.sh <slug> [audience] [transition]
#
# Example:
#   ./scripts/new-presentation.sh product-vision investor fade
# ============================================================

set -e

SLUG="${1:-new-presentation}"
AUDIENCE="${2:-design-partner}"
TRANSITION="${3:-fade}"
DATE=$(date +%Y-%m-%d)

DIR="presentations/$SLUG"

if [ -d "$DIR" ]; then
  echo "❌  $DIR already exists. Choose a different slug."
  exit 1
fi

mkdir -p "$DIR/assets/videos"
mkdir -p "$DIR/assets/images"

# script.json
cat > "$DIR/script.json" << EOF
{
  "meta": {
    "title": "$(echo $SLUG | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')",
    "audience": "$AUDIENCE",
    "style": "cinematic",
    "transition": "$TRANSITION",
    "date": "$DATE"
  },
  "slides": [
    {
      "id": "cover",
      "template": "hero",
      "eyebrow": "Found AI",
      "headline": "Your headline here.",
      "subhead": "Your subhead here.",
      "badge": "$DATE"
    },
    {
      "id": "slide-2",
      "template": "default",
      "eyebrow": "Section",
      "headline": "Slide two",
      "body": "Your content here."
    },
    {
      "id": "cta",
      "template": "cta",
      "eyebrow": "What comes next",
      "headline": "Your closing statement.",
      "subhead": "Supporting line.",
      "url": "content.foundai.cloud"
    }
  ]
}
EOF

# index.html
cat > "$DIR/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Found AI — $(echo $SLUG | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../_shared/branding/tokens.css">
  <link rel="stylesheet" href="../../_shared/engine/theme-found.css">
</head>
<body>
  <div id="deck"></div>
  <script src="../../_shared/engine/templates.js"></script>
  <script src="../../_shared/engine/slide-engine.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      const engine = new FoundEngine();
      await engine.load('./script.json');
      engine.mount('deck');
    });
  </script>
</body>
</html>
EOF

echo "✅  Scaffolded: $DIR"
echo ""
echo "   Edit script:  $DIR/script.json"
echo "   Drop videos:  $DIR/assets/videos/"
echo "   Drop images:  $DIR/assets/images/"
echo "   Open locally: open $DIR/index.html  (or run: python3 -m http.server 8080)"
echo ""
echo "   Templates available:"
echo "     hero · phase-intro · split · video-full · phases-map"
echo "     flow · principles · value-prop · cta · default"
