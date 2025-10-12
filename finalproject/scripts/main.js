
const fetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
};

const galleryContainer = document.getElementById('gallery');
const discoverContainer = document.getElementById('discoverGrid');
const dialog = document.getElementById('detailDialog');

function createGalleryCard(item) {
  const article = document.createElement('article');
  article.className = 'art-card';
  article.tabIndex = 0;
  article.innerHTML = `
    <figure>
      <img src="${item.image}" alt="${item.title} by ${item.artist}" width="420" height="280" loading="lazy">
      <figcaption>
        <h3>${item.title}</h3>
        <p class="muted">${item.artist} • ${item.year}</p>
        <p class="muted">${item.category} • ${item.price}</p>
      </figcaption>
    </figure>
  `;
  article.addEventListener('click', () => showDetail(item));
  article.addEventListener('keydown', (e) => { if (e.key === 'Enter') showDetail(item); });
  return article;
}

function showDetail(item) {
  if (!dialog) return;
  dialog.innerHTML = '';
  dialog.innerHTML = `
    <button id="closeDialog" class="close">❌</button>
    <div class="dialog-body">
      <figure>
        <img src="${item.image}" alt="${item.title} by ${item.artist}" width="640" height="420" loading="lazy">
        <figcaption>
          <h2 id="dialogTitle">${item.title}</h2>
          <p><strong>Artist:</strong> ${item.artist}</p>
          <p><strong>Year:</strong> ${item.year}</p>
          <p><strong>Category:</strong> ${item.category}</p>
          <p>${item.description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
        </figcaption>
      </figure>
    </div>
  `;
  const closeBtn = document.getElementById('closeDialog');
  closeBtn.focus();
  closeBtn.addEventListener('click', () => dialog.close());
  // close when clicking backdrop
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) dialog.close();
  }, { once: true });
  dialog.showModal();
}

async function buildGallery() {
  if (!galleryContainer) return;
  const items = await fetchJson('data/items.json');
  if (!items) { galleryContainer.innerHTML = '<p class="error">Unable to load gallery.</p>'; return; }
  // ensure we display at least 15 items (requirement)
  const list = items.slice(0, 15);
  galleryContainer.innerHTML = '';
  list.forEach(i => galleryContainer.appendChild(createGalleryCard(i)));
}

// discover page builder with grid-template-areas support
function createDiscoverCard(place) {
  const article = document.createElement('article');
  article.className = 'place-card';
  article.innerHTML = `
    <figure class="place-figure">
      <img src="${place.image}" alt="${place.name}" width="300" height="200" loading="lazy">
      <figcaption>
        <h3>${place.name}</h3>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button class="learn" data-name="${place.name}">Learn more</button>
      </figcaption>
    </figure>
  `;
  return article;
}

async function buildDiscover() {
  if (!discoverContainer) return;
  const places = await fetchJson('data/discover.json');
  if (!places) { discoverContainer.innerHTML = '<p class="error">Unable to load discover data.</p>'; return; }
  discoverContainer.innerHTML = '';
  places.forEach(p => discoverContainer.appendChild(createDiscoverCard(p)));
  // visitor message via localStorage
  displayVisitMessage();
}

function daysBetween(nowMs, previousMs) {
  const diff = nowMs - previousMs;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function displayVisitMessage() {
  const key = 'artist_last_visit';
  const msgEl = document.getElementById('visitMessage');
  if (!msgEl) return;
  const now = Date.now();
  const last = parseInt(localStorage.getItem(key), 10);
  if (!last) {
    msgEl.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const days = daysBetween(now, last);
    if (days === 0) msgEl.textContent = "Back so soon! Awesome!";
    else if (days === 1) msgEl.textContent = "You last visited 1 day ago.";
    else msgEl.textContent = `You last visited ${days} days ago.`;
  }
  localStorage.setItem(key, String(now));
}

// membership modals (join page)
function initMembershipModals() {
  const openers = document.querySelectorAll('[data-modal-open]');
  openers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-modal-open');
      const d = document.getElementById(id);
      if (d && typeof d.showModal === 'function') {
        d.showModal();
        const close = d.querySelector('.close');
        if (close) close.addEventListener('click', () => d.close());
        d.addEventListener('click', (ev) => { if (ev.target === d) d.close(); }, { once: true });
      }
    });
  });
}

// initialize everything depending on page
document.addEventListener('DOMContentLoaded', async () => {
  // gallery page
  await buildGallery();
  // discover page
  await buildDiscover();
  // membership modals
  initMembershipModals();
});
