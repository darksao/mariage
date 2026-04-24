# Wedding Template Engine — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer un dossier `template/` contenant un moteur de site mariage générique de même qualité que le site Catherine & Nhu-Sao, entièrement piloté par `config.js`.

**Architecture:** Template Fork — chaque client reçoit une copie indépendante du dossier `template/`. Le seul fichier à modifier est `config.js`. Les sections dont les données sont vides se masquent automatiquement.

**Tech Stack:** Vanilla JS, GSAP 3 + ScrollTrigger, Leaflet, Supabase JS v2, CSS custom properties.

**User Verification:** NO

**Spec:** `docs/superpowers/specs/2026-04-11-wedding-template-engine-design.md`

---

## Fichiers concernés

| Fichier | Action |
|---|---|
| `template/index.html` | Créer — squelette générique basé sur `index.html` |
| `template/config.js` | Créer — objet MARIAGE complet (template vierge) |
| `template/script.js` | Créer — moteur adapté depuis `script.js` |
| `template/style.css` | Créer — copie de `style.css` + styles bandeau |
| `template/supabase-config.js` | Créer — credentials vides |
| `Nouveaux clients/` | Supprimer — remplacé par template/ |

---

## Task 0 : Squelette template/ — fichiers statiques

**Goal:** Créer les 3 fichiers qui ne demandent pas de logique : `index.html`, `style.css`, `supabase-config.js`.

**Files:**
- Create: `template/index.html`
- Create: `template/style.css`
- Create: `template/supabase-config.js`

**Acceptance Criteria:**
- [ ] `template/index.html` n'a aucun nom/initiale codé en dur
- [ ] `template/index.html` contient `#bandeau-section` entre `#histoire` et `#programme`
- [ ] `template/style.css` contient les classes `.bandeau-section` et `.bandeau-track`
- [ ] `template/supabase-config.js` contient des chaînes placeholder, pas de vraies clés

**Verify:** Ouvrir `template/index.html` dans le navigateur → la page charge sans erreur JS (vide, car config.js et script.js pas encore là).

**Steps:**

- [ ] **Step 1 : Créer `template/supabase-config.js`**

```js
// Remplacer par les clés de votre projet Supabase
// Créez un nouveau projet sur https://supabase.com pour chaque client
const SUPABASE_URL      = 'REMPLACER_PAR_VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'REMPLACER_PAR_VOTRE_CLE_ANON_SUPABASE';
```

- [ ] **Step 2 : Créer `template/index.html`**

Copier `index.html` à la racine vers `template/index.html`, puis apporter exactement ces 10 modifications :

**2a. Ligne `<title>` :** supprimer la date codée en dur
```html
<!-- AVANT -->
<title id="page-title">Mariage · 18 Octobre 2026</title>
<!-- APRÈS -->
<title id="page-title">Mariage</title>
```

**2b. Loader — initiales :**
```html
<!-- AVANT -->
<span id="loader-p1" class="lm-l">C</span>
<span class="lm-amp">◆</span>
<span id="loader-p2" class="lm-a">N</span>
<!-- APRÈS -->
<span id="loader-p1" class="lm-l"></span>
<span class="lm-amp">◆</span>
<span id="loader-p2" class="lm-a"></span>
```

**2c. Loader — date :**
```html
<!-- AVANT -->
<p class="loader-date" id="loader-date">18 · X · 2026</p>
<!-- APRÈS -->
<p class="loader-date" id="loader-date"></p>
```

**2d. Nav logo — initiales :**
```html
<!-- AVANT -->
<span id="nav-p1">C</span>
<span class="nav-amp">&amp;</span>
<span id="nav-p2">N</span>
<!-- APRÈS -->
<span id="nav-p1"></span>
<span class="nav-amp">&amp;</span>
<span id="nav-p2"></span>
```

**2e. Hero monogram — ajouter des ids aux spans :**
```html
<!-- AVANT -->
<div id="hero-monogram">
  <span class="hv-l">C</span>
  <span class="hv-amp">◆</span>
  <span class="hv-r">N</span>
</div>
<!-- APRÈS -->
<div id="hero-monogram">
  <span id="hero-p1" class="hv-l"></span>
  <span class="hv-amp">◆</span>
  <span id="hero-p2" class="hv-r"></span>
</div>
```

