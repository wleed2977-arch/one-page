import { authApi } from '../api/auth.api.js';
import { redirectAfterAuth } from '../utils/authRedirect.js';
import { showToast } from '../utils/toast.js';

const AUTH_PERKS = `
  <ul class="auth-perks">
    <li><i data-lucide="check-circle"></i> Free to start</li>
    <li><i data-lucide="check-circle"></i> No code required</li>
    <li><i data-lucide="check-circle"></i> Your own URL at /p/your-name</li>
  </ul>
`;

const authShell = (formContent, footerHtml) => `
  <div class="auth-page">
    <nav class="auth-nav">
      <a href="/" class="auth-nav__brand brand-logo" data-link>
        <img src="/logo.svg" alt="" class="brand-logo__img" width="32" height="32">
        <span class="brand-logo__text">OnePage</span>
      </a>
      <a href="/register" class="btn btn-primary btn-sm" data-link>Get Started</a>
    </nav>
    <div class="auth-layout">
      <div class="auth-branding">
        <h1>Welcome back</h1>
        <p>Sign in to edit your portfolio, pick themes, and share your public page.</p>
        ${AUTH_PERKS}
      </div>
      <div class="auth-card">
        ${formContent}
        <div class="card-footer auth-card-footer">
          ${footerHtml}
        </div>
      </div>
    </div>
  </div>
`;

export const LoginPage = {
  render: async () => authShell(
    `<div class="card">
      <div class="card-header"><h2>Login</h2></div>
      <div class="card-body">
        <form id="login-form">
          <div class="input-group">
            <label class="input-label" for="email">Email</label>
            <input class="input-field" type="email" id="email" required autocomplete="email">
          </div>
          <div class="input-group">
            <label class="input-label" for="password">Password</label>
            <input class="input-field" type="password" id="password" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>`,
    `<a href="/register" data-link class="auth-footer-link">Don't have an account? Sign up</a>`
  ),

  afterRender: () => {
    document.querySelectorAll('[data-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.appRouter.navigate(link.getAttribute('href'));
      });
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const form = document.getElementById('login-form');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';
      try {
        const res = await authApi.login(
          document.getElementById('email').value,
          document.getElementById('password').value
        );
        if (res.success) await redirectAfterAuth();
      } catch (error) {
        showToast(error.message || 'Login failed', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  },
};
