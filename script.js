/* ═══════════════════════════════════════════════════════
   MARIAGE · script.js
   Config-driven · GSAP + ScrollTrigger + Leaflet + Canvas
═══════════════════════════════════════════════════════ */
'use strict';

// Client Supabase (SUPABASE_URL et SUPABASE_ANON_KEY viennent de supabase-config.js)
let db = null;
try {
  db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase init failed:', e);
}

/* ────────────────────────────────────────
   HYDRATE DOM FROM config.js
──────────────────────────────────────── */
function hydrate() {
  const M = MARIAGE;

  // Page title
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;

  // Loader
  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', formatDate(M.date_affichage));

  // Navbar
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));

  // Hero
  setText('hero-invite',  M.hero_intro);
  const heroCta = document.getElementById('hero-cta-overlay');
  if (heroCta) heroCta.textContent = M.hero_cta || 'Confirmer ma présence';

  // Photo couple
  const cpImg     = document.getElementById('cp-img');
  const cpSection = document.getElementById('couple-photo');
  if (cpImg && cpSection && M.photo_couple) {
    cpImg.alt    = M.photo_couple_caption || `${M.prenom1} & ${M.prenom2}`;
    cpImg.onerror = () => { cpSection.style.display = 'none'; };
    cpImg.src    = M.photo_couple;
  } else if (cpSection) {
    cpSection.style.display = 'none';
  }
  setText('cp-names',   `${M.prenom1} <span class="cp-amp">&amp;</span> ${M.prenom2}`);
  setText('cp-caption', M.photo_couple_caption);

  // Sticky reveal
  setText('sr-line-1', M.sr_line1 || 'Avant ce jour,');
  setText('sr-line-2', M.sr_line2 || 'notre histoire s\'écrivait');
  setText('sr-p1',     M.prenom1);
  setText('sr-p2',     M.prenom2);
  setText('sr-line-4', M.date_affichage);

  // Histoire
  setText('histoire-eyebrow', M.histoire_eyebrow);
  setText('histoire-titre',   M.histoire_titre);
  const histWrap = document.getElementById('histoire-wrap');
  if (histWrap) {
    histWrap.innerHTML = M.histoire.map(h => `
      <div class="hist-item" data-align="${h.align}">
        <div class="hist-year">${h.annee}</div>
        <div class="hist-dot"></div>
        <div class="hist-card">
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>
      </div>`).join('');
  }

  // Programme
  setText('programme-eyebrow', M.programme_eyebrow);
  setText('programme-titre',   M.programme_titre);
  const progWrap = document.getElementById('prog-wrap');
  if (progWrap) {
    progWrap.innerHTML = M.programme.map(p => `
      <div class="prog-item">
        <div class="prog-time">${p.heure}</div>
        <div class="prog-icon">${p.icon}</div>
        <div class="prog-card"><h3>${p.titre}</h3><p>${p.lieu}</p></div>
      </div>`).join('');
  }

  // Galerie
  setText('galerie-eyebrow', M.galerie_eyebrow);
  setText('galerie-titre',   M.galerie_titre);
  setText('galerie-hint',    M.galerie_hint);
  const grid = document.getElementById('gallery-grid');
  if (grid) {
    grid.innerHTML = M.galerie.map((g, i) => `
      <div class="gallery-item gi-${i+1}">
        ${g.photo
          ? `<img src="${g.photo}" alt="${g.label}" />`
          : `<div class="gallery-placeholder gp-${i+1}">
               <span class="gp-icon">${g.icon}</span>
               <span class="gp-label">${g.label}</span>
             </div>`
        }
      </div>`).join('');
  }

  // Lieux
  setText('lieux-eyebrow', M.lieux_eyebrow);
  setText('lieux-titre',   M.lieux_titre);
  const lieuxCards = document.getElementById('lieux-cards');
  if (lieuxCards) {
    lieuxCards.innerHTML = M.lieux.map(l => `
      <div class="lieu-card${l.featured ? ' lieu-featured' : ''}">
        ${l.badge ? `<div class="lieu-badge">${l.badge}</div>` : ''}
        <div class="lieu-icon">${l.icon}</div>
        <p class="lieu-type">${l.type}</p>
        <h3>${l.nom}</h3>
        <address>${l.adresse.join('<br>')}</address>
        <a href="${l.btn.href}" class="${l.featured ? 'btn-outline-light' : 'btn-outline'}">${l.btn.label}</a>
      </div>`).join('');
  }
  setText('map-caption', M.carte.caption);

  // Dress code
  setText('dress-eyebrow', M.dress_eyebrow);
  setText('dress-titre',   M.dress_titre);
  setText('dress-intro',   M.dress_intro);
  const palette = document.getElementById('dc-palette');
  if (palette) {
    palette.innerHTML = M.dress_couleurs.map(c => `
      <div class="dc-swatch${c.eviter ? ' dc-avoid' : ''}" style="--col:${c.hex}">
        <span>${c.nom}${c.eviter ? ' ✕' : ''}</span>
      </div>`).join('');
  }

  // RSVP
  setText('rsvp-eyebrow', M.rsvp_eyebrow);
  setText('rsvp-titre',   M.rsvp_titre);
  setText('rsvp-intro',   M.rsvp_intro);

  // Infos pratiques
  setText('infos-eyebrow', M.infos_eyebrow);
  setText('infos-titre',   M.infos_titre);
  const infosGrid = document.getElementById('infos-grid');
  if (infosGrid) {
    infosGrid.innerHTML = M.infos.map(info => `
      <div class="info-card">
        <span class="info-ico">${info.icon}</span>
        <h3>${info.titre}</h3>
        <p>${info.texte}</p>
      </div>`).join('');
  }

  // FAQ
  setText('faq-titre', M.faq_titre);
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = M.faq.map(f => `
      <div class="faq-item">
        <button class="faq-q">${f.q} <span class="faq-arrow">▾</span></button>
        <div class="faq-a"><p>${f.r}</p></div>
      </div>`).join('');
    initFaq();
  }

  // Footer
  const p1 = M.prenom1.charAt(0), p2 = M.prenom2.charAt(0);
  setText('ft-monogram', `${p1} &amp; ${p2}`);
  setText('ft-date',   `${M.date_affichage} · ${M.domaine} · ${M.ville}`);
  setText('ft-quote',  M.citation);


}

