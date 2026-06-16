/**
 * Found Presentations — Slide Templates
 * Each template is a function: (slide) => HTML string
 * Templates use CSS classes defined in theme-found.css
 */

window.FoundTemplates = {

  // ── hero ─────────────────────────────────────────────
  // Full-bleed dark slide. Opening statement. No video.
  hero(s) {
    return `
      <div class="slide-hero">
        <div class="slide-hero-content">
          ${s.eyebrow ? `<div class="eyebrow" data-animate>${s.eyebrow}</div>` : ''}
          <h1 class="hero-headline" data-animate>${s.headline}</h1>
          ${s.subhead ? `<p class="hero-subhead" data-animate>${s.subhead}</p>` : ''}
          ${s.note ? `<p class="hero-note" data-animate>${s.note}</p>` : ''}
        </div>
        ${s.badge ? `<div class="slide-badge" data-animate>${s.badge}</div>` : ''}
      </div>
    `;
  },

  // ── phase-intro ──────────────────────────────────────
  // Dark card + phase label. Transition between phases.
  'phase-intro'(s) {
    return `
      <div class="slide-phase-intro">
        <div class="phase-label" data-animate>${s.phase_label || ''}</div>
        <div class="phase-card" data-animate>
          <div class="phase-number">${s.phase_number || ''}</div>
          <h2 class="phase-title">${s.headline}</h2>
          <div class="phase-verb">${s.verb || ''}</div>
        </div>
        ${s.body ? `<p class="phase-body" data-animate>${s.body}</p>` : ''}
        <div class="phase-stack-row" data-animate>
          ${(s.layers || []).map(l => `<div class="layer-chip layer-chip--${l.id}">${l.label}</div>`).join('')}
        </div>
      </div>
    `;
  },

  // ── split ────────────────────────────────────────────
  // Left text, right visual/content. Light bg.
  split(s) {
    return `
      <div class="slide-split">
        <div class="split-left">
          ${s.eyebrow ? `<div class="eyebrow" data-animate>${s.eyebrow}</div>` : ''}
          <h2 class="split-headline" data-animate>${s.headline}</h2>
          ${s.body ? `<p class="split-body" data-animate>${s.body}</p>` : ''}
          ${(s.bullets || []).length ? `
            <ul class="split-bullets" data-animate>
              ${s.bullets.map(b => `<li><span class="bullet-dot"></span>${b}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        <div class="split-right" data-animate>
          ${s.video ? `
            <div class="video-container">
              <video src="${s.video}" ${s.autoplay !== false ? 'autoplay' : ''} muted playsinline loop controls></video>
            </div>
          ` : ''}
          ${s.image ? `<img src="${s.image}" alt="${s.headline}" class="split-image">` : ''}
          ${s.diagram ? `<div class="split-diagram">${s.diagram}</div>` : ''}
        </div>
      </div>
    `;
  },

  // ── video-full ───────────────────────────────────────
  // Full-bleed video with overlay caption bar.
  'video-full'(s) {
    return `
      <div class="slide-video-full">
        ${s.video ? `
          <video class="video-bg" src="${s.video}" ${s.autoplay !== false ? 'autoplay' : ''} muted playsinline loop></video>
        ` : `
          <div class="video-placeholder">
            <div class="video-placeholder-icon">▶</div>
            <div class="video-placeholder-label">${s.video_label || 'Video: ' + (s.headline || '')}</div>
          </div>
        `}
        <div class="video-overlay">
          ${s.eyebrow ? `<div class="eyebrow eyebrow--inverse">${s.eyebrow}</div>` : ''}
          <h2 class="video-headline">${s.headline || ''}</h2>
          ${s.caption ? `<p class="video-caption">${s.caption}</p>` : ''}
        </div>
      </div>
    `;
  },

  // ── phases-map ───────────────────────────────────────
  // The four-phase journey overview. Renders from phases array.
  'phases-map'(s) {
    const phases = s.phases || [];
    return `
      <div class="slide-phases-map">
        <div class="phases-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="phases-title">${s.headline}</h2>
          ${s.subhead ? `<p class="phases-subhead">${s.subhead}</p>` : ''}
        </div>
        <div class="phases-grid" data-animate>
          ${phases.map((p, i) => `
            <div class="phase-col ${p.active ? 'phase-col--active' : 'phase-col--future'}">
              <div class="phase-col-header">
                <div class="phase-col-number">${p.number || `0${i+1}`}</div>
                <div class="phase-col-name">${p.name}</div>
                <div class="phase-col-verb">${p.verb || ''}</div>
              </div>
              <div class="phase-col-rows">
                ${(p.rows || []).map(r => `
                  <div class="phase-row-cell">
                    <div class="phase-row-label">${r.label}</div>
                    <div class="phase-row-value">${r.value}</div>
                  </div>
                `).join('')}
              </div>
              ${p.stack ? `<div class="phase-col-stack">${p.stack}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ${s.footnote ? `<p class="phases-footnote" data-animate>${s.footnote}</p>` : ''}
      </div>
    `;
  },

  // ── flow ─────────────────────────────────────────────
  // Horizontal pipeline flow diagram. Renders nodes + arrows.
  flow(s) {
    const nodes = s.nodes || [];
    return `
      <div class="slide-flow">
        <div class="flow-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="flow-headline">${s.headline}</h2>
        </div>
        <div class="flow-pipeline" data-animate>
          ${nodes.map((n, i) => `
            <div class="flow-node flow-node--${n.style || 'default'}">
              ${n.label ? `<div class="flow-node-label">${n.label}</div>` : ''}
              <div class="flow-node-title">${n.title}</div>
              ${n.sub ? `<div class="flow-node-sub">${n.sub}</div>` : ''}
            </div>
            ${i < nodes.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
          `).join('')}
        </div>
        ${s.note ? `<p class="flow-note" data-animate>${s.note}</p>` : ''}
        ${s.callout ? `<div class="flow-callout" data-animate>${s.callout}</div>` : ''}
      </div>
    `;
  },

  // ── principles ───────────────────────────────────────
  // Numbered principle rows. Left label, center description, right tags.
  principles(s) {
    const items = s.items || [];
    return `
      <div class="slide-principles">
        <div class="principles-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="principles-headline">${s.headline}</h2>
        </div>
        <div class="principles-list">
          ${items.map((item, i) => `
            <div class="principle-row" data-animate style="animation-delay: ${i * 60}ms">
              <div class="principle-label">
                <div class="principle-num">0${i+1}</div>
                <div class="principle-name">${item.name}</div>
              </div>
              <div class="principle-body">${item.body}</div>
              <div class="principle-tags">
                ${(item.tags || []).map(t => `<span class="ptag ptag--${t.style || 'default'}">${t.label}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ── value-prop ───────────────────────────────────────
  // Three-column value proposition. Used for customer / we-build / stack rows.
  'value-prop'(s) {
    const cols = s.columns || [];
    return `
      <div class="slide-value-prop">
        <div class="vp-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="vp-headline">${s.headline}</h2>
          ${s.subhead ? `<p class="vp-subhead">${s.subhead}</p>` : ''}
        </div>
        <div class="vp-grid" data-animate>
          ${cols.map(c => `
            <div class="vp-col">
              <div class="vp-col-title">${c.title}</div>
              <div class="vp-col-body">${c.body}</div>
              ${c.sub ? `<div class="vp-col-sub">${c.sub}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ── cta ──────────────────────────────────────────────
  // Closing dark slide. Next step / call to action.
  cta(s) {
    return `
      <div class="slide-cta">
        <div class="cta-inner">
          ${s.eyebrow ? `<div class="eyebrow eyebrow--green" data-animate>${s.eyebrow}</div>` : ''}
          <h2 class="cta-headline" data-animate>${s.headline}</h2>
          ${s.subhead ? `<p class="cta-subhead" data-animate>${s.subhead}</p>` : ''}
          ${(s.steps || []).length ? `
            <div class="cta-steps" data-animate>
              ${s.steps.map((st, i) => `
                <div class="cta-step">
                  <div class="cta-step-num">0${i+1}</div>
                  <div class="cta-step-label">${st}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${s.url ? `<div class="cta-url" data-animate>${s.url}</div>` : ''}
        </div>
      </div>
    `;
  },

  // ── default ──────────────────────────────────────────
  default(s) {
    return `
      <div class="slide-default">
        ${s.eyebrow ? `<div class="eyebrow" data-animate>${s.eyebrow}</div>` : ''}
        <h2 class="default-headline" data-animate>${s.headline || ''}</h2>
        ${s.body ? `<p class="default-body" data-animate>${s.body}</p>` : ''}
      </div>
    `;
  }

};
