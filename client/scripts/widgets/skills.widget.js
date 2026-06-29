import { escapeHtml } from '../utils/escape.js';

export class SkillsWidget {
  constructor(data = {}) {
    this.data = {
      items: data.items || [
        { name: 'JavaScript', level: 80 },
        { name: 'HTML/CSS', level: 90 },
      ],
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new SkillsWidget(data);
  }

  toJSON() {
    return { items: this.data.items };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-skills';
    this.element.dataset.widgetType = 'skills';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      {
        name: 'items',
        label: 'Skills',
        type: 'list',
        itemLabel: 'Skill',
        addLabel: '+ Add skill',
        itemFields: [
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'level', label: 'Level', type: 'range', min: 0, max: 100 },
        ],
      },
    ];
  }

  update(newData) {
    if (newData.items) {
      this.data.items = newData.items;
    }

    const bars = (this.data.items || []).map(
      (s) => `
      <div class="skill-item">
        <div class="skill-header">
          <span>${escapeHtml(s.name)}</span>
          <span>${s.level || 50}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" style="width: ${Math.min(100, s.level || 50)}%;"></div>
        </div>
      </div>`
    ).join('');

    this.element.innerHTML = `
      <div class="widget-section">
        <h2 class="widget-section-title">Skills</h2>
        ${bars}
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
