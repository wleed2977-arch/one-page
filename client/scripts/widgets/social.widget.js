import { escapeHtml } from '../utils/escape.js';

const SOCIAL_LINKS = [
  { key: 'github', label: 'GitHub', icon: 'github' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'twitter', label: 'Twitter', icon: 'twitter' },
];

export class SocialWidget {
  constructor(data = {}) {
    this.data = {
      github: data.github || '',
      linkedin: data.linkedin || '',
      twitter: data.twitter || '',
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new SocialWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-social';
    this.element.dataset.widgetType = 'social';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'github', label: 'GitHub URL', type: 'text' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      { name: 'twitter', label: 'Twitter/X URL', type: 'text' },
    ];
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const links = SOCIAL_LINKS
      .filter((l) => this.data[l.key])
      .map((l) => ({
        label: l.label,
        icon: l.icon,
        url: this.data[l.key],
      }));

    const html = links.map(
      (l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" class="btn btn-secondary social-link" aria-label="${l.label}">
        <i data-lucide="${l.icon}"></i>
        <span>${l.label}</span>
      </a>`
    ).join('');

    this.element.innerHTML = `
      <div class="widget-section widget-section--center">
        <h2 class="widget-section-title">Connect</h2>
        <div class="social-links">
          ${html || '<p class="social-empty">Add your social links</p>'}
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  destroy() {
    this.element?.remove();
  }
}
