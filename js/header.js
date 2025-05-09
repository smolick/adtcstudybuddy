// header.js
export async function loadHeader() {
	const resp = await fetch('header.html');
	if (!resp.ok) throw new Error('Could not load header');
		const html = await resp.text();
	document.body.insertAdjacentHTML('afterbegin', html);
}