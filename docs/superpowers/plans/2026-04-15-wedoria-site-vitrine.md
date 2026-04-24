# Wedoria Site Vitrine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer le site vitrine public de Wedoria — 3 fichiers statiques (index.html, style.css, script.js) dans `wedoria-site-vitrine/`, déployables sur Vercel.

**Architecture:** Site statique mobile-first en HTML/CSS/JS vanilla. GSAP ScrollTrigger pour les animations avancées (pin manifeste, scroll horizontal portfolio) activées uniquement sur desktop ≥ 768px. Canvas 2D pour les pétales du hero. Tout le contenu est hardcodé dans le HTML avec des commentaires clairs.

**Tech Stack:** HTML5, CSS3, Vanilla JS ES6, GSAP 3 + ScrollTrigger (CDN), Google Fonts (Cormorant Garamond + Jost), Canvas API natif.

**User Verification:** NO

---

## Structure des fichiers

```
C:\Users\nhu-s\Documents\programs\wedoria-site-vitrine\
├── index.html    ← structure HTML complète, 10 sections
├── style.css     ← design tokens, reset, styles de toutes les sections
└── script.js     ← loader, canvas pétales, navbar, GSAP animations, formulaire
```

Pas de fichiers séparés par section — tout reste dans 3 fichiers pour faciliter la maintenance et le déploiement Vercel.

---

## Task 0: Scaffold — fichiers, tokens, fonts

**Goal:** Créer les 3 fichiers avec le squelette HTML, les variables CSS et l'import des fonts.

**Files:**
- Create: `wedoria-site-vitrine/index.html`
- Create: `wedoria-site-vitrine/style.css`
- Create: `wedoria-site-vitrine/script.js`

**Acceptance Criteria:**
- [ ] index.html valide avec doctype, meta viewport, liens vers style.css/script.js et CDN GSAP
- [ ] style.css contient tous les custom properties (--ivory, --cream, --warm, --gold, --burgundy, --ink, --paper)
- [ ] Reset CSS inclus (box-sizing, margin 0, scroll-behavior smooth)
- [ ] Google Fonts Cormorant Garamond + Jost chargées
- [ ] script.js vide avec `'use strict';` en tête
- [ ] Ouvrir index.html dans navigateur → fond ivoire visible, pas d'erreur console

**Verify:** Ouvrir `wedoria-site-vitrine/index.html` dans navigateur → fond `#FAFAF7`, titre onglet "Wedoria · Sites de mariage sur-mesure"

**Steps:**

- [ ] **Step 1 : Créer index.html**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedoria · Sites de mariage sur-mesure</title>
  <meta name="description" content="Wedoria crée des sites de mariage clé-en-main, livrés en 5 jours. À partir de 290€." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="is-loading">

  <!-- Sections seront ajoutées dans les tâches suivantes -->

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2 : Créer style.css**

```css
/* ══════════════════════════════════════════════
   WEDORIA · SITE VITRINE
   style.css
   ══════════════════════════════════════════════ */

/* ── DESIGN TOKENS ── */
:root {
  --ivory:    #FAFAF7;
  --cream:    #F8F4EE;
  --warm:     #EDE5D8;
  --gold:     #C9A96E;
  --burgundy: #6B2737;
  --ink:      #1C1C1C;
  --paper:    #F8F4EE;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Jost', system-ui, sans-serif;

  --section-pad: clamp(5rem, 10vw, 10rem);
  --gap:         clamp(1.5rem, 3vw, 3rem);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--ivory);
  color: var(--ink);
  font-family: var(--font-body);
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
img, canvas { display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

/* ── UTILITAIRES ── */
.visually-hidden {
  position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
}

/* ── REDUCED MOTION ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3 : Créer script.js**

```js
'use strict';

// Wedoria · Site Vitrine
// script.js

// Enregistrement ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

- [ ] **Step 4 : Vérifier dans le navigateur**

Ouvrir `wedoria-site-vitrine/index.html` → page blanche sur fond `#FAFAF7`, pas d'erreur console, fonts chargées.

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["3 fichiers créés", "fond ivoire visible", "GSAP chargé sans erreur console"], "requiresUserVerification": false}
```

---

## Task 1: Loader

**Goal:** Animation d'entrée avec monogramme "W", barre de progression dorée, fade-out vers le site.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — ajouter section `#loader`
- Modify: `wedoria-site-vitrine/style.css` — styles loader
- Modify: `wedoria-site-vitrine/script.js` — timeline GSAP loader

**Acceptance Criteria:**
- [ ] Loader occupe 100vh, fond `#FAFAF7`
- [ ] "W" en Cormorant Garamond italic apparaît en fade + scale
- [ ] Barre de progression fine (2px) se remplit en or `#C9A96E`
- [ ] Loader disparaît après ~1.8s, site devient visible
- [ ] `body.is-loading` bloque le scroll pendant le loader

**Verify:** Rafraîchir la page → loader visible ~1.8s puis disparaît

**Steps:**

- [ ] **Step 1 : HTML du loader dans index.html** (après `<body>`, avant les autres sections)

```html
<!-- ══ LOADER ══════════════════════════════════════ -->
<div id="loader" aria-hidden="true">
  <div class="loader-inner">
    <div class="loader-monogram">W</div>
    <div class="loader-bar-track">
      <div class="loader-bar-fill"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 2 : CSS loader dans style.css**

```css
/* ── LOADER ── */
#loader {
  position: fixed; inset: 0;
  background: var(--ivory);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
body.is-loading { overflow: hidden; }

.loader-inner { text-align: center; }

.loader-monogram {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(4rem, 10vw, 7rem);
  color: var(--ink);
  line-height: 1;
  margin-bottom: 2rem;
  opacity: 0;
  transform: scale(0.9);
}

.loader-bar-track {
  width: clamp(120px, 20vw, 200px);
  height: 1px;
  background: var(--warm);
  margin: 0 auto;
  overflow: hidden;
}

