# Wedoria Studio Sprint 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page studio with a 3-page app (clients list → editor → preview) backed by Supabase persistence.

**Architecture:** Static HTML pages sharing a common `style.css` and a `studio-supabase.js` CRUD layer. Data passes between pages via `sessionStorage` key `wedoria_current`. Supabase is the source of truth; `sessionStorage` is the inter-page transport.

**Tech Stack:** Vanilla JS (no framework), Supabase JS v2 (CDN), Supabase Storage for photo uploads.

**User Verification:** YES — user confirms the 6 success criteria from the spec after Task 7 integration test.

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `studio/studio-config.js` | CREATE | Supabase URL + anon key constants |
| `studio/studio-supabase.js` | CREATE | CRUD layer: list, get, save, delete, duplicate, uploadPhoto |
| `studio/style.css` | MODIFY | Add: table, tabs, loading/empty/error states, confirm modal, upload slots |
| `studio/clients.html` | CREATE | Page 1 — marriage list + actions |
| `studio/clients.js` | CREATE | clients.html logic |
| `studio/studio.html` | CREATE | Page 2 — multi-tab editor (replaces index.html) |
| `studio/studio.js` | CREATE | Editor logic: form read/write + tab nav + save |
| `studio/preview.html` | CREATE | Page 3 — fullscreen iframe preview |
| `studio/preview.js` | CREATE | Preview logic: sessionStorage → HTML blob → iframe |

Old files (`studio/index.html`, `studio/script.js`) are kept intact until Task 7 is validated, then removed.

---

## Task 0: studio-config.js + studio-supabase.js

**Goal:** Create the shared Supabase client and all CRUD operations used by every page.

**Files:**
- Create: `studio/studio-config.js`
- Create: `studio/studio-supabase.js`

**Acceptance Criteria:**
- [ ] `supabase` client initialises without error when both scripts are loaded
- [ ] `listMariages()` returns an array (empty OK, no exception)
- [ ] `saveMariage()` with a new object inserts a row and returns the saved object with `id`
- [ ] `deleteMariage(id)` removes the row
- [ ] `duplicateMariage(id)` creates a copy with a new `id` and a `_copie` slug suffix
- [ ] `uploadPhoto(slug, file)` returns a public URL string

**Verify:** Open browser console on any studio page, call `listMariages()`, see array logged.

**Steps:**

- [ ] **Step 1: Create studio-config.js**

```js
// studio/studio-config.js
// Replace with your Supabase project values
const STUDIO_SUPABASE_URL      = 'REMPLACER_PAR_VOTRE_URL_SUPABASE';
const STUDIO_SUPABASE_ANON_KEY = 'REMPLACER_PAR_VOTRE_CLE_ANON_SUPABASE';
```

- [ ] **Step 2: Create studio-supabase.js**

```js
// studio/studio-supabase.js
'use strict';

let _sb = null;

function supabaseInit() {
  if (_sb) return _sb;
  _sb = window.supabase.createClient(STUDIO_SUPABASE_URL, STUDIO_SUPABASE_ANON_KEY);
  return _sb;
}

async function listMariages() {
  const sb = supabaseInit();
  const { data, error } = await sb
    .from('mariages')
    .select('id, slug, template, config, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function getMariage(id) {
  const sb = supabaseInit();
  const { data, error } = await sb
    .from('mariages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

function makeSlug(prenom1, prenom2, dateIso) {
  const year = dateIso ? dateIso.slice(0, 4) : new Date().getFullYear();
  const raw  = `${prenom1 || 'p1'}-${prenom2 || 'p2'}-${year}`;
  return raw.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function saveMariage(mariage) {
  const sb = supabaseInit();
  const isNew = !mariage.id;

  const row = {
    slug:       mariage.slug || makeSlug(mariage.config?.prenom1, mariage.config?.prenom2, mariage.config?.date_iso),
    template:   mariage.template || 'base',
    config:     mariage.config || {},
    updated_at: new Date().toISOString(),
  };
  if (!isNew) row.id = mariage.id;

  const { data, error } = await sb
    .from('mariages')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteMariage(id) {
  const sb = supabaseInit();
  const { error } = await sb.from('mariages').delete().eq('id', id);
  if (error) throw error;
}

async function duplicateMariage(id) {
  const sb   = supabaseInit();
  const orig = await getMariage(id);
  const row  = {
    slug:       orig.slug + '-copie',
    template:   orig.template,
    config:     orig.config,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await sb.from('mariages').insert(row).select().single();
  if (error) throw error;
  return data;
}

async function uploadPhoto(slug, file) {
  const sb   = supabaseInit();
  const path = `${slug}/${Date.now()}-${file.name}`;
  const { error } = await sb.storage.from('photos').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}
```

- [ ] **Step 3: Verify in browser console**

Load any studio HTML page with these two scripts included, then run:
```js
listMariages().then(console.log).catch(console.error)
```
Expected: `[]` or array of rows — no exception.

- [ ] **Step 4: Commit**

```bash
git add studio/studio-config.js studio/studio-supabase.js
git commit -m "feat: studio — couche Supabase (CRUD + upload)"
```

```json:metadata
{"files": ["studio/studio-config.js", "studio/studio-supabase.js"], "verifyCommand": "browser console: listMariages().then(console.log)", "acceptanceCriteria": ["listMariages() returns array", "saveMariage() inserts and returns id", "deleteMariage() removes row", "duplicateMariage() creates copy", "uploadPhoto() returns public URL"], "requiresUserVerification": false}
```

---

## Task 1: style.css — Shared styles additions

**Goal:** Extend the existing dark-theme CSS to cover table, tabs, loading/empty/error states, confirm modal, and photo upload slots.

**Files:**
- Modify: `studio/style.css`

