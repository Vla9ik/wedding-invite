import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  const kinds = ['petal', 'heart', 'star', 'bow', 'flower'];

  for (let i = 0; i < 22; i += 1) {
    const kind = kinds[i % kinds.length];
    const flake = document.createElement('span');
    flake.className = `flake flake-${kind}`;
    flake.innerHTML = FALL_HTML[kind];
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.top = `${-12 - Math.random() * 30}%`;
    layer.append(flake);

    gsap.to(flake, {
      y: '125vh',
      x: gsap.utils.random(-90, 90),
      rotation: gsap.utils.random(-220, 220),
      duration: gsap.utils.random(10, 18),
      repeat: -1,
      ease: 'none',
      delay: gsap.utils.random(0, 10),
    });
  }
}

export function initReveals() {
  gsap.utils.toArray('.section').forEach((section) => {
    gsap.from(section.querySelectorAll('h2, .lead, .intro p, .kicker, .calendar-card, .venue-card, .rsvp-actions, .ornament-hero, .deco-row, .envelope-scene, .place-card, .cal-photos, .date-numeric'), {
      y: 36,
      autoAlpha: 0,
      duration: 1.15,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true,
      },
    });
  });

  const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
  hero
    .from('.ornament-mark, .eyebrow, .spark-row', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 })
    .from('.hero-title', { y: 28, autoAlpha: 0, duration: 1.1 }, '-=0.45')
    .from('.hero-names', { y: 20, autoAlpha: 0, duration: 0.9 }, '-=0.7')
    .from('.heart-stage', { scale: 0.9, autoAlpha: 0, duration: 1.25 }, '-=0.55')
    .from('.hero-hint', { y: 12, autoAlpha: 0, duration: 0.8 }, '-=0.7');

  gsap.to('.heart-stage', {
    y: 10,
    duration: 3.4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: 1.4,
  });

  gsap.from('.cal-pic', {
    scale: 0.9,
    y: 24,
    autoAlpha: 0,
    stagger: 0.14,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cal-photos',
      start: 'top 84%',
      once: true,
    },
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
    document.body.classList.add('letter-open');
    sheet.scrollTop = 0;

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

    const tl = gsap.timeline({
      onComplete: () => {
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
