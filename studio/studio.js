'use strict';

// ── FONTS ──
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

// ── COLOR UTILITIES ──
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){ case r: h=((g-b)/d+(g<b?6:0))/6; break; case g: h=((b-r)/d+2)/6; break; case b: h=((r-g)/d+4)/6; break; }
  }
  return [h*360, s*100, l*100];
}
function hslToHex(h,s,l) {
  h=((h%360)+360)%360; s=Math.max(0,Math.min(100,s))/100; l=Math.max(0,Math.min(100,l))/100;
  const a=s*Math.min(l,1-l), f=n=>{const k=(n+h/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');};
  return `#${f(0)}${f(8)}${f(4)}`;
}
function generateThemePalette(mainHex) {
  const [h,s,l]=hexToHSL(mainHex);
  const goldH=(h+38)%360, goldS=Math.max(30,Math.min(s*0.65,55)), goldL=Math.max(55,Math.min(l+22,72));
  return {
    gold:    hslToHex(goldH,goldS,goldL),
    goldLt:  hslToHex(goldH,goldS*0.85,Math.min(goldL+12,88)),
    olive:   hslToHex((h+80)%360,Math.min(s*0.7,45),Math.min(l+18,60)),
    cream:   hslToHex(h,Math.min(s*0.1,10),93),
    creamDk: hslToHex(h,Math.min(s*0.12,12),88),
    dark:    hslToHex(h,Math.min(s*0.55,60),Math.max(4,l*0.1)),
    darkMd:  hslToHex(h,Math.min(s*0.5,55),Math.max(7,l*0.16)),
    text:    hslToHex(h,Math.min(s*0.45,50),Math.max(12,l*0.22)),
    textLt:  hslToHex(h,Math.min(s*0.4,40),Math.max(28,l*0.45)),
    wineDk:  hslToHex(h,s,Math.max(l-16,3)),
    wineLt:  hslToHex(h,s,Math.min(l+14,80)),
  };
}

// ── STATE ──
let currentRow = null;

const $ = id => document.getElementById(id);
const v = id => { const el = $(id); return el ? el.value.trim() : ''; };

// ── TABS ──
document.querySelectorAll('.tabs-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs-nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    $('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ── TOPBAR NAV ──
$('btn-clients').addEventListener('click', () => location.href = 'clients.html');

$('btn-preview-nav').addEventListener('click', () => {
  const row = buildCurrentRow();
  if (!row) return;
  sessionStorage.setItem('wedoria_current', JSON.stringify(row));
  location.href = 'preview.html';
});

// ── TOPBAR LABEL ──
function updateTopbar() {
  const cfg = currentRow?.config || {};
  const couple = [cfg.prenom1, cfg.prenom2].filter(Boolean).join(' & ');
  const date   = cfg.date_affichage || '';
  $('topbar-client').textContent = couple
    ? `${couple}${date ? ' — ' + date : ''}`
    : 'Nouveau mariage';
}

// ── POPULATE INFOS ──
function populateInfos(cfg) {
  const set = (id, val) => { const el=$(id); if(el && val!=null) el.value=val; };
  set('s_prenom1',       cfg.prenom1);
  set('s_nom1',          cfg.nom1);
  set('s_prenom2',       cfg.prenom2);
  set('s_nom2',          cfg.nom2);
  set('s_date_affichage',cfg.date_affichage);
  set('s_date_iso',      cfg.date_iso);
  set('s_rsvp_deadline', cfg.rsvp_deadline || '');
  set('s_domaine',       cfg.domaine);
  set('s_ville',         cfg.ville);
  set('s_email',         cfg.email);
  set('s_whatsapp',      cfg.whatsapp || '');
  set('s_video_type',    cfg.video_hero?.type || 'none');
  set('s_video_src',     cfg.video_hero?.src  || '');
  set('s_rsvp_intro',    cfg.rsvp_intro || '');
}

// ── READ INFOS ──
function readInfos(cfg) {
  cfg.prenom1        = v('s_prenom1')        || cfg.prenom1  || '';
  cfg.nom1           = v('s_nom1')           || cfg.nom1     || '';
  cfg.prenom2        = v('s_prenom2')        || cfg.prenom2  || '';
  cfg.nom2           = v('s_nom2')           || cfg.nom2     || '';
  cfg.date_affichage = v('s_date_affichage') || cfg.date_affichage || '';
  cfg.date_iso       = v('s_date_iso')       || cfg.date_iso || '';
  cfg.rsvp_deadline  = v('s_rsvp_deadline')  || null;
  cfg.domaine        = v('s_domaine')        || cfg.domaine  || '';
  cfg.ville          = v('s_ville')          || cfg.ville    || '';
  cfg.email          = v('s_email')          || cfg.email    || '';
  cfg.whatsapp       = v('s_whatsapp')       || null;
  cfg.video_hero     = { type: v('s_video_type') || 'none', src: v('s_video_src') || '' };
  cfg.rsvp_intro     = v('s_rsvp_intro')     || '';
  return cfg;
}

// ── BUILD CURRENT ROW ──
function buildCurrentRow() {
  if (!currentRow) currentRow = { template: 'base', config: {} };
  const cfg = JSON.parse(JSON.stringify(currentRow.config || {}));
  readInfos(cfg);
  readContenu(cfg);
  readMedias(cfg);
  readTheme(cfg);
  cfg.template = readTemplate();
  currentRow.config   = cfg;
  currentRow.template = cfg.template;
  return currentRow;
}

// ── SAVE ──
$('btn-save').addEventListener('click', async () => {
  const row = buildCurrentRow();
  try {
    const saved = await saveMariage(row);
    currentRow = saved;
    updateTopbar();
    showToast();
  } catch (e) {
    alert('Erreur sauvegarde : ' + e.message);
  }
});

function showToast() {
  const el = $('save-feedback');
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2000);
}

// ── INIT ──
async function init() {
  const params = new URLSearchParams(location.search);
  const id     = params.get('id');
  buildContenuTab();
  buildMediasTab();
  buildThemeTab();
  buildTemplateTab();
  if (id) {
    try {
      currentRow = await getMariage(id);
      populateInfos(currentRow.config || {});
      populateContenu(currentRow.config || {});
      populateMedias(currentRow.config || {});
      populateTheme(currentRow.config || {});
      populateTemplate(currentRow.template || 'base');
      updateTopbar();
    } catch (e) {
      alert('Erreur chargement : ' + e.message);
    }
  }
}

init();

// ────────────────────────────────────────
// ONGLET CONTENU
// ────────────────────────────────────────

function makeListSection(containerId, title, fields) {
  const section = document.createElement('div');
  section.style.marginBottom = '1.5rem';
  section.innerHTML = `<h4 style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.06em">${title}</h4>
    <div class="list-items" id="${containerId}"></div>
    <button class="btn-add-item" data-container="${containerId}" data-fields='${JSON.stringify(fields)}'>+ Ajouter</button>`;
  return section;
}

function makeItemBlock(fields, values = {}) {
  const block = document.createElement('div');
  block.className = 'list-item';
  block.innerHTML = `<button class="btn-rm-item" title="Supprimer">×</button>` +
    fields.map(f => `
      <div class="field" style="margin-bottom:0.4rem">
        <label style="font-size:0.75rem;color:var(--text-dim)">${f.label}</label>
        ${f.type === 'textarea'
          ? `<textarea rows="2" data-field="${f.key}" style="width:100%">${values[f.key] || ''}</textarea>`
          : `<input type="${f.type||'text'}" data-field="${f.key}" value="${(values[f.key]||'').toString().replace(/"/g,'&quot;')}" style="width:100%" />`
        }
      </div>`).join('');
  block.querySelector('.btn-rm-item').addEventListener('click', () => block.remove());
  return block;
}

function addItemToList(containerId, fields, values = {}) {
  const container = $(containerId);
  if (container) container.appendChild(makeItemBlock(fields, values));
}

function readListItems(containerId, fields) {
  return [...($(containerId)?.querySelectorAll('.list-item') || [])].map(block => {
    const obj = {};
    fields.forEach(f => {
      const el = block.querySelector(`[data-field="${f.key}"]`);
      if (el) obj[f.key] = el.value;
    });
    return obj;
  });
}

const LISTE_DEFS = {
  histoire: {
    id: 'list-histoire', title: 'Histoire',
    fields: [
      { key: 'annee', label: 'Année',  type: 'text' },
      { key: 'titre', label: 'Titre',  type: 'text' },
      { key: 'texte', label: 'Texte',  type: 'textarea' },
      { key: 'align', label: 'Align (left/right)', type: 'text' },
    ],
  },
  programme: {
    id: 'list-programme', title: 'Programme',
    fields: [
      { key: 'heure', label: 'Heure',  type: 'text' },
      { key: 'icon',  label: 'Icône',  type: 'text' },
      { key: 'titre', label: 'Titre',  type: 'text' },
      { key: 'lieu',  label: 'Lieu',   type: 'text' },
    ],
  },
  galerie: {
    id: 'list-galerie', title: 'Galerie domaine',
    fields: [
      { key: 'icon',  label: 'Icône',  type: 'text' },
      { key: 'label', label: 'Label',  type: 'text' },
      { key: 'photo', label: 'Photo URL/chemin', type: 'text' },
    ],
  },
  lieux: {
    id: 'list-lieux', title: 'Lieux',
    fields: [
      { key: 'type',    label: 'Type (cérémonie/réception…)', type: 'text' },
      { key: 'nom',     label: 'Nom du lieu',                 type: 'text' },
      { key: 'adresse', label: 'Adresse (lignes séparées par |)', type: 'textarea' },
    ],
  },
  faq: {
    id: 'list-faq', title: 'FAQ',
    fields: [
      { key: 'q', label: 'Question', type: 'text' },
      { key: 'r', label: 'Réponse',  type: 'textarea' },
    ],
  },
  infos: {
    id: 'list-infos', title: 'Infos pratiques',
    fields: [
      { key: 'icon',  label: 'Icône', type: 'text' },
      { key: 'titre', label: 'Titre', type: 'text' },
      { key: 'texte', label: 'Texte', type: 'textarea' },
    ],
  },
};

function buildContenuTab() {
  const tab = $('tab-contenu');
  tab.innerHTML = '';
  Object.values(LISTE_DEFS).forEach(def => tab.appendChild(makeListSection(def.id, def.title, def.fields)));
  tab.addEventListener('click', e => {
    const btn = e.target.closest('.btn-add-item');
    if (!btn) return;
    addItemToList(btn.dataset.container, JSON.parse(btn.dataset.fields));
  });
}

function populateContenu(cfg) {
  Object.entries(LISTE_DEFS).forEach(([key, def]) => {
    (cfg[key] || []).forEach(item => {
      const vals = { ...item };
      if (Array.isArray(vals.adresse)) vals.adresse = vals.adresse.join('|');
      addItemToList(def.id, def.fields, vals);
    });
  });
}

function readContenu(cfg) {
  Object.entries(LISTE_DEFS).forEach(([key, def]) => {
    const items = readListItems(def.id, def.fields);
    if (key === 'lieux') {
      cfg[key] = items.map(item => ({
        ...item,
        adresse: (item.adresse || '').split('|').map(s => s.trim()).filter(Boolean),
      }));
    } else {
      cfg[key] = items;
    }
  });
}

// ────────────────────────────────────────
// ONGLET MÉDIAS
// ────────────────────────────────────────

const _mediaSlots = {};

function makeUploadSlot(labelText, fieldId) {
  const wrap = document.createElement('div');
  wrap.style.marginBottom = '1rem';
  wrap.innerHTML = `
    <label style="font-size:0.78rem;color:var(--text-dim);display:block;margin-bottom:0.3rem">${labelText}</label>
    <div class="upload-slot" id="slot-${fieldId}">
      <img class="upload-preview" id="prev-${fieldId}" alt="" />
      <div class="upload-drop" id="drop-${fieldId}">Glisser une photo ici ou cliquer</div>
      <input type="file" id="file-${fieldId}" accept="image/*" style="display:none" />
      <input type="text" class="upload-url" id="url-${fieldId}" placeholder="ou coller une URL / chemin" />
    </div>`;

  const drop      = wrap.querySelector(`#drop-${fieldId}`);
  const fileInput = wrap.querySelector(`#file-${fieldId}`);
  const urlInput  = wrap.querySelector(`#url-${fieldId}`);
  const preview   = wrap.querySelector(`#prev-${fieldId}`);

  function setUrl(url) {
    urlInput.value = url;
    preview.src = url;
    preview.classList.toggle('visible', !!url);
  }

  drop.addEventListener('click', () => fileInput.click());
  drop.addEventListener('dragover', e => e.preventDefault());
  drop.addEventListener('drop', async e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await handleUpload(fieldId, file, setUrl);
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (file) { await handleUpload(fieldId, file, setUrl); fileInput.value = ''; }
  });
  urlInput.addEventListener('input', () => setUrl(urlInput.value.trim()));

  return { wrap, setUrl };
}

