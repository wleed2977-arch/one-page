import { authApi } from '../api/auth.api.js';
import { redirectAfterAuth } from '../utils/authRedirect.js';
import { showToast } from '../utils/toast.js';
import { brandMark } from '../utils/brand.js';

const AUTH_PERKS = `
  <ul class="auth-perks">
    <li><i data-lucide="check-circle"></i> Free to start</li>
    <li><i data-lucide="check-circle"></i> No code required</li>
    <li><i data-lucide="check-circle"></i> Your own URL at /p/your-name</li>
  </ul>
`;

export const RegisterPage = {
  render: async () => `
    <div class="auth-page">
      <nav class="auth-nav">
        ${brandMark({ className: 'auth-nav__brand brand-logo', variant: 'full', size: 36 })}
        <a href="/login" class="btn btn-secondary btn-sm" data-link>Login</a>
      </nav>
      <div class="auth-layout">
        <div class="auth-branding">
          <h1>Create your page</h1>
          <p>Build a professional portfolio in minutes. Perfect for your CV and personal brand.</p>
          ${AUTH_PERKS}
        </div>
        <div class="auth-card">
          <div class="card">
            <div class="card-header"><h2>Sign up</h2></div>
            <div class="card-body">
              <form id="register-form">
                <div class="input-group">
                  <label class="input-label" for="email">Email</label>
                  <input class="input-field" type="email" id="email" required autocomplete="email">
                </div>
                <div class="input-group">
                  <label class="input-label" for="password">Password</label>
                  <input class="input-field" type="password" id="password" required minlength="8" autocomplete="new-password">
                  <p class="auth-hint" id="password-hint">At least 8 characters</p>
                </div>
                <div class="input-group">
                  <label class="input-label" for="confirmPassword">Confirm Password</label>
                  <input class="input-field" type="password" id="confirmPassword" required minlength="8" autocomplete="new-password">
                  <p class="auth-hint" id="match-hint"></p>
                </div>
                <button type="submit" class="btn btn-primary">Create account</button>
              </form>
            </div>
          </div>
          <div class="card-footer auth-card-footer">
            <a href="/login" data-link class="auth-footer-link">Already have an account? Login</a>
          </div>
        </div>
      </div>
    </div>
  `,

  afterRender: () => {
    document.querySelectorAll('[data-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.appRouter.navigate(link.getAttribute('href'));
      });
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const password = document.getElementById('password');
    const confirm = document.getElementById('confirmPassword');
    const matchHint = document.getElementById('match-hint');

    const updateMatchHint = () => {
      if (!confirm.value) {
        matchHint.textContent = '';
        matchHint.className = 'auth-hint';
        return;
      }
      if (password.value === confirm.value) {
        matchHint.textContent = 'Passwords match';
        matchHint.className = 'auth-hint auth-hint--ok';
      } else {
        matchHint.textContent = 'Passwords do not match';
        matchHint.className = 'auth-hint auth-hint--error';
      }
    };

    password.addEventListener('input', updateMatchHint);
    confirm.addEventListener('input', updateMatchHint);

    const form = document.getElementById('register-form');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = password.value;
      const confirmPwd = confirm.value;
      if (pwd !== confirmPwd) {
        showToast("Passwords don't match", 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
      try {
        const res = await authApi.register(
          document.getElementById('email').value,
          pwd,
          confirmPwd
        );
        if (res.success) await redirectAfterAuth();
      } catch (error) {
        showToast(error.message || 'Registration failed', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create account';
      }
    });
  },
};
