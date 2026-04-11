/* ═══════════════════════════════════════════════════
   WEDORIA STUDIO · script.js
   Nécessite un serveur local (VS Code Live Server)
═══════════════════════════════════════════════════ */
'use strict';

// ── REFS DOM ──
const iframe         = document.getElementById('preview-iframe');
const dropZone       = document.getElementById('drop-zone');
const previewLoading = document.getElementById('preview-loading');
const topbarClient   = document.getElementById('topbar-client');
const btnLoad        = document.getElementById('btn-load');
const btnExport      = document.getElementById('btn-export');
const btnFormPreview = document.getElementById('btn-form-preview');
const fileInput      = document.getElementById('file-input');
const rightPanel     = document.getElementById('right-panel');

// ── ÉTAT ──
let currentMARIAGE = null;    // objet MARIAGE actif
let templateHTML   = null;    // contenu de template/index.html
let templateCSS    = null;    // contenu de template/style.css
let templateJS     = null;    // contenu de template/script.js
let debounceTimer  = null;
let currentBlobUrl = null;    // Blob URL en cours (pour révocation)

// ── CHARGEMENT DES ASSETS TEMPLATE (fetch — nécessite serveur) ──
async function loadTemplateAssets() {
  try {
    const [html, css, js] = await Promise.all([
      fetch('../template/index.html').then(r => r.text()),
      fetch('../template/style.css').then(r => r.text()),
      fetch('../template/script.js').then(r => r.text()),
    ]);
    templateHTML = html;
    templateCSS  = css;
    templateJS   = js;
  } catch (e) {
    console.error('Impossible de charger les assets template. Ouvre le Studio via VS Code Live Server.', e);
    dropZone.querySelector('.drop-or').textContent =
      '⚠️ Erreur : ouvre via VS Code Live Server (clic droit → Open with Live Server)';
  }
}

