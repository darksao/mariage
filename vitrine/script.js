/* ============================================================
   WEDORIA — SCRIPT.JS
   GSAP + ScrollTrigger animations · Vanilla JS
   ============================================================ */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') { revealAll(); return; }
  gsap.registerPlugin(ScrollTrigger);
  init();
});

function revealAll() {
  document.querySelectorAll('.hero__title,.hero__sub,.hero__cta,.process__step,.portfolio-card,.formule-card,.temoignage').forEach(el => { el.style.opacity='1'; el.style.transform='none'; });
  document.querySelectorAll('.word-reveal').forEach(w => w.classList.add('is-revealed'));
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  document.body.classList.remove('loading');
}

function init() {
  document.body.classList.add('loading');
  initLoader();
}

/* ── LOADER ── */
function initLoader() {
  const loader   = document.getElementById('loader');
  const path     = document.querySelector('.loader__path');
  const wordmark = document.querySelector('.loader__wordmark');
  const bar      = document.querySelector('.loader__bar');
  if (!loader) { onLoaderComplete(); return; }
  if (!bar) { loader.style.display = 'none'; document.body.classList.remove('loading'); onLoaderComplete(); return; }
  if (prefersReducedMotion) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display='none'; document.body.classList.remove('loading'); onLoaderComplete(); }, 200);
    return;
  }
  let progress = 0;
  const barInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 12, 100);
    bar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barInterval);
  }, 60);
  const tl = gsap.timeline({ onComplete: () => {
    gsap.to(loader, { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => { loader.style.display='none'; document.body.classList.remove('loading'); } });
    onLoaderComplete();
  }});
  tl.to('.loader__monogram', { opacity: 1, duration: 0.3 })
    .to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, 0.1)
    .to(wordmark, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.8)
    .to({}, { duration: 0.8 });
}

function onLoaderComplete() {
  initNavbar();
  initHero();
  initTextRotate();
  initManifeste();
  initProcess();
  initPortfolio();
  initFormules();
  initTemoignages();
  initContact();
  initMagneticButtons();
  ScrollTrigger.refresh();
}

