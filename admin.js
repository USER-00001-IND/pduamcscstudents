function createInputField(labelText, value, type = 'text') {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `<span>${labelText}</span>`;

  if (type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.value = value || '';
    wrapper.appendChild(textarea);
  } else {
    const input = document.createElement('input');
    input.type = type;
    input.value = value || '';
    wrapper.appendChild(input);
  }

  return wrapper;
}

function createListItem(index, item, fields, onRemove) {
  const container = document.createElement('div');
  container.className = 'editor-item';

  const title = document.createElement('span');
  title.textContent = `${fields.title}: ${index + 1}`;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => onRemove(index));
  title.appendChild(removeButton);

  container.appendChild(title);

  fields.fields.forEach(field => {
    const input = createInputField(field.label, item[field.key] || '', field.type);
    input.querySelector(field.type === 'textarea' ? 'textarea' : 'input').dataset.fieldKey = field.key;
    container.appendChild(input);
  });

  return container;
}

function createEditorSection(title, items, fields, containerId, onAdd, onRemove) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach((item, index) => {
    const row = createListItem(index, item, fields, onRemove);
    container.appendChild(row);
  });

  const addButton = document.getElementById(`add-${containerId}`);
  if (addButton) {
    addButton.onclick = onAdd;
  }
}

function gatherListData(containerId, fields) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  return Array.from(container.children).map(item => {
    const data = {};
    fields.forEach(field => {
      const input = item.querySelector(`input[data-field-key="${field.key}"]`) || item.querySelector(`textarea[data-field-key="${field.key}"]`);
      data[field.key] = input ? input.value.trim() : '';
    });
    return data;
  }).filter(item => Object.values(item).some(value => value));
}

function loadAdminConfig() {
  return getSiteConfig();
}

function saveAdminConfig(config) {
  saveSiteConfig(config);
  applySiteConfig();
  const status = document.getElementById('adminStatus');
  if (status) {
    status.textContent = 'Settings saved locally. Refresh any open page to see updates.';
  }
}

function renderAdmin() {
  const config = loadAdminConfig();

  const newsTickerInput = document.getElementById('adminNewsTicker');
  const welcome1Input = document.getElementById('adminWelcome1');
  const welcome2Input = document.getElementById('adminWelcome2');

  newsTickerInput.value = config.newsTicker;
  welcome1Input.value = config.welcomeParagraphs[0] || '';
  welcome2Input.value = config.welcomeParagraphs[1] || '';

  createEditorSection(
    'Notifications',
    config.notifications,
    { title: 'Notification', fields: [
      { label: 'Text', key: 'text' },
      { label: 'Link', key: 'href' }
    ] },
    'notificationEditor',
    () => {
      config.notifications.push({ text: '', href: '' });
      renderAdmin();
    },
    index => {
      config.notifications.splice(index, 1);
      renderAdmin();
    }
  );

  createEditorSection(
    'Resources',
    config.resources,
    { title: 'Resource', fields: [
      { label: 'Text', key: 'text' },
      { label: 'Link', key: 'href' }
    ] },
    'resourceEditor',
    () => {
      config.resources.push({ text: '', href: '' });
      renderAdmin();
    },
    index => {
      config.resources.splice(index, 1);
      renderAdmin();
    }
  );

  createEditorSection(
    'Gallery',
    config.gallery,
    { title: 'Gallery item', fields: [
      { label: 'Image source', key: 'src' },
      { label: 'Alt text', key: 'alt' },
      { label: 'Link', key: 'href' }
    ] },
    'galleryEditor',
    () => {
      config.gallery.push({ src: '', alt: '', href: '' });
      renderAdmin();
    },
    index => {
      config.gallery.splice(index, 1);
      renderAdmin();
    }
  );
}

function updateAdminConfig() {
  const config = loadAdminConfig();
  config.newsTicker = document.getElementById('adminNewsTicker').value.trim();
  config.welcomeParagraphs = [
    document.getElementById('adminWelcome1').value.trim(),
    document.getElementById('adminWelcome2').value.trim()
  ];
  config.notifications = gatherListData('notificationEditor', [
    { key: 'text' },
    { key: 'href' }
  ]);
  config.resources = gatherListData('resourceEditor', [
    { key: 'text' },
    { key: 'href' }
  ]);
  config.gallery = gatherListData('galleryEditor', [
    { key: 'src' },
    { key: 'alt' },
    { key: 'href' }
  ]);
  saveAdminConfig(config);
}

function downloadConfig() {
  const config = loadAdminConfig();
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'site-config.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function clearSiteConfig() {
  resetSiteConfig();
  renderAdmin();
  const status = document.getElementById('adminStatus');
  if (status) {
    status.textContent = 'Local configuration cleared. Site reset to defaults.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdmin();

  document.getElementById('saveConfigBtn').addEventListener('click', updateAdminConfig);
  document.getElementById('resetConfigBtn').addEventListener('click', () => {
    const config = resetSiteConfig();
    renderAdmin();
    applySiteConfig();
    const status = document.getElementById('adminStatus');
    if (status) status.textContent = 'Configuration reset to default values.';
  });
  document.getElementById('exportConfigBtn').addEventListener('click', downloadConfig);
  document.getElementById('clearConfigBtn').addEventListener('click', clearSiteConfig);
});
