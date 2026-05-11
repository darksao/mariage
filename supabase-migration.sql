-- Wedoria Studio — Migration Supabase
-- À coller dans : Supabase > SQL Editor > New query > Run

-- Table leads (contacts reçus via le formulaire vitrine)
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  prenom1       text not null,
  prenom2       text,
  email         text not null,
  telephone     text,
  date_mariage  text,
  message       text,
  statut        text not null default 'nouveau'
    check (statut in ('nouveau', 'contacté', 'signé', 'perdu'))
);

-- Table projets (mariages en cours / livrés)
create table if not exists projets (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  lead_id             uuid references leads(id) on delete set null,
  prenom1             text not null,
  prenom2             text,
  email_client        text not null,
  date_mariage        text,
  template            text,
  formule             text check (formule in ('essentielle', 'premium', 'sur-mesure')),
  couleur_primaire    text,
  couleur_secondaire  text,
  police              text,
  lieu                text,
  programme           text,
  infos_pratiques     text,
  statut              text not null default 'en cours'
    check (statut in ('en cours', 'livré', 'archivé')),
  url_site            text,
  livre_at            timestamptz
);

-- Table livre_or (messages des invités sur les sites mariage)
create table if not exists livre_or (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  template_id text not null,
  prenom      text not null,
  message     text not null
);

-- RLS livre_or : lecture publique, écriture publique (invités sans compte)
alter table livre_or enable row level security;
create policy "livre_or_select" on livre_or for select using (true);
create policy "livre_or_insert" on livre_or for insert with check (true);

-- Désactiver RLS pour l'accès server-side (service_key)
alter table leads   disable row level security;
alter table projets disable row level security;
