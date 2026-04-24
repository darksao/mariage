# Spec — 3 Templates Mariage Wedoria Studio

**Date :** 2026-04-19  
**Statut :** Approuvé

---

## Contexte

Wedoria Studio dispose d'un template mariage existant (dossier `template/`) au thème automnal. L'objectif est de créer 3 nouveaux templates avec des structures et thèmes visuels différents, chargeables dans le Studio via drag & drop du `index.html`.

---

## Architecture

### Structure des fichiers

```
templates/
  champetre/
    index.html
    style.css
    script.js
    config.js         (copie du config.js de base, valeurs exemple)
    supabase-config.js
  chic/
    index.html
    style.css
    script.js
    config.js
    supabase-config.js
  romantique/
    index.html
    style.css
    script.js
    config.js
    supabase-config.js
```

### Compatibilité Studio

Chaque template doit être chargeable dans le Studio (`studio/`) via drag & drop du `index.html`. Le Studio injecte le contenu `config.js` dans la Blob URL. Chaque template doit donc :
- Utiliser le même objet `MARIAGE` comme source de vérité
- Avoir une fonction `hydrate()` appelée après injection du config
- Avoir les mêmes dépendances externes (GSAP, Leaflet, Supabase)

### Config partagé

Tous les templates utilisent le même schéma `config.js` que le template existant :
- `prenom1`, `prenom2`, `date_affichage`, `date_iso`
- `photo_couple`, `photo_ambiance_*`, `hero_intro`, `hero_cta`
- `histoire`, `programme`, `lieux`, `heros`, `rsvp`

---

## Template 1 — Champêtre

### Identité visuelle

| Token | Valeur |
|-------|--------|
| Couleur principale | `#8FAF8A` (vert sauge) |
| Couleur secondaire | `#C9B99A` (beige lin) |
| Fond | `#F5F0E5` (crème lin) |
| Texte | `#3D3028` (brun foncé) |
| Police titres | Playfair Display (italic, 300/400/600) |
| Police corps | Raleway (300/400/500) |

### Ambiance

Textures granuleuses (via CSS `background-image` noise SVG), layout asymétrique, illustrations botaniques SVG inline (feuilles, branches), beaucoup d'espace blanc, coins arrondis généreux.

### Sections (dans l'ordre)

1. **Hero photo plein écran**
   - Photo couple en `object-fit: cover` 100vh
   - Overlay sombre gradué (bas → haut)
   - Noms en Playfair Display italic centré
   - Couronne botanique SVG au-dessus des noms
   - Date en Raleway spaced-out

2. **Notre histoire** (`#histoire`)
   - Titre section : "Notre histoire"
   - Frise chronologique horizontale scrollable (3-4 étapes depuis `MARIAGE.histoire`)
   - Chaque étape : date + titre + texte court
   - Icône feuille SVG entre chaque étape

3. **Le programme** (`#programme`)
   - Fond crème légèrement texturé
   - 4 cartes en disposition décalée (alternance gauche/droite en desktop, pile en mobile)
   - Chaque carte : icône SVG + heure + titre + description (depuis `MARIAGE.programme`)

4. **Le domaine** (`#domaine`)
   - Photo panoramique plein largeur (depuis `MARIAGE.photo_ambiance_1`)
   - Texte poétique à droite sur fond blanc
   - Carte Leaflet interactive en dessous

5. **Les activités** (`#activites`) *(section unique champêtre)*
   - Grille de 3-4 activités outdoor proposées aux invités
   - Données depuis `MARIAGE.activites[]` (titre + description + emoji)
   - Fond vert sauge très doux

6. **RSVP** (`#rsvp`)
   - Formulaire Supabase : prénom, nom, présence, régime alimentaire, message
   - Fond crème avec motif floral SVG discret en filigrane
   - Bouton vert sauge

7. **Infos pratiques** (`#infos`)
   - 2 colonnes : hébergements + transports (depuis `MARIAGE.infos`)
   - Fond beige lin doux

### Animations

- Entrées au scroll avec `IntersectionObserver` (fade + translateY)
- Pas de GSAP (pas nécessaire pour ce thème)
- Frise chronologique : scroll horizontal sur mobile via `overflow-x: auto`

