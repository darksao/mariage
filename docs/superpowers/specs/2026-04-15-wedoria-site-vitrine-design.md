# Wedoria — Site Vitrine · Design Spec
**Date :** 2026-04-15
**Statut :** Approuvé

---

## Contexte & Objectif

Créer le site vitrine public de Wedoria — un studio qui conçoit et livre des sites web de mariage personnalisés, clé-en-main, en quelques jours.

Le site vitrine doit :
- Présenter le service et son positionnement premium
- Montrer les réalisations (section portfolio)
- Présenter les 3 formules tarifaires
- Permettre aux futurs clients de prendre contact / démarrer leur projet
- Inspirer confiance et émotion

---

## Fichiers & Emplacement

```
wedoria-site-vitrine/       ← dossier existant dans C:\Users\nhu-s\Documents\programs\
├── index.html
├── style.css
└── script.js
```

Déployable directement sur Vercel (fichiers statiques). Pas de build step, pas de framework.

---

## Stack Technique

- HTML5 / CSS3 / Vanilla JS
- GSAP 3 + ScrollTrigger (CDN)
- Google Fonts (Cormorant Garamond + Jost)
- Canvas API natif (pétales hero)
- Pas de backend — formulaire contact avec feedback visuel JS uniquement

---

## Design System

### Palette

| Rôle | Token | Valeur |
|---|---|---|
| Fond principal | `--ivory` | `#FAFAF7` |
| Fond secondaire | `--cream` | `#F8F4EE` |
| Accent chaud | `--warm` | `#EDE5D8` |
| Or | `--gold` | `#C9A96E` |
| Bordeaux | `--burgundy` | `#6B2737` |
| Texte | `--ink` | `#1C1C1C` |
| Texte inversé | `--paper` | `#F8F4EE` |

Sections sombres (Manifeste desktop, Portfolio desktop) : fond `#1C1C1C`, texte `#F8F4EE`. Crée un rythme visuel clair/sombre dans la page.

### Typographie

| Usage | Font | Style | Poids |
|---|---|---|---|
| Grands titres | Cormorant Garamond | italic | 300 |
| Titres sections | Cormorant Garamond | italic | 400 |
| Numéros déco | Cormorant Garamond | normal | 300 |
| Navigation | Jost | normal | 400 |
| Body / labels | Jost | normal | 300 |
| CTA / badges | Jost | normal | 500 |

Tailles via `clamp()` — fluides de mobile à desktop sans breakpoints typographiques.

Exemples :
- Titre hero : `clamp(2.8rem, 7vw, 6.5rem)`
- Titre section : `clamp(2rem, 4vw, 3.5rem)`
- Numéros étapes : `clamp(4rem, 8vw, 7rem)`

### Espacement

Padding sections : `clamp(5rem, 10vw, 10rem)` vertical.
Grille : CSS Grid natif, gap `clamp(1.5rem, 3vw, 3rem)`.

---

## Architecture Responsive (Mobile First)

Breakpoint unique : `768px`.

| Section | Mobile (< 768px) | Desktop (≥ 768px) |
|---|---|---|
| ④ Manifeste | Reveal IntersectionObserver (opacity+Y) | GSAP pin + scrub, mot par mot |
| ⑥ Portfolio | Grid vertical, scroll natif | GSAP scroll horizontal épinglé |
| Pétales canvas | 20 pétales | 50 pétales |
| Navbar | Logo centré + hamburger | Logo gauche + liens horizontaux |
| Formules | 1 colonne | 3 colonnes |
| Hover magnétique | Absent | Actif sur CTA |

`prefers-reduced-motion` : toutes les animations GSAP désactivées, contenu visible statiquement.

---

## Sections — Détail

### 1. Loader

- Fond : `#FAFAF7`
- Monogramme "W" en Cormorant Garamond italic, apparaît en `opacity 0→1` + léger `scale 0.9→1`
- Barre de progression fine (2px) en or `#C9A96E`
- Durée totale : ~1.8s
- Transition finale : fade-out du loader, fade-in du site

### 2. Navbar

- Position : fixed, `z-index: 100`
- Fond : transparent au départ, `rgba(250,250,247,0.92)` au scroll (transition 300ms)
- Backdrop-filter : blur(8px)
- Logo : "Wedoria" en Cormorant Garamond italic 1.4rem
- Liens desktop : Portfolio · Formules · Comment ça marche · Contact — Jost 300, letter-spacing 0.08em
- Mobile : hamburger icon (3 barres), menu plein écran en overlay avec fond `#1C1C1C`
- Smooth scroll vers les ancres

