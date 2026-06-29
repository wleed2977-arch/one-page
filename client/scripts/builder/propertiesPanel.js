import { WIDGET_LABELS } from '../widgets/index.js';
import { uploadImageFile } from '../utils/uploadImage.js';
import { showToast } from '../utils/toast.js';
import { escapeHtml } from '../utils/escape.js';
import { resolveMediaUrl } from '../utils/mediaUrl.js';

const setPreviewImage = (preview, url) => {
  const resolved = resolveMediaUrl(url);
  if (!resolved) {
    preview.innerHTML = '<span class="builder-image-placeholder">No image</span>';
    return;
  }
  preview.innerHTML = `<img src="${escapeHtml(resolved)}" alt="">`;
  const img = preview.querySelector('img');
  img?.addEventListener('error', () => {
    preview.innerHTML = '<span class="builder-image-placeholder">Image failed to load</span>';
  }, { once: true });
};

const createImageField = (field, value, onChange) => {
  const group = document.createElement('div');
  group.className = 'input-group builder-image-field';

  const label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = field.label;

  const preview = document.createElement('div');
  preview.className = 'builder-image-preview';
  if (value) {
    setPreviewImage(preview, value);
  } else {
    preview.innerHTML = '<span class="builder-image-placeholder">No image</span>';
  }

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png,image/webp';
  fileInput.className = 'builder-file-input';
  fileInput.hidden = true;

  const uploadBtn = document.createElement('button');
  uploadBtn.type = 'button';
  uploadBtn.className = 'btn btn-secondary';
  uploadBtn.textContent = value ? 'Change image' : 'Upload image';

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    try {
      const url = await uploadImageFile(file);
      setPreviewImage(preview, url);
      uploadBtn.textContent = 'Change image';
      onChange(url);
      showToast('Image uploaded', 'success');
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
      uploadBtn.textContent = value ? 'Change image' : 'Upload image';
    }
    uploadBtn.disabled = false;
    fileInput.value = '';
  });

  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.className = 'input-field';
  urlInput.placeholder = 'Or paste image URL';
  urlInput.value = value || '';
  urlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    setPreviewImage(preview, url);
    onChange(url);
  });

  group.append(label, preview, uploadBtn, urlInput, fileInput);
  return group;
};

const createImageListField = (field, images, onChange) => {
  const group = document.createElement('div');
  group.className = 'input-group builder-image-list-field';

  const label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = field.label;

  const list = document.createElement('div');
  list.className = 'builder-image-list';

  let state = [...(images || [])];

  const sync = (next) => {
    state = next;
    onChange(next);
  };

  const renderList = () => {
    list.innerHTML = '';
    state.forEach((url, index) => {
      const item = document.createElement('div');
      item.className = 'builder-image-list-item';
      item.innerHTML = `<img src="${escapeHtml(resolveMediaUrl(url))}" alt="">`;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-sm';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        sync(state.filter((_, i) => i !== index));
        renderList();
      });
      item.appendChild(removeBtn);
      list.appendChild(item);
    });
  };

  renderList();

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png,image/webp';
  fileInput.hidden = true;

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-secondary';
  addBtn.textContent = '+ Upload image';

  addBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    addBtn.disabled = true;
    addBtn.textContent = 'Uploading...';
    try {
      const url = await uploadImageFile(file);
      sync([...state, url]);
      renderList();
      showToast('Image added', 'success');
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    }
    addBtn.disabled = false;
    addBtn.textContent = '+ Upload image';
    fileInput.value = '';
  });

  group.append(label, list, addBtn, fileInput);
  return group;
};

const createListField = (field, items, onChange) => {
  const group = document.createElement('div');
  group.className = 'input-group builder-list-field';

  const label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = field.label;

  const list = document.createElement('div');
  list.className = 'builder-list-items';

  let state = (items?.length ? items : [{}]).map((it) => ({ ...it }));

  const sync = (next) => {
    state = next;
    onChange(next);
  };

  const renderItems = () => {
    list.innerHTML = '';

    state.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'builder-list-item';

      const cardTitle = document.createElement('p');
      cardTitle.className = 'builder-list-item-title';
      cardTitle.textContent = `${field.itemLabel || 'Item'} ${index + 1}`;
      card.appendChild(cardTitle);

      field.itemFields.forEach((subField) => {
        const subGroup = document.createElement('div');
        subGroup.className = 'input-group';

        const subLabel = document.createElement('label');
        subLabel.className = 'input-label';
        subLabel.textContent = subField.label;

        let input;
        if (subField.type === 'textarea') {
          input = document.createElement('textarea');
          input.className = 'input-field';
          input.rows = 2;
          input.value = item[subField.name] || '';
        } else if (subField.type === 'range') {
          input = document.createElement('input');
          input.type = 'range';
          input.className = 'builder-range-input';
          input.min = subField.min ?? 0;
          input.max = subField.max ?? 100;
          input.value = item[subField.name] ?? 50;

          const valueLabel = document.createElement('span');
          valueLabel.className = 'builder-range-value';
          valueLabel.textContent = `${input.value}%`;
          input.addEventListener('input', () => {
            valueLabel.textContent = `${input.value}%`;
          });
          subGroup.append(subLabel, input, valueLabel);
          input.addEventListener('input', () => {
            sync(state.map((it, i) =>
              i === index ? { ...it, [subField.name]: Number(input.value) } : it
            ));
          });
          card.appendChild(subGroup);
          return;
        } else {
          input = document.createElement('input');
          input.className = 'input-field';
          input.type = subField.type || 'text';
          input.value = item[subField.name] || '';
        }

        input.addEventListener('input', () => {
          sync(state.map((it, i) =>
            i === index ? { ...it, [subField.name]: input.value } : it
          ));
        });

        subGroup.append(subLabel, input);
        card.appendChild(subGroup);
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-sm';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        const next = state.filter((_, i) => i !== index);
        sync(next.length ? next : [{}]);
        renderItems();
      });
      card.appendChild(removeBtn);
      list.appendChild(card);
    });
  };

  renderItems();

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-secondary';
  addBtn.textContent = field.addLabel || '+ Add item';
  addBtn.addEventListener('click', () => {
    sync([...state, {}]);
    renderItems();
  });

  group.append(label, list, addBtn);
  return group;
};