.loader-bar-fill {
  height: 100%;
  width: 0;
  background: var(--gold);
}
```

- [ ] **Step 3 : JS loader dans script.js**

```js
// ── LOADER ──
function initLoader() {
  const loader = document.getElementById('loader');
  const monogram = loader.querySelector('.loader-monogram');
  const barFill = loader.querySelector('.loader-bar-fill');

  const tl = gsap.timeline({
    onComplete: () => {
      loader.style.display = 'none';
      document.body.classList.remove('is-loading');
    }
  });

  tl.to(monogram, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
    .to(barFill,   { width: '100%', duration: 0.8, ease: 'power1.inOut' }, '-=0.2')
    .to(loader,    { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.2');
}

document.addEventListener('DOMContentLoaded', initLoader);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["Loader visible au chargement", "W apparaît en fade+scale", "barre se remplit en or", "loader disparaît après 1.8s"], "requiresUserVerification": false}
```

---

## Task 2: Navbar

**Goal:** Navigation sticky avec logo Wedoria, liens desktop, menu hamburger mobile.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — ajouter `<nav>`
- Modify: `wedoria-site-vitrine/style.css` — styles navbar + menu mobile
- Modify: `wedoria-site-vitrine/script.js` — scroll opacity, hamburger toggle

**Acceptance Criteria:**
- [ ] Navbar fixed, z-index 100
- [ ] Fond transparent → `rgba(250,250,247,0.92)` + blur au scroll
- [ ] Desktop (≥768px) : logo gauche, liens droite
- [ ] Mobile (<768px) : logo centré, hamburger droite, menu plein écran overlay
- [ ] Smooth scroll vers les ancres `#portfolio`, `#formules`, `#processus`, `#contact`
- [ ] Focus visible sur tous les liens

**Verify:** Scroller → navbar devient opaque. Mobile : cliquer hamburger → menu plein écran s'ouvre.

**Steps:**

- [ ] **Step 1 : HTML navbar** (après `#loader`, avant les sections)

```html
<!-- ══ NAVBAR ══════════════════════════════════════ -->
<nav id="navbar">
  <div class="nav-container">
    <a href="#accueil" class="nav-logo">Wedoria</a>

    <ul class="nav-links" role="list">
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#formules">Formules</a></li>
      <li><a href="#processus">Comment ça marche</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <button class="nav-hamburger" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>

  <!-- Menu mobile plein écran -->
  <div class="nav-mobile-menu" aria-hidden="true">
    <ul role="list">
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#formules">Formules</a></li>
      <li><a href="#processus">Comment ça marche</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>
```

- [ ] **Step 2 : CSS navbar**

```css
/* ── NAVBAR ── */
#navbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background 0.3s, backdrop-filter 0.3s;
}
#navbar.scrolled {
  background: rgba(250, 250, 247, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.nav-container {
  max-width: 1200px; margin: 0 auto;
  padding: 1.5rem clamp(1.5rem, 5vw, 3rem);
  display: flex; align-items: center; justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 1.4rem;
  color: var(--ink);
}

.nav-links {
  display: none;
  gap: 2.5rem;
}
.nav-links a {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 400;
  color: var(--ink);
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--gold); }
.nav-links a:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* Hamburger */
.nav-hamburger {
  display: flex; flex-direction: column;
  gap: 5px; padding: 4px;
}
.nav-hamburger span {
  display: block; width: 24px; height: 1px;
  background: var(--ink);
  transition: transform 0.3s, opacity 0.3s;
}
.nav-hamburger[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.nav-hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav-hamburger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
.nav-hamburger:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* Menu mobile */
.nav-mobile-menu {
  position: fixed; inset: 0;
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
  z-index: -1;
}
.nav-mobile-menu.open {
  opacity: 1; pointer-events: all; z-index: 99;
}
.nav-mobile-menu ul { text-align: center; }
.nav-mobile-menu li { margin: 1.5rem 0; }
.nav-mobile-menu a {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(2rem, 6vw, 3rem);
  color: var(--paper);
  font-weight: 300;
}
.nav-mobile-menu a:hover { color: var(--gold); }

/* Desktop */
@media (min-width: 768px) {
  .nav-links { display: flex; }
  .nav-hamburger { display: none; }
  .nav-logo { /* centrage supprimé sur desktop */ }
}
```

- [ ] **Step 3 : JS navbar**

```js
// ── NAVBAR ──
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = navbar.querySelector('.nav-hamburger');
  const mobileMenu = navbar.querySelector('.nav-mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  // Scroll → fond opaque
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  // Fermer le menu au clic sur un lien
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

document.addEventListener('DOMContentLoaded', initNavbar);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["navbar visible", "fond change au scroll", "hamburger ouvre menu mobile plein écran", "liens smooth-scrollent"], "requiresUserVerification": false}
```

---

## Task 3: Hero — Pétales Canvas

**Goal:** Section plein écran avec canvas pétales animés, grand titre, sous-titre et CTA.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `#accueil`
- Modify: `wedoria-site-vitrine/style.css` — styles hero
- Modify: `wedoria-site-vitrine/script.js` — canvas pétales, hover magnétique, scroll hint

**Acceptance Criteria:**
- [ ] Hero = 100svh, fond `#FAFAF7`
- [ ] Canvas plein écran derrière le contenu, resize adaptatif
- [ ] Pétales dorés animés : 20 sur mobile, 50 sur desktop
- [ ] Titre, sous-titre, CTA centrés verticalement
- [ ] Hover magnétique sur CTA (desktop uniquement)
- [ ] Scroll hint animé en bas

**Verify:** Hero visible en plein écran, pétales animés, CTA cliquable.

**Steps:**

- [ ] **Step 1 : HTML hero** (après `<nav>`)

```html
<!-- ══ HERO ══════════════════════════════════════ -->
<section id="accueil" class="hero">
  <canvas id="hero-canvas" aria-hidden="true"></canvas>
  <div class="hero-content">
    <h1 class="hero-title">Des sites de mariage<br>qui racontent<br>votre histoire.</h1>
    <p class="hero-sub">Clé-en-main · Livré en 5 jours · À partir de 290€</p>
    <a href="#contact" class="btn-primary js-magnetic">Démarrer mon projet →</a>
  </div>
  <a href="#manifeste" class="scroll-hint" aria-label="Défiler vers le bas">
    <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
      <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" stroke-width="1.5"/>
      <circle class="scroll-dot" cx="10" cy="8" r="2.5" fill="currentColor"/>
    </svg>
  </a>
</section>
```

- [ ] **Step 2 : CSS hero**

```css
/* ── HERO ── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  padding: 0 clamp(1.5rem, 5vw, 3rem);
}

#hero-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.hero-content {
  position: relative; z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(2.8rem, 7vw, 6.5rem);
  line-height: 1.1;
  color: var(--ink);
  margin-bottom: 1.5rem;
}

.hero-sub {
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--burgundy);
  font-weight: 400;
  margin-bottom: 2.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.9rem 2rem;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  transition: background 0.3s, color 0.3s, transform 0.2s;
}
.btn-primary:hover { background: var(--gold); color: var(--ink); }
.btn-primary:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* Scroll hint */
.scroll-hint {
  position: absolute; bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  color: var(--ink); opacity: 0;
  animation: scrollHintAppear 0.6s 2s forwards;
}
@keyframes scrollHintAppear { to { opacity: 0.5; } }

.scroll-dot {
  animation: scrollDotBounce 1.5s ease-in-out infinite;
  transform-origin: center;
}
@keyframes scrollDotBounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}
```

- [ ] **Step 3 : JS canvas pétales + hover magnétique**

```js
// ── HERO CANVAS — PÉTALES ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;
  const COUNT = () => isMobile() ? 20 : 50;

  let petals = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function createPetal() {
    return {
      x:     Math.random() * W,
      y:     -10 - Math.random() * 20,
      size:  4 + Math.random() * 6,
      speed: 0.6 + Math.random() * 0.8,
      rot:   Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      drift:    (Math.random() - 0.5) * 0.4,
      opacity:  0.2 + Math.random() * 0.3,
    };
  }

  // Initialiser
  for (let i = 0; i < COUNT(); i++) {
    const p = createPetal();
    p.y = Math.random() * H; // positions initiales réparties
    petals.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#C9A96E';
      ctx.beginPath();
      // Forme pétale : ellipse orientée
      ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y   += p.speed;
      p.x   += p.drift;
      p.rot += p.rotSpeed;

      if (p.y > H + 20) {
        const np = createPetal();
        np.y = -10;
        Object.assign(p, np);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ── HOVER MAGNÉTIQUE ──
function initMagnetic() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.js-magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const dx  = e.clientX - (r.left + r.width  / 2);
      const dy  = e.clientY - (r.top  + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initMagnetic();
});
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["hero plein écran", "pétales animés visibles", "titre/sous-titre/CTA centrés", "scroll hint visible après 2s"], "requiresUserVerification": false}
```

---

## Task 4: Manifeste (section accroche)

**Goal:** Section avec texte révélé mot par mot — épinglée sur desktop, reveal simple sur mobile.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `#manifeste`
- Modify: `wedoria-site-vitrine/style.css` — styles manifeste
- Modify: `wedoria-site-vitrine/script.js` — GSAP pin/scrub desktop + IntersectionObserver mobile

**Acceptance Criteria:**
- [ ] Section fond `#1C1C1C`, texte `#F8F4EE`
- [ ] Texte découpé en `<span>` par mot, chaque span démarre à opacity 0.12
- [ ] Desktop : section épinglée ~300vh, mots révélés au scrub via ScrollTrigger
- [ ] Mobile : mots révélés par groupe (lignes) via IntersectionObserver (opacity+Y)
- [ ] `prefers-reduced-motion` : tout le texte visible statiquement

**Verify:** Desktop → scroller dans la section épinglée fait apparaître les mots. Mobile → scroll simple.

**Steps:**

- [ ] **Step 1 : HTML manifeste**

```html
<!-- ══ MANIFESTE ══════════════════════════════════ -->
<section id="manifeste" class="manifeste">
  <div class="manifeste-inner">
    <p class="manifeste-text" id="manifeste-text">
      Votre mariage est unique. Votre site devrait l'être aussi.
      Nous créons des expériences web qui capturent l'essence de votre histoire,
      pour que vos invités arrivent déjà émerveillés.
    </p>
  </div>
</section>
```

- [ ] **Step 2 : CSS manifeste**

```css
/* ── MANIFESTE ── */
.manifeste {
  background: var(--ink);
  padding: var(--section-pad) clamp(1.5rem, 5vw, 3rem);
}

.manifeste-inner {
  max-width: 900px; margin: 0 auto;
}

.manifeste-text {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.6rem, 3.5vw, 3.2rem);
  line-height: 1.5;
  color: var(--paper);
}

/* Les spans sont ajoutés par JS */
.manifeste-text .word {
  display: inline-block;
  opacity: 0.12;
  transition: opacity 0.4s;
}
.manifeste-text .word.visible { opacity: 1; }

/* Mobile : lignes visibles par groupe */
@media (prefers-reduced-motion: reduce) {
  .manifeste-text .word { opacity: 1 !important; }
}

/* Desktop : section occupe plus de scroll height */
@media (min-width: 768px) {
  .manifeste {
    /* La hauteur réelle est gérée par GSAP pin en JS */
    padding: 0;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
  }
  .manifeste-inner {
    padding: clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 3rem);
  }
}
```

- [ ] **Step 3 : JS manifeste**

```js
// ── MANIFESTE ──
function initManifeste() {
  const section = document.getElementById('manifeste');
  const textEl  = document.getElementById('manifeste-text');

  // Découper le texte en spans par mot
  const rawText = textEl.textContent.trim();
  const words   = rawText.split(/\s+/);
  textEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  const spans = textEl.querySelectorAll('.word');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    spans.forEach(s => s.classList.add('visible'));
    return;
  }

  const isDesktop = () => window.innerWidth >= 768;

  if (isDesktop()) {
    // ── DESKTOP : GSAP pin + scrub ──
    gsap.set(spans, { opacity: 0.12 });

    ScrollTrigger.create({
      trigger: section,
      start:   'top top',
      end:     '+=250%',
      pin:     true,
      scrub:   1,
      onUpdate: self => {
        const progress = self.progress; // 0→1
        const revealCount = Math.floor(progress * spans.length);
        spans.forEach((s, i) => {
          gsap.set(s, { opacity: i < revealCount ? 1 : 0.12 });
        });
      }
    });
  } else {
    // ── MOBILE : IntersectionObserver par groupes ──
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          spans.forEach((s, i) => {
            setTimeout(() => s.classList.add('visible'), i * 40);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(section);
  }
}

document.addEventListener('DOMContentLoaded', initManifeste);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["section sombre visible", "mots révélés au scroll desktop", "reveal mobile fonctionnel", "prefers-reduced-motion respecté"], "requiresUserVerification": false}
```

---

## Task 5: Comment ça marche

**Goal:** 3 étapes animées avec grande numérotation Cormorant et ligne dorée verticale (desktop).

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `#processus`
- Modify: `wedoria-site-vitrine/style.css` — styles processus
- Modify: `wedoria-site-vitrine/script.js` — stagger d'entrée ScrollTrigger

**Acceptance Criteria:**
- [ ] 3 étapes avec numéros 01/02/03 en Cormorant, taille ~7rem, couleur or
- [ ] Mobile : étapes empilées verticalement
- [ ] Desktop : 3 colonnes, ligne dorée verticale entre chaque colonne (via border-left)
- [ ] Entrée en stagger au scroll (opacity + translateY)

**Verify:** Scroll vers la section → 3 étapes apparaissent en cascade.

**Steps:**

- [ ] **Step 1 : HTML processus**

```html
<!-- ══ COMMENT ÇA MARCHE ══════════════════════════ -->
<section id="processus" class="processus">
  <div class="section-container">
    <h2 class="section-title">Comment ça marche</h2>
    <div class="steps">

      <div class="step">
        <span class="step-number">01</span>
        <h3 class="step-title">Vous remplissez notre formulaire de découverte</h3>
        <p class="step-desc">15 minutes pour nous parler de votre mariage, vos envies, votre style.</p>
      </div>

      <div class="step">
        <span class="step-number">02</span>
        <h3 class="step-title">Nous créons votre site sur-mesure</h3>
        <p class="step-desc">En 48 à 72 heures, votre site prend vie avec votre histoire et vos couleurs.</p>
      </div>

      <div class="step">
        <span class="step-number">03</span>
        <h3 class="step-title">Vous recevez le lien et invitez vos proches</h3>
        <p class="step-desc">Partagez, suivez les RSVP, et profitez. Nous gérons le reste.</p>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2 : CSS processus**

```css
/* ── PROCESSUS ── */
.processus {
  background: var(--cream);
  padding: var(--section-pad) clamp(1.5rem, 5vw, 3rem);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--ink);
  margin-bottom: clamp(3rem, 6vw, 5rem);
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.step {
  opacity: 0; /* révélé par GSAP */
  transform: translateY(30px);
}

.step-number {
  display: block;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(4rem, 8vw, 7rem);
  color: var(--gold);
  line-height: 1;
  margin-bottom: 1rem;
}

.step-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: var(--ink);
  margin-bottom: 0.75rem;
}

.step-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  color: #666;
  font-weight: 300;
}

