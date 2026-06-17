/**
 * Found Presentations — Slide Engine
 * Renders script.json into a keyboard/click-navigable presentation.
 * No dependencies. Self-contained.
 */

class FoundEngine {
  constructor(config = {}) {
    this.config = {
      transitionDuration: 500,
      transition: 'fade', // fade | slide | reveal
      ...config
    };

    this.slides = [];
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.container = null;
    this.progressBar = null;
    this.slideCounter = null;
  }

  // ── Init ─────────────────────────────────────────────

  async load(scriptPath) {
    const res = await fetch(scriptPath);
    const script = await res.json();
    this.meta = script.meta || {};
    this.slides = script.slides || [];

    // Apply meta config overrides
    if (this.meta.transition) this.config.transition = this.meta.transition;
    return this;
  }

  mount(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.container.className = 'found-deck';
    this._buildChrome();
    const start = this._hashIndex();
    this.currentIndex = start;
    this._renderSlide(start, 'none');
    this._bindKeys();
    this._bindTouch();
    this._bindHash();
    return this;
  }

  // ── Chrome ───────────────────────────────────────────

  _buildChrome() {
    // Progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'deck-progress';
    this.progressBar.innerHTML = '<div class="deck-progress-fill"></div>';
    document.body.appendChild(this.progressBar);

    // Nav controls
    const nav = document.createElement('div');
    nav.className = 'deck-nav';
    nav.innerHTML = `
      <button class="deck-nav-btn" id="nav-prev" aria-label="Previous">←</button>
      <span class="deck-counter" id="deck-counter">1 / ${this.slides.length}</span>
      <button class="deck-nav-btn" id="nav-next" aria-label="Next">→</button>
    `;
    document.body.appendChild(nav);

    document.getElementById('nav-prev').addEventListener('click', () => this.prev());
    document.getElementById('nav-next').addEventListener('click', () => this.next());
    this.slideCounter = document.getElementById('deck-counter');

    // Brand mark — click to go home
    const brand = document.createElement('div');
    brand.className = 'deck-brand';
    brand.innerHTML = `<span class="deck-brand-name">FOUND AI</span>`;
    if (this.meta.title) {
      brand.innerHTML += `<span class="deck-brand-sep">·</span><span class="deck-brand-title">${this.meta.title}</span>`;
    }
    brand.title = 'Home';
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', () => { window.location.href = '/'; });
    document.body.appendChild(brand);

    // Jump-to-slide overlay — click the counter
    this._buildJumpOverlay();
    this.slideCounter.style.cursor = 'pointer';
    this.slideCounter.title = 'Jump to slide';
    this.slideCounter.addEventListener('click', (e) => { e.stopPropagation(); this._toggleJump(); });

    // Clean mode — hide chrome for screenshots. ?clean in URL starts hidden.
    if (/[?&]clean\b/.test(location.search)) document.body.classList.add('deck-clean');
  }

  toggleChrome(force) {
    const hide = force === undefined ? !document.body.classList.contains('deck-clean') : force;
    document.body.classList.toggle('deck-clean', hide);
  }

  // ── Jump-to-slide ────────────────────────────────────

  _buildJumpOverlay() {
    const ov = document.createElement('div');
    ov.className = 'deck-jump';
    ov.innerHTML = `
      <div class="deck-jump-panel">
        <div class="deck-jump-title">Jump to slide</div>
        <div class="deck-jump-grid">
          ${this.slides.map((s, i) => `
            <button class="deck-jump-item" data-idx="${i}">
              <span class="deck-jump-num">${String(i + 1).padStart(2, '0')}</span>
              <span class="deck-jump-label">${this._slideLabel(s)}</span>
            </button>`).join('')}
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => { if (e.target === ov) this._toggleJump(false); });
    ov.querySelectorAll('.deck-jump-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._toggleJump(false);
        this.goTo(parseInt(btn.dataset.idx, 10));
      });
    });
    this.jumpOverlay = ov;
  }

  _slideLabel(s) {
    const raw = s.headline || s.name || s.template || '';
    const text = String(raw).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > 46 ? text.slice(0, 44) + '…' : text;
  }

  _toggleJump(force) {
    if (!this.jumpOverlay) return;
    const open = force === undefined ? !this.jumpOverlay.classList.contains('open') : force;
    this.jumpOverlay.classList.toggle('open', open);
    if (open) {
      this.jumpOverlay.querySelectorAll('.deck-jump-item').forEach((b, i) =>
        b.classList.toggle('is-current', i === this.currentIndex));
    }
  }

  _updateChrome() {
    const idx = this.currentIndex;
    const total = this.slides.length;

    // Progress
    const fill = this.progressBar.querySelector('.deck-progress-fill');
    fill.style.width = `${((idx + 1) / total) * 100}%`;

    // Counter
    if (this.slideCounter) {
      this.slideCounter.textContent = `${idx + 1} / ${total}`;
    }

    // Hash
    history.replaceState(null, '', `#${idx + 1}`);
  }

  // ── Navigation ───────────────────────────────────────

  next() {
    if (this.isTransitioning) return;
    if (this.currentIndex < this.slides.length - 1) {
      this._go(this.currentIndex + 1, 'forward');
    }
  }

  prev() {
    if (this.isTransitioning) return;
    if (this.currentIndex > 0) {
      this._go(this.currentIndex - 1, 'back');
    }
  }

  goTo(idx) {
    if (this.isTransitioning || idx === this.currentIndex) return;
    const dir = idx > this.currentIndex ? 'forward' : 'back';
    this._go(idx, dir);
  }

