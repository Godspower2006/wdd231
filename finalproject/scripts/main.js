import { initGallery } from './gallery.js';
import { initJoin } from './join.js';

document.addEventListener('DOMContentLoaded', () => {
  // site-wide
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');
  if (navButton && navBar) {
    navButton.addEventListener('click', () => {
      const shown = navBar.classList.toggle('show');
      navButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
    });
  }

  // insert current year
  const yearEl = document.getElementById('currentyear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // page-specific init
  const page = document.body.dataset.page || '';
  if (page === 'gallery') {
    initGallery();
  } else if (page === 'index') {
    // load a few spotlights for home page
    // gallery.js exposes nothing else, but we can import and re-use
    initGallery(); // it will gracefully render spotlights if present
  } else if (page === 'join') {
    initJoin();
  } else if (page === 'thankyou') {
    // nothing extra
  }
});
