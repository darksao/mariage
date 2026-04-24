# Wedding Template Engine — Design Spec
**Date :** 2026-04-11  
**Statut :** Approuvé

---

## Contexte & Objectif

Transformer le site de mariage statique (Catherine & Nhu-Sao) en un moteur de templates réutilisable. Objectif : déployer un nouveau site personnalisé pour un client en moins de 30 minutes, en ne touchant qu'un seul fichier (`config.js`).

Le client remplit un formulaire d'onboarding (14 sections). Ce formulaire est transmis à Claude qui génère le `config.js` correspondant.

---

## Architecture : Template Fork (Option A)

Chaque client reçoit une **copie indépendante** du dossier `template/`. Pas de dépendance partagée entre clients.

### Structure des fichiers

```
wedoria-studio/
├── index.html          ← site Catherine & Nhu-Sao (inchangé)
├── config.js
├── script.js
├── style.css
├── supabase-config.js
│
└── template/           ← MOTEUR — ne pas modifier sauf évolution produit
    ├── index.html      ← squelette 100% générique
    ├── config.js       ← à remplir pour chaque client
    ├── script.js       ← moteur de rendu (ne pas toucher)
    ├── style.css       ← styles (ne pas toucher)
    └── supabase-config.js  ← credentials Supabase (1 projet Supabase par client)
```

### Workflow nouveau client

1. Copier `template/` → `clients/prenom1-prenom2/`
2. Remplir `config.js` depuis le formulaire d'onboarding
3. Déposer les médias (vidéo, photo couple, galerie) dans le dossier
4. Créer un projet Supabase dédié, mettre à jour `supabase-config.js`
5. Déployer sur Vercel → URL personnalisée (ex: `sophie-thomas.wedoria.fr`)

---

## Schéma `config.js` (objet MARIAGE)

```js
const MARIAGE = {
  // 01 — Mariés
  prenom1: "",  nom1: "",
  prenom2: "",  nom2: "",

  // 02 — Date & Lieu
  date_affichage: "",       // "Samedi 12 Juillet 2025"
  date_iso:       "",       // "2025-07-12T14:00:00" (pour compte à rebours)
  rsvp_deadline:  "",       // "1er Mai 2025"
  domaine:        "",
  ville:          "",

  // 03 — Contact
  email:    "",
  whatsapp: "",             // null = masqué dans la FAQ

  // 04 — Langues actives
  langues: ["fr"],          // ["fr", "en"] ou ["fr", "vi"] etc.

  // 05 — Photo couple
  photo_couple:         null,  // "photo-couple.jpg" ou null = section masquée
  photo_couple_caption: "",

  // 06 — Textes intro
  hero_intro:   "Vous êtes invités au mariage de",
  hero_cta:     "Confirmer ma présence",
  scroll_label: "Découvrir",
  citation:     "",
  bandeau:      [],         // ["Mot1", "Mot2", ...] — [] = bandeau masqué
  sr_line1:     "Avant ce jour,",
  sr_line2:     "notre histoire s'écrivait",

  // 07 — Notre Histoire
  histoire_eyebrow: "",
  histoire_titre:   "Notre Histoire",
  histoire: [
    { annee: "", titre: "", texte: "", align: "left" },
    // blocs avec texte vide sont filtrés automatiquement
  ],

  // 08 — Programme
  programme_eyebrow: "",
  programme_titre:   "Le Jour J",
  programme: [
    { heure: "", icon: "💍", titre: "", lieu: "" },
  ],

  // Galerie (photos section 13 du formulaire)
  galerie_eyebrow: "",
  galerie_titre:   "Le Domaine",
  galerie_hint:    "",
  galerie: [
    { icon: "🏰", label: "", photo: null }, // null = icône placeholder
  ],

  // 09 — Lieux
  lieux_eyebrow: "",
  lieux_titre:   "Les Lieux",
  lieux: [
    { icon: "⛪", type: "", nom: "", adresse: [], featured: false, badge: "", btn: { label: "Voir sur la carte", href: "#map" } },
    { icon: "🏰", type: "", nom: "", adresse: [], featured: true,  badge: "Lieu principal", btn: { label: "Voir sur la carte", href: "#map" } },
    { icon: "🏨", type: "", nom: "", adresse: [], featured: false, badge: "", btn: { label: "Plus d'infos", href: "#infos" } },
    // entrée avec nom: "" → masquée
  ],
  carte: { lat: null, lng: null, zoom: 14, nom: "", caption: "" },
  // carte masquée si lat/lng sont null

  // 10 — Dress code
  dress_eyebrow: "Pour l'occasion",
  dress_titre:   "Code Vestimentaire",
  dress_intro:   "",
  dress_couleurs: [
    { nom: "", hex: "", eviter: false },
  ],

  // 11 — Infos pratiques
  infos_eyebrow: "Tout ce qu'il faut savoir",
  infos_titre:   "Infos Pratiques",
  infos: [
    { icon: "🚗", titre: "Parking",      texte: "" },
    { icon: "🚂", titre: "Train",        texte: "" },
    { icon: "🏨", titre: "Hébergement",  texte: "" },
    { icon: "👶", titre: "Enfants",      texte: "" },
    { icon: "📸", titre: "Photos",       texte: "" },
    // lignes avec texte: "" filtrées automatiquement
  ],

  // 12 — FAQ
  faq_titre: "Questions fréquentes",
  faq: [
    { q: "", r: "" },
    // Q&R avec q: "" filtrées automatiquement
  ],

  // 13 — Vidéo hero
  video_hero: {
    type: "local",    // "local" | "url" | "none"
    src:  "hero.mp4", // chemin relatif ou URL complète ; ignoré si type: "none"
  },

  // i18n — traductions optionnelles (même structure que l'original)
  // Règle : si "en" est dans langues[], i18n.en doit être rempli — sinon le sélecteur de langue est masqué
  i18n: {
    en: { /* ... */ },
    vi: { /* ... */ },
  },
};
```

