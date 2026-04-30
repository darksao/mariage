/* ═══════════════════════════════════════════════════
   WEDORIA ONBOARDING · script.js
═══════════════════════════════════════════════════ */

const SUPABASE_URL     = 'https://wvujjzrttnkchxzjalce.supabase.co';
const SUPABASE_ANON    = 'sb_publishable_q_NmRiGdRZ5UCJvq6DMakw_26A0KkE9';
const STORAGE_BUCKET   = 'couple-photos';
const API_BASE         = 'https://wedoria-studio.vercel.app';

const MAX_PHOTOS       = 3;
const MAX_PHOTO_MB     = 5;

// ── FORMULE (URL param: ?formule=premium) ──
const urlParams = new URLSearchParams(window.location.search);
const FORMULE   = urlParams.get('formule') || 'standard';

const FORMULE_LABELS = {
  standard:    { label: 'Formule Standard',    icon: '◆' },
  premium:     { label: 'Formule Premium',      icon: '⭐' },
  'sur-mesure':{ label: 'Formule Sur-mesure',   icon: '✦' },
};

// ── ÉTAT ──
const TOTAL_STEPS = 8;
let currentStep   = 1;
const photoFiles  = [null, null, null];

// Données dynamiques
let histoireItems  = [{ annee: '', titre: '', texte: '' }];
let programmeItems = [{ ceremonie: '', heure: '', lieu: '' }];

// ── DOM ──
const steps         = document.querySelectorAll('.wizard-step');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');
const btnSubmit     = document.getElementById('btn-submit');
const progressFill  = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

// ── INIT FORMULE ──
(function initFormule() {
  const badge = document.getElementById('formule-badge');
  const info  = FORMULE_LABELS[FORMULE] || FORMULE_LABELS.standard;
  badge.textContent = `${info.icon} ${info.label}`;
  badge.className   = `wizard-formule formule-${FORMULE}`;

  if (FORMULE === 'premium' || FORMULE === 'sur-mesure') {
    document.getElementById('video-section').style.display = 'block';
  }
})();

// ── VALIDATION ──
const REQUIRED_BY_STEP = {
  1: ['prenom1', 'prenom2'],
  2: ['date_affichage', 'date_iso', 'domaine', 'ville'],
  3: ['email'],
};

function validateStep(n) {
  const required = REQUIRED_BY_STEP[n];
  if (!required) return true;
  let valid = true;
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) { el.style.borderColor = '#c0392b'; setTimeout(() => { el.style.borderColor = ''; }, 2000); }
      if (valid) el && el.focus();
      valid = false;
    }
  }
  return valid;
}

// ── NAVIGATION ──
function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.wizard-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  btnNext.style.display    = n === TOTAL_STEPS ? 'none'         : 'inline-block';
  btnSubmit.style.display  = n === TOTAL_STEPS ? 'inline-block' : 'none';

  progressFill.style.width  = `${(n / TOTAL_STEPS) * 100}%`;
  progressLabel.textContent = `Étape ${n} / ${TOTAL_STEPS}`;

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnNext.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
});

btnPrev.addEventListener('click', () => {
  if (currentStep > 1) showStep(currentStep - 1);
});

// ── PHOTO UPLOAD ZONES ──
function initPhotoZones() {
  for (let i = 0; i < MAX_PHOTOS; i++) {
    const zone    = document.getElementById(`zone-${i}`);
    const input   = document.getElementById(`photo_${i}`);
    const preview = document.getElementById(`prev-${i}`);
    const img     = document.getElementById(`prev-img-${i}`);
    const btnRm   = zone.querySelector('.upload-remove');

    zone.addEventListener('click', (e) => {
      if (e.target === btnRm || btnRm.contains(e.target)) return;
      input.click();
    });

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handlePhotoFile(i, file, img, preview, zone);
    });

    input.addEventListener('change', () => {
      if (input.files[0]) handlePhotoFile(i, input.files[0], img, preview, zone);
    });

    btnRm.addEventListener('click', () => {
      photoFiles[i] = null;
      input.value   = '';
      preview.style.display = 'none';
      zone.querySelector('.upload-placeholder').style.display = 'flex';
      zone.classList.remove('has-file');
    });
  }
}