@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  .step {
    padding: 0 clamp(2rem, 4vw, 3rem);
  }
  .step + .step {
    border-left: 1px solid var(--gold);
  }
}

@media (prefers-reduced-motion: reduce) {
  .step { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3 : JS stagger processus**

```js
// ── PROCESSUS ──
function initProcessus() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.to(step, {
      opacity: 1, y: 0, duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      delay: i * 0.15
    });
  });
}

document.addEventListener('DOMContentLoaded', initProcessus);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["3 étapes visibles", "numéros en or", "ligne dorée verticale desktop", "stagger animation au scroll"], "requiresUserVerification": false}
```

---

## Task 6: Portfolio

**Goal:** 6 cartes avec scroll horizontal GSAP épinglé (desktop) et grille verticale (mobile).

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `#portfolio`
- Modify: `wedoria-site-vitrine/style.css` — styles portfolio
- Modify: `wedoria-site-vitrine/script.js` — GSAP horizontal scroll + hover overlay

**Acceptance Criteria:**
- [ ] 6 cartes avec noms fictifs, gradients placeholder thématiques
- [ ] Desktop : container épinglé, translateX scrubé via GSAP
- [ ] Mobile : grid 1 colonne, scroll vertical natif
- [ ] Hover desktop : élévation + overlay bordeaux avec infos

**Verify:** Desktop → scroller sur la section portfolio fait glisser les cartes horizontalement.

**Steps:**

- [ ] **Step 1 : HTML portfolio**

```html
<!-- ══ PORTFOLIO ══════════════════════════════════ -->
<section id="portfolio" class="portfolio">
  <div class="portfolio-header section-container">
    <h2 class="section-title">Nos créations</h2>
    <p class="portfolio-sub">Des sites qui ressemblent à chaque couple, uniques et mémorables.</p>
  </div>

  <div class="portfolio-track-wrap">
    <div class="portfolio-track">

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #2C1810 0%, #5C3317 50%, #8B5E3C 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Catherine &amp; Nhu-Sao</h3>
          <p>Château de Vaux-le-Vicomte · Automne 2026</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Catherine &amp; Nhu-Sao</span>
        </div>
      </article>

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #3D5A3E 0%, #6B8F71 50%, #A8C5A0 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Sophie &amp; Thomas</h3>
          <p>Domaine de la Croix · Champêtre 2026</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Sophie &amp; Thomas</span>
        </div>
      </article>

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #1A1A2E 0%, #2D2D44 50%, #4A4A6A 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Élise &amp; Romain</h3>
          <p>Paris 7e · Urbain chic 2025</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Élise &amp; Romain</span>
        </div>
      </article>

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #1C3A5C 0%, #2E6DA4 50%, #7EB8D4 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Camille &amp; Antoine</h3>
          <p>Côte d'Azur · Été méditerranéen 2025</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Camille &amp; Antoine</span>
        </div>
      </article>

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #3D2B1F 0%, #8B6914 50%, #C9A96E 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Marie &amp; Lucas</h3>
          <p>Alsace · Automne doré 2025</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Marie &amp; Lucas</span>
        </div>
      </article>

      <article class="portfolio-card" style="--card-grad: linear-gradient(135deg, #1A3A3A 0%, #2E7D7D 50%, #7EC8C8 100%)">
        <div class="card-placeholder"></div>
        <div class="card-overlay">
          <h3>Anaïs &amp; Pierre</h3>
          <p>Bretagne · Côtier naturel 2025</p>
          <a href="#" class="card-link">Voir le site →</a>
        </div>
        <div class="card-info">
          <span>Anaïs &amp; Pierre</span>
        </div>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 2 : CSS portfolio**

```css
/* ── PORTFOLIO ── */
.portfolio {
  background: var(--ink);
  padding-top: var(--section-pad);
}

.portfolio-header {
  padding: 0 clamp(1.5rem, 5vw, 3rem);
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}
.portfolio-header .section-title { color: var(--paper); }

.portfolio-sub {
  font-size: 0.9rem;
  color: rgba(248,244,238,0.6);
  font-weight: 300;
  margin-top: 0.5rem;
}

/* MOBILE : grid vertical */
.portfolio-track-wrap {
  padding: 0 clamp(1.5rem, 5vw, 3rem) var(--section-pad);
}

.portfolio-track {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.portfolio-card {
  position: relative;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}

.card-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: var(--card-grad);
  transition: transform 0.4s ease;
}

.card-overlay {
  position: absolute; inset: 0;
  background: rgba(107, 39, 55, 0.85);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 2rem;
  opacity: 0;
  transition: opacity 0.3s;
}
.portfolio-card:hover .card-overlay { opacity: 1; }
.portfolio-card:hover .card-placeholder { transform: scale(1.03); }

.card-overlay h3 {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.5rem;
  color: var(--paper);
  margin-bottom: 0.5rem;
}
.card-overlay p {
  font-size: 0.8rem;
  color: rgba(248,244,238,0.8);
  letter-spacing: 0.06em;
  margin-bottom: 1.5rem;
}
.card-link {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  border-bottom: 1px solid var(--gold);
  padding-bottom: 2px;
  transition: color 0.2s;
}

.card-info {
  padding: 0.75rem 1rem;
  background: rgba(28,28,28,0.8);
}
.card-info span {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--paper);
  font-size: 0.95rem;
}

/* DESKTOP : scroll horizontal */
@media (min-width: 768px) {
  .portfolio-track-wrap {
    overflow: hidden;
    padding: 0 0 var(--section-pad);
  }
  .portfolio-track {
    display: flex;
    flex-wrap: nowrap;
    gap: 2rem;
    padding: 0 clamp(1.5rem, 5vw, 3rem);
    width: max-content;
  }
  .portfolio-card {
    width: 380px;
    flex-shrink: 0;
  }
  .card-placeholder {
    aspect-ratio: unset;
    height: 280px;
  }
}
```

- [ ] **Step 3 : JS portfolio horizontal**

```js
// ── PORTFOLIO HORIZONTAL ──
function initPortfolio() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrap  = document.querySelector('.portfolio-track-wrap');
  const track = document.querySelector('.portfolio-track');

  const getScrollAmount = () => -(track.scrollWidth - wrap.offsetWidth);

  ScrollTrigger.create({
    trigger: '.portfolio',
    start:  'top top',
    end:    () => `+=${track.scrollWidth}`,
    pin:    true,
    scrub:  1,
    onUpdate: self => {
      const x = self.progress * getScrollAmount();
      gsap.set(track, { x });
    },
    invalidateOnRefresh: true
  });
}