// ── CONSTRUCTION DU BLOB HTML ──
function buildPreviewHTML(m) {
  if (!templateHTML || !templateCSS || !templateJS) return null;

  let html = templateHTML;

  // Remplacer <link rel="stylesheet" href="style.css"> par le CSS inline
  html = html.replace(
    /<link[^>]+href=["']style\.css["'][^>]*>/,
    `<style>${templateCSS}</style>`
  );

  // Supprimer les balises script locales (config, supabase-config, script)
  html = html.replace(/<script[^>]+src=["'](supabase-config|config|script)\.js["'][^>]*><\/script>/g, '');

  // Injecter config.js + supabase stub + script.js avant </body>
  const injection = `
<script>
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
</script>
<script>
const MARIAGE = ${JSON.stringify(m, null, 2)};
</script>
<script>
${templateJS}
</script>`;

  html = html.replace('</body>', injection + '\n</body>');
  return html;
}

// ── AFFICHAGE PREVIEW ──
function showPreview(m) {
  const html = buildPreviewHTML(m);
  if (!html) return;

  // Révoquer l'ancienne URL si elle n'a pas encore été chargée
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  dropZone.classList.add('hidden');
  previewLoading.style.display = 'flex';
  iframe.style.display = 'none';

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  currentBlobUrl = url;

  iframe.onload = () => {
    previewLoading.style.display = 'none';
    iframe.style.display = 'block';
    setTimeout(() => {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }, 1000);
  };

  iframe.src = url;
  currentMARIAGE = m;

  topbarClient.innerHTML = `<span>${m.prenom1} &amp; ${m.prenom2}</span> — ${m.date_affichage}`;
  btnExport.disabled = false;
}

// ── LECTURE D'UN FICHIER config.js ──
function parseConfigFile(text) {
  try {
    const varIdx = text.search(/(?:const|var|let)\s+MARIAGE\s*=/);
    if (varIdx === -1) throw new Error('MARIAGE non trouvé');
    const braceStart = text.indexOf('{', varIdx);
    if (braceStart === -1) throw new Error('Objet non trouvé');

    let depth = 0, end = -1;
    for (let i = braceStart; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) throw new Error('Accolades non fermées');

    // eslint-disable-next-line no-new-func
    return new Function(`return ${text.slice(braceStart, end + 1)}`)();
  } catch (e) {
    alert('Impossible de lire ce fichier config.js. Vérifiez qu\'il contient `const MARIAGE = {...}`.');
    return null;
  }
}

// ── PEUPLER LE FORMULAIRE DEPUIS UN OBJET MARIAGE ──
function populateForm(m) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  set('s_prenom1',        m.prenom1);
  set('s_nom1',           m.nom1);
  set('s_prenom2',        m.prenom2);
  set('s_nom2',           m.nom2);
  set('s_date_affichage', m.date_affichage);
  set('s_date_iso',       m.date_iso);
  set('s_rsvp_deadline',  m.rsvp_deadline || '');
  set('s_domaine',        m.domaine);
  set('s_ville',          m.ville);
  set('s_email',          m.email);
  set('s_whatsapp',       m.whatsapp || '');
  set('s_hero_intro',     m.hero_intro);
  set('s_hero_cta',       m.hero_cta);
  set('s_citation',       m.citation);
  set('s_bandeau',        Array.isArray(m.bandeau) ? m.bandeau.join(', ') : '');
  set('s_dress_intro',    m.dress_intro);
  set('s_video_type',     m.video_hero ? m.video_hero.type : 'local');
  set('s_video_src',      m.video_hero ? m.video_hero.src  : '');
  set('s_rsvp_intro',     m.rsvp_intro);
}

// ── LIRE LE FORMULAIRE ET CONSTRUIRE UN MARIAGE PARTIEL ──
// Pour le Studio, on ne réécrit que les champs éditables (les autres viennent de currentMARIAGE)
function readFormIntoMARIAGE() {
  if (!currentMARIAGE) return null;

  const v  = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const m  = JSON.parse(JSON.stringify(currentMARIAGE)); // deep clone

  m.prenom1        = v('s_prenom1')        || m.prenom1;
  m.nom1           = v('s_nom1')           || m.nom1;
  m.prenom2        = v('s_prenom2')        || m.prenom2;
  m.nom2           = v('s_nom2')           || m.nom2;
  m.date_affichage = v('s_date_affichage') || m.date_affichage;
  m.date_iso       = v('s_date_iso')       || m.date_iso;
  m.rsvp_deadline  = v('s_rsvp_deadline')  || null;
  m.domaine        = v('s_domaine')        || m.domaine;
  m.ville          = v('s_ville')          || m.ville;
  m.email          = v('s_email')          || m.email;
  m.whatsapp       = v('s_whatsapp')       || null;
  m.hero_intro     = v('s_hero_intro')     || m.hero_intro;
  m.hero_cta       = v('s_hero_cta')       || m.hero_cta;
  m.citation       = v('s_citation');
  const bandeauVal = v('s_bandeau');
  m.bandeau        = bandeauVal ? bandeauVal.split(',').map(s => s.trim()).filter(Boolean) : [];
  m.dress_intro    = v('s_dress_intro');
  m.video_hero     = { type: v('s_video_type') || 'local', src: v('s_video_src') || 'hero.mp4' };
  m.rsvp_intro     = v('s_rsvp_intro');

  return m;
}

// ── GÉNÉRATION config.js ──
function generateConfigJS(m) {
  return `/* config.js — généré par Wedoria Studio */\n\nconst MARIAGE = ${JSON.stringify(m, null, 2)};\n`;
}

// ── EXPORT ──
function exportConfig() {
  const m = readFormIntoMARIAGE() || currentMARIAGE;
  if (!m) return;
  const content  = generateConfigJS(m);
  const filename = `config-${m.prenom1.toLowerCase()}-${m.prenom2.toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ── DEBOUNCE REFRESH ──
function scheduleRefresh() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const m = readFormIntoMARIAGE();
    if (m) showPreview(m);
  }, 500);
}

// ── DRAG & DROP ──
rightPanel.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
rightPanel.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});
rightPanel.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file || !file.name.endsWith('.js')) {
    alert('Déposez un fichier .js (config.js)');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const m = parseConfigFile(ev.target.result);
    if (!m) return;
    populateForm(m);
    showPreview(m);
  };
  reader.readAsText(file);
});

// ── FILE PICKER ──
btnLoad.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const m = parseConfigFile(ev.target.result);
    if (!m) return;
    populateForm(m);
    showPreview(m);
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// ── PREVIEW DEPUIS FORMULAIRE ──
btnFormPreview.addEventListener('click', () => {
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const stub = {
    prenom1: v('s_prenom1') || 'Prénom 1', nom1: v('s_nom1') || '',
    prenom2: v('s_prenom2') || 'Prénom 2', nom2: v('s_nom2') || '',
    date_affichage: v('s_date_affichage') || 'Date à définir',
    date_iso: v('s_date_iso') || '2025-01-01T14:00:00',
    rsvp_deadline: v('s_rsvp_deadline') || null,
    domaine: v('s_domaine') || '', ville: v('s_ville') || '',
    email: v('s_email') || '', whatsapp: v('s_whatsapp') || null,
    langues: ['fr'],
    photo_couple: null, photo_couple_caption: '',
    hero_intro: v('s_hero_intro') || 'Vous êtes invités au mariage de',
    hero_cta: v('s_hero_cta') || 'Confirmer ma présence',
    scroll_label: 'Découvrir',
    citation: v('s_citation'),
    sr_line1: 'Avant ce jour,', sr_line2: "notre histoire s'écrivait",
    bandeau: (() => { const b = v('s_bandeau'); return b ? b.split(',').map(s => s.trim()).filter(Boolean) : []; })(),
    histoire_eyebrow: '', histoire_titre: 'Notre Histoire',
    histoire: [{ annee:'', titre:'', texte:'', align:'left' }],
    programme_eyebrow: '', programme_titre: 'Le Jour J',
    programme: [{ heure:'', icon:'💍', titre:'', lieu:'' }],
    galerie_eyebrow: '', galerie_titre: 'Le Domaine', galerie_hint: '',
    galerie: [{ icon:'🏰', label:'', photo:null }],
    lieux_eyebrow: 'Où nous rejoindre', lieux_titre: 'Les Lieux',
    lieux: [{ icon:'🏰', type:'', nom:'', adresse:[], featured:true, badge:'Lieu principal', btn:{ label:'Voir sur la carte', href:'#map' } }],
    carte: { lat: null, lng: null, zoom:14, nom:'', adresse:[], caption:'' },
    dress_eyebrow: "Pour l'occasion", dress_titre: 'Code Vestimentaire',
    dress_intro: v('s_dress_intro'), dress_couleurs:[],
    infos_eyebrow: "Tout ce qu'il faut savoir", infos_titre: 'Infos Pratiques', infos:[],
    faq_titre: 'Questions fréquentes', faq:[],
    video_hero: { type: v('s_video_type')||'none', src: v('s_video_src')||'' },
    rsvp_titre: 'Confirmer votre présence', rsvp_intro: v('s_rsvp_intro'),
    i18n:{},
  };
  currentMARIAGE = stub;
  showPreview(stub);
});

// ── LISTENERS FORMULAIRE (debounce) ──
document.getElementById('left-panel').addEventListener('input', () => {
  if (currentMARIAGE) scheduleRefresh();
});

// ── EXPORT BUTTON ──
btnExport.addEventListener('click', exportConfig);

// ── INIT ──
loadTemplateAssets();
