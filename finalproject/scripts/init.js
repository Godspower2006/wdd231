// scripts/init.js
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const y = document.getElementById('currentyear');
  if (y) y.textContent = new Date().getFullYear();

  // Set timestamp hidden field on join form
  const ts = document.getElementById('ts');
  if (ts) ts.value = new Date().toISOString();

  // If this page has formResult placeholders, populate them using URLSearchParams
  const params = new URLSearchParams(window.location.search);
  if ([...params].length > 0) {
    const resName = document.getElementById('res-name');
    if (resName) {
      const get = (k) => params.get(k) || '—';
      resName.textContent = `${get('first')} ${get('last')}`.trim();
      document.getElementById('res-email')?.textContent = get('email');
      document.getElementById('res-phone')?.textContent = get('phone');
      document.getElementById('res-org')?.textContent = get('organization');
      document.getElementById('res-level')?.textContent = get('level');
      document.getElementById('res-ts')?.textContent = get('timestamp') || new Date().toISOString();
      document.getElementById('formResult').style.display = 'block';
      const form = document.getElementById('joinForm');
      if (form) form.style.display = 'none';
    }
  }
});