async function handleUpload(fieldId, file, setUrl) {
  const slug = currentRow?.slug || 'nouveau';
  try {
    const url = await uploadPhoto(slug, file);
    setUrl(url);
  } catch (e) {
    alert('Erreur upload : ' + e.message);
  }
}

function buildMediasTab() {
  const tab = $('tab-medias');
  tab.innerHTML = '';

  [
    { id: 'photo_couple',     label: 'Photo couple' },
    { id: 'photo_ambiance_0', label: 'Ambiance 1' },
    { id: 'photo_ambiance_1', label: 'Ambiance 2' },
    { id: 'photo_ambiance_2', label: 'Ambiance 3' },
  ].forEach(({ id, label }) => {
    const { wrap, setUrl } = makeUploadSlot(label, id);
    _mediaSlots[id] = setUrl;
    tab.appendChild(wrap);
  });

  const h = document.createElement('h4');
  h.textContent = 'Galerie photos';
  h.style.cssText = 'font-size:0.8rem;color:var(--text-dim);margin:1rem 0 0.5rem;text-transform:uppercase;letter-spacing:0.06em';
  tab.appendChild(h);

  const galleryCnt = document.createElement('div');
  galleryCnt.id = 'gallery-photos-list';
  galleryCnt.className = 'list-items';
  tab.appendChild(galleryCnt);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-item';
  addBtn.textContent = '+ Ajouter photo galerie';
  addBtn.addEventListener('click', () => addGalleryPhoto());
  tab.appendChild(addBtn);
}

