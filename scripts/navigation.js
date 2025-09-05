// scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');
  const navLinks = navBar ? navBar.querySelectorAll('a') : [];

  if (navButton && navBar) {
    navButton.addEventListener('click', () => {
      const shown = navBar.classList.toggle('show');
      navButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
      navButton.classList.toggle('show', shown);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navBar.classList.contains('show')) {
        navBar.classList.remove('show');
        navButton.classList.remove('show');
        navButton.setAttribute('aria-expanded', 'false');
        navButton.focus();
      }
    });
  }

  function clearCurrent() {
    navLinks.forEach(a => {
      a.parentElement.classList.remove('current');
      a.removeAttribute('aria-current');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
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

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const hrefFile = link.getAttribute('href')?.split('/').pop();
    if (hrefFile === currentPath || (hrefFile === 'index.html' && currentPath === '')) {
      clearCurrent();
      link.parentElement.classList.add('current');
      link.setAttribute('aria-current', 'page');
    }
  });
});
