import './styles.css';
import { config } from './config.js';
import { readGuest } from './guest.js';
import { numericDate, prettyDate, renderCalendar } from './calendar.js';
import { initLetter, initPetals, initReveals } from './animations.js';

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
document.querySelector('[data-map]').src = config.venue.mapEmbed;

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

const reply = document.querySelector('[data-rsvp-reply]');
const yesText = 'Ура! Уже жду вас и берегу самое тёплое место.';
const noText = 'Очень жаль... буду скучать, но люблю вас так же сильно.';

document.querySelectorAll('[data-rsvp]').forEach((btn) => {
  btn.addEventListener('click', () => {
    reply.hidden = false;
    reply.textContent = btn.dataset.rsvp === 'yes' ? yesText : noText;
  });
});

initPetals();
initReveals();
initLetter();
