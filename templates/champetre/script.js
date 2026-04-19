/* ═══════════════════════════════════════════
   CHAMPÊTRE · script.js
   Config-driven · IntersectionObserver + Leaflet + Canvas
═══════════════════════════════════════════ */
'use strict';

let db = null;
try { db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
catch (e) { console.warn('Supabase init failed:', e); }

/* ── UTILS ── */
function setText(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/* ── HYDRATE ── */
function hydrate() {
  const M = MARIAGE;
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;

  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', M.date_affichage.toUpperCase());
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));

  setText('hero-invite', M.hero_intro || 'Vous êtes invités au mariage de');
  setText('hero-names-overlay', `${M.prenom1} & ${M.prenom2}`);
  setText('hero-date-overlay', M.date_affichage);
  setText('hero-cta-overlay', M.hero_cta || 'Confirmer ma présence');

  if (M.photo_couple) {
    const img = document.getElementById('hero-img');
    if (img) { img.src = M.photo_couple; img.alt = `${M.prenom1} & ${M.prenom2}`; }
  }

  setText('histoire-eyebrow', M.histoire_eyebrow || '');
  setText('histoire-titre', M.histoire_titre || 'Notre Histoire');
  const histWrap = document.getElementById('histoire-wrap');
  if (histWrap) {
    histWrap.innerHTML = (M.histoire || [])
      .filter(h => h.texte && h.texte.trim())
      .map(h => `
        <div class="hist-item">
          <p class="hist-year">${h.annee}</p>
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>`).join('');
  }

  setText('programme-eyebrow', M.programme_eyebrow || '');
  setText('programme-titre', M.programme_titre || 'Le Jour J');
  const progWrap = document.getElementById('prog-wrap');
  if (progWrap) {
    progWrap.innerHTML = (M.programme || []).map(p => `
      <div class="prog-card">
        <div class="prog-icon">${p.icon || '✿'}</div>
        <div>
          <p class="prog-heure">${p.heure}</p>
          <h3>${p.titre}</h3>
          <p>${p.lieu}</p>
        </div>
      </div>`).join('');
  }

  setText('domaine-titre', M.domaine || '');
  const domainePhoto = document.getElementById('domaine-photo');
  if (domainePhoto && M.photos_ambiance && M.photos_ambiance[0] && M.photos_ambiance[0].src) {
    domainePhoto.src = M.photos_ambiance[0].src;
  } else if (domainePhoto) {
    const wrap = domainePhoto.closest('.domaine-photo-wrap');
    if (wrap) wrap.style.display = 'none';
  }

  const activitesSection = document.getElementById('activites');
  const activitesWrap = document.getElementById('activites-wrap');
  if (activitesWrap) {
    if (M.activites && M.activites.length) {
      activitesWrap.innerHTML = M.activites.map(a => `
        <div class="activite-card">
          <div class="activite-emoji">${a.emoji}</div>
          <h3>${a.titre}</h3>
          <p>${a.description}</p>
        </div>`).join('');
    } else if (activitesSection) {
      activitesSection.style.display = 'none';
    }
  }

  setText('rsvp-titre', M.rsvp_titre || 'Confirmer votre présence');
  setText('rsvp-intro', M.rsvp_intro || '');

  setText('infos-eyebrow', M.infos_eyebrow || '');
  setText('infos-titre', M.infos_titre || 'Infos Pratiques');
  const infosWrap = document.getElementById('infos-wrap');
  if (infosWrap) {
    infosWrap.innerHTML = (M.infos || [])
      .filter(i => i.titre && i.titre.trim())
      .map(i => `
        <div class="info-card">
          <div class="info-icon">${i.icon}</div>
          <h3>${i.titre}</h3>
          <p>${i.texte}</p>
        </div>`).join('');
  }

  setText('footer-citation', M.citation || '');
  setText('footer-names', `${M.prenom1} & ${M.prenom2}`);
}

/* ── LOADER ── */
function runLoader() {
  const progress = document.getElementById('loader-progress');
  const loader = document.getElementById('loader');
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 95);
    if (progress) progress.style.width = pct + '%';
  }, 120);
  window.addEventListener('load', () => {
    clearInterval(iv);
    if (progress) progress.style.width = '100%';
    setTimeout(() => {
      if (loader) { loader.style.opacity = '0'; loader.style.transition = 'opacity 0.6s'; }
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
        document.body.classList.remove('is-loading');
      }, 600);
    }, 400);
  });
}

/* ── CANVAS FEUILLES ── */
function initLeaves() {
  const canvas = document.getElementById('leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, leaves = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#8FAF8A', '#B8CFBB', '#6B8F66', '#C9B99A'];
  for (let i = 0; i < 28; i++) {
    leaves.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800) - (H || 800),
      r: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.0,
      swing: 0.4 + Math.random() * 0.8,
      swingSpeed: 0.015 + Math.random() * 0.02,
      t: Math.random() * Math.PI * 2,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.25 + Math.random() * 0.35,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const l of leaves) {
      l.y += l.speed;
      l.t += l.swingSpeed;
      l.x += Math.sin(l.t) * l.swing;
      l.r += 0.008;
      if (l.y > H + 20) { l.y = -20; l.x = Math.random() * W; }
      ctx.save();
      ctx.globalAlpha = l.opacity;
      ctx.translate(l.x, l.y);
      ctx.rotate(l.r);
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size * 0.5, l.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── NAV ── */
function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
}

/* ── INTERSECTION OBSERVER ── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
}

/* ── LEAFLET ── */
function initMap() {
  const M = MARIAGE;
  if (!M.carte || !window.L) return;
  const mapEl = document.getElementById('map');
  if (!mapEl) return;
  const map = L.map('map', { zoomControl: true, scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 18
  }).addTo(map);
  map.setView([M.carte.lat, M.carte.lng], M.carte.zoom || 14);
  L.marker([M.carte.lat, M.carte.lng]).addTo(map)
    .bindPopup(`<strong>${M.carte.nom}</strong><br>${(M.carte.adresse || []).join('<br>')}`)
    .openPopup();
}

/* ── RSVP ── */
function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('rsvp-status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
    const data = {
      prenom: form.prenom.value.trim(),
      nom: form.nom.value.trim(),
      presence: form.presence.value,
      regime: form.regime.value,
      message: form.message.value.trim(),
    };
    if (!data.prenom || !data.nom || !data.presence) {
      if (status) status.textContent = 'Merci de remplir les champs obligatoires.';
      if (btn) { btn.disabled = false; btn.textContent = MARIAGE.hero_cta || 'Confirmer'; }
      return;
    }
    if (db) {
      const { error } = await db.from('rsvp').insert([data]);
      if (error) {
        if (status) status.textContent = 'Une erreur est survenue. Contactez-nous par email.';
        if (btn) { btn.disabled = false; btn.textContent = MARIAGE.hero_cta || 'Confirmer'; }
        return;
      }
    }
    form.style.display = 'none';
    if (status) status.textContent = '🌿 Merci ! Votre réponse a bien été enregistrée.';
  });
}

/* ── INIT ── */
hydrate();
runLoader();
initNav();
initLeaves();
initReveal();
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initRsvp();
});