---

## Template 2 — Chic

### Identité visuelle

| Token | Valeur |
|-------|--------|
| Fond principal | `#0A0A0A` (noir) |
| Fond secondaire | `#F8F5EE` (ivoire) |
| Accent | `#C9A96E` (or) |
| Texte clair | `#FFFFFF` |
| Texte foncé | `#1A1A1A` |
| Police titres | Bodoni Moda (ital, opsz, 400/600) |
| Police corps | Josefin Sans (300/400/500) |

### Ambiance

Minimalisme luxueux. Beaucoup d'espace blanc/noir. Lignes fines dorées comme séparateurs. Typographie massive et aérée. Pas de photos en hero — le texte EST le design.

### Sections (dans l'ordre)

1. **Hero typographique** (`#accueil`)
   - Fond noir 100vh
   - Noms en Bodoni Moda, taille clamp(5rem, 14vw, 10rem), centré
   - Séparateur ligne fine dorée
   - Date en Josefin Sans, letter-spacing extrême, or
   - Scroll indicator : chevron doré animé

2. **Save the date** (`#countdown`) *(section unique chic)*
   - Fond ivoire
   - Titre "Save the date" en Bodoni Moda
   - Countdown en 4 blocs (Jours / Heures / Minutes / Secondes)
   - Chiffres en Bodoni énorme, labels en Josefin Sans spaced
   - JS natif `setInterval` depuis `MARIAGE.date_iso`

3. **Timeline luxe** (`#programme`)
   - Fond noir
   - Programme vertical avec numéros romains (I, II, III, IV...)
   - Chaque item : numéro romain or + heure + titre + description
   - Ligne verticale dorée qui connecte les items
   - Beaucoup d'espace entre chaque item

4. **Galerie** (`#galerie`)
   - Fond ivoire
   - Grille masonry CSS (3 colonnes desktop, 2 tablette, 1 mobile)
   - Images en noir & blanc via `filter: grayscale(100%)`
   - Survol : transition couleur + bord doré 2px
   - Images depuis `MARIAGE.photos[]`

5. **Dress code** (`#dresscode`) *(section unique chic)*
   - Fond noir
   - Titre "Dress Code" en Bodoni
   - Description du code vestimentaire depuis `MARIAGE.dresscode`
   - Palette de couleurs suggérées : swatches circulaires

6. **RSVP** (`#rsvp`)
   - Fond noir
   - Champs blancs bordure fine dorée
   - Label Josefin Sans uppercase spaced
   - Bouton doré plein

7. **Contact & infos** (`#infos`)
   - Fond ivoire
   - Typographie épurée, beaucoup d'espace
   - Infos de contact + lien Google Maps

### Animations

- GSAP pour l'entrée du hero (noms révélés lettre par lettre via SplitText ou span wrapping)
- `IntersectionObserver` pour le reste
- Countdown JS natif avec `setInterval`

---

## Template 3 — Romantique

### Identité visuelle

| Token | Valeur |
|-------|--------|
| Rose poudré | `#F2C4CE` |
| Blush | `#E8A0B0` |
| Fond | `#FAF6F2` (ivoire chaud) |
| Prune | `#6B3F4A` (texte principal) |
| Prune doux | `#9B6070` (texte secondaire) |
| Police titres | Cormorant Garamond (ital, 300/400/600) |
| Police corps | Nunito (300/400/500) |

### Ambiance

Doux, aérien, poétique. Animation de pétales tombants (canvas). Beaucoup de courbes et de `border-radius`. Photos en avant-plan. Citations en italique. Palette très douce.

### Sections (dans l'ordre)

1. **Hero poétique** (`#accueil`)
   - Fond dégradé `#FAF6F2` → `#F2C4CE` très doux
   - Canvas de pétales tombants (formes elliptiques roses, même approche que les feuilles du template existant)
   - Noms en Cormorant Garamond italic, taille clamp(4rem, 12vw, 8rem)
   - Citation romantique courte sous les noms (depuis `MARIAGE.citation`)
   - Date en Nunito doux, lettre espacée

