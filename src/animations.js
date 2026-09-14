import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const FALL_HTML = {
  petal: '',
  heart: '<svg viewBox="0 0 24 22"><path d="M12 20C4 14 1 9 1 5.5A5.2 5.2 0 0112 4a5.2 5.2 0 0111 1.5C23 9 20 14 12 20z"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 1l2.6 7.4H22l-6 4.6 2.4 7.5L12 16.8 5.6 20.5 8 13 2 8.4h7.4z"/></svg>',
  bow: '<svg viewBox="0 0 28 18"><path d="M14 9C8 2 2 3 2 8c0 4 5 4 12 1 7 3 12 3 12-1 0-5-6-6-12 1z"/><circle cx="14" cy="9" r="2.2"/></svg>',
  flower: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4.5" r="3"/><circle cx="12" cy="19.5" r="3"/><circle cx="4.5" cy="12" r="3"/><circle cx="19.5" cy="12" r="3"/></svg>',
};

export function initPetals() {
  const layer = document.querySelector('.petals');
  if (!layer) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const kinds = ['petal', 'heart', 'star', 'bow', 'flower'];
  const count = window.matchMedia('(max-width: 720px)').matches ? 5 : 12;
  const tweens = [];

  for (let i = 0; i < count; i += 1) {
    const kind = kinds[i % kinds.length];
    const flake = document.createElement('span');
    flake.className = `flake flake-${kind}`;
    flake.innerHTML = FALL_HTML[kind];
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.top = `${-12 - Math.random() * 30}%`;
    layer.append(flake);

    tweens.push(
      gsap.to(flake, {
        y: '125vh',
        x: gsap.utils.random(-90, 90),
        rotation: gsap.utils.random(-220, 220),
        duration: gsap.utils.random(10, 18),
        repeat: -1,
        ease: 'none',
        delay: gsap.utils.random(0, 10),
        force3D: true,
      }),
    );
  }

  document.addEventListener('visibilitychange', () => {
    tweens.forEach((tween) => {
      if (document.hidden) tween.pause();
      else tween.resume();
    });
  });

  let scrollPause;
  window.addEventListener(
    'scroll',
    () => {
      tweens.forEach((tween) => tween.pause());
      window.clearTimeout(scrollPause);
      scrollPause = window.setTimeout(() => {
        tweens.forEach((tween) => tween.resume());
      }, 180);
    },
    { passive: true },
  );
}

function splitChars(el) {
  if (!el) return [];

  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const chars = [];

  text.split(/\s+/).forEach((word, index, words) => {
    const wrap = document.createElement('span');
    wrap.className = 'word';
    [...word].forEach((letter) => {
      const char = document.createElement('span');
      char.className = 'char';
      char.textContent = letter;
      wrap.append(char);
      chars.push(char);
    });
    el.append(wrap);
    if (index < words.length - 1) el.append(document.createTextNode(' '));
  });

  return chars;
}

function prepareStrokes(root) {
  if (!root) return [];

  const strokes = [...root.querySelectorAll('path, circle')];
  strokes.forEach((stroke) => {
    const length = stroke.getTotalLength();
    gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
  });
  return strokes;
}

function pinHeroScreen() {
  window.scrollTo(0, 0);
}

function lockIntro() {
  document.documentElement.classList.add('is-intro');
  pinHeroScreen();
}

function unlockIntro() {
  document.documentElement.classList.remove('is-intro');
}