function addGalleryPhoto(url = '') {
  const cnt   = $('gallery-photos-list');
  const block = document.createElement('div');
  block.className = 'list-item';
  block.style.cssText = 'display:flex;gap:0.5rem;align-items:center';
  block.innerHTML = `
    <input type="text" data-field="src" value="${url.replace(/"/g,'&quot;')}" placeholder="URL ou chemin" style="flex:1" />
    <button class="btn-rm-item" style="position:static">×</button>`;
  block.querySelector('.btn-rm-item').addEventListener('click', () => block.remove());
  cnt.appendChild(block);
}

function populateMedias(cfg) {
  if (_mediaSlots['photo_couple']) _mediaSlots['photo_couple'](cfg.photo_couple || '');
  const amb = cfg.photos_ambiance || [];
  [0,1,2].forEach(i => {
    if (_mediaSlots[`photo_ambiance_${i}`]) _mediaSlots[`photo_ambiance_${i}`](amb[i]?.src || '');
  });
  (cfg.galerie_photos || []).forEach(p => addGalleryPhoto(p.src || p));
}

function readMedias(cfg) {
  const url = id => ($(`url-${id}`)?.value || '').trim();
  cfg.photo_couple    = url('photo_couple') || null;
  cfg.photos_ambiance = [0,1,2].map(i => {
    const src = url(`photo_ambiance_${i}`);
    return src ? { src, position: 'center center' } : null;
  }).filter(Boolean);
  cfg.galerie_photos  = [...($('gallery-photos-list')?.querySelectorAll('[data-field="src"]') || [])]
    .map(el => ({ src: el.value.trim() }))
    .filter(p => p.src);
}

