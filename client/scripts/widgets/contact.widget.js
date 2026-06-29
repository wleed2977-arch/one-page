import { escapeHtml } from '../utils/escape.js';
import { contactApi } from '../api/contact.api.js';
import { showToast } from '../utils/toast.js';

export class ContactWidget {
  constructor(data = {}) {
    this.data = {
      email: data.email || 'hello@example.com',
      placeholder: data.placeholder || 'Send me a message...',
    };
    this.element = null;
    this.live = false;
    this.pageSlug = '';
    this._boundForm = false;
  }

  static fromJSON(data) {
    return new ContactWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-contact';
    this.element.dataset.widgetType = 'contact';
    this.element.style.cursor = 'pointer';
    this._boundForm = false;
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'email', label: 'Contact Email', type: 'email' },
      { name: 'placeholder', label: 'Message Placeholder', type: 'text' },
    ];
  }

  bindLiveForm() {
    if (!this.live || !this.pageSlug || this._boundForm) return;

    const form = this.element.querySelector('.contact-live-form');
    if (!form) return;

    this._boundForm = true;
    const statusEl = form.querySelector('.contact-form-status');
    const submitBtn = form.querySelector('.contact-submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim();
      const senderEmail = form.querySelector('[name="email"]')?.value?.trim();
      const message = form.querySelector('[name="message"]')?.value?.trim();

      if (!name || !senderEmail || !message) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      if (statusEl) statusEl.textContent = '';

      try {
        const res = await contactApi.sendMessage(this.pageSlug, {
          name,
          email: senderEmail,
          message,
        });
        form.reset();
        if (statusEl) {
          statusEl.textContent = res.message || 'Message sent!';
          statusEl.className = 'contact-form-status contact-form-status--ok';
        }
        showToast(res.message || 'Message sent!', 'success');
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = err.message || 'Failed to send';
          statusEl.className = 'contact-form-status contact-form-status--error';
        }
        showToast(err.message || 'Failed to send message', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    });
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const { email, placeholder } = this.data;

    if (this.live) {
      this.element.innerHTML = `
        <div class="widget-section">
          <h2 class="widget-section-title">Contact</h2>
          <p class="contact-live-intro">Send a message — I'll get back to you at <strong>${escapeHtml(email)}</strong>.</p>
          <form class="contact-live-form" novalidate>
            <div class="contact-form-row">
              <div class="input-group">
                <label class="input-label" for="contact-name">Your name</label>
                <input class="input-field" type="text" id="contact-name" name="name" required autocomplete="name" maxlength="120">
              </div>
              <div class="input-group">
                <label class="input-label" for="contact-email">Your email</label>
                <input class="input-field" type="email" id="contact-email" name="email" required autocomplete="email">
              </div>
            </div>
            <div class="input-group">
              <label class="input-label" for="contact-message">Message</label>
              <textarea class="input-field contact-live-textarea" id="contact-message" name="message" rows="4" required maxlength="5000" placeholder="${escapeHtml(placeholder)}"></textarea>
            </div>
            <button type="submit" class="btn btn-primary contact-submit-btn">Send message</button>
            <p class="contact-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      `;
      this.element.style.cursor = 'default';
      this.bindLiveForm();
      return;
    }

    this.element.innerHTML = `
      <div class="widget-section">
        <h2 class="widget-section-title">Contact</h2>
        <a class="contact-email-link" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
        <p class="contact-preview-note">Preview — visitors will use the form below on your live page.</p>
        <div class="contact-preview-form">
          <div class="contact-form-row">
            <div class="input-group">
              <label class="input-label">Your name</label>
              <input class="input-field" type="text" placeholder="Jane Doe" readonly tabindex="-1">
            </div>
            <div class="input-group">
              <label class="input-label">Your email</label>
              <input class="input-field" type="email" placeholder="jane@example.com" readonly tabindex="-1">
            </div>
          </div>
          <textarea class="input-field contact-preview-input" rows="4" placeholder="${escapeHtml(placeholder)}" readonly tabindex="-1"></textarea>
          <button type="button" class="btn btn-primary contact-preview-btn" disabled>Send message</button>
        </div>
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
