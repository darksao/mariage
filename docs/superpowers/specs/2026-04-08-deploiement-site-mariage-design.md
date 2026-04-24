# Design — Mise en ligne du site de mariage

**Date :** 2026-04-08  
**Projet :** Site mariage Catherine & Nhu-Sao  
**Dossier source :** `site-invites/`

---

## Objectif

Mettre le site de mariage en ligne avec une URL gratuite, et collecter les RSVP des invités dans un tableau de bord (CRM) accessible aux mariés.

---

## Architecture

```
Invité
  │
  ▼
site-invites/ (hébergé sur Vercel)
  │
  ▼ (soumission formulaire RSVP)
Supabase — table `rsvp`
  │
  ▼
Tableau de bord Supabase (consulté par les mariés)
```

---

## 1. Hébergement — Vercel

- Le dossier `site-invites/` est déployé sur Vercel en tant que site statique
- URL publique : `*.vercel.app` (ex: `catherine-nhusao.vercel.app`)
- Déploiement initial via CLI Vercel (`npx vercel`)
- Les mises à jour futures se font en relançant la commande de déploiement

---

## 2. Base de données RSVP — Supabase

Table `rsvp` avec les colonnes suivantes :

| Colonne                  | Type        | Nullable | Description                                 |
|--------------------------|-------------|----------|---------------------------------------------|
| `id`                     | uuid (PK)   | non      | Identifiant unique, généré automatiquement  |
| `created_at`             | timestamptz | non      | Horodatage automatique                      |
| `prenom`                 | text        | non      | Prénom de l'invité principal                |
| `nom`                    | text        | non      | Nom de l'invité principal                   |
| `email`                  | text        | non      | Email de l'invité                           |
| `presence`               | text        | non      | `"oui"` ou `"non"`                          |
| `invites`                | text        | oui      | Nombre d'accompagnants (valeur du select)   |
| `prenoms_accompagnants`  | text        | oui      | Prénoms des accompagnants (si invites > 0)  |
| `menu`                   | text        | oui      | `"normal"` ou `"vegetarien"`               |
| `allergies`              | text        | oui      | Allergies ou restrictions alimentaires      |
| `message`                | text        | oui      | Message pour les mariés                     |

**Sécurité (RLS) :**
- `INSERT` autorisé pour tous (public) — les invités peuvent soumettre le formulaire
- `SELECT` restreint aux utilisateurs authentifiés — seuls les mariés voient les données

---

## 3. Intégration formulaire

### Fichiers modifiés
- `site-invites/index.html` — ajout du CDN Supabase JS
- `site-invites/script.js` — remplacement du `localStorage` par un appel Supabase
- `site-invites/supabase-config.js` — clés de connexion Supabase (nouveau fichier)

### Nouveau champ dynamique
Quand l'invité sélectionne "1 accompagnant" ou plus dans le select `f-invites`, un champ texte apparaît :
- Label : "Prénom(s) de votre/vos accompagnant(s)"
- Placeholder : "Ex : Marie, Pierre"
- Requis si `invites != "Seul(e)"`

### Comportement du formulaire
1. Validation côté client (comportement actuel conservé)
2. Envoi à Supabase via `supabase.from('rsvp').insert({...})`
3. En cas de succès → affichage du message de confirmation (comportement actuel)
4. En cas d'erreur réseau → message d'erreur simple à l'utilisateur

---

## 4. Hors scope (à faire plus tard)

- Notifications email (Resend) — différé
- Nom de domaine personnalisé
- Galerie photos (placeholders dans le config)

---

## Critères de succès

- [ ] Le site est accessible sur une URL publique `*.vercel.app`
- [ ] Un invité peut soumettre le formulaire RSVP
- [ ] La réponse apparaît dans le tableau Supabase
- [ ] Le champ "prénoms des accompagnants" s'affiche quand invites > 0
- [ ] Les données ne sont lisibles que par les mariés (RLS activé)
