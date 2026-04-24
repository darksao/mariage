/* ============================================================
   Wedoria Studio — Template Romantique
   script.js — Vanilla JS, no framework, no GSAP, no Leaflet
   ============================================================ */

// ─── 1. HYDRATE ─────────────────────────────────────────────

function hydrate() {
  function set(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.textContent = val;
  }

  // Simple fields
  set('loader-p1',       MARIAGE.prenom1);
  set('loader-p2',       MARIAGE.prenom2);
  set('loader-date',     MARIAGE.date_affichage);
  set('nav-p1',          MARIAGE.prenom1);
  set('nav-p2',          MARIAGE.prenom2);
  set('hero-invite',     MARIAGE.hero_intro);
  set('hero-names-overlay', MARIAGE.prenom1 + ' & ' + MARIAGE.prenom2);
  set('hero-date-overlay',  MARIAGE.date_affichage);

  var heroCta = document.getElementById('hero-cta-overlay');
  if (heroCta) {
    heroCta.textContent = MARIAGE.hero_cta;
    heroCta.href = '#rsvp';
  }

  if (MARIAGE.citation) {
    set('hero-citation', MARIAGE.citation);
  }

  // Section headers
  set('histoire-eyebrow', MARIAGE.histoire_eyebrow);
  set('histoire-titre',   MARIAGE.histoire_titre);
  set('programme-eyebrow', MARIAGE.programme_eyebrow);
  set('programme-titre',   MARIAGE.programme_titre);

  // RSVP
  set('rsvp-titre', MARIAGE.rsvp_titre);
  set('rsvp-intro', MARIAGE.rsvp_intro);
  if (MARIAGE.rsvp_deadline) {
    var dl = document.getElementById('rsvp-deadline-text');
    if (dl) dl.textContent = MARIAGE.rsvp_deadline;
  }

  // Footer
  set('footer-names',    MARIAGE.prenom1 + ' & ' + MARIAGE.prenom2);
  set('footer-citation', MARIAGE.citation || '');

  // ── Histoire ────────────────────────────────────────────────
  var histoireWrap = document.getElementById('histoire-wrap');
  if (histoireWrap && MARIAGE.histoire) {
    var histHtml = '';
    MARIAGE.histoire.forEach(function(item) {
      if (!item.texte) return;
      histHtml += '<div class="histoire-item reveal-section">' +
        '<div class="histoire-photo">' +
          '<img src="' + (item.photo || '') + '" alt="' + item.titre + '" ' +
            'onerror="this.parentElement.style.background=\'#F2C4CE\';this.style.display=\'none\'">' +
        '</div>' +
        '<div class="histoire-texte">' +
          '<span class="histoire-annee">' + item.annee + '</span>' +
          '<h3 class="histoire-titre">' + item.titre + '</h3>' +
          '<p>' + item.texte + '</p>' +
        '</div>' +
      '</div>';
    });
    histoireWrap.innerHTML = histHtml;
  }

  // ── Programme timeline ───────────────────────────────────────
  var progWrap = document.getElementById('prog-wrap');
  if (progWrap && MARIAGE.programme) {
    var progHtml = '';
    MARIAGE.programme.forEach(function(item) {
      progHtml += '<div class="timeline-item reveal-section">' +
        '<div class="timeline-icon">♥</div>' +
        '<div class="timeline-content">' +
          '<span class="timeline-heure">' + item.heure + '</span>' +
          '<h3 class="timeline-titre">' + item.titre + '</h3>' +
          '<p class="timeline-lieu">' + item.lieu + '</p>' +
        '</div>' +
      '</div>';
    });
    progWrap.innerHTML = progHtml;
  }

  // ── Galerie carrousel ────────────────────────────────────────
  var carouselTrack = document.getElementById('carousel-track');
  var carouselDots  = document.getElementById('carousel-dots');
  if (carouselTrack) {
    var photos = (MARIAGE.photos && MARIAGE.photos.length > 0) ? MARIAGE.photos : null;
    var slidesHtml = '';
    var dotsHtml   = '';

    if (photos) {
      photos.forEach(function(item, i) {
        slidesHtml += '<div class="carousel-slide">' +
          '<img src="' + (item.src || '') + '" alt="' + (item.alt || 'Photo de galerie') + '" ' +
            'style="width:100%;height:100%;object-fit:cover">' +
        '</div>';
        dotsHtml += '<button class="carousel-dot" data-index="' + i + '"></button>';
      });
    } else {
      slidesHtml = '<div class="carousel-slide" style="background:var(--rose)"></div>';
      dotsHtml   = '<button class="carousel-dot" data-index="0"></button>';
    }

    carouselTrack.innerHTML = slidesHtml;
    if (carouselDots) carouselDots.innerHTML = dotsHtml;
  }

  // ── Souhaits ─────────────────────────────────────────────────
  var souhaitsWrap = document.getElementById('souhaits-wrap');
  if (MARIAGE.souhaits && MARIAGE.souhaits.length > 0) {
    if (souhaitsWrap) {
      var souhaitsHtml = '';
      MARIAGE.souhaits.forEach(function(item) {
        souhaitsHtml += '<div class="souhait-card reveal-section">' +
          '<span class="souhait-emoji">' + item.emoji + '</span>' +
          '<h3 class="souhait-titre">' + item.titre + '</h3>' +
          '<p class="souhait-desc">' + item.description + '</p>' +
          (item.lien ? '<a class="souhait-lien" href="' + item.lien + '" target="_blank">Voir le cadeau →</a>' : '') +
        '</div>';
      });
      souhaitsWrap.innerHTML = souhaitsHtml;
    }
  } else {
    var souhaitsSection = document.getElementById('souhaits');
    if (souhaitsSection) souhaitsSection.style.display = 'none';
  }

  // ── Mot des mariés ───────────────────────────────────────────
  if (MARIAGE.mot_des_maries) {
    set('mot-texte',      MARIAGE.mot_des_maries);
    set('mot-signature',  MARIAGE.prenom1 + ' & ' + MARIAGE.prenom2);
  } else {
    var motSection = document.getElementById('mot');
    if (motSection) motSection.style.display = 'none';
  }
}