function setText(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function formatDate(d) {
  // e.g. "Samedi 18 Octobre 2026" → "18 · X · 2026"
  const parts = d.split(' ');
  const months = {
    'Janvier':'I','Février':'II','Mars':'III','Avril':'IV','Mai':'V','Juin':'VI',
    'Juillet':'VII','Août':'VIII','Septembre':'IX','Octobre':'X','Novembre':'XI','Décembre':'XII'
  };
  if (parts.length >= 4) {
    const day = parts[1], mon = months[parts[2]] || parts[2], yr = parts[3];
    return `${day} · ${mon} · ${yr}`;
  }
  return d;
}

/* ────────────────────────────────────────
   MARQUEE BAND
──────────────────────────────────────── */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const words = [
    MARIAGE.prenom1, MARIAGE.prenom2,
    'France', 'Canada', 'Vietnam',
    'Japon', MARIAGE.domaine, MARIAGE.ville,
    'Italie', MARIAGE.date_affichage
  ];
  // duplicate for seamless loop
  const content = [...words, ...words].map(w =>
    `<span class="marquee-item">${w}<span class="marquee-dot">◆</span></span>`
  ).join('');
  track.innerHTML = content;
}

/* ────────────────────────────────────────
   LOADER
──────────────────────────────────────── */
function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  let  width     = 0;

  const interval = setInterval(() => {
    width += (100 - width) * 0.035;
    progress.style.width = width + '%';
    if (width > 97) {
      clearInterval(interval);
      progress.style.width = '100%';
      dismissLoader(loader);
    }
  }, 30);

  setTimeout(() => {
    clearInterval(interval);
    progress.style.width = '100%';
    dismissLoader(loader);
  }, 2800);
}

