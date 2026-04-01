// Load Google Fonts async (non-render-blocking)
var gf = document.createElement('link');
gf.rel = 'stylesheet';
gf.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Source+Sans+Pro:wght@400;600;700&display=swap';
document.head.appendChild(gf);

// Hamburger menu
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// Accordion
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// Tracker: load data from klassen.json
const trackerContainer = document.getElementById('tracker-container');
if (trackerContainer) {
  const lang = document.documentElement.lang;
  const labelUnit = lang === 'de' ? 'Eltern' : 'parents';

  fetch('data/klassen.json')
    .then(res => res.json())
    .then(data => {
      data.gruppen.forEach(gruppe => {
        const title = document.createElement('h3');
        title.className = 'tracker-group-title';
        title.textContent = lang === 'de' ? gruppe.name_de : gruppe.name_en;
        trackerContainer.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'tracker-grid';

        gruppe.klassen.forEach(klasse => {
          const pct = klasse.gesamt > 0
            ? Math.round((klasse.teilnehmer / klasse.gesamt) * 100)
            : 0;
          const color = pct >= 60 ? 'green' : pct >= 30 ? 'yellow' : 'red';

          grid.innerHTML += `
            <div class="tracker-item">
              <div class="tracker-label">
                <span>${klasse.name}</span>
                <span>${klasse.teilnehmer} / ${klasse.gesamt} ${labelUnit}</span>
              </div>
              <div class="tracker-bar">
                <div class="tracker-fill ${color}" style="width: ${pct}%"></div>
              </div>
            </div>`;
        });

        trackerContainer.appendChild(grid);
      });
    });
}

// Back to top button
var backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
