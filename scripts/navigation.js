// scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.getElementById('nav-button');
  const navBar = document.getElementById('nav-bar');

  if (!navButton || !navBar) return;

  navButton.addEventListener('click', () => {
    const isShown = navBar.classList.toggle('show'); // used for small screens
    navButton.classList.toggle('show');
    navButton.setAttribute('aria-expanded', isShown ? 'true' : 'false');
  });
});
