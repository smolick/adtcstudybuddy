// js/footer.js
export async function loadFooter() {
  const resp = await fetch('/footer.html');
  if (!resp.ok) throw new Error('Failed to load footer');
  const html = await resp.text();
  document
    .getElementById('footer-placeholder')
    .insertAdjacentHTML('afterbegin', html);
}
