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
  setText('rsvp-deco-deadline', M.rsvp_deadline ? `Répondre avant le ${M.rsvp_deadline}` : '');

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

  // Vidéo hero
  if (M.video_hero && M.video_hero.type === 'mp4' && M.video_hero.src) {
    const hv = document.getElementById('hero-video');
    if (hv) { hv.src = M.video_hero.src; hv.style.display = 'block'; }
  }

  // Photos ambiance — slot 1 déjà utilisé pour le domaine ; slots 2 et 3 en section pleine largeur
  const ambianceSection = document.getElementById('photos-ambiance');
  const ambiancePhotos  = M.photos_ambiance || [];
  const hasAmbiance     = ambiancePhotos.some(p => p && p.src);
  if (hasAmbiance && ambianceSection) {
    ambianceSection.style.display = '';
    ambiancePhotos.forEach((p, i) => {
      const img = document.getElementById('ambiance-' + i);
      if (img && p && p.src) {
        img.src = p.src;
        img.alt = 'Ambiance ' + (i + 1);
        if (p.position) img.style.objectPosition = p.position;
      } else if (img) {
        img.closest('.ambiance-img-wrap').style.display = 'none';
      }
    });
  }

  // Dress code
  const dressSection = document.querySelector('.section-dresscode');
  if (M.dress_titre && dressSection) {
    dressSection.style.display = '';
    setText('dress-eyebrow', M.dress_eyebrow || '');
    setText('dress-titre',   M.dress_titre   || '');
    setText('dress-intro',   M.dress_intro   || '');
    const swatchesWrap = document.getElementById('dress-swatches');
    if (swatchesWrap && M.palette && M.palette.length) {
      swatchesWrap.innerHTML = M.palette.map(c => `
        <div class="dress-swatch ${c.eviter ? 'swatch--eviter' : ''}">
          <div class="swatch-circle" style="background:${c.hex}"></div>
          <p class="swatch-nom">${c.nom}${c.eviter ? ' ✗' : ''}</p>
        </div>`).join('');
    }
  }

  // Souhaits
  const souhaitsSection = document.querySelector('.section-souhaits');
  const souhaitsWrap    = document.getElementById('souhaits-wrap');
  if (M.souhaits && M.souhaits.length > 0 && souhaitsWrap) {
    if (souhaitsSection) souhaitsSection.style.display = '';
    souhaitsWrap.innerHTML = M.souhaits.map(s => `
      <div class="souhait-card">
        <span class="souhait-emoji">${s.emoji || ''}</span>
        <h3>${s.titre}</h3>
        <p>${s.description}</p>
        ${s.lien ? `<a class="souhait-lien" href="${s.lien}" target="_blank">Voir →</a>` : ''}
      </div>`).join('');
  }

  // Chanson
  const chansonSection = document.querySelector('.section-chanson');
  if (M.chanson && M.chanson.titre && chansonSection) {
    chansonSection.style.display = '';
    setText('chanson-titre',   M.chanson.titre);
    setText('chanson-artiste', M.chanson.artiste || '');
    setText('chanson-desc',    M.chanson.description || '');
    const lienEl = document.getElementById('chanson-lien');
    if (lienEl && M.chanson.spotify_url) { lienEl.href = M.chanson.spotify_url; lienEl.style.display = ''; }
  }

  // Livre d'or
  const livreOrSection = document.querySelector('.section-livreor');
  if (M.livre_or && M.livre_or.actif && livreOrSection) {
    livreOrSection.style.display = '';
    setText('livreor-titre', M.livre_or.titre || 'Livre d\'Or');
    setText('livreor-intro', M.livre_or.intro || '');
  }

  // Mot des mariés
  const motSection = document.querySelector('.section-mot');
  if (M.mot_des_maries && motSection) {
    motSection.style.display = '';
    setText('mot-texte',     M.mot_des_maries);
    setText('mot-signature', `${M.prenom1} & ${M.prenom2}`);
  }

  // Hashtag footer
  if (M.hashtag) {
    const hashEl = document.getElementById('footer-hashtag');
    if (hashEl) { hashEl.textContent = M.hashtag; hashEl.style.display = ''; }
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

/* ── LIVRE D'OR ── */
function renderCarrousel(messages) {
  const wrap  = document.getElementById('livreor-carrousel-wrap');
  const track = document.getElementById('livreor-track');
  if (!wrap || !track) return;
  const html = messages.map(m =>
    `<div class="livreor-card">
      <p class="livreor-message">"${m.message}"</p>
      <p class="livreor-prenom">— ${m.prenom}</p>
    </div>`
  ).join('');
  track.innerHTML = html + html;
  wrap.style.display = '';
}

async function initLivreOr() {
  const section = document.querySelector('.section-livreor');
  if (!section || section.style.display === 'none') return;

  const templateId = (MARIAGE.prenom1 + '-' + MARIAGE.prenom2 + '-champetre')
    .toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '');

  try {
    const { data } = await db.from('livre_or').select('*').eq('template_id', templateId).order('created_at');
    if (data && data.length > 0) renderCarrousel(data);
  } catch(e) { /* Supabase absent */ }

  const form = document.getElementById('livreor-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn    = document.getElementById('lo-btn');
    const status = document.getElementById('lo-status');
    const prenom  = document.getElementById('lo-prenom').value.trim();
    const message = document.getElementById('lo-message').value.trim();
    if (!prenom || !message) { if (status) status.textContent = 'Merci de remplir les deux champs.'; return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
    try {
      const { error } = await db.from('livre_or').insert([{ template_id: templateId, prenom, message }]);
      if (error) throw error;
      if (status) status.textContent = '🌿 Merci ! Votre mot a bien été enregistré.';
      form.reset();
    } catch {
      if (status) status.textContent = 'Une erreur est survenue. Réessayez plus tard.';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Laisser un mot 🌿'; }
    }
  });
}

/* ── INIT ── */
hydrate();
runLoader();
initNav();
// initLeaves(); // animation feuilles désactivée
initReveal();
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initRsvp();
  initLivreOr();
});

/* ── HERO ENTRANCE (GSAP) ── */
function initHeroEntrance() {
  if (typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ delay: 0.3 });
  tl.fromTo('.hero-invite',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  )
  .fromTo('.hero-names',
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.hero-divider',
    { opacity: 0, scaleX: 0.4 },
    { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.out', transformOrigin: 'left center' },
    '-=0.5'
  )
  .fromTo('.hero-date',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    '-=0.4'
  )
  .fromTo('.btn-hero',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )
  .fromTo('.hero-couple-img',
    { scale: 1.06, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' },
    0
  );
}
