// scripts/join.js
document.addEventListener('DOMContentLoaded', () => {
  // set timestamp hidden field
  const tsInput = document.getElementById('ts');
  if (tsInput) {
    const now = new Date();
    // store ISO + readable form
    tsInput.value = now.toISOString();
  }

  // Updates footer year and lastModified if present
  const yearEl = document.getElementById('currentyear');
  const lastEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = document.lastModified || 'Not available';

  // Modal wiring
  const modalOpeners = Array.from(document.querySelectorAll('.more-link, .level-card'));
  modalOpeners.forEach(op => {
    op.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') e.preventDefault();
      const modalId = op.dataset?.modal || op.getAttribute('data-modal') || e.currentTarget.getAttribute('data-modal') || e.target.getAttribute('data-modal');
      if (!modalId) return;
      const dialog = document.getElementById(modalId);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        // place focus on close button
        const closeBtn = dialog.querySelector('.close-dialog');
        if (closeBtn) closeBtn.focus();
      }
    });

    // also allow keyboard "Enter" to open (cards are role=button and tabbable)
    op.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        op.click();
      }
    });
  });

  // Close buttons + backdrop click + Escape handling
  const dialogs = Array.from(document.querySelectorAll('dialog'));
  dialogs.forEach(dialog => {
    // close button inside dialog
    const closeBtn = dialog.querySelector('.close-dialog');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    // click outside the content (detect click coordinates)
    dialog.addEventListener('click', (e) => {
      // locate bounding rect of dialog content
      const rect = dialog.getBoundingClientRect();
      const clickedInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!clickedInside) dialog.close();
    });

    // close on Escape is native, but ensure focus management
    dialog.addEventListener('close', () => {
      // return focus to the opener (best-effort: find any opener data-modal)
      const opener = document.querySelector(`[data-modal="${dialog.id}"]`);
      if (opener) opener.focus();
    });
  });

  // Basic form client-side pattern hinting for accessibility (optional)
  const form = document.getElementById('joinForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Let browser do the validation; if invalid, focus first invalid element
      if (!form.checkValidity()) {
        e.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
      }
      // otherwise, allow GET submission to thankyou.html
    });
  }
});
