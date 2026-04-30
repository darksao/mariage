# Wedoria Studio — Sprint 2 Design Spec
**Date :** 2026-04-24  
**Scope :** Studio de personnalisation — MVP multi-pages + Supabase

---

## Contexte

Le studio actuel (`studio/index.html`) est un outil interne qui permet de charger un `config.js`, d'éditer les données d'un mariage, et d'exporter un nouveau `config.js`. Il ne supporte qu'un seul template (`template/`), ne gère pas les champs avancés (histoire, programme, galerie, lieux, FAQ), et ne persiste rien en base.

Le Sprint 2 remplace ce studio par une application 3 pages avec persistance Supabase.

---

## Architecture

### Fichiers

```
studio/
  clients.html          ← page d'accueil, liste des mariages
  clients.js
  studio.html           ← éditeur (remplace index.html)
  studio.js
  studio-supabase.js    ← lecture/écriture Supabase
  preview.html          ← aperçu plein écran
  preview.js
  style.css             ← styles communs
```

### Navigation

```
clients.html → [+ Nouveau]      → studio.html (objet vide)
clients.html → [Éditer]         → studio.html (chargé depuis Supabase par id)
clients.html → [Prévisualiser]  → preview.html
studio.html  → [Prévisualiser]  → preview.html
preview.html → [← Retour]      → studio.html
```

### Passage de données

`sessionStorage` clé `wedoria_current` — objet MARIAGE complet en JSON.  
Supabase est la source de vérité. `sessionStorage` est le transport entre pages.

---

## Supabase

### Table `mariages`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | `uuid` PK | Généré automatiquement |
| `slug` | `text` | ex: `sophie-thomas-2025` |
| `template` | `text` | `base` / `romantique` / `chic` |
| `config` | `jsonb` | Objet MARIAGE complet |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Mis à jour à chaque sauvegarde |

### Bucket Storage

Nom : `photos`  
Structure : `/photos/{slug}/nom-fichier.jpg`  
Accès : public (URLs directement injectées dans le config)

### Accès

Clé anon Supabase existante (`.env.local`). Pas de RLS — outil interne uniquement.

### Opérations

- `clients.html` — `SELECT id, slug, template, config, updated_at`
- `studio.html` — `SELECT *` par id, `UPSERT` sur sauvegarde manuelle
- Sauvegarde **manuelle** (bouton) — pas d'auto-save pour éviter les sauvegardes partielles

---

## Page 1 — `clients.html`

### Topbar
```
◆ WEDORIA STUDIO                    [+ Nouveau mariage]
```

### Tableau

Colonnes : Couple · Date · Template · Dernière modif · Actions

Actions par ligne :
- **Éditer** — charge dans studio.html
- **Prévisualiser** — charge dans preview.html
- **Dupliquer** — copie le config, nouveau slug, nouveau id
- **Supprimer** — confirmation avant suppression définitive

### États

- **Chargement** — spinner pendant le fetch Supabase
- **Vide** — "Aucun mariage · Créez votre premier projet →" + bouton centré
- **Erreur** — message d'erreur Supabase affiché

---

## Page 2 — `studio.html`

### Topbar
```
◆ STUDIO  Sophie & Thomas — 12 Juil 2025   [← Clients]  [Sauvegarder]  [Prévisualiser →]
```

### Onglets

| # | Onglet | Contenu |
|---|--------|---------|
| 1 | **Infos** | Mariés (prénom/nom ×2), date affichée, date ISO, deadline RSVP, domaine, ville, email, WhatsApp, vidéo hero (type + src), intro RSVP |
| 2 | **Contenu** | Histoire (liste), programme (liste), lieux (liste) + carte, galerie domaine (liste : icône + label + photo), FAQ (liste), infos pratiques (liste) |
| 3 | **Médias** | Photo couple + légende, photos ambiance ×3, galerie photos du couple (grille uploadable, lightbox sur le site) |
| 4 | **Thème** | Couleurs (palette + génération auto), typographie (serif + sans), dress code |
| 5 | **Template** | Sélecteur base / romantique / chic |

### Listes dynamiques (onglet Contenu)

Chaque section à items multiples (histoire, programme, galerie domaine, lieux, FAQ, infos) suit le même pattern :
- Bouton **+ Ajouter** crée un nouveau bloc
- Chaque bloc a un **×** pour supprimer
- Drag-to-reorder non inclus dans ce sprint (nice-to-have)

### Sélecteur de template (onglet Template)

- 3 options : Base · Romantique · Chic
- Changer de template met à jour `config.template` et est pris en compte au prochain "Prévisualiser"
- Pas de warning pour ce sprint (nice-to-have)

### Sauvegarde

Bouton "Sauvegarder" → `UPSERT` dans Supabase + feedback visuel ("Sauvegardé ✓" pendant 2s).  
Si nouveau mariage (pas encore en base) : INSERT avec slug auto-généré depuis prénom1 + prénom2 + année.

---

## Page 3 — `preview.html`

### Topbar
```
[← Retour au studio]   Sophie & Thomas · Romantique   [↗ Ouvrir dans un nouvel onglet]
```

### Fonctionnement

1. Lit `sessionStorage.wedoria_current`
2. Charge les assets du bon template (`template/`, `templates/romantique/`, ou `templates/chic/`)
3. Reconstruit le blob HTML (même logique que `buildPreviewHTML` actuel)
4. Affiche dans un iframe plein écran

### États

- **Si session vide** (accès direct) : "Aucun site à afficher" + lien vers `clients.html`
- **Ouvrir dans un nouvel onglet** : ouvre le blob dans un vrai onglet navigateur

---

## Gestion des photos

3 méthodes, toutes compatibles dans le même champ :

| Méthode | Fonctionnement |
|---------|---------------|
| **Upload direct** | Drag-drop ou picker → `supabase.storage.upload()` → URL publique injectée |
| **URL externe** | Champ texte libre — coller un lien (Cloudinary, Google Photos…) |
| **Chemin manuel** | Champ texte libre — chemin relatif si photos déposées manuellement |

L'interface propose les 3 méthodes dans chaque slot photo (onglet Médias).

---

## Ce qui n'est PAS dans ce sprint

- Drag-to-reorder des listes
- Warning template / champs incompatibles
- Auto-save
- Accès client (auth, portail couple)
- Déploiement automatique Vercel depuis le studio
- i18n / traductions dans le formulaire

---

## Critères de succès

- [ ] On peut créer un nouveau mariage depuis zéro sans toucher un fichier
- [ ] On peut éditer tous les champs (y compris histoire, programme, galerie, lieux, FAQ)
- [ ] On peut choisir entre 3 templates et prévisualiser le résultat
- [ ] On peut uploader des photos ou coller une URL
- [ ] La sauvegarde Supabase fonctionne et persiste entre sessions
- [ ] La preview plein écran est fidèle au vrai site