**2f. Hero overlay — noms et date vides :**
```html
<!-- AVANT -->
<p id="hero-names-overlay">Catherine &amp; Nhu-Sao</p>
<p id="hero-date-overlay">18 · X · 2026</p>
<!-- APRÈS -->
<p id="hero-names-overlay"></p>
<p id="hero-date-overlay"></p>
```

**2g. Photo couple — alt vide :**
```html
<!-- AVANT -->
<img id="cp-img" alt="Catherine & Nhu-Sao" />
<!-- APRÈS -->
<img id="cp-img" alt="" />
```

**2h. Ajouter le bandeau entre `</section>` (fin de #histoire) et `<section id="programme">` :**
```html
<!-- ══ BANDEAU DÉFILANT ════════════════════════════════ -->
<div id="bandeau-section" class="bandeau-section" style="display:none">
  <div class="bandeau-track" id="bandeau-track"></div>
</div>
```

**2i. Mettre à jour l'ordre des scripts en bas de `<body>` pour ajouter config.js :**
```html
<!-- AVANT -->
<script src="supabase-config.js"></script>
<script src="config.js"></script>
<script src="script.js"></script>
<!-- APRÈS — inchangé, vérifier que cet ordre est bien présent -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="supabase-config.js"></script>
<script src="config.js"></script>
<script src="script.js"></script>
```

- [ ] **Step 3 : Créer `template/style.css`**

Copier `style.css` racine vers `template/style.css`, puis ajouter à la fin du fichier :

```css
/* ── BANDEAU DÉFILANT ──────────────────────────────── */
.bandeau-section {
  background: var(--dark);
  overflow: hidden;
  padding: 1.1rem 0;
  white-space: nowrap;
}

.bandeau-track {
  display: inline-flex;
  animation: bandeau-scroll 30s linear infinite;
}

.bandeau-section:hover .bandeau-track {
  animation-play-state: paused;
}

.bandeau-item {
  font-family: var(--sans);
  font-size: 0.68rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(201, 169, 110, 0.5);
  padding: 0 0.5rem;
}

.bandeau-dot {
  color: var(--wine-lt);
  margin: 0 0.5rem;
  opacity: 0.6;
}

@keyframes bandeau-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── HERO SANS VIDÉO (type: "none") ───────────────── */
.hero-video-section.hero-no-video #hero-video-wrap {
  background: var(--dark-md);
}
.hero-video-section.hero-no-video #hero-video {
  display: none;
}
```

- [ ] **Step 4 : Commit**
```bash
git add template/index.html template/style.css template/supabase-config.js
git commit -m "feat: add template/ skeleton — generic HTML, styles, supabase placeholder"
```

---

## Task 1 : `template/config.js` — objet MARIAGE template

**Goal:** Créer le fichier de configuration complet qui mappe 1:1 le formulaire d'onboarding.

**Files:**
- Create: `template/config.js`

**Acceptance Criteria:**
- [ ] Toutes les sections du formulaire (01 à 14) ont un champ correspondant
- [ ] Les valeurs par défaut sont des exemples génériques (Sophie & Thomas), pas Catherine & Nhu-Sao
- [ ] Les commentaires indiquent clairement quel champ du formulaire correspond

**Verify:** `node -e "const MARIAGE=require('./template/config.js').MARIAGE; console.log(MARIAGE.prenom1)"` → pas d'erreur de syntaxe (ou simplement ouvrir dans le navigateur et vérifier la console).

**Steps:**

- [ ] **Step 1 : Créer `template/config.js`**

```js
/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Template Site de Mariage
   ─────────────────────────────────────────────────────────────
   Remplissez ce fichier depuis le formulaire d'onboarding.
   C'est le SEUL fichier à modifier pour chaque nouveau client.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = {

  /* ── 01 · MARIÉS ──────────────────────────────────────────── */
  prenom1: "Sophie",  nom1: "Martin",
  prenom2: "Thomas",  nom2: "Dupont",

  /* ── 02 · DATE & LIEU ─────────────────────────────────────── */
  date_affichage: "Samedi 12 Juillet 2025",
  date_iso:       "2025-07-12T14:00:00",   // Format : AAAA-MM-JJTHH:MM:SS
  rsvp_deadline:  "1er Mai 2025",           // Affiché "Avant le 1er Mai 2025"
  domaine:        "Domaine des Brumes",
  ville:          "Beaune, Bourgogne",

  /* ── 03 · CONTACT ─────────────────────────────────────────── */
  email:    "sophie.thomas@exemple.com",
  whatsapp: "06 12 34 56 78",               // null = masqué dans la FAQ

  /* ── 04 · LANGUES ACTIVES ─────────────────────────────────── */
  // "fr" est toujours inclus. Ajouter "en" et/ou "vi" si traduit.
  langues: ["fr"],

  /* ── 05 · PHOTO COUPLE ────────────────────────────────────── */
  // null = section entière masquée
  photo_couple:         "photo-couple.jpg",
  photo_couple_caption: "Sophie & Thomas · Paris, France",

  /* ── 06 · TEXTES D'INTRODUCTION ───────────────────────────── */
  hero_intro:   "Vous êtes invités au mariage de",
  hero_cta:     "Confirmer ma présence",
  scroll_label: "Découvrir",
  citation:     "« Aimer, c'est trouver sa richesse en l'autre. »",
  sr_line1:     "Avant ce jour,",
  sr_line2:     "notre histoire s'écrivait",

  // Bandeau défilant — [] = masqué
  bandeau: ["France", "Barcelone", "Sophie", "Thomas", "Juillet 2025", "Beaune", "Bourgogne"],

  /* ── 07 · NOTRE HISTOIRE ──────────────────────────────────── */
  // Les blocs avec texte vide sont automatiquement masqués.
  histoire_eyebrow: "Depuis 2019",
  histoire_titre:   "Notre Histoire",

  histoire: [
    {
      annee: "2019",
      titre: "La Rencontre",
      texte: "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois. Ce fut le début d'une belle et inattendue aventure.",
      align: "left",
    },
    {
      annee: "2022",
      titre: "Notre Premier Voyage",
      texte: "Direction Lisbonne pour notre premier voyage. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l'un pour l'autre.",
      align: "right",
    },
    {
      annee: "2024",
      titre: "La Demande",
      texte: "Au coucher du soleil sur la plage de Biarritz, Thomas s'est agenouillé et a demandé à Sophie de partager sa vie. Elle a dit oui, les yeux brillants de joie.",
      align: "left",
    },
    {
      annee: "2025",
      titre: "Le Grand Jour",
      texte: "Nous célébrons notre union entourés de ceux que nous aimons. Merci d'être là pour partager ce moment unique avec nous.",
      align: "right",
    },
    // Bloc 5 optionnel — laisser texte vide pour ne pas l'afficher
    { annee: "", titre: "", texte: "", align: "left" },
  ],

  /* ── 08 · PROGRAMME DU JOUR J ─────────────────────────────── */
  programme_eyebrow: "12 Juillet 2025",
  programme_titre:   "Le Jour J",

  programme: [
    { heure: "14h00", icon: "💍", titre: "Cérémonie Laïque",  lieu: "Chapelle du Domaine des Brumes" },
    { heure: "15h30", icon: "🥂", titre: "Vin d'Honneur",     lieu: "Jardins du Domaine" },
    { heure: "19h30", icon: "🍽️", titre: "Dîner de Gala",     lieu: "Grande Salle du Château" },
    { heure: "22h00", icon: "🎵", titre: "Soirée Dansante",   lieu: "Jusqu'au bout de la nuit !" },
  ],

  /* ── GALERIE ── (formulaire section 13) ───────────────────── */
  galerie_eyebrow: "Le décor de notre amour",
  galerie_titre:   "Le Domaine",
  galerie_hint:    "",

  galerie: [
    { icon: "🏰", label: "Façade du Domaine",   photo: null },
    { icon: "🌿", label: "Les Jardins",          photo: null },
    { icon: "✨", label: "Grande Salle",         photo: null },
    { icon: "⛪", label: "Chapelle",             photo: null },
    { icon: "🌸", label: "Terrasse",             photo: null },
    { icon: "🕯️", label: "Décoration de Table", photo: null },
    // photo: null → icône placeholder affiché
    // photo: "galerie/photo1.jpg" → vraie photo affichée
  ],

  /* ── 09 · LES LIEUX ───────────────────────────────────────── */
  lieux_eyebrow: "Où nous rejoindre",
  lieux_titre:   "Les Lieux",

  lieux: [
    {
      icon:     "⛪",
      type:     "Cérémonie Laïque",
      nom:      "Chapelle Saint-Jean",
      adresse:  ["12 Route des Vignes", "21200 Beaune, Bourgogne"],
      featured: false,
      badge:    "",
      btn:      { label: "Voir sur la carte", href: "#map" },
    },
    {
      icon:     "🏰",
      type:     "Réception",
      nom:      "Domaine des Brumes",
      adresse:  ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
      featured: true,
      badge:    "Lieu principal",
      btn:      { label: "Voir sur la carte", href: "#map" },
    },
    {
      icon:     "🏨",
      type:     "Hébergement conseillé",
      nom:      "Hôtel Le Cep ★★★★",              // Laisser vide ("") pour masquer
      adresse:  ["27 Rue Maufoux", "21200 Beaune, Bourgogne"],
      featured: false,
      badge:    "",
      btn:      { label: "Plus d'infos", href: "#infos" },
    },
  ],

  /* ── CARTE GPS ─────────────────────────────────────────────── */
  // null = carte masquée
  carte: {
    lat:     47.0239,
    lng:     4.8397,
    zoom:    14,
    nom:     "Domaine des Brumes",
    adresse: ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
    caption: "📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune",
  },

  /* ── 10 · CODE VESTIMENTAIRE ──────────────────────────────── */
  dress_eyebrow: "Pour l'occasion",
  dress_titre:   "Code Vestimentaire",
  dress_intro:   "Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !",

  dress_couleurs: [
    { nom: "Rose poudré",  hex: "#F2C4CE", eviter: false },
    { nom: "Champagne",    hex: "#F0DCA0", eviter: false },
    { nom: "Sauge",        hex: "#87A878", eviter: false },
    { nom: "Ivoire",       hex: "#F5F0E0", eviter: false },
    { nom: "Blanc",        hex: "#F5F5F5", eviter: true  },
    { nom: "Noir",         hex: "#1A1A1A", eviter: true  },
  ],

  /* ── 11 · INFOS PRATIQUES ─────────────────────────────────── */
  // Les lignes avec texte vide sont automatiquement masquées.
  infos_eyebrow: "Tout ce qu'il faut savoir",
  infos_titre:   "Infos Pratiques",

  infos: [
    { icon: "🚗", titre: "Parking",     texte: "Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord." },
    { icon: "🚂", titre: "Train",       texte: "Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50." },
    { icon: "🏨", titre: "Hébergement", texte: "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel." },
    { icon: "👶", titre: "Enfants",     texte: "Soirée adultes uniquement." },
    { icon: "📸", titre: "Photos",      texte: "Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage." },
    { icon: "➕", titre: "",            texte: "" }, // Ligne bonus — laisser vide pour ne pas l'afficher
  ],

  /* ── 12 · FAQ ─────────────────────────────────────────────── */
  // Les Q&R avec question vide sont automatiquement masqués.
  // 3 questions standard sont pré-intégrées dans le moteur.
  faq_titre: "Questions fréquentes",

  faq: [
    {
      q: "Puis-je amener un +1 non mentionné sur l'invitation ?",
      r: "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire.",
    },
    {
      q: "Y a-t-il une liste de mariage ?",
      r: "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage. Détails envoyés par email après RSVP.",
    },
    {
      q: "Comment nous contacter ?",
      r: `Écrivez-nous à <a href="mailto:sophie.thomas@exemple.com">sophie.thomas@exemple.com</a>.`,
    },
    { q: "", r: "" }, // Q&R supplémentaire — laisser vide pour ne pas l'afficher
    { q: "", r: "" },
  ],

  /* ── 13 · VIDÉO HERO ──────────────────────────────────────── */
  video_hero: {
    type: "local",    // "local" | "url" | "none"
    src:  "hero.mp4", // ignoré si type: "none"
    // type "local"  → fichier hero.mp4 / hero.webm dans le même dossier
    // type "url"    → lien direct vers la vidéo (ex: WeTransfer, S3, etc.)
    // type "none"   → fond sombre fixe, pas de vidéo
  },

  /* ── RSVP ─────────────────────────────────────────────────── */
  rsvp_titre: "Confirmer votre présence",
  rsvp_intro: "Merci de nous confirmer votre présence avant le 1er mai 2025 afin que nous puissions organiser cette belle journée dans les meilleures conditions.",

  /* ── FOOTER ───────────────────────────────────────────────── */
  // citation est dans la section 06 ci-dessus

  /* ── I18N — TRADUCTIONS OPTIONNELLES ──────────────────────── */
  // À remplir uniquement si langues: ["fr", "en"] ou ["fr", "vi"]
  // Structure identique au site Catherine & Nhu-Sao
  i18n: {
    // en: { hero_intro: "...", ... },
    // vi: { ... },
  },

};
```

- [ ] **Step 2 : Commit**
```bash
git add template/config.js
git commit -m "feat: add template/config.js — full MARIAGE schema for client onboarding"
```

---

## Task 2 : `template/script.js` — moteur adapté

**Goal:** Créer le moteur de rendu en adaptant `script.js` racine avec : injection hero monogram/overlay, filtrage des éléments vides, bandeau depuis config, vidéo flexible, carte conditionnelle, langue active.

**Files:**
- Create: `template/script.js` (basé sur `script.js` racine)

**Acceptance Criteria:**
- [ ] `hero-p1`, `hero-p2`, `hero-names-overlay`, `hero-date-overlay` sont remplis depuis config
- [ ] Les blocs histoire/infos/faq/lieux avec données vides ne s'affichent pas
- [ ] `bandeau` rempli depuis `MARIAGE.bandeau` — masqué si tableau vide
- [ ] `video_hero.type: "none"` masque la vidéo sans erreur
- [ ] `video_hero.type: "url"` charge la vidéo depuis l'URL
- [ ] Carte masquée si `carte.lat` est null
- [ ] Lang-switch masqué si `langues: ["fr"]`
- [ ] Hôtel masqué dans les lieux si son `nom` est vide

**Verify:** Ouvrir `template/index.html` dans le navigateur avec `config.js` et `script.js` → vérifier la console (aucune erreur), les initiales dans le loader et la nav s'affichent.

**Steps:**

- [ ] **Step 1 : Copier `script.js` racine → `template/script.js`**

```bash
cp script.js template/script.js
```

- [ ] **Step 2 : Dans `hydrate()` — ajouter l'injection du hero overlay**

Trouver le bloc "Navbar" dans `hydrate()` (lignes autour de `setText('nav-p1', ...)`).
Après ce bloc, ajouter :

```js
  // Hero monogram initiales + overlay noms et date
  const hP1 = document.getElementById('hero-p1');
  const hP2 = document.getElementById('hero-p2');
  if (hP1) hP1.textContent = M.prenom1.charAt(0);
  if (hP2) hP2.textContent = M.prenom2.charAt(0);
  setText('hero-names-overlay', `${M.prenom1} &amp; ${M.prenom2}`);
  setText('hero-date-overlay',  formatDate(M.date_affichage));
```

- [ ] **Step 3 : Dans `hydrate()` — filtrer les blocs histoire vides**

Remplacer la ligne `histWrap.innerHTML = M.histoire.map(h => \`` par :

```js
  if (histWrap) {
    histWrap.innerHTML = M.histoire
      .filter(h => h.texte && h.texte.trim())
      .map(h => `
      <div class="hist-item" data-align="${h.align}">
        <div class="hist-year">${h.annee}</div>
        <div class="hist-dot"></div>
        <div class="hist-card">
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>
      </div>`).join('');
  }
```

- [ ] **Step 4 : Dans `hydrate()` — filtrer les lieux avec nom vide**

Remplacer le bloc lieux (autour de `lieuxCards.innerHTML = M.lieux.map(...)`) par :

```js
  if (lieuxCards) {
    lieuxCards.innerHTML = M.lieux
      .filter(l => l.nom && l.nom.trim())
      .map(l => `
      <div class="lieu-card${l.featured ? ' lieu-featured' : ''}">
        ${l.badge ? `<div class="lieu-badge">${l.badge}</div>` : ''}
        <div class="lieu-icon">${l.icon}</div>
        <p class="lieu-type">${l.type}</p>
        <h3>${l.nom}</h3>
        <address>${l.adresse.join('<br>')}</address>
        <a href="${l.btn.href}" class="${l.featured ? 'btn-outline-light' : 'btn-outline'}">${l.btn.label}</a>
      </div>`).join('');
  }
  setText('map-caption', M.carte.caption);
```

- [ ] **Step 5 : Dans `hydrate()` — rsvp_deadline → rsvp_eyebrow**

Remplacer la ligne `setText('rsvp-eyebrow', M.rsvp_eyebrow);` par :

```js
  const rsvpEy = M.rsvp_deadline ? `Avant le ${M.rsvp_deadline}` : (M.rsvp_eyebrow || '');
  setText('rsvp-eyebrow', rsvpEy);
```

- [ ] **Step 6 : Dans `hydrate()` — filtrer les infos vides**

Remplacer le bloc infos (autour de `infosGrid.innerHTML = M.infos.map(...)`) par :

```js
  if (infosGrid) {
    infosGrid.innerHTML = M.infos
      .filter(i => i.texte && i.texte.trim())
      .map(info => `
      <div class="info-card">
        <span class="info-ico">${info.icon}</span>
        <h3>${info.titre}</h3>
        <p>${info.texte}</p>
      </div>`).join('');
  }
```

- [ ] **Step 7 : Dans `hydrate()` — filtrer les FAQ vides**

Remplacer le bloc faq (autour de `faqList.innerHTML = M.faq.map(...)`) par :

```js
  if (faqList) {
    faqList.innerHTML = M.faq
      .filter(f => f.q && f.q.trim())
      .map(f => `
      <div class="faq-item">
        <button class="faq-q">${f.q} <span class="faq-arrow">▾</span></button>
        <div class="faq-a"><p>${f.r}</p></div>
      </div>`).join('');
    initFaq();
  }
```

- [ ] **Step 8 : Remplacer l'initialisation top-level de la carte par une fonction**

Trouver le bloc carte en haut niveau (autour de `const { lat: LAT, lng: LNG...` et `L.map(...)`). Supprimer ces ~35 lignes et les remplacer par :

```js
/* ────────────────────────────────────────
   MAP (Leaflet) — conditionnelle
──────────────────────────────────────── */
function initMap() {
  const { lat, lng, zoom, nom, adresse, caption } = MARIAGE.carte;
  setText('map-caption', caption || '');
  if (!lat || !lng) {
    const el  = document.getElementById('map');
    const cap = document.getElementById('map-caption');
    if (el)  el.style.display  = 'none';
    if (cap) cap.style.display = 'none';
    return;
  }
  const map = L.map('map', { zoomControl: true, scrollWheelZoom: false })
               .setView([lat, lng], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  const pinIcon = L.divIcon({
    html: `<div style="
      width:34px;height:34px;
      background:var(--wine,#6B2737);
      border:3px solid #C9A96E;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(44,24,16,.5);
    "></div>`,
    className: '', iconSize: [34,34], iconAnchor: [17,34], popupAnchor: [0,-36],
  });
  L.marker([lat, lng], { icon: pinIcon })
   .addTo(map)
   .bindPopup(`
     <div style="font-family:'Cormorant Garamond',Georgia,serif;text-align:center;padding:6px 4px">
       <strong style="color:#6B2737;font-style:italic;font-size:1.05rem">${nom}</strong><br>
       <span style="font-family:Montserrat,sans-serif;font-size:.75rem;color:#5C3D35">
         ${adresse.join('<br>')}
       </span>
     </div>`)
   .openPopup();
}
```

- [ ] **Step 9 : Ajouter la fonction `initBandeau()`**

Remplacer la fonction `initMarquee()` existante (lignes 195-209) par :

```js
/* ────────────────────────────────────────
   BANDEAU DÉFILANT
──────────────────────────────────────── */
function initBandeau() {
  const section = document.getElementById('bandeau-section');
  const track   = document.getElementById('bandeau-track');
  if (!section || !track) return;
  const words = MARIAGE.bandeau || [];
  if (!words.length) return;
  section.style.display = 'block';
  // Doubler les mots pour une boucle CSS sans accroc
  const doubled = [...words, ...words];
  track.innerHTML = doubled.map(w =>
    `<span class="bandeau-item">${w}<span class="bandeau-dot">◆</span></span>`
  ).join('');
}
```

- [ ] **Step 10 : Ajouter la fonction `setupVideo()`**

Ajouter juste après `initBandeau()` :

```js
/* ────────────────────────────────────────
   VIDÉO HERO — type: local | url | none
──────────────────────────────────────── */
function setupVideo() {
  const vh    = MARIAGE.video_hero || { type: 'local', src: 'hero.mp4' };
  const video = document.getElementById('hero-video');
  if (vh.type === 'none') {
    const section = document.getElementById('accueil');
    if (section) section.classList.add('hero-no-video');
    if (video)   video.style.display = 'none';
    return;
  }
  if (!video) return;
  if (vh.type === 'url') {
    // Vider les sources locales et charger depuis l'URL
    video.querySelectorAll('source').forEach(s => s.remove());
    video.src = vh.src;
    video.load();
  }
  // type "local" : les <source> dans le HTML pointent déjà vers hero.mp4 / hero.webm
}
```

- [ ] **Step 11 : Mettre à jour le bloc BOOT (DOMContentLoaded)**

Remplacer le bloc BOOT existant par :

```js
/* ────────────────────────────────────────
   BOOT
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  hydrate();
  setupVideo();
  initBandeau();
  initMap();
  initLoader();

  // Masquer les boutons de langue non configurés
  const activeLangs  = MARIAGE.langues || ['fr'];
  const langSwitch   = document.getElementById('lang-switch');
  if (langSwitch) {
    if (activeLangs.length <= 1) {
      langSwitch.style.display = 'none';
    } else {
      langSwitch.querySelectorAll('.lang-btn').forEach(btn => {
        if (!activeLangs.includes(btn.dataset.lang)) btn.style.display = 'none';
      });
    }
  }

  // Lang switcher
  langSwitch?.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
});
```

- [ ] **Step 12 : Commit**
```bash
git add template/script.js
git commit -m "feat: add template/script.js — engine with masking, bandeau, flexible video, conditional map"
```

---

## Task 3 : Nettoyage

**Goal:** Supprimer le dossier prototype de Gemma4 (`Nouveaux clients/`).

**Files:**
- Delete: `Nouveaux clients/`

**Acceptance Criteria:**
- [ ] Le dossier `Nouveaux clients/` n'existe plus
- [ ] `template/` est le seul dossier template dans le repo

**Verify:** `ls` à la racine du repo → pas de dossier "Nouveaux clients".

**Steps:**

- [ ] **Step 1 : Supprimer le dossier**
```bash
git rm -r "Nouveaux clients/"
```

- [ ] **Step 2 : Commit final**
```bash
git commit -m "chore: remove Nouveaux clients/ prototype (replaced by template/)"
```

---

## Récapitulatif des commits

| # | Message | Fichiers |
|---|---|---|
| 1 | `feat: add template/ skeleton` | index.html, style.css, supabase-config.js |
| 2 | `feat: add template/config.js` | config.js |
| 3 | `feat: add template/script.js` | script.js |
| 4 | `chore: remove Nouveaux clients/` | — |

---

## Utilisation post-implémentation

Pour chaque nouveau client :
1. `cp -r template/ clients/prenom1-prenom2/`
2. Remplir `clients/prenom1-prenom2/config.js` depuis le formulaire d'onboarding
3. Copier `hero.mp4` (ou renseigner `video_hero.type: "url"`)
4. Copier `photo-couple.jpg` (ou mettre `photo_couple: null`)
5. Créer un projet Supabase → remplir `supabase-config.js`
6. `vercel deploy` depuis le dossier client
