/**
 * Found Presentations — Slide Templates
 * Each template is a function: (slide) => HTML string
 * Templates use CSS classes defined in theme-found.css
 */

// Journey rail — a compact echo of the wedge bar chart used as a "you are here"
// motif on phase-intro slides. The active phase's bars light up; the rest dim,
// and any ghost (future) phase renders as a dashed outline.
function phaseJourneyRail(j) {
  const steps = j.steps || [];
  const total = steps.reduce((n, st) => n + (st.bars || 1), 0);
  const minH = 24, maxH = 100;
  let idx = 0;
  const groups = steps.map((st, gi) => {
    const active = gi === j.active;
    const state = active ? 'is-active' : (st.ghost ? 'is-ghost' : 'is-dim');
    let bars = '';
    for (let k = 0; k < (st.bars || 1); k++) {
      const h = total > 1 ? minH + (maxH - minH) * (idx / (total - 1)) : maxH;
      idx++;
      bars += `<span class="pj-bar ${state}" style="height:${h.toFixed(1)}%"></span>`;
    }
    return `
      <div class="pj-group ${state}" style="flex:${st.bars || 1}">
        <div class="pj-bars">${bars}</div>
        <div class="pj-label">${st.phase}</div>
      </div>`;
  }).join('');
  return `
    <div class="phase-journey" data-animate>
      ${j.caption ? `<div class="phase-journey-cap">${j.caption}</div>` : ''}
      <div class="phase-journey-track">${groups}</div>
    </div>`;
}

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
        ${(s.layers || []).length ? `
        <div class="phase-stack-row" data-animate>
          ${s.layers.map(l => `<div class="layer-chip layer-chip--${l.id}">${l.label}</div>`).join('')}
        </div>` : ''}
        ${s.journey ? phaseJourneyRail(s.journey) : ''}
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

  // ── wedge ────────────────────────────────────────────
  // Merged journey + wedge. Stepped ascending bar chart across phases,
  // with lime value-markers, plus a per-phase customer axis underneath.
  // bars[]{n,title,height,ghost} · markers[]{title,after,end,height}
  // phases[]{number,name,verb,span,ghost,you,get,platform}
  wedge(s) {
    const bars = s.bars || [];
    const markers = s.markers || [];
    // build the plot as bars interleaved with markers (marker.after = index of bar it follows)
    const cells = [];
    bars.forEach((b, i) => {
      cells.push(`
        <div class="wedge-bar ${b.ghost ? 'wedge-bar--ghost' : 'wedge-bar--solid'}" style="height:${b.height}%">
          <span class="wedge-bar-n">${b.n || ''}</span>
          <span class="wedge-bar-t">${b.title}</span>
        </div>`);
      const m = markers.find(mk => mk.after === i);
      if (m) cells.push(`
        <div class="wedge-marker ${m.end ? 'wedge-marker--end' : ''}" style="height:${m.height || 90}%">
          <span class="wedge-marker-label">${m.title}</span>
          <span class="wedge-marker-cap"></span>
          <span class="wedge-marker-line"></span>
        </div>`);
    });
    return `
      <div class="slide-wedge">
        <div class="wedge-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="wedge-headline">${s.headline}</h2>
        </div>
        <div class="wedge-plot" data-animate>${cells.join('')}</div>
        <div class="wedge-axis" data-animate>
          ${(s.phases || []).map(p => `
            <div class="wedge-pgrp ${p.ghost ? 'wedge-pgrp--ghost' : ''}" style="flex:${p.span || 2}">
              <div class="wedge-phead">
                <span class="wedge-pn">${p.number || ''}</span>
                <span class="wedge-pl">${p.name}${p.verb ? ` <span class="wedge-dim">· ${p.verb}</span>` : ''}</span>
              </div>
              <div class="wedge-prows">
                ${p.you ? `
                  <div class="wedge-prow">
                    <span class="wedge-prow-k">You</span>
                    <span class="wedge-prow-v">${p.you}</span>
                  </div>` : ''}
                ${p.get ? `
                  <div class="wedge-prow wedge-prow--get">
                    <span class="wedge-prow-k">What you get</span>
                    <span class="wedge-prow-v">${p.get}</span>
                  </div>` : ''}
              </div>
              ${p.platform ? `<div class="wedge-ptag">${p.platform}</div>` : ''}
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ── image-sequence ───────────────────────────────────
  // Cross-fade loop through a set of frames. frames[]{src,label} · interval (ms)
  'image-sequence'(s) {
    const frames = s.frames || [];
    return `
      <div class="slide-image-sequence" data-imgseq data-interval="${s.interval || 3200}">
        <div class="imgseq-stage" data-animate>
          ${frames.map((f, i) => `
            <figure class="imgseq-frame ${i === 0 ? 'is-active' : ''}" data-frame="${i}">
              <img src="${f.src}" alt="${f.label || ''}" loading="${i === 0 ? 'eager' : 'lazy'}">
            </figure>`).join('')}
          ${frames.length > 1 ? `<div class="imgseq-dots">
            ${frames.map((f, i) => `<span class="imgseq-dot ${i === 0 ? 'is-active' : ''}" data-dot="${i}"></span>`).join('')}
          </div>` : ''}
        </div>
        <div class="imgseq-overlay">
          ${s.eyebrow ? `<div class="eyebrow eyebrow--inverse" data-animate>${s.eyebrow}</div>` : ''}
          ${s.headline ? `<h2 class="imgseq-headline" data-animate>${s.headline}</h2>` : ''}
          ${s.caption ? `<p class="imgseq-caption" data-animate>${s.caption}</p>` : ''}
          ${frames.length > 1 && frames.some(f => f.label) ? `<div class="imgseq-frame-label" data-animate><span data-frame-label="0">${frames[0].label || ''}</span></div>` : ''}
        </div>
      </div>
    `;
  },

  // ── layers ───────────────────────────────────────────
  // Three-layers-one-engine stack. Icons inlined by key; content lives in slide object.
  // s.toolset.phases[]{pn,pt,ghost,tools[]{nm,ico,ghost}} · s.arch[]{nm,ico} · s.arch_meta{}
  // s.engine{number,name,note,sub[]{nm,ico},prims_label,prims[]{nm,ico},caption} · s.flows[2]
  layers(s) {
    const ICONS = {
      mine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="12" r="2.4"/><path d="M8.2 7.2l7.5 3.6M8.2 16.8l7.5-3.6"/></svg>',
      plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 3.5v5M13.5 3.5v5M8.5 8.5h7v2a3.5 3.5 0 0 1-7 0z"/><path d="M12 14v3.5"/><path d="M9 20.5h6"/></svg>',
      onto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3.5" y="16" width="6" height="4" rx="1"/><rect x="14.5" y="16" width="6" height="4" rx="1"/><path d="M12 7v4M12 11H6.5v5M12 11h6v5"/></svg>',
      bench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><rect x="5" y="12" width="3" height="8"/><rect x="10.5" y="8" width="3" height="12"/><rect x="16" y="14" width="3" height="6"/><path d="M5 6.5a6 6 0 0 1 6-3"/><path d="M11 3.5l-1.6 1M11 3.5l-1 1.8"/></svg>',
      loop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14-4.5M4 13a8 8 0 0 0 14 4.5"/><path d="M6 3.5V7H9.5M18 20.5V17h-3.5"/></svg>',
      list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1.3 1.3L7.5 4.2M4 11.5l1.3 1.3L7.5 10.2M4 17.5l1.3 1.3L7.5 16.2"/></svg>',
      inf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9a3 3 0 1 0 0 6c2 0 3-1.5 5-3s3-3 5-3a3 3 0 1 1 0 6c-2 0-3-1.5-5-3s-3-3-5-3z"/></svg>',
      harness:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4H4v3M17 4h3v3M7 20H4v-3M17 20h3v-3"/><rect x="9" y="9" width="6" height="6" rx="1.2"/></svg>',
      route:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="5.5" r="2.2"/><circle cx="18" cy="18.5" r="2.2"/><path d="M8.2 11l7.6-4.7M8.2 13l7.6 4.7"/></svg>',
      funnel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 7v6l-4 2v-8z"/></svg>',
      socket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8.5 10.5l7 3M15.5 10.5l-7 3"/></svg>',
      type:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h14M12 6v12M8.5 18h7"/></svg>',
      graph:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M7.6 8.4l3.2 7M16.4 8.4l-3.2 7M8 7h8"/></svg>',
      prov:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h7l4 4v12H7z"/><path d="M13.5 4v4H18"/><path d="M9.5 13l1.5 1.5L14.5 11"/></svg>',
      activity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2.5-6 4 13 2.5-7H21"/></svg>',
      lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="9" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="14.5" r="1.3"/></svg>',
      dec:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l5 5-5 5-5-5z"/><path d="M12 13v4a3 3 0 0 0 3 3h3"/><path d="M18 17l2 3-3 1" stroke-width="1.5"/></svg>',
      clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/><path d="M12 4V2.5M12 21.5V20" opacity=".6"/></svg>',
      key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5"/></svg>'
    };
    const ic = (k) => `<span class="layers-ico">${ICONS[k] || ''}</span>`;
    const graphMotif = `
      <svg class="layers-gmotif" viewBox="0 0 96 48" fill="none" aria-hidden="true">
        <line x1="14" y1="14" x2="40" y2="24" stroke="#4A8C65" stroke-width="1.3"/>
        <line x1="40" y1="24" x2="70" y2="12" stroke="#8CC9AC" stroke-width="1.3"/>
        <line x1="40" y1="24" x2="68" y2="36" stroke="#8CC9AC" stroke-width="1.3"/>
        <line x1="14" y1="14" x2="20" y2="38" stroke="#4A8C65" stroke-width="1.3"/>
        <line x1="20" y1="38" x2="68" y2="36" stroke="#4A8C65" stroke-width="1.3"/>
        <line x1="70" y1="12" x2="84" y2="28" stroke="#A8D4BC" stroke-width="1.3"/>
        <circle cx="14" cy="14" r="3.4" fill="#8CC9AC"/>
        <circle cx="40" cy="24" r="4.2" fill="#C2D62E"/>
        <circle cx="70" cy="12" r="3.4" fill="#A8D4BC"/>
        <circle cx="20" cy="38" r="2.8" fill="#8CC9AC"/>
        <circle cx="68" cy="36" r="2.8" fill="#A8D4BC"/>
        <circle cx="84" cy="28" r="2.4" fill="#C2D62E"/>
      </svg>`;

    const toolset = s.toolset || {};
    const arch = s.arch || [];
    const engine = s.engine || {};
    const flows = s.flows || [];

    const tile = (t) => `
      <div class="layers-tile ${t.ghost ? 'layers-tile--ghost' : ''}">
        <span class="layers-tile-acc"></span>
        ${ic(t.ico)}
        <span class="layers-tile-nm">${t.nm}</span>
      </div>`;

    const flow = (txt) => `
      <div class="layers-flow" data-animate>
        <span class="layers-flow-t">${txt || ''}</span>
        <span class="layers-flow-ar">↓</span>
      </div>`;

    return `
      <div class="slide-layers">
        <div class="layers-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="layers-headline">${s.headline}</h2>
        </div>
        <div class="layers-stack">

          <div class="layers-zone" data-animate>
            <div class="layers-zhdr">
              <span class="layers-zn">${toolset.number || '01'}</span>
              <span class="layers-zt">${toolset.name || 'The Toolset'}</span>
              ${toolset.note ? `<span class="layers-zk">${toolset.note}</span>` : ''}
            </div>
            <div class="layers-phases">
              ${(toolset.phases || []).map(p => `
                <div class="layers-phase ${p.ghost ? 'layers-phase--ghost' : ''}">
                  <div class="layers-phcap">
                    <span class="layers-phn">${p.pn || ''}</span>
                    <span class="layers-pht">${p.pt || ''}</span>
                  </div>
                  ${(p.tools || []).map(tile).join('')}
                </div>`).join('')}
            </div>
          </div>

          ${flow(flows[0])}

          <div class="layers-zone" data-animate>
            <div class="layers-zhdr">
              <span class="layers-zn">${(s.arch_meta && s.arch_meta.number) || '02'}</span>
              <span class="layers-zt">${(s.arch_meta && s.arch_meta.name) || 'Context-Aware Agentic Architecture'}</span>
              ${(s.arch_meta && s.arch_meta.note) ? `<span class="layers-zk">${s.arch_meta.note}</span>` : ''}
            </div>
            <div class="layers-archrow">
              ${arch.map(tile).join('')}
            </div>
          </div>

          ${flow(flows[1])}

          <div class="layers-engine" data-animate>
            <div class="layers-ehdr">
              <span class="layers-en">${engine.number || '03'}</span>
              <span class="layers-et">${engine.name || 'The Intelligence Engine'}</span>
              ${engine.note ? `<span class="layers-ek">${engine.note}</span>` : ''}
              ${graphMotif}
            </div>
            <div class="layers-ssrow">
              ${(engine.sub || []).map(x => `
                <div class="layers-sschip">${ic(x.ico)}<span>${x.nm}</span></div>`).join('')}
            </div>
            ${(engine.prims || []).length ? `
              <div class="layers-ssdiv">${engine.prims_label || 'The primitives we lead on'}</div>
              <div class="layers-primrow">
                ${engine.prims.map(p => `
                  <div class="layers-primtile">${ic(p.ico)}<span>${p.nm}</span></div>`).join('')}
              </div>` : ''}
            ${engine.caption ? `<div class="layers-ecta">${engine.caption}</div>` : ''}
          </div>

        </div>
      </div>
    `;
  },

  // ── diagram ──────────────────────────────────────────
  // Renders a provided inline SVG flow diagram, centered, with header + callout.
  // eyebrow, headline, svg (raw SVG markup string), callout
  diagram(s) {
    return `
      <div class="slide-diagram">
        <div class="diagram-header" data-animate>
          ${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
          <h2 class="diagram-headline">${s.headline || ''}</h2>
        </div>
        <div class="diagram-canvas" data-animate>${s.svg || ''}</div>
        ${s.callout ? `<div class="diagram-callout" data-animate>${s.callout}</div>` : ''}
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
