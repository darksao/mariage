# 3 Templates Mariage Wedoria Studio — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer 3 templates mariage indépendants (champêtre, chic, romantique) chargeables dans Wedoria Studio.

**Architecture:** 3 dossiers sous `templates/` — chacun contient `index.html`, `style.css`, `script.js`, `config.js`, `supabase-config.js`. Chaque template est autonome et compatible Studio via drag & drop du `index.html`. Tous utilisent l'objet `MARIAGE` de `config.js` comme source de vérité.

**Tech Stack:** HTML5, CSS3 (custom properties), JS vanilla, GSAP (chic uniquement), Leaflet (champêtre), Supabase JS v2, Google Fonts.

**User Verification:** NO

---

## Structure des fichiers

```
templates/
  champetre/  → index.html, style.css, script.js, config.js, supabase-config.js
  chic/       → index.html, style.css, script.js, config.js, supabase-config.js
  romantique/ → index.html, style.css, script.js, config.js, supabase-config.js
```

IDs DOM requis pour compatibilité Studio (présents dans tous les templates) :
`loader-p1`, `loader-p2`, `loader-date`, `nav-p1`, `nav-p2`, `hero-names-overlay`, `hero-date-overlay`, `hero-invite`, `hero-cta-overlay`

---

## ══ TEMPLATE 1 — CHAMPÊTRE ══

### Task 0: Champêtre — config.js + supabase-config.js

**Goal:** Créer les fichiers de config avec données exemple et champ `activites` propre au thème champêtre.

**Files:**
- Create: `templates/champetre/config.js`
- Create: `templates/champetre/supabase-config.js`

**Acceptance Criteria:**
- [ ] `config.js` contient un objet `MARIAGE` valide avec tous les champs du schéma existant
- [ ] Champ `activites[]` présent avec 4 entrées exemple
- [ ] `supabase-config.js` contient les deux constantes avec valeurs placeholder

**Verify:** Ouvrir `config.js` dans le navigateur console — `MARIAGE.prenom1` retourne `"Léa"`

**Steps:**

- [ ] **Créer `templates/champetre/config.js`**

```js
const MARIAGE = {
  prenom1: "Léa",        nom1: "Bernard",
  prenom2: "Antoine",    nom2: "Rousseau",
  date_affichage: "Samedi 14 Juin 2025",
  date_iso:       "2025-06-14T15:00:00",
  rsvp_deadline:  "1er Avril 2025",
  domaine:        "Domaine de la Forêt Verte",
  ville:          "Fontainebleau, Seine-et-Marne",
  email:          "lea.antoine@exemple.com",
  whatsapp:       "06 11 22 33 44",
  langues:        ["fr"],
  photo_couple:   "photo-couple.png",
  photo_couple_caption: "Léa & Antoine · Forêt de Fontainebleau",
  hero_intro:     "Vous êtes conviés au mariage champêtre de",
  hero_cta:       "Confirmer ma présence",
  scroll_label:   "Découvrir",
  citation:       "« La nature est le plus beau des décors. »",
  histoire_eyebrow: "Depuis 2020",
  histoire_titre:   "Notre Histoire",
  histoire: [
    { annee: "2020", titre: "La Rencontre", texte: "Un week-end à vélo en forêt de Fontainebleau. Léa avait une crevaison, Antoine avait une pompe. Le reste appartient à l'histoire.", align: "left" },
    { annee: "2022", titre: "Le Voyage", texte: "La Provence en camping. Lavandes, cigales et couchers de soleil dorés. On a su que c'était pour la vie.", align: "right" },
    { annee: "2024", titre: "La Demande", texte: "Dans le jardin de la grand-mère de Léa, au milieu des roses trémières, Antoine a posé la question. Oui, mille fois oui.", align: "left" },
    { annee: "2025", titre: "Le Grand Jour", texte: "Entourés de nos proches, au cœur de la nature que nous aimons tant.", align: "right" },
    { annee: "", titre: "", texte: "", align: "left" },
  ],
  programme_eyebrow: "14 Juin 2025",
  programme_titre:   "Le Jour J",
  programme: [
    { heure: "15h00", icon: "🌿", titre: "Cérémonie en plein air",  lieu: "Prairie du domaine" },
    { heure: "16h30", icon: "🍾", titre: "Cocktail champêtre",      lieu: "Verger du domaine" },
    { heure: "20h00", icon: "🍽️", titre: "Dîner sous les étoiles",  lieu: "Grande Grange" },
    { heure: "23h00", icon: "🎶", titre: "Bal champêtre",            lieu: "Piste en bois" },
  ],
  galerie_eyebrow: "Notre havre de paix",
  galerie_titre:   "Le Domaine",
  galerie_hint:    "",
  galerie: [
    { icon: "🌳", label: "La Prairie",       photo: null },
    { icon: "🏡", label: "La Grange",         photo: null },
    { icon: "🌸", label: "Le Verger",         photo: null },
    { icon: "🌿", label: "Les Jardins",       photo: null },
  ],
  lieux_eyebrow: "Où nous rejoindre",
  lieux_titre:   "Les Lieux",
  lieux: [
    { icon: "🌿", type: "Cérémonie & Réception", nom: "Domaine de la Forêt Verte", adresse: ["77300 Fontainebleau"], featured: true, badge: "Lieu unique", btn: { label: "Voir sur la carte", href: "#map" } },
    { icon: "🏨", type: "Hébergement conseillé", nom: "Hôtel de la Forêt ★★★", adresse: ["12 Rue des Pins", "77300 Fontainebleau"], featured: false, badge: "", btn: { label: "Plus d'infos", href: "#infos" } },
  ],
  carte: { lat: 48.4024, lng: 2.7019, zoom: 13, nom: "Domaine de la Forêt Verte", adresse: ["77300 Fontainebleau"], caption: "📍 Domaine de la Forêt Verte · Fontainebleau" },
  dress_eyebrow: "Pour l'occasion",
  dress_titre:   "Code Vestimentaire",
  dress_intro:   "Tenue champêtre élégante. Talons déconseillés (pelouse). Inspirez-vous des teintes naturelles !",
  dress_couleurs: [
    { nom: "Vert sauge",  hex: "#8FAF8A", eviter: false },
    { nom: "Beige lin",   hex: "#C9B99A", eviter: false },
    { nom: "Crème",       hex: "#F5F0E5", eviter: false },
    { nom: "Terracotta",  hex: "#C4714A", eviter: false },
    { nom: "Blanc pur",   hex: "#FFFFFF", eviter: true },
  ],
  infos_eyebrow: "Tout savoir",
  infos_titre:   "Infos Pratiques",
  infos: [
    { icon: "🚗", titre: "Parking",      texte: "Parking gratuit sur le domaine. Depuis Paris : A6 sortie Fontainebleau." },
    { icon: "🚂", titre: "Train",        texte: "Gare de Fontainebleau à 5 km. Navettes organisées à 14h30." },
    { icon: "🏨", titre: "Hébergement",  texte: "Chambres pré-réservées à l'Hôtel de la Forêt. Contactez-nous pour le code." },
    { icon: "👟", titre: "Chaussures",   texte: "La cérémonie se tient en plein air. Talons non recommandés." },
    { icon: "➕", titre: "", texte: "" },
  ],
  faq_titre: "Questions fréquentes",
  faq: [
    { q: "Peut-on venir avec des enfants ?", r: "Le domaine est accessible aux enfants. Un espace jeux sera aménagé." },
    { q: "Y a-t-il une liste de mariage ?",  r: "Oui, une cagnotte voyage et quelques idées sur notre site." },
    { q: "Comment nous contacter ?",         r: `Écrivez-nous à <a href="mailto:lea.antoine@exemple.com">lea.antoine@exemple.com</a>.` },
    { q: "", r: "" },
  ],
  video_hero: { type: "none", src: "" },
  rsvp_titre: "Confirmer votre présence",
  rsvp_intro: "Merci de nous répondre avant le 1er avril 2025.",
  photos_ambiance: [
    { src: null, position: "center" },
    { src: null, position: "center" },
    { src: null, position: "center" },
  ],
  // ── Champ spécifique Champêtre ──
  activites: [
    { emoji: "🏸", titre: "Badminton",        description: "Raquettes disponibles sur place dans la prairie." },
    { emoji: "🎯", titre: "Pétanque",          description: "Terrain aménagé près du verger." },
    { emoji: "🚲", titre: "Balade à vélo",     description: "Vélos disponibles pour explorer les sentiers." },
    { emoji: "🌿", titre: "Atelier bouquets",  description: "Créez votre bouquet de fleurs sauvages." },
  ],
  i18n: {},
};
```

- [ ] **Créer `templates/champetre/supabase-config.js`**

```js
const SUPABASE_URL      = 'REMPLACER_PAR_VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'REMPLACER_PAR_VOTRE_CLE_ANON_SUPABASE';
```

- [ ] **Commit**

```bash
git add templates/champetre/config.js templates/champetre/supabase-config.js
git commit -m "feat: champetre template - config files"
```

```json:metadata
{"files": ["templates/champetre/config.js", "templates/champetre/supabase-config.js"], "verifyCommand": "", "acceptanceCriteria": ["MARIAGE object valide avec activites[]", "supabase-config avec placeholders"], "requiresUserVerification": false}
```

---