document.addEventListener('DOMContentLoaded', initPortfolio);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["6 cartes visibles", "scroll horizontal desktop fonctionnel", "hover overlay visible", "mobile grid vertical"], "requiresUserVerification": false}
```

---

## Task 7: Formules tarifaires

**Goal:** 3 cartes tarifaires avec mise en avant Premium, shimmer, stagger d'entrée.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `#formules`
- Modify: `wedoria-site-vitrine/style.css` — styles formules
- Modify: `wedoria-site-vitrine/script.js` — stagger + shimmer IntersectionObserver

**Acceptance Criteria:**
- [ ] 3 cartes : Essentielle, Premium, Sur-mesure
- [ ] Premium : border or, scale(1.02), badge "Le plus populaire"
- [ ] Shimmer sur Premium déclenché une fois à l'entrée viewport
- [ ] Features avec ✓ or
- [ ] Stagger d'entrée au scroll
- [ ] Mobile : 1 colonne, Premium en premier

**Verify:** Scroll vers les formules → 3 cartes apparaissent en stagger, shimmer sur Premium.

**Steps:**

- [ ] **Step 1 : HTML formules**

```html
<!-- ══ FORMULES ════════════════════════════════════ -->
<section id="formules" class="formules">
  <div class="section-container">
    <h2 class="section-title">Les formules</h2>
    <p class="formules-sub">Choisissez la formule qui correspond à votre projet, sans engagement.</p>

    <div class="pricing-grid">

      <!-- Premium en premier (mobile) -->
      <div class="pricing-card pricing-premium" data-order="2">
        <div class="pricing-badge">Le plus populaire</div>
        <div class="pricing-name">Premium</div>
        <div class="pricing-price">490€</div>
        <div class="pricing-desc">Le site complet pour une expérience inoubliable.</div>
        <ul class="pricing-features">
          <li>Tout l'Essentielle inclus</li>
          <li>Galerie photos</li>
          <li>Compte à rebours</li>
          <li>Multilingue (FR + 1 langue)</li>
          <li>Photo couple pleine page</li>
          <li>Notre histoire (timeline)</li>
          <li>Code vestimentaire &amp; FAQ</li>
          <li>Livraison en 3 jours ouvrés</li>
        </ul>
        <a href="#contact" class="btn-primary js-magnetic">Démarrer →</a>
      </div>

      <div class="pricing-card pricing-essentielle" data-order="1">
        <div class="pricing-name">Essentielle</div>
        <div class="pricing-price">290€</div>
        <div class="pricing-desc">L'essentiel pour informer vos invités avec élégance.</div>
        <ul class="pricing-features">
          <li>Site 1 page personnalisé</li>
          <li>Hero · Programme · RSVP · Carte</li>
          <li>1 langue</li>
          <li>Hébergement 12 mois inclus</li>
          <li>Livraison en 5 jours ouvrés</li>
          <li>Support email</li>
        </ul>
        <a href="#contact" class="btn-outline">Démarrer →</a>
      </div>

      <div class="pricing-card pricing-surdemesure" data-order="3">
        <div class="pricing-name">Sur-mesure</div>
        <div class="pricing-price">Sur devis</div>
        <div class="pricing-desc">Un site entièrement conçu autour de votre vision unique.</div>
        <ul class="pricing-features">
          <li>Tout le Premium inclus</li>
          <li>Design entièrement personnalisé</li>
          <li>Sections sur-mesure</li>
          <li>Vidéo héro personnalisée</li>
          <li>Animations additionnelles</li>
          <li>Intégrations spéciales</li>
          <li>Accompagnement dédié</li>
        </ul>
        <a href="#contact" class="btn-outline">Nous contacter →</a>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2 : CSS formules**

```css
/* ── FORMULES ── */
.formules {
  background: var(--ivory);
  padding: var(--section-pad) clamp(1.5rem, 5vw, 3rem);
}

