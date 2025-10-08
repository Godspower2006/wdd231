import { fetchJSON, el } from './utils.js';

const DATA_URL = 'data/artworks.json';
const galleryList = document.getElementById('gallery-list');
const spotList = document.getElementById && document.getElementById('spotlight-list');
const itemDialog = document.getElementById('itemDialog');
const dialogContent = document.getElementById('dialogContent');
const closeItemDialog = document.getElementById('closeItemDialog');

export async function initGallery() {
  try {
    const items = await fetchJSON(DATA_URL);

    // show last-visit message (localStorage)
    showLastVisit();

    // render gallery (>= 15 items expected)
    renderGallery(items);

    // render 2-3 featured spotlights on home (if present)
    if (spotList) renderSpotlights(items.filter(i => i.featured));

  } catch (err) {
    console.error(err);
    if (galleryList) galleryList.innerHTML = '<p>Unable to load gallery at this time.</p>';
  }
}

function renderGallery(items) {
  if (!galleryList) return;
  galleryList.innerHTML = '';

  items.forEach(item => {
    const card = el('article', { class: 'art-card' },
      el('figure', {},
        Object.assign(document.createElement('img'), {
          src: `images/${item.image}`,
          alt: `${item.title} by ${item.artist}`,
          loading: 'lazy',
          width: 300,
          height: 200
        })
      ),
      el('div', { class: 'card-body' },
        el('h3', {}, item.title),
        el('p', { class: 'muted' }, `${item.artist} — ${item.year}`),
        el('p', {}, item.medium),
        el('button', { class: 'more', 'data-id': item.id }, 'Learn more')
      )
    );

    // event: open dialog
    card.querySelector('.more').addEventListener('click', () => showItemDetails(item));
    galleryList.appendChild(card);
  });
}

function showItemDetails(item) {
  dialogContent.innerHTML = `
    <h2 id="itemTitle">${item.title}</h2>
    <figure><img src="images/${item.image}" alt="${item.title} by ${item.artist}" width="600" height="400" loading="lazy"></figure>
    <p><strong>Artist:</strong> ${item.artist}</p>
    <p><strong>Year / Medium:</strong> ${item.year} — ${item.medium}</p>
    <p>${item.description}</p>
  `;
  itemDialog.showModal();
}

if (closeItemDialog) {
  closeItemDialog.addEventListener('click', () => itemDialog.close());
}

// clicking backdrop to close
itemDialog?.addEventListener('click', (e) => {
  const rect = itemDialog.getBoundingClientRect();
  if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
    itemDialog.close();
  }
});

// spotlights
function renderSpotlights(featured) {
  if (!spotList) return;
  const picks = featured.slice(0, Math.min(featured.length, 3));
  spotList.innerHTML = '';
  picks.forEach(f => {
    const d = el('div', { class: 'spotlight' },
      el('img', { src: `images/${f.image}`, alt: `${f.title} thumbnail`, loading: 'lazy', width: 180, height: 120 }),
      el('div', { class: 'spot-body' },
        el('h3', {}, f.title),
        el('p', {}, `${f.artist} — ${f.year}`),
        el('p', {}, f.medium),
        el('a', { href: 'gallery.html' }, 'View Gallery')
      )
    );
    spotList.appendChild(d);
  });
}

// localStorage last visit message
function showLastVisit() {
  try {
    const key = 'ac_last_visit';
    const now = Date.now();
    const prev = localStorage.getItem(key);
    const msgEl = document.getElementById('visit-message');
    if (!msgEl) return;
    if (!prev) {
      msgEl.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
      const days = Math.floor((now - Number(prev)) / (1000 * 60 * 60 * 24));
      if (days === 0) msgEl.textContent = 'Back so soon! Awesome!';
      else msgEl.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
    }
    localStorage.setItem(key, String(now));
  } catch (e) {
    console.warn('localStorage not available', e);
  }
}