### Task 1: Champêtre — index.html

**Goal:** Créer la structure HTML complète du template champêtre avec toutes les sections et IDs requis.

**Files:**
- Create: `templates/champetre/index.html`

**Acceptance Criteria:**
- [ ] Toutes les sections présentes avec IDs corrects : `#accueil`, `#histoire`, `#programme`, `#domaine`, `#activites`, `#rsvp`, `#infos`
- [ ] IDs Studio présents : `loader-p1`, `loader-p2`, `hero-names-overlay`, `hero-date-overlay`, `hero-invite`, `hero-cta-overlay`
- [ ] Dépendances chargées : Google Fonts (Playfair Display + Raleway), Leaflet CSS, Supabase JS, GSAP non requis
- [ ] `<canvas id="leaves-canvas">` présent pour les feuilles animées

**Verify:** Ouvrir dans le navigateur — page se charge sans erreur console 404 sur les scripts

**Steps:**

- [ ] **Créer `templates/champetre/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title id="page-title">Mariage Champêtre</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="is-loading">

  <!-- LOADER -->
  <div id="loader">
    <div class="loader-inner">
      <div class="loader-monogram">
        <span id="loader-p1"></span>
        <span class="lm-amp">✿</span>
        <span id="loader-p2"></span>
      </div>
      <p class="loader-date" id="loader-date"></p>
      <div class="loader-bar"><div class="loader-progress" id="loader-progress"></div></div>
    </div>
  </div>

  <!-- NAV -->
  <nav id="navbar">
    <div class="nav-container">
      <a href="#accueil" class="nav-logo">
        <span id="nav-p1"></span>
        <span class="nav-amp">&amp;</span>
        <span id="nav-p2"></span>
      </a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        <li><a href="#histoire">Histoire</a></li>
        <li><a href="#programme">Le Jour J</a></li>
        <li><a href="#domaine">Le Domaine</a></li>
        <li><a href="#activites">Activités</a></li>
        <li><a href="#rsvp">RSVP</a></li>
        <li><a href="#infos">Infos</a></li>
      </ul>
    </div>
  </nav>

  <!-- HERO -->
  <section id="accueil" class="hero-section">
    <canvas id="leaves-canvas"></canvas>
    <div class="hero-overlay"></div>
    <img id="hero-img" src="" alt="" class="hero-bg" />
    <div class="hero-content">
      <div class="hero-crown">
        <svg viewBox="0 0 200 60" class="crown-svg" aria-hidden="true">
          <path d="M10,55 Q30,10 50,30 Q70,50 100,5 Q130,50 150,30 Q170,10 190,55" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="100" cy="5" r="3" fill="currentColor"/>
          <circle cx="50" cy="30" r="2" fill="currentColor"/>
          <circle cx="150" cy="30" r="2" fill="currentColor"/>
        </svg>
      </div>
      <p id="hero-invite" class="hero-invite"></p>
      <h1 id="hero-names-overlay" class="hero-names"></h1>
      <p id="hero-date-overlay" class="hero-date"></p>
      <a href="#rsvp" id="hero-cta-overlay" class="btn-hero"></a>
    </div>
  </section>

  <!-- HISTOIRE -->
  <section id="histoire" class="section-histoire reveal-section">
    <div class="section-header">
      <p class="eyebrow" id="histoire-eyebrow"></p>
      <h2 id="histoire-titre"></h2>
      <div class="leaf-divider" aria-hidden="true">
        <svg viewBox="0 0 80 20"><path d="M0,10 Q20,0 40,10 Q60,20 80,10" fill="none" stroke="currentColor" stroke-width="1"/></svg>
      </div>
    </div>
    <div class="histoire-timeline" id="histoire-wrap"></div>
  </section>

  <!-- PROGRAMME -->
  <section id="programme" class="section-programme reveal-section">
    <div class="section-header">
      <p class="eyebrow" id="programme-eyebrow"></p>
      <h2 id="programme-titre"></h2>
    </div>
    <div class="programme-cards" id="prog-wrap"></div>
  </section>

  <!-- DOMAINE -->
  <section id="domaine" class="section-domaine reveal-section">
    <div class="domaine-photo-wrap">
      <img id="domaine-photo" src="" alt="Le domaine" />
    </div>
    <div class="domaine-text">
      <p class="eyebrow" id="domaine-eyebrow">Notre écrin de verdure</p>
      <h2 id="domaine-titre"></h2>
      <p id="domaine-desc" class="domaine-desc"></p>
    </div>
    <div id="map" class="leaflet-map"></div>
  </section>

  <!-- ACTIVITÉS -->
  <section id="activites" class="section-activites reveal-section">
    <div class="section-header">
      <p class="eyebrow">Pour profiter du domaine</p>
      <h2>Les Activités</h2>
    </div>
    <div class="activites-grid" id="activites-wrap"></div>
  </section>

  <!-- RSVP -->
  <section id="rsvp" class="section-rsvp reveal-section">
    <div class="rsvp-floral-bg" aria-hidden="true"></div>
    <div class="rsvp-inner">
      <p class="eyebrow">Votre réponse</p>
      <h2 id="rsvp-titre"></h2>
      <p id="rsvp-intro" class="rsvp-intro"></p>
      <form id="rsvp-form" class="rsvp-form" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="f-prenom">Prénom *</label>
            <input type="text" id="f-prenom" name="prenom" required />
          </div>
          <div class="form-group">
            <label for="f-nom">Nom *</label>
            <input type="text" id="f-nom" name="nom" required />
          </div>
        </div>
        <div class="form-group">
          <label>Présence *</label>
          <div class="radio-group">
            <label class="radio-label"><input type="radio" name="presence" value="oui" required /> 🌿 Oui, avec joie !</label>
            <label class="radio-label"><input type="radio" name="presence" value="non" /> Hélas, je ne pourrai pas</label>
          </div>
        </div>
        <div class="form-group">
          <label for="f-regime">Régime alimentaire</label>
          <select id="f-regime" name="regime">
            <option value="">Aucune restriction</option>
            <option value="vegetarien">Végétarien</option>
            <option value="vegan">Vegan</option>
            <option value="sans-gluten">Sans gluten</option>
            <option value="halal">Halal</option>
            <option value="autre">Autre (préciser dans message)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="f-message">Message aux mariés</label>
          <textarea id="f-message" name="message" rows="3" placeholder="Un mot doux…"></textarea>
        </div>
        <button type="submit" class="btn-submit" id="rsvp-btn">Confirmer ma présence</button>
        <p id="rsvp-status" class="rsvp-status" aria-live="polite"></p>
      </form>
    </div>
  </section>

  <!-- INFOS -->
  <section id="infos" class="section-infos reveal-section">
    <div class="section-header">
      <p class="eyebrow" id="infos-eyebrow"></p>
      <h2 id="infos-titre"></h2>
    </div>
    <div class="infos-grid" id="infos-wrap"></div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <p class="footer-citation" id="footer-citation"></p>
    <p class="footer-names" id="footer-names"></p>
    <p class="footer-credit">Site créé avec <a href="https://wedoria.studio" target="_blank">Wedoria Studio</a></p>
  </footer>

  <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="supabase-config.js"></script>
  <script src="config.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Commit**

```bash
git add templates/champetre/index.html
git commit -m "feat: champetre template - HTML structure"
```

```json:metadata
{"files": ["templates/champetre/index.html"], "verifyCommand": "open templates/champetre/index.html", "acceptanceCriteria": ["Toutes sections présentes", "IDs Studio présents", "Dépendances chargées"], "requiresUserVerification": false}
```

---

### Task 2: Champêtre — style.css

**Goal:** Créer le CSS complet du thème champêtre (tokens, loader, nav, hero, toutes les sections).

**Files:**
- Create: `templates/champetre/style.css`

**Acceptance Criteria:**
- [ ] Variables CSS `:root` définies avec la palette vert sauge / beige lin
- [ ] Loader, nav, hero stylisés
- [ ] Timeline histoire horizontale scrollable sur mobile
- [ ] Cartes programme en disposition décalée (alternance odd/even)
- [ ] Section activités en grille 2×2
- [ ] Formulaire RSVP sur fond crème avec motif SVG
- [ ] Responsive mobile-first

**Verify:** Page rendue sans overflow horizontal, police Playfair Display visible dans les titres

**Steps:**

- [ ] **Créer `templates/champetre/style.css`**

```css
/* ═══════════════════════════════════════════════
   CHAMPÊTRE · style.css — Vert Sauge & Beige Lin
═══════════════════════════════════════════════ */

/* ── TOKENS ── */
:root {
  --sage:      #8FAF8A;
  --sage-dk:   #6B8F66;
  --sage-lt:   #B8CFBB;
  --beige:     #C9B99A;
  --beige-lt:  #E0D4C0;
  --cream:     #F5F0E5;
  --cream-dk:  #EBE3D3;
  --brown:     #3D3028;
  --brown-md:  #5C4A38;
  --text:      #3D3028;
  --text-lt:   #7A6555;

  --serif: 'Playfair Display', Georgia, serif;
  --sans:  'Raleway', sans-serif;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --r: 12px;
  --sp: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 4rem);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--sans); background: var(--cream); color: var(--text); overflow-x: hidden; }
