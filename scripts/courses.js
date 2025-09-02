// scripts/course.js
const courses = [
  { id:1, code: 'WDD130', title: 'Introduction to Web Development', credits: 3, category: 'WDD', completed: true },
  { id:2, code: 'WDD131', title: 'Responsive Design', credits: 3, category: 'WDD', completed: true },
  { id:3, code: 'WDD231', title: 'Advanced Topics', credits: 3, category: 'WDD', completed: false },
  { id:4, code: 'CSE101', title: 'Intro to Programming', credits: 4, category: 'CSE', completed: true },
  { id:5, code: 'CSE120', title: 'Data Structures', credits: 4, category: 'CSE', completed: false }
];

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('course-list');
  const creditsEl = document.getElementById('creditsTotal');
  const btnAll = document.getElementById('filter-all');
  const btnWdd = document.getElementById('filter-wdd');
  const btnCse = document.getElementById('filter-cse');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderCourseCards(arr) {
    listEl.innerHTML = '';
    arr.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card' + (course.completed ? ' completed' : '');
      card.innerHTML = `
        <div>
          <strong>${course.code}</strong> — ${course.title}
        </div>
        <div>${course.credits} cr</div>
      `;
      listEl.appendChild(card);
    });
    const total = arr.reduce((s,c) => s + Number(c.credits || 0), 0);
    creditsEl.textContent = total;
  }

  // initial
  renderCourseCards(courses);

  // helper to toggle active button aria-pressed
  function setActiveButton(activeBtn) {
    filterButtons.forEach(b => {
      b.classList.toggle('active', b === activeBtn);
      b.setAttribute('aria-pressed', b === activeBtn ? 'true' : 'false');
    });
  }

  btnAll.addEventListener('click', () => {
    renderCourseCards(courses);
    setActiveButton(btnAll);
  });
  btnWdd.addEventListener('click', () => {
    renderCourseCards(courses.filter(c => c.category === 'WDD'));
    setActiveButton(btnWdd);
  });
  btnCse.addEventListener('click', () => {
    renderCourseCards(courses.filter(c => c.category === 'CSE'));
    setActiveButton(btnCse);
  });
});