**Acceptance Criteria:**
- [ ] `.clients-table` renders with proper column widths and row hover
- [ ] `.tabs` and `.tab-content` show/hide correctly via `.active` class
- [ ] `.state-loading`, `.state-empty`, `.state-error` display centred with appropriate colours
- [ ] `.modal-confirm` overlays correctly with backdrop
- [ ] `.save-feedback` appears as a small green toast
- [ ] `.upload-slot` renders drag-target and URL input side by side

**Steps:**

- [ ] **Step 1: Append new sections to studio/style.css**

```css
/* ── CLIENTS TABLE ── */
.clients-table { width: 100%; border-collapse: collapse; }
.clients-table th {
  text-align: left; padding: 10px 12px;
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--text-dim);
  border-bottom: 1px solid var(--border);
}
.clients-table td {
  padding: 12px; font-size: 0.82rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.clients-table tr:hover td { background: var(--surface2); }
.clients-table .col-actions { display: flex; gap: 0.4rem; }
.badge-template {
  display: inline-block; padding: 2px 8px; border-radius: 99px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em;
  background: var(--border); color: var(--text-dim);
}

/* ── TABS ── */
.tabs-nav {
  display: flex; gap: 0; border-bottom: 1px solid var(--border);
  padding: 0 1rem;
}
.tabs-nav button {
  background: none; border: none; cursor: pointer;
  padding: 10px 14px; font-size: 0.78rem; font-weight: 500;
  color: var(--text-dim); border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.tabs-nav button.active { color: var(--gold); border-bottom-color: var(--gold); }
.tabs-nav button:hover:not(.active) { color: var(--text); }
.tab-content { display: none; padding: 1rem; }
.tab-content.active { display: block; }

/* ── STATES ── */
.page-body {
  max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem;
}
.state-loading, .state-empty, .state-error {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 4rem 1rem; color: var(--text-dim); text-align: center;
}
.state-error { color: var(--red); }
.spinner {
  width: 28px; height: 28px; border: 3px solid var(--border);
  border-top-color: var(--gold); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── CONFIRM MODAL ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
}
.modal-backdrop.hidden { display: none; }
.modal-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 1.5rem; max-width: 360px; width: 90%;
  display: flex; flex-direction: column; gap: 1rem;
}
.modal-box p { font-size: 0.88rem; color: var(--text); }
.modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }

/* ── SAVE FEEDBACK TOAST ── */
.save-feedback {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  background: var(--green); color: #111; padding: 0.5rem 1rem;
  border-radius: 6px; font-size: 0.8rem; font-weight: 600;
  opacity: 0; transition: opacity 0.2s; pointer-events: none;
  z-index: 300;
}
.save-feedback.visible { opacity: 1; }

/* ── UPLOAD SLOT ── */
.upload-slot {
  border: 1px dashed var(--border); border-radius: 6px;
  padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;
}
.upload-slot .upload-preview {
  width: 100%; height: 80px; object-fit: cover;
  border-radius: 4px; display: none;
}
.upload-slot .upload-preview.visible { display: block; }
.upload-drop {
  text-align: center; padding: 0.75rem;
  color: var(--text-dim); font-size: 0.75rem; cursor: pointer;
}
.upload-drop:hover { color: var(--gold); border-color: var(--gold); }
.upload-url { width: 100%; }

/* ── DYNAMIC LIST (histoire, programme, etc.) ── */
.list-items { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
.list-item {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 6px; padding: 0.75rem; position: relative;
}
.list-item .btn-rm-item {
  position: absolute; top: 6px; right: 8px;
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; font-size: 1rem; line-height: 1;
}
.list-item .btn-rm-item:hover { color: var(--red); }
.btn-add-item {
  background: transparent; border: 1px dashed var(--border);
  color: var(--text-dim); padding: 5px 12px; border-radius: 6px;
  font-size: 0.75rem; cursor: pointer; width: 100%;
}
.btn-add-item:hover { border-color: var(--gold); color: var(--gold); }

/* ── PAGE LAYOUT (clients + studio) ── */
.page-topbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--topbar-h); background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0 1rem; z-index: 100;
}
.page-main {
  padding-top: var(--topbar-h); height: 100vh;
  overflow-y: auto;
}
.studio-form {
  max-width: 720px; margin: 0 auto; padding-bottom: 3rem;
}
```

- [ ] **Step 2: Commit**

```bash
git add studio/style.css
git commit -m "feat: studio — styles table, tabs, états, modal, upload"
```

```json:metadata
{"files": ["studio/style.css"], "verifyCommand": "visual check in browser", "acceptanceCriteria": ["table renders", "tabs work", "states display correctly", "modal overlays", "toast appears"], "requiresUserVerification": false}
```

---

## Task 2: clients.html + clients.js

**Goal:** Page d'accueil listant tous les mariages depuis Supabase, avec actions Éditer / Prévisualiser / Dupliquer / Supprimer.

**Files:**
- Create: `studio/clients.html`
- Create: `studio/clients.js`

**Acceptance Criteria:**
- [ ] Page loads and shows spinner while fetching
- [ ] Table renders one row per marriage with correct columns
- [ ] "Éditer" → sets `sessionStorage.wedoria_current` and navigates to `studio.html?id=<id>`
- [ ] "Prévisualiser" → sets sessionStorage and navigates to `preview.html`
- [ ] "Dupliquer" → creates copy, reloads list
- [ ] "Supprimer" → shows confirm modal, deletes on confirm, reloads list
- [ ] "+ Nouveau mariage" → navigates to `studio.html` with no id (blank form)
- [ ] Empty state shown when no rows

**Steps:**

- [ ] **Step 1: Create clients.html**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>◆ Wedoria Studio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<header class="page-topbar">
  <span class="topbar-logo">◆ WEDORIA STUDIO</span>
  <span style="flex:1"></span>
  <button class="btn-save" id="btn-new">+ Nouveau mariage</button>
</header>

