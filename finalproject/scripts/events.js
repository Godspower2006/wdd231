// scripts/events.js
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('events-list');
  const dialog = document.getElementById('event-details');
  const eventContent = document.getElementById('event-content');
  const closeBtn = document.getElementById('closeEvent');

  if (!listEl || !dialog || !eventContent) return;

  // Attempt to fetch data/events.json, otherwise fallback to inline events
  async function getEvents() {
    const fallback = [
      {
        id: 'opening-night',
        title: 'Opening Night: Group Show',
        date: '2025-10-10',
        time: '18:00',
        location: 'Main Gallery, Artist Collective',
        image: 'images/event1.webp',
        description: 'Celebrate the new group exhibition featuring local painters and mixed-media artists. Drinks and light snacks provided. RSVP recommended.'
      },
      {
        id: 'artist-talk',
        title: 'Artist Talk: Studio Practice',
        date: '2025-11-12',
        time: '19:00',
        location: 'Second Room, Artist Collective',
        image: 'images/event2.webp',
        description: 'A conversation with three exhibiting artists about process, inspiration, and the local arts scene.'
      },
      {
        id: 'holiday-market',
        title: 'Holiday Market',
        date: '2025-12-14',
        time: '10:00',
        location: 'Riverside Park / Outdoor Annex',
        image: 'images/event3.webp',
        description: 'Local makers and artists sell prints, ceramics, and small works — perfect for holiday gifts.'
      }
    ];

    try {
      const res = await fetch('data/events.json');
      if (!res.ok) throw new Error('No events.json, using fallback');
      const data = await res.json();
      return Array.isArray(data) && data.length ? data : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function createCard(ev) {
    const article = document.createElement('article');
    article.className = 'event-card';
    article.innerHTML = `
      <figure>
        <img src="${ev.image}" alt="${ev.title} image" width="300" height="200" loading="lazy">
      </figure>
      <div class="event-body">
        <h3>${ev.title}</h3>
        <p class="event-meta"><strong>Date:</strong> ${ev.date} • <strong>Time:</strong> ${ev.time}</p>
        <p class="event-meta"><strong>Location:</strong> ${ev.location}</p>
        <p class="event-meta">${(ev.description || '').slice(0, 120)}${ev.description && ev.description.length > 120 ? '…' : ''}</p>
        <p><button class="btn" data-id="${ev.id}">Learn more</button></p>
      </div>
    `;
    return article;
  }

  function openDialog(ev) {
    eventContent.innerHTML = `
      <h2 id="event-title">${ev.title}</h2>
      <p><strong>Date:</strong> ${ev.date} • <strong>Time:</strong> ${ev.time}</p>
      <p><strong>Location:</strong> ${ev.location}</p>
      <figure style="margin:0.5rem 0">
        <img src="${ev.image}" alt="${ev.title} image" loading="lazy" width="800" height="450" style="max-width:100%;height:auto;border-radius:6px">
      </figure>
      <p style="margin-top:.6rem">${ev.description || ''}</p>
      <p><a class="btn" href="join.html">RSVP / Join</a></p>
    `;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        // fallback: make dialog visible
        dialog.setAttribute('open', '');
      }
      // focus inside dialog
      const first = dialog.querySelector('a, button, [tabindex]') || dialog;
      if (first) first.focus();
    } catch (err) {
      console.error('Dialog show error', err);
    }
  }

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    // close when clicking on backdrop (dialog element receives click where target === dialog)
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dialog.close();
  });

  // load and render
  (async () => {
    const events = await getEvents();
    listEl.innerHTML = '';
    events.forEach(ev => listEl.appendChild(createCard(ev)));

    // attach event listeners for learn more buttons
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.dataset.id;
      const ev = events.find(x => x.id === id);
      if (ev) openDialog(ev);
    });
  })();
});
