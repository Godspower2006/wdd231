// scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');
  const navLinks = navBar ? navBar.querySelectorAll('a') : [];

  // Toggle mobile nav
  if (navButton && navBar) {
    navButton.addEventListener('click', () => {
      const shown = navBar.classList.toggle('show');
      navButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
      navButton.classList.toggle('show', shown);
    });

    // Close nav on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navBar.classList.contains('show')) {
        navBar.classList.remove('show');
        navButton.classList.remove('show');
        navButton.setAttribute('aria-expanded', 'false');
        navButton.focus();
      }
    });
  }

  // Wayfinding helpers
  function clearCurrent() {
    navLinks.forEach(a => {
      a.parentElement.classList.remove('current');
      a.removeAttribute('aria-current');
    });
  }

  // On click: mark current and close mobile nav
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If link is external (target="_blank"), still mark nearest logical nav item
      clearCurrent();
      link.parentElement.classList.add('current');
      link.setAttribute('aria-current', 'page');

      if (navBar && navBar.classList.contains('show')) {
        navBar.classList.remove('show');
        navButton.classList.remove('show');
        navButton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // On load: mark the nav item that matches the current file name
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    // Match index.html also for root
    if (hrefFile === currentPath || (hrefFile === 'index.html' && currentPath === '')) {
      clearCurrent();
      link.parentElement.classList.add('current');
      link.setAttribute('aria-current', 'page');
    }
  });
});