<main class="page-main">
  <div class="page-body">

    <div class="state-loading" id="state-loading">
      <div class="spinner"></div>
      <span>Chargement…</span>
    </div>

    <div class="state-empty hidden" id="state-empty">
      <p>Aucun mariage · Créez votre premier projet →</p>
      <button class="btn-save" id="btn-new-empty">+ Nouveau mariage</button>
    </div>

    <div class="state-error hidden" id="state-error">
      <p id="error-msg">Erreur de chargement</p>
    </div>

    <table class="clients-table hidden" id="clients-table">
      <thead>
        <tr>
          <th>Couple</th>
          <th>Date</th>
          <th>Template</th>
          <th>Dernière modif</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="clients-tbody"></tbody>
    </table>

  </div>
</main>

<!-- Confirm delete modal -->
<div class="modal-backdrop hidden" id="modal-confirm">
  <div class="modal-box">
    <p id="modal-text">Supprimer ce mariage définitivement ?</p>
    <div class="modal-actions">
      <button class="btn-load" id="modal-cancel">Annuler</button>
      <button class="btn-export" id="modal-confirm-btn" style="background:var(--red)">Supprimer</button>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="studio-config.js"></script>
<script src="studio-supabase.js"></script>
<script src="clients.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create clients.js**

```js
// studio/clients.js
'use strict';

const $ = id => document.getElementById(id);

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function templateLabel(t) {
  return { base: 'Base', romantique: 'Romantique', chic: 'Chic' }[t] || t;
}

function renderRow(m) {
  const cfg    = m.config || {};
  const couple = [cfg.prenom1, cfg.prenom2].filter(Boolean).join(' & ') || '(sans nom)';
  const date   = cfg.date_affichage || '—';
  const modif  = fmtDate(m.updated_at);

  const tr = document.createElement('tr');
  tr.dataset.id = m.id;
  tr.innerHTML = `
    <td>${couple}</td>
    <td>${date}</td>
    <td><span class="badge-template">${templateLabel(m.template)}</span></td>
    <td>${modif}</td>
    <td class="col-actions">
      <button class="btn-load btn-edit" data-id="${m.id}">Éditer</button>
      <button class="btn-load btn-preview" data-id="${m.id}">Prévisualiser</button>
      <button class="btn-load btn-dup" data-id="${m.id}">Dupliquer</button>
      <button class="btn-load btn-del" data-id="${m.id}" style="color:var(--red)">Supprimer</button>
    </td>`;
  return tr;
}

function show(id)  { $(id).classList.remove('hidden'); }
function hide(id)  { $(id).classList.add('hidden'); }

async function loadList() {
  hide('clients-table'); hide('state-empty'); hide('state-error');
  show('state-loading');
  try {
    const rows = await listMariages();
    hide('state-loading');
    if (rows.length === 0) { show('state-empty'); return; }
    const tbody = $('clients-tbody');
    tbody.innerHTML = '';
    rows.forEach(m => tbody.appendChild(renderRow(m)));
    show('clients-table');
  } catch (e) {
    hide('state-loading');
    $('error-msg').textContent = 'Erreur Supabase : ' + e.message;
    show('state-error');
  }
}

function navNew()       { sessionStorage.removeItem('wedoria_current'); location.href = 'studio.html'; }
function navEdit(id)    { location.href = `studio.html?id=${id}`; }
function navPreview(m)  { sessionStorage.setItem('wedoria_current', JSON.stringify(m)); location.href = 'preview.html'; }

let pendingDeleteId = null;

function openConfirm(id, coupleName) {
  pendingDeleteId = id;
  $('modal-text').textContent = `Supprimer le mariage de ${coupleName} définitivement ?`;
  $('modal-confirm').classList.remove('hidden');
}

$('modal-cancel').addEventListener('click', () => {
  $('modal-confirm').classList.add('hidden');
  pendingDeleteId = null;
});

$('modal-confirm-btn').addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  $('modal-confirm').classList.add('hidden');
  try {
    await deleteMariage(pendingDeleteId);
    pendingDeleteId = null;
    loadList();
  } catch (e) {
    alert('Erreur suppression : ' + e.message);
  }
});

$('btn-new').addEventListener('click', navNew);
$('btn-new-empty').addEventListener('click', navNew);

document.addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-edit')) {
    navEdit(id);

  } else if (e.target.classList.contains('btn-preview')) {
    try {
      const m = await getMariage(id);
      navPreview(m);
    } catch (err) { alert('Erreur : ' + err.message); }

  } else if (e.target.classList.contains('btn-dup')) {
    try {
      await duplicateMariage(id);
      loadList();
    } catch (err) { alert('Erreur duplication : ' + err.message); }

  } else if (e.target.classList.contains('btn-del')) {
    const row    = e.target.closest('tr');
    const couple = row?.cells[0]?.textContent || 'ce mariage';
    openConfirm(id, couple);
  }
});

loadList();
```

- [ ] **Step 3: Manual test**

Open `studio/clients.html` in browser:
- Spinner appears → table appears (or empty state if no data)
- Click "+ Nouveau mariage" → navigates to `studio.html`

- [ ] **Step 4: Commit**

```bash
git add studio/clients.html studio/clients.js
git commit -m "feat: clients.html — liste mariages Supabase + actions"
```

```json:metadata
{"files": ["studio/clients.html", "studio/clients.js"], "verifyCommand": "open studio/clients.html in browser", "acceptanceCriteria": ["spinner shows on load", "table renders rows", "edit navigates to studio.html?id=", "preview sets sessionStorage and navigates", "duplicate reloads list", "delete shows confirm then removes row", "empty state when no data"], "requiresUserVerification": false}
```

---

## Task 3: studio.html + studio.js — Shell + Onglet Infos

**Goal:** Editor page shell with topbar, 5-tab nav, and a fully wired Infos tab. Loads from Supabase by `?id=` URL param (or blank for new). Manual save triggers Supabase UPSERT.

**Files:**
- Create: `studio/studio.html`
- Create: `studio/studio.js` (partial — Infos tab only; expanded in Tasks 4 and 5)

