import { escapeHtml } from '../utils/escape.js';

export class ResumeWidget {
  constructor(data = {}) {
    this.data = {
      resumeUrl: data.resumeUrl || '',
      buttonText: data.buttonText || 'Download Resume',
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new ResumeWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-resume';
    this.element.dataset.widgetType = 'resume';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'resumeUrl', label: 'Resume URL (PDF)', type: 'text' },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
    ];
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const { resumeUrl, buttonText } = this.data;
    this.element.innerHTML = `
      <div class="widget-section" style="text-align: center;">
        <h2 class="widget-section-title">Resume</h2>
        ${resumeUrl
          ? `<a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener" class="btn btn-primary">${escapeHtml(buttonText)}</a>`
          : '<p style="color: var(--color-text-secondary);">Add your resume URL</p>'}
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
