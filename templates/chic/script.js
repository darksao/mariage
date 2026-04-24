/* ═══════════════════════════════════════
   CHIC · script.js
   Config-driven · GSAP + Countdown + Supabase
═══════════════════════════════════════ */
'use strict';

let db = null;
try { db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
catch (e) { console.warn('Supabase init failed:', e); }

const ROMANS = ['I','II','III','IV','V','VI','VII','VIII'];

function setText(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

function hydrate() {
  const M = MARIAGE;
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;

  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', M.date_affichage.toUpperCase());
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));

  // Hero — noms wrappés lettre par lettre pour animation GSAP
  const namesEl = document.getElementById('hero-names-overlay');
  if (namesEl) {
    namesEl.innerHTML =
      M.prenom1.split('').map(c => `<span class="hero-char">${c === ' ' ? '&nbsp;' : c}</span>`).join('') +
      `<span class="hero-amp"> &amp; </span>` +
      M.prenom2.split('').map(c => `<span class="hero-char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  }
  setText('hero-date-overlay', M.date_affichage.toUpperCase());
  setText('hero-cta-overlay', M.hero_cta || 'RSVP');

  // Programme timeline avec numéros romains
  setText('programme-eyebrow', M.programme_eyebrow || '');
  setText('programme-titre', M.programme_titre || 'Programme');
  const progWrap = document.getElementById('prog-wrap');
  if (progWrap) {
    progWrap.innerHTML = (M.programme || []).map((p, i) => `
      <div class="timeline-item" data-roman="${ROMANS[i] || (i + 1)}">
        <p class="timeline-heure">${p.heure}</p>
        <h3>${p.titre}</h3>
        <p>${p.lieu}</p>
      </div>`).join('');
  }

  // Galerie masonry
  const galerieWrap = document.getElementById('galerie-wrap');
  const galerieSection = document.getElementById('galerie');
  if (galerieWrap) {
    const photos = M.photos || [];
    if (photos.length) {
      galerieWrap.innerHTML = photos.map(p => {
        if (p.src) {
          return `<div class="masonry-item"><img src="${p.src}" alt="${p.alt || ''}" loading="lazy" /></div>`;
        }
        return `<div class="masonry-item"><div class="masonry-placeholder">◆</div></div>`;
      }).join('');
    } else if (galerieSection) {
      galerieSection.style.display = 'none';
    }
  }

  // Dress code
  const dcSection = document.getElementById('dresscode');
  if (M.dresscode && M.dresscode.texte) {
    setText('dresscode-texte', M.dresscode.texte);
    const swatchesEl = document.getElementById('dresscode-swatches');
    if (swatchesEl && M.dresscode.couleurs && M.dresscode.couleurs.length) {
      swatchesEl.innerHTML = M.dresscode.couleurs.map(hex => `
        <div class="swatch">
          <div class="swatch-circle" style="background:${hex}"></div>
        </div>`).join('');
    }
  } else if (dcSection) {
    dcSection.style.display = 'none';
  }

  // RSVP
  setText('rsvp-titre', M.rsvp_titre || 'R.S.V.P.');
  setText('rsvp-intro', M.rsvp_intro || '');

  // Infos
  setText('infos-eyebrow', M.infos_eyebrow || '');
  setText('infos-titre', M.infos_titre || 'Informations');
  const infosWrap = document.getElementById('infos-wrap');
  if (infosWrap) {
    infosWrap.innerHTML = (M.infos || [])
      .filter(i => i.titre && i.titre.trim())
      .map(i => `
        <div class="info-item">
          <div class="info-icon">${i.icon}</div>
          <div><h3>${i.titre}</h3><p>${i.texte}</p></div>
        </div>`).join('');
  }

  setText('footer-names', `${M.prenom1} &amp; ${M.prenom2}`);
  setText('footer-citation', M.citation || '');
}

/* ── LOADER ── */
function runLoader() {
  const progress = document.getElementById('loader-progress');
  const loader = document.getElementById('loader');
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.random() * 20, 95);
    if (progress) progress.style.width = pct + '%';
  }, 100);
  window.addEventListener('load', () => {
    clearInterval(iv);
    if (progress) progress.style.width = '100%';
    setTimeout(() => {
      if (loader) { loader.style.opacity = '0'; loader.style.transition = 'opacity 0.5s'; }
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
        document.body.classList.remove('is-loading');
        initGsapHero();
      }, 500);
    }, 300);
  });
}

/* ── GSAP HERO ── */
function heroFallback() {
  // Appelé si GSAP est absent ou bloqué : force la visibilité des éléments hero.
  document.querySelectorAll('.hero-char, .hero-amp, .hero-rule, .hero-date, .btn-hero')
    .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

function initGsapHero() {
  if (!window.gsap) {
    // GSAP absent : les éléments n'ont pas été cachés, rien à faire.
    return;
  }

  // Fallback de sécurité : si GSAP est présent mais la timeline ne finit pas
  // (script bloqué, erreur interne), on force la visibilité après 3s.
  const fallbackTimer = setTimeout(heroFallback, 3000);

  // Set initial state
  gsap.set('.hero-char', { opacity: 0, y: 30 });
  gsap.set('.hero-amp', { opacity: 0 });
  gsap.set('.hero-rule', { scaleX: 0, opacity: 0 });
  gsap.set('.hero-date', { opacity: 0, y: 10 });
  gsap.set('.btn-hero', { opacity: 0, y: 10 });
  // Animate — on annule le fallback dès que la timeline est terminée
  gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => clearTimeout(fallbackTimer) })
    .to('.hero-char', { opacity: 1, y: 0, stagger: 0.04, duration: 0.8 })
    .to('.hero-amp', { opacity: 1, duration: 0.4 }, '-=0.3')
    .to('.hero-rule', { scaleX: 1, opacity: 1, duration: 0.5, transformOrigin: 'left' }, '-=0.2')
    .to('.hero-date', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
    .to('.btn-hero', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
}

/* ── COUNTDOWN ── */
function initCountdown() {
  // On force l'offset Paris (+02:00 été / +01:00 hiver) pour éviter que
  // les navigateurs interprètent une date sans timezone en UTC (décalage ±1-2h).
  // Les mariés et invités sont en France → on cible toujours l'heure locale Paris.
  const isoWithTz = /[+-]\d{2}:\d{2}$|Z$/.test(MARIAGE.date_iso)
    ? MARIAGE.date_iso
    : MARIAGE.date_iso + '+02:00';
  const target = new Date(isoWithTz);
  const pad = n => String(Math.floor(n)).padStart(2, '0');
  function update() {
    const diff = target - new Date();
    if (diff <= 0) {
      ['cd-jours','cd-heures','cd-minutes','cd-secondes'].forEach(id => setText(id, '00'));
      return;
    }
    setText('cd-jours',    pad(diff / 86400000));
    setText('cd-heures',   pad((diff % 86400000) / 3600000));
    setText('cd-minutes',  pad((diff % 3600000) / 60000));
    setText('cd-secondes', pad((diff % 60000) / 1000));
  }
  update();
  setInterval(update, 1000);
}

/* ── NAV ── */
function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
}

/* ── REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
}

/* ── RSVP ── */
function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('rsvp-status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-btn');
    if (btn) { btn.disabled = true; btn.textContent = '…'; }
    const data = {
      prenom: form.prenom.value.trim(),
      nom: form.nom.value.trim(),
      presence: form.presence.value,
      regime: form.regime.value,
      message: form.message.value.trim(),
    };
    if (!data.prenom || !data.nom || !data.presence) {
      if (status) status.textContent = 'Veuillez remplir tous les champs requis.';
      if (btn) { btn.disabled = false; btn.textContent = 'Confirmer'; }
      return;
    }
    if (db) {
      const { error } = await db.from('rsvp').insert([data]);
      if (error) {
        if (status) status.textContent = 'Erreur. Merci de nous contacter par email.';
        if (btn) { btn.disabled = false; btn.textContent = 'Confirmer'; }
        return;
      }
    }
    form.style.display = 'none';
    if (status) status.textContent = 'Merci. Votre réponse a été enregistrée.';
  });
}

/* ── INIT ── */
hydrate();
runLoader();
initNav();
initCountdown();
initReveal();
document.addEventListener('DOMContentLoaded', initRsvp);
