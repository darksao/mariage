/* ═══════════════════════════════════════════════════
   WEDORIA ONBOARDING · script.js
═══════════════════════════════════════════════════ */

// ── CONFIG EMAILJS (à remplacer avec vos vraies clés) ──
const EMAILJS_SERVICE_ID  = 'VOTRE_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'VOTRE_PUBLIC_KEY';
const RECIPIENT_EMAIL     = 'votre@email.com';


// ── ÉTAT DU WIZARD ──
const TOTAL_STEPS = 14;
let currentStep = 1;

const steps        = document.querySelectorAll('.wizard-step');
const btnPrev      = document.getElementById('btn-prev');
const btnNext      = document.getElementById('btn-next');
const btnSubmit    = document.getElementById('btn-submit');
const progressFill  = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

// Champs obligatoires par étape (validation manuelle — pas de <form>)
const REQUIRED_BY_STEP = {
  1: ['prenom1', 'prenom2'],
  2: ['date_affichage', 'date_iso', 'domaine', 'ville'],
  3: ['email'],
};

function validateStep(n) {
  const required = REQUIRED_BY_STEP[n];
  if (!required) return true;
  let valid = true;
  let firstInvalid = null;
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) {
        el.style.borderColor = '#c0392b';
        setTimeout(() => { el.style.borderColor = ''; }, 2000);
        if (!firstInvalid) firstInvalid = el;
      }
      valid = false;
    }
  }
  if (firstInvalid) firstInvalid.focus();
  return valid;
}

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.wizard-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  btnNext.style.display    = n === TOTAL_STEPS ? 'none'         : 'inline-block';
  btnSubmit.style.display  = n === TOTAL_STEPS ? 'inline-block' : 'none';

  progressFill.style.width = `${(n / TOTAL_STEPS) * 100}%`;
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

// Masquer/afficher champ URL selon type vidéo
document.getElementById('video_type').addEventListener('change', function () {
  document.getElementById('video_src_group').style.display =
    this.value === 'url' ? 'block' : 'none';
});
document.getElementById('video_src_group').style.display = 'none';

