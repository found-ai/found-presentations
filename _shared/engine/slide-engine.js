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
    this._renderSlide(0, 'none');
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

    // Brand mark
    const brand = document.createElement('div');
    brand.className = 'deck-brand';
    brand.innerHTML = `<span class="deck-brand-name">FOUND AI</span>`;
    if (this.meta.title) {
      brand.innerHTML += `<span class="deck-brand-sep">·</span><span class="deck-brand-title">${this.meta.title}</span>`;
    }
    document.body.appendChild(brand);
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

    // Animate children in after mount
    requestAnimationFrame(() => {
      el.querySelectorAll('[data-animate]').forEach((child, i) => {
        child.style.animationDelay = `${i * 80}ms`;
        child.classList.add('anim-in');
      });
    });

    return el;
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

  _bindHash() {
    const idx = parseInt(location.hash.replace('#', '')) - 1;
    if (!isNaN(idx) && idx > 0 && idx < this.slides.length) {
      this.currentIndex = 0;
      setTimeout(() => this.goTo(idx), 100);
    }
  }
}

// Export
window.FoundEngine = FoundEngine;
