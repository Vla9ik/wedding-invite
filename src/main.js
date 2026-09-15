import './styles.css';
import { config, buildVenueMapUrl, venueMapLink } from './config.js';
import { readGuest } from './guest.js';
import { numericDate, prettyDate, renderCalendar } from './calendar.js';
import { initLetter, initPetals, initReveals } from './animations.js';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (location.hash) {
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}

window.scrollTo(0, 0);
requestAnimationFrame(() => window.scrollTo(0, 0));
window.addEventListener('load', () => {
  if (document.documentElement.classList.contains('is-intro')) {
    window.scrollTo(0, 0);
  }
}, { once: true });
window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.scrollTo(0, 0);
});

const guest = readGuest();

document.title = `${config.eventTitle} — ${config.bride}`;

document.querySelectorAll('[data-bride]').forEach((el) => {
  el.textContent = config.bride;
});
document.querySelectorAll('[data-event]').forEach((el) => {
  el.textContent = config.eventTitle;
});
document.querySelectorAll('[data-guest]').forEach((el) => {
  el.textContent = guest.ask;
});
document.querySelectorAll('[data-hello]').forEach((el) => {
  el.textContent = guest.hello;
});

const toLine = document.querySelector('.paper-to');
if (toLine) toLine.textContent = `${guest.greeting}!`;

const body = document.querySelector('[data-letter-body]');
if (body) body.textContent = config.letter.body;

document.querySelectorAll('[data-venue-title]').forEach((el) => {
  el.textContent = config.venue.title;
});
document.querySelectorAll('[data-venue-address]').forEach((el) => {
  el.textContent = config.venue.address;
});
document.querySelectorAll('[data-wedding-pretty]').forEach((el) => {
  el.textContent = prettyDate(config.weddingDate);
});
document.querySelectorAll('[data-wedding-numeric]').forEach((el) => {
  el.textContent = numericDate(config.weddingDate);
});
document.querySelectorAll('[data-wedding-time]').forEach((el) => {
  el.textContent = config.weddingTime;
});
const yesBtn = document.querySelector('[data-rsvp="yes"]');
if (yesBtn) yesBtn.textContent = guest.many ? 'Ооба, барабыз' : 'Ооба, барамын';

const mapFrame = document.querySelector('[data-map]');
if (mapFrame) {
  const loadMap = () => {
    mapFrame.src = buildVenueMapUrl();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadMap();
        observer.disconnect();
      },
      { rootMargin: '240px' },
    );
    observer.observe(mapFrame);
  } else {
    loadMap();
  }
}

const mapLink = document.querySelector('[data-map-link]');
if (mapLink) mapLink.href = venueMapLink();

renderCalendar(document.querySelector('[data-calendar="wedding"]'), config.weddingDate);

const portrait = document.querySelector('[data-bride-photo]');
if (portrait) {
  const img = new Image();
  img.alt = config.bride;
  img.onload = () => {
    portrait.style.backgroundImage = `url(${config.bridePhoto})`;
  };
  img.src = config.bridePhoto;
}

document.querySelectorAll('[data-photo]').forEach((figure) => {
  const i = Number(figure.dataset.photo);
  const src = config.photos[i]?.src;
  if (!src) return;
  const img = new Image();
  img.onload = () => {
    figure.style.backgroundImage = `url(${src})`;
  };
  img.src = src;
});

initPetals();
initReveals();
initLetter();
initScrollFabs();

function initScrollFabs() {
  const upBtn = document.querySelector('[data-scroll="up"]');
  const downBtn = document.querySelector('[data-scroll="down"]');
  if (!upBtn || !downBtn) return;

  const ids = ['hero', 'intro', 'wedding', 'letter', 'venue', 'rsvp'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const edge = 56;

  function step() {
    return Math.round(window.innerHeight * 0.78);
  }

  function currentIndex() {
    const mid = window.innerHeight * 0.42;
    let index = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= mid) index = i;
    });
    return index;
  }

  function atTop() {
    return window.scrollY <= 8;
  }

  function atBottom() {
    return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - edge;
  }

  function go(section) {
    if (!section) return;
    document.documentElement.classList.remove('is-intro');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function sync() {
    upBtn.hidden = atTop();
    downBtn.hidden = atBottom();
  }

  downBtn.addEventListener('click', () => {
    document.documentElement.classList.remove('is-intro');
    const index = currentIndex();
    const section = sections[index];
    const leftover = section ? section.getBoundingClientRect().bottom - window.innerHeight : 0;

    if (leftover > edge) {
      window.scrollBy({ top: Math.min(leftover, step()), behavior: 'smooth' });
      return;
    }

    if (sections[index + 1]) {
      go(sections[index + 1]);
      return;
    }

    window.scrollBy({ top: step(), behavior: 'smooth' });
  });

  upBtn.addEventListener('click', () => {
    const index = currentIndex();
    const section = sections[index];
    const leftover = section ? -section.getBoundingClientRect().top : 0;

    if (leftover > edge) {
      window.scrollBy({ top: -Math.min(leftover, step()), behavior: 'smooth' });
      return;
    }

    if (sections[index - 1]) {
      go(sections[index - 1]);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', sync, { passive: true });
  sync();
}
