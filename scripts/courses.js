// scripts/courses.js
document.addEventListener('DOMContentLoaded', () => {
  const courses = [
    { code: "WDD130", title: "Introduction to Web Development", credits: 3, category: "WDD", completed: true },
    { code: "WDD131", title: "Responsive Design", credits: 3, category: "WDD", completed: true },
    { code: "WDD231", title: "Intermediate Web Foundations", credits: 3, category: "WDD", completed: false },
    { code: "CSE110", title: "Intro to Computer Science", credits: 4, category: "CSE", completed: true },
    { code: "CSE120", title: "Programming Fundamentals", credits: 3, category: "CSE", completed: false }
  ];

  const container = document.getElementById('courses-container');
  const creditTotalEl = document.getElementById('credit-total');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function render(list) {
    if (!container) return;
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = '<p>No courses found.</p>';
    } else {
      list.forEach(course => {
        const card = document.createElement('article');
        card.className = 'course-card' + (course.completed ? ' completed' : '');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${course.code} — ${course.title}; ${course.credits} credits; ${course.completed ? 'completed' : 'in progress'}`);
        card.innerHTML = `
          <h3>${course.code} — ${course.title}</h3>
          <p>Category: ${course.category} • Credits: ${course.credits}</p>
          <p>Status: <strong>${course.completed ? 'Completed' : 'In progress'}</strong></p>
        `;
        container.appendChild(card);
      });
    }

    // update credits (reduce)
    const totalCredits = list.reduce((sum, c) => sum + (c.credits || 0), 0);
    if (creditTotalEl) creditTotalEl.textContent = totalCredits;
  }

  // initial render
  render(courses);

  // filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter') || 'all';
      const out = f === 'all' ? courses : courses.filter(c => c.category === f);

      render(out);

      filterButtons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      // move focus to course list (wayfinding)
      container.focus && container.focus();
    });
  });
});
