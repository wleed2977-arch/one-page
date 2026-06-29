import { escapeHtml } from '../utils/escape.js';
import { resolveMediaUrl } from '../utils/mediaUrl.js';

export class GalleryWidget {
  constructor(data = {}) {
    this.data = {
      images: data.images || [],
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new GalleryWidget(data);
  }

  toJSON() {
    return { images: this.data.images };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-gallery';
    this.element.dataset.widgetType = 'gallery';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'images', label: 'Gallery images', type: 'image-list' },
    ];
  }

  update(newData) {
    if (newData.images) {
      this.data.images = newData.images;
    }

    const imgs = (this.data.images || []).map(
      (url) => `<img src="${escapeHtml(resolveMediaUrl(url))}" alt="Gallery" loading="lazy">`
    ).join('');

    this.element.innerHTML = `
      <div class="widget-section">
        <h2 class="widget-section-title">Gallery</h2>
        <div class="gallery-grid">${imgs || '<p class="gallery-empty">No images yet</p>'}</div>
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