// ────────────────────────────────────────
// ONGLET THÈME
// ────────────────────────────────────────

const COLOR_KEYS = ['wine','wine_dk','wine_lt','gold','gold_lt','olive','cream','cream_dk','dark','dark_md','text','text_lt'];
const COLOR_LABELS = {
  wine:'Principale', wine_dk:'Sombre', wine_lt:'Claire', gold:'Dorée', gold_lt:'Dorée claire',
  olive:'Olive', cream:'Fond clair', cream_dk:'Fond moyen', dark:'Fond sombre', dark_md:'Fond moyen sombre',
  text:'Texte', text_lt:'Texte clair',
};

function buildThemeTab() {
  const tab = $('tab-theme');
  tab.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.75rem;margin-bottom:1rem">
      ${COLOR_KEYS.map(k => `
        <div class="field">
          <label style="font-size:0.75rem;color:var(--text-dim)">${COLOR_LABELS[k]}</label>
          <div style="display:flex;gap:0.4rem;align-items:center">
            <input type="color" id="t_${k}" style="width:36px;height:28px;border:none;background:none;cursor:pointer;padding:0" />
            <input type="text" id="t_${k}_hex" maxlength="7" style="flex:1;font-size:0.75rem;font-family:monospace" />
          </div>
        </div>`).join('')}
    </div>
    <button class="btn-load" id="btn-gen-theme" style="margin-bottom:1rem">⟳ Générer palette depuis Principale</button>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">
      <div class="field">
        <label>Police serif</label>
        <select id="t_font_serif">${Object.keys(FONTS.serif).map(f => `<option value="${f}">${f}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>Police sans-serif</label>
        <select id="t_font_sans">${Object.keys(FONTS.sans).map(f => `<option value="${f}">${f}</option>`).join('')}</select>
      </div>
    </div>

    <div style="background:var(--surface2);border-radius:6px;padding:0.75rem;margin-bottom:1rem">
      <p id="fp_serif" style="font-size:1.3rem;margin-bottom:0.3rem">Cormorant Garamond — Élégance intemporelle</p>
      <p id="fp_sans" style="font-size:0.85rem;color:var(--text-dim)">Montserrat — Lisibilité moderne</p>
    </div>

    <h4 style="font-size:0.8rem;color:var(--text-dim);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.06em">Dress code</h4>
    <div class="list-items" id="dress-colors-list"></div>
    <button class="btn-add-item" id="btn-add-dress">+ Ajouter couleur dress code</button>
    <button class="btn-load" id="btn-gen-dress" style="margin-top:0.5rem">⟳ Générer dress code depuis Principale</button>
    <div class="field" style="margin-top:0.75rem">
      <label>Intro dress code</label>
      <textarea id="s_dress_intro" rows="2"></textarea>
    </div>`;

  COLOR_KEYS.forEach(k => {
    const picker = $(`t_${k}`);
    const hex    = $(`t_${k}_hex`);
    picker.addEventListener('input', () => { hex.value = picker.value; });
    hex.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) picker.value = hex.value; });
  });

  [$('t_font_serif'), $('t_font_sans')].forEach(sel => sel?.addEventListener('change', updateFontPreviewStudio));
  updateFontPreviewStudio();

  $('btn-gen-theme').addEventListener('click', () => {
    const p = generateThemePalette($('t_wine').value || '#6B2737');
    const map = { wine_dk:'wineDk', wine_lt:'wineLt', gold:'gold', gold_lt:'goldLt', olive:'olive',
                  cream:'cream', cream_dk:'creamDk', dark:'dark', dark_md:'darkMd', text:'text', text_lt:'textLt' };
    Object.entries(map).forEach(([k, pk]) => setColor(k, p[pk]));
  });

  $('btn-add-dress').addEventListener('click', () => addDressColor({ hex: '#cccccc', nom: '', eviter: false }));
  $('btn-gen-dress').addEventListener('click', () => {
    const [h,s,l] = hexToHSL($('t_wine').value || '#6B2737');
    const ps=Math.min(s*0.55,45), pl=Math.min(Math.max(l+28,68),84);
    const palette = [
      {nom:'Teinte principale',   hex:hslToHex(h,ps,pl),     eviter:false},
      {nom:'Teinte analogique',   hex:hslToHex(h+28,ps,pl),  eviter:false},
      {nom:'Teinte analogique 2', hex:hslToHex(h-28,ps,pl),  eviter:false},
      {nom:'Champagne',           hex:hslToHex(38,45,76),     eviter:false},
      {nom:'Ivoire',              hex:hslToHex(h,Math.min(s*0.1,8),91), eviter:false},
      {nom:'Blanc',               hex:'#F7F5F2',              eviter:true},
      {nom:'Complémentaire vif',  hex:hslToHex((h+180)%360,Math.min(s,65),Math.min(l,52)), eviter:true},
    ];
    $('dress-colors-list').innerHTML = '';
    palette.forEach(addDressColor);
  });
}

