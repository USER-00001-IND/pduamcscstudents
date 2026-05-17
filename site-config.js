const SITE_CONFIG_KEY = 'pduamcscstudentsSiteConfig';
const DEFAULT_SITE_CONFIG = {
  newsTicker: '9th Freshman Social Day on 15th October',
  welcomeParagraphs: [
    'Welcome to the Student Corner of the Department of Computer Science at Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya, Amjonga! This space is especially created for students to stay connected, informed, and engaged with the academic life of the department.',
    'Whether you\'re a new student just starting your journey or a senior preparing for the next step, this platform offers essential updates, resources, and inspiration to help you grow and succeed.'
  ],
  notifications: [
    { text: '2025 Holiday List', href: 'F/Gauhati-University-Holiday-LIst-2025.pdf' },
    { text: 'Notice 2025/10/21', href: 'F/n2025-10-21.jpg' },
    { text: 'Freshers Postponed', href: 'F/Freshers Posponed.jpg' },
    { text: 'Tribute to Zubeen', href: 'F/Tribute to zubeen.jpg' }
  ],
  resources: [
    { text: 'Course material', href: 'S.html' },
    { text: 'Academic updates', href: 'A1.html' },
    { text: 'Student support', href: 'S1.html' }
  ],
  gallery: [
    { src: 'I/piC/spic.jpg', alt: 'Campus life image', href: 'I/piC/spic.jpg' },
    { src: 'I/piC/mz1.jpg', alt: 'Student activity photo', href: 'I/piC/mz1.jpg' },
    { src: 'I/piC/pic.jpg', alt: 'Classroom moment', href: 'I/piC/pic.jpg' }
  ]
};

function getSiteConfig() {
  try {
    const stored = localStorage.getItem(SITE_CONFIG_KEY);
    if (!stored) return DEFAULT_SITE_CONFIG;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load site config:', error);
    return DEFAULT_SITE_CONFIG;
  }
}

function saveSiteConfig(config) {
  localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
  return config;
}

function resetSiteConfig() {
  localStorage.removeItem(SITE_CONFIG_KEY);
  return getSiteConfig();
}

function buildLinkItem(item) {
  const anchor = document.createElement('a');
  anchor.href = item.href || '#';
  anchor.target = item.href && item.href.startsWith('http') ? '_blank' : '_self';
  anchor.rel = anchor.target === '_blank' ? 'noopener noreferrer' : '';
  anchor.textContent = item.text;
  return anchor;
}

function applySiteConfig() {
  const config = getSiteConfig();

  const ticker = document.getElementById('newsTicker');
  if (ticker) ticker.textContent = config.newsTicker;

  const notificationList = document.getElementById('notificationList');
  if (notificationList) {
    notificationList.innerHTML = '';
    config.notifications.forEach(item => {
      const li = document.createElement('li');
      li.appendChild(buildLinkItem(item));
      notificationList.appendChild(li);
    });
  }

  const resourceList = document.getElementById('resourceList');
  if (resourceList) {
    resourceList.innerHTML = '';
    config.resources.forEach(item => {
      const li = document.createElement('li');
      li.appendChild(buildLinkItem(item));
      resourceList.appendChild(li);
    });
  }

  const welcomeText = document.getElementById('welcomeText');
  if (welcomeText) {
    welcomeText.innerHTML = config.welcomeParagraphs
      .map(text => `<p>${text}</p>`)
      .join('');
  }

  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = '';
    config.gallery.forEach(item => {
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';
      const anchor = document.createElement('a');
      anchor.href = item.href || '#';
      anchor.target = item.href && item.href.startsWith('http') ? '_blank' : '_self';
      anchor.rel = anchor.target === '_blank' ? 'noopener noreferrer' : '';
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || 'Gallery image';
      anchor.appendChild(img);
      wrapper.appendChild(anchor);
      galleryGrid.appendChild(wrapper);
    });
  }
}

document.addEventListener('DOMContentLoaded', applySiteConfig);