/* ── NAVBAR ── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;
  ScrollTrigger.create({
    start: 'top -60',
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }
}

/* ── HERO ── */
function initHero() {
  initParticles();
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero__title,.hero__sub,.hero__cta').forEach(el => { el.style.opacity='1'; el.style.transform='none'; });
    return;
  }
  gsap.timeline({ delay: 0.2 })
    .to('.hero__title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0)
    .to('.hero__sub',   { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.35)
    .to('.hero__cta',   { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.55);
}

/* ── CANVAS PETALS ── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = prefersReducedMotion ? 0 : 28;
  const colors = ['rgba(201,169,110,0.18)','rgba(237,229,216,0.35)','rgba(107,39,55,0.10)','rgba(250,250,247,0.45)','rgba(201,169,110,0.09)'];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class Petal {
    constructor() { this.reset(true); }
    reset(initial=false) {
      this.x = Math.random()*W; this.y = initial ? Math.random()*H : -20;
      this.w = 6+Math.random()*12; this.h = 3+Math.random()*6;
      this.rot = Math.random()*Math.PI*2; this.speed = 0.25+Math.random()*0.55;
      this.drift = (Math.random()-0.5)*0.4; this.spin = (Math.random()-0.5)*0.015;
      this.alpha = 0.3+Math.random()*0.5; this.color = colors[Math.floor(Math.random()*colors.length)];
      this.wobble = Math.random()*Math.PI*2; this.wobbleSpeed = 0.01+Math.random()*0.015;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.drift + Math.sin(this.wobble)*0.35;
      this.y += this.speed; this.rot += this.spin;
      if (this.y > H+20) this.reset();
    }
    draw() {
      ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.ellipse(0,0,this.w,this.h,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  }

  resize();
  particles = Array.from({length:COUNT}, () => new Petal());
  (function animate() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
  new ResizeObserver(() => resize()).observe(canvas);
}

/* ── TEXT ROTATE — character-level stagger (port vanilla de danielpetho/text-rotate) ──
   Params équivalents au composant React :
     texts            → les mots à faire défiler
     rotationInterval → 3000ms entre chaque rotation
     staggerFrom      → "last"  (comme dans la démo 21st.dev)
     staggerDuration  → 30ms par caractère
     splitBy          → "characters"
     initial          → translateY(110%) opacity 0
     animate          → translateY(0)   opacity 1  (spring CSS: cubic-bezier spring)
     exit             → translateY(-120%) opacity 0
────────────────────────────────────────────────────────── */
function initTextRotate() {
  const container = document.getElementById('textRotate');
  if (!container) return;

  const TEXTS    = ['inoubliable\u00A0✨', 'unique\u00A0💎', 'élégant\u00A0🌸', 'sur-mesure\u00A0🎀', 'votre\u00A0histoire\u00A0💌'];
  const INTERVAL = 3000;   // ms entre rotations
  const STAGGER  = 30;     // ms entre chaque char (staggerDuration)
  const ENTER_DUR = 450;   // durée CSS entrée (ms)
  const EXIT_DUR  = 260;   // durée CSS sortie (ms)

  let currentIdx = 0;
  let animating  = false;

  /* Spliteur unicode-safe (comme Intl.Segmenter dans le composant) */
  function splitChars(text) {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter('fr', { granularity: 'grapheme' });
      return Array.from(seg.segment(text), s => s.segment);
    }
    return Array.from(text);
  }

  /* Délai de stagger depuis la fin (staggerFrom="last") */
  function staggerDelay(charIdx, total) {
    return (total - 1 - charIdx) * STAGGER;
  }

  /* Rend un mot, caractère par caractère, avec animation d'entrée */
  function renderWord(word, skipAnimation) {
    container.innerHTML = '';
    container.setAttribute('aria-label', word);

    const chars = splitChars(word);
    const total = chars.length;

    chars.forEach((char, i) => {
      /* Wrapper clip */
      const outer = document.createElement('span');
      outer.className = 'tr-char';
      outer.setAttribute('aria-hidden', 'true');

      /* Élément animé */
      const inner = document.createElement('span');
      const isEmoji = /\p{Emoji_Presentation}/u.test(char);
      inner.className = 'tr-char-inner tr-enter-from' + (isEmoji ? ' tr-char-emoji' : '');
      inner.textContent = char;

      outer.appendChild(inner);
      container.appendChild(outer);

      if (skipAnimation) {
        /* prefers-reduced-motion : pas d'animation */
        inner.classList.remove('tr-enter-from');
        inner.classList.add('tr-visible');
        return;
      }

      const delay = staggerDelay(i, total);
      /* Un microtask pour que le navigateur peigne d'abord l'état "from" */
      setTimeout(() => {
        inner.classList.remove('tr-enter-from');
        inner.classList.add('tr-visible');
      }, 16 + delay);
    });
  }

  /* Anime la sortie des caractères actuels, puis appelle onDone */
  function exitWord(onDone) {
    const inners = Array.from(container.querySelectorAll('.tr-char-inner'));
    const total  = inners.length;

    inners.forEach((inner, i) => {
      const delay = staggerDelay(i, total);
      setTimeout(() => {
        inner.classList.remove('tr-visible');
        inner.classList.add('tr-exit');
      }, delay);
    });

    /* Attendre la fin de toutes les transitions de sortie */
    const totalDelay = (total - 1) * STAGGER + EXIT_DUR + 20;
    setTimeout(onDone, totalDelay);
  }

  /* Rotation principale */
  function rotate() {
    if (animating) return;
    animating = true;

    exitWord(() => {
      currentIdx = (currentIdx + 1) % TEXTS.length;
      renderWord(TEXTS[currentIdx], false);

      /* Débloquer après la fin des animations d'entrée */
      const total    = splitChars(TEXTS[currentIdx]).length;
      const maxEnter = (total - 1) * STAGGER + ENTER_DUR + 20;
      setTimeout(() => { animating = false; }, maxEnter);
    });
  }

  /* Rendu initial */
  if (prefersReducedMotion) {
    renderWord(TEXTS[0], true);
    setInterval(() => {
      currentIdx = (currentIdx + 1) % TEXTS.length;
      renderWord(TEXTS[currentIdx], true);
    }, INTERVAL);
    return;
  }

  renderWord(TEXTS[0], false);
  setInterval(rotate, INTERVAL);
}

/* ── MANIFESTE ── */
function initManifeste() {
  const section = document.querySelector('.manifeste');
  const words   = document.querySelectorAll('.word-reveal');
  if (!section || !words.length) return;
  if (prefersReducedMotion) { words.forEach(w => w.classList.add('is-revealed')); return; }
  const pinDuration = Math.max(window.innerHeight * 3, 800);
  section.style.height = pinDuration + 'px';
  ScrollTrigger.create({
    trigger: section, start: 'top top',
    end: `+=${pinDuration - window.innerHeight}`,
    pin: '.manifeste__inner', pinSpacing: false, scrub: 1.2,
    onUpdate: self => {
      const reveal = Math.floor(self.progress * (words.length + 2));
      words.forEach((w,i) => { i < reveal ? w.classList.add('is-revealed') : w.classList.remove('is-revealed'); });
    }
  });
}

/* ── PROCESS ── */
function initProcess() {
  const steps = document.querySelectorAll('.process__step');
  if (!steps.length) return;
  if (prefersReducedMotion) { steps.forEach(s => { s.style.opacity='1'; s.style.transform='none'; }); return; }
  steps.forEach((step, i) => {
    gsap.to(step, { opacity:1, x:0, duration:0.9, ease:'power3.out', delay:i*0.15,
      scrollTrigger: { trigger:step, start:'top 82%', toggleActions:'play none none reverse' } });
  });
}

/* ── PORTFOLIO ── */
function initPortfolio() {
  const track = document.getElementById('portfolioTrack');
  const wrap  = document.getElementById('portfolioWrap');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!track || !wrap) return;

  const revealCards = () => cards.forEach(c => { c.style.opacity='1'; c.style.transform='none'; c.style.transition='opacity 0.75s ease, transform 0.75s ease'; });
  if (!prefersReducedMotion) {
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { revealCards(); obs.disconnect(); }
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));
    setTimeout(revealCards, 1500);
  } else {
    revealCards();
  }

  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

  if (!isDesktop() || prefersReducedMotion) {
    track.style.overflowX = 'auto';
    track.style.scrollSnapType = 'x mandatory';
    cards.forEach(c => c.style.scrollSnapAlign = 'start');
    return;
  }

  function buildHScroll() {
    if (!isDesktop() || !cards[0]) return;
    const gap = 24;
    const totalW = cards.length * (cards[0].offsetWidth + gap) - gap + 96;
    const distance = totalW - wrap.offsetWidth;
    if (distance <= 0) return;
    gsap.to(track, { x: () => -distance, ease:'none',
      scrollTrigger: { trigger:wrap, start:'top top+=80', end:() => `+=${distance}`,
        pin:true, scrub:1.2, invalidateOnRefresh:true } });
  }

  buildHScroll();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === wrap) st.kill(); });
      gsap.set(track, { x:0 });
      if (isDesktop()) buildHScroll();
      else { track.style.overflowX = 'auto'; }
    }, 250);
  });
}

