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

// ── SÉLECTION TEMPLATE VIA DOSSIER ──
let templateDirHandle = null;

async function pickTemplate() {
  if (!window.showDirectoryPicker) {
    alert('Votre navigateur ne supporte pas la sélection de dossier.\nUtilisez Chrome ou Edge.');
    return;
  }
  try {
    const dir = await window.showDirectoryPicker({ mode: 'read' });
    templateDirHandle = dir;

    const readFile = async (name) => {
      const fh = await dir.getFileHandle(name);
      const f  = await fh.getFile();
      return f.text();
    };

    const [html, css, js] = await Promise.all([
      readFile('index.html'),
      readFile('style.css'),
      readFile('script.js'),
    ]);

    templateHTML = html;
    templateCSS  = css;
    templateJS   = js;

    document.getElementById('btn-template').textContent = `📁 ${dir.name}`;
    document.getElementById('drop-status').textContent  = 'Prêt · glisser un config.js';
  } catch (e) {
    if (e.name !== 'AbortError') {
      document.getElementById('drop-status').textContent = '⚠️ Impossible de lire le dossier';
      console.error(e);
    }
  }
}

// ── CONSTRUCTION DU BLOB HTML ──
function buildPreviewHTML(m) {
  if (!templateHTML || !templateCSS || !templateJS) return null;

  let html = templateHTML;

  // 0. Base href supprimée — les assets sont résolus via blob URLs ou ignorés

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

// ── BOUTON TEMPLATE ──
document.getElementById('btn-template').addEventListener('click', pickTemplate);

// ── ONGLETS FORMULE ──
const FORMULE_TABS = document.querySelectorAll('.formule-tab');

function applyFormuleTab(formule) {
  FORMULE_TABS.forEach(t => t.classList.toggle('active', t.dataset.tab === formule));
  document.querySelectorAll('.panel-section[data-formule]').forEach(sec => {
    const allowed = sec.dataset.formule.split(',');
    sec.classList.toggle('formule-hidden', !allowed.includes(formule));
  });
}

FORMULE_TABS.forEach(tab => {
  tab.addEventListener('click', () => applyFormuleTab(tab.dataset.tab));
});

// ── THÈME PAR PROMPT ──
// ── CARTE SÉMANTIQUE COULEURS ──
// Chaque entrée : mot (normalisé, sans accents) → hex
// Priorité : plus spécifique en premier
const WORD_COLORS = {
  // ── Couleurs nommées (fr + en) ──
  'rouge':        '#B02030', 'red':          '#B02030',
  'rose':         '#9E4D6A', 'pink':         '#9E4D6A',
  'bleu':         '#2A5A8B', 'blue':         '#2A5A8B',
  'vert':         '#2E6B47', 'green':        '#2E6B47',
  'violet':       '#5E3A8B', 'purple':       '#5E3A8B',
  'jaune':        '#B09030', 'yellow':       '#B09030',
  'orange':       '#B0602A', 'corail':       '#B5503A',
  'coral':        '#B5503A', 'or':           '#8B6B2A',
  'gold':         '#8B6B2A', 'dore':         '#8B6B2A',
  'dore':         '#8B6B2A', 'argent':       '#6A7080',
  'silver':       '#6A7080', 'blanc':        '#8A7A5A',
  'white':        '#8A7A5A', 'noir':         '#2A2535',
  'black':        '#2A2535', 'gris':         '#5A6070',
  'grey':         '#5A6070', 'gray':         '#5A6070',
  'beige':        '#8A7050', 'ivoire':       '#8A7A50',
  'ivory':        '#8A7A50', 'creme':        '#8A7050',
  'cream':        '#8A7050', 'taupe':        '#7A6050',
  'bordeaux':     '#6B2737', 'burgundy':     '#6B2737',
  'bordeaux':     '#6B2737', 'prune':        '#5A2A4A',
  'mauve':        '#7A5070', 'lavande':      '#5E4B8B',
  'lavender':     '#5E4B8B', 'lilas':        '#7A5A80',
  'lilac':        '#7A5A80', 'turquoise':    '#2D8B7A',
  'teal':         '#2D7A7A', 'emeraude':     '#2A7A50',
  'emerald':      '#2A7A50', 'saphir':       '#2A3A8B',
  'sapphire':     '#2A3A8B', 'rubis':        '#8B2040',
  'ruby':         '#8B2040', 'ocre':         '#9E6B2A',
  'ochre':        '#9E6B2A', 'terracotta':   '#9E5A2E',
  'brun':         '#7A4B2A', 'marron':       '#7A4B2A',
  'brown':        '#7A4B2A', 'chocolat':     '#5A3020',
  'chocolate':    '#5A3020', 'caramel':      '#9A6030',
  'miel':         '#9E7B3A', 'honey':        '#9E7B3A',
  'peche':        '#A06850', 'peach':        '#A06850',
  'saumon':       '#A05A48', 'salmon':       '#A05A48',
  'indigo':       '#3A4A8B', 'marine':       '#1A3A6A',
  'navy':         '#1A3A6A', 'cobalt':       '#2A4A8B',
  'sage':         '#5A7A50', 'kaki':         '#6A7040',
  'khaki':        '#6A7040', 'olive':        '#5A6830',
  'foret':        '#2E6B47', 'forest':       '#2E6B47',
  'champagne':    '#8B6B3A', 'dore':         '#8B6B2A',

  // ── Fleurs & nature ──
  'roses':        '#9E4D6A', 'pivoines':     '#A05070',
  'pivoine':      '#A05070', 'peonies':      '#A05070',
  'orchidee':     '#7A4080', 'orchid':       '#7A4080',
  'jasmin':       '#C9A96E', 'jasmine':      '#C9A96E',
  'lilas':        '#7A5A80', 'wisteria':     '#6A5080',
  'glycine':      '#6A5080', 'dahlia':       '#8B3A50',
  'tulipe':       '#9A4060', 'tulip':        '#9A4060',
  'muguet':       '#4A8A60', 'lily':         '#C9A96E',
  'lys':          '#C9A96E', 'lotus':        '#8A5060',
  'bambou':       '#4A7A40', 'bamboo':       '#4A7A40',
  'cerisier':     '#9E5870', 'cherry':       '#9E5870',
  'sakura':       '#9E5870', 'eucalyptus':   '#5A7A65',
  'verdure':      '#4A7040', 'fougere':      '#3A6A40',
  'fern':         '#3A6A40', 'moss':         '#4A6A35',
  'mousse':       '#4A6A35', 'lierre':       '#3A6035',
  'vigne':        '#6A4035', 'vigne':        '#6A4035',

  // ── Saisons & météo ──
  'printemps':    '#7A8A40', 'spring':       '#7A8A40',
  'ete':          '#B0602A', 'summer':       '#B0602A',
  'automne':      '#9E5A2E', 'autumn':       '#9E5A2E',
  'fall':         '#9E5A2E', 'hiver':        '#4A5A70',
  'winter':       '#4A5A70', 'neige':        '#5A6A80',
  'snow':         '#5A6A80', 'givre':        '#4A6070',
  'pluie':        '#4A6080', 'rain':         '#4A6080',
  'soleil':       '#B09030', 'sun':          '#B09030',
  'coucher':      '#B0502A', 'sunset':       '#B0502A',
  'aurore':       '#B06050', 'dawn':         '#B06050',
  'nuit':         '#1A2040', 'night':        '#1A2040',
  'etoiles':      '#2A2A5A', 'stars':        '#2A2A5A',
  'lune':         '#4A5070', 'moon':         '#4A5070',
  'crepuscule':   '#5A3060', 'dusk':         '#5A3060',
  'brume':        '#5A6A70', 'mist':         '#5A6A70',
  'brouillard':   '#5A6A70', 'fog':          '#5A6A70',

  // ── Lieux & géographie ──
  'paris':        '#4A3A5A', 'france':       '#4A3A5A',
  'versailles':   '#5A4A2A', 'provence':     '#5E4B8B',
  'cote':         '#2A6A8B', 'mediteranee':  '#2A6A8B',
  'bord':         '#2A6A8B', 'ocean':        '#2A5A8B',
  'mer':          '#2A6B8B', 'sea':          '#2A6B8B',
  'plage':        '#8A6A40', 'beach':        '#8A6A40',
  'jardin':       '#3A6A40', 'garden':       '#3A6A40',
  'chateau':      '#6A5040', 'castle':       '#6A5040',
  'toscane':      '#9A5535', 'tuscany':      '#9A5535',
  'italie':       '#9A5535', 'italy':        '#9A5535',
  'grece':        '#2A7A8B', 'greece':       '#2A7A8B',
  'santorini':    '#2A7A8B', 'mykonos':      '#2A7A8B',
  'marrakech':    '#9E4A2A', 'maroc':        '#9E4A2A',
  'morocco':      '#9E4A2A', 'bali':         '#7A5A30',
  'indonesie':    '#7A5A30', 'hawaii':       '#2A7A6A',
  'tokyo':        '#9E5870', 'japon':        '#9E5870',
  'japan':        '#9E5870', 'venise':       '#2A5A7A',
  'venice':       '#2A5A7A', 'new york':     '#4A5060',
  'irlande':      '#3A7A40', 'ireland':      '#3A7A40',
  'ecosse':       '#3A5A70', 'scotland':     '#3A5A70',
  'andalousie':   '#9E602A', 'espagne':      '#9E602A',
  'colombie':     '#2A8B5A', 'mexique':      '#B05A30',

  // ── Styles & époques ──
  'art deco':     '#7A5A2A', 'deco':         '#7A5A2A',
  'art nouveau':  '#4A6A40', 'nouveau':      '#4A6A40',
  'baroque':      '#6B2737', 'renaissance':  '#7A3030',
  'victorien':    '#4A3060', 'victorian':    '#4A3060',
  'medieval':     '#5A4035', 'antique':      '#7A5A35',
  'vintage':      '#5A7080', 'retro':        '#8A5A40',
  'scandinave':   '#4A5468', 'nordic':       '#4A5468',
  'japandi':      '#5A5040', 'wabi':         '#6A6050',
  'boheme':       '#8B5E3C', 'boho':         '#8B5E3C',
  'rustique':     '#7A4B2A', 'rustic':       '#7A4B2A',
  'champetre':    '#7A4B2A', 'campagne':     '#7A4B2A',
  'romantique':   '#9E4D6A', 'romantic':     '#9E4D6A',
  'moderne':      '#3A4A5E', 'modern':       '#3A4A5E',
  'minimaliste':  '#5A5A60', 'minimal':      '#5A5A60',
  'luxe':         '#6B2737', 'luxury':       '#6B2737',
  'elegant':      '#6B2737', 'elegance':     '#6B2737',
  'tropical':     '#B5453A', 'exotique':     '#2A7A6A',
  'exotic':       '#2A7A6A', 'colonial':     '#7A5530',
  'oriental':     '#8B3A30', 'africain':     '#9A5020',
  'africaine':    '#9A5020', 'celtique':     '#3A5A45',

  // ── Matières & textures ──
  'velours':      '#5A2A4A', 'velvet':       '#5A2A4A',
  'soie':         '#C9A96E', 'silk':         '#C9A96E',
  'dentelle':     '#8A7A60', 'lace':         '#8A7A60',
  'lin':          '#8A7050', 'linen':        '#8A7050',
  'bois':         '#7A4B2A', 'wood':         '#7A4B2A',
  'marbre':       '#7A7A80', 'marble':       '#7A7A80',
  'pierre':       '#6A6A70', 'stone':        '#6A6A70',
  'ardoise':      '#4A5A60', 'slate':        '#4A5A60',
  'cuivre':       '#9A5A30', 'copper':       '#9A5A30',
  'bronze':       '#8A6030', 'laiton':       '#9A7A30',
  'brass':        '#9A7A30', 'acier':        '#5A6070',
  'steel':        '#5A6070', 'verre':        '#4A6A80',
  'cristal':      '#4A6A80', 'crystal':      '#4A6A80',
  'nacre':        '#8A8070', 'pearl':        '#8A8070',
  'sable':        '#9A8060', 'sand':         '#9A8060',
  'paille':       '#A09050', 'straw':        '#A09050',
  'feuille':      '#3A6A40', 'leaf':         '#3A6A40',

  // ── Ambiances & émotions ──
  'mystere':      '#2A2040', 'mystery':      '#2A2040',
  'magie':        '#4A2A6A', 'magic':        '#4A2A6A',
  'feerique':     '#6A4A8A', 'fairy':        '#6A4A8A',
  'enchante':     '#4A6A5A', 'enchanted':    '#4A6A5A',
  'intime':       '#6A3A40', 'intimate':     '#6A3A40',
  'festif':       '#B05A30', 'festive':      '#B05A30',
  'doux':         '#9A6070', 'soft':         '#9A6070',
  'serein':       '#4A6A80', 'serene':       '#4A6A80',
  'grandiose':    '#5A3A2A', 'grand':        '#5A3A2A',
  'poétique':     '#5A4A6A', 'poetique':     '#5A4A6A',
  'sauvage':      '#4A5A35', 'wild':         '#4A5A35',
  'solaire':      '#B08030', 'sunny':        '#B08030',
  'lumineux':     '#B09030', 'bright':       '#B09030',
  'sombre':       '#2A2A3A', 'dark':         '#2A2A3A',
  'pastel':       '#8A6A7A', 'doux':         '#8A6A7A',
};

// ── Règles typographiques ──
const FONT_RULES = [
  { mots: ['moderne','minimal','contemporain','epure','scandinave','nordic','japandi','acier','verre','geometrique'],
    serif: 'Bodoni Moda',        sans: 'DM Sans' },
  { mots: ['baroque','victorien','medieval','renaissance','antique','grandiose','luxe','velours','royal'],
    serif: 'EB Garamond',        sans: 'Raleway' },
  { mots: ['boheme','boho','rustique','champetre','campagne','lin','paille','grange','libre'],
    serif: 'Lora',               sans: 'Josefin Sans' },
  { mots: ['vintage','retro','art deco','deco','cuivre','bronze','laiton'],
    serif: 'Libre Baskerville',  sans: 'Josefin Sans' },
  { mots: ['romantique','rose','floral','pivoines','dentelle','doux','intime','feerique','poetique','magie'],
    serif: 'Cormorant Garamond', sans: 'Raleway' },
  { mots: ['tropical','exotique','festif','couleur','hawaii','bali','mexique'],
    serif: 'Playfair Display',   sans: 'Montserrat' },
  { mots: ['nature','foret','jardin','vegetal','sauvage','fougere','mousse','bambou','eucalyptus'],
    serif: 'EB Garamond',        sans: 'DM Sans' },
];

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Hash déterministe → couleur plausible (fallback pour tout thème inconnu)
function textToHashColor(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(31, h) + text.charCodeAt(i) | 0;
  }
  const hu = Math.abs(h);
  const hue = hu % 360;
  const sat = 30 + (hu >> 8 & 0xff) % 30;   // 30–60 %
  const lig = 22 + (hu >> 16 & 0xff) % 18;  // 22–40 % (sombre = élégant)
  return hslToHex(hue, sat, lig);
}