function initHeroEntrance() {
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    heroEl.classList.add('hero-ready');
    document.querySelector('.hero-title')?.classList.add('is-lit');
    unlockIntro();
    return;
  }

  lockIntro();

  const titleChars = splitChars(document.querySelector('.hero-title'));
  const nameChars = splitChars(document.querySelector('.hero-names [data-bride]') || document.querySelector('.hero-names'));
  const eyebrowChars = splitChars(document.querySelector('.hero .eyebrow'));
  const drawGroups = gsap.utils.toArray('.hero .hero-draw');
  const drawStrokes = drawGroups.map((icon) => prepareStrokes(icon));
  const flourish = prepareStrokes(document.querySelector('.hero-flourish'));
  const ornaments = gsap.utils.toArray('.hero .spark-row .mini-orn');

  gsap.set(['.hero .ornament-mark', '.hero .eyebrow', '.hero .spark-row', '.hero-heading', '.hero-names', '.hero-hint', '.hero-next'], {
    autoAlpha: 1,
  });
  gsap.set('.hero .ornament-mark', { autoAlpha: 0, scale: 0.86, y: 16, transformOrigin: '50% 50%' });
  gsap.set('.hero .eyebrow', { autoAlpha: 1 });
  gsap.set(eyebrowChars, { autoAlpha: 0, y: 12 });
  gsap.set('.hero .spark-row .mini-orn', { autoAlpha: 0, scale: 0.7 });
  gsap.set(titleChars, { autoAlpha: 0, y: 42 });
  gsap.set(nameChars, { autoAlpha: 0, y: 28 });
  gsap.set('.hero-flourish', { autoAlpha: 1 });
  gsap.set('.hero-hint, .hero-next', { autoAlpha: 0, y: 16 });
  gsap.set('.red-kyz', { scale: 1.1, transformOrigin: '50% 40%', force3D: true });
  heroEl.classList.add('hero-ready');
  pinHeroScreen();
  window.setTimeout(unlockIntro, 5600);

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: unlockIntro,
  });

  tl.to('.red-kyz', { scale: 1, duration: 2.8, ease: 'power2.out', force3D: true }, 0)
    .to('.hero .ornament-mark', { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.12)
    .to(eyebrowChars, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.035, ease: 'power2.out' }, 0.35);

  drawStrokes.forEach((strokes, index) => {
    const start = 0.7 + index * 0.38;
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08, ease: 'power2.inOut' }, start);
    if (ornaments[index]) {
      tl.to(ornaments[index], { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, start + 0.18);
    }
  });

  if (ornaments[drawStrokes.length]) {
    tl.to(ornaments[drawStrokes.length], { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.7 + drawStrokes.length * 0.38);
  }

  tl.to(titleChars, {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.045,
      ease: 'expo.out',
    }, 1.85)
    .to(flourish, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.25')
    .to(nameChars, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: 'expo.out',
    }, '-=0.35')
    .to('.hero-hint, .hero-next', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.2')
    .add(() => {
      document.querySelector('.hero-title')?.classList.add('is-lit');
    });
}

function splitWords(el) {
  if (!el) return [];

  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = [];

  text.split(/\s+/).forEach((word, index, list) => {
    const wrap = document.createElement('span');
    wrap.className = 'word';
    wrap.textContent = word;
    el.append(wrap);
    words.push(wrap);
    if (index < list.length - 1) el.append(document.createTextNode(' '));
  });

  return words;
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initIntroScene() {
  const section = document.querySelector('#intro');
  if (!section) return;
  if (reducedMotion()) {
    section.classList.add('is-in');
    return;
  }

  const titleChars = splitChars(section.querySelector('h2'));
  const words = splitWords(section.querySelector('.intro-lead'));
  const flourish = prepareStrokes(section.querySelector('.intro-flourish'));
  const bow = section.querySelector('.bow');

  gsap.set(bow, { autoAlpha: 0, y: -64, rotate: -14, scale: 0.58, transformOrigin: '50% 50%' });
  gsap.set(titleChars, { autoAlpha: 0, y: 26 });
  gsap.set(words, { autoAlpha: 0, y: 16 });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.08,
    scrollTrigger: {
      trigger: bow || section,
      start: 'top 72%',
      once: true,
    },
  });

  tl.timeScale(1.18);

  tl.add(() => section.classList.add('is-in'))
    .to(bow, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 1.05, ease: 'back.out(1.55)' }, 0.05)
    .to(titleChars, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.03, ease: 'expo.out' }, 0.28)
    .to(flourish, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.22')
    .to(words, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04 }, '-=0.32');
}

