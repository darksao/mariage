/* ═══════════════════════════════════════════════════
   WEDORIA STUDIO · script.js
═══════════════════════════════════════════════════ */
'use strict';

// ── REFS DOM ──
const iframe         = document.getElementById('preview-iframe');
const dropZone       = document.getElementById('drop-zone');
const previewLoading = document.getElementById('preview-loading');
const topbarClient   = document.getElementById('topbar-client');
const btnLoad        = document.getElementById('btn-load');
const btnSave        = document.getElementById('btn-save');
const btnExport      = document.getElementById('btn-export');
const btnFormPreview = document.getElementById('btn-form-preview');
const fileInput      = document.getElementById('file-input');
const rightPanel     = document.getElementById('right-panel');

// ── ÉTAT ──
let currentMARIAGE = null;
let templateHTML   = null;
let templateCSS    = null;
let templateJS     = null;
let currentBlobUrl = null;

// ── POLICES DISPONIBLES ──
const FONTS = {
  serif: {
    'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600',
    'Playfair Display':   'Playfair+Display:ital,wght@0,400;0,600;1,400;1,600',
    'EB Garamond':        'EB+Garamond:ital,wght@0,400;0,600;1,400;1,600',
    'Libre Baskerville':  'Libre+Baskerville:ital,wght@0,400;0,700;1,400',
    'Lora':               'Lora:ital,wght@0,400;0,600;1,400;1,600',
    'Bodoni Moda':        'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400;1,6..96,600',
  },
  sans: {
    'Montserrat':   'Montserrat:wght@300;400;500;600',
    'Raleway':      'Raleway:wght@300;400;500;600',
    'Josefin Sans': 'Josefin+Sans:wght@300;400;500;600',
    'DM Sans':      'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600',
    'Nunito':       'Nunito:wght@300;400;500;600',
  },
};

// ── COLORIMÉTRIE ──
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1,3),16)/255;
  let g = parseInt(hex.slice(3,5),16)/255;
  let b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return [h*360, s*100, l*100];
}