body.is-loading { overflow: hidden; }
img { display: block; width: 100%; height: 100%; object-fit: cover; }
a { text-decoration: none; color: inherit; }

/* ── LOADER ── */
#loader {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--brown);
  display: flex; align-items: center; justify-content: center;
}
.loader-inner { text-align: center; }
.loader-monogram {
  font-family: var(--serif); font-size: clamp(4rem, 12vw, 7rem);
  font-style: italic; font-weight: 400; color: var(--sage-lt);
  display: flex; align-items: center; gap: 0.4em;
}
.lm-amp { font-size: 0.5em; color: var(--beige); font-style: normal; }
.loader-date {
  font-family: var(--sans); font-size: 0.7rem; letter-spacing: 0.35em;
  text-transform: uppercase; color: rgba(200,185,154,0.5);
  margin: 1rem 0 2rem;
}
.loader-bar { width: 160px; height: 1px; background: rgba(200,185,154,0.15); margin: 0 auto; overflow: hidden; }
.loader-progress { height: 100%; width: 0%; background: linear-gradient(90deg, var(--sage), var(--beige)); }

/* ── NAV ── */
#navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  transition: background 0.3s, box-shadow 0.3s;
}
#navbar.scrolled { background: rgba(245,240,229,0.95); backdrop-filter: blur(8px); box-shadow: 0 1px 0 rgba(61,48,40,0.08); }
.nav-container { max-width: 1100px; margin: 0 auto; padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { font-family: var(--serif); font-style: italic; font-size: 1.4rem; color: white; display: flex; align-items: center; gap: 0.2em; }
#navbar.scrolled .nav-logo { color: var(--brown); }
.nav-amp { font-size: 0.7em; color: var(--sage); }
.nav-links { list-style: none; display: flex; gap: 2rem; }
.nav-links a { font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.85); transition: color 0.2s; }
#navbar.scrolled .nav-links a { color: var(--brown-md); }
.nav-links a:hover { color: var(--sage); }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.hamburger span { display: block; width: 22px; height: 1.5px; background: white; transition: all 0.3s; }
#navbar.scrolled .hamburger span { background: var(--brown); }

/* ── HERO ── */
.hero-section {
  position: relative; height: 100vh; min-height: 600px;
  display: flex; align-items: center; justify-content: center;
  background: var(--brown);
  overflow: hidden;
}
#leaves-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  object-fit: cover; width: 100%; height: 100%;
  opacity: 0.6;
}
.hero-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(to top, rgba(61,48,40,0.7) 0%, rgba(61,48,40,0.1) 60%, transparent 100%);
}
.hero-content {
  position: relative; z-index: 3;
  text-align: center; padding: 2rem;
  color: white;
}
.hero-crown { width: clamp(120px, 30vw, 200px); margin: 0 auto 1.5rem; color: var(--sage-lt); }
.crown-svg { width: 100%; height: auto; }
.hero-invite { font-size: clamp(0.8rem, 2vw, 1rem); letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.8; margin-bottom: 0.75rem; }
.hero-names {
  font-family: var(--serif); font-size: clamp(3rem, 10vw, 7rem);
  font-style: italic; font-weight: 400; line-height: 1.1;
  margin-bottom: 0.75rem;
}
.hero-date { font-size: clamp(0.75rem, 1.5vw, 0.9rem); letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.75; margin-bottom: 2rem; }
.btn-hero {
  display: inline-block; padding: 0.85rem 2.5rem;
  border: 1px solid rgba(255,255,255,0.5); color: white;
  font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
  border-radius: 2px; transition: background 0.25s, border-color 0.25s;
}
.btn-hero:hover { background: var(--sage); border-color: var(--sage); }

/* ── SECTIONS COMMUNES ── */
.section-header { text-align: center; margin-bottom: 3rem; }
.eyebrow { font-size: 0.72rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--sage-dk); margin-bottom: 0.5rem; }
h2 { font-family: var(--serif); font-style: italic; font-size: clamp(2rem, 5vw, 3rem); color: var(--brown); font-weight: 400; }
.leaf-divider { width: 80px; margin: 1rem auto 0; color: var(--sage); }

/* ── RÉVÉLATION AU SCROLL ── */
.reveal-section { opacity: 0; transform: translateY(30px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
.reveal-section.visible { opacity: 1; transform: translateY(0); }

/* ── HISTOIRE ── */
.section-histoire { padding: var(--sp); }
.histoire-timeline {
  display: flex; gap: 2rem; overflow-x: auto; padding-bottom: 1.5rem;
  scrollbar-width: thin; scrollbar-color: var(--sage-lt) transparent;
}
.hist-item {
  flex: 0 0 280px; background: white; border-radius: var(--r);
  padding: 1.75rem; box-shadow: 0 2px 20px rgba(61,48,40,0.07);
  position: relative;
}
.hist-item::before {
  content: '🌿'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  font-size: 1.2rem;
}
.hist-year { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--sage-dk); margin-bottom: 0.5rem; }
.hist-item h3 { font-family: var(--serif); font-style: italic; font-size: 1.3rem; color: var(--brown); margin-bottom: 0.75rem; }
.hist-item p { font-size: 0.9rem; line-height: 1.7; color: var(--text-lt); }

/* ── PROGRAMME ── */
.section-programme { padding: var(--sp); background: var(--cream-dk); }
.programme-cards { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
.prog-card {
  display: grid; grid-template-columns: 80px 1fr; align-items: center; gap: 1.5rem;
  background: white; border-radius: var(--r); padding: 1.5rem 2rem;
  box-shadow: 0 2px 16px rgba(61,48,40,0.06);
}
.prog-card:nth-child(even) { margin-left: clamp(0px, 5vw, 60px); }
.prog-card:nth-child(odd) { margin-right: clamp(0px, 5vw, 60px); }
.prog-icon { font-size: 2rem; text-align: center; }
.prog-heure { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sage-dk); }
.prog-card h3 { font-family: var(--serif); font-style: italic; font-size: 1.2rem; color: var(--brown); margin: 0.2rem 0; }
.prog-card p { font-size: 0.85rem; color: var(--text-lt); }

/* ── DOMAINE ── */
.section-domaine { padding: var(--sp); }
.domaine-photo-wrap { height: clamp(250px, 45vw, 480px); border-radius: var(--r); overflow: hidden; margin-bottom: 2rem; }
.domaine-text { max-width: 650px; margin: 0 auto 2rem; text-align: center; }
.domaine-desc { font-size: 1rem; line-height: 1.8; color: var(--text-lt); margin-top: 1rem; }
.leaflet-map { height: 320px; border-radius: var(--r); overflow: hidden; }

/* ── ACTIVITÉS ── */
.section-activites { padding: var(--sp); background: #EEF3ED; }
.activites-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; max-width: 900px; margin: 0 auto; }
.activite-card {
  background: white; border-radius: var(--r); padding: 1.75rem;
  text-align: center; box-shadow: 0 2px 12px rgba(61,48,40,0.06);
  transition: transform 0.25s var(--ease-out);
}
.activite-card:hover { transform: translateY(-4px); }
.activite-emoji { font-size: 2.5rem; margin-bottom: 0.75rem; }
.activite-card h3 { font-family: var(--serif); font-style: italic; font-size: 1.15rem; color: var(--brown); margin-bottom: 0.5rem; }
.activite-card p { font-size: 0.85rem; color: var(--text-lt); line-height: 1.6; }

/* ── RSVP ── */
.section-rsvp { padding: var(--sp); position: relative; background: var(--cream); }
.rsvp-floral-bg {
  position: absolute; inset: 0; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='3' fill='%238FAF8A'/%3E%3Cpath d='M40,20 Q50,30 40,40 Q30,30 40,20' fill='%238FAF8A'/%3E%3Cpath d='M40,40 Q50,50 40,60 Q30,50 40,40' fill='%238FAF8A'/%3E%3Cpath d='M20,40 Q30,30 40,40 Q30,50 20,40' fill='%238FAF8A'/%3E%3Cpath d='M40,40 Q50,30 60,40 Q50,50 40,40' fill='%238FAF8A'/%3E%3C/svg%3E");
}
.rsvp-inner { max-width: 580px; margin: 0 auto; position: relative; z-index: 1; }
.rsvp-intro { text-align: center; color: var(--text-lt); margin-bottom: 2rem; line-height: 1.7; }
.rsvp-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sage-dk); font-weight: 600; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem; border: 1.5px solid var(--beige-lt);
  border-radius: 8px; font-family: var(--sans); font-size: 0.9rem;
  background: white; color: var(--text); transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { outline: none; border-color: var(--sage); }
.radio-group { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.radio-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; }
.btn-submit {
  background: var(--sage); color: white; border: none;
  padding: 1rem 2rem; border-radius: 8px; font-family: var(--sans);
  font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer; transition: background 0.25s;
}
.btn-submit:hover { background: var(--sage-dk); }
.rsvp-status { text-align: center; font-size: 0.9rem; min-height: 1.5rem; color: var(--sage-dk); }

/* ── INFOS ── */
.section-infos { padding: var(--sp); background: var(--beige-lt); }
.infos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; max-width: 900px; margin: 0 auto; }
.info-card { background: white; border-radius: var(--r); padding: 1.5rem; }
.info-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
.info-card h3 { font-family: var(--serif); font-style: italic; font-size: 1.05rem; color: var(--brown); margin-bottom: 0.4rem; }
.info-card p { font-size: 0.85rem; color: var(--text-lt); line-height: 1.65; }