export const renderPropertiesPanel = ({
  panel,
  widgetInstance,
  onDirty,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const widgetType = widgetInstance.element?.dataset.widgetType;
  const widgetLabel = WIDGET_LABELS[widgetType] || widgetType;

  panel.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'builder-properties-widget-header';
  header.innerHTML = `<p class="builder-properties-widget-label">Editing</p><h4>${widgetLabel}</h4>`;
  panel.appendChild(header);

  const form = document.createElement('form');
  const schema = widgetInstance.getPropertiesSchema();

  schema.forEach((field) => {
    if (field.type === 'list') {
      const items = widgetInstance.data[field.name] || [];
      form.appendChild(
        createListField(field, items, (next) => {
          const cleaned = next.filter((it) => Object.values(it).some((v) => v !== '' && v != null));
          widgetInstance.update({ [field.name]: cleaned.length ? cleaned : next });
          onDirty();
        })
      );
      return;
    }

    if (field.type === 'image-list') {
      form.appendChild(
        createImageListField(field, widgetInstance.data[field.name] || [], (next) => {
          widgetInstance.update({ [field.name]: next });
          onDirty();
        })
      );
      return;
    }

    if (field.type === 'image') {
      form.appendChild(
        createImageField(field, widgetInstance.data[field.name] || '', (url) => {
          widgetInstance.update({ [field.name]: url });
          onDirty();
        })
      );
      return;
    }

    const group = document.createElement('div');
    group.className = 'input-group';
    const label = document.createElement('label');
    label.className = 'input-label';
    label.textContent = field.label;

    if (field.type === 'select') {
      const select = document.createElement('select');
      select.className = 'input-field';
      (field.options || []).forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });
      select.value = widgetInstance.data[field.name] || field.options?.[0]?.value || '';
      select.addEventListener('change', (e) => {
        widgetInstance.update({ [field.name]: e.target.value });
        onDirty();
      });
      group.append(label, select);
      form.appendChild(group);
      return;
    }

    if (field.type === 'action') {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'btn btn-secondary';
      actionBtn.textContent = field.buttonText;
      actionBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        actionBtn.disabled = true;
        try {
          await widgetInstance[field.actionName]();
          renderPropertiesPanel({ panel, widgetInstance, onDirty, onMoveUp, onMoveDown, onDelete });
          onDirty();
        } catch (err) {
          showToast(err.message || 'Action failed', 'error');
        }
        actionBtn.disabled = false;
      });
      group.append(label, actionBtn);
      form.appendChild(group);
      return;
    }

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'input-field';
      input.rows = 4;
      input.value = widgetInstance.data[field.name] || '';
    } else {
      input = document.createElement('input');
      input.className = 'input-field';
      input.type = field.type || 'text';
      input.value = widgetInstance.data[field.name] || '';
    }

    input.addEventListener('input', (e) => {
      widgetInstance.update({ [field.name]: e.target.value });
      onDirty();
    });

    group.append(label, input);
    form.appendChild(group);
  });

  const actions = document.createElement('div');
  actions.className = 'builder-widget-actions';

  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.className = 'btn btn-secondary';
  upBtn.innerHTML = '<i data-lucide="arrow-up"></i> Move up';
  upBtn.addEventListener('click', onMoveUp);

  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.className = 'btn btn-secondary';
  downBtn.innerHTML = '<i data-lucide="arrow-down"></i> Move down';
  downBtn.addEventListener('click', onMoveDown);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Delete widget';
  deleteBtn.addEventListener('click', onDelete);

  actions.append(upBtn, downBtn, deleteBtn);
  form.appendChild(actions);
  panel.appendChild(form);

  if (typeof lucide !== 'undefined') lucide.createIcons();
};