// ── DONNÉES DÉMO (Sophie & Thomas) ──
const DEMO = {
  prenom1: 'Sophie',         nom1: 'Martin',
  prenom2: 'Thomas',         nom2: 'Dupont',
  date_affichage: 'Samedi 12 Juillet 2025',
  date_iso:       '2025-07-12T14:00:00',
  rsvp_deadline:  '1er Mai 2025',
  domaine: 'Domaine des Brumes',
  ville:   'Beaune, Bourgogne',
  email:    'sophie.thomas@exemple.com',
  whatsapp: '06 12 34 56 78',
  lang_en: false, lang_vi: false,
  photo_couple: 'photo-couple.jpg',
  photo_couple_caption: 'Sophie & Thomas · Paris, France',
  hero_intro:   'Vous êtes invités au mariage de',
  hero_cta:     'Confirmer ma présence',
  sr_line1:     'Avant ce jour,',
  sr_line2:     "notre histoire s'écrivait",
  citation:     "« Aimer, c'est trouver sa richesse en l'autre. »",
  bandeau:      'France, Barcelone, Sophie, Thomas, Juillet 2025, Beaune, Bourgogne',
  histoire_eyebrow: 'Depuis 2019',
  histoire_titre:   'Notre Histoire',
  h0_annee: '2019', h0_titre: 'La Rencontre',
  h0_texte: "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois.",
  h0_align: 'left',
  h1_annee: '2022', h1_titre: 'Notre Premier Voyage',
  h1_texte: "Direction Lisbonne pour notre premier voyage. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l'un pour l'autre.",
  h1_align: 'right',
  h2_annee: '2024', h2_titre: 'La Demande',
  h2_texte: "Au coucher du soleil sur la plage de Biarritz, Thomas s'est agenouillé et a demandé à Sophie de partager sa vie.",
  h2_align: 'left',
  h3_annee: '2025', h3_titre: 'Le Grand Jour',
  h3_texte: 'Nous célébrons notre union entourés de ceux que nous aimons.',
  h3_align: 'right',
  h4_annee: '', h4_titre: '', h4_texte: '', h4_align: 'left',
  programme_eyebrow: '12 Juillet 2025',
  programme_titre:   'Le Jour J',
  p0_heure: '14h00', p0_icon: '💍', p0_titre: 'Cérémonie Laïque',  p0_lieu: 'Chapelle du Domaine des Brumes',
  p1_heure: '15h30', p1_icon: '🥂', p1_titre: "Vin d'Honneur",     p1_lieu: 'Jardins du Domaine',
  p2_heure: '19h30', p2_icon: '🍽️', p2_titre: 'Dîner de Gala',     p2_lieu: 'Grande Salle du Château',
  p3_heure: '22h00', p3_icon: '🎵', p3_titre: 'Soirée Dansante',   p3_lieu: "Jusqu'au bout de la nuit !",
  galerie_eyebrow: 'Le décor de notre amour',
  galerie_titre:   'Le Domaine',
  g0_icon: '🏰', g0_label: 'Façade du Domaine',   g0_photo: '',
  g1_icon: '🌿', g1_label: 'Les Jardins',          g1_photo: '',
  g2_icon: '✨', g2_label: 'Grande Salle',         g2_photo: '',
  g3_icon: '⛪', g3_label: 'Chapelle',             g3_photo: '',
  g4_icon: '🌸', g4_label: 'Terrasse',             g4_photo: '',
  g5_icon: '🕯️', g5_label: 'Décoration de Table', g5_photo: '',
  l0_icon: '⛪', l0_type: 'Cérémonie Laïque', l0_nom: 'Chapelle Saint-Jean',
  l0_adresse1: '12 Route des Vignes', l0_adresse2: '21200 Beaune, Bourgogne',
  l1_icon: '🏰', l1_type: 'Réception', l1_nom: 'Domaine des Brumes',
  l1_adresse1: 'Hameau des Brumes',   l1_adresse2: '21200 Beaune, Bourgogne',
  l2_nom: 'Hôtel Le Cep ★★★★', l2_adresse1: '27 Rue Maufoux', l2_adresse2: '21200 Beaune, Bourgogne',
  carte_lat: '47.0239', carte_lng: '4.8397', carte_nom: 'Domaine des Brumes',
  carte_caption: '📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune',
  dress_intro: 'Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !',
  c0_nom: 'Rose poudré',  c0_hex: '#F2C4CE', c0_eviter: false,
  c1_nom: 'Champagne',    c1_hex: '#F0DCA0', c1_eviter: false,
  c2_nom: 'Sauge',        c2_hex: '#87A878', c2_eviter: false,
  c3_nom: 'Ivoire',       c3_hex: '#F5F0E0', c3_eviter: false,
  c4_nom: 'Blanc',        c4_hex: '#F5F5F5', c4_eviter: true,
  c5_nom: 'Noir',         c5_hex: '#1A1A1A', c5_eviter: true,
  i0_texte: 'Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord.',
  i1_texte: 'Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50.',
  i2_texte: "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel.",
  i3_texte: 'Soirée adultes uniquement.',
  i4_texte: 'Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage.',
  i5_icon: '➕', i5_titre: '', i5_texte: '',
  faq0_q: "Puis-je amener un +1 non mentionné sur l'invitation ?",
  faq0_r: "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire.",
  faq1_q: "Y a-t-il une liste de mariage ?",
  faq1_r: "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage. Détails envoyés par email après RSVP.",
  faq2_q: 'Comment nous contacter ?',
  faq2_r: 'Écrivez-nous à <a href="mailto:sophie.thomas@exemple.com">sophie.thomas@exemple.com</a>.',
  faq3_q: '', faq3_r: '',
  faq4_q: '', faq4_r: '',
  video_type: 'local',
  video_src:  '',
  rsvp_intro: 'Merci de nous confirmer votre présence avant le 1er mai 2025 afin que nous puissions organiser cette belle journée dans les meilleures conditions.',
};