### 3. Hero — Plein Écran

- Fond : `#FAFAF7` ivoire
- Canvas fullscreen en fond absolu : pétales animés JS
  - Mobile : 20 pétales, taille 4–8px, couleur `rgba(201,169,110,0.35)`
  - Desktop : 50 pétales, taille 4–10px, physique : chute + rotation + oscillation légère
  - Les pétales se régénèrent en boucle depuis le haut
- Contenu centré :
  - Titre : `"Des sites de mariage qui racontent votre histoire."` — Cormorant italic
  - Sous-titre : `"Clé-en-main · Livré en 5 jours · À partir de 290€"` — Jost 300, letter-spacing, couleur `#6B2737`
  - CTA : `"Démarrer mon projet →"` — bouton fond `#1C1C1C`, texte `#F8F4EE`, hover fond `#C9A96E`
  - Hover magnétique (desktop) : le bouton suit légèrement la souris via JS (max ±8px)
- Scroll hint : chevron animé en bas, `opacity: 0` → `1` après 2s

### 4. Accroche / Manifeste

**Mobile :**
Texte révélé au scroll via IntersectionObserver. Chaque ligne apparaît en `opacity 0→1` + `translateY(20px→0)`, délai en stagger.

**Desktop :**
- Section `min-height: 300vh`, fond `#1C1C1C`
- GSAP `ScrollTrigger.pin()` sur le container visible (100vh)
- Texte découpé en `<span>` par mot
- Au scrub : chaque span passe de `opacity: 0.12` à `opacity: 1` progressivement
- Texte : *"Votre mariage est unique. Votre site devrait l'être aussi. Nous créons des expériences web qui capturent l'essence de votre histoire, pour que vos invités arrivent déjà émerveillés."*
- Taille : ~3.5vw, Cormorant italic, couleur `#F8F4EE`

### 5. Comment ça marche

- Fond : `#F8F4EE`
- 3 étapes, contenu :
  1. "Vous remplissez notre formulaire de découverte" — 15 min
  2. "Nous créons votre site sur-mesure" — 48–72h
  3. "Vous recevez le lien et invitez vos proches"
- Mobile : empilées verticalement
- Desktop : 3 colonnes, ligne dorée verticale entre elles (pseudo-element `::before` sur les colonnes 2 et 3)
- Numéros "01 / 02 / 03" en Cormorant Garamond 300, `clamp(4rem, 8vw, 7rem)`, couleur `#C9A96E`
- Animation : stagger d'entrée au scroll (opacity + translateY)

### 6. Portfolio — Nos créations

**Mobile :**
- Grid 1 colonne, gap 1.5rem
- Chaque card : placeholder gradient automnal, nom couple, date/lieu, lien "Voir le site →"

**Desktop :**
- Container épinglé GSAP, les cards se déplacent horizontalement au scrub
- `~200vh` de scroll → translateX du container cards
- Cards plus larges (350–400px), aspect ratio 4/3
- Hover : élévation `translateY(-6px)` + overlay bordeaux semi-transparent avec nom + lien

**Contenu (6 cartes placeholder) :**
| Couple | Lieu | Style |
|---|---|---|
| Catherine & Nhu-Sao | Château de Vaux-le-Vicomte | Automne élégant |
| Sophie & Thomas | Domaine de la Croix | Champêtre |
| Élise & Romain | Paris 7e | Urbain chic |
| Camille & Antoine | Côte d'Azur | Été méditerranéen |
| Marie & Lucas | Alsace | Automne doré |
| Anaïs & Pierre | Bretagne | Côtier naturel |

Chaque carte a un gradient placeholder thématique (couleurs de saison / région).

### 7. Les Formules

- Fond : `#FAFAF7`
- 3 colonnes desktop, 1 colonne mobile
- La carte Premium est légèrement scale(1.02) avec border or et badge "Le plus populaire" en fond `#C9A96E`
- Shimmer sur Premium : pseudo-element `::after` avec gradient en sweep, déclenché une fois à l'entrée en viewport

**Essentielle — 290€**
- Site 1 page, config personnalisée
- Hero · Programme · RSVP · Carte
- 1 langue
- Livraison 5 jours ouvrés
- Hébergement 12 mois
- Support email

