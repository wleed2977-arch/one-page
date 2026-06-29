export class DividerWidget {
  constructor(data = {}) {
    this.data = {
      style: data.style || 'line',
    };
    this.element = null;
  }

  static fromJSON(data) {
    return new DividerWidget(data);
  }

  toJSON() {
    return { ...this.data };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-divider';
    this.element.dataset.widgetType = 'divider';
    this.element.style.cursor = 'pointer';
    this.update(this.data);
    return this.element;
  }

  getPropertiesSchema() {
    return [
      { name: 'style', label: 'Style', type: 'select', options: [
        { value: 'line', label: 'Line' },
        { value: 'dots', label: 'Dots' },
      ]},
    ];
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    const isDots = this.data.style === 'dots';
    this.element.innerHTML = `
      <div class="widget-section" style="padding: 1rem 2rem;">
        ${isDots
          ? '<div class="divider-dots">• • •</div>'
          : '<hr>'}
      </div>
    `;
  }

  destroy() {
    this.element?.remove();
  }
}
