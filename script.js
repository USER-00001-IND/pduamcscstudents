const burger = document.getElementById('burger');
const sideNav = document.getElementById('sideNav');
const overlay = document.getElementById('overlay');
const closeNav = document.getElementById('closeNav');

function openNavigation() {
  document.body.classList.add('nav-open');
  burger.setAttribute('aria-expanded', 'true');
  sideNav.setAttribute('aria-hidden', 'false');
}

function closeNavigation() {
  document.body.classList.remove('nav-open');
  burger.setAttribute('aria-expanded', 'false');
  sideNav.setAttribute('aria-hidden', 'true');
}

function toggleNavigation() {
  if (document.body.classList.contains('nav-open')) {
    closeNavigation();
  } else {
    openNavigation();
  }
}

burger.addEventListener('click', toggleNavigation);
closeNav.addEventListener('click', closeNavigation);
overlay.addEventListener('click', closeNavigation);

document.querySelectorAll('.side-nav a').forEach(link => {
  link.addEventListener('click', closeNavigation);
});

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
    closeNavigation();
    return;
  }

  if (
    ((e.ctrlKey || e.metaKey) && ['s', 'S', 'u', 'U'].includes(e.key)) ||
    ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i'].includes(e.key)) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});
