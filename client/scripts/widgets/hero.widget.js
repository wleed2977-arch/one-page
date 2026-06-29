import { escapeHtml } from '../utils/escape.js';

export class HeroWidget {
  constructor(data = {}) {
    this.data = {
      headline: 'Welcome to my site',
      subheadline: 'I build things.',
      ctaText: 'Contact Me',
      ...data,
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new HeroWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-hero';
    this.element.dataset.widgetType = 'hero';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'headline', label: 'Headline', type: 'text' },
      { name: 'subheadline', label: 'Subheadline', type: 'text' },
      { name: 'ctaText', label: 'Button Text', type: 'text' },
    ];
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const { headline, subheadline, ctaText } = this.data;
    this.element.innerHTML = `
      <div class="hero-content">
        <h1 class="widget-headline">${escapeHtml(headline)}</h1>
        <p class="widget-subheadline">${escapeHtml(subheadline)}</p>
        ${ctaText ? `<button type="button" class="btn btn-primary hero-cta">${escapeHtml(ctaText)}</button>` : ''}
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