**Premium — 490€** ← mise en avant
- Tout l'Essentielle +
- Galerie photos
- Compte à rebours
- Multilingue (FR + 1 langue)
- Photo couple pleine page
- Notre histoire (timeline)
- Code vestimentaire · FAQ
- Livraison 3 jours ouvrés

**Sur-mesure — sur devis**
- Tout le Premium +
- Design entièrement personnalisé
- Sections sur-mesure
- Animations additionnelles
- Vidéo héro personnalisée
- Intégrations spéciales
- Accompagnement dédié

Listes avec `✓` en or `#C9A96E`. Animation : stagger d'entrée au scroll.

### 8. Témoignages

- Fond : `#F8F4EE`
- 3 citations, style éditorial
- Guillemets `"` en Cormorant italic, `6rem`, couleur `#EDE5D8` (décoratif)
- Texte citation : Cormorant italic, `clamp(1.4rem, 2.5vw, 1.8rem)`
- Nom : Jost 300, lettre-espacement, couleur `#C9A96E`
- Desktop : 3 colonnes. Mobile : empilées.

**Contenu fictif :**
- *"Notre site a ébloui tous nos invités avant même la cérémonie."* — Élise & Romain
- *"Livré en 3 jours, exactement comme promis. Un vrai coup de cœur."* — Sophie & Thomas
- *"Clé-en-main vraiment. On a rempli le formulaire un lundi, le site était en ligne le jeudi."* — Camille & Antoine

### 9. Formulaire de Contact

- Fond : `#1C1C1C`
- Titre : *"Prêts à commencer ?"* — Cormorant italic, couleur `#F8F4EE`
- Sous-titre : *"Réponse sous 24h · Sans engagement"* — Jost 300, couleur `#C9A96E`
- Champs :
  - Prénom & Nom des mariés (2 colonnes desktop)
  - Date du mariage (input date)
  - Email
  - Formule souhaitée (select : Essentielle / Premium / Sur-mesure / Je ne sais pas encore)
  - Message (textarea)
- Styles : labels flottants CSS, fond transparent, border-bottom `#EDE5D8`, focus border `#C9A96E`
- CTA : "Envoyer notre projet" — fond `#C9A96E`, texte `#1C1C1C`, hover fond `#F8F4EE`
- Feedback JS : `action="#"`, preventDefault, affiche message de confirmation inline (pas d'alert)

### 10. Footer

- Fond : `#1C1C1C`
- Desktop : 3 colonnes
  - Gauche : Logo "Wedoria" Cormorant italic + tagline *"Fait avec soin, pour chaque histoire."*
  - Centre : Liens rapides (Portfolio · Formules · Comment ça marche · Contact)
  - Droite : contact@wedoria.fr
- Mobile : colonne unique, centré
- Copyright : `© 2026 Wedoria · Fait avec soin, pour chaque histoire.` — Jost 300, très petite taille, couleur `#888`

---

## Animations — Récapitulatif

| Animation | Technologie | Déclencheur |
|---|---|---|
| Loader | GSAP timeline | Chargement page |
| Pétales hero | Canvas 2D API + requestAnimationFrame | Permanent |
| Navbar blur | CSS transition | scroll event JS |
| Hover magnétique CTA | JS mousemove | hover |
| Manifeste word reveal | GSAP ScrollTrigger scrub (desktop) / IntersectionObserver (mobile) | Scroll |
| Étapes stagger | GSAP ScrollTrigger | Entrée viewport |
| Portfolio horizontal | GSAP ScrollTrigger pin + scrub (desktop) / natif (mobile) | Scroll |
| Cards formules stagger | GSAP ScrollTrigger | Entrée viewport |
| Shimmer Premium | CSS @keyframes | Entrée viewport (IntersectionObserver) |
| Témoignages stagger | GSAP ScrollTrigger | Entrée viewport |
| Formulaire feedback | JS pur | Submit |

---

## Contraintes

- `prefers-reduced-motion` : désactive toutes les animations GSAP, retire les transitions CSS
- Tout le texte hardcodé directement dans le HTML, commenté par section
- Focus visible sur tous les éléments interactifs
- `aria-label` sur les boutons icônes (hamburger, scroll hint)
- Scroll smooth natif (`scroll-behavior: smooth` en CSS)
- Images : uniquement des gradients CSS — aucune dépendance image externe
