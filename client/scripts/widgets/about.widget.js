import { http } from '../api/http.js';
import { escapeHtml } from '../utils/escape.js';
import { resolveMediaUrl } from '../utils/mediaUrl.js';

const getInitials = (bio) => {
  const words = (bio || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return '?';
};

export class AboutWidget {
  constructor(data = {}) {
    this.data = {
      avatarUrl: '',
      bio: 'Tell us about yourself...',
      ...data,
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new AboutWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-about';
    this.element.dataset.widgetType = 'about';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'avatarUrl', label: 'Profile photo', type: 'image' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'aiGenerate', label: 'Magic AI Bio', type: 'action', actionName: 'generateAiBio', buttonText: 'Generate with AI' },
    ];
  }

  async generateAiBio() {
    const prompt = window.prompt('What should the bio be about?', 'A passionate full stack developer.');
    if (!prompt) return;

    const res = await http.post('/ai/bio', { prompt, tone: 'professional' });
    if (res.success && res.data.bio) {
      this.update({ bio: res.data.bio });
    }
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const { avatarUrl, bio } = this.data;
    const resolvedAvatar = resolveMediaUrl(avatarUrl);
    const avatarHtml = resolvedAvatar
      ? `<img src="${escapeHtml(resolvedAvatar)}" alt="" class="about-avatar" loading="lazy">`
      : `<div class="about-avatar about-avatar--placeholder" aria-hidden="true">${escapeHtml(getInitials(bio))}</div>`;

    this.element.innerHTML = `
      <div class="widget-section">
        <h2 class="widget-section-title">About Me</h2>
        <div class="about-row">
          ${avatarHtml}
          <p class="about-bio">${escapeHtml(bio)}</p>
        </div>
      </div>
    `;

    const img = this.element.querySelector('.about-avatar');
    if (img?.tagName === 'IMG') {
      img.addEventListener('error', () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'about-avatar about-avatar--placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        placeholder.textContent = getInitials(bio);
        img.replaceWith(placeholder);
      }, { once: true });
    }
  }

  destroy() {
    this.element?.remove();
  }
}