function handlePhotoFile(idx, file, img, preview, zone) {
  if (!file.type.match(/image\/(jpeg|png|webp)/)) {
    alert('Format non supporté. Utilisez JPG, PNG ou WebP.'); return;
  }
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
    alert(`Photo trop lourde (max ${MAX_PHOTO_MB} Mo).`); return;
  }
  photoFiles[idx] = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    img.src = e.target.result;
    preview.style.display = 'flex';
    zone.querySelector('.upload-placeholder').style.display = 'none';
    zone.classList.add('has-file');
  };
  reader.readAsDataURL(file);
}

// ── HISTOIRE DYNAMIQUE ──
const HISTOIRE_EXEMPLES = [
  { annee: '', titre: 'La Rencontre', texte: 'Décrivez comment vous vous êtes rencontrés...' },
  { annee: '', titre: 'Le Premier Move', texte: 'Qui a fait le premier pas ?' },
  { annee: '', titre: 'Notre Premier Voyage', texte: 'Ce voyage qui a tout changé...' },
  { annee: '', titre: 'La Demande', texte: 'Le moment où vous avez dit oui...' },
  { annee: '', titre: 'Le Grand Jour', texte: 'Et maintenant, nous célébrons...' },
];

function renderHistoire() {
  const container = document.getElementById('histoire-container');
  container.innerHTML = histoireItems.map((item, i) => `
    <div class="dynamic-block" data-idx="${i}">
      <div class="block-header">
        <span class="block-num">${i + 1}</span>
        ${histoireItems.length > 1 ? `<button type="button" class="btn-remove-block" data-idx="${i}">✕</button>` : ''}
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:0 0 120px">
          <label>Année</label>
          <input type="text" value="${item.annee}" placeholder="2019"
            oninput="histoireItems[${i}].annee = this.value" />
        </div>
        <div class="form-group">
          <label>Titre <span class="req">*</span></label>
          <input type="text" value="${item.titre}"
            placeholder="${HISTOIRE_EXEMPLES[i % HISTOIRE_EXEMPLES.length].titre}"
            oninput="histoireItems[${i}].titre = this.value" />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea placeholder="${HISTOIRE_EXEMPLES[i % HISTOIRE_EXEMPLES.length].texte}"
          oninput="histoireItems[${i}].texte = this.value">${item.texte}</textarea>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-remove-block').forEach(btn => {
    btn.addEventListener('click', () => {
      histoireItems.splice(parseInt(btn.dataset.idx), 1);
      renderHistoire();
    });
  });
}

document.getElementById('btn-add-histoire').addEventListener('click', () => {
  if (histoireItems.length >= 5) return;
  histoireItems.push({ annee: '', titre: '', texte: '' });
  renderHistoire();
});

// ── PROGRAMME DYNAMIQUE ──
const PROGRAMME_SUGGESTIONS = ['Cérémonie', 'Vin d\'Honneur', 'Cocktail', 'Dîner', 'Soirée dansante', 'Brunch du lendemain'];

function renderProgramme() {
  const container = document.getElementById('programme-container');
  container.innerHTML = programmeItems.map((item, i) => `
    <div class="dynamic-block" data-idx="${i}">
      <div class="block-header">
        <span class="block-num">${i + 1}</span>
        ${programmeItems.length > 1 ? `<button type="button" class="btn-remove-block" data-idx="${i}">✕</button>` : ''}
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Moment <span class="req">*</span></label>
          <input type="text" list="prog-suggestions" value="${item.ceremonie}"
            placeholder="Cérémonie"
            oninput="programmeItems[${i}].ceremonie = this.value" />
        </div>
        <div class="form-group" style="flex:0 0 130px">
          <label>Heure</label>
          <input type="text" value="${item.heure}" placeholder="14h00"
            oninput="programmeItems[${i}].heure = this.value" />
        </div>
      </div>
      <div class="form-group">
        <label>Lieu</label>
        <input type="text" value="${item.lieu}" placeholder="Chapelle du Domaine"
          oninput="programmeItems[${i}].lieu = this.value" />
      </div>
    </div>
  `).join('') + `<datalist id="prog-suggestions">${PROGRAMME_SUGGESTIONS.map(s => `<option value="${s}">`).join('')}</datalist>`;

  container.querySelectorAll('.btn-remove-block').forEach(btn => {
    btn.addEventListener('click', () => {
      programmeItems.splice(parseInt(btn.dataset.idx), 1);
      renderProgramme();
    });
  });
}

document.getElementById('btn-add-programme').addEventListener('click', () => {
  programmeItems.push({ ceremonie: '', heure: '', lieu: '' });
  renderProgramme();
});

// ── DONNÉES DÉMO ──
document.getElementById('btn-demo').addEventListener('click', () => {
  document.getElementById('prenom1').value       = 'Sophie';
  document.getElementById('nom1').value          = 'Martin';
  document.getElementById('prenom2').value       = 'Thomas';
  document.getElementById('nom2').value          = 'Dupont';
  document.getElementById('date_affichage').value = 'Samedi 12 Juillet 2025';
  document.getElementById('date_iso').value       = '2025-07-12T14:00';
  document.getElementById('rsvp_deadline').value  = '1er Mai 2025';
  document.getElementById('domaine').value        = 'Domaine des Brumes';
  document.getElementById('ville').value          = 'Beaune, Bourgogne';
  document.getElementById('email').value          = 'sophie.thomas@exemple.com';
  document.getElementById('whatsapp').value       = '06 12 34 56 78';

  histoireItems = [
    { annee: '2019', titre: 'La Rencontre', texte: "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois." },
    { annee: '2022', titre: 'Notre Premier Voyage', texte: "Direction Lisbonne. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l'un pour l'autre." },
    { annee: '2024', titre: 'La Demande', texte: "Au coucher du soleil sur la plage de Biarritz, Thomas s'est agenouillé et a demandé à Sophie de partager sa vie." },
    { annee: '2025', titre: 'Le Grand Jour', texte: 'Nous célébrons notre union entourés de ceux que nous aimons.' },
  ];
  renderHistoire();

  programmeItems = [
    { ceremonie: 'Cérémonie Laïque', heure: '14h00', lieu: 'Chapelle du Domaine des Brumes' },
    { ceremonie: "Vin d'Honneur",    heure: '15h30', lieu: 'Jardins du Domaine' },
    { ceremonie: 'Dîner de Gala',    heure: '19h30', lieu: 'Grande Salle du Château' },
    { ceremonie: 'Soirée Dansante',  heure: '22h00', lieu: "Jusqu'au bout de la nuit !" },
  ];
  renderProgramme();

  document.getElementById('infos_libres').value =
    "🚗 Parking gratuit sur le domaine.\n🚂 Gare de Beaune à 8 km — navettes depuis la gare à 13h30.\n🏨 Des chambres pré-réservées à l'Hôtel Le Cep (contactez-nous pour le code).";

  showStep(2);
});

// ── UPLOAD PHOTO → SUPABASE STORAGE ──
async function uploadPhoto(file, slug, idx) {
  const ext  = file.name.split('.').pop();
  const path = `${slug}/photo-${idx + 1}-${Date.now()}.${ext}`;
  const res  = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: file,
    }
  );
  if (!res.ok) throw new Error(`Upload photo ${idx + 1} échoué`);
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

// ── LECTURE DES VALEURS ──
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── GÉNÉRATION CONFIG ──
function generateConfig() {
  const langues = ['fr'];
  if (document.getElementById('lang_en').checked) langues.push('en');
  if (document.getElementById('lang_vi').checked) langues.push('vi');

  const programme = programmeItems
    .filter(p => p.ceremonie)
    .map(p => ({
      heure: p.heure,
      icon: '◆',
      titre: p.ceremonie,
      lieu: p.lieu,
    }));

  const histoire = histoireItems
    .filter(h => h.titre)
    .map((h, i) => ({
      annee: h.annee,
      titre: h.titre,
      texte: h.texte,
      align: i % 2 === 0 ? 'left' : 'right',
    }));

  return {
    prenom1: v('prenom1'), nom1: v('nom1'),
    prenom2: v('prenom2'), nom2: v('nom2'),
    date_affichage: v('date_affichage'),
    date_iso:       v('date_iso') || null,
    rsvp_deadline:  v('rsvp_deadline') || null,
    domaine: v('domaine'),
    ville:   v('ville'),
    email:    v('email'),
    whatsapp: v('whatsapp') || null,
    langues,
    formule: FORMULE,
    photo_couple: null,
    photos: [],
    video_hero: { type: 'local', src: v('video_src') || 'hero.mp4' },
    histoire_eyebrow: '',
    histoire_titre:   'Notre Histoire',
    histoire,
    programme_eyebrow: v('date_affichage') || '',
    programme_titre:   'Le Jour J',
    programme,
    infos_libres: v('infos_libres'),
    infos:  v('infos_libres') ? [{ icon: '📋', titre: 'Informations pratiques', texte: v('infos_libres') }] : [],
    faq: [],
    rsvp_titre: 'Confirmer votre présence',
    rsvp_intro: '',
    i18n: {},
  };
}

function generateConfigJS(m) {
  return `/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Généré par Wedoria Onboarding
   Couple : ${m.prenom1} & ${m.prenom2}
═══════════════════════════════════════════════════════════════ */

const MARIAGE = ${JSON.stringify(m, null, 2)};
`;
}

function downloadConfig(content, prenom1, prenom2) {
  const filename = `config-${prenom1.toLowerCase()}-${prenom2.toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ── SOUMISSION ──
btnSubmit.addEventListener('click', async () => {
  const config    = generateConfig();
  const configStr = generateConfigJS(config);

  downloadConfig(configStr, config.prenom1, config.prenom2);

  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'Envoi en cours…';

  // Upload photos → Supabase Storage
  const slug = `${config.prenom1}-${config.prenom2}`.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9-]/g, '-');

  const photoUrls = [];
  for (let i = 0; i < MAX_PHOTOS; i++) {
    if (photoFiles[i]) {
      try {
        const url = await uploadPhoto(photoFiles[i], slug, i);
        photoUrls.push(url);
      } catch (err) {
        console.error('Upload photo error:', err);
        // Non-fatal — on continue sans la photo
      }
    }
  }
  config.photos       = photoUrls;
  config.photo_couple = photoUrls[0] || null;

  // Envoi brief API
  try {
    const lead_id = localStorage.getItem('wedoria_lead_id') || null;
    const payload = {
      lead_id,
      prenom1:      config.prenom1,
      prenom2:      config.prenom2,
      email_client: config.email,
      date_mariage: config.date_iso || null,
      lieu:         [config.domaine, config.ville].filter(Boolean).join(', ') || null,
      programme:    config.programme.filter(p => p.heure || p.titre)
        .map(p => `${p.heure} ${p.titre}`.trim()).join(' · ') || null,
      infos_pratiques: config.infos_libres || null,
    };
    const res  = await fetch(`${API_BASE}/api/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.projet_id) {
      localStorage.setItem('wedoria_projet_id', json.projet_id);
    }
  } catch (err) {
    console.error('Onboarding API error:', err);
  }

  document.getElementById('wizard').style.display   = 'none';
  document.getElementById('confirmation').classList.remove('hidden');
});

// ── INIT ──
renderHistoire();
renderProgramme();
showStep(1);