// Pré-remplir tous les champs du formulaire avec DEMO
document.getElementById('btn-demo').addEventListener('click', () => {
  Object.entries(DEMO).forEach(([key, value]) => {
    const el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
    if (!el) return;
    if (el.type === 'checkbox') { el.checked = Boolean(value); return; }
    el.value = value;
  });
  document.getElementById('video_type').dispatchEvent(new Event('change'));
  showStep(2);
});

// ── LECTURE DES VALEURS ──
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function vCheck(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}

// ── GÉNÉRATION DE L'OBJET MARIAGE ──
function generateMAIRIAGE() {
  const langues = ['fr'];
  if (vCheck('lang_en')) langues.push('en');
  if (vCheck('lang_vi')) langues.push('vi');

  const bandeau = v('bandeau')
    ? v('bandeau').split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const histoire = [0, 1, 2, 3, 4].map(i => ({
    annee: v(`h${i}_annee`),
    titre: v(`h${i}_titre`),
    texte: v(`h${i}_texte`),
    align: v(`h${i}_align`) || 'left',
  }));

  const programme = [0, 1, 2, 3].map(i => ({
    heure: v(`p${i}_heure`),
    icon:  v(`p${i}_icon`) || '◆',
    titre: v(`p${i}_titre`),
    lieu:  v(`p${i}_lieu`),
  }));

  const galerie = [0, 1, 2, 3, 4, 5].map(i => ({
    icon:  v(`g${i}_icon`) || '🏛️',
    label: v(`g${i}_label`),
    photo: v(`g${i}_photo`) || null,
  }));

  const carteLatRaw = v('carte_lat');
  const carteLngRaw = v('carte_lng');
  const carte = {
    lat:     carteLatRaw ? parseFloat(carteLatRaw) : null,
    lng:     carteLngRaw ? parseFloat(carteLngRaw) : null,
    zoom:    14,
    nom:     v('carte_nom'),
    adresse: [v('l1_adresse1'), v('l1_adresse2')].filter(Boolean),
    caption: v('carte_caption'),
  };

  const lieux = [
    {
      icon: v('l0_icon') || '⛪', type: v('l0_type'),
      nom:  v('l0_nom'),
      adresse: [v('l0_adresse1'), v('l0_adresse2')].filter(Boolean),
      featured: false, badge: '',
      btn: { label: 'Voir sur la carte', href: '#map' },
    },
    {
      icon: v('l1_icon') || '🏰', type: v('l1_type'),
      nom:  v('l1_nom'),
      adresse: [v('l1_adresse1'), v('l1_adresse2')].filter(Boolean),
      featured: true, badge: 'Lieu principal',
      btn: { label: 'Voir sur la carte', href: '#map' },
    },
    {
      icon: '🏨', type: 'Hébergement conseillé',
      nom:  v('l2_nom'),
      adresse: [v('l2_adresse1'), v('l2_adresse2')].filter(Boolean),
      featured: false, badge: '',
      btn: { label: "Plus d'infos", href: '#infos' },
    },
  ];

  const dress_couleurs = [0, 1, 2, 3, 4, 5].map(i => ({
    nom:    v(`c${i}_nom`),
    hex:    v(`c${i}_hex`),
    eviter: vCheck(`c${i}_eviter`),
  })).filter(c => c.nom);

  const infos = [
    { icon: '🚗', titre: 'Parking',     texte: v('i0_texte') },
    { icon: '🚂', titre: 'Train',       texte: v('i1_texte') },
    { icon: '🏨', titre: 'Hébergement', texte: v('i2_texte') },
    { icon: '👶', titre: 'Enfants',     texte: v('i3_texte') },
    { icon: '📸', titre: 'Photos',      texte: v('i4_texte') },
    { icon: v('i5_icon') || '➕', titre: v('i5_titre'), texte: v('i5_texte') },
  ];

  const faq = [0, 1, 2, 3, 4].map(i => ({
    q: v(`faq${i}_q`),
    r: v(`faq${i}_r`),
  }));

  return {
    prenom1: v('prenom1'), nom1: v('nom1'),
    prenom2: v('prenom2'), nom2: v('nom2'),
    date_affichage: v('date_affichage'),
    date_iso:       v('date_iso'),
    rsvp_deadline:  v('rsvp_deadline') || null,
    domaine: v('domaine'),
    ville:   v('ville'),
    email:    v('email'),
    whatsapp: v('whatsapp') || null,
    langues,
    photo_couple:         v('photo_couple') || null,
    photo_couple_caption: v('photo_couple_caption'),
    hero_intro:   v('hero_intro'),
    hero_cta:     v('hero_cta'),
    scroll_label: 'Découvrir',
    citation:     v('citation'),
    sr_line1:     v('sr_line1'),
    sr_line2:     v('sr_line2'),
    bandeau,
    histoire_eyebrow: v('histoire_eyebrow'),
    histoire_titre:   v('histoire_titre'),
    histoire,
    programme_eyebrow: v('programme_eyebrow'),
    programme_titre:   v('programme_titre'),
    programme,
    galerie_eyebrow: v('galerie_eyebrow'),
    galerie_titre:   v('galerie_titre'),
    galerie_hint:    '',
    galerie,
    lieux_eyebrow: 'Où nous rejoindre',
    lieux_titre:   'Les Lieux',
    lieux,
    carte,
    dress_eyebrow: "Pour l'occasion",
    dress_titre:   'Code Vestimentaire',
    dress_intro:   v('dress_intro'),
    dress_couleurs,
    infos_eyebrow: "Tout ce qu'il faut savoir",
    infos_titre:   'Infos Pratiques',
    infos,
    faq_titre: 'Questions fréquentes',
    faq,
    video_hero: {
      type: v('video_type') || 'local',
      src:  v('video_src') || 'hero.mp4',
    },
    rsvp_titre: 'Confirmer votre présence',
    rsvp_intro: v('rsvp_intro'),
    i18n: {},
  };
}