**Acceptance Criteria:**
- [ ] Page loads with 5 tab buttons; clicking a tab shows its panel and hides others
- [ ] If `?id=<uuid>` in URL: loads from Supabase and populates Infos fields
- [ ] If no `?id`: all fields blank, topbar shows "Nouveau mariage"
- [ ] Topbar shows couple name + date once loaded
- [ ] "Sauvegarder" → UPSERT to Supabase → green toast "Sauvegardé ✓" for 2s
- [ ] "← Clients" → navigates to `clients.html`
- [ ] "Prévisualiser →" → sets sessionStorage and navigates to `preview.html`

**Steps:**

- [ ] **Step 1: Create studio.html**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>◆ Wedoria Studio — Éditeur</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<header class="page-topbar">
  <span class="topbar-logo">◆ STUDIO</span>
  <span class="topbar-client" id="topbar-client">Nouveau mariage</span>
  <span style="flex:1"></span>
  <button class="btn-load" id="btn-clients">← Clients</button>
  <button class="btn-save" id="btn-save">Sauvegarder</button>
  <button class="btn-export" id="btn-preview-nav">Prévisualiser →</button>
</header>

<main class="page-main">
  <div class="studio-form">

    <!-- TABS NAV -->
    <nav class="tabs-nav">
      <button class="active" data-tab="infos">Infos</button>
      <button data-tab="contenu">Contenu</button>
      <button data-tab="medias">Médias</button>
      <button data-tab="theme">Thème</button>
      <button data-tab="template">Template</button>
    </nav>

    <!-- ── ONGLET INFOS ── -->
    <div class="tab-content active" id="tab-infos">
      <div class="field-row">
        <div class="field"><label>Prénom 1</label><input type="text" id="s_prenom1" /></div>
        <div class="field"><label>Nom 1</label><input type="text" id="s_nom1" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Prénom 2</label><input type="text" id="s_prenom2" /></div>
        <div class="field"><label>Nom 2</label><input type="text" id="s_nom2" /></div>
      </div>
      <div class="field"><label>Date affichée</label><input type="text" id="s_date_affichage" placeholder="12 juillet 2025" /></div>
      <div class="field"><label>Date ISO</label><input type="text" id="s_date_iso" placeholder="2025-07-12T14:00:00" /></div>
      <div class="field"><label>Deadline RSVP</label><input type="text" id="s_rsvp_deadline" placeholder="2025-06-01" /></div>
      <div class="field-row">
        <div class="field"><label>Domaine</label><input type="text" id="s_domaine" /></div>
        <div class="field"><label>Ville</label><input type="text" id="s_ville" /></div>
      </div>
      <div class="field"><label>Email contact</label><input type="email" id="s_email" /></div>
      <div class="field"><label>WhatsApp</label><input type="text" id="s_whatsapp" /></div>
      <div class="field">
        <label>Vidéo hero — type</label>
        <select id="s_video_type">
          <option value="none">Aucune</option>
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="mp4">MP4 direct</option>
        </select>
      </div>
      <div class="field"><label>Vidéo hero — URL/src</label><input type="text" id="s_video_src" /></div>
      <div class="field"><label>Intro RSVP</label><textarea id="s_rsvp_intro" rows="2"></textarea></div>
    </div>

    <!-- ── ONGLET CONTENU ── -->
    <div class="tab-content" id="tab-contenu">
      <!-- Injected by studio.js -->
    </div>

    <!-- ── ONGLET MÉDIAS ── -->
    <div class="tab-content" id="tab-medias">
      <!-- Injected by studio.js -->
    </div>

    <!-- ── ONGLET THÈME ── -->
    <div class="tab-content" id="tab-theme">
      <!-- Injected by studio.js -->
    </div>

    <!-- ── ONGLET TEMPLATE ── -->
    <div class="tab-content" id="tab-template">
      <!-- Injected by studio.js -->
    </div>

  </div>
</main>

<div class="save-feedback" id="save-feedback">Sauvegardé ✓</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="studio-config.js"></script>
<script src="studio-supabase.js"></script>
<script src="studio.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create studio.js — core state + tab nav + Infos tab**

```js
// studio/studio.js
'use strict';

// ── FONTS (reused from old script.js) ──
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

// ── COLOR UTILITIES (reused from old script.js) ──
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
let currentRow = null;   // { id, slug, template, config, updated_at }

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

// ── BUILD CURRENT ROW (merges all tabs) ──
function buildCurrentRow() {
  if (!currentRow) {
    currentRow = { template: 'base', config: {} };
  }
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
  buildContenuTab();
  buildMediasTab();
  buildThemeTab();
  buildTemplateTab();
}

init();
```

- [ ] **Step 3: Manual test**

- Open `studio/clients.html` → click "+ Nouveau mariage" → `studio.html` opens with blank form
- Click all 5 tab buttons → each panel shows (Contenu/Médias/Thème/Template are blank placeholders until Task 4/5)

- [ ] **Step 4: Commit**

```bash
git add studio/studio.html studio/studio.js
git commit -m "feat: studio.html — shell tabs + onglet Infos + save Supabase"
```

```json:metadata
{"files": ["studio/studio.html", "studio/studio.js"], "verifyCommand": "open studio/studio.html in browser", "acceptanceCriteria": ["5 tabs switch correctly", "Infos fields populate from Supabase when ?id= given", "Sauvegarder triggers UPSERT + green toast", "← Clients navigates back", "Prévisualiser sets sessionStorage"], "requiresUserVerification": false}
```

---

## Task 4: studio.js — Onglet Contenu (listes dynamiques)

**Goal:** Wire the Contenu tab with 6 dynamic lists (histoire, programme, lieux, galerie domaine, FAQ, infos pratiques). Each list has + Ajouter and × per item.

**Files:**
- Modify: `studio/studio.js` (append `buildContenuTab`, `populateContenu`, `readContenu`)
- Modify: `studio/studio.html` (Contenu tab HTML scaffold is already there via `id="tab-contenu"`)