function dismissLoader(loader) {
  if (loader.dataset.dismissed) return;
  loader.dataset.dismissed = '1';

  if (typeof gsap !== 'undefined') {
    gsap.to(loader, {
      yPercent: -100, duration: 0.85,
      ease: 'power3.inOut', delay: 0.15,
      onComplete: () => {
        loader.style.display = 'none';
        document.body.classList.remove('is-loading');
        initVideoHero();
      }
    });
  } else {
    setTimeout(() => {
      loader.style.transition = 'transform 0.85s cubic-bezier(0.76,0,0.24,1)';
      loader.style.transform  = 'translateY(-100%)';
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.classList.remove('is-loading');
      }, 900);
    }, 150);
  }
}

/* ────────────────────────────────────────
   HERO VIDÉO SCROLL-DRIVEN (GSAP)
──────────────────────────────────────── */
function initVideoHero() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Toujours partir du haut de page
  window.scrollTo(0, 0);

  // Cacher le hint au premier scroll
  const hint = document.getElementById('hero-scroll-hint');
  if (hint) {
    window.addEventListener('scroll', function hideHint() {
      hint.style.transition = 'opacity 0.4s';
      hint.style.opacity = '0';
      window.removeEventListener('scroll', hideHint);
    }, { passive: true });
  }

  const frame = document.getElementById('hero-frame');
  const veil  = document.getElementById('hero-veil');
  const mono  = document.getElementById('hero-monogram');
  const names = document.getElementById('hero-names-overlay');
  const date  = document.getElementById('hero-date-overlay');
  const cta   = document.getElementById('hero-cta-overlay');

  // État initial — tout masqué
  gsap.set([frame, mono, names, date, cta], { opacity: 0 });
  gsap.set([mono, names, date, cta], { y: 18 });

  // Le scroll révèle le cadre, assombrit la vidéo et fait apparaître le texte
  ScrollTrigger.create({
    trigger: '#accueil',
    start:   'top top',
    end:     '+=100%',
    pin:     true,
    scrub:   1.0,

    onUpdate(self) {
      const p = self.progress;

      // Film noir sur la vidéo : 0% → 60% de progress → opacité 0 → 0.55
      const veilAlpha = clamp01(p / 0.60) * 0.55;
      gsap.set(veil, { backgroundColor: `rgba(0,0,0,${veilAlpha})` });

      // Cadre doré : 0% → 40%
      gsap.set(frame, { opacity: clamp01(p / 0.40) });

      // Monogramme C ◆ N : 30% → 60%
      const monoP = clamp01((p - 0.30) / 0.30);
      gsap.set(mono,  { opacity: monoP, y: 18 * (1 - monoP) });

      // Noms : 45% → 70%
      const namesP = clamp01((p - 0.45) / 0.25);
      gsap.set(names, { opacity: namesP, y: 18 * (1 - namesP) });

      // Date : 58% → 80%
      const dateP = clamp01((p - 0.58) / 0.22);
      gsap.set(date,  { opacity: dateP,  y: 18 * (1 - dateP) });

      // CTA : 72% → 100%
      const ctaP = clamp01((p - 0.72) / 0.28);
      gsap.set(cta,   { opacity: ctaP,   y: 18 * (1 - ctaP) });
    },
  });

  initScrollAnimations();
  initStickyReveal();
}

/** Clamp une valeur entre 0 et 1 */
function clamp01(v) { return Math.min(1, Math.max(0, v)); }

/* ────────────────────────────────────────
   STICKY REVEAL (function.ai style)
──────────────────────────────────────── */
function initStickyReveal() {
  if (typeof gsap === 'undefined') return;

  const section = document.getElementById('sticky-reveal');
  if (!section) return;

  // CSS position:sticky handles the sticking — GSAP scrubs the animation only (no pin)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=120%',
      scrub: 0.8,
    }
  });

  tl.from('#sr-line-1', { y: 60, opacity: 0, duration: 1 })
    .from('#sr-line-2', { y: 60, opacity: 0, duration: 1 }, '-=0.5')
    .from('#sr-line-3', { y: 80, opacity: 0, duration: 1.2, scale: 0.92, transformOrigin: 'center' }, '-=0.5')
    .to('#sr-line-4',   { y: 0,  opacity: 1, duration: 0.8 }, '-=0.2');
}

