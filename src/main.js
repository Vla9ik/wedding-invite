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
initSiteNav();

function initSiteNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const items = [...nav.querySelectorAll('[data-jump]')];
  const sections = items
    .map((item) => document.getElementById(item.dataset.jump))
    .filter(Boolean);

  function setActive(id) {
    items.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.jump === id);
    });
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.jump);
      if (!target) return;
      document.documentElement.classList.remove('is-intro');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(item.dataset.jump);
    });
  });

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
