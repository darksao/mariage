# Wedoria Studio — Guide d'utilisation

> Outil interne Wedoria. Pas de login requis.

---

## Vue d'ensemble

Le studio est composé de **3 pages** :

| Page | URL | Rôle |
|------|-----|------|
| Liste clients | `studio/clients.html` | Accueil — liste de tous les mariages |
| Éditeur | `studio/studio.html` | Formulaire de personnalisation |
| Preview | `studio/preview.html` | Aperçu plein écran du site |

---

## 1. Liste clients (`clients.html`)

Page d'accueil du studio. Affiche tous les mariages enregistrés.

### Actions disponibles

- **+ Nouveau mariage** (topbar) — crée un projet vide avec valeurs par défaut
- **Éditer** — ouvre le projet dans l'éditeur
- **Prévisualiser** — ouvre l'aperçu plein écran directement
- **Dupliquer** — copie un projet existant (utile pour repartir d'une base)
- **Supprimer** — supprime définitivement (confirmation requise)

### Informations affichées par mariage

- Noms du couple
- Date du mariage
- Template utilisé (base / romantique / chic)
- Date de dernière modification

---

## 2. Éditeur (`studio.html`)

Formulaire pleine largeur organisé en **onglets thématiques**.

> Les données sont sauvegardées manuellement via le bouton **Sauvegarder**.  
> La sauvegarde est en base Supabase — pas de fichier local à gérer.

### Navigation

```
clients.html → [Éditer]        → studio.html
studio.html  → [Prévisualiser] → preview.html
preview.html → [← Retour]     → studio.html
```

### Onglets du formulaire

| Onglet | Contenu |
|--------|---------|
| **Infos** | Mariés, date, lieu, contact, vidéo hero, RSVP deadline |
| **Contenu** | Histoire, programme, lieux + carte, galerie, FAQ, infos pratiques |
| **Médias** | Photos couple + ambiances + upload galerie photos |
| **Thème** | Couleurs, typographie, dress code |
| **Template** | Sélecteur base / romantique / chic |

Les sections à liste (histoire, programme, galerie…) ont un bouton **+ Ajouter** et un **×** par ligne.

### Topbar de l'éditeur

```
◆ STUDIO  Sophie & Thomas — 12 Juil 2025   [← Clients]  [Sauvegarder]  [Prévisualiser →]
```

---

## 3. Preview (`preview.html`)

Affiche le site généré en plein écran dans un iframe.

**Topbar :**
```
[← Retour au studio]   Sophie & Thomas · Romantique   [↗ Ouvrir dans un nouvel onglet]
```

- Lit `sessionStorage.wedoria_current` pour générer le site
- Charge le bon template selon le champ `template` (`base` / `romantique` / `chic`)
- **Ouvrir dans un nouvel onglet** — voir le site comme un invité le verrait
- Si accès direct sans session : message "Aucun site à afficher" + lien vers `clients.html`

---

## Gestion des photos

3 méthodes disponibles, toutes compatibles :

| Méthode | Usage |
|---------|-------|
| **Upload direct** | Glisser-déposer ou sélectionner → stocké dans Supabase Storage (`/photos/{slug}/`) |
| **URL externe** | Coller un lien (Google Photos, Cloudinary, etc.) |
| **Chemin manuel** | Indiquer un chemin local si les photos sont déposées manuellement sur le serveur |

---

## Base de données (Supabase)

Table `mariages` :

| Champ | Description |
|-------|-------------|
| `id` | Identifiant unique (UUID) |
| `slug` | ex: `sophie-thomas-2025` |
| `template` | `base` / `romantique` / `chic` |
| `config` | Toutes les données du mariage (JSON) |
| `created_at` | Date de création |
| `updated_at` | Date de dernière sauvegarde |

---

*Document mis à jour en parallèle des décisions de design — Sprint 2.*