/* ────────────────────────────────────────
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
──────────────────────────────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const st = { start: 'top 82%' };

  // Section headers
  document.querySelectorAll('.sect-header').forEach(el => {
    gsap.from(el.children, {
      scrollTrigger: { trigger: el, ...st },
      y: 32, opacity: 0, duration: 0.8,
      stagger: 0.14, ease: 'power3.out'
    });
  });

  // Histoire items – slide from sides
  document.querySelectorAll('.hist-item').forEach((item, i) => {
    const dir = item.dataset.align === 'left' ? -55 : 55;
    gsap.from(item, {
      scrollTrigger: { trigger: item, ...st },
      x: dir, opacity: 0, duration: 0.95,
      delay: i * 0.06, ease: 'power3.out'
    });
  });

  // Programme items – stagger up
  gsap.from('.prog-item', {
    scrollTrigger: { trigger: '.prog-wrap', ...st },
    y: 45, opacity: 0, duration: 0.8,
    stagger: 0.14, ease: 'power3.out'
  });

  // Gallery items
  gsap.from('.gallery-item', {
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 78%' },
    y: 55, opacity: 0, duration: 0.9,
    stagger: { amount: 0.55, from: 'start' },
    ease: 'power3.out'
  });

  // Lieux cards
  gsap.from('.lieu-card', {
    scrollTrigger: { trigger: '.lieux-cards', ...st },
    y: 42, opacity: 0, duration: 0.8,
    stagger: 0.14, ease: 'power3.out'
  });

  // Dress code swatches – pop in
  gsap.from('.dc-swatch', {
    scrollTrigger: { trigger: '.dc-palette', ...st },
    y: 30, opacity: 0, scale: 0.7, duration: 0.6,
    stagger: 0.07, ease: 'back.out(1.6)'
  });

  // Info cards
  gsap.from('.info-card', {
    scrollTrigger: { trigger: '.infos-grid', ...st },
    y: 38, opacity: 0, duration: 0.72,
    stagger: 0.09, ease: 'power3.out'
  });

  // RSVP form
  gsap.from('.rsvp-form', {
    scrollTrigger: { trigger: '.rsvp-form', start: 'top 78%' },
    y: 55, opacity: 0, duration: 1, ease: 'power3.out'
  });

  // Map
  gsap.from('.map-container', {
    scrollTrigger: { trigger: '.map-container', start: 'top 80%' },
    y: 35, opacity: 0, duration: 0.9, ease: 'power3.out'
  });

  // FAQ
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-list', ...st },
    y: 25, opacity: 0, duration: 0.65,
    stagger: 0.1, ease: 'power3.out'
  });

  // Footer monogram
  gsap.from('.ft-monogram', {
    scrollTrigger: { trigger: '.site-footer', start: 'top 85%' },
    y: 30, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out'
  });

  // Couple photo
  gsap.from('.cp-text', {
    scrollTrigger: { trigger: '.couple-photo-section', start: 'top 70%' },
    x: 60, opacity: 0, duration: 1.1, ease: 'power3.out'
  });
  gsap.from('.cp-image-wrap', {
    scrollTrigger: { trigger: '.couple-photo-section', start: 'top 75%' },
    x: -60, opacity: 0, duration: 1.1, ease: 'power3.out'
  });

}

/* ────────────────────────────────────────
   NAVBAR
──────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ────────────────────────────────────────
   COUNTDOWN
──────────────────────────────────────── */
const WEDDING = new Date(MARIAGE.date_iso);

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function tick() {
  const diff = WEDDING - Date.now();
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<p class="cd-num" style="font-size:1.4rem;color:var(--gold)">C\'est aujourd\'hui !</p>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMin   = document.getElementById('cd-min');
  const elSec   = document.getElementById('cd-sec');
  if (!elDays) return;
  elDays.textContent  = pad(d, 3);
  elHours.textContent = pad(h);
  elMin.textContent   = pad(m);
  elSec.textContent   = pad(s);
}
tick();
setInterval(tick, 1000);

