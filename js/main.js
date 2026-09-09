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

  const stageMeta = [
    {
      theme: 'teal',
      sub_de: 'Klassen 1–3',
      sub_en: 'Grades 1–3',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c0-7 3-7 3-12"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5-.4-4.8-1.5-1.2-1.1-1.6-2.7-1.4-4.4 1.8-.2 3 .5 3.9 2.2z"/><path d="M14.1 6a7 7 0 0 1 1.1 4c-1.5 0-3-.5-4-1.7-.8-1-1.1-2.4-1-3.7 1.6-.2 2.9.2 3.9 1.4z"/></svg>'
    },
    {
      theme: 'amber',
      sub_de: 'Klassen 4–6',
      sub_en: 'Grades 4–6',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
    },
    {
      theme: 'orange',
      sub_de: 'Ab Klasse 7',
      sub_en: 'Grade 7+',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'
    }
  ];

  function renderTracker(data) {
    trackerContainer.innerHTML = '';
    data.gruppen.forEach((gruppe, idx) => {
      const meta = stageMeta[idx] || stageMeta[0];
      const stage = document.createElement('div');
      stage.className = `tracker-stage tracker-stage-${meta.theme}`;

      const stageName = lang === 'de' ? gruppe.name_de : gruppe.name_en;
      const stageSub = lang === 'de' ? meta.sub_de : meta.sub_en;

      stage.innerHTML = `
        <div class="tracker-stage-header">
          <div class="tracker-stage-badge">
            <span class="tracker-stage-icon">${meta.icon}</span>
            <h3 class="tracker-stage-title">${stageName}</h3>
            <span class="tracker-stage-tag">${stageSub}</span>
          </div>
        </div>
        <div class="tracker-grid"></div>
      `;

      const grid = stage.querySelector('.tracker-grid');

      gruppe.klassen.forEach(klasse => {
        const pct = klasse.gesamt > 0
          ? Math.round((klasse.teilnehmer / klasse.gesamt) * 100)
          : 0;
        // Thresholds: 0-30% yellow (#ffb703), 31-69% orange (#fb8500), 70-100% blue (#8ecae6)
        const color = pct >= 70 ? 'blue' : pct >= 31 ? 'orange' : 'yellow';
        const circumference = 251.3;
        const validPct = Math.min(100, Math.max(0, pct));
        const offset = (circumference - (validPct / 100) * circumference).toFixed(1);

        grid.innerHTML += `
          <div class="tracker-item tracker-item-square">
            <div class="tracker-class-pill">
              <span class="tracker-class-dot"></span>
              <h4 class="tracker-class-name">${klasse.name}</h4>
            </div>
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
          </div>`;
      });

      trackerContainer.appendChild(stage);
    });
  }

  const fallbackData = {
    "gruppen": [
      {
        "name_de": "Primarstufe 1",
        "name_en": "Primary Level 1 (Primarstufe 1)",
        "klassen": [
          { "name": "Weiße Drachen", "teilnehmer": 3, "gesamt": 20 },
          { "name": "Goldene Füchse", "teilnehmer": 5, "gesamt": 20 },
          { "name": "Grüne Murmelluchse", "teilnehmer": 14, "gesamt": 20 }
        ]
      },
      {
        "name_de": "Primarstufe 2",
        "name_en": "Primary Level 2 (Primarstufe 2)",
        "klassen": [
          { "name": "Klasse Orange", "teilnehmer": 11, "gesamt": 20 },
          { "name": "Klasse Rot", "teilnehmer": 4, "gesamt": 20 },
          { "name": "Klasse Türkis", "teilnehmer": 15, "gesamt": 20 }
        ]
      },
      {
        "name_de": "Sekundarstufe",
        "name_en": "Secondary Level (Sekundarstufe)",
        "klassen": [
          { "name": "Lerngruppe Aquila", "teilnehmer": 3, "gesamt": 10 },
          { "name": "Lerngruppe Dorado", "teilnehmer": 2, "gesamt": 10 },
          { "name": "Lerngruppe Columba", "teilnehmer": 4, "gesamt": 10 },
          { "name": "Lerngruppe Phönix", "teilnehmer": 6, "gesamt": 10 }
        ]
      }
    ]
  };

  fetch('data/klassen.json')
    .then(res => res.json())
    .then(renderTracker)
    .catch(() => {
      // Graceful fallback for local file:// protocol where fetch is blocked by browser CORS
      renderTracker(fallbackData);
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