function setColor(key, hex) {
  const picker = $(`t_${key}`); const hexEl = $(`t_${key}_hex`);
  if (picker) picker.value = hex;
  if (hexEl)  hexEl.value  = hex;
}

function addDressColor(c) {
  const list  = $('dress-colors-list');
  const block = document.createElement('div');
  block.className = 'list-item';
  block.style.cssText = 'display:flex;gap:0.5rem;align-items:center';
  block.innerHTML = `
    <input type="color" data-field="hex" value="${c.hex||'#cccccc'}" style="width:32px;height:28px;border:none;background:none;padding:0;cursor:pointer"/>
    <input type="text" data-field="nom" value="${c.nom||''}" placeholder="Nom" style="flex:1"/>
    <label style="display:flex;gap:0.3rem;align-items:center;font-size:0.75rem;white-space:nowrap">
      <input type="checkbox" data-field="eviter" ${c.eviter?'checked':''}/>Éviter
    </label>
    <button class="btn-rm-item" style="position:static">×</button>`;
  block.querySelector('.btn-rm-item').addEventListener('click', () => block.remove());
  list.appendChild(block);
}

let studioFontLink = null;
function updateFontPreviewStudio() {
  const serif = $('t_font_serif')?.value || 'Cormorant Garamond';
  const sans  = $('t_font_sans')?.value  || 'Montserrat';
  const sp    = FONTS.serif[serif] || FONTS.serif['Cormorant Garamond'];
  const snp   = FONTS.sans[sans]   || FONTS.sans['Montserrat'];
  const url   = `https://fonts.googleapis.com/css2?family=${sp}&family=${snp}&display=swap`;
  if (studioFontLink) studioFontLink.remove();
  studioFontLink = document.createElement('link');
  studioFontLink.rel = 'stylesheet'; studioFontLink.href = url;
  document.head.appendChild(studioFontLink);
  if ($('fp_serif')) $('fp_serif').style.fontFamily = `'${serif}', Georgia, serif`;
  if ($('fp_sans'))  $('fp_sans').style.fontFamily  = `'${sans}', system-ui, sans-serif`;
}

