import { WIDGET_LABELS, WIDGET_ICONS, createWidget, widgetToPayload } from '../widgets/index.js';
import { pagesApi } from '../api/pages.api.js';
import { showToast } from '../utils/toast.js';
import { applyTheme } from '../utils/theme.js';
import { renderPropertiesPanel } from '../builder/propertiesPanel.js';

const EMPTY_STATE_HTML = `
  <div class="empty-state" id="canvas-empty">
    <i data-lucide="mouse-pointer-click"></i>
    <h3>No widgets added yet</h3>
    <p>Select a widget from the sidebar to add it to your page.</p>
  </div>
`;

export const BuilderPage = {
  widgetInstances: [],
  selectedInstance: null,
  isDirty: false,
  pageSlug: '',
  _beforeUnloadHandler: null,
  _navigateHandler: null,

  render: async () => {
    const widgetItems = Object.entries(WIDGET_LABELS)
      .map(([type, label]) => `
        <div class="builder-widget-item" data-widget="${type}">
          <i data-lucide="${WIDGET_ICONS[type] || 'box'}"></i> ${label}
        </div>`)
      .join('');

    return `
      <div class="builder-container" id="builder-root">
        <div class="builder-mobile-tabs" id="builder-mobile-tabs">
          <button type="button" class="builder-mobile-tab active" data-panel="widgets">Widgets</button>
          <button type="button" class="builder-mobile-tab" data-panel="preview">Preview</button>
          <button type="button" class="builder-mobile-tab" data-panel="properties">Properties</button>
        </div>

        <aside class="builder-sidebar builder-panel builder-panel--widgets" data-panel="widgets">
          <div class="builder-sidebar-header">
            <span>Widgets</span>
            <a href="/dashboard" data-link class="btn btn-ghost btn-icon builder-back-link" title="Back">
              <i data-lucide="arrow-left"></i>
            </a>
          </div>
          <div class="builder-widget-list">${widgetItems}</div>
        </aside>

        <main class="builder-preview builder-panel builder-panel--preview active" data-panel="preview">
          <header class="builder-preview-header">
            <h3>Preview</h3>
            <div class="builder-preview-actions">
              <button type="button" id="view-live-btn" class="btn btn-ghost" hidden>
                <i data-lucide="external-link"></i> View live
              </button>
              <button type="button" id="save-site-btn" class="btn btn-secondary">
                <i data-lucide="save"></i> Save
              </button>
              <button type="button" id="export-site-btn" class="btn btn-primary">
                <i data-lucide="download"></i> Export
              </button>
            </div>
          </header>
          <div class="builder-preview-scroll">
            <div class="builder-preview-canvas builder-canvas" id="builder-canvas">${EMPTY_STATE_HTML}</div>
          </div>
        </main>

        <aside class="builder-properties builder-panel builder-panel--properties" data-panel="properties">
          <div class="builder-properties-header">Properties</div>
          <div class="builder-properties-body" id="properties-panel">
            <p class="properties-placeholder">Select a widget to edit its properties.</p>
          </div>
        </aside>
      </div>
    `;
  },

  markDirty() {
    BuilderPage.isDirty = true;
  },

  clearDirty() {
    BuilderPage.isDirty = false;
  },

  confirmLeave() {
    if (!BuilderPage.isDirty) return true;
    return window.confirm('You have unsaved changes. Leave without saving?');
  },

  cleanup() {
    if (BuilderPage._beforeUnloadHandler) {
      window.removeEventListener('beforeunload', BuilderPage._beforeUnloadHandler);
      BuilderPage._beforeUnloadHandler = null;
    }
    if (BuilderPage._navigateHandler) {
      window.removeEventListener('click', BuilderPage._navigateHandler, true);
      BuilderPage._navigateHandler = null;
    }
  },

  setMobilePanel(panelName) {
    document.querySelectorAll('.builder-mobile-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.panel === panelName);
    });
    document.querySelectorAll('.builder-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === panelName);
    });
  },

  afterRender: async () => {
    BuilderPage.cleanup();
    lucide.createIcons();
    BuilderPage.widgetInstances = [];
    BuilderPage.selectedInstance = null;
    BuilderPage.isDirty = false;
    BuilderPage.pageSlug = '';

    const canvas = document.getElementById('builder-canvas');
    const panel = document.getElementById('properties-panel');

    BuilderPage._beforeUnloadHandler = (e) => {
      if (BuilderPage.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', BuilderPage._beforeUnloadHandler);

    BuilderPage._navigateHandler = (e) => {
      const link = e.target.closest('[data-link]');
      if (!link || !BuilderPage.isDirty) return;
      if (!BuilderPage.confirmLeave()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('click', BuilderPage._navigateHandler, true);

    document.querySelectorAll('.builder-mobile-tab').forEach((tab) => {
      tab.addEventListener('click', () => BuilderPage.setMobilePanel(tab.dataset.panel));
    });

    const updateEmptyState = () => {
      if (BuilderPage.widgetInstances.length === 0) {
        canvas.innerHTML = EMPTY_STATE_HTML;
        lucide.createIcons();
      }
    };

    const updateSelectionHighlight = () => {
      canvas.querySelectorAll('[data-widget-type]').forEach((el) => {
        el.classList.remove('widget--selected');
      });
      if (BuilderPage.selectedInstance?.element) {
        BuilderPage.selectedInstance.element.classList.add('widget--selected');
      }
    };

    const showPropertiesPlaceholder = () => {
      panel.innerHTML = '<p class="properties-placeholder">Select a widget to edit its properties.</p>';
    };

    const openPropertiesPanel = (widgetInstance) => {
      BuilderPage.selectedInstance = widgetInstance;
      updateSelectionHighlight();
      BuilderPage.setMobilePanel('properties');

      renderPropertiesPanel({
        panel,
        widgetInstance,
        onDirty: () => BuilderPage.markDirty(),
        onMoveUp: async () => {
          await BuilderPage.moveWidget(widgetInstance, -1);
        },
        onMoveDown: async () => {
          await BuilderPage.moveWidget(widgetInstance, 1);
        },
        onDelete: async () => {
          BuilderPage.removeWidget(widgetInstance);
          BuilderPage.selectedInstance = null;
          updateSelectionHighlight();
          showPropertiesPlaceholder();
          BuilderPage.markDirty();
          try {
            await BuilderPage.saveWidgets();
            BuilderPage.clearDirty();
          } catch (err) {
            showToast(err.message || 'Save failed', 'error');
          }
        },
      });
    };

    BuilderPage.addWidgetToCanvas = (widgetInstance) => {
      if (BuilderPage.widgetInstances.length === 0) {
        canvas.innerHTML = '';
      }
      const el = widgetInstance.render();
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openPropertiesPanel(widgetInstance);
      });
      canvas.appendChild(el);
      BuilderPage.widgetInstances.push(widgetInstance);
      BuilderPage.markDirty();
      openPropertiesPanel(widgetInstance);
    };

    BuilderPage.removeWidget = (widgetInstance) => {
      const idx = BuilderPage.widgetInstances.indexOf(widgetInstance);
      if (idx > -1) BuilderPage.widgetInstances.splice(idx, 1);
      widgetInstance.destroy();
      updateEmptyState();
    };

    BuilderPage.moveWidget = async (widgetInstance, direction) => {
      const idx = BuilderPage.widgetInstances.indexOf(widgetInstance);
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= BuilderPage.widgetInstances.length) return;
      const el = widgetInstance.element;
      const sibling = BuilderPage.widgetInstances[newIdx].element;
      if (direction < 0) {
        canvas.insertBefore(el, sibling);
      } else {
        canvas.insertBefore(sibling, el);
      }
      BuilderPage.widgetInstances.splice(idx, 1);
      BuilderPage.widgetInstances.splice(newIdx, 0, widgetInstance);
      updateSelectionHighlight();
      BuilderPage.markDirty();
      try {
        await BuilderPage.saveWidgets();
        BuilderPage.clearDirty();
      } catch (err) {
        showToast(err.message || 'Save failed', 'error');
      }
    };

    BuilderPage.saveWidgets = async () => {
      const widgets = BuilderPage.widgetInstances.map((w, i) => widgetToPayload(w, i));
      await pagesApi.saveWidgets(widgets);
    };

    document.querySelectorAll('.builder-widget-item').forEach((item) => {
      item.addEventListener('click', () => {
        const type = item.dataset.widget;
        const instance = createWidget(type);
        if (instance) BuilderPage.addWidgetToCanvas(instance);
      });
    });

    document.getElementById('save-site-btn').addEventListener('click', async () => {
      const btn = document.getElementById('save-site-btn');
      btn.disabled = true;
      try {
        await BuilderPage.saveWidgets();
        BuilderPage.clearDirty();
        showToast('Page saved!', 'success');
      } catch (err) {
        showToast(err.message || 'Save failed', 'error');
      }
      btn.disabled = false;
    });

    document.getElementById('view-live-btn')?.addEventListener('click', () => {
      if (BuilderPage.pageSlug) {
        window.open(`/p/${BuilderPage.pageSlug}`, '_blank', 'noopener');
      }
    });

    document.getElementById('export-site-btn').addEventListener('click', async () => {
      const exportBtn = document.getElementById('export-site-btn');
      try {
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<i data-lucide="loader"></i> Exporting...';
        lucide.createIcons();
        await BuilderPage.saveWidgets();
        BuilderPage.clearDirty();

        canvas.querySelectorAll('.widget--selected').forEach((el) => {
          el.classList.remove('widget--selected');
        });
        const html = canvas.innerHTML;
        if (BuilderPage.selectedInstance?.element) {
          BuilderPage.selectedInstance.element.classList.add('widget--selected');
        }

        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const res = await fetch('/api/v1/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ html, theme }),
        });
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-onepage-site.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast('Site exported!', 'success');
      } catch (err) {
        showToast('Export failed', 'error');
      } finally {
        exportBtn.disabled = false;
        exportBtn.innerHTML = '<i data-lucide="download"></i> Export';
        lucide.createIcons();
      }
    });

    try {
      const res = await pagesApi.getMyPage();
      if (res.success && res.data.page) {
        BuilderPage.pageSlug = res.data.page.slug || '';
        const viewBtn = document.getElementById('view-live-btn');
        if (viewBtn && BuilderPage.pageSlug) viewBtn.hidden = false;

        if (res.data.page.themeName) {
          applyTheme(res.data.page.themeName);
        }
        if (res.data.page.widgets?.length) {
          canvas.innerHTML = '';
          res.data.page.widgets.forEach((w) => {
            const instance = createWidget(w.type, w.data);
            if (instance) {
              const el = instance.render();
              el.addEventListener('click', (ev) => {
                ev.stopPropagation();
                openPropertiesPanel(instance);
              });
              canvas.appendChild(el);
              BuilderPage.widgetInstances.push(instance);
            }
          });
        }
        BuilderPage.clearDirty();
      }
    } catch (err) {
      showToast('Could not load saved page', 'error');
    }
  },
};
