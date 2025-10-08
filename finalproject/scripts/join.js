// join page script: set timestamp and membership modal behavior
export function initJoin() {
  // set timestamp on form
  const ts = document.getElementById('timestampHidden');
  if (ts) ts.value = new Date().toISOString();

  // membership modal
  const levelDialog = document.getElementById('levelDialog');
  const levelContent = document.getElementById('levelContent');
  const closeBtn = document.getElementById('closeLevelDialog');

  document.querySelectorAll('.open-level').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const level = btn.dataset.level;
      showLevel(level);
    });
  });

  function showLevel(level) {
    const benefits = {
      np: '<h2 id="levelTitle">Non-Profit</h2><p>No fee. Community listing & event access.</p>',
      bronze: '<h2 id="levelTitle">Bronze</h2><p>Basic listing, event access, newsletter mention.</p>',
      silver: '<h2 id="levelTitle">Silver</h2><p>Featured spotlight, reduced event fees, social posts.</p>',
      gold: '<h2 id="levelTitle">Gold</h2><p>Premium spotlight, priority placement, bespoke promotion.</p>'
    };
    levelContent.innerHTML = benefits[level] || '<p>No details available.</p>';
    levelDialog.showModal();
  }

  closeBtn?.addEventListener('click', () => levelDialog.close());

  // close clicking backdrop
  levelDialog?.addEventListener('click', (e) => {
    const rect = levelDialog.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
      levelDialog.close();
    }
  });
}