function hslToHex(h,s,l) {
  h=((h%360)+360)%360; s=Math.max(0,Math.min(100,s)); l=Math.max(0,Math.min(100,l));
  s/=100; l/=100;
  const a = s*Math.min(l,1-l);
  const f = n => {
    const k=(n+h/30)%12;
    const c=l-a*Math.max(Math.min(k-3,9-k,1),-1);
    return Math.round(255*c).toString(16).padStart(2,'0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Génère la palette complète à partir de la couleur principale
function generateThemePalette(mainHex) {
  const [h, s, l] = hexToHSL(mainHex);

  // Doré : décalage chaud +38°, désaturé, plus clair
  const goldH = (h + 38) % 360;
  const goldS = Math.max(30, Math.min(s * 0.65, 55));
  const goldL = Math.max(55, Math.min(l + 22, 72));
  const gold  = hslToHex(goldH, goldS, goldL);
  const goldLt = hslToHex(goldH, goldS * 0.85, Math.min(goldL + 12, 88));

  // Olive : analogique végétal (+80° vers vert), saturé moyen
  const olive = hslToHex((h + 80) % 360, Math.min(s * 0.7, 45), Math.min(l + 18, 60));

  // Fond clair : même teinte, très désaturé, très lumineux
  const cream   = hslToHex(h, Math.min(s * 0.1, 10), 93);
  const creamDk = hslToHex(h, Math.min(s * 0.12, 12), 88);

  // Fond sombre
  const dark   = hslToHex(h, Math.min(s * 0.55, 60), Math.max(4, l * 0.1));
  const darkMd = hslToHex(h, Math.min(s * 0.5, 55), Math.max(7, l * 0.16));

  // Texte
  const text   = hslToHex(h, Math.min(s * 0.45, 50), Math.max(12, l * 0.22));
  const textLt = hslToHex(h, Math.min(s * 0.4, 40), Math.max(28, l * 0.45));

  // Variantes dk/lt de la principale
  const wineDk = hslToHex(h, s, Math.max(l - 16, 3));
  const wineLt = hslToHex(h, s, Math.min(l + 14, 80));

  return { gold, goldLt, olive, cream, creamDk, dark, darkMd, text, textLt, wineDk, wineLt };
}

// Génère une palette dress code harmonieuse
function generateDressCodePalette(mainHex) {
  const [h, s, l] = hexToHSL(mainHex);
  const ps = Math.min(s * 0.55, 45);
  const pl = Math.min(Math.max(l + 28, 68), 84);
  return [
    { nom: 'Teinte principale',   hex: hslToHex(h,      ps, pl),                     eviter: false },
    { nom: 'Teinte analogique',   hex: hslToHex(h + 28, ps, pl),                     eviter: false },
    { nom: 'Teinte analogique 2', hex: hslToHex(h - 28, ps, pl),                     eviter: false },
    { nom: 'Champagne',           hex: hslToHex(38, 45, 76),                          eviter: false },
    { nom: 'Ivoire',              hex: hslToHex(h, Math.min(s*0.1,8), 91),            eviter: false },
    { nom: 'Blanc',               hex: '#F7F5F2',                                     eviter: true  },
    { nom: 'Complémentaire vif',  hex: hslToHex((h+180)%360, Math.min(s,65), Math.min(l,52)), eviter: true },
  ];
}

// ── CHARGEMENT ASSETS TEMPLATE ──
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
    document.getElementById('drop-status').textContent = 'Prêt · glisser un config.js';
  } catch (e) {
    document.getElementById('drop-status').textContent =
      '⚠️ Erreur chargement template — serveur requis';
  }
}

// ── CONSTRUCTION DU BLOB HTML ──
function buildPreviewHTML(m) {
  if (!templateHTML || !templateCSS || !templateJS) return null;

  let html = templateHTML;

  // 0. Base href → tous les chemins relatifs pointent vers /template/ sur le serveur
  const baseTag = `<base href="http://localhost:3003/template/" />`;
  html = html.replace('<head>', '<head>\n  ' + baseTag);

  // 1. CSS inline
  html = html.replace(
    /<link[^>]+href=["']style\.css["'][^>]*>/,
    `<style>${templateCSS}</style>`
  );

  // 2. Remplacer le lien Google Fonts par les polices sélectionnées du thème
  const serif = m.theme?.font_serif || 'Cormorant Garamond';
  const sans  = m.theme?.font_sans  || 'Montserrat';
  const serifParam = FONTS.serif[serif] || FONTS.serif['Cormorant Garamond'];
  const sansParam  = FONTS.sans[sans]   || FONTS.sans['Montserrat'];
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${serifParam}&family=${sansParam}&display=swap`;
  html = html.replace(
    /<link[^>]+fonts\.googleapis\.com[^>]*>/g,
    `<link href="${fontsUrl}" rel="stylesheet" />`
  );

  // 3. Injection thème CSS complet
  const th = m.theme || {};
  const w  = th.wine    || '#6B2737';
  const [wH, wS, wL] = hexToHSL(w);
  const themeStyle = `<style>
:root {
  --wine:    ${w};
  --wine-dk: ${th.wine_dk  || hslToHex(wH, wS, Math.max(wL-16, 3))};
  --wine-lt: ${th.wine_lt  || hslToHex(wH, wS, Math.min(wL+14, 80))};
  --gold:    ${th.gold     || '#C9A96E'};
  --gold-lt: ${th.gold_lt  || '#D9BC8A'};
  --olive:   ${th.olive    || '#7D8C4F'};
  --cream:   ${th.cream    || '#F5F0E8'};
  --cream-dk:${th.cream_dk || '#EDE6D5'};
  --dark:    ${th.dark     || '#1C0A06'};
  --dark-md: ${th.dark_md  || '#2C1510'};
  --text:    ${th.text     || '#3D1F0F'};
  --text-lt: ${th.text_lt  || '#7A4F3A'};
  --serif: '${serif}', Georgia, serif;
  --sans:  '${sans}', system-ui, sans-serif;
}
</style>`;
  html = html.replace('</head>', themeStyle + '\n</head>');

  // 4. Supprimer scripts locaux
  html = html.replace(/<script[^>]+src=["'](supabase-config|config|script)\.js["'][^>]*><\/script>/g, '');

  // 5. Injection données + code template
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
</script>
<script>
// DOMContentLoaded a déjà tiré dans le contexte Blob
if (typeof hydrate      === 'function') hydrate();
if (typeof setupVideo   === 'function') setupVideo();
if (typeof initBandeau  === 'function') initBandeau();
if (typeof initMap      === 'function') initMap();
if (typeof initLoader   === 'function') initLoader();
const _langs = (typeof MARIAGE !== 'undefined' && MARIAGE.langues) || ['fr'];
const _ls = document.getElementById('lang-switch');
if (_ls) _ls.style.display = _langs.length <= 1 ? 'none' : '';
</script>`;

  html = html.replace('</body>', injection + '\n</body>');
  return html;
}

// ── AFFICHAGE PREVIEW ──
function showPreview(m) {
  const html = buildPreviewHTML(m);
  if (!html) return;

  if (currentBlobUrl) { URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null; }

  dropZone.classList.add('hidden');
  previewLoading.style.display = 'flex';
  iframe.style.display = 'none';

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  currentBlobUrl = url;

  const revealIframe = () => {
    previewLoading.style.display = 'none';
    iframe.style.display = 'block';
    setTimeout(() => { if (currentBlobUrl) { URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null; } }, 1000);
  };

  const fallback = setTimeout(revealIframe, 6000);
  iframe.onload  = () => { clearTimeout(fallback); revealIframe(); };
  iframe.onerror = () => { clearTimeout(fallback); revealIframe(); };

  iframe.src = url;
  currentMARIAGE = m;
  topbarClient.innerHTML = `<span>${m.prenom1} &amp; ${m.prenom2}</span> — ${m.date_affichage}`;
  btnExport.disabled = false;
  btnSave.disabled   = false;
}

// ── PARSE config.js ──
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

// ── PEUPLER LE FORMULAIRE ──
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
  set('s_video_type',     m.video_hero ? m.video_hero.type : 'none');
  set('s_video_src',      m.video_hero ? m.video_hero.src  : '');
  set('s_rsvp_intro',     m.rsvp_intro);

  renderDressColors(m.dress_couleurs || []);

  // Photos
  const setPhoto = (selectId, thumbId, val) => {
    const sel = document.getElementById(selectId);
    if (sel && val) {
      // Extraire le nom de fichier si c'est un chemin complet
      const filename = val.split('/').pop();
      const opt = [...sel.options].find(o => o.value === filename);
      if (opt) sel.value = filename;
      else sel.value = '';
      updatePhotoThumb(selectId, thumbId);
    }
  };
  setPhoto('s_photo_couple',    'thumb_couple',    m.photo_couple);
  set('s_photo_couple_caption', m.photo_couple_caption);
  // Ambiances depuis photos_ambiance
  const amb = m.photos_ambiance || [];
  setPhoto('s_photo_ambiance_0', 'thumb_ambiance_0', amb[0]?.src);
  setPhoto('s_photo_ambiance_1', 'thumb_ambiance_1', amb[1]?.src);
  setPhoto('s_photo_ambiance_2', 'thumb_ambiance_2', amb[2]?.src);

  // Thème
  const th = m.theme || {};
  const colorIds = ['wine','wine_dk','wine_lt','gold','gold_lt','olive','cream','cream_dk','dark','dark_md','text','text_lt'];
  colorIds.forEach(k => { const el = document.getElementById('t_'+k); if (el && th[k]) el.value = th[k]; });

  // Typo
  if (th.font_serif) set('t_font_serif', th.font_serif);
  if (th.font_sans)  set('t_font_sans',  th.font_sans);

  updateFontPreview();
}

// ── LIRE LE FORMULAIRE ──
function readFormIntoMARIAGE() {
  if (!currentMARIAGE) return null;
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const m = JSON.parse(JSON.stringify(currentMARIAGE));

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
  const bv = v('s_bandeau');
  m.bandeau        = bv ? bv.split(',').map(s => s.trim()).filter(Boolean) : [];
  m.dress_intro    = v('s_dress_intro');
  m.dress_couleurs = readDressColors();

  // Photos
  m.photo_couple         = v('s_photo_couple') || null;
  m.photo_couple_caption = v('s_photo_couple_caption') || m.photo_couple_caption || '';
  // photos_ambiance : tableau [{src, position}]
  m.photos_ambiance = ['ambiance_0','ambiance_1','ambiance_2'].map(key => {
    const file = v(`s_photo_${key}`);
    return file ? { src: file, position: 'center center' } : null;
  });
  m.video_hero     = { type: v('s_video_type') || 'none', src: v('s_video_src') || '' };
  m.rsvp_intro     = v('s_rsvp_intro');

  // Thème complet
  m.theme = {
    wine:       v('t_wine'),
    wine_dk:    v('t_wine_dk'),
    wine_lt:    v('t_wine_lt'),
    gold:       v('t_gold'),
    gold_lt:    v('t_gold_lt'),
    olive:      v('t_olive'),
    cream:      v('t_cream'),
    cream_dk:   v('t_cream_dk'),
    dark:       v('t_dark'),
    dark_md:    v('t_dark_md'),
    text:       v('t_text'),
    text_lt:    v('t_text_lt'),
    font_serif: v('t_font_serif'),
    font_sans:  v('t_font_sans'),
  };

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
  const filename = `config-${(m.prenom1||'p1').toLowerCase()}-${(m.prenom2||'p2').toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ── MINIATURES PHOTOS ──
const BASE_PHOTO = 'http://localhost:3003/template/';

function updatePhotoThumb(selectId, thumbId) {
  const val   = document.getElementById(selectId)?.value;
  const thumb = document.getElementById(thumbId);
  if (!thumb) return;
  if (val) {
    thumb.innerHTML = `<img src="${BASE_PHOTO}${val}" alt="" />`;
  } else {
    thumb.innerHTML = '';
  }
}

['couple','ambiance_0','ambiance_1','ambiance_2'].forEach(key => {
  const sel = document.getElementById(`s_photo_${key}`);
  if (sel) sel.addEventListener('change', () => updatePhotoThumb(`s_photo_${key}`, `thumb_${key}`));
});

// ── APERÇU TYPO DANS LE STUDIO ──
let studioFontLink = null;

function updateFontPreview() {
  const serif = document.getElementById('t_font_serif').value;
  const sans  = document.getElementById('t_font_sans').value;
  const serifParam = FONTS.serif[serif] || FONTS.serif['Cormorant Garamond'];
  const sansParam  = FONTS.sans[sans]   || FONTS.sans['Montserrat'];
  const url = `https://fonts.googleapis.com/css2?family=${serifParam}&family=${sansParam}&display=swap`;

  if (studioFontLink) studioFontLink.remove();
  studioFontLink = document.createElement('link');
  studioFontLink.rel = 'stylesheet';
  studioFontLink.href = url;
  document.head.appendChild(studioFontLink);

  document.getElementById('fp_serif').style.fontFamily = `'${serif}', Georgia, serif`;
  document.getElementById('fp_sans').style.fontFamily  = `'${sans}', system-ui, sans-serif`;
}

// ── DRESS CODE ──
function renderDressColors(couleurs) {
  const list = document.getElementById('dress-colors-list');
  list.innerHTML = '';
  couleurs.forEach(c => {
    const row = document.createElement('div');
    row.className = 'color-row';
    row.innerHTML = `
      <input type="color" value="${c.hex || '#cccccc'}" data-field="hex" />
      <input type="text" placeholder="Nom" value="${c.nom || ''}" data-field="nom" />
      <label class="eviter-label"><input type="checkbox" data-field="eviter" ${c.eviter ? 'checked' : ''} /> Éviter</label>
      <button class="btn-rm" title="Supprimer">×</button>`;
    row.querySelector('.btn-rm').addEventListener('click', () => row.remove());
    list.appendChild(row);
  });
}

function readDressColors() {
  return [...document.querySelectorAll('#dress-colors-list .color-row')].map(row => ({
    hex:    row.querySelector('[data-field="hex"]').value,
    nom:    row.querySelector('[data-field="nom"]').value.trim(),
    eviter: row.querySelector('[data-field="eviter"]').checked,
  })).filter(c => c.nom || c.hex !== '#cccccc');
}

// ── DRAG & DROP (fichier) ──
rightPanel.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
rightPanel.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
rightPanel.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file || !file.name.endsWith('.js')) { alert('Déposez un fichier .js'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
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
  reader.onload = ev => {
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
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const stub = {
    prenom1: v('s_prenom1') || 'Prénom 1', nom1: v('s_nom1') || '',
    prenom2: v('s_prenom2') || 'Prénom 2', nom2: v('s_nom2') || '',
    date_affichage: v('s_date_affichage') || 'Date à définir',
    date_iso: v('s_date_iso') || '2025-01-01T14:00:00',
    rsvp_deadline: v('s_rsvp_deadline') || null,
    domaine: v('s_domaine') || '', ville: v('s_ville') || '',
    email: v('s_email') || '', whatsapp: v('s_whatsapp') || null,
    langues: ['fr'], photo_couple: null, photo_couple_caption: '',
    hero_intro: v('s_hero_intro') || 'Vous êtes invités au mariage de',
    hero_cta: v('s_hero_cta') || 'Confirmer ma présence',
    scroll_label: 'Découvrir', citation: v('s_citation'),
    sr_line1: 'Avant ce jour,', sr_line2: "notre histoire s'écrivait",
    bandeau: (() => { const b=v('s_bandeau'); return b?b.split(',').map(s=>s.trim()).filter(Boolean):[]; })(),
    histoire_eyebrow:'', histoire_titre:'Notre Histoire',
    histoire:[{annee:'',titre:'',texte:'',align:'left'}],
    programme_eyebrow:'', programme_titre:'Le Jour J',
    programme:[{heure:'',icon:'💍',titre:'',lieu:''}],
    galerie_eyebrow:'', galerie_titre:'Le Domaine', galerie_hint:'',
    galerie:[{icon:'🏰',label:'',photo:null}],
    lieux_eyebrow:'Où nous rejoindre', lieux_titre:'Les Lieux',
    lieux:[{icon:'🏰',type:'',nom:'',adresse:[],featured:true,badge:'Lieu principal',btn:{label:'Voir sur la carte',href:'#map'}}],
    carte:{lat:null,lng:null,zoom:14,nom:'',adresse:[],caption:''},
    dress_eyebrow:"Pour l'occasion", dress_titre:'Code Vestimentaire',
    dress_intro:v('s_dress_intro'), dress_couleurs:readDressColors(),
    infos_eyebrow:"Tout ce qu'il faut savoir", infos_titre:'Infos Pratiques', infos:[],
    faq_titre:'Questions fréquentes', faq:[],
    video_hero:{type:v('s_video_type')||'none',src:v('s_video_src')||''},
    rsvp_titre:'Confirmer votre présence', rsvp_intro:v('s_rsvp_intro'),
    i18n:{},
    theme: {
      wine:v('t_wine'), wine_dk:v('t_wine_dk'), wine_lt:v('t_wine_lt'),
      gold:v('t_gold'), gold_lt:v('t_gold_lt'), olive:v('t_olive'),
      cream:v('t_cream'), cream_dk:v('t_cream_dk'),
      dark:v('t_dark'), dark_md:v('t_dark_md'),
      text:v('t_text'), text_lt:v('t_text_lt'),
      font_serif:v('t_font_serif'), font_sans:v('t_font_sans'),
    },
  };
  currentMARIAGE = stub;
  btnSave.disabled = false;
  showPreview(stub);
});

// ── BOUTONS GÉNÉRATION ──
document.getElementById('btn-gen-theme').addEventListener('click', () => {
  const p = generateThemePalette(document.getElementById('t_wine').value);
  document.getElementById('t_wine_dk').value  = p.wineDk;
  document.getElementById('t_wine_lt').value  = p.wineLt;
  document.getElementById('t_gold').value     = p.gold;
  document.getElementById('t_gold_lt').value  = p.goldLt;
  document.getElementById('t_olive').value    = p.olive;
  document.getElementById('t_cream').value    = p.cream;
  document.getElementById('t_cream_dk').value = p.creamDk;
  document.getElementById('t_dark').value     = p.dark;
  document.getElementById('t_dark_md').value  = p.darkMd;
  document.getElementById('t_text').value     = p.text;
  document.getElementById('t_text_lt').value  = p.textLt;
});

document.getElementById('btn-gen-dress').addEventListener('click', () => {
  renderDressColors(generateDressCodePalette(document.getElementById('t_wine').value));
});

document.getElementById('btn-add-dress-color').addEventListener('click', () => {
  renderDressColors([...readDressColors(), { hex: '#cccccc', nom: '', eviter: false }]);
});

// ── FONT SELECTORS → APERÇU TEMPS RÉEL ──
document.getElementById('t_font_serif').addEventListener('change', updateFontPreview);
document.getElementById('t_font_sans').addEventListener('change',  updateFontPreview);

// ── SAVE & EXPORT ──
btnSave.addEventListener('click',   () => { const m = readFormIntoMARIAGE(); if (m) showPreview(m); });
btnExport.addEventListener('click', exportConfig);

// ── INIT ──
loadTemplateAssets();
updateFontPreview();
