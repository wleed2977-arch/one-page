import { escapeHtml } from '../utils/escape.js';

export class ProjectsWidget {
  constructor(data = {}) {
    this.data = {
      items: data.items || [{ title: 'Project One', description: 'A cool project', link: '#' }],
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new ProjectsWidget(data);
  }

  toJSON() {
    return { items: this.data.items };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-projects';
    this.element.dataset.widgetType = 'projects';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      {
        name: 'items',
        label: 'Projects',
        type: 'list',
        itemLabel: 'Project',
        addLabel: '+ Add project',
        itemFields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'link', label: 'Link', type: 'text' },
        ],
      },
    ];
  }

  update(newData) {
    if (newData.items) {
      this.data.items = newData.items;
    }

    const cards = (this.data.items || []).map(
      (p) => `
      <div class="project-card">
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.description || '')}</p>
        ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" rel="noopener">View Project →</a>` : ''}
      </div>`
    ).join('');

    this.element.innerHTML = `
      <div class="widget-section">
        <h2 class="widget-section-title">Projects</h2>
        ${cards || '<p>No projects yet.</p>'}
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
