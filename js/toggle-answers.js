// toggle-answers.js
document.addEventListener('DOMContentLoaded', () => {
  // Auto-number only .qa-list
  document.querySelectorAll('.qa-list li').forEach((li, i) => {
    const num = document.createElement('span');
    num.className = 'qa-number';
    num.textContent = (i + 1) + '. ';
    li.prepend(num);
  });

  // Handle all toggle buttons independently
  document.querySelectorAll('.toggle-answers').forEach(button => {
    button.addEventListener('click', () => {
      const container = button.closest('.qa-section');
      if (!container) return;

      const answers = container.querySelectorAll('.answer');
      if (answers.length === 0) return;

      const show = answers[0].classList.contains('hidden');
      answers.forEach(a => a.classList.toggle('hidden', !show));
      button.textContent = show ? 'Hide Answers' : 'Show Answers';
    });
  });

  // Click to toggle single answers (for all list types)
  document.querySelectorAll('.qa-list li, .qa-list-nonum li, .q-list li').forEach(li => {
    const question = li.querySelector('strong');
    if (!question) return;
    question.style.cursor = 'pointer';
    question.addEventListener('click', () => {
      const ans = li.querySelector('.answer');
      if (ans) ans.classList.toggle('hidden');
    });
  });
});
