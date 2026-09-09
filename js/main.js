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
          // Thresholds: 0-30% yellow (#ffb703), 31-69% orange (#fb8500), 70-100% light blue (#8ecae6)
          const color = pct >= 70 ? 'blue' : pct >= 31 ? 'orange' : 'yellow';
          const circumference = 251.3;
          const validPct = Math.min(100, Math.max(0, pct));
          const offset = (circumference - (validPct / 100) * circumference).toFixed(1);

          grid.innerHTML += `
            <div class="tracker-item tracker-item-square">
              <h4 class="tracker-class-name">${klasse.name}</h4>
              <div class="tracker-circle-container">
                <svg class="tracker-ring" viewBox="0 0 96 96" width="96" height="96" aria-hidden="true">
                  <circle class="tracker-ring-bg" cx="48" cy="48" r="40" />
                  <circle class="tracker-ring-fill ${color}" cx="48" cy="48" r="40"
                          stroke-dasharray="251.3"
                          stroke-dashoffset="${offset}" />
                </svg>
                <div class="tracker-pct-center">
                  <span class="tracker-pct-number">${pct}</span><span class="tracker-pct-sign">%</span>
                </div>
              </div>
              <div class="tracker-badge">
                <span class="tracker-count">${klasse.teilnehmer} / ${klasse.gesamt}</span>
                <span class="tracker-unit">${labelUnit}</span>
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
