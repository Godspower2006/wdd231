// scripts/course.js
// Example course array — replace/add courses as needed.
const courses = [
  { id: 1, code: 'WDD131', title: 'Foundations: HTML & CSS', credits: 3, category: 'WDD', completed: true },
  { id: 2, code: 'WDD132', title: 'JavaScript Basics', credits: 3, category: 'WDD', completed: false },
  { id: 3, code: 'CSE101', title: 'Intro to Programming', credits: 4, category: 'CSE', completed: true },
  { id: 4, code: 'CSE120', title: 'Data Structures', credits: 4, category: 'CSE', completed: false }
];

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('course-list');
  const creditsEl = document.getElementById('creditsTotal');
  const btnAll = document.getElementById('filter-all');
  const btnWdd = document.getElementById('filter-wdd');
  const btnCse = document.getElementById('filter-cse');

  if (!listEl) return;

  function renderCourseCards(arr) {
    listEl.innerHTML = '';
    arr.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card' + (course.completed ? ' completed' : '');
      card.innerHTML = `
        <div class="meta">
          <strong>${course.code}</strong> — <span class="title">${course.title}</span>
        </div>
        <div class="info">
          <span class="credits">${course.credits} cr</span>
        </div>
      `;
      listEl.appendChild(card);
    });

    // total credits (reduce)
    const total = arr.reduce((sum, c) => sum + Number(c.credits || 0), 0);
    if (creditsEl) creditsEl.textContent = total;
  }

  // initial render
  renderCourseCards(courses);

  // filters
  btnAll?.addEventListener('click', () => renderCourseCards(courses));
  btnWdd?.addEventListener('click', () => renderCourseCards(courses.filter(c => c.category === 'WDD')));
  btnCse?.addEventListener('click', () => renderCourseCards(courses.filter(c => c.category === 'CSE')));
});