**Acceptance Criteria:**
- [ ] `buildContenuTab()` renders 6 sections with + Ajouter buttons
- [ ] Clicking + Ajouter appends a new item block
- [ ] Clicking × removes that item block
- [ ] `readContenu(cfg)` reads all 6 lists from DOM into cfg
- [ ] `populateContenu(cfg)` fills all 6 lists from a saved config
- [ ] Round-trip: save → reload page → contenu fields match

**Steps:**

- [ ] **Step 1: Append to studio.js**

```js
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
          ? `<textarea id="" rows="2" data-field="${f.key}" style="width:100%">${values[f.key] || ''}</textarea>`
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
    id: 'list-histoire',
    title: 'Histoire',
    fields: [
      { key: 'annee',  label: 'Année',  type: 'text' },
      { key: 'titre',  label: 'Titre',  type: 'text' },
      { key: 'texte',  label: 'Texte',  type: 'textarea' },
      { key: 'align',  label: 'Align (left/right)', type: 'text' },
    ],
  },
  programme: {
    id: 'list-programme',
    title: 'Programme',
    fields: [
      { key: 'heure',  label: 'Heure',     type: 'text' },
      { key: 'icon',   label: 'Icône',     type: 'text' },
      { key: 'titre',  label: 'Titre',     type: 'text' },
      { key: 'lieu',   label: 'Lieu',      type: 'text' },
    ],
  },
  galerie: {
    id: 'list-galerie',
    title: 'Galerie domaine',
    fields: [
      { key: 'icon',   label: 'Icône',  type: 'text' },
      { key: 'label',  label: 'Label',  type: 'text' },
      { key: 'photo',  label: 'Photo URL/chemin', type: 'text' },
    ],
  },
  lieux: {
    id: 'list-lieux',
    title: 'Lieux',
    fields: [
      { key: 'type',     label: 'Type (cérémonie/réception…)', type: 'text' },
      { key: 'nom',      label: 'Nom du lieu',                 type: 'text' },
      { key: 'adresse',  label: 'Adresse (lignes séparées par |)', type: 'textarea' },
    ],
  },
  faq: {
    id: 'list-faq',
    title: 'FAQ',
    fields: [
      { key: 'q', label: 'Question', type: 'text' },
      { key: 'r', label: 'Réponse',  type: 'textarea' },
    ],
  },
  infos: {
    id: 'list-infos',
    title: 'Infos pratiques',
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
  Object.values(LISTE_DEFS).forEach(def => {
    tab.appendChild(makeListSection(def.id, def.title, def.fields));
  });

  tab.addEventListener('click', e => {
    const btn = e.target.closest('.btn-add-item');
    if (!btn) return;
    const fields = JSON.parse(btn.dataset.fields);
    addItemToList(btn.dataset.container, fields);
  });
}

function populateContenu(cfg) {
  const populate = (key, def) => {
    const items = cfg[key] || [];
    items.forEach(item => {
      const vals = { ...item };
      if (Array.isArray(vals.adresse)) vals.adresse = vals.adresse.join('|');
      addItemToList(def.id, def.fields, vals);
    });
  };
  Object.entries(LISTE_DEFS).forEach(([key, def]) => populate(key, def));
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
```

- [ ] **Step 2: Manual test**

Open `studio.html`, click Contenu tab:
- 6 sections with + Ajouter buttons appear
- Click + Ajouter on Histoire → new block appears with 4 fields
- Click × → block disappears

- [ ] **Step 3: Commit**

```bash
git add studio/studio.js
git commit -m "feat: studio — onglet Contenu, listes dynamiques (6 sections)"
```

```json:metadata
{"files": ["studio/studio.js"], "verifyCommand": "open studio/studio.html → click Contenu tab", "acceptanceCriteria": ["6 list sections render", "+ Ajouter adds item block", "× removes item block", "readContenu reads all items", "populateContenu fills items from saved config", "round-trip save/reload preserves items"], "requiresUserVerification": false}
```

---

## Task 5: studio.js — Onglets Médias + Thème + Template

**Goal:** Complete the editor with photo upload slots (Médias), color/font/dress-code editor (Thème), and template selector (Template).

**Files:**
- Modify: `studio/studio.js` (append `buildMediasTab`, `populateMedias`, `readMedias`, `buildThemeTab`, etc.)

**Acceptance Criteria:**
- [ ] Médias tab shows upload slot for photo couple + 3 ambiances + galerie list
- [ ] Each upload slot accepts file drag/drop OR URL text input; file upload calls `uploadPhoto()` and populates the URL field
- [ ] Thème tab shows 12 color pickers + 2 font selects + dress-code list + "Générer palette" button
- [ ] "Générer palette" fills all 11 derived color inputs from `t_wine`
- [ ] Template tab shows 3 radio options (Base / Romantique / Chic)
- [ ] Round-trip: save → reload → Médias, Thème, Template all restore correctly

**Steps:**

- [ ] **Step 1: Append Médias section to studio.js**

```js
// ────────────────────────────────────────
// ONGLET MÉDIAS
// ────────────────────────────────────────

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

  const drop = wrap.querySelector(`#drop-${fieldId}`);
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
    if (!file) return;
    await handleUpload(fieldId, file, setUrl);
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    await handleUpload(fieldId, file, setUrl);
    fileInput.value = '';
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

const _mediaSlots = {};