function populateTheme(cfg) {
  const th = cfg.theme || {};
  COLOR_KEYS.forEach(k => setColor(k, th[k] || ''));
  if (th.font_serif && $('t_font_serif')) $('t_font_serif').value = th.font_serif;
  if (th.font_sans  && $('t_font_sans'))  $('t_font_sans').value  = th.font_sans;
  updateFontPreviewStudio();
  $('dress-colors-list').innerHTML = '';
  (cfg.dress_couleurs || []).forEach(addDressColor);
  if ($('s_dress_intro')) $('s_dress_intro').value = cfg.dress_intro || '';
}

function readTheme(cfg) {
  cfg.theme = {};
  COLOR_KEYS.forEach(k => { cfg.theme[k] = $(`t_${k}`)?.value || ''; });
  cfg.theme.font_serif = $('t_font_serif')?.value || 'Cormorant Garamond';
  cfg.theme.font_sans  = $('t_font_sans')?.value  || 'Montserrat';
  cfg.dress_couleurs = [...($('dress-colors-list')?.querySelectorAll('.list-item') || [])].map(block => ({
    hex:    block.querySelector('[data-field="hex"]').value,
    nom:    block.querySelector('[data-field="nom"]').value.trim(),
    eviter: block.querySelector('[data-field="eviter"]').checked,
  })).filter(c => c.nom || c.hex !== '#cccccc');
  cfg.dress_intro = $('s_dress_intro')?.value || '';
}

// ────────────────────────────────────────
// ONGLET TEMPLATE
// ────────────────────────────────────────

function buildTemplateTab() {
  const tab = $('tab-template');
  tab.innerHTML = `
    <p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:1rem">Choisissez le design du site mariage.</p>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      ${[
        { val: 'base',       label: 'Base',       desc: 'Design épuré, sobre et élégant' },
        { val: 'romantique', label: 'Romantique', desc: 'Fleurs, pétales, tons rosés' },
        { val: 'chic',       label: 'Chic',       desc: 'Typographie serif, galerie masonry' },
      ].map(t => `
        <label style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--surface2);border:1px solid var(--border);border-radius:6px;cursor:pointer">
          <input type="radio" name="template-choice" value="${t.val}" style="accent-color:var(--gold)" />
          <span>
            <strong style="display:block;font-size:0.85rem">${t.label}</strong>
            <span style="font-size:0.75rem;color:var(--text-dim)">${t.desc}</span>
          </span>
        </label>`).join('')}
    </div>`;
}

function populateTemplate(tpl) {
  const radio = document.querySelector(`input[name="template-choice"][value="${tpl}"]`);
  if (radio) radio.checked = true;
}

function readTemplate() {
  return document.querySelector('input[name="template-choice"]:checked')?.value || 'base';
}