.formules-sub {
  font-size: 0.95rem;
  color: #777;
  margin-top: 0.5rem;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  font-weight: 300;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* Sur mobile, Premium en premier via order */
.pricing-premium  { order: -1; }
.pricing-essentielle { order: 0; }
.pricing-surdemesure { order: 1; }

.pricing-card {
  position: relative;
  background: var(--cream);
  border: 1px solid var(--warm);
  padding: 2.5rem 2rem;
  opacity: 0;
  transform: translateY(24px);
  overflow: hidden;
}

.pricing-premium {
  border-color: var(--gold);
  transform: translateY(24px) scale(1);
  background: var(--paper);
}

.pricing-badge {
  display: inline-block;
  background: var(--gold);
  color: var(--ink);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 4px 12px;
  margin-bottom: 1.5rem;
}

.pricing-name {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: var(--ink);
  margin-bottom: 0.5rem;
}

.pricing-price {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 300;
  color: var(--gold);
  margin-bottom: 0.75rem;
}

.pricing-desc {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-weight: 300;
}

.pricing-features {
  margin-bottom: 2rem;
}
.pricing-features li {
  font-size: 0.875rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--warm);
  font-weight: 300;
  padding-left: 1.2rem;
  position: relative;
}
.pricing-features li::before {
  content: '✓';
  position: absolute; left: 0;
  color: var(--gold);
  font-size: 0.75rem;
}

