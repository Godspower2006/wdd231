// scripts/discover.js
document.addEventListener('DOMContentLoaded', () => {
  const DATA_URL = 'data/discover.json';
  const gridEl = document.getElementById('discover-grid');
  const visitEl = document.getElementById('visit-message');
  const dialog = document.getElementById('placeDialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogImg = document.getElementById('dialog-img');
  const dialogAddress = document.getElementById('dialog-address');
  const dialogDesc = document.getElementById('dialog-desc');
  const closeDialogBtn = document.getElementById('closeDialog');

  // set year & last modified if present
  const yearEl = document.getElementById('currentyear');
  const lastEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = document.lastModified || 'Not available';

  // --- localStorage visit message ---
  function showVisitMessage() {
    const key = 'ac_last_visit';
    const now = Date.now();
    const prev = localStorage.getItem(key);
    let message = 'Welcome! Let us know if you have any questions.';
    if (prev) {
      const diffMs = now - Number(prev);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 1) {
        message = 'Back so soon! Awesome!';
      } else if (diffDays === 1) {
        message = 'You last visited 1 day ago.';
      } else {
        message = `You last visited ${diffDays} days ago.`;
      }
    }
    visitEl.textContent = message;
    localStorage.setItem(key, String(now));
  }

  showVisitMessage();

  // --- fetch JSON and render cards ---
  async function loadPlaces() {
    try {
      gridEl.setAttribute('aria-busy', 'true');
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderCards(data);
    } catch (err) {
      console.error('Failed to load places:', err);
      gridEl.innerHTML = '<p class="muted">Unable to load places at this time.</p>';
    } finally {
      gridEl.setAttribute('aria-busy', 'false');
    }
  }

  function createCard(place, index) {
    const article = document.createElement('article');
    article.className = 'place-card';
    const areaName = `a${(index % 8) + 1}`; // a1..a8 (keeps layout stable)
    article.dataset.area = areaName;
    article.setAttribute('tabindex', 0);

    const figure = document.createElement('figure');
    figure.className = 'place-figure';
    const img = document.createElement('img');
    img.src = `images/${place.image}`;
    img.alt = place.name + ' photo';
    img.width = 300;
    img.height = 200;
    img.loading = 'lazy';
    img.decoding = 'async';
    figure.appendChild(img);

    const h2 = document.createElement('h2');
    h2.className = 'place-title';
    h2.textContent = place.name;

    const addr = document.createElement('address');
    addr.className = 'place-address small muted';
    addr.textContent = place.address;

    const p = document.createElement('p');
    p.className = 'small';
    p.textContent = place.description;

    const btn = document.createElement('button');
    btn.className = 'learn-btn';
    btn.type = 'button';
    btn.textContent = 'Learn more';
    btn.addEventListener('click', () => openDialog(place));
    // keyboard accessible: Enter key on card opens dialog
    article.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openDialog(place);
    });

    article.appendChild(figure);
    article.appendChild(h2);
    article.appendChild(addr);
    article.appendChild(p);
    article.appendChild(btn);

    return article;
  }

  function renderCards(list) {
    gridEl.innerHTML = '';
    if (!Array.isArray(list) || list.length === 0) {
      gridEl.innerHTML = '<p>No places found.</p>';
      return;
    }
    // ensure exactly 8 areas map: even if list is >8 still assign a1..a8 round-robin
    list.slice(0, 8).forEach((place, i) => {
      const card = createCard(place, i);
      gridEl.appendChild(card);
    });
  }

  // --- dialog handling ---
  function openDialog(place) {
    dialogTitle.textContent = place.name;
    dialogImg.src = `images/${place.image}`;
    dialogImg.alt = `${place.name} photo`;
    dialogAddress.textContent = place.address;
    dialogDesc.textContent = place.fullDescription || place.description || '';
    // show modal
    try {
      dialog.showModal();
    } catch (err) {
      // fallback for browsers not supporting showModal
      dialog.setAttribute('open', '');
    }
    // move focus into dialog
    closeDialogBtn.focus();
  }

  function closeDialog() {
    try {
      dialog.close();
    } catch (err) {
      dialog.removeAttribute('open');
    }
  }

  closeDialogBtn.addEventListener('click', closeDialog);

  // close dialog if clicking backdrop
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  // close on Escape via dialog 'cancel' event (supported)
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeDialog();
  });

  // load data
  loadPlaces();
});