// ─── 2. LOADER ──────────────────────────────────────────────

function runLoader() {
  var loader   = document.getElementById('loader');
  var progress = document.getElementById('loader-progress');
  if (!loader || !progress) return;

  var pct = 0;
  progress.style.width = '0%';

  var interval = setInterval(function() {
    pct += 1.4;
    if (pct >= 100) {
      pct = 100;
      progress.style.width = '100%';
      clearInterval(interval);
      setTimeout(function() {
        loader.classList.add('loader-hidden');
        document.body.classList.remove('is-loading');
        loader.addEventListener('transitionend', function onEnd() {
          loader.style.display = 'none';
          loader.removeEventListener('transitionend', onEnd);
        }, { once: true });
      }, 200);
    } else {
      progress.style.width = pct + '%';
    }
  }, 16);
}

// ─── 3. PÉTALES CANVAS ──────────────────────────────────────

function initPetales() {
  var canvas = document.getElementById('petales-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var COLORS = ['#F2C4CE', '#E8A0B0', '#F7D6DC', '#D4849A', '#FAC0CC'];
  var COUNT  = 60;
  var petals = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomPetal(resetY) {
    return {
      x:         Math.random() * canvas.width,
      y:         resetY ? -Math.random() * canvas.height : Math.random() * canvas.height,
      r:         4 + Math.random() * 6,
      ry:        2 + Math.random() * 3,
      angle:     Math.random() * Math.PI * 2,
      speed:     0.6 + Math.random() * 1.2,
      sway:      0.4 + Math.random() * 0.8,
      swaySpeed: 0.01 + Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      color:     COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  resize();
  for (var i = 0; i < COUNT; i++) petals.push(randomPetal(false));

  window.addEventListener('resize', resize);

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(function(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle     = p.color;
      ctx.globalAlpha   = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y           += p.speed;
      p.x           += Math.sin(p.swayOffset) * p.sway;
      p.swayOffset  += p.swaySpeed;
      p.angle       += 0.01;

      if (p.y > canvas.height + 20) {
        var fresh = randomPetal(true);
        fresh.y = -20;
        Object.assign(p, fresh);
      }
    });
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// ─── 4. NAV ─────────────────────────────────────────────────

function initNav() {
  var navbar   = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }
}

// ─── 5. REVEAL ──────────────────────────────────────────────

function initReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-section').forEach(function(el) {
    obs.observe(el);
  });
}

// ─── 6. CAROUSEL ────────────────────────────────────────────

function initCarousel() {
  var current = 0;
  var track = document.getElementById('carousel-track');
  if (!track) return;

  function slides() { return document.querySelectorAll('.carousel-slide'); }
  function dots()   { return document.querySelectorAll('.carousel-dot');   }

  function goTo(n) {
    var total = slides().length;
    if (total === 0) return;
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots().forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  // Init first dot active
  goTo(0);

  var prevBtn = document.querySelector('.carousel-prev');
  var nextBtn = document.querySelector('.carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

  var dotsContainer = document.getElementById('carousel-dots');
  if (dotsContainer) {
    dotsContainer.addEventListener('click', function(e) {
      if (e.target.dataset.index !== undefined) goTo(+e.target.dataset.index);
    });
  }

  setInterval(function() { goTo(current + 1); }, 5000);

  var touchStartX = 0;
  var wrapper = document.querySelector('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });
  }
}

// ─── 7. RSVP ────────────────────────────────────────────────

async function initRsvp() {
  var form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = document.getElementById('rsvp-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

    var data = {
      prenom:   form.querySelector('[name="prenom"]').value.trim(),
      nom:      form.querySelector('[name="nom"]').value.trim(),
      presence: form.querySelector('[name="presence"]').value,
      regime:   form.querySelector('[name="regime"]') ? form.querySelector('[name="regime"]').value.trim() : '',
      message:  form.querySelector('[name="message"]') ? form.querySelector('[name="message"]').value.trim() : '',
    };

    try {
      var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      var result = await client.from('rsvp').insert([data]);
      if (result.error) throw result.error;

      form.style.display = 'none';
      var status = document.getElementById('rsvp-status');
      if (status) {
        status.textContent = 'Merci ! Votre réponse a bien été enregistrée. 🌸';
        status.style.display = 'block';
        status.classList.add('visible');
      }
    } catch(err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Réessayer'; }
      alert('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    }
  });
}

// ─── INIT ────────────────────────────────────────────────────

// Run immediately (sync)
hydrate();
runLoader();
initNav();
initPetales();

// After DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initReveal();
  initCarousel();
  initRsvp();
});