// ── GÉNÉRATION DU FICHIER config.js ──
function generateConfigJS(m) {
  return `/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Généré par Wedoria Onboarding
   ─────────────────────────────────────────────────────────────
   C'est le SEUL fichier à modifier pour chaque nouveau client.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = ${JSON.stringify(m, null, 2)};
`;
}

// ── TÉLÉCHARGEMENT DU FICHIER ──
function downloadConfig(content, prenom1, prenom2) {
  const filename = `config-${prenom1.toLowerCase()}-${prenom2.toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ── SOUMISSION ──
let _emailjsReady = false;
async function handleSubmit() {
  const m         = generateMAIRIAGE();
  const configStr = generateConfigJS(m);

  // 1. Téléchargement immédiat (même si l'email échoue)
  downloadConfig(configStr, m.prenom1, m.prenom2);

  // 2. Désactiver le bouton
  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'Envoi en cours…';

  // 3. Envoi email via EmailJS
  try {
    if (!_emailjsReady) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      _emailjsReady = true;
    }
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:       RECIPIENT_EMAIL,
      subject:        `Nouveau client — ${m.prenom1} & ${m.prenom2}`,
      prenom1:        m.prenom1,
      prenom2:        m.prenom2,
      date:           m.date_affichage,
      lieu:           `${m.domaine}, ${m.ville}`,
      email_client:   m.email,
      config_content: configStr,
    });
  } catch (err) {
    console.error('EmailJS error:', err);
    // L'email a échoué mais le fichier a déjà été téléchargé — on continue
  }

  // 4. Afficher la confirmation
  document.getElementById('wizard').style.display     = 'none';
  document.getElementById('confirmation').classList.remove('hidden');
}

btnSubmit.addEventListener('click', handleSubmit);
