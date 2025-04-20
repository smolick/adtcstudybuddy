// flash.js
(async () => {
  if (document.readyState === 'loading') {
    await new Promise(r => document.addEventListener('DOMContentLoaded', r));
  }

  const prettyNames = {
    needtoknow:         "100% Need to Know!",
    acronyms:           "Acronyms",
    fars:               "FARs",
    test:               "Test",
    test2:              "Test2",
    airportminimums:    "Airport Minimums",
    cfrparts:           "14 CFR Parts",
    acperformance:      "B737-800 Performance",
    b738specslimits:    "B737-800 Specs/Limits",
    wxproductsnoimages: "WX Products (No Images)",
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
    const side = flipped ? 'back' : 'front';
    // ← here’s the key change ↓
    document.getElementById('cardContent').innerHTML =
      flashcards[currentIndex][side];
    const wrapper = document.getElementById('flashcard');
    wrapper.className = `flashcard ${side}`;
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

  // build checkboxes & counts…
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

})();
