document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = 'data/members.json';
  const directoryEl = document.getElementById('directory');
  const gridBtn = document.getElementById('gridView');
  const listBtn = document.getElementById('listView');
  const levelFilter = document.getElementById('levelFilter');
  const searchInput = document.getElementById('searchInput');
  const yearEl = document.getElementById('currentyear');
  const lastEl = document.getElementById('lastModified');

  let members = [];
  let currentView = 'grid';

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = document.lastModified || 'Not available';

  /* mark directory as a list for assistive tech */
  if (directoryEl) {
    directoryEl.setAttribute('role', 'list');
  }

  async function loadMembers() {
    try {
      directoryEl.setAttribute('aria-busy', 'true');
      const res = await fetch(dataUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      members = await res.json();
      renderMembers(members);
    } catch (err) {
      console.error('Failed to load members:', err);
      directoryEl.innerHTML = '<p class="error">Unable to load directory data at this time.</p>';
    } finally {
      directoryEl.setAttribute('aria-busy', 'false');
    }
  }

  function levelText(level) {
    return level === 3 ? 'Gold' : level === 2 ? 'Silver' : 'Member';
  }

  function createMemberCard(m) {
    const article = document.createElement('article');
    article.className = `member-card level-${m.level}`;
    // semantics for listview/listitem
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.innerHTML = `
      <div class="card-media">
        <img src="images/${m.image}" alt="${m.name} logo" width="480" height="270" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="member-name"><a href="${m.website}" target="_blank" rel="noopener">${m.name}</a></h3>
        <p class="member-meta">${m.address}</p>
        <p class="member-meta">Phone: <a href="tel:${m.phone.replace(/\D/g,'')}">${m.phone}</a></p>
        <p class="member-category">Category: ${m.category} • ${levelText(m.level)}</p>
        <p class="member-notes">${m.notes || ''}</p>
      </div>
    `;
    return article;
  }

  function renderMembers(list) {
    directoryEl.innerHTML = '';
    if (!list.length) {
      directoryEl.innerHTML = '<p>No members found.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(m => frag.appendChild(createMemberCard(m)));
    directoryEl.appendChild(frag);

    // set view class on directory (grid vs list)
    directoryEl.classList.toggle('list-view', currentView === 'list');
    directoryEl.classList.toggle('grid-view', currentView === 'grid');

    // update directory ARIA role/label for current view (helpful to AT users)
    directoryEl.setAttribute('aria-label', currentView === 'list' ? 'Member list view' : 'Member grid view');
  }

  function applyFilters() {
    let out = members.slice();
    const level = levelFilter.value;
    const q = (searchInput.value || '').toLowerCase().trim();

    if (level !== 'all') out = out.filter(m => String(m.level) === level);
    if (q) out = out.filter(m => (m.name + ' ' + m.address + ' ' + m.category + ' ' + (m.notes || '')).toLowerCase().includes(q));
    renderMembers(out);

    // move focus to directory after filter/toggle so keyboard users know content updated
    if (directoryEl) directoryEl.focus();
  }

  // helper to toggle buttons (also used for keyboard events)
  function setView(view) {
    currentView = view;
    gridBtn.setAttribute('aria-pressed', view === 'grid' ? 'true' : 'false');
    listBtn.setAttribute('aria-pressed', view === 'list' ? 'true' : 'false');
    applyFilters();
  }

  // mouse & keyboard support for toggle buttons
  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => setView('grid'));
    listBtn.addEventListener('click', () => setView('list'));

    // keyboard activation (Space or Enter)
    [gridBtn, listBtn].forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
      });
      // ensure they are focusable
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('role', 'button');
    });
  }

  if (levelFilter) levelFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  loadMembers();
});