/* ── FOOTER ── */
.footer { padding: 3rem 2rem; text-align: center; background: var(--brown); color: rgba(255,255,255,0.6); }
.footer-citation { font-family: var(--serif); font-style: italic; font-size: 1rem; margin-bottom: 0.5rem; color: var(--sage-lt); }
.footer-names { font-family: var(--serif); font-style: italic; font-size: 1.4rem; color: white; margin-bottom: 1.5rem; }
.footer-credit { font-size: 0.72rem; letter-spacing: 0.1em; }
.footer-credit a { color: var(--sage-lt); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .nav-links { display: none; flex-direction: column; position: fixed; inset: 0; top: 0; background: var(--cream); padding: 6rem 2rem 2rem; gap: 1.5rem; }
  .nav-links.open { display: flex; }
  .nav-links a { font-size: 1.1rem; color: var(--brown) !important; }
  .hamburger { display: flex; }
  .form-row { grid-template-columns: 1fr; }
  .prog-card:nth-child(even),
  .prog-card:nth-child(odd) { margin: 0; }
}
```

- [ ] **Commit**

```bash
git add templates/champetre/style.css
git commit -m "feat: champetre template - CSS styles"
```

```json:metadata
{"files": ["templates/champetre/style.css"], "verifyCommand": "open templates/champetre/index.html", "acceptanceCriteria": ["Palette vert sauge appliquée", "Timeline histoire scrollable", "Cartes programme décalées", "Responsive mobile"], "requiresUserVerification": false}
```

---

### Task 3: Champêtre — script.js

**Goal:** Créer le JS du template champêtre : Supabase init, hydrate(), canvas feuilles, IntersectionObserver, Leaflet, RSVP form.

**Files:**
- Create: `templates/champetre/script.js`

**Acceptance Criteria:**
- [ ] `hydrate()` peuple tous les IDs DOM depuis `MARIAGE`
- [ ] Section activités générée dynamiquement, masquée si `MARIAGE.activites` absent
- [ ] Canvas feuilles vertes animées dans le hero
- [ ] IntersectionObserver appliqué sur `.reveal-section`
- [ ] Carte Leaflet initialisée depuis `MARIAGE.carte`
- [ ] RSVP form envoie dans table `rsvp` Supabase, affiche confirmation

**Verify:** Ouvrir dans navigateur — les noms "Léa & Antoine" apparaissent, loader se ferme, canvas animé visible

**Steps:**

- [ ] **Créer `templates/champetre/script.js`**

```js
/* ═══════════════════════════════════════════
   CHAMPÊTRE · script.js
   Config-driven · IntersectionObserver + Leaflet + Canvas
═══════════════════════════════════════════ */
'use strict';

let db = null;
try { db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
catch (e) { console.warn('Supabase init failed:', e); }

/* ── UTILS ── */
function setText(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el[attr] = val;
}

/* ── HYDRATE ── */
function hydrate() {
  const M = MARIAGE;
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;

  // Loader
  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', M.date_affichage.toUpperCase());

  // Nav
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));

  // Hero
  setText('hero-invite', M.hero_intro || 'Vous êtes invités au mariage de');
  setText('hero-names-overlay', `${M.prenom1} & ${M.prenom2}`);
  setText('hero-date-overlay', M.date_affichage);
  setText('hero-cta-overlay', M.hero_cta || 'Confirmer ma présence');

  // Hero background photo
  if (M.photo_couple) {
    const img = document.getElementById('hero-img');
    if (img) { img.src = M.photo_couple; img.alt = `${M.prenom1} & ${M.prenom2}`; }
  }

  // Histoire
  setText('histoire-eyebrow', M.histoire_eyebrow || '');
  setText('histoire-titre', M.histoire_titre || 'Notre Histoire');
  const histWrap = document.getElementById('histoire-wrap');
  if (histWrap) {
    histWrap.innerHTML = (M.histoire || [])
      .filter(h => h.texte && h.texte.trim())
      .map(h => `
        <div class="hist-item">
          <p class="hist-year">${h.annee}</p>
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>`).join('');
  }

  // Programme
  setText('programme-eyebrow', M.programme_eyebrow || '');
  setText('programme-titre', M.programme_titre || 'Le Jour J');
  const progWrap = document.getElementById('prog-wrap');
  if (progWrap) {
    progWrap.innerHTML = (M.programme || []).map(p => `
      <div class="prog-card">
        <div class="prog-icon">${p.icon || '✿'}</div>
        <div>
          <p class="prog-heure">${p.heure}</p>
          <h3>${p.titre}</h3>
          <p>${p.lieu}</p>
        </div>
      </div>`).join('');
  }

  // Domaine
  setText('domaine-titre', M.domaine || '');
  const domainePhoto = document.getElementById('domaine-photo');
  if (domainePhoto && M.photos_ambiance?.[0]?.src) {
    domainePhoto.src = M.photos_ambiance[0].src;
  } else if (domainePhoto) {
    domainePhoto.closest('.domaine-photo-wrap').style.display = 'none';
  }

  // Activités
  const activitesSection = document.getElementById('activites');
  const activitesWrap    = document.getElementById('activites-wrap');
  if (activitesWrap) {
    if (M.activites && M.activites.length) {
      activitesWrap.innerHTML = M.activites.map(a => `
        <div class="activite-card">
          <div class="activite-emoji">${a.emoji}</div>
          <h3>${a.titre}</h3>
          <p>${a.description}</p>
        </div>`).join('');
    } else if (activitesSection) {
      activitesSection.style.display = 'none';
    }
  }

  // RSVP
  setText('rsvp-titre', M.rsvp_titre || 'Confirmer votre présence');
  setText('rsvp-intro', M.rsvp_intro || '');

  // Infos
  setText('infos-eyebrow', M.infos_eyebrow || '');
  setText('infos-titre', M.infos_titre || 'Infos Pratiques');
  const infosWrap = document.getElementById('infos-wrap');
  if (infosWrap) {
    infosWrap.innerHTML = (M.infos || [])
      .filter(i => i.titre && i.titre.trim())
      .map(i => `
        <div class="info-card">
          <div class="info-icon">${i.icon}</div>
          <h3>${i.titre}</h3>
          <p>${i.texte}</p>
        </div>`).join('');
  }

  // Footer
  setText('footer-citation', M.citation || '');
  setText('footer-names', `${M.prenom1} & ${M.prenom2}`);
}

/* ── LOADER ── */
function runLoader() {
  const progress = document.getElementById('loader-progress');
  const loader   = document.getElementById('loader');
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 95);
    if (progress) progress.style.width = pct + '%';
  }, 120);
  window.addEventListener('load', () => {
    clearInterval(iv);
    if (progress) progress.style.width = '100%';
    setTimeout(() => {
      if (loader) { loader.style.opacity = '0'; loader.style.transition = 'opacity 0.6s'; }
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
        document.body.classList.remove('is-loading');
      }, 600);
    }, 400);
  });
}

/* ── CANVAS FEUILLES ── */
function initLeaves() {
  const canvas = document.getElementById('leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, leaves = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#8FAF8A', '#B8CFBB', '#6B8F66', '#C9B99A'];
  for (let i = 0; i < 28; i++) {
    leaves.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800) - (H || 800),
      r: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.0,
      swing: 0.4 + Math.random() * 0.8,
      swingSpeed: 0.015 + Math.random() * 0.02,
      t: Math.random() * Math.PI * 2,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.25 + Math.random() * 0.35,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const l of leaves) {
      l.y += l.speed;
      l.t += l.swingSpeed;
      l.x += Math.sin(l.t) * l.swing;
      l.r += 0.008;
      if (l.y > H + 20) { l.y = -20; l.x = Math.random() * W; }
      ctx.save();
      ctx.globalAlpha = l.opacity;
      ctx.translate(l.x, l.y);
      ctx.rotate(l.r);
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size * 0.5, l.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── NAV SCROLL ── */
function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }
}

/* ── INTERSECTION OBSERVER ── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
}

/* ── LEAFLET ── */
function initMap() {
  const M = MARIAGE;
  if (!M.carte || !window.L) return;
  const map = L.map('map', { zoomControl: true, scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 18
  }).addTo(map);
  map.setView([M.carte.lat, M.carte.lng], M.carte.zoom || 14);
  L.marker([M.carte.lat, M.carte.lng]).addTo(map)
    .bindPopup(`<strong>${M.carte.nom}</strong><br>${(M.carte.adresse || []).join('<br>')}`).openPopup();
}

/* ── RSVP ── */
function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('rsvp-status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
    const data = {
      prenom:   form.prenom.value.trim(),
      nom:      form.nom.value.trim(),
      presence: form.presence.value,
      regime:   form.regime.value,
      message:  form.message.value.trim(),
    };
    if (!data.prenom || !data.nom || !data.presence) {
      if (status) status.textContent = 'Merci de remplir les champs obligatoires.';
      if (btn) { btn.disabled = false; btn.textContent = MARIAGE.hero_cta || 'Confirmer'; }
      return;
    }
    if (db) {
      const { error } = await db.from('rsvp').insert([data]);
      if (error) {
        if (status) status.textContent = 'Une erreur est survenue. Réessayez ou contactez-nous par email.';
        if (btn) { btn.disabled = false; btn.textContent = MARIAGE.hero_cta || 'Confirmer'; }
        return;
      }
    }
    form.style.display = 'none';
    if (status) status.textContent = '🌿 Merci ! Votre réponse a bien été enregistrée.';
  });
}

