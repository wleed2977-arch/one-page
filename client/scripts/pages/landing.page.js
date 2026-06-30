import { brandMark, brandFull } from '../utils/brand.js';

const bindLandingLinks = () => {
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.appRouter.navigate(link.getAttribute('href'));
    });
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

const bindLandingMotion = () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const revealEls = document.querySelectorAll('.landing-reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('.landing-stat__value[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          requestAnimationFrame(tick);
          statObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statObserver.observe(el);
  });
};

export const LandingPage = {
  render: async () => `
    <div class="landing-page">
      <div class="landing-bg" aria-hidden="true">
        <span class="landing-blob landing-blob--1"></span>
        <span class="landing-blob landing-blob--2"></span>
        <span class="landing-blob landing-blob--3"></span>
        <span class="landing-grid"></span>
      </div>

      <header class="landing-header">
        <div class="landing-container">
          <nav class="landing-nav">
            ${brandMark({ className: 'landing-logo brand-logo', variant: 'full', size: 44 })}
            <div class="landing-nav__links">
              <a href="/login" class="landing-nav__link" data-link>Login</a>
              <a href="/register" class="btn btn-primary" data-link>Get Started</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section class="landing-hero">
          <div class="landing-container landing-hero__grid">
            <div class="landing-hero__content landing-hero-enter">
              <span class="landing-eyebrow">
                <span class="landing-eyebrow__dot"></span>
                Personal website builder
              </span>
              <h1>Your portfolio, <span class="landing-gradient-text">one page</span> away</h1>
              <p>Build a clean online CV in minutes. Pick a theme, add your work, and share a link recruiters will remember.</p>
              <div class="landing-hero__actions">
                <a href="/register" class="btn btn-primary" data-link>Get Started Free</a>
                <a href="/login" class="btn btn-secondary" data-link>Sign in</a>
              </div>
              <div class="landing-stats landing-hero-enter landing-hero-enter--delay">
                <div class="landing-stat">
                  <span class="landing-stat__value" data-count="6">0</span>
                  <span class="landing-stat__label">Themes</span>
                </div>
                <div class="landing-stat">
                  <span class="landing-stat__value" data-count="9">0</span>
                  <span class="landing-stat__label">Widgets</span>
                </div>
                <div class="landing-stat">
                  <span class="landing-stat__value">∞</span>
                  <span class="landing-stat__label">Possibilities</span>
                </div>
              </div>
            </div>
            <div class="landing-hero__visual landing-hero-enter landing-hero-enter--delay-2">
              <div class="landing-mockup landing-mockup--float">
                <div class="landing-mockup__chrome">
                  <span class="landing-mockup__dot landing-mockup__dot--red"></span>
                  <span class="landing-mockup__dot landing-mockup__dot--yellow"></span>
                  <span class="landing-mockup__dot landing-mockup__dot--green"></span>
                  <span class="landing-mockup__url">onepage.app/p/you</span>
                </div>
                <div class="landing-mockup__body">
                  <div class="landing-mockup__hero-block">
                    <div class="landing-mockup__avatar"></div>
                    <div class="landing-mockup__name"></div>
                    <div class="landing-mockup__role"></div>
                    <div class="landing-mockup__cta-pill"></div>
                  </div>
                  <div class="landing-mockup__row">
                    <div class="landing-mockup__card landing-mockup__card--shimmer"></div>
                    <div class="landing-mockup__card landing-mockup__card--shimmer"></div>
                  </div>
                  <div class="landing-mockup__row">
                    <div class="landing-mockup__card landing-mockup__card--shimmer"></div>
                    <div class="landing-mockup__card landing-mockup__card--shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="landing-marquee" aria-hidden="true">
          <div class="landing-marquee__track">
            <span>Portfolio</span><span>CV</span><span>Personal Brand</span><span>No Code</span><span>Visual Builder</span><span>Shareable Link</span>
            <span>Portfolio</span><span>CV</span><span>Personal Brand</span><span>No Code</span><span>Visual Builder</span><span>Shareable Link</span>
          </div>
        </section>

        <section class="landing-section landing-section--muted">
          <div class="landing-container">
            <div class="landing-section__head landing-reveal">
              <h2>Everything you need to stand out</h2>
              <p>A focused toolkit for developers who want a professional page without maintaining a full website.</p>
            </div>
            <div class="landing-features">
              <article class="landing-feature landing-reveal landing-reveal--delay-1">
                <div class="landing-feature__icon"><i data-lucide="layout"></i></div>
                <h3>Visual builder</h3>
                <p>Add hero, about, projects, skills, and more with a simple editor — no code required.</p>
              </article>
              <article class="landing-feature landing-reveal landing-reveal--delay-2">
                <div class="landing-feature__icon"><i data-lucide="palette"></i></div>
                <h3>6 polished themes</h3>
                <p>Light, dark, glass, and more. Switch looks instantly from your dashboard.</p>
              </article>
              <article class="landing-feature landing-reveal landing-reveal--delay-3">
                <div class="landing-feature__icon"><i data-lucide="link"></i></div>
                <h3>Shareable URL</h3>
                <p>Your page lives at <code>/p/your-name</code> — ready to drop in applications and bios.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="landing-section landing-section--themes">
          <div class="landing-container">
            <div class="landing-section__head landing-reveal">
              <h2>Looks that fit your style</h2>
              <p>Switch themes in one click — from minimal light to bold glass and dark modes.</p>
            </div>
            <div class="landing-themes landing-reveal">
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(165deg, #fff 0%, #eef2ff 100%)"><span>Light</span></div>
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(180deg, #1f1f23, #09090b)"><span>Dark</span></div>
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(160deg, #e0e7ff, #fce7f3)"><span>Glass</span></div>
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(180deg, #111, #000)"><span>Linear</span></div>
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(160deg, #ecfdf5, #d1fae5)"><span>Forest</span></div>
              <div class="landing-theme-chip" style="--chip-bg: linear-gradient(160deg, #e0f2fe, #bae6fd)"><span>Ocean</span></div>
            </div>
          </div>
        </section>

        <section class="landing-section">
          <div class="landing-container">
            <div class="landing-section__head landing-reveal">
              <h2>Live in three steps</h2>
              <p>From signup to a shareable portfolio — usually under ten minutes.</p>
            </div>
            <ol class="landing-steps landing-reveal">
              <li class="landing-step">
                <h3>Create your account</h3>
                <p>Sign up free and choose your public page slug.</p>
              </li>
              <li class="landing-step">
                <h3>Build your page</h3>
                <p>Pick a theme and fill in your content with the visual builder.</p>
              </li>
              <li class="landing-step">
                <h3>Share your link</h3>
                <p>Send <code>/p/your-name</code> to recruiters, clients, or your network.</p>
              </li>
            </ol>
          </div>
        </section>

        <section class="landing-cta">
          <div class="landing-container">
            <div class="landing-cta__inner landing-reveal">
              ${brandFull(56, 'landing-cta__logo')}
              <h2>Start building today</h2>
              <p>Free to get started. Your portfolio page is a few clicks away.</p>
              <a href="/register" class="btn btn-primary" data-link>Create your page</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="landing-footer">
        ${brandMark({ className: 'brand-logo brand-logo--sm', size: 28 })}
        <p>Personal website builder for developers</p>
      </footer>
    </div>
  `,

  afterRender: () => {
    bindLandingLinks();
    bindLandingMotion();
  },
};