function initCalendarScene() {
  const section = document.querySelector('.calendar-section');
  if (!section) return;
  if (reducedMotion()) {
    section.classList.add('is-in');
    return;
  }

  const titleChars = splitChars(section.querySelector('h2'));
  const kickerChars = splitChars(section.querySelector('.kicker'));
  const dateChars = splitChars(section.querySelector('.date-numeric'));
  const dateFlourish = prepareStrokes(section.querySelector('.date-flourish'));
  const days = gsap.utils.toArray(section.querySelectorAll('.cal-day'));
  const dows = gsap.utils.toArray(section.querySelectorAll('.cal-dow'));
  const heart = prepareStrokes(section.querySelector('.heart-ring'));
  const pin = prepareStrokes(section.querySelector('.place-pin'));
  const photos = gsap.utils.toArray(section.querySelectorAll('.photo-child img'));
  const deco = gsap.utils.toArray(section.querySelectorAll('.deco-row > *'));
  const sides = gsap.utils.toArray(section.querySelectorAll('.side-deco'));
  const heading = section.querySelector('h2');
  const photoRow = section.querySelector('.photo-child');

  gsap.set(deco, { autoAlpha: 0, y: 14, scale: 0.86 });
  gsap.set(kickerChars, { autoAlpha: 0, y: 10 });
  gsap.set(titleChars, { autoAlpha: 0, y: 28 });
  gsap.set('.calendar-card', { autoAlpha: 0, y: 40, transformOrigin: '50% 80%' });
  gsap.set(sides, { autoAlpha: 0 });
  gsap.set(dows, { autoAlpha: 0, y: 8 });
  gsap.set(days, { autoAlpha: 0 });
  gsap.set(dateChars, { autoAlpha: 0, y: 18 });
  gsap.set('.place-card', { autoAlpha: 0, y: 22 });
  photos.forEach((photo, index) => {
    gsap.set(photo, { autoAlpha: 0, yPercent: index === 0 ? 46 : 22, scale: 1.08 });
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.08,
    scrollTrigger: {
      trigger: heading || section,
      start: 'top 70%',
      once: true,
    },
  });

  tl.timeScale(1.2);

  tl.add(() => section.classList.add('is-in'))
    .to(deco, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.6)' }, 0.05)
    .to(kickerChars, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.025 }, 0.2)
    .to(titleChars, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.032, ease: 'expo.out' }, 0.32)
    .to('.calendar-card', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.55)
    .fromTo(sides[0], { autoAlpha: 0, x: -28 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.6)
    .fromTo(sides[1], { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.6)
    .to(dows, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.035 }, 0.85)
    .to(days, { autoAlpha: 1, duration: 0.28, stagger: 0.012, ease: 'power2.out' }, 1.05)
    .to(heart, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 1.55)
    .to(section.querySelector('.heart-ring path'), { fill: 'rgba(211, 107, 134, 0.22)', duration: 0.35 }, 2.15)
    .fromTo('.cal-day.is-mark', { scale: 1 }, { scale: 1.14, duration: 0.28, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 2.2)
    .to(dateChars, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.04, ease: 'expo.out' }, 2.35)
    .to(dateFlourish, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 2.55)
    .to(section.querySelector('.place-card'), { autoAlpha: 1, y: 0, duration: 0.7 }, 2.7)
    .to(pin, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, 2.85);

  if (photoRow && photos.length) {
    gsap.to(photos, {
      autoAlpha: 1,
      scale: 1,
      yPercent: (index) => (index === 0 ? 20 : 0),
      duration: 1.15,
      stagger: 0.16,
      ease: 'expo.out',
      delay: 0.06,
      scrollTrigger: {
        trigger: photoRow,
        start: 'top 84%',
        once: true,
      },
    });
  }
}

function initLetterScene() {
  const section = document.querySelector('#letter');
  if (!section) return;
  if (reducedMotion()) {
    section.classList.add('is-in');
    return;
  }

  const ornament = section.querySelector('.ornament-hero');
  const title = section.querySelector('h2');
  const titleChars = splitChars(title);
  const kickerChars = splitChars(section.querySelector('.kicker'));
  const words = splitWords(section.querySelector('.lead'));
  const flourish = prepareStrokes(section.querySelector('.letter-flourish'));
  const envelope = section.querySelector('.envelope');
  const photo = section.querySelector('.blue-kyz');

  gsap.set(ornament, { autoAlpha: 0, y: 16, scale: 0.88, transformOrigin: '50% 50%' });
  gsap.set(kickerChars, { autoAlpha: 0, y: 10 });
  gsap.set(titleChars, { autoAlpha: 0, y: 26 });
  gsap.set(words, { autoAlpha: 0, y: 14 });
  gsap.set(envelope, { autoAlpha: 0, y: 28, transformOrigin: '50% 80%' });
  if (photo) gsap.set(photo, { scale: 1.06, transformOrigin: '50% 40%', force3D: true });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.04,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      once: true,
    },
  });

  tl.timeScale(1.2);

  tl.add(() => section.classList.add('is-in'));
  if (photo) tl.to(photo, { scale: 1, duration: 2.2, ease: 'power2.out', force3D: true }, 0);
  tl.to(ornament, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, 0.05)
    .to(kickerChars, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.024 }, 0.18)
    .to(titleChars, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.028, ease: 'expo.out' }, 0.3)
    .to(flourish, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, '-=0.22')
    .to(words, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.035 }, '-=0.28')
    .to(envelope, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.25');
}