.btn-outline {
  display: inline-block;
  padding: 0.8rem 1.8rem;
  border: 1px solid var(--ink);
  color: var(--ink);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  transition: background 0.3s, color 0.3s;
}
.btn-outline:hover { background: var(--ink); color: var(--paper); }
.btn-outline:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* Shimmer sur Premium */
.pricing-premium::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent);
  transform: skewX(-15deg);
  transition: none;
}
.pricing-premium.shimmer::after {
  animation: shimmerMove 0.8s ease forwards;
}
@keyframes shimmerMove {
  0%   { left: -100%; }
  100% { left: 150%; }
}

@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(3, 1fr);
    align-items: start;
  }
  .pricing-premium  { order: 2; transform: translateY(24px) scale(1.02); }
  .pricing-essentielle { order: 1; }
  .pricing-surdemesure { order: 3; }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3 : JS formules**

```js
// ── FORMULES ──
function initFormules() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = gsap.utils.toArray('.pricing-card');

  if (!prefersReduced) {
    cards.forEach((card, i) => {
      const isDesktop = window.innerWidth >= 768;
      const targetScale = (card.classList.contains('pricing-premium') && isDesktop) ? 1.02 : 1;

      gsap.to(card, {
        opacity: 1, y: 0, scale: targetScale, duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.12
      });
    });
  }

  // Shimmer sur Premium
  const premium = document.querySelector('.pricing-premium');
  if (premium) {
    const shimmerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => premium.classList.add('shimmer'), 600);
          shimmerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    shimmerObserver.observe(premium);
  }
}

document.addEventListener('DOMContentLoaded', initFormules);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["3 cartes visibles", "Premium mis en avant", "shimmer déclenché une fois", "stagger d'entrée fonctionnel"], "requiresUserVerification": false}
```

---

## Task 8: Témoignages

**Goal:** 3 citations éditorialisées avec grand guillemet décoratif, stagger d'entrée.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — section `.temoignages`
- Modify: `wedoria-site-vitrine/style.css` — styles témoignages
- Modify: `wedoria-site-vitrine/script.js` — stagger ScrollTrigger

**Acceptance Criteria:**
- [ ] 3 citations en Cormorant italic
- [ ] Guillemets décoratifs en or pâle (CSS content)
- [ ] Desktop : 3 colonnes. Mobile : empilées.
- [ ] Stagger d'entrée au scroll

**Verify:** Scroll vers la section → 3 témoignages apparaissent en cascade.

**Steps:**

- [ ] **Step 1 : HTML témoignages** (après section formules)

```html
<!-- ══ TÉMOIGNAGES ════════════════════════════════ -->
<section class="temoignages">
  <div class="section-container">
    <div class="temoignages-grid">

      <blockquote class="temoignage">
        <p class="temoignage-text">Notre site a ébloui tous nos invités avant même la cérémonie. C'est devenu un souvenir en lui-même.</p>
        <cite class="temoignage-auteur">Élise &amp; Romain</cite>
      </blockquote>

      <blockquote class="temoignage">
        <p class="temoignage-text">Livré en 3 jours, exactement comme promis. Un vrai coup de cœur, on ne s'attendait pas à quelque chose d'aussi beau.</p>
        <cite class="temoignage-auteur">Sophie &amp; Thomas</cite>
      </blockquote>

      <blockquote class="temoignage">
        <p class="temoignage-text">Clé-en-main vraiment. On a rempli le formulaire un lundi, le site était en ligne le jeudi. Magique.</p>
        <cite class="temoignage-auteur">Camille &amp; Antoine</cite>
      </blockquote>

    </div>
  </div>
</section>
```

