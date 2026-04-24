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

function show(id) { $(id).classList.remove('hidden'); }
function hide(id) { $(id).classList.add('hidden'); }

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

function navNew()      { sessionStorage.removeItem('wedoria_current'); location.href = 'studio.html'; }
function navEdit(id)   { location.href = `studio.html?id=${id}`; }
function navPreview(m) { sessionStorage.setItem('wedoria_current', JSON.stringify(m)); location.href = 'preview.html'; }

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
