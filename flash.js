// flash.js
(async () => {
  if (document.readyState === 'loading') {
    await new Promise(r => document.addEventListener('DOMContentLoaded', r));
  }

  const prettyNames = {
    needtoknow:		        	"100% Need to Know!",
    acronyms:		       		"Acronyms",
    fars:						"FARs",
    test:						"Test",
    test2:						"Test2",
    airportminimums:			"Airport Minimums",
    cfrparts:					"14 CFR Parts",
    acperformance:				"B737-800 Performance",
    b738specslimits:			"B737-800 Specs/Limits",
    wxproductsnoimages:			"WX Products (No Images)",
	airportdiagram:				"Airport Diagram",
	weatherrelatedconditions:	"WX Related Conditions",
	theatmosphere:				"The Atmosphere",
  };
  const categoryNames = Object.keys(prettyNames);

  const categoryData = {};
  await Promise.all(categoryNames.map(async key => {
    try {
      const m = await import(`./flashcards/${key}.js`);
      categoryData[key] = m[key] ?? m.default ?? [];
    } catch {
      console.error(`Failed to load "${key}"`);
      categoryData[key] = [];
    }
  }));

  let flashcards = [], currentIndex = 0, flipped = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

function showCard() {
  if (!flashcards.length) return;
  const { front, back, marker } = flashcards[currentIndex];
  const side = flipped ? back : front;
  const container = document.getElementById('cardContent');
  container.innerHTML = side;
  container.querySelectorAll('.marker')?.forEach(el => el.remove());

if (!flipped && marker) {
  const m = document.createElement('div');
  m.className   = 'marker';
  m.textContent = marker.id;
  m.style.top   = marker.top;
  m.style.left  = marker.left;
  container.appendChild(m);
}

  document.getElementById('flashcard').className = `flashcard ${flipped ? 'back' : 'front'}`;
  document.getElementById('progressIndicator').textContent =
    `Card ${currentIndex + 1} of ${flashcards.length}`;
  }


  function handleClickZone(direction) {
    if (!flashcards.length) return;
    if (direction === 'forward') {
      flipped ? (currentIndex = (currentIndex + 1) % flashcards.length, flipped = false)
              : (flipped = true);
    } else {
      flipped ? (flipped = false)
              : (currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length,
                 flipped = true);
    }
    showCard();
  }

  function startSelectedStudy() {
    const sel = [];
    if (document.getElementById('check-all').checked) {
      sel.push(...Object.values(categoryData).flat());
    } else {
      categoryNames.forEach(key => {
        if (document.getElementById(`check-${key}`).checked) {
          sel.push(...categoryData[key]);
        }
      });
    }
    if (!sel.length) return alert("Please select at least one category.");
    flashcards   = shuffle(sel.slice());
    currentIndex = 0;
    flipped      = false;
    document.getElementById('flashcardRow').style.display = 'block';
    showCard();
  }

  const section  = document.querySelector('.category-section');
  const btnGroup = section.querySelector('.button-group');

  const allLabel = document.createElement('label');
  allLabel.innerHTML = `
    <input type="checkbox" id="check-all">
    All <span id="count-all"></span>
  `;
  section.insertBefore(allLabel, section.firstChild);

  categoryNames.forEach(key => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `
      <input type="checkbox" id="check-${key}">
      ${prettyNames[key]} <span id="count-${key}"></span>
    `;
    section.insertBefore(lbl, btnGroup);
  });

  const total = categoryNames.reduce((sum, k) => sum + categoryData[k].length, 0);
  document.getElementById('count-all').textContent = `(${total})`;
  categoryNames.forEach(k => {
    document.getElementById(`count-${k}`).textContent = `(${categoryData[k].length})`;
  });

  section.querySelectorAll('label').forEach(label => {
    const cb = label.querySelector('input[type="checkbox"]');
    label.classList.toggle('selected', cb.checked);
    cb.addEventListener('change', () => label.classList.toggle('selected', cb.checked));
  });

  window.startSelectedStudy = startSelectedStudy;
  window.handleClickZone   = handleClickZone;


  const flashRow = document.getElementById('flashcardRow');
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove Card';
  removeBtn.style.margin = '0.5rem';
  removeBtn.addEventListener('click', () => {
    if (!flashcards.length) return;
    flashcards.splice(currentIndex, 1);
    if (currentIndex >= flashcards.length) {
      currentIndex = flashcards.length - 1;
    }
flipped = false;
    if (flashcards.length === 0) {
      alert('All cards removed! No cards left.');
      flashRow.style.display = 'none';
    } else {
      showCard();
    }
  });
  const prog = document.getElementById('progressIndicator');
  prog.insertAdjacentElement('afterend', removeBtn);

})();