- [ ] **Step 2 : CSS témoignages**

```css
/* ── TÉMOIGNAGES ── */
.temoignages {
  background: var(--cream);
  padding: var(--section-pad) clamp(1.5rem, 5vw, 3rem);
}

.temoignages-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.temoignage {
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  padding-top: 3rem;
}

.temoignage::before {
  content: '\201C';
  position: absolute; top: 0; left: -0.2rem;
  font-family: var(--font-display);
  font-size: 6rem;
  line-height: 1;
  color: var(--warm);
  pointer-events: none;
}

.temoignage-text {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  line-height: 1.6;
  color: var(--ink);
  margin-bottom: 1.25rem;
}

.temoignage-auteur {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  font-style: normal;
  font-weight: 400;
}

@media (min-width: 768px) {
  .temoignages-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .temoignage { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3 : JS témoignages**

```js
// ── TÉMOIGNAGES ──
function initTemoignages() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.utils.toArray('.temoignage').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      delay: i * 0.15
    });
  });
}

document.addEventListener('DOMContentLoaded', initTemoignages);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["3 citations visibles", "guillemets décoratifs", "stagger fonctionnel"], "requiresUserVerification": false}
```

---

## Task 9: Formulaire de contact + Footer

**Goal:** Formulaire sobre sur fond sombre avec feedback JS, puis footer minimal.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — sections `#contact` et `<footer>`
- Modify: `wedoria-site-vitrine/style.css` — styles contact + footer
- Modify: `wedoria-site-vitrine/script.js` — validation et feedback formulaire