function buildMediasTab() {
  const tab = $('tab-medias');
  tab.innerHTML = '';

  const couples = [
    { id: 'photo_couple',    label: 'Photo couple' },
    { id: 'photo_ambiance_0', label: 'Ambiance 1' },
    { id: 'photo_ambiance_1', label: 'Ambiance 2' },
    { id: 'photo_ambiance_2', label: 'Ambiance 3' },
  ];
  couples.forEach(({ id, label }) => {
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
  block.style.display = 'flex'; block.style.gap = '0.5rem'; block.style.alignItems = 'center';
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
```

- [ ] **Step 2: Append Thème section to studio.js**

```js
// ────────────────────────────────────────
// ONGLET THÈME
// ────────────────────────────────────────

const COLOR_KEYS = ['wine','wine_dk','wine_lt','gold','gold_lt','olive','cream','cream_dk','dark','dark_md','text','text_lt'];
const COLOR_LABELS = {
  wine:'Principale',wine_dk:'Sombre',wine_lt:'Claire',gold:'Dorée',gold_lt:'Dorée claire',
  olive:'Olive',cream:'Fond clair',cream_dk:'Fond moyen',dark:'Fond sombre',dark_md:'Fond moyen sombre',
  text:'Texte',text_lt:'Texte clair',
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

  // Color inputs sync (picker ↔ hex text)
  COLOR_KEYS.forEach(k => {
    const picker = $(`t_${k}`);
    const hex    = $(`t_${k}_hex`);
    picker.addEventListener('input', () => { hex.value = picker.value; });
    hex.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) picker.value = hex.value; });
  });

  // Font preview
  [$('t_font_serif'), $('t_font_sans')].forEach(sel => sel?.addEventListener('change', updateFontPreviewStudio));
  updateFontPreviewStudio();

  // Generate theme palette
  $('btn-gen-theme').addEventListener('click', () => {
    const p = generateThemePalette($('t_wine').value || '#6B2737');
    const map = { wine_dk:'wineDk',wine_lt:'wineLt',gold:'gold',gold_lt:'goldLt',olive:'olive',
                  cream:'cream',cream_dk:'creamDk',dark:'dark',dark_md:'darkMd',text:'text',text_lt:'textLt' };
    Object.entries(map).forEach(([k, pk]) => setColor(k, p[pk]));
  });

  // Dress code
  $('btn-add-dress').addEventListener('click', () => addDressColor({ hex: '#cccccc', nom: '', eviter: false }));
  $('btn-gen-dress').addEventListener('click', () => {
    const [h,s,l] = hexToHSL($('t_wine').value || '#6B2737');
    const ps=Math.min(s*0.55,45), pl=Math.min(Math.max(l+28,68),84);
    const palette = [
      {nom:'Teinte principale',  hex:hslToHex(h,ps,pl),     eviter:false},
      {nom:'Teinte analogique',  hex:hslToHex(h+28,ps,pl),  eviter:false},
      {nom:'Teinte analogique 2',hex:hslToHex(h-28,ps,pl),  eviter:false},
      {nom:'Champagne',          hex:hslToHex(38,45,76),     eviter:false},
      {nom:'Ivoire',             hex:hslToHex(h,Math.min(s*0.1,8),91), eviter:false},
      {nom:'Blanc',              hex:'#F7F5F2',              eviter:true },
      {nom:'Complémentaire vif', hex:hslToHex((h+180)%360,Math.min(s,65),Math.min(l,52)), eviter:true},
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
  block.style.display = 'flex'; block.style.gap = '0.5rem'; block.style.alignItems = 'center';
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
```

- [ ] **Step 3: Append Template section to studio.js**

```js
// ────────────────────────────────────────
// ONGLET TEMPLATE
// ────────────────────────────────────────

function buildTemplateTab() {
  const tab = $('tab-template');
  tab.innerHTML = `
    <p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:1rem">Choisissez le design du site mariage.</p>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      ${[
        { val: 'base',       label: 'Base',        desc: 'Design épuré, sobre et élégant' },
        { val: 'romantique', label: 'Romantique',  desc: 'Fleurs, pétales, tons rosés' },
        { val: 'chic',       label: 'Chic',        desc: 'Typographie serif, galerie masonry' },
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
```

- [ ] **Step 4: Manual test**

Open `studio.html`:
- Médias tab: drag an image → preview appears + URL filled
- Thème tab: change Principale color → click Générer palette → 11 colors update
- Template tab: 3 radio options visible, clicking selects one

- [ ] **Step 5: Commit**

```bash
git add studio/studio.js
git commit -m "feat: studio — onglets Médias, Thème, Template"
```

```json:metadata
{"files": ["studio/studio.js"], "verifyCommand": "open studio/studio.html → test Médias, Thème, Template tabs", "acceptanceCriteria": ["upload slot accepts file and URL", "file upload calls uploadPhoto()", "color pickers sync with hex inputs", "Générer palette fills 11 colors", "font preview updates on change", "3 template radios selectable", "round-trip save/reload restores all values"], "requiresUserVerification": false}
```

---

## Task 6: preview.html + preview.js

**Goal:** Full-screen preview page that reads `sessionStorage.wedoria_current`, fetches the correct template assets, builds an HTML blob, and displays it in an iframe.

**Files:**
- Create: `studio/preview.html`
- Create: `studio/preview.js`

**Acceptance Criteria:**
- [ ] Reads `sessionStorage.wedoria_current` on load
- [ ] Topbar shows couple name + template name
- [ ] Selects correct asset path: `../template/` for base, `../templates/romantique/` for romantique, `../templates/chic/` for chic
- [ ] CSS + JS inlined correctly into the blob (same approach as old script.js)
- [ ] Iframe displays the site
- [ ] "Ouvrir dans un nouvel onglet" opens blob URL in new tab
- [ ] If no sessionStorage: shows "Aucun site à afficher" + link to clients.html

**Steps:**

- [ ] **Step 1: Create preview.html**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>◆ Wedoria Preview</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    body { overflow: hidden; }
    .preview-topbar {
      position: fixed; top: 0; left: 0; right: 0;
      height: var(--topbar-h); background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0 1rem; z-index: 100;
    }
    #preview-iframe {
      position: fixed; top: var(--topbar-h); left: 0; right: 0; bottom: 0;
      width: 100%; height: calc(100vh - var(--topbar-h));
      border: none;
    }
    #no-session {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: calc(100vh - var(--topbar-h));
      gap: 1rem; color: var(--text-dim);
    }
  </style>
</head>
<body>

<header class="preview-topbar">
  <button class="btn-load" id="btn-back">← Retour au studio</button>
  <span class="topbar-client" id="topbar-label" style="flex:1;text-align:center"></span>
  <button class="btn-save" id="btn-open-tab">↗ Ouvrir dans un nouvel onglet</button>
</header>

<div id="no-session" style="display:none">
  <p>Aucun site à afficher.</p>
  <a href="clients.html" class="btn-save" style="text-decoration:none;padding:6px 14px">← Revenir à la liste</a>
</div>

<iframe id="preview-iframe" style="display:none"></iframe>

<script src="preview.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create preview.js**

```js
// studio/preview.js
'use strict';

// Color utilities needed for theme CSS injection
function hexToHSL(hex) {
  let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0,l=(max+min)/2;
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}
  return [h*360,s*100,l*100];
}
function hslToHex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');};return `#${f(0)}${f(8)}${f(4)}`;}

const FONTS = {
  serif:{'Cormorant Garamond':'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600','Playfair Display':'Playfair+Display:ital,wght@0,400;0,600;1,400;1,600','EB Garamond':'EB+Garamond:ital,wght@0,400;0,600;1,400;1,600','Libre Baskerville':'Libre+Baskerville:ital,wght@0,400;0,700;1,400','Lora':'Lora:ital,wght@0,400;0,600;1,400;1,600','Bodoni Moda':'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400;1,6..96,600'},
  sans:{'Montserrat':'Montserrat:wght@300;400;500;600','Raleway':'Raleway:wght@300;400;500;600','Josefin Sans':'Josefin+Sans:wght@300;400;500;600','DM Sans':'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600','Nunito':'Nunito:wght@300;400;500;600'},
};

const TEMPLATE_PATHS = {
  base:       '../template/',
  romantique: '../templates/romantique/',
  chic:       '../templates/chic/',
};

async function buildPreviewHTML(row) {
  const tpl     = row.template || 'base';
  const base    = TEMPLATE_PATHS[tpl] || TEMPLATE_PATHS.base;
  const origin  = location.origin;

  const [html, css, js] = await Promise.all([
    fetch(base + 'index.html').then(r => r.text()),
    fetch(base + 'style.css').then(r => r.text()),
    fetch(base + 'script.js').then(r => r.text()),
  ]);

  const m = row.config || {};
  let out = html;

  // Base href
  out = out.replace('<head>', `<head>\n  <base href="${origin}/${base}" />`);

  // Inline CSS
  out = out.replace(/<link[^>]+href=["']style\.css["'][^>]*>/, `<style>${css}</style>`);

  // Fonts
  const serif     = m.theme?.font_serif || 'Cormorant Garamond';
  const sans      = m.theme?.font_sans  || 'Montserrat';
  const serifP    = FONTS.serif[serif]  || FONTS.serif['Cormorant Garamond'];
  const sansP     = FONTS.sans[sans]    || FONTS.sans['Montserrat'];
  const fontsUrl  = `https://fonts.googleapis.com/css2?family=${serifP}&family=${sansP}&display=swap`;
  out = out.replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/g, `<link href="${fontsUrl}" rel="stylesheet" />`);

  // Theme CSS
  const th = m.theme || {};
  const w  = th.wine || '#6B2737';
  const [wH,wS,wL] = hexToHSL(w);
  const themeStyle = `<style>:root{
  --wine:${w};--wine-dk:${th.wine_dk||hslToHex(wH,wS,Math.max(wL-16,3))};--wine-lt:${th.wine_lt||hslToHex(wH,wS,Math.min(wL+14,80))};
  --gold:${th.gold||'#C9A96E'};--gold-lt:${th.gold_lt||'#D9BC8A'};--olive:${th.olive||'#7D8C4F'};
  --cream:${th.cream||'#F5F0E8'};--cream-dk:${th.cream_dk||'#EDE6D5'};
  --dark:${th.dark||'#1C0A06'};--dark-md:${th.dark_md||'#2C1510'};
  --text:${th.text||'#3D1F0F'};--text-lt:${th.text_lt||'#7A4F3A'};
  --serif:'${serif}',Georgia,serif;--sans:'${sans}',system-ui,sans-serif;
}</style>`;
  out = out.replace('</head>', themeStyle + '\n</head>');

  // Remove local script tags
  out = out.replace(/<script[^>]+src=["'](supabase-config|config|script)\.js["'][^>]*><\/script>/g, '');

  // Inject data + script
  out = out.replace('</body>', `
<script>const SUPABASE_URL='';const SUPABASE_ANON_KEY='';</script>
<script>const MARIAGE=${JSON.stringify(m, null, 2)};</script>
<script>${js}</script>
<script>
if(typeof hydrate==='function')hydrate();
if(typeof setupVideo==='function')setupVideo();
if(typeof initBandeau==='function')initBandeau();
if(typeof initMap==='function')initMap();
if(typeof initLoader==='function')initLoader();
const _langs=(typeof MARIAGE!=='undefined'&&MARIAGE.langues)||['fr'];
const _ls=document.getElementById('lang-switch');
if(_ls)_ls.style.display=_langs.length<=1?'none':'';
</script>
</body>`);

  return out;
}

const $ = id => document.getElementById(id);
let blobUrl = null;

async function init() {
  const raw = sessionStorage.getItem('wedoria_current');
  if (!raw) {
    $('no-session').style.display = 'flex';
    return;
  }

  let row;
  try { row = JSON.parse(raw); } catch { $('no-session').style.display = 'flex'; return; }

  const cfg    = row.config || {};
  const couple = [cfg.prenom1, cfg.prenom2].filter(Boolean).join(' & ') || 'Aperçu';
  const tplLabel = { base:'Base', romantique:'Romantique', chic:'Chic' }[row.template] || row.template;
  $('topbar-label').textContent = `${couple} · ${tplLabel}`;

  $('btn-back').addEventListener('click', () => {
    if (row.id) history.back();
    else location.href = 'studio.html';
  });

  try {
    const html = await buildPreviewHTML(row);
    const blob = new Blob([html], { type: 'text/html' });
    blobUrl = URL.createObjectURL(blob);

    const iframe = $('preview-iframe');
    iframe.style.display = 'block';
    iframe.onload = () => { if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; } };
    iframe.src = blobUrl;

    $('btn-open-tab').addEventListener('click', async () => {
      const html2 = await buildPreviewHTML(row);
      const blob2 = new Blob([html2], { type: 'text/html' });
      const url2  = URL.createObjectURL(blob2);
      window.open(url2, '_blank');
      setTimeout(() => URL.revokeObjectURL(url2), 5000);
    });

  } catch (e) {
    $('no-session').style.display = 'flex';
    $('no-session').innerHTML = `<p>Erreur preview : ${e.message}</p><a href="clients.html" class="btn-save" style="text-decoration:none;padding:6px 14px">← Revenir à la liste</a>`;
  }
}

init();
```

- [ ] **Step 3: Manual test**

- From `clients.html` → Prévisualiser on any row → `preview.html` loads with couple name in topbar and site in iframe
- "Ouvrir dans un nouvel onglet" → site opens in new browser tab

- [ ] **Step 4: Commit**

```bash
git add studio/preview.html studio/preview.js
git commit -m "feat: preview.html — aperçu plein écran 3 templates"
```

```json:metadata
{"files": ["studio/preview.html", "studio/preview.js"], "verifyCommand": "open preview.html after setting sessionStorage.wedoria_current", "acceptanceCriteria": ["correct template loaded by row.template value", "iframe displays site", "topbar shows couple + template name", "open in new tab works", "empty session shows fallback message"], "requiresUserVerification": false}
```

---

## Task 7: Intégration end-to-end + validation utilisateur

**Goal:** Verify the full flow works: create → edit all tabs → save → preview → reopen from clients list → all data intact.

**Files:**
- No code changes — this is a verification task.
- (If issues found: fix in previous task files, re-commit.)

**Acceptance Criteria — spec criteria met:**
- [ ] On peut créer un nouveau mariage depuis zéro sans toucher un fichier
- [ ] On peut éditer tous les champs (histoire, programme, galerie, lieux, FAQ)
- [ ] On peut choisir entre 3 templates et prévisualiser le résultat
- [ ] On peut uploader des photos ou coller une URL
- [ ] La sauvegarde Supabase fonctionne et persiste entre sessions
- [ ] La preview plein écran est fidèle au vrai site

**Steps:**

- [ ] **Step 1: Run full flow**

1. Open `studio/clients.html`
2. Click "+ Nouveau mariage"
3. In Infos: enter "Sophie" + "Thomas", date "12 juillet 2025", ISO "2025-07-12T14:00:00"
4. In Contenu: add 1 histoire item, 1 programme item
5. In Médias: paste a test URL in Photo couple
6. In Thème: change Principale color + click Générer palette
7. In Template: select "Romantique"
8. Click "Sauvegarder" → green toast appears
9. Click "Prévisualiser →" → preview.html shows Romantique template
10. Navigate back → click "Ouvrir dans un nouvel onglet" → site opens

- [ ] **Step 2: Persistence check**

1. Close browser, reopen `studio/clients.html`
2. Row "Sophie & Thomas" appears in table
3. Click "Éditer" → studio.html opens with all fields populated
4. Switch to Contenu tab → histoire + programme items present
5. Switch to Template tab → Romantique selected

- [ ] **Step 3: User verification (see below)**

**User Verification Required:**
Before marking this task complete, you MUST call AskUserQuestion:
```yaml
AskUserQuestion:
  question: "Avez-vous pu tester le flux complet (créer → éditer → sauvegarder → prévisualiser) ? Tous les critères de succès sont-ils remplis ?"
  header: "Validation Sprint 2"
  options:
    - label: "Oui — tout fonctionne"
      description: "Le sprint est validé, on peut archiver index.html et passer à la suite"
    - label: "Problème(s) détecté(s)"
      description: "Décrire ce qui ne marche pas pour corriger"
```

- [ ] **Step 4: Remove old studio files (only after user confirms above)**

```bash
git rm studio/index.html studio/script.js
git commit -m "chore: supprimer ancienne version studio (index.html + script.js)"
```

```json:metadata
{"files": [], "verifyCommand": "manual flow test", "acceptanceCriteria": ["create from scratch works", "all content tabs editable", "3 templates selectable and previewable", "photo upload + URL works", "Supabase persists between sessions", "preview matches real site"], "requiresUserVerification": true, "userVerificationPrompt": "Avez-vous pu tester le flux complet (créer → éditer → sauvegarder → prévisualiser) ? Tous les critères de succès sont-ils remplis ?"}
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|-----------------|------|
| `clients.html` — list, CRUD actions, states | Task 2 |
| `studio.html` — 5 tabs + save + nav | Task 3 |
| Onglet Infos | Task 3 |
| Onglet Contenu — 6 dynamic lists | Task 4 |
| Onglet Médias — upload + URL | Task 5 |
| Onglet Thème — colors + fonts + dress | Task 5 |
| Onglet Template — 3 radios | Task 5 |
| `preview.html` — iframe + open in tab | Task 6 |
| All 3 templates in preview | Task 6 |
| Supabase CRUD layer | Task 0 |
| Shared CSS | Task 1 |
| `sessionStorage` as inter-page transport | Task 2, 3, 6 |
| Photo upload (Supabase Storage) | Task 0 + 5 |
| Slug auto-generated on new mariage | Task 0 (`makeSlug`) |
| Manual save only (no auto-save) | Task 3 |
| Save feedback "Sauvegardé ✓" 2s | Task 3 |
| Empty / loading / error states on clients | Task 2 |
| Confirm before delete | Task 2 |
| Duplicate | Task 2 |
| User verification of success criteria | Task 7 |

All requirements covered. ✓

### Verification requirement

YES — Task 7 has `requiresUserVerification: true` and the standard AskUserQuestion block. ✓
