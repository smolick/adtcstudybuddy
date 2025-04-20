// parallax-tilt.js
const container = document.querySelector('.parallax-container');
const card      = container.querySelector('.content');

container.addEventListener('mousemove', e => {
  const rect = container.getBoundingClientRect();
  const xRel = (e.clientX - rect.left)  / rect.width  - 0.5;  // -0.5 → +0.5
  const yRel = (e.clientY - rect.top)   / rect.height - 0.5;

  const rotateY =  xRel * 12;  // max ±12°
  const rotateX = -yRel * 8;   // max ±8°
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

container.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
});