/* ────────────────────────────────────────
   CANVAS LEAVES
──────────────────────────────────────── */
const canvas = document.getElementById('leaves-canvas');
const ctx    = canvas ? canvas.getContext('2d') : null;

function sizeCanvas() {
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
if (canvas) {
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas, { passive: true });
}

const LEAF_COLORS = [
  'rgba(210,65,30,0.95)',  'rgba(235,120,35,0.92)',
  'rgba(201,169,110,0.95)','rgba(185,80,18,0.90)',
  'rgba(225,155,45,0.92)', 'rgba(125,140,79,0.88)',
  'rgba(165,38,18,0.93)',  'rgba(245,185,55,0.90)',
  'rgba(107,39,55,0.88)',  'rgba(200,95,40,0.92)',
  'rgba(230,175,80,0.85)', 'rgba(145,55,25,0.90)',
];

class Leaf {
  constructor(rndY = false) { this.reset(rndY); }
  reset(rndY = false) {
    const big    = Math.random() > 0.65;
    this.big     = big;
    this.x       = Math.random() * canvas.width;
    this.y       = rndY ? Math.random() * canvas.height : -50;
    this.sz      = big ? Math.random() * 22 + 16 : Math.random() * 9 + 4;
    this.col     = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
    this.vx      = (Math.random() - 0.5) * 2.2;
    this.vy      = big ? Math.random() * 0.7 + 0.3 : Math.random() * 1.0 + 0.2;
    this.rot     = Math.random() * Math.PI * 2;
    this.drot    = (Math.random() - 0.5) * (big ? 0.022 : 0.065);
    this.amp     = Math.random() * 3.5 + 1.2;
    this.freq    = Math.random() * 0.013 + 0.004;
    this.phase   = Math.random() * Math.PI * 2;
    this.alpha   = big ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4 + 0.5;
    this.shape   = Math.floor(Math.random() * 3);
    this.glow    = big && Math.random() > 0.45;
  }
  update(t) {
    this.y   += this.vy;
    this.x   += this.vx + Math.sin(t * this.freq + this.phase) * this.amp * 0.45;
    this.rot += this.drot;
    if (this.y > canvas.height + 60 || this.x < -90 || this.x > canvas.width + 90) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.col;
    if (this.glow) {
      ctx.shadowBlur  = this.sz * 1.1;
      ctx.shadowColor = this.col;
    }
    ctx.beginPath();
    const s = this.sz;
    if (this.shape === 0) {
      ctx.ellipse(0, 0, s * 0.38, s, 0, 0, Math.PI * 2);
    } else if (this.shape === 1) {
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.92, -s * 0.12, s * 0.68, s * 0.68, 0, s * 0.88);
      ctx.bezierCurveTo(-s * 0.68, s * 0.68, -s * 0.92, -s * 0.12, 0, -s);
    } else {
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 4) / 5 - Math.PI / 2;
        const b = a + Math.PI * 2 / 5;
        ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        ctx.lineTo(Math.cos(b) * s * 0.44, Math.sin(b) * s * 0.44);
      }
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }
}

if (canvas && ctx) {
  const leafCount = window.innerWidth < 768 ? 35 : 95;
  const leaves = Array.from({ length: leafCount }, () => new Leaf(true));
  let frame = 0;

  function animateLeaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    leaves.forEach(l => { l.update(frame); l.draw(); });
    requestAnimationFrame(animateLeaves);
  }
  animateLeaves();
}

/* ────────────────────────────────────────
   MAP (Leaflet)
──────────────────────────────────────── */
const { lat: LAT, lng: LNG, zoom: ZOOM, nom: MAP_NOM, adresse: MAP_ADR } = MARIAGE.carte;

const map = L.map('map', { zoomControl: true, scrollWheelZoom: false })
             .setView([LAT, LNG], ZOOM);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

const pinIcon = L.divIcon({
  html: `<div style="
    width:34px;height:34px;
    background:var(--wine,#6B2737);
    border:3px solid #C9A96E;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 4px 14px rgba(44,24,16,.5);
  "></div>`,
  className: '', iconSize: [34,34], iconAnchor: [17,34], popupAnchor: [0,-36],
});

