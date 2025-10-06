
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('discover-grid');
  const template = document.getElementById('card-template');
  const visitMessage = document.getElementById('visit-message');
  const dialog = document.getElementById('details-dialog');
  const closeDialogBtn = document.getElementById('close-dialog');

  // JSON data file (local)
  const dataUrl = 'data/discover.json';

  // -- localStorage visit message logic --
  const LAST_KEY = 'chamber_last_visit';
  const now = Date.now();
  const last = Number(localStorage.getItem(LAST_KEY) || 0);
  if (!last) {
    visitMessage.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor((now - last) / msPerDay);
    if (days === 0) visitMessage.textContent = 'Back so soon! Awesome!';
    else if (days === 1) visitMessage.textContent = 'You last visited 1 day ago.';
    else visitMessage.textContent = `You last visited ${days} days ago.`;
  }
  localStorage.setItem(LAST_KEY, String(now));

  // helper: create picture element with webp srcset and fallback <img>
  function createPicture(imageBase, altText) {
    // imageBase is like 'item1' - we will expect images/item1.webp and images/item1@2x.webp
    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = `images/${imageBase}.webp 1x, images/${imageBase}@2x.webp 2x`;
    picture.appendChild(source);

    const img = document.createElement('img');
    img.src = `images/${imageBase}.webp`; // fallback if browser supports webp
    img.alt = altText;
    img.width = 300;
    img.height = 200;
    img.loading = 'lazy';
    img.decoding = 'async';
    picture.appendChild(img);
    return picture;
  }

  // open dialog with item details
  function openDetails(item) {
    document.getElementById('dialog-title').textContent = item.title;
    document.getElementById('dialog-address').textContent = item.address;
    document.getElementById('dialog-desc').textContent = item.description;
    const dialogImg = document.getElementById('dialog-img');
    dialogImg.src = `images/${item.image}`; // using single image for dialog
    dialogImg.alt = `${item.title} image`;
    // showModal is accessible — trap focus is browser-handled
    try {
      dialog.showModal();
      // set focus to close button for accessibility
      closeDialogBtn.focus();
    } catch (err) {
      // fallback if dialog not supported: alert
      alert(`${item.title}\n\n${item.address}\n\n${item.description}`);
    }
  }

  closeDialogBtn?.addEventListener('click', () => dialog.close());
  // close when clicking backdrop
  dialog?.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    if (!(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom)) {
      dialog.close();
    }
  });

  // fetch JSON and build 8 cards
  async function loadPlaces() {
    try {
      const res = await fetch(dataUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // ensure we have exactly 8 (if remote gives >8, take first 8)
      const items = Array.isArray(data) ? data.slice(0, 8) : [];
      if (!items.length) {
        grid.innerHTML = '<p>No places found.</p>';
        return;
      }

      // create DOM cards
      items.forEach((item, index) => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('.place-card');
        // assign data-area attribute for named grid on large screens
        // rotate areas deterministically by index (a..h)
        const areaNames = ['a','b','c','d','e','f','g','h'];
        article.setAttribute('data-area', areaNames[index % areaNames.length]);

        const titleEl = clone.querySelector('.place-title');
        const addrEl = clone.querySelector('.place-address');
        const descEl = clone.querySelector('.place-desc');
        const figureEl = clone.querySelector('.place-figure');
        const btn = clone.querySelector('.learn-btn');

        titleEl.textContent = item.title;
        addrEl.textContent = item.address;
        descEl.textContent = item.description;
        // create picture element and append
        const picture = createPicture(item.image.replace(/\.webp$/,''), item.title);
        figureEl.appendChild(picture);

        btn.addEventListener('click', () => openDetails(item));

        grid.appendChild(clone);
      });

    } catch (err) {
      console.error('Failed to load places:', err);
      grid.innerHTML = '<p class="error">Unable to load gallery at this time.</p>';
    }
  }

  loadPlaces();
});
