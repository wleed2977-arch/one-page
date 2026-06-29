const bindLandingLinks = () => {
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.appRouter.navigate(link.getAttribute('href'));
    });
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

export const LandingPage = {
  render: async () => `
    <div class="landing-page">
      <header class="landing-header">
        <div class="landing-container">
          <nav class="landing-nav">
            <a href="/" class="landing-logo" data-link>OnePage</a>
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
            <div class="landing-hero__content">
              <span class="landing-eyebrow">Personal website builder</span>
              <h1>Your portfolio, one page away</h1>
              <p>Build a clean online CV in minutes. Pick a theme, add your work, and share a link recruiters will remember.</p>
              <div class="landing-hero__actions">
                <a href="/register" class="btn btn-primary" data-link>Get Started Free</a>
                <a href="/login" class="btn btn-secondary" data-link>Sign in</a>
              </div>
            </div>
            <div class="landing-hero__visual">
              <div class="landing-mockup" aria-hidden="true">
                <div class="landing-mockup__chrome">
                  <span class="landing-mockup__dot"></span>
                  <span class="landing-mockup__dot"></span>
                  <span class="landing-mockup__dot"></span>
                  <span class="landing-mockup__url">onepage.app/p/you</span>
                </div>
                <div class="landing-mockup__body">
                  <div class="landing-mockup__hero-block">
                    <div class="landing-mockup__name"></div>
                    <div class="landing-mockup__role"></div>
                    <div class="landing-mockup__cta-pill"></div>
                  </div>
                  <div class="landing-mockup__row">
                    <div class="landing-mockup__card"></div>
                    <div class="landing-mockup__card"></div>
                  </div>
                  <div class="landing-mockup__row">
                    <div class="landing-mockup__card"></div>
                    <div class="landing-mockup__card"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="landing-section landing-section--muted">
          <div class="landing-container">
            <div class="landing-section__head">
              <h2>Everything you need to stand out</h2>
              <p>A focused toolkit for developers who want a professional page without maintaining a full website.</p>
            </div>
            <div class="landing-features">
              <article class="landing-feature">
                <div class="landing-feature__icon"><i data-lucide="layout"></i></div>
                <h3>Visual builder</h3>
                <p>Add hero, about, projects, skills, and more with a simple editor — no code required.</p>
              </article>
              <article class="landing-feature">
                <div class="landing-feature__icon"><i data-lucide="palette"></i></div>
                <h3>6 polished themes</h3>
                <p>Light, dark, glass, and more. Switch looks instantly from your dashboard.</p>
              </article>
              <article class="landing-feature">
                <div class="landing-feature__icon"><i data-lucide="link"></i></div>
                <h3>Shareable URL</h3>
                <p>Your page lives at <code>/p/your-name</code> — ready to drop in applications and bios.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="landing-section">
          <div class="landing-container">
            <div class="landing-section__head">
              <h2>Live in three steps</h2>
              <p>From signup to a shareable portfolio — usually under ten minutes.</p>
            </div>
            <ol class="landing-steps">
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
            <div class="landing-cta__inner">
              <h2>Start building today</h2>
              <p>Free to get started. Your portfolio page is a few clicks away.</p>
              <a href="/register" class="btn btn-primary" data-link>Create your page</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="landing-footer">
        OnePage — personal website builder for developers
      </footer>
    </div>
  `,

  afterRender: () => bindLandingLinks(),
};
