document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');

  if (!navButton || !navBar) return;

  navButton.addEventListener('click', () => {
    const shown = navBar.classList.toggle('show');
    navButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navBar.classList.contains('show')) {
      navBar.classList.remove('show');
      navButton.setAttribute('aria-expanded', 'false');
      navButton.focus();
    }
  });

  // wayfinding: set aria-current for current link
  const navLinks = navBar.querySelectorAll('a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current || (href === '' && current === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
});