**Acceptance Criteria:**
- [ ] Section fond `#1C1C1C`, titre Cormorant italic blanc
- [ ] Champs : Prénoms mariés, Date, Email, Formule (select), Message
- [ ] Labels flottants CSS (float up au focus/rempli)
- [ ] Submit → preventDefault → confirmation visuelle inline (pas d'alert)
- [ ] Footer : logo + liens + email + copyright
- [ ] Focus visible sur tous les champs

**Verify:** Remplir le formulaire et soumettre → message de confirmation visible, pas de rechargement.

**Steps:**

- [ ] **Step 1 : HTML contact + footer**

```html
<!-- ══ CONTACT ════════════════════════════════════ -->
<section id="contact" class="contact">
  <div class="contact-inner section-container">
    <div class="contact-header">
      <h2 class="contact-title">Prêts à commencer ?</h2>
      <p class="contact-sub">Réponse sous 24h · Sans engagement</p>
    </div>

    <form class="contact-form" id="contact-form" action="#" novalidate>
      <div class="form-row">
        <div class="form-group">
          <input type="text" id="field-mariee" name="mariee" required autocomplete="given-name" />
          <label for="field-mariee">Prénom de la mariée</label>
        </div>
        <div class="form-group">
          <input type="text" id="field-marie" name="marie" required autocomplete="given-name" />
          <label for="field-marie">Prénom du marié</label>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <input type="date" id="field-date" name="date" required />
          <label for="field-date" class="label-active">Date du mariage</label>
        </div>
        <div class="form-group">
          <input type="email" id="field-email" name="email" required autocomplete="email" />
          <label for="field-email">Email</label>
        </div>
      </div>

      <div class="form-group">
        <select id="field-formule" name="formule" required>
          <option value="" disabled selected></option>
          <option value="essentielle">Essentielle — 290€</option>
          <option value="premium">Premium — 490€</option>
          <option value="sur-mesure">Sur-mesure — sur devis</option>
          <option value="indecis">Je ne sais pas encore</option>
        </select>
        <label for="field-formule" class="label-active">Formule souhaitée</label>
      </div>

      <div class="form-group">
        <textarea id="field-message" name="message" rows="4"></textarea>
        <label for="field-message">Votre message (optionnel)</label>
      </div>

      <button type="submit" class="btn-submit">Envoyer notre projet</button>

      <div class="form-success" id="form-success" aria-live="polite" hidden>
        <p>Merci ! Nous avons bien reçu votre projet et reviendrons vers vous sous 24h.</p>
      </div>
    </form>
  </div>
</section>

<!-- ══ FOOTER ═════════════════════════════════════ -->
<footer class="footer">
  <div class="footer-inner section-container">
    <div class="footer-col footer-brand">
      <a href="#accueil" class="footer-logo">Wedoria</a>
      <p class="footer-tagline">Fait avec soin,<br>pour chaque histoire.</p>
    </div>
    <div class="footer-col">
      <ul>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#formules">Formules</a></li>
        <li><a href="#processus">Comment ça marche</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <a href="mailto:contact@wedoria.fr" class="footer-email">contact@wedoria.fr</a>
    </div>
  </div>
  <div class="footer-copy">
    <p>© 2026 Wedoria · Fait avec soin, pour chaque histoire.</p>
  </div>
</footer>
```

- [ ] **Step 2 : CSS contact + footer**

```css
/* ── CONTACT ── */
.contact {
  background: var(--ink);
  padding: var(--section-pad) clamp(1.5rem, 5vw, 3rem);
}

.contact-header { margin-bottom: 3rem; }

.contact-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--paper);
  margin-bottom: 0.5rem;
}

.contact-sub {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 400;
}

/* Form */
.contact-form { max-width: 800px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .form-row { grid-template-columns: 1fr 1fr; }
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}
.form-row .form-group { margin-bottom: 0; }

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(237, 229, 216, 0.3);
  color: var(--paper);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 300;
  padding: 1.2rem 0 0.4rem;
  outline: none;
  transition: border-color 0.3s;
  -webkit-appearance: none;
}
.form-group select { cursor: pointer; }
.form-group textarea { resize: none; }

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom-color: var(--gold);
}
.form-group input:focus-visible,
.form-group select:focus-visible,
.form-group textarea:focus-visible {
  outline: none; /* géré par border-bottom */
}

.form-group label {
  position: absolute; left: 0; top: 1.2rem;
  font-size: 0.85rem;
  color: rgba(248, 244, 238, 0.5);
  pointer-events: none;
  transition: top 0.2s, font-size 0.2s, color 0.2s;
}
.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:not(:placeholder-shown) ~ label,
.form-group select:focus ~ label,
.label-active {
  top: 0; font-size: 0.7rem; color: var(--gold);
}

/* Trick pour forcer le label flottant sur l'input date */
.form-group input[type="date"] ~ label { top: 0; font-size: 0.7rem; color: var(--gold); }

/* Couleur options select (dark mode) */
.form-group select option { background: var(--ink); color: var(--paper); }

.btn-submit {
  margin-top: 1rem;
  padding: 1rem 2.5rem;
  background: var(--gold);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.btn-submit:hover { background: var(--paper); }
.btn-submit:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

.form-success {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-left: 2px solid var(--gold);
  color: var(--gold);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.6;
}

/* ── FOOTER ── */
.footer {
  background: var(--ink);
  border-top: 1px solid rgba(237,229,216,0.1);
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 3rem) 2rem;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
}

.footer-logo {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 1.6rem;
  color: var(--paper);
  display: block;
  margin-bottom: 0.75rem;
}

.footer-tagline {
  font-size: 0.85rem;
  color: rgba(248,244,238,0.5);
  line-height: 1.7;
  font-weight: 300;
}

.footer-col ul { display: flex; flex-direction: column; gap: 0.75rem; }
.footer-col a {
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: rgba(248,244,238,0.6);
  text-transform: uppercase;
  transition: color 0.2s;
}
.footer-col a:hover { color: var(--gold); }
.footer-col a:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

.footer-email {
  font-size: 0.9rem;
  color: var(--gold);
  border-bottom: 1px solid rgba(201,169,110,0.3);
  padding-bottom: 2px;
}

.footer-copy {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(248,244,238,0.3);
  font-weight: 300;
}

@media (min-width: 768px) {
  .footer-inner {
    grid-template-columns: 2fr 1fr 1fr;
    text-align: left;
    align-items: start;
  }
}
```

- [ ] **Step 3 : JS formulaire**

```js
// ── FORMULAIRE CONTACT ──
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validation simple
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderBottomColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderBottomColor = '';
      }
    });

    if (!valid) return;

    // Feedback visuel
    form.style.opacity = '0.4';
    form.style.pointerEvents = 'none';
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
```

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["formulaire visible", "labels flottants fonctionnels", "submit affiche confirmation inline", "footer complet"], "requiresUserVerification": false}
```

---

## Task 10: Accessibilité, responsive final, polish

**Goal:** Vérifications finales — reduced motion, focus, polissage mobile, meta SEO.

**Files:**
- Modify: `wedoria-site-vitrine/index.html` — meta OG, lang
- Modify: `wedoria-site-vitrine/style.css` — ajustements responsive finaux
- Modify: `wedoria-site-vitrine/script.js` — refresh ScrollTrigger au resize

**Acceptance Criteria:**
- [ ] `prefers-reduced-motion` : page entièrement lisible statiquement (pas d'animation)
- [ ] Tab navigation correcte sur tous les éléments interactifs
- [ ] Focus ring visible (gold) sur tous les boutons/liens
- [ ] Meta OG (og:title, og:description, og:image placeholder) dans le `<head>`
- [ ] ScrollTrigger.refresh() au resize pour le scroll horizontal portfolio
- [ ] Pas d'overflow horizontal sur mobile
- [ ] Tous les éléments décoratifs ont `aria-hidden="true"`

**Verify:** Naviguer au clavier → focus visible sur chaque élément. Simuler mobile (320px) → pas de scroll horizontal parasite.

**Steps:**

- [ ] **Step 1 : Meta OG dans index.html `<head>`**

```html
<!-- Open Graph -->
<meta property="og:title"       content="Wedoria · Sites de mariage sur-mesure" />
<meta property="og:description" content="Sites de mariage clé-en-main, livrés en 5 jours. À partir de 290€." />
<meta property="og:type"        content="website" />
<meta property="og:locale"      content="fr_FR" />
<meta name="theme-color"        content="#FAFAF7" />
```

- [ ] **Step 2 : CSS anti-overflow mobile + focus ring global**

```css
/* ── ANTI-OVERFLOW MOBILE ── */
body { overflow-x: hidden; }

/* Sur mobile, désactiver le track overflow du portfolio */
@media (max-width: 767px) {
  .portfolio-track-wrap { overflow: visible; }
}

/* ── FOCUS RING GLOBAL ── */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
/* Supprimer outline sur click souris (browsers récents gèrent ça nativement) */
:focus:not(:focus-visible) { outline: none; }
```

- [ ] **Step 3 : JS ScrollTrigger refresh au resize**

```js
// ── RESPONSIVE : refresh ScrollTrigger au resize ──
function initResizeRefresh() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initResizeRefresh);
```

- [ ] **Step 4 : Vérification finale**

  - Ouvrir DevTools → Responsive → 320px : pas de scroll horizontal
  - Tab depuis le début : loader disparu → navbar logo → nav links → CTA hero → ...
  - Activer "Emulate prefers-reduced-motion" → tous les éléments visibles, pas d'animation
  - Console : aucune erreur

```json:metadata
{"files": ["wedoria-site-vitrine/index.html", "wedoria-site-vitrine/style.css", "wedoria-site-vitrine/script.js"], "verifyCommand": "open wedoria-site-vitrine/index.html", "acceptanceCriteria": ["reduced-motion lisible statiquement", "focus visible sur tous les éléments", "pas d'overflow horizontal mobile", "meta OG présentes"], "requiresUserVerification": false}
```
