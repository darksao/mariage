# Personnalisation & Industrialisation des Templates Mariage
**Date :** 2026-05-10  
**Statut :** Validé par PM  
**Templates concernés :** romantique, chic, champêtre

---

## Objectif

Enrichir les 3 templates mariage existants avec des personnalisations uniques au couple (photos, chanson, hashtag, livre d'or…) et unifier leur schéma `config.js` pour qu'intégrer un nouveau couple prenne 20 min quel que soit le template choisi.

---

## Approche retenue

**Industrialisation complète** :
1. Un schéma `config.js` commun aux 3 templates (mêmes champs, même structure)
2. Brancher tous les champs médias déjà déclarés mais nuls (photos histoire, photos ambiance, vidéo hero)
3. Ajouter les nouvelles sections manquantes dans les templates concernés
4. Ajouter le livre d'or (formulaire + Supabase + carrousel défilant)

---

## Schéma `config.js` unifié

Tous les champs ci-dessous doivent être présents dans les 3 `config.js`. Les valeurs peuvent être vides/null si non utilisées.

### Champs existants — à uniformiser

```js
const MARIAGE = {
  // Identité
  prenom1, nom1, prenom2, nom2,
  date_affichage, date_iso, rsvp_deadline,
  domaine, ville,
  email, whatsapp,
  langues,                     // ex: ["fr"] ou ["fr", "en"]

  // Hero
  photo_couple,                // chemin fichier image couple
  photo_couple_caption,
  hero_intro, hero_cta, scroll_label,
  citation,
  video_hero: { type, src },   // type: "none" | "mp4" | "youtube"

  // Histoire
  histoire_eyebrow, histoire_titre,
  histoire: [
    { annee, titre, texte, align, photo }  // photo: chemin ou null
  ],

  // Programme
  programme_eyebrow, programme_titre,
  programme: [ { heure, icon, titre, lieu } ],

  // Galerie / photos lieu
  galerie_eyebrow, galerie_titre,
  galerie: [ { icon, label, photo } ],
  photos: [ { src, alt } ],
  photos_ambiance: [ { src, position } ],  // 3 slots, pleine largeur

  // Lieux & carte
  lieux_eyebrow, lieux_titre,
  lieux: [ { icon, type, nom, adresse, featured, badge, btn } ],
  carte: { lat, lng, zoom, nom, adresse, caption },

  // RSVP
  rsvp_titre, rsvp_intro,

  // Infos pratiques
  infos_eyebrow, infos_titre,
  infos: [ { icon, titre, texte } ],

  // FAQ
  faq_titre,
  faq: [ { q, r } ],
};
```

### Nouveaux champs — à ajouter aux 3 templates

```js
  // Identité visuelle du couple
  palette: [
    { nom: "Rose poudré", hex: "#F2D4D7", eviter: false },
    { nom: "Blanc pur",   hex: "#FFFFFF",  eviter: true  },
  ],

  // Hashtag Instagram
  hashtag: "#PrénomEtPrénom",   // "" si non utilisé

  // Leur chanson (section dédiée)
  chanson: {
    titre:       "La Vie en Rose",
    artiste:     "Édith Piaf",
    description: "La chanson qui a bercé notre première danse.",
    spotify_url: "",             // optionnel — lien Spotify embed
  },

  // Souhaits / liste de mariage  (était seulement dans romantique)
  souhaits_titre: "Notre Liste de Mariage",
  souhaits: [
    { emoji: "✈️", titre: "Voyage de noces", description: "...", lien: "" }
  ],

  // Activités guests  (était seulement dans champetre)
  activites_titre: "Au Programme pour Vous",
  activites: [
    { emoji: "🌿", titre: "Balade dans les jardins", description: "..." }
  ],

  // Mot des mariés  (était seulement dans romantique)
  mot_des_maries: "Merci d'être là pour partager ce moment avec nous.",

  // Livre d'or
  livre_or: {
    titre: "Livre d'Or",
    intro: "Laissez-nous un mot, il nous accompagnera toute notre vie.",
    actif: true,               // false = section masquée
  },
```

---

## Nouvelles sections à ajouter par template

| Section | Romantique | Chic | Champêtre |
|---------|-----------|------|-----------|
| `chanson` | ➕ à créer | ➕ à créer | ➕ à créer |
| `livre_or` | ➕ à créer | ➕ à créer | ➕ à créer |
| `souhaits` | ✅ existe | ➕ à créer | ➕ à créer |
| `activites` | ➕ à créer | ➕ à créer | ✅ existe |
| `mot_des_maries` | ✅ existe | ➕ à créer | ➕ à créer |
| `palette` dans dress code | ✅ `dress_couleurs` → renommer | ✅ existe → renommer | ✅ existe → renommer |
| `hashtag` dans footer | ➕ à créer | ➕ à créer | ➕ à créer |

---

## Médias à brancher

Trois types de médias sont déclarés dans les configs mais non affichés :

### 1. Photos par chapitre d'histoire (`histoire[n].photo`)
- Si `photo` est non null, afficher l'image à côté du texte de ce chapitre
- Si null, afficher le style textuel actuel (pas de régression)

### 2. Photos ambiance (`photos_ambiance`)
- 3 photos en section pleine largeur entre les sections de contenu
- Si toutes nulles : section masquée

### 3. Vidéo hero (`video_hero`)
- `type: "mp4"` → `<video>` autoplay muted loop en fond du hero
- `type: "none"` → comportement actuel (image fixe)

---

## Section Livre d'Or — détail

### Comportement
- Formulaire : champ prénom + champ message (textarea) + bouton envoyer
- Soumission → insertion dans Supabase table `livre_or` (colonnes : `id`, `created_at`, `template_id`, `prenom`, `message`)
- Affichage : carrousel défilant vertical CSS pur, identique au hero-scroll-up de la vitrine

### Mécanique carrousel
```css
.livreor-track {
  display: flex;
  flex-direction: column;
  animation: scroll-up 30s linear infinite;
}
@keyframes scroll-up {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}
```
Les messages sont dupliqués en HTML pour la boucle seamless (même technique que la vitrine).

### Chargement des messages
- Fetch Supabase au chargement de la page (`GET /livre_or?template_id=eq.xxx`)
- Si 0 messages : section masquée ou message placeholder selon `livre_or.actif`
- Pas de realtime — refresh de page pour voir les nouveaux messages

### Structure Supabase
```sql
CREATE TABLE livre_or (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  template_id text NOT NULL,   -- ex: "mei-hiroshi-romantique"
  prenom      text NOT NULL,
  message     text NOT NULL
);
```

### Carte d'un message
```
┌──────────────────────────────┐
│  "                           │
│  On est si heureux pour vous │
│  deux ! Profitez de chaque   │
│  instant ♡                   │
│  ─────────────────           │
│  Sophie & Antoine            │
└──────────────────────────────┘
```

---

## Périmètre hors-scope

- Upload de photos par les mariés eux-mêmes (intégration manuelle par Wedoria)
- Modération des messages du livre d'or (ajout ultérieur possible)
- Multilangue i18n (champ `langues` conservé mais non implémenté dans ce sprint)
- Realtime du livre d'or (refresh page suffisant pour l'instant)

---

## Ordre d'implémentation recommandé

1. **Schéma unifié** — mettre à jour les 3 `config.js` avec tous les champs manquants (valeurs vides)
2. **Brancher médias** — photos histoire + photos ambiance + vidéo hero (3 templates)
3. **Sections existantes manquantes** — copier `souhaits`, `activites`, `mot_des_maries` dans les templates qui ne les ont pas
4. **Nouvelles sections** — `chanson` + `hashtag` footer (3 templates)
5. **Livre d'or** — table Supabase + formulaire + carrousel (3 templates)