  _go(idx, dir) {
    this.isTransitioning = true;
    const outgoing = this.container.querySelector('.slide-active');

    if (!outgoing) {
      this._renderSlide(idx, 'none');
      this.currentIndex = idx;
      this._updateChrome();
      this.isTransitioning = false;
      return;
    }

    // Build incoming off-screen
    const incoming = this._buildSlideEl(this.slides[idx]);
    incoming.classList.add('slide', 'slide-incoming');
    this.container.appendChild(incoming);

    // Set initial position
    this._setTransitionIn(incoming, dir);

    // Force reflow
    incoming.getBoundingClientRect();

    // Animate
    const duration = this.config.transitionDuration;

    outgoing.style.transition = `opacity ${duration}ms var(--ease-out-expo), transform ${duration}ms var(--ease-out-expo)`;
    incoming.style.transition = `opacity ${duration}ms var(--ease-out-expo), transform ${duration}ms var(--ease-out-expo)`;

    this._setTransitionOut(outgoing, dir);
    incoming.style.opacity = '1';
    incoming.style.transform = 'translate(-50%, -50%) scale(1)';
    incoming.classList.add('slide-active');
    incoming.classList.remove('slide-incoming');

    setTimeout(() => {
      this._clearImageSequences(outgoing);
      outgoing.remove();
      this.currentIndex = idx;
      this._updateChrome();
      this.isTransitioning = false;

      // Autoplay video if present
      const video = incoming.querySelector('video');
      if (video && incoming.dataset.autoplay !== 'false') video.play().catch(() => {});
    }, duration + 50);
  }

  _setTransitionIn(el, dir) {
    const t = this.config.transition;
    if (t === 'slide') {
      el.style.opacity = '1';
      el.style.transform = `translate(-50%, -50%) translateX(${dir === 'forward' ? '40px' : '-40px'}) scale(0.97)`;
    } else if (t === 'reveal') {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(1.03)';
    } else {
      // fade (default)
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  _setTransitionOut(el, dir) {
    const t = this.config.transition;
    if (t === 'slide') {
      el.style.opacity = '0';
      el.style.transform = `translate(-50%, -50%) translateX(${dir === 'forward' ? '-40px' : '40px'}) scale(0.97)`;
    } else if (t === 'reveal') {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0.97)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  // ── Slide Rendering ──────────────────────────────────

  _renderSlide(idx, dir) {
    const slide = this.slides[idx];
    const el = this._buildSlideEl(slide);
    el.classList.add('slide', 'slide-active');
    this.container.appendChild(el);
    this._updateChrome();

    // Autoplay video
    const video = el.querySelector('video');
    if (video) video.play().catch(() => {});
  }

  _buildSlideEl(slide) {
    const el = document.createElement('div');
    el.className = `slide slide-template-${slide.template || 'default'}`;
    el.dataset.slideId = slide.id || '';
    el.dataset.theme = slide.theme || 'light';

    const template = window.FoundTemplates?.[slide.template] || window.FoundTemplates?.default;
    if (template) {
      el.innerHTML = template(slide);
    } else {
      el.innerHTML = this._defaultTemplate(slide);
    }

    // Animate children in after mount — stagger delays, then trigger via parent class
    el.querySelectorAll('[data-animate]').forEach((child, i) => {
      child.style.animationDelay = `${i * 80}ms`;
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('anim-in');
      });
    });

    this._initImageSequences(el);

    return el;
  }

  // ── Image-sequence cross-fade ────────────────────────

  _initImageSequences(el) {
    el._imgseqTimers = el._imgseqTimers || [];
    el.querySelectorAll('[data-imgseq]').forEach((seq) => {
      const frames = [...seq.querySelectorAll('.imgseq-frame')];
      if (frames.length < 2) return;
      const dots = [...seq.querySelectorAll('.imgseq-dot')];
      const labelEl = seq.querySelector('[data-frame-label]');
      const labels = frames.map(f => f.querySelector('img')?.getAttribute('alt') || '');
      const interval = parseInt(seq.dataset.interval, 10) || 3200;
      let i = 0;
      const timer = setInterval(() => {
        const next = (i + 1) % frames.length;
        frames[i].classList.remove('is-active');
        frames[next].classList.add('is-active');
        if (dots[i]) dots[i].classList.remove('is-active');
        if (dots[next]) dots[next].classList.add('is-active');
        if (labelEl) labelEl.textContent = labels[next] || '';
        i = next;
      }, interval);
      el._imgseqTimers.push(timer);
    });
  }

  _clearImageSequences(el) {
    if (el && el._imgseqTimers) {
      el._imgseqTimers.forEach(t => clearInterval(t));
      el._imgseqTimers = [];
    }
  }

  _defaultTemplate(slide) {
    return `
      <div class="slide-inner">
        <div class="slide-eyebrow" data-animate>${slide.eyebrow || ''}</div>
        <h1 class="slide-headline" data-animate>${slide.headline || ''}</h1>
        <p class="slide-body" data-animate>${slide.body || ''}</p>
      </div>
    `;
  }

  // ── Input Binding ────────────────────────────────────

  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); this.prev();
      } else if (e.key === 'f') {
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      } else if (e.key === 'c') {
        this.toggleChrome();
      } else if (e.key === 'Escape') {
        this._toggleJump(false);
      }
    });
  }

  _bindTouch() {
    let startX = 0;
    document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
    }, { passive: true });
  }

  _hashIndex() {
    const idx = parseInt(location.hash.replace('#', ''), 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < this.slides.length) return idx;
    return 0;
  }

  _bindHash() {
    // Honor browser back/forward and manual hash edits after initial load.
    window.addEventListener('hashchange', () => {
      const idx = this._hashIndex();
      if (idx !== this.currentIndex) this.goTo(idx);
    });
  }
}

// Export
window.FoundEngine = FoundEngine;