L.marker([LAT, LNG], { icon: pinIcon })
 .addTo(map)
 .bindPopup(`
   <div style="font-family:'Cormorant Garamond',Georgia,serif;text-align:center;padding:6px 4px">
     <strong style="color:#6B2737;font-style:italic;font-size:1.05rem">${MAP_NOM}</strong><br>
     <span style="font-family:Montserrat,sans-serif;font-size:.75rem;color:#5C3D35">
       ${MAP_ADR.join('<br>')}
     </span>
   </div>`)
 .openPopup();

/* ────────────────────────────────────────
   RSVP FORM
──────────────────────────────────────── */
const form       = document.getElementById('rsvp-form');
const grpInvites = document.getElementById('grp-invites');
const grpMenu    = document.getElementById('grp-menu');
const grpAllergy = document.getElementById('grp-allergies');
const rsvpOk     = document.getElementById('rsvp-ok');
const okMsg      = document.getElementById('ok-msg');

document.querySelectorAll('input[name="presence"]').forEach(r => {
  r.addEventListener('change', () => {
    const coming = r.value === 'oui' && r.checked;
    [grpInvites, grpMenu, grpAllergy].forEach(el => {
      if (typeof gsap !== 'undefined') {
        if (coming) {
          el.style.display = 'block';
          gsap.from(el, { y: 15, opacity: 0, duration: 0.45, ease: 'power2.out' });
        } else {
          el.style.display = 'none';
        }
      } else {
        el.style.display = coming ? 'block' : 'none';
      }
    });
  });
});

const selectInvites      = document.getElementById('f-invites');
const grpAccompagnants   = document.getElementById('grp-accompagnants');
const inputAccompagnants = document.getElementById('f-accompagnants');

function toggleAccompagnants() {
  const val = selectInvites?.value;
  const show = val && val !== '0';
  if (grpAccompagnants) grpAccompagnants.style.display = show ? '' : 'none';
  if (inputAccompagnants) inputAccompagnants.required = show;
}

selectInvites?.addEventListener('change', toggleAccompagnants);
toggleAccompagnants(); // initialise l'état au chargement

form.addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('input[required]:not([type="radio"])').forEach(inp => {
    inp.classList.remove('error');
    const ok = inp.value.trim() &&
               (inp.type !== 'email' || /\S+@\S+\.\S+/.test(inp.value));
    if (!ok) { inp.classList.add('error'); valid = false; }
  });
  if (!form.querySelector('input[name="presence"]:checked')) valid = false;

  if (!valid) {
    const first = form.querySelector('.error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof gsap !== 'undefined') {
      gsap.to(form, { x: [-8, 8, -6, 6, 0], duration: 0.4, ease: 'none' });
    }
    return;
  }

  const prenom   = document.getElementById('f-prenom').value.trim();
  const presence = form.querySelector('input[name="presence"]:checked').value;
  const invites  = document.getElementById('f-invites')?.value ?? '0';

  const payload = {
    prenom,
    nom:                    document.getElementById('f-nom').value.trim(),
    email:                  document.getElementById('f-email').value.trim(),
    presence,
    invites,
    prenoms_accompagnants:  invites !== '0' ? (document.getElementById('f-accompagnants')?.value.trim() || null) : null,
    menu:                   form.querySelector('input[name="menu"]:checked')?.value ?? null,
    allergies:              document.getElementById('f-allergies')?.value.trim() || null,
    message:                document.getElementById('f-msg').value.trim() || null,
  };

  const btnSubmit = form.querySelector('[type="submit"]');
  if (btnSubmit) btnSubmit.disabled = true;

  if (!db) {
    alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter par email.');
    if (btnSubmit) btnSubmit.disabled = false;
    return;
  }
  const { error } = await db.from('rsvp').insert(payload);

  if (error) {
    alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter par email.');
    console.error('Supabase error:', error);
    if (btnSubmit) btnSubmit.disabled = false;
    return;
  }

  const msg = presence === 'oui'
    ? `Merci ${prenom} ! Votre présence est confirmée. Nous avons hâte de vous voir le ${MARIAGE.date_affichage} 🎉`
    : `Merci ${prenom} pour votre réponse. Vous serez dans nos pensées ce beau jour-là 💕`;

  if (typeof gsap !== 'undefined') {
    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.45, ease: 'power2.in',
      onComplete: () => {
        form.style.display = 'none';
        okMsg.textContent = msg;
        rsvpOk.style.display = 'block';
        gsap.from(rsvpOk, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
      }
    });
  } else {
    form.style.display = 'none';
    okMsg.textContent = msg;
    rsvpOk.style.display = 'block';
  }
});

