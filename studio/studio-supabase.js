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

  // Requires mariages.id to have a server-side default (gen_random_uuid())
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