---

## Changements dans `index.html`

### Initiales codées en dur → remplies par JS

| Zone | Avant | Après |
|---|---|---|
| Loader monogram | `C ◆ N` hardcodé | `<span id="loader-p1"></span> ◆ <span id="loader-p2"></span>` |
| Nav logo | `C & N` hardcodé | `<span id="nav-p1"></span> & <span id="nav-p2"></span>` |
| Hero monogram | `C ◆ N` hardcodé | ids injectés par JS |
| `<title>` | "Mariage · 18 Octobre 2026" | rempli par JS depuis config |

Tout le reste du HTML est déjà des conteneurs vides avec des `id` — aucun autre changement nécessaire.

### Nouveau : section bandeau défilant

Ajout d'un `<div id="bandeau-section">` entre la section Histoire et la section Programme. Masqué par défaut, affiché si `MARIAGE.bandeau.length > 0`.

---

## Moteur de rendu (`script.js`)

### Masquage automatique des sections

Règle unique : si la donnée pilotant une section est vide/null, la section est masquée et son lien de nav retiré.

| Section | Condition de masquage |
|---|---|
| Photo couple | `photo_couple === null` |
| Bandeau défilant | `bandeau.length === 0` |
| Hôtel (dans Lieux) | `lieux[2].nom === ""` |
| Carte | `carte.lat === null` |
| Infos individuelles | `texte === ""` |
| Blocs histoire | `texte === ""` |
| FAQ entries | `q === ""` |

### Vidéo hero flexible

```
type: "local"  → <video src="hero.mp4"> (comportement actuel)
type: "url"    → <video src="https://..."> (stock ou WeTransfer)
type: "none"   → <video> retiré, fond sombre fixe sur le hero
```

### Bandeau défilant (nouveau)

- Rendu CSS pur, animation `@keyframes scroll-left` en boucle infinie
- Mots séparés par `◆` , texte en capitales espacées
- Fond : `sect-dark` (cohérent avec la section Programme qui suit)
- Vitesse : 30s pour un cycle complet (ajustable via variable CSS)

---

## Ce qui ne change pas

- Animations GSAP (loader, scroll reveals, sticky reveal)
- Feuille de style complète
- Intégration Supabase RSVP
- Système i18n (FR/EN/VI)
- Carte Leaflet
- Compte à rebours

---

## Ce qui est supprimé

- Dossier `Nouveaux clients/` (prototype Gemma4 — remplacé par `template/`)

---

## Hors scope

- Interface d'administration pour gérer les clients
- Génération automatique du `config.js` (Claude le remplit manuellement depuis le formulaire)
- Support d'une langue "autre" non pré-traduite (à traiter au cas par cas)