/* ── INIT ── */
hydrate();
runLoader();
initNav();
initLeaves();
initReveal();
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initRsvp();
});
```

- [ ] **Commit**

```bash
git add templates/champetre/script.js
git commit -m "feat: champetre template - JS hydration + animations"
```

```json:metadata
{"files": ["templates/champetre/script.js"], "verifyCommand": "open templates/champetre/index.html", "acceptanceCriteria": ["Noms affichés depuis config", "Canvas feuilles animé", "Loader se ferme", "RSVP soumis à Supabase"], "requiresUserVerification": false}
```

---

## ══ TEMPLATE 2 — CHIC ══

### Task 4: Chic — config.js + supabase-config.js

**Goal:** Créer les fichiers de config avec données exemple et champ `dresscode` propre au thème chic.

**Files:**
- Create: `templates/chic/config.js`
- Create: `templates/chic/supabase-config.js`

**Acceptance Criteria:**
- [ ] `config.js` contient un objet `MARIAGE` valide
- [ ] Champ `dresscode` présent avec `texte` et `couleurs[]`
- [ ] Champ `photos[]` présent avec 6 entrées

**Verify:** `MARIAGE.dresscode.texte` retourne une chaîne non vide dans la console navigateur

**Steps:**

- [ ] **Créer `templates/chic/config.js`** avec les valeurs exemple suivantes :
  - `prenom1: "Camille"`, `prenom2: "Édouard"`, date `2025-09-19T18:00:00`
  - `programme` avec icônes romains (I, II, III, IV) au lieu d'emojis
  - `photos: [{ src: null, alt: "..." }, ...]` — 6 entrées, src null = placeholder
  - `dresscode: { texte: "Tenue de soirée exigée. Smoking ou costume sombre. Robe longue ou tailleur.", couleurs: ["#F8F5EE","#C9A96E","#1A1A1A","#8B7355","#D4C5A9"] }`
  - `video_hero: { type: "none", src: "" }`
  - Champs non utilisés (`galerie`, `dress_couleurs`) = tableaux vides

- [ ] **Créer `templates/chic/supabase-config.js`**

```js
const SUPABASE_URL      = 'REMPLACER_PAR_VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'REMPLACER_PAR_VOTRE_CLE_ANON_SUPABASE';
```

- [ ] **Commit**

```bash
git add templates/chic/config.js templates/chic/supabase-config.js
git commit -m "feat: chic template - config files"
```

```json:metadata
{"files": ["templates/chic/config.js", "templates/chic/supabase-config.js"], "verifyCommand": "", "acceptanceCriteria": ["MARIAGE object valide avec dresscode{}", "photos[] présent"], "requiresUserVerification": false}
```

---

### Task 5: Chic — index.html

**Goal:** Créer la structure HTML du template chic — hero typographique noir, countdown, timeline luxe, galerie masonry, dresscode, RSVP noir, infos ivoire.

**Files:**
- Create: `templates/chic/index.html`

**Acceptance Criteria:**
- [ ] 7 sections : `#accueil`, `#countdown`, `#programme`, `#galerie`, `#dresscode`, `#rsvp`, `#infos`
- [ ] IDs Studio présents : `loader-p1`, `loader-p2`, `hero-names-overlay`, `hero-date-overlay`, `hero-invite`, `hero-cta-overlay`
- [ ] GSAP chargé depuis CDN `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- [ ] Countdown avec IDs : `cd-jours`, `cd-heures`, `cd-minutes`, `cd-secondes`
- [ ] Galerie wrap : `id="galerie-wrap"`, Dress code wrap : `id="dresscode-swatches"`

**Verify:** Page charge sans erreur console — fond noir visible, noms centrés

**Steps:**

- [ ] **Créer `templates/chic/index.html`** avec la structure suivante :
  - `<head>` : Bodoni Moda + Josefin Sans (Google Fonts), `style.css`, pas de Leaflet
  - Loader avec `lm-sep` (tiret) au lieu de diamond
  - Hero : `hero-names` en `<h1>`, `hero-rule` div séparateur doré, `hero-date`, `btn-hero`, `scroll-chevron` &#8964;
  - Countdown : 4 blocs `.countdown-block` avec `.cd-num` + `.cd-label`, séparés par `.countdown-sep`
  - Programme : `<div class="timeline" id="prog-wrap">` — items générés par JS
  - Galerie : `<div class="masonry-grid" id="galerie-wrap">` — items générés par JS
  - Dresscode : `dresscode-texte` + `dresscode-swatches`
  - RSVP : fond noir, champs avec `border-bottom` doré
  - Infos : `<div class="infos-list" id="infos-wrap">` — fond ivoire
  - Scripts dans l'ordre : GSAP CDN → Supabase CDN → `supabase-config.js` → `config.js` → `script.js`

- [ ] **Commit**

```bash
git add templates/chic/index.html
git commit -m "feat: chic template - HTML structure"
```

```json:metadata
{"files": ["templates/chic/index.html"], "verifyCommand": "open templates/chic/index.html", "acceptanceCriteria": ["7 sections présentes", "IDs Studio présents", "GSAP chargé"], "requiresUserVerification": false}
```

---

### Task 6: Chic — style.css

**Goal:** CSS complet du thème chic (noir/blanc/or) — hero typographique, countdown Bodoni, timeline romaine dorée, galerie masonry grayscale, RSVP noir, infos ivoire.

**Files:**
- Create: `templates/chic/style.css`

**Acceptance Criteria:**
- [ ] Variables `:root` : `--noir #0A0A0A`, `--ivoire #F8F5EE`, `--or #C9A96E`, polices Bodoni Moda + Josefin Sans
- [ ] `.hero-names` : Bodoni Moda italic, `font-size: clamp(4rem, 14vw, 10rem)`, opacité 0 (animée par GSAP)
- [ ] `.hero-rule` : `width:200px; height:1px; background: var(--or)` centré
- [ ] `.timeline::before` : ligne verticale dorée, `.timeline-item::before` affiche `attr(data-roman)` en or
- [ ] `.masonry-grid` : `columns: 3 280px; gap: 12px`, images `filter: grayscale(100%)`, hover `grayscale(0%)` + bord or 2px
- [ ] `.section-rsvp` fond noir, `input/select/textarea` : `border-bottom: 1px solid rgba(201,169,110,0.3)`
- [ ] `.section-infos` fond `var(--ivoire)`

**Verify:** Hero 100vh fond noir, grands noms italiques Bodoni centrés

**Steps:**

- [ ] **Créer `templates/chic/style.css`** avec :

```css
:root {
  --noir: #0A0A0A; --noir-md: #1A1A1A;
  --ivoire: #F8F5EE; --ivoire-dk: #EDE8DC;
  --or: #C9A96E; --or-lt: #D9BC8A; --or-dk: #A8844A;
  --blanc: #FFFFFF;
  --texte-clair: #FFFFFF; --texte-fonce: #1A1A1A; --texte-doux: #5A5040;
  --serif: 'Bodoni Moda', Georgia, serif;
  --sans: 'Josefin Sans', sans-serif;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --sp: clamp(5rem, 10vw, 9rem) clamp(2rem, 8vw, 6rem);
}
```

