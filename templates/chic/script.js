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

  // Histoire
  setText('histoire-eyebrow', M.histoire_eyebrow || '');
  setText('histoire-titre',   M.histoire_titre || 'Notre Histoire');
  const histWrap = document.getElementById('histoire-wrap');
  if (histWrap) {
    histWrap.innerHTML = (M.histoire || [])
      .filter(h => h.texte && h.texte.trim())
      .map(h => `
        <div class="histoire-item reveal-section">
          <div class="histoire-meta">
            <span class="histoire-annee">${h.annee || ''}</span>
            <h3>${h.titre}</h3>
          </div>
          <p>${h.texte}</p>
        </div>`).join('');
  }

  // Vidéo hero
  if (M.video_hero && M.video_hero.type === 'mp4' && M.video_hero.src) {
    const hv = document.getElementById('hero-video');
    const hb = document.getElementById('hero-bg-img');
    if (hv) { hv.src = M.video_hero.src; hv.style.display = 'block'; }
    if (hb) hb.style.display = 'none';
  }

  // Photos ambiance
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

  // Souhaits
  const souhaitsSection = document.getElementById('souhaits');
  const souhaitsWrap    = document.getElementById('souhaits-wrap');
  if (M.souhaits && M.souhaits.length > 0 && souhaitsWrap) {
    if (souhaitsSection) souhaitsSection.style.display = '';
    souhaitsWrap.innerHTML = M.souhaits.map(s => `
      <div class="souhait-card reveal-section">
        <span class="souhait-emoji">${s.emoji || ''}</span>
        <h3>${s.titre}</h3>
        <p>${s.description}</p>
        ${s.lien ? `<a class="souhait-lien" href="${s.lien}" target="_blank">Voir →</a>` : ''}
      </div>`).join('');
  }

  // Activités
  const activitesSection = document.getElementById('activites');
  const activitesWrap    = document.getElementById('activites-wrap');
  if (M.activites && M.activites.length > 0 && activitesWrap) {
    if (activitesSection) activitesSection.style.display = '';
    activitesWrap.innerHTML = M.activites.map(a => `
      <div class="activite-card reveal-section">
        <div class="activite-emoji">${a.emoji || ''}</div>
        <h3>${a.titre}</h3>
        <p>${a.description}</p>
      </div>`).join('');
  }

  // Chanson
  const chansonSection = document.getElementById('chanson');
  if (M.chanson && M.chanson.titre) {
    if (chansonSection) chansonSection.style.display = '';
    setText('chanson-titre',   M.chanson.titre);
    setText('chanson-artiste', M.chanson.artiste || '');
    setText('chanson-desc',    M.chanson.description || '');
    const lienEl = document.getElementById('chanson-lien');
    if (lienEl && M.chanson.spotify_url) { lienEl.href = M.chanson.spotify_url; lienEl.style.display = ''; }
  }

  // Livre d'or
  const livreOrSection = document.getElementById('livre-or');
  if (M.livre_or && M.livre_or.actif) {
    if (livreOrSection) livreOrSection.style.display = '';
    setText('livreor-titre', M.livre_or.titre || 'Livre d\'Or');
    setText('livreor-intro', M.livre_or.intro || '');
  }

  // Mot des mariés
  if (M.mot_des_maries) {
    const motSection = document.getElementById('mot');
    if (motSection) motSection.style.display = '';
    setText('mot-texte',     M.mot_des_maries);
    setText('mot-signature', `${M.prenom1} & ${M.prenom2}`);
  }

  // Hashtag footer
  if (M.hashtag) {
    const hashEl = document.getElementById('footer-hashtag');
    if (hashEl) { hashEl.textContent = M.hashtag; hashEl.style.display = ''; }
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
      const cdSection = document.getElementById('countdown');
      if (cdSection) {
        cdSection.innerHTML = '<p class="countdown-done">Merci d\'être venus célébrer avec nous ✨</p>';
      }
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

/* ── LIGHTBOX ── */
function initLightbox() {
  // Crée le DOM lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = '<button id="lightbox-close" aria-label="Fermer">&#x2715;</button><img id="lightbox-img" src="" alt="" />';
  document.body.appendChild(lb);

  const img = document.getElementById('lightbox-img');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Délégation sur le conteneur galerie pour couvrir les items injectés dynamiquement
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.masonry-item');
    if (item) {
      const photoImg = item.querySelector('img');
      if (photoImg) open(photoImg.src, photoImg.alt);
    }
  });

  document.getElementById('lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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
  const section = document.getElementById('livre-or');
  if (!section || section.style.display === 'none') return;

  const templateId = (MARIAGE.prenom1 + '-' + MARIAGE.prenom2 + '-chic')
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
    if (btn) { btn.disabled = true; btn.textContent = '…'; }
    try {
      const { error } = await db.from('livre_or').insert([{ template_id: templateId, prenom, message }]);
      if (error) throw error;
      if (status) status.textContent = 'Merci. Votre mot a été enregistré.';
      form.reset();
    } catch {
      if (status) status.textContent = 'Une erreur est survenue. Réessayez plus tard.';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Laisser un mot'; }
    }
  });
}

/* ── INIT ── */
hydrate();
runLoader();
initNav();
initCountdown();
initReveal();
initLightbox();
document.addEventListener('DOMContentLoaded', () => { initRsvp(); initLivreOr(); });