function initVenueScene() {
  const section = document.querySelector('#venue');
  if (!section) return;
  if (reducedMotion()) {
    section.classList.add('is-in');
    return;
  }

  const heading = section.querySelector('h2');
  const titleChars = splitChars(heading);
  const kickerChars = splitChars(section.querySelector('.kicker'));
  const flourish = prepareStrokes(section.querySelector('.venue-flourish'));
  const meta = section.querySelector('.venue-meta');
  const map = section.querySelector('.map-frame');

  gsap.set(kickerChars, { autoAlpha: 0, y: 10 });
  gsap.set(titleChars, { autoAlpha: 0, y: 24 });
  gsap.set(meta, { autoAlpha: 0, y: 22 });
  gsap.set(map, { autoAlpha: 0, y: 36, scale: 0.96, transformOrigin: '50% 80%' });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.06,
    scrollTrigger: {
      trigger: heading || section,
      start: 'top 72%',
      once: true,
    },
  });

  tl.timeScale(1.18);

  tl.add(() => section.classList.add('is-in'))
    .to(kickerChars, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.022 }, 0.04)
    .to(titleChars, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.026, ease: 'expo.out' }, 0.12)
    .to(flourish, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, '-=0.18')
    .to(meta, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.22')
    .to(map, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: 'expo.out' }, '-=0.2');
}

const RSVP_COLORS = ['#e8a4b8', '#8b3a52', '#f3c6d4', '#e8c48a', '#fffaf4'];

let party = null;

function getParty() {
  if (party) return party;

  const canvas = document.createElement('canvas');
  canvas.className = 'rsvp-confetti';
  const host = document.querySelector('.rsvp-toast') || document.body;
  host.prepend(canvas);
  party = confetti.create(canvas, { resize: true, useWorker: false });
  return party;
}

function celebrateYes() {
  const fire = getParty();
  const end = Date.now() + 2400;

  fire({
    particleCount: 90,
    spread: 80,
    startVelocity: 42,
    origin: { y: 0.65 },
    colors: RSVP_COLORS,
  });

  (function frame() {
    fire({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.68 },
      colors: RSVP_COLORS,
    });
    fire({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.68 },
      colors: RSVP_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function initRsvpScene() {
  const section = document.querySelector('#rsvp');
  if (!section) return;
  if (reducedMotion()) return;

  const mark = section.querySelector('.rsvp-mark');
  const titleChars = splitChars(section.querySelector('h2'));
  const kickerChars = splitChars(section.querySelector('.kicker'));
  const words = splitWords(section.querySelector('.rsvp-ask'));
  const buttons = gsap.utils.toArray(section.querySelectorAll('[data-rsvp]'));

  gsap.set(mark, { autoAlpha: 0, y: 16, scale: 0.88, transformOrigin: '50% 50%' });
  gsap.set(kickerChars, { autoAlpha: 0, y: 10 });
  gsap.set(titleChars, { autoAlpha: 0, y: 24 });
  gsap.set(words, { autoAlpha: 0, y: 14 });
  gsap.set(buttons, { autoAlpha: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.06,
    scrollTrigger: {
      trigger: section.querySelector('h2') || section,
      start: 'top 72%',
      once: true,
    },
  });

  tl.timeScale(1.18);
  tl.to(mark, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 0)
    .to(kickerChars, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.022 }, 0.12)
    .to(titleChars, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.026, ease: 'expo.out' }, 0.22)
    .to(words, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.03 }, '-=0.28')
    .to(buttons, { autoAlpha: 1, duration: 0.45, stagger: 0.1 }, '-=0.2');
}