Puis : reset, loader (fond noir, monogramme Bodoni blanc), nav (fixe, scrolled = background #0A0A0A+border or), hero (100vh fond noir, noms opacité 0), countdown (fond ivoire, chiffres Bodoni géants), timeline (fond noir, ligne gauche or, numéros romains via `attr(data-roman)`), galerie masonry (fond noir, grayscale + hover), dresscode (fond noir centré), rsvp (fond noir, inputs borderless sauf bottom), infos (fond ivoire), footer (fond noir, séparateur or), responsive mobile (nav fixe hamburger, masonry 2 colonnes).

- [ ] **Commit**

```bash
git add templates/chic/style.css
git commit -m "feat: chic template - CSS styles"
```

```json:metadata
{"files": ["templates/chic/style.css"], "verifyCommand": "open templates/chic/index.html", "acceptanceCriteria": ["Hero fond noir", "Timeline dorée", "Galerie grayscale+hover", "RSVP fond noir"], "requiresUserVerification": false}
```

---

### Task 7: Chic — script.js

**Goal:** JS du template chic — hydrate(), GSAP animation hero lettre par lettre, countdown setInterval, galerie dynamique, swatches dresscode, RSVP Supabase.

**Files:**
- Create: `templates/chic/script.js`

**Acceptance Criteria:**
- [ ] `hydrate()` peuple tous les IDs DOM depuis `MARIAGE`
- [ ] Noms wrappés lettre par lettre en `<span class="hero-char">` pour GSAP
- [ ] `initGsapHero()` appelé après fermeture du loader : anime `.hero-char` avec `gsap.from({opacity:0, y:30, stagger:0.04})`
- [ ] `initCountdown()` : `setInterval(1000)` calcule diff depuis `MARIAGE.date_iso`, peuple `cd-jours/heures/minutes/secondes`
- [ ] Galerie générée depuis `MARIAGE.photos[]` — `src:null` = `<div class="masonry-placeholder">◆</div>`
- [ ] Swatches générés depuis `MARIAGE.dresscode.couleurs[]` — `<div class="swatch-circle" style="background:HEX">`
- [ ] Programme avec `data-roman="I"` ... `data-roman="IV"` (tableau ROMANS)
- [ ] RSVP submit → Supabase `rsvp` table

**Verify:** Ouvrir dans navigateur — après loader, noms apparaissent lettre à lettre, countdown tourne chaque seconde

**Steps:**

- [ ] **Créer `templates/chic/script.js`** avec :

```js
'use strict';
const ROMANS = ['I','II','III','IV','V','VI','VII','VIII'];
let db = null;
try { db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch(e) {}

function setText(id, html) { const el=document.getElementById(id); if(el) el.innerHTML=html; }

function hydrate() {
  const M = MARIAGE;
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;
  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', M.date_affichage.toUpperCase());
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));
  // Hero — wrap chaque lettre pour GSAP
  const namesEl = document.getElementById('hero-names-overlay');
  if (namesEl) {
    namesEl.innerHTML =
      M.prenom1.split('').map(c=>`<span class="hero-char">${c}</span>`).join('') +
      `<span class="hero-amp"> &amp; </span>` +
      M.prenom2.split('').map(c=>`<span class="hero-char">${c}</span>`).join('');
  }
  setText('hero-date-overlay', M.date_affichage.toUpperCase());
  setText('hero-cta-overlay', M.hero_cta || 'RSVP');
  // Programme timeline
  setText('programme-eyebrow', M.programme_eyebrow || '');
  setText('programme-titre', M.programme_titre || 'Programme');
  const pw = document.getElementById('prog-wrap');
  if (pw) pw.innerHTML = (M.programme||[]).map((p,i)=>`
    <div class="timeline-item" data-roman="${ROMANS[i]||i+1}">
      <p class="timeline-heure">${p.heure}</p>
      <h3>${p.titre}</h3><p>${p.lieu}</p>
    </div>`).join('');
  // Galerie
  const gw = document.getElementById('galerie-wrap');
  if (gw && (M.photos||[]).length) {
    gw.innerHTML = (M.photos||[]).map(p=>p.src
      ? `<div class="masonry-item"><img src="${p.src}" alt="${p.alt||''}" loading="lazy"/></div>`
      : `<div class="masonry-item"><div class="masonry-placeholder">◆</div></div>`
    ).join('');
  } else { document.getElementById('galerie')?.style.setProperty('display','none'); }
  // Dresscode
  if (M.dresscode?.texte) {
    setText('dresscode-texte', M.dresscode.texte);
    const sw = document.getElementById('dresscode-swatches');
    if (sw) sw.innerHTML = (M.dresscode.couleurs||[]).map(h=>
      `<div class="swatch"><div class="swatch-circle" style="background:${h}"></div></div>`).join('');
  } else { document.getElementById('dresscode')?.style.setProperty('display','none'); }
  // RSVP + infos
  setText('rsvp-titre', M.rsvp_titre||'R.S.V.P.');
  setText('rsvp-intro', M.rsvp_intro||'');
  setText('infos-titre', M.infos_titre||'Informations');
  const iw = document.getElementById('infos-wrap');
  if (iw) iw.innerHTML = (M.infos||[]).filter(i=>i.titre?.trim()).map(i=>
    `<div class="info-item"><div class="info-icon">${i.icon}</div><div><h3>${i.titre}</h3><p>${i.texte}</p></div></div>`).join('');
  setText('footer-names', `${M.prenom1} &amp; ${M.prenom2}`);
  setText('footer-citation', M.citation||'');
}

function runLoader() {
  const prog=document.getElementById('loader-progress'), loader=document.getElementById('loader');
  let pct=0;
  const iv=setInterval(()=>{ pct=Math.min(pct+Math.random()*20,95); if(prog) prog.style.width=pct+'%'; },100);
  window.addEventListener('load',()=>{
    clearInterval(iv); if(prog) prog.style.width='100%';
    setTimeout(()=>{ if(loader){loader.style.opacity='0';loader.style.transition='opacity 0.5s';}
      setTimeout(()=>{ if(loader) loader.style.display='none'; document.body.classList.remove('is-loading'); initGsapHero(); },500);
    },300);
  });
}

function initGsapHero() {
  if (!window.gsap) return;
  gsap.set('.hero-char',{opacity:0,y:30});
  gsap.set(['.hero-amp','.hero-rule','.hero-date','.btn-hero'],{opacity:0});
  gsap.timeline({defaults:{ease:'power3.out'}})
    .to('.hero-char',{opacity:1,y:0,stagger:0.04,duration:0.8})
    .to('.hero-amp',{opacity:1,duration:0.4},'-=0.3')
    .to('.hero-rule',{opacity:1,scaleX:1,duration:0.5,transformOrigin:'left'},'-=0.2')
    .to('.hero-date',{opacity:1,y:0,duration:0.5},'-=0.2')
    .to('.btn-hero',{opacity:1,y:0,duration:0.4},'-=0.2');
}

function initCountdown() {
  const target=new Date(MARIAGE.date_iso);
  const pad=n=>String(Math.floor(n)).padStart(2,'0');
  function update(){
    const diff=target-new Date();
    if(diff<=0){['cd-jours','cd-heures','cd-minutes','cd-secondes'].forEach(id=>setText(id,'00'));return;}
    setText('cd-jours',   pad(diff/86400000));
    setText('cd-heures',  pad((diff%86400000)/3600000));
    setText('cd-minutes', pad((diff%3600000)/60000));
    setText('cd-secondes',pad((diff%60000)/1000));
  }
  update(); setInterval(update,1000);
}

function initNav() {
  const nav=document.getElementById('navbar');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60));
  const hb=document.getElementById('hamburger'),nl=document.getElementById('nav-links');
  if(hb&&nl){ hb.addEventListener('click',()=>nl.classList.toggle('open')); nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open'))); }
}

function initReveal() {
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:0.1});
  document.querySelectorAll('.reveal-section').forEach(el=>obs.observe(el));
}

function initRsvp() {
  const form=document.getElementById('rsvp-form'),status=document.getElementById('rsvp-status');
  if(!form) return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=document.getElementById('rsvp-btn');
    if(btn){btn.disabled=true;btn.textContent='…';}
    const data={prenom:form.prenom.value.trim(),nom:form.nom.value.trim(),presence:form.presence.value,regime:form.regime.value,message:form.message.value.trim()};
    if(!data.prenom||!data.nom||!data.presence){if(status)status.textContent='Veuillez remplir tous les champs.';if(btn){btn.disabled=false;btn.textContent='Confirmer';}return;}
    if(db){const{error}=await db.from('rsvp').insert([data]);if(error){if(status)status.textContent='Erreur. Contactez-nous par email.';if(btn){btn.disabled=false;btn.textContent='Confirmer';}return;}}
    form.style.display='none'; if(status) status.textContent='Merci. Votre réponse a été enregistrée.';
  });
}

hydrate(); runLoader(); initNav(); initCountdown(); initReveal();
document.addEventListener('DOMContentLoaded', initRsvp);
```

- [ ] **Commit**

```bash
git add templates/chic/script.js
git commit -m "feat: chic template - JS hydration + GSAP + countdown"
```

```json:metadata
{"files": ["templates/chic/script.js"], "verifyCommand": "open templates/chic/index.html", "acceptanceCriteria": ["Noms animés GSAP", "Countdown tourne", "Swatches dresscode", "RSVP Supabase"], "requiresUserVerification": false}
```

---


## ══ TEMPLATE 3 — ROMANTIQUE ══

### Task 8: Romantique — config.js + supabase-config.js

**Goal:** Créer les fichiers de config avec données exemple et champs `citation`, `souhaits[]`, `mot_des_maries` propres au thème romantique.

**Files:**
- Create: `templates/romantique/config.js`
- Create: `templates/romantique/supabase-config.js`

**Acceptance Criteria:**
- [ ] `config.js` contient un objet `MARIAGE` valide
- [ ] Champ `citation` (string), `souhaits[]` (4 entrées), `mot_des_maries` (string) présents
- [ ] `photos[]` avec 5 entrées pour le carrousel

**Verify:** `MARIAGE.souhaits.length` retourne 4 dans la console navigateur

**Steps:**

- [ ] **Créer `templates/romantique/config.js`** avec :
  - `prenom1: "Manon"`, `prenom2: "Raphaël"`, date `2025-05-31T15:30:00`
  - `citation: "« Aimer, c'est trouver sa richesse en l'autre. — Bossuet »"`
  - `photos: [{ src: null, alt: "..." }]` — 5 entrées pour le carrousel
  - `souhaits: [{ emoji:"🏡", titre:"Voyage de noces", description:"Une contribution à notre lune de miel à Bali", lien:"" }, { emoji:"🍽️", titre:"Dîner romantique", description:"...", lien:"" }, { emoji:"🌸", titre:"Fleurs", description:"...", lien:"" }, { emoji:"🎁", titre:"Surprise", description:"Toute attention touchante est la bienvenue", lien:"" }]`
  - `mot_des_maries: "Merci d'être là pour partager ce moment magique avec nous. Votre présence est le plus beau des cadeaux."`
  - Thème Histoire : 3 entrées avec photos `null` (alternance photo/texte)

- [ ] **Créer `templates/romantique/supabase-config.js`**

```js
const SUPABASE_URL      = 'REMPLACER_PAR_VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'REMPLACER_PAR_VOTRE_CLE_ANON_SUPABASE';
```

- [ ] **Commit**

```bash
git add templates/romantique/config.js templates/romantique/supabase-config.js
git commit -m "feat: romantique template - config files"
```

```json:metadata
{"files": ["templates/romantique/config.js", "templates/romantique/supabase-config.js"], "verifyCommand": "", "acceptanceCriteria": ["MARIAGE object valide", "souhaits[] et mot_des_maries présents", "photos[] 5 entrées"], "requiresUserVerification": false}
```

---

### Task 9: Romantique — index.html

**Goal:** Créer la structure HTML du template romantique — hero pétales canvas, histoire alternée, timeline cœur, carrousel plein écran, souhaits, RSVP lettre, mot des mariés.

**Files:**
- Create: `templates/romantique/index.html`

**Acceptance Criteria:**
- [ ] 7 sections : `#accueil`, `#histoire`, `#programme`, `#galerie`, `#souhaits`, `#rsvp`, `#mot`
- [ ] IDs Studio présents : `loader-p1`, `loader-p2`, `hero-names-overlay`, `hero-date-overlay`, `hero-invite`, `hero-cta-overlay`
- [ ] `<canvas id="petales-canvas">` dans le hero
- [ ] Carrousel : `id="carousel-track"` + `.carousel-prev` + `.carousel-next` + `id="carousel-dots"`
- [ ] Aucun GSAP ni Leaflet requis

**Verify:** Page charge sur fond ivoire doux, noms en Cormorant Garamond italic

**Steps:**

- [ ] **Créer `templates/romantique/index.html`** avec la structure suivante :
  - `<head>` : Cormorant Garamond (ital, 300/400/600) + Nunito (300/400/500), `style.css`, pas de GSAP ni Leaflet
  - Loader : monogramme Cormorant italic rose, `.lm-heart` ♡ à la place de l'ampersand
  - Nav : liens vers `#histoire`, `#programme`, `#galerie`, `#souhaits`, `#rsvp`, `#mot`
  - Hero `#accueil` : `<canvas id="petales-canvas">`, noms en `<h1 id="hero-names-overlay">`, `<p id="hero-citation">` pour la citation, `<p id="hero-date-overlay">`, `<a id="hero-cta-overlay">`
  - Histoire `#histoire` : `<div id="histoire-wrap">` — articles alternés générés par JS
  - Programme `#programme` : `<div class="timeline-coeur" id="prog-wrap">`
  - Galerie `#galerie` : `.carousel-wrapper > #carousel-track > .carousel-slide[]` + contrôles `.carousel-prev` (&#8592;) `.carousel-next` (&#8594;) + `<div id="carousel-dots">`
  - Souhaits `#souhaits` : `<div class="souhaits-grid" id="souhaits-wrap">`
  - RSVP `#rsvp` : `.rsvp-lettre > form#rsvp-form`
  - Mot des mariés `#mot` : `<blockquote id="mot-texte">` + `<p class="signature" id="mot-signature">` + SVG cœur
  - Scripts : Supabase CDN → `supabase-config.js` → `config.js` → `script.js`

- [ ] **Commit**

```bash
git add templates/romantique/index.html
git commit -m "feat: romantique template - HTML structure"
```

```json:metadata
{"files": ["templates/romantique/index.html"], "verifyCommand": "open templates/romantique/index.html", "acceptanceCriteria": ["7 sections présentes", "IDs Studio présents", "Canvas pétales présent", "Carrousel structure correcte"], "requiresUserVerification": false}
```

---

### Task 10: Romantique — style.css

**Goal:** CSS complet du thème romantique — rose poudré/blush/ivoire, hero dégradé, histoire alternée, timeline cœur, carrousel plein écran, souhaits carte postale, RSVP lettre d'invitation.

**Files:**
- Create: `templates/romantique/style.css`

**Acceptance Criteria:**
- [ ] Variables `:root` : `--rose #F2C4CE`, `--blush #E8A0B0`, `--fond #FAF6F2`, `--prune #6B3F4A`, polices Cormorant Garamond + Nunito
- [ ] Hero : fond `linear-gradient(160deg, #FAF6F2 0%, #F2C4CE 100%)`, canvas en `position:absolute`
- [ ] `.histoire-item` : `display:grid; grid-template-columns: 1fr 1fr` en desktop, `nth-child(even)` inversé
- [ ] `.timeline-coeur .prog-item::before` : icône cœur SVG ou `content:"♡"` centré sur la ligne verticale
- [ ] `.carousel-wrapper` : `position:relative; overflow:hidden; height:100vh`
- [ ] `.carousel-slide img` : `object-fit:cover; width:100%; height:100%`
- [ ] `.souhaits-grid` : grille 2 colonnes, style carte postale (fond blanc, ombre douce, coin arrondi)
- [ ] `.rsvp-lettre` : fond blanc, padding généreux, ombre légère, `border-radius:8px` — style feuille de papier
- [ ] `.mot-section` fond ivoire, `blockquote` Cormorant italic grand, `.signature` très grand italic

**Verify:** Hero sur fond rose-ivoire doux, noms en italique Cormorant — aucun fond noir visible

**Steps:**

- [ ] **Créer `templates/romantique/style.css`** avec :

```css
:root {
  --rose:     #F2C4CE;
  --rose-dk:  #D9A0AE;
  --blush:    #E8A0B0;
  --fond:     #FAF6F2;
  --fond-dk:  #F0E8E2;
  --prune:    #6B3F4A;
  --prune-dk: #4A2A33;
  --prune-lt: #9B6070;
  --blanc:    #FFFFFF;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans:  'Nunito', sans-serif;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --sp: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 4rem);
  --r: 16px;
}
```

Puis : reset (fond `--fond`, couleur `--prune`), loader (fond `--prune-dk`, monogramme Cormorant italic rose), nav (texte blanc sur fond transparent → scrolled fond ivoire), hero (gradient rose/ivoire, canvas absolu, noms Cormorant clamp(4rem,12vw,8rem) italic), histoire (alternance grid pair/impair desktop, empilé mobile), programme timeline-coeur (fond `#FDF0F3`, icônes cœur, ligne verticale blush), carrousel (100vh, track flex, transitions opacity+scale), souhaits (grille 2 col, cartes blanches ombre), rsvp-lettre (fond blanc centré, ombre, padding 3rem), mot-section (fond ivoire, blockquote 1.4rem italic, signature Cormorant 3rem italic prune), footer (fond prune-dk).

- [ ] **Commit**

```bash
git add templates/romantique/style.css
git commit -m "feat: romantique template - CSS styles"
```

```json:metadata
{"files": ["templates/romantique/style.css"], "verifyCommand": "open templates/romantique/index.html", "acceptanceCriteria": ["Hero fond rose/ivoire", "Cormorant Garamond visible", "Carrousel 100vh", "RSVP style lettre"], "requiresUserVerification": false}
```

---

### Task 11: Romantique — script.js

**Goal:** JS du template romantique — hydrate(), canvas pétales roses, histoire alternée avec photos, timeline cœur, carrousel JS natif, souhaits, RSVP Supabase, mot des mariés.

**Files:**
- Create: `templates/romantique/script.js`

**Acceptance Criteria:**
- [ ] `hydrate()` peuple tous les IDs DOM, `hero-citation` peuplé depuis `MARIAGE.citation`
- [ ] `initPetales()` : canvas petals elliptiques en teintes roses (`#F2C4CE`, `#E8A0B0`, `#D9A0AE`), même logique que champêtre mais `ellipse(size*0.6, size, angle)` avec rotation
- [ ] `initHistoire()` : articles alternés — pair = photo gauche/texte droite, impair = texte gauche/photo droite ; photo null = `<div class="photo-placeholder">♡</div>`
- [ ] Programme vertical : icône `♡` avant chaque item
- [ ] `initCarousel()` : prev/next boutons, dots nav, transitions CSS `transform: translateX`, autoplay optionnel 5s
- [ ] `initSouhaits()` : cartes depuis `MARIAGE.souhaits[]`, lien optionnel
- [ ] `initMot()` : peuple `mot-texte` et `mot-signature` depuis `MARIAGE.mot_des_maries` et `${M.prenom1} & ${M.prenom2}`
- [ ] Section `#mot` masquée si `MARIAGE.mot_des_maries` absent
- [ ] RSVP submit → Supabase table `rsvp`

**Verify:** Canvas pétales roses tombent dans le hero, carrousel fonctionne avec flèches

**Steps:**

- [ ] **Créer `templates/romantique/script.js`** avec les fonctions :

```js
'use strict';
let db = null;
try { db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch(e) {}

function setText(id, html) { const el=document.getElementById(id); if(el) el.innerHTML=html; }

function hydrate() {
  const M = MARIAGE;
  document.title = `${M.prenom1} & ${M.prenom2} · ${M.date_affichage}`;
  setText('loader-p1', M.prenom1.charAt(0));
  setText('loader-p2', M.prenom2.charAt(0));
  setText('loader-date', M.date_affichage.toUpperCase());
  setText('nav-p1', M.prenom1.charAt(0));
  setText('nav-p2', M.prenom2.charAt(0));
  setText('hero-names-overlay', `${M.prenom1} & ${M.prenom2}`);
  setText('hero-date-overlay', M.date_affichage);
  setText('hero-cta-overlay', M.hero_cta || 'Confirmer ma présence');
  setText('hero-invite', M.hero_intro || '');
  const citEl = document.getElementById('hero-citation');
  if (citEl) citEl.textContent = M.citation || '';
  // Histoire alternée
  setText('histoire-eyebrow', M.histoire_eyebrow || '');
  setText('histoire-titre', M.histoire_titre || 'Notre Histoire');
  const hw = document.getElementById('histoire-wrap');
  if (hw) {
    hw.innerHTML = (M.histoire||[]).filter(h=>h.texte?.trim()).map((h,i)=>`
      <article class="histoire-item ${i%2===0?'pair':'impair'}">
        <div class="hist-photo">
          ${h.photo ? `<img src="${h.photo}" alt="${h.titre}" />` : '<div class="photo-placeholder">♡</div>'}
        </div>
        <div class="hist-texte">
          <p class="hist-annee">${h.annee}</p>
          <h3>${h.titre}</h3>
          <p>${h.texte}</p>
        </div>
      </article>`).join('');
  }
  // Programme
  setText('programme-eyebrow', M.programme_eyebrow || '');
  setText('programme-titre', M.programme_titre || 'Le Grand Jour');
  const pw = document.getElementById('prog-wrap');
  if (pw) {
    pw.innerHTML = (M.programme||[]).map(p=>`
      <div class="prog-item">
        <span class="prog-coeur">♡</span>
        <div class="prog-content">
          <p class="prog-heure">${p.heure}</p>
          <h3>${p.titre}</h3>
          <p>${p.lieu}</p>
        </div>
      </div>`).join('');
  }
  // Souhaits
  const sw = document.getElementById('souhaits-wrap');
  const sSection = document.getElementById('souhaits');
  if (sw && M.souhaits?.length) {
    sw.innerHTML = M.souhaits.map(s=>`
      <div class="souhait-card">
        <div class="souhait-emoji">${s.emoji}</div>
        <h3>${s.titre}</h3>
        <p>${s.description}</p>
        ${s.lien ? `<a href="${s.lien}" target="_blank" class="souhait-lien">Voir ↗</a>` : ''}
      </div>`).join('');
  } else if (sSection) sSection.style.display = 'none';
  // Mot des mariés
  const motSection = document.getElementById('mot');
  if (M.mot_des_maries) {
    setText('mot-texte', M.mot_des_maries);
    setText('mot-signature', `${M.prenom1} & ${M.prenom2}`);
  } else if (motSection) motSection.style.display = 'none';
  // RSVP + infos
  setText('rsvp-titre', M.rsvp_titre || 'Confirmer votre présence');
  setText('rsvp-intro', M.rsvp_intro || '');
  setText('footer-names', `${M.prenom1} & ${M.prenom2}`);
  setText('footer-citation', M.citation || '');
}

function runLoader() {
  const prog=document.getElementById('loader-progress'), loader=document.getElementById('loader');
  let pct=0;
  const iv=setInterval(()=>{ pct=Math.min(pct+Math.random()*18,95); if(prog) prog.style.width=pct+'%'; },120);
  window.addEventListener('load',()=>{
    clearInterval(iv); if(prog) prog.style.width='100%';
    setTimeout(()=>{ if(loader){loader.style.opacity='0';loader.style.transition='opacity 0.6s';}
      setTimeout(()=>{ if(loader) loader.style.display='none'; document.body.classList.remove('is-loading'); },600);
    },400);
  });
}

function initPetales() {
  const canvas=document.getElementById('petales-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,petales=[];
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize',resize);
  const COLORS=['#F2C4CE','#E8A0B0','#D9A0AE','#F7D9E0','#EFC8D2'];
  for(let i=0;i<35;i++) petales.push({
    x:Math.random()*(W||1200), y:Math.random()*(H||800)-(H||800),
    r:Math.random()*Math.PI*2, speed:0.5+Math.random()*0.9,
    swing:0.3+Math.random()*0.7, swingSpeed:0.01+Math.random()*0.02,
    t:Math.random()*Math.PI*2, size:5+Math.random()*9,
    color:COLORS[Math.floor(Math.random()*COLORS.length)],
    opacity:0.3+Math.random()*0.4, rx:0.5+Math.random()*0.3,
  });
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const p of petales){
      p.y+=p.speed; p.t+=p.swingSpeed; p.x+=Math.sin(p.t)*p.swing; p.r+=0.015;
      if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}
      ctx.save(); ctx.globalAlpha=p.opacity;
      ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle=p.color; ctx.beginPath();
      ctx.ellipse(0,0,p.size*p.rx,p.size,0,0,Math.PI*2);
      ctx.fill(); ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function initCarousel() {
  const track=document.getElementById('carousel-track');
  const dotsWrap=document.getElementById('carousel-dots');
  if(!track) return;
  const slides=track.querySelectorAll('.carousel-slide');
  if(!slides.length) return;
  let current=0;
  // Dots
  if(dotsWrap) {
    dotsWrap.innerHTML='';
    slides.forEach((_,i)=>{ const d=document.createElement('button'); d.className='carousel-dot'+(i===0?' active':''); d.addEventListener('click',()=>goTo(i)); dotsWrap.appendChild(d); });
  }
  function goTo(n){
    current=(n+slides.length)%slides.length;
    track.style.transform=`translateX(-${current*100}%)`;
    dotsWrap?.querySelectorAll('.carousel-dot').forEach((d,i)=>d.classList.toggle('active',i===current));
  }
  document.querySelector('.carousel-prev')?.addEventListener('click',()=>goTo(current-1));
  document.querySelector('.carousel-next')?.addEventListener('click',()=>goTo(current+1));
  // Autoplay
  let timer=setInterval(()=>goTo(current+1),5000);
  track.closest('.carousel-wrapper')?.addEventListener('mouseenter',()=>clearInterval(timer));
  track.closest('.carousel-wrapper')?.addEventListener('mouseleave',()=>{timer=setInterval(()=>goTo(current+1),5000);});
}

function initNav() {
  const nav=document.getElementById('navbar');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60));
  const hb=document.getElementById('hamburger'),nl=document.getElementById('nav-links');
  if(hb&&nl){ hb.addEventListener('click',()=>nl.classList.toggle('open')); nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open'))); }
}

function initReveal() {
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:0.1});
  document.querySelectorAll('.reveal-section').forEach(el=>obs.observe(el));
}

function initRsvp() {
  const form=document.getElementById('rsvp-form'),status=document.getElementById('rsvp-status');
  if(!form) return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=document.getElementById('rsvp-btn');
    if(btn){btn.disabled=true;btn.textContent='Envoi…';}
    const data={prenom:form.prenom.value.trim(),nom:form.nom.value.trim(),presence:form.presence.value,regime:form.regime.value,message:form.message.value.trim()};
    if(!data.prenom||!data.nom||!data.presence){if(status)status.textContent='Merci de remplir les champs obligatoires.';if(btn){btn.disabled=false;btn.textContent=MARIAGE.hero_cta||'Confirmer';}return;}
    if(db){const{error}=await db.from('rsvp').insert([data]);if(error){if(status)status.textContent='Erreur. Contactez-nous par email.';if(btn){btn.disabled=false;btn.textContent='Confirmer';}return;}}
    form.style.display='none'; if(status) status.textContent='🌸 Merci ! Votre réponse a bien été enregistrée.';
  });
}

hydrate(); runLoader(); initPetales(); initNav(); initReveal();
document.addEventListener('DOMContentLoaded',()=>{ initCarousel(); initRsvp(); });
```

- [ ] **Commit**

```bash
git add templates/romantique/script.js
git commit -m "feat: romantique template - JS hydration + canvas + carousel"
```

```json:metadata
{"files": ["templates/romantique/script.js"], "verifyCommand": "open templates/romantique/index.html", "acceptanceCriteria": ["Canvas pétales roses animés", "Carrousel prev/next/dots fonctionnel", "Souhaits affichés", "RSVP Supabase"], "requiresUserVerification": false}
```

---

## Self-Review

**Couverture spec :**
- ✅ Task 0-3 : Template champêtre complet (config, HTML, CSS, JS)
- ✅ Task 4-7 : Template chic complet (config, HTML, CSS, JS)
- ✅ Task 8-11 : Template romantique complet (config, HTML, CSS, JS)
- ✅ Sections uniques : champêtre→activites, chic→countdown+dresscode, romantique→souhaits+mot
- ✅ Compatibilité Studio : IDs requis présents dans les 3 templates
- ✅ Champs config optionnels avec fallback display:none

**Vérification user :** NO — pas de verification humaine requise en cours d'implémentation.

**Dépendances entre tasks :**
- Tasks 1-3 dépendent de Task 0 (config doit exister avant d'ouvrir l'HTML)
- Tasks 5-7 dépendent de Task 4
- Tasks 9-11 dépendent de Task 8
- Les 3 groupes sont indépendants entre eux → peuvent être implémentés en parallèle

