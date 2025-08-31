// scripts/date.js
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentyear');
  const lastEl = document.getElementById('lastModified');

  if (yearEl) {
    const now = new Date();
    yearEl.textContent = now.getFullYear();
  }

  if (lastEl) {
    lastEl.textContent = 'Last modified: ' + document.lastModified;
  }
});
