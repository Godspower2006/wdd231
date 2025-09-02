// scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');

  if (!navButton || !navBar) return;

  navButton.addEventListener('click', () => {
    const isShown = navBar.classList.toggle('show');
    navButton.classList.toggle('show');
    navButton.setAttribute('aria-expanded', isShown ? 'true' : 'false');
  });

  // Close nav on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navBar.classList.contains('show')) {
      navBar.classList.remove('show');
      navButton.classList.remove('show');
      navButton.setAttribute('aria-expanded', 'false');
    }
  });
});