/* ────────────────────────────────────────
   FAQ ACCORDION
──────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ────────────────────────────────────────
   TRADUCTION
──────────────────────────────────────── */
function setLanguage(lang) {
  const M  = MARIAGE;
  const t  = (lang !== 'fr' && M.i18n && M.i18n[lang]) ? M.i18n[lang] : null;
  const tr = (key) => (t && t[key] !== undefined) ? t[key] : M[key];

  // Nav links
  const navLabels = tr('nav') || ['Histoire','Le Jour J','Domaine','Les Lieux','RSVP','Infos'];
  document.querySelectorAll('.nav-links li a').forEach((a, i) => {
    if (navLabels[i]) a.textContent = navLabels[i];
  });

  // Hero
  setText('hero-invite', tr('hero_intro'));
  const cta = document.getElementById('hero-cta-overlay');
  if (cta) cta.textContent = (t && t.hero_cta) ? t.hero_cta : 'Confirmer ma présence';

  // Scroll hint
  const scrollLabel = document.querySelector('.scroll-label');
  if (scrollLabel) scrollLabel.textContent = tr('scroll_label') || 'Découvrir';

  // Sticky reveal lignes
  setText('sr-line-1', tr('sr_line1') || 'Avant ce jour,');
  setText('sr-line-2', tr('sr_line2') || 'notre histoire s\'écrivait');

  // Countdown labels
  const cdL = tr('cd_labels') || ['Jours','Heures','Minutes','Secondes'];
  ['cd-days-lbl','cd-hours-lbl','cd-min-lbl','cd-sec-lbl'].forEach((id, i) => setText(id, cdL[i]));

  // Histoire
  setText('histoire-eyebrow', tr('histoire_eyebrow'));
  setText('histoire-titre',   tr('histoire_titre'));
  const histWrapLang = document.getElementById('histoire-wrap');
  if (histWrapLang) {
    histWrapLang.innerHTML = tr('histoire').map(h => `
      <div class="hist-item" data-align="${h.align}">
        <div class="hist-year">${h.annee}</div>
        <div class="hist-dot"></div>
        <div class="hist-card">
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>
      </div>`).join('');
  }

  // Programme
  setText('programme-eyebrow', tr('programme_eyebrow'));
  setText('programme-titre',   tr('programme_titre'));
  const progWrap = document.getElementById('prog-wrap');
  if (progWrap) {
    progWrap.innerHTML = tr('programme').map(p => `
      <div class="prog-item">
        <span class="prog-time">${p.heure}</span>
        <div class="prog-icon">${p.icon}</div>
        <div class="prog-card"><h3>${p.titre}</h3><p>${p.lieu}</p></div>
      </div>`).join('');
  }

  // Galerie
  setText('galerie-eyebrow', tr('galerie_eyebrow'));
  setText('galerie-titre',   tr('galerie_titre'));

  // Lieux
  setText('lieux-eyebrow', tr('lieux_eyebrow'));
  setText('lieux-titre',   tr('lieux_titre'));
  const lieuxCards = document.getElementById('lieux-cards');
  if (lieuxCards) {
    const transLieux = tr('lieux') || [];
    lieuxCards.innerHTML = M.lieux.map((l, i) => {
      const tl = transLieux[i] || {};
      const type  = tl.type  || l.type;
      const badge = (tl.badge !== undefined ? tl.badge : l.badge);
      const btnLbl = (tl.btn && tl.btn.label) || l.btn.label;
      return `
      <div class="lieu-card${l.featured ? ' lieu-featured' : ''}">
        ${badge ? `<div class="lieu-badge">${badge}</div>` : ''}
        <div class="lieu-icon">${l.icon}</div>
        <p class="lieu-type">${type}</p>
        <h3>${l.nom}</h3>
        <address>${l.adresse.join('<br>')}</address>
        <a href="${l.btn.href}" class="${l.featured ? 'btn-outline-light' : 'btn-outline'}">${btnLbl}</a>
      </div>`;
    }).join('');
  }

  // Dress code
  setText('dress-eyebrow', tr('dress_eyebrow'));
  setText('dress-titre',   tr('dress_titre'));
  setText('dress-intro',   tr('dress_intro'));

  // RSVP
  setText('rsvp-eyebrow', tr('rsvp_eyebrow'));
  setText('rsvp-titre',   tr('rsvp_titre'));
  setText('rsvp-intro',   tr('rsvp_intro'));

  // Form
  const f = (t && t.form) ? t.form : {
    prenom: 'Prénom *',     prenom_ph: 'Votre prénom',
    nom:    'Nom *',        nom_ph:    'Votre nom',
    email:  'Email *',
    presence: 'Serez-vous présent(e) ? *',
    oui:    'Oui, avec joie ! 🎉',   non: 'Non, malheureusement 😢',
    invites: "Nombre d'accompagnant(s)",
    invites_opts: ["Je viens seul(e)","+ 1 accompagnant(e)","+ 2 accompagnants","+ 3 accompagnants","+ 4 ou plus"],
    menu:       'Préférence de menu',  vegetarien: 'Végétarien',
    allergies:  'Allergies ou régimes alimentaires',
    allergies_ph: 'Ex : sans gluten, allergie aux noix…',
    message:    'Un mot pour les mariés',
    message_ph: 'Votre message, vœux, anecdote…',
    submit:     'Envoyer ma réponse',  ok_h3: 'Merci !',
  };
  setText('lbl-prenom',   f.prenom);   setAttr('f-prenom',    'placeholder', f.prenom_ph);
  setText('lbl-nom',      f.nom);      setAttr('f-nom',       'placeholder', f.nom_ph);
  setText('lbl-email',    f.email);
  setText('lbl-presence', f.presence);
  setText('lbl-oui',      f.oui);
  setText('lbl-non',      f.non);
  setText('lbl-invites',  f.invites);
  setText('lbl-vegetarien', f.vegetarien || 'Végétarien');
  const sel = document.getElementById('f-invites');
  if (sel && f.invites_opts) sel.innerHTML = f.invites_opts.map((o, i) => `<option value="${i}">${o}</option>`).join('');
  setText('lbl-menu',      f.menu);
  setText('lbl-allergies', f.allergies); setAttr('f-allergies', 'placeholder', f.allergies_ph);
  setText('lbl-message',   f.message);   setAttr('f-msg',       'placeholder', f.message_ph);
  setText('btn-submit',    f.submit);
  setText('ok-h3',         f.ok_h3);

  // Infos
  setText('infos-eyebrow', tr('infos_eyebrow'));
  setText('infos-titre',   tr('infos_titre'));
  const infosGrid = document.getElementById('infos-grid');
  if (infosGrid) {
    infosGrid.innerHTML = tr('infos').map(info => `
      <div class="info-card">
        <span class="info-ico">${info.icon}</span>
        <h3>${info.titre}</h3>
        <p>${info.texte}</p>
      </div>`).join('');
  }

  // FAQ
  setText('faq-titre', tr('faq_titre'));
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = tr('faq').map(f => `
      <div class="faq-item">
        <button class="faq-q">${f.q} <span class="faq-arrow">▾</span></button>
        <div class="faq-a"><p>${f.r}</p></div>
      </div>`).join('');
    initFaq();
  }

  // Footer
  setText('ft-quote', tr('citation'));

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}

function setAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}

/* ────────────────────────────────────────
   BOOT
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  hydrate();
  initLoader();

  // Lang switcher
  document.getElementById('lang-switch')?.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
});