2. **Notre histoire d'amour** (`#histoire`)
   - Alternance photo plein largeur / bloc texte (desktop : côte à côte ; mobile : empilé)
   - 3 moments clés depuis `MARIAGE.histoire[]`
   - Chaque moment : photo + date + titre + texte + citation courte en italique
   - Fond ivoire chaud

3. **Le grand jour** (`#programme`)
   - Timeline verticale centrée
   - Icône cœur SVG à chaque étape
   - Fond rose poudré très doux (`#FDF0F3`)
   - Chaque étape : heure + titre + description

4. **Galerie photos** (`#galerie`) *(centrale et grande)*
   - Carrousel plein écran (`height: 100vh`)
   - Transitions douces `opacity` + `scale` subtil
   - Contrôles : flèches fines + dots roses
   - Images depuis `MARIAGE.photos[]`

5. **Liste de souhaits** (`#souhaits`) *(section unique romantique)*
   - Fond blush très doux
   - Titre poétique : "Ce qui nous ferait plaisir"
   - Liste de catégories/items depuis `MARIAGE.souhaits[]`
   - Chaque item : emoji + description + lien optionnel
   - Style "carte postale"

6. **RSVP** (`#rsvp`)
   - Fond dégradé rose → ivoire
   - Formulaire style "lettre d'invitation" (papier avec légère ombre)
   - Champs arrondis, fond ivoire
   - Bouton prune

7. **Mot des mariés** (`#mot`) *(section unique romantique)*
   - Fond ivoire
   - Message personnel depuis `MARIAGE.mot_des_maries`
   - Signature simulée en Cormorant Garamond italic très grand
   - Petit cœur SVG en conclusion

### Animations

- Canvas pétales (adapté du canvas feuilles du template existant, couleurs roses)
- `IntersectionObserver` pour entrées au scroll
- Carrousel JS natif (pas de lib externe)

---

## Config.js étendu

Les templates champêtre et romantique nécessitent des champs supplémentaires dans `config.js`. Ces champs sont **optionnels** — si absents, la section est masquée via `display: none`.

```js
// Champs supplémentaires à ajouter au schéma MARIAGE
activites: [         // champêtre uniquement
  { emoji: '🏸', titre: 'Badminton', description: '...' }
],
dresscode: {         // chic uniquement
  texte: '...',
  couleurs: ['#F8F5EE', '#C9A96E', '#0A0A0A']
},
citation: '...',     // romantique
souhaits: [          // romantique
  { emoji: '🏡', titre: '...', description: '...', lien: '' }
],
mot_des_maries: '...' // romantique
```

---

## Compatibilité Studio

Le Studio charge les templates via :
1. Drop d'un `index.html` → lecture du HTML
2. Lecture du `style.css` et `script.js` associés (même dossier)
3. Injection du `config.js` actuel
4. Création d'une Blob URL et affichage dans l'iframe

Chaque nouveau template doit donc avoir les mêmes `id` DOM que le template existant pour que le panneau de config Studio fonctionne (`hero-names-overlay`, `loader-p1`, etc.). Les sections nouvelles (activites, dresscode, etc.) peuvent avoir des IDs propres — le Studio les ignorera simplement.

---

## Livrables

| Fichier | Description |
|---------|-------------|
| `templates/champetre/index.html` | Structure HTML thème champêtre |
| `templates/champetre/style.css` | CSS tokens + styles champêtre |
| `templates/champetre/script.js` | Hydration + animations (IntersectionObserver) |
| `templates/champetre/config.js` | Données exemple champêtre |
| `templates/champetre/supabase-config.js` | Copie de `template/supabase-config.js` |
| `templates/chic/index.html` | Structure HTML thème chic |
| `templates/chic/style.css` | CSS tokens + styles chic |
| `templates/chic/script.js` | Hydration + GSAP + countdown |
| `templates/chic/config.js` | Données exemple chic |
| `templates/chic/supabase-config.js` | Copie |
| `templates/romantique/index.html` | Structure HTML thème romantique |
| `templates/romantique/style.css` | CSS tokens + styles romantique |
| `templates/romantique/script.js` | Hydration + canvas pétales + carrousel |
| `templates/romantique/config.js` | Données exemple romantique |
| `templates/romantique/supabase-config.js` | Copie |
