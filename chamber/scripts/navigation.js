document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');
  const navLinks = navBar ? navBar.querySelectorAll('a') : [];

  if (navButton && navBar) {
    navButton.addEventListener('click', () => {
      const shown = navBar.classList.toggle('show');
      navButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
      if (shown) {
        // move focus into the first nav link for keyboard users
        const first = navBar.querySelector('a');
        if (first) first.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navBar.classList.contains('show')) {
        navBar.classList.remove('show');
        navButton.setAttribute('aria-expanded', 'false');
        navButton.focus();
      }
    });
  }

  function clearCurrent() {
    navLinks.forEach(a => {
      const li = a.closest('li');
      if (li) li.classList.remove('current');
      a.removeAttribute('aria-current');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      clearCurrent();
      const li = link.closest('li');
      if (li) li.classList.add('current');
      link.setAttribute('aria-current', 'page');
      if (navBar && navBar.classList.contains('show')) {
        navBar.classList.remove('show');
        navButton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // set current based on URL filename
  const currentPath = window.location.pathname.split('/').pop() || 'directory.html';
  navLinks.forEach(link => {
    const hrefFile = link.getAttribute('href')?.split('/').pop();
    if (hrefFile === currentPath) {
      clearCurrent();
      const li = link.closest('li');
      if (li) li.classList.add('current');
      link.setAttribute('aria-current', 'page');
    }
  });
});