/* ── FORMULES ── */
function initFormules() {
  const cards = document.querySelectorAll('.formule-card');
  if (!cards.length) return;
  if (prefersReducedMotion) { cards.forEach(c => { c.style.opacity='1'; c.style.transform='none'; }); return; }
  cards.forEach((card, i) => {
    const isPremium = card.classList.contains('formule-card--premium');
    gsap.to(card, { opacity:1, y:0, scale: isPremium ? 1.02 : 1, duration:0.85, ease:'power3.out', delay:i*0.12,
      scrollTrigger: { trigger:card, start:'top 85%', toggleActions:'play none none reverse' } });
  });
}

/* ── TÉMOIGNAGES ── */
function initTemoignages() {
  const items = document.querySelectorAll('.temoignage');
  if (!items.length) return;
  if (prefersReducedMotion) { items.forEach(i => { i.style.opacity='1'; i.style.transform='none'; }); return; }
  items.forEach((item, i) => {
    gsap.to(item, { opacity:1, y:0, duration:0.8, ease:'power3.out', delay:i*0.1,
      scrollTrigger: { trigger:item, start:'top 85%', toggleActions:'play none none reverse' } });
  });
}

/* ── CONTACT ── */
function initContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  const btn     = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--c-bordeaux)';
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.setAttribute('aria-invalid', 'false');
      }
    });
    if (!valid) { const f = form.querySelector('[aria-invalid="true"]'); if (f) f.focus(); return; }
    btn.classList.add('loading'); btn.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form));
      const prenomsParts = (data.prenoms || '').split(/\s*[&et]\s*/i).map(s => s.trim()).filter(Boolean);
      const payload = {
        prenom1:      prenomsParts[0] || data.prenoms,
        prenom2:      prenomsParts[1] || null,
        email:        data.email,
        date_mariage: data.date || null,
        message:      [
          data.formule && data.formule !== '' ? `Formule souhaitée : ${data.formule}` : '',
          data.message || '',
        ].filter(Boolean).join('\n\n') || null,
      };

      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.lead_id) {
        localStorage.setItem('wedoria_lead_id', json.lead_id);
      }
    } catch (err) {
      console.error('Contact API error:', err);
    }

    form.style.display = 'none';
    success.hidden = false;
  });

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => {
      input.style.borderColor = (input.hasAttribute('required') && !input.value.trim()) ? 'rgba(107,39,55,0.5)' : '';
    });
  });
}

/* ── MAGNETIC BUTTONS ── */
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    const inner = btn.querySelector('span');
    if (!inner) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) * 0.35;
      const dy = (e.clientY - r.top  - r.height/2) * 0.35;
      gsap.to(btn,   { x:dx*0.5, y:dy*0.5, duration:0.35, ease:'power2.out' });
      gsap.to(inner, { x:dx,     y:dy,     duration:0.35, ease:'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to([btn, inner], { x:0, y:0, duration:0.5, ease:'elastic.out(1,0.5)' });
    });
  });
}

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