function applyThemeColors(hex, serif, sans) {
  document.getElementById('t_wine').value = hex;
  const p = generateThemePalette(hex);
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
  if (serif) document.getElementById('t_font_serif').value = serif;
  if (sans)  document.getElementById('t_font_sans').value  = sans;
  updateFontPreview();
}

function resolveTheme(text) {
  const n = normalize(text);
  // Tokens filtrés : min 3 chars pour éviter les faux positifs ("a", "en"…)
  const tokens = n.split(/[\s,;.!?'-]+/).filter(t => t.length >= 3);

  let hex = null;

  // 1. Clés multi-mots d'abord ("art deco", "new york"…)
  for (const [key, val] of Object.entries(WORD_COLORS)) {
    if (key.includes(' ') && n.includes(key)) { hex = val; break; }
  }

  // 2. Correspondance exacte par token
  if (!hex) {
    for (const token of tokens) {
      if (WORD_COLORS[token]) { hex = WORD_COLORS[token]; break; }
    }
  }

  // 3. Préfixe : "romantiques" → "romantique", "etoiles" → "etoiles"
  if (!hex) {
    outer: for (const token of tokens) {
      for (const [key] of Object.entries(WORD_COLORS)) {
        if (token.startsWith(key) || key.startsWith(token)) {
          hex = WORD_COLORS[key]; break outer;
        }
      }
    }
  }

  // 4. Hash déterministe (tout thème libre)
  if (!hex) hex = textToHashColor(n);

  // Police : première règle qui matche dans le texte complet
  let serif = null, sans = null;
  for (const rule of FONT_RULES) {
    if (rule.mots.some(m => n.includes(m))) {
      serif = rule.serif; sans = rule.sans; break;
    }
  }

  return { hex, serif: serif || 'Cormorant Garamond', sans: sans || 'Montserrat' };
}

function applyThemePrompt(text) {
  const { hex, serif, sans } = resolveTheme(text);
  applyThemeColors(hex, serif, sans);
}

document.getElementById('btn-gen-prompt').addEventListener('click', () => {
  const text = document.getElementById('t_theme_prompt').value.trim();
  if (text) applyThemePrompt(text);
});
document.getElementById('t_theme_prompt').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-gen-prompt').click();
});

// ── INIT ──
updateFontPreview();
applyFormuleTab('standard');