function initRsvpChoice() {
  const section = document.querySelector('#rsvp');
  const toast = document.querySelector('.rsvp-toast');
  const toastCard = document.querySelector('.rsvp-toast-card');
  const toastTitle = document.querySelector('.rsvp-toast-title');
  const toastText = document.querySelector('.rsvp-toast-text');
  const toastClose = document.querySelector('.rsvp-toast-close');
  if (!section || !toast || !toastCard || !toastTitle || !toastText) return;

  const messages = {
    yes: {
      title: 'Ура!',
      text: 'Уже жду вас и берегу самое тёплое место.',
    },
    no: {
      title: 'Очень жаль...',
      text: 'Буду скучать, но люблю вас так же сильно.',
    },
  };

  function closeToast() {
    if (toast.hidden) return;
    gsap.killTweensOf(toastCard);
    gsap.to(toastCard, {
      autoAlpha: 0,
      y: 16,
      scale: 0.96,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        toast.hidden = true;
        gsap.set(toastCard, { clearProps: 'all' });
      },
    });
  }

  function openToast(kind) {
    const message = messages[kind];
    gsap.killTweensOf(toastCard);
    toastTitle.textContent = message.title;
    toastText.textContent = message.text;
    toast.hidden = false;
    gsap.fromTo(
      toastCard,
      { autoAlpha: 0, y: 22, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' },
    );
  }

  document.querySelectorAll('[data-rsvp]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const yes = btn.dataset.rsvp === 'yes';
      section.classList.add('is-answered');
      openToast(yes ? 'yes' : 'no');
      if (yes) {
        requestAnimationFrame(() => {
          requestAnimationFrame(celebrateYes);
        });
      }
    });
  });

  toastClose?.addEventListener('click', closeToast);
  toast?.addEventListener('click', (event) => {
    if (event.target === toast) closeToast();
  });
}

export function initReveals() {
  initHeroEntrance();
  initIntroScene();
  initCalendarScene();
  initLetterScene();
  initVenueScene();
  initRsvpScene();
  initRsvpChoice();

  gsap.utils.toArray('.section').forEach((section) => {
    if (
      section.id === 'intro' ||
      section.id === 'letter' ||
      section.id === 'venue' ||
      section.id === 'rsvp' ||
      section.classList.contains('calendar-section')
    ) {
      return;
    }

    gsap.from(section.querySelectorAll('h2, .lead, .kicker, .rsvp-actions, .ornament-hero'), {
      y: 28,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true,
      },
    });
  });

  document.querySelector('.hero-next')?.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#intro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  gsap.to('.heart-stage', {
    y: 10,
    duration: 3.4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: 1.4,
  });
}

export function initLetter() {
  const seal = document.querySelector('.seal');
  const overlay = document.querySelector('.letter-overlay');
  const sheet = document.querySelector('.paper-sheet');
  const closeBtn = document.querySelector('.letter-close');
  const flap = document.querySelector('.flap');
  const envelope = document.querySelector('.envelope');
  if (!seal || !overlay || !sheet || !closeBtn || !flap || !envelope) return;

  gsap.set(envelope, { transformPerspective: 900 });
  gsap.set(flap, { transformOrigin: 'top center' });
  gsap.set(sheet, { autoAlpha: 0, scale: 0.55, y: 80 });

  let busy = false;
  let opened = false;

  function openLetter() {
    if (busy || opened) return;
    busy = true;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-on'));
    document.body.classList.add('letter-open');
    sheet.scrollTop = 0;
    if (navigator.vibrate) navigator.vibrate(12);

    const tl = gsap.timeline({
      onComplete: () => {
        busy = false;
        opened = true;
      },
    });

    tl.to(seal, { scale: 0.15, autoAlpha: 0, duration: 0.28 })
      .to(flap, { rotateX: -180, duration: 0.45, ease: 'power2.inOut' }, '<0.05')
      .set(flap, { zIndex: 2 })
      .to(
        sheet,
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' },
        '-=0.15',
      );
  }

  function closeLetter() {
    if (busy || !opened) return;
    busy = true;
    overlay.classList.remove('is-on');

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.classList.remove('is-on');
        overlay.hidden = true;
        document.body.classList.remove('letter-open');
        busy = false;
        opened = false;
      },
    });

    tl.to(sheet, { autoAlpha: 0, scale: 0.55, y: 90, duration: 0.45, ease: 'power2.in' })
      .set(flap, { zIndex: 6 })
      .to(flap, { rotateX: 0, duration: 0.4, ease: 'power2.inOut' }, '<')
      .to(seal, { scale: 1, autoAlpha: 1, duration: 0.28 });
  }

  seal.addEventListener('click', openLetter);
  closeBtn.addEventListener('click', closeLetter);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeLetter();
  });
}
