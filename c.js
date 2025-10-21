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
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable image dragging
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('draggable', 'false');
  });
});

// Disable common download/view source shortcuts
sdocument.addEventListener('keydown', function (e) {
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



// Example: you can add interactive behavior
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    alert(`You clicked on ${card.querySelector('h3').innerText}'s card!`);
  });
});
// Enhanced form.js with Formspree support

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Stop page reload

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        alert('Thanks for your message! I will get back to you soon.');
        form.reset();
      } else {
        alert('Oops! Something went wrong.');
      }
    } catch (error) {
      alert('Error submitting the form. Please try again later.');
      console.error(error);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);

    status.textContent = 'Sending...';
    status.style.color = 'black';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        status.textContent = 'Thanks for your message! I will get back to you soon.';
        status.style.color = 'green';
        form.reset();
      } else {
        status.textContent = 'Oops! Something went wrong.';
        status.style.color = 'red';
      }
    } catch (error) {
      status.textContent = 'Error submitting the form. Please try again later.';
      status.style.color = 'red';
      console.error(error);
    }
  });
});


