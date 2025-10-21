const burger = document.getElementById("burger");
const sideNav = document.getElementById("sideNav");
const overlay = document.getElementById("overlay");

burger.addEventListener("click", () => {
  sideNav.style.left = "0";
  overlay.style.display = "block";
});

overlay.addEventListener("click", () => {
  sideNav.style.left = "-250px";
  overlay.style.display = "none";
});

// Disable right-click context menu
//document.addEventListener('contextmenu', event => event.preventDefault());

// Disable image dragging
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('draggable', 'false');
  });
});

// Disable common download/view source shortcuts
document.addEventListener('keydown', function (e) {
  // Block Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12
  if (
    (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U')) ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
    (e.key === 'F12')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});
