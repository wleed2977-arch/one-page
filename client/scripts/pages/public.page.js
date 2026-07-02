import { pagesApi } from '../api/pages.api.js';
import { analyticsApi } from '../api/analytics.api.js';
import { createWidget } from '../widgets/index.js';
import { applyPublicTheme, applyAppBrand } from '../utils/theme.js';

const getPageTitle = (widgets, slug) => {
  const hero = widgets?.find((w) => w.type === 'hero');
  if (hero?.data?.headline) return hero.data.headline;
  return slug || 'Portfolio';
};

const bindPublicInteractions = (canvas) => {
  canvas.querySelector('.hero-cta')?.addEventListener('click', () => {
    const contact = canvas.querySelector('.widget-contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const mailto = canvas.querySelector('.widget-contact a[href^="mailto:"]');
    if (mailto) mailto.click();
  });

  canvas.querySelectorAll('.skill-fill').forEach((bar) => {
    const target = bar.style.width;
    bar.style.width = '0';
    requestAnimationFrame(() => {
      bar.style.width = target;
    });
  });

  canvas.querySelectorAll('.gallery-grid img').forEach((img) => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'gallery-lightbox';
      lightbox.innerHTML = `
        <button type="button" class="gallery-lightbox__close" aria-label="Close">&times;</button>
        <img src="${img.src}" alt="${img.alt || 'Gallery image'}">
      `;
      const close = () => lightbox.remove();
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.gallery-lightbox__close')) close();
      });
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', onKey);
        }
      });
      document.body.appendChild(lightbox);
    });
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
};

export const PublicPage = {
  render: async () => `
    <div class="public-page">
      <header class="public-page__header">
        <span id="public-page-title" class="public-page__brand"></span>
      </header>
      <main id="public-canvas" class="public-page__canvas">
        <div class="empty-state" style="padding:4rem;">
          <p>Loading page...</p>
        </div>
      </main>
    </div>
  `,

  afterRender: async (params) => {
    const slug = params?.slug;
    if (!slug) return;

    try {
      const res = await pagesApi.getPageBySlug(slug);
      const page = res.data.page;
      applyPublicTheme(page.themeName || 'light');

      const pageName = getPageTitle(page.widgets, slug);
      document.title = `${pageName} | Portfolio`;

      const titleEl = document.getElementById('public-page-title');
      if (titleEl) titleEl.textContent = pageName;

      const canvas = document.getElementById('public-canvas');
      canvas.innerHTML = '';

      if (!page.widgets?.length) {
        canvas.innerHTML = `
          <div class="empty-state">
            <div class="empty-state__illustration" aria-hidden="true"></div>
            <h3>This page is empty</h3>
            <p>The owner has not added any content yet.</p>
          </div>`;
      } else {
        page.widgets.forEach((w, index) => {
          const instance = createWidget(w.type, w.data);
          if (instance) {
            if (w.type === 'contact') {
              instance.live = true;
              instance.pageSlug = slug;
            }
            const el = instance.render();
            el.style.cursor = 'default';
            el.classList.add('animate-in');
            if (index > 0 && index <= 6) {
              el.classList.add(`animate-in-delay-${index}`);
            }
            if (!instance.live) {
              el.querySelectorAll('button:not(.hero-cta), textarea, input').forEach((input) => {
                if (input.tagName !== 'A') input.disabled = true;
              });
            }
            canvas.appendChild(el);
          }
        });
        bindPublicInteractions(canvas);
      }

      analyticsApi.recordView(slug).catch(() => {});
    } catch {
      applyAppBrand();
      document.title = 'Page not found | OnePage';
      document.getElementById('public-page-title').textContent = 'Page not found';
      document.getElementById('public-canvas').innerHTML = `
        <div class="empty-state">
          <div class="empty-state__illustration" aria-hidden="true"></div>
          <h3>Page not found</h3>
          <p>This link does not exist or the page was removed.</p>
          <a href="/" class="btn btn-primary" data-link>Go to OnePage</a>
        </div>
      `;
      document.querySelector('.public-page [data-link]')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.appRouter.navigate('/');
      });
    }
  },
};
