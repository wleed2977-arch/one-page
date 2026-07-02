import { onboardingApi } from '../api/onboarding.api.js';
import { refreshAuthUser } from '../utils/authRedirect.js';
import { createWidget } from '../widgets/index.js';
import { showToast } from '../utils/toast.js';
import { applyScopedTheme } from '../utils/theme.js';

import { THEMES, renderThemeCards } from '../utils/themes.config.js';

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'my-page';

const buildPreviewWidgets = (formData) => {
  const { fullName, jobTitle, email, slug } = formData;
  const types = ['hero', 'about', 'skills', 'projects', 'social', 'contact'];
  const dataMap = {
    hero: { headline: fullName, subheadline: jobTitle, ctaText: 'Contact Me' },
    about: { bio: `Hi, I'm ${fullName}. I'm a ${jobTitle}.` },
    skills: { items: [{ name: 'JavaScript', level: 80 }, { name: 'HTML & CSS', level: 85 }] },
    projects: { items: [{ title: 'My Project', description: 'A cool project', link: '#' }] },
    social: { github: '', linkedin: '', twitter: '' },
    contact: { email: email || 'hello@example.com', placeholder: 'Send a message...' },
  };

  return types.map((type) => createWidget(type, dataMap[type])).filter(Boolean);
};

export const OnboardingPage = {
  step: 1,
  formData: {
    fullName: '',
    jobTitle: '',
    slug: '',
    theme: 'light',
    email: '',
  },

  render: async () => {
    return `
      <div class="onboarding-page">
        <div class="onboarding-progress">
          <div class="onboarding-progress-bar">
            <div class="onboarding-progress-fill" id="progress-fill" style="width: 25%;"></div>
          </div>
          <p class="onboarding-progress-label" id="progress-label">Step 1 of 4</p>
        </div>
        <div class="card onboarding-card">
          <div class="card-body" id="onboarding-step-content"></div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    OnboardingPage.step = 1;

    try {
      const res = await onboardingApi.getStatus();
      const { profile, page } = res.data;
      OnboardingPage.formData.email = profile?.email || '';
      OnboardingPage.formData.slug = page?.slug?.replace(/-\d+$/, '') || slugify(profile?.username || 'my-page');
      if (page?.themeName) OnboardingPage.formData.theme = page.themeName;
    } catch {
      /* defaults */
    }

    OnboardingPage.renderStep();
  },

  renderStep() {
    const content = document.getElementById('onboarding-step-content');
    const fill = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');

    fill.style.width = `${(OnboardingPage.step / 4) * 100}%`;
    label.textContent = `Step ${OnboardingPage.step} of 4`;

    if (OnboardingPage.step === 1) content.innerHTML = OnboardingPage.step1HTML();
    else if (OnboardingPage.step === 2) content.innerHTML = OnboardingPage.step2HTML();
    else if (OnboardingPage.step === 3) content.innerHTML = OnboardingPage.step3HTML();
    else content.innerHTML = OnboardingPage.step4HTML();

    OnboardingPage.bindStepEvents();
    if (OnboardingPage.step === 4) OnboardingPage.renderPreview();
  },

  step1HTML() {
    const { fullName, jobTitle } = OnboardingPage.formData;
    return `
      <h2 class="onboarding-step-title">About you</h2>
      <p class="onboarding-step-desc">Let's start with the basics. We'll use this to build your page.</p>
      <div class="input-group">
        <label class="input-label" for="ob-fullName">Full Name</label>
        <input class="input-field" id="ob-fullName" value="${fullName}" placeholder="Jane Doe" required>
      </div>
      <div class="input-group">
        <label class="input-label" for="ob-jobTitle">Job Title</label>
        <input class="input-field" id="ob-jobTitle" value="${jobTitle}" placeholder="Frontend Developer" required>
      </div>
      <div class="onboarding-actions">
        <span></span>
        <button type="button" class="btn btn-primary" id="ob-next">Next</button>
      </div>
    `;
  },

  step2HTML() {
    const { slug } = OnboardingPage.formData;
    return `
      <h2 class="onboarding-step-title">Your link</h2>
      <p class="onboarding-step-desc">Choose a unique URL for your public page.</p>
      <div class="input-group">
        <label class="input-label" for="ob-slug">Page URL</label>
        <input class="input-field" id="ob-slug" value="${slug}" pattern="[a-z0-9-]+" required>
        <div class="onboarding-slug-preview">yoursite.com/p/<span id="slug-preview">${slug || 'your-name'}</span></div>
      </div>
      <div class="onboarding-actions">
        <button type="button" class="btn btn-secondary" id="ob-back">Back</button>
        <button type="button" class="btn btn-primary" id="ob-next">Next</button>
      </div>
    `;
  },

  step3HTML() {
    const { theme } = OnboardingPage.formData;
    const cards = renderThemeCards(theme);

    return `
      <h2 class="onboarding-step-title">Pick a theme</h2>
      <p class="onboarding-step-desc">Choose a look for your page. You can change it anytime.</p>
      <div class="onboarding-theme-grid">${cards}</div>
      <div class="onboarding-actions">
        <button type="button" class="btn btn-secondary" id="ob-back">Back</button>
        <button type="button" class="btn btn-primary" id="ob-next">Next</button>
      </div>
    `;
  },

  step4HTML() {
    return `
      <h2 class="onboarding-step-title">You're all set!</h2>
      <p class="onboarding-step-desc">Here's a preview of your page. Launch it or customize further in the Builder.</p>
      <div class="onboarding-preview" id="onboarding-preview"></div>
      <div class="onboarding-actions">
        <button type="button" class="btn btn-secondary" id="ob-back">Back</button>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary" id="ob-builder">Customize in Builder</button>
          <button type="button" class="btn btn-primary" id="ob-finish">Launch My Page</button>
        </div>
      </div>
    `;
  },

  bindStepEvents() {
    document.getElementById('ob-back')?.addEventListener('click', () => {
      OnboardingPage.saveCurrentStep();
      OnboardingPage.step--;
      OnboardingPage.renderStep();
    });

    document.getElementById('ob-next')?.addEventListener('click', () => {
      if (!OnboardingPage.saveCurrentStep()) return;
      OnboardingPage.step++;
      OnboardingPage.renderStep();
    });

    document.getElementById('ob-slug')?.addEventListener('input', (e) => {
      const val = slugify(e.target.value);
      document.getElementById('slug-preview').textContent = val || 'your-name';
    });

    document.querySelectorAll('.onboarding-theme-card').forEach((card) => {
      card.addEventListener('click', () => {
        OnboardingPage.formData.theme = card.dataset.theme;
        document.querySelectorAll('.onboarding-theme-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    document.getElementById('ob-finish')?.addEventListener('click', () => OnboardingPage.finish('/dashboard'));
    document.getElementById('ob-builder')?.addEventListener('click', () => OnboardingPage.finish('/builder'));
  },

  saveCurrentStep() {
    if (OnboardingPage.step === 1) {
      const fullName = document.getElementById('ob-fullName')?.value.trim();
      const jobTitle = document.getElementById('ob-jobTitle')?.value.trim();
      if (!fullName || !jobTitle) {
        showToast('Please fill in all fields', 'error');
        return false;
      }
      OnboardingPage.formData.fullName = fullName;
      OnboardingPage.formData.jobTitle = jobTitle;
      if (!OnboardingPage.formData.slug) {
        OnboardingPage.formData.slug = slugify(fullName);
      }
    }
    if (OnboardingPage.step === 2) {
      const slug = slugify(document.getElementById('ob-slug')?.value || '');
      if (slug.length < 3) {
        showToast('URL must be at least 3 characters', 'error');
        return false;
      }
      OnboardingPage.formData.slug = slug;
    }
    return true;
  },

  renderPreview() {
    const container = document.getElementById('onboarding-preview');
    if (!container) return;
    container.innerHTML = '';
    applyScopedTheme(container, OnboardingPage.formData.theme);

    const widgets = buildPreviewWidgets(OnboardingPage.formData);
    widgets.forEach((w) => {
      const el = w.render();
      el.style.pointerEvents = 'none';
      container.appendChild(el);
    });
  },

  async finish(redirectTo) {
    const btn = document.getElementById('ob-finish');
    const builderBtn = document.getElementById('ob-builder');
    if (btn) btn.disabled = true;
    if (builderBtn) builderBtn.disabled = true;

    try {
      OnboardingPage.saveCurrentStep();
      const { fullName, jobTitle, slug, theme } = OnboardingPage.formData;

      if (!fullName || !jobTitle || !slug) {
        showToast('Please complete all steps first', 'error');
        if (btn) btn.disabled = false;
        if (builderBtn) builderBtn.disabled = false;
        return;
      }

      await onboardingApi.complete({ fullName, jobTitle, slug, theme });
      await refreshAuthUser();

      sessionStorage.setItem('onboardingJustFinished', '1');
      window.appRouter.navigate(redirectTo);
    } catch (err) {
      showToast(err.message || 'Could not finish setup. Check your connection and try again.', 'error');
      if (btn) btn.disabled = false;
      if (builderBtn) builderBtn.disabled = false;
    }
  },
};
