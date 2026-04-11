# Onboarding & Studio — Design Spec
**Date :** 2026-04-11
**Statut :** Approuvé

---

## Contexte & Objectif

Le template de site mariage existe et fonctionne (`template/`). Il faut maintenant :
1. Un **formulaire client** qui génère `config.js` automatiquement et l'envoie par email
2. Un **Studio privé** pour vérifier le rendu et ajuster avant déploiement

Objectif : réduire le temps de création d'un nouveau client à **~20 minutes**.

---

## Architecture générale

Deux nouvelles interfaces dans le repo `wedoria-studio`, le dossier `template/` reste **inchangé**.

```
wedoria-studio/
├── onboarding/          ← formulaire client (public, déployé sur Vercel)
│   ├── index.html       ← wizard 14 étapes
│   ├── style.css
│   └── script.js        ← génération config.js + envoi EmailJS
│
├── studio/              ← interface privée (usage local uniquement)
│   ├── index.html       ← layout split : formulaire gauche / iframe droite
│   ├── style.css
│   └── script.js        ← drag & drop, Blob URL, formulaire, export
│
└── template/            ← moteur existant · INCHANGÉ
```

**Déploiement Vercel :**
- `wedoria.fr/onboarding/` → formulaire client (public)
- `studio/index.html` → ouvert en local, non déployé

---

## Interface 1 — Formulaire client (`onboarding/`)

### Format

Wizard multi-étapes : **une section par écran**, barre de progression en haut.
Navigation Précédent / Suivant. Dernière section = bouton "Envoyer".

### Les 14 sections

| # | Section | Champs clés |
|---|---------|-------------|
| 01 | Mariés | prenom1, nom1, prenom2, nom2 |
| 02 | Date & lieu | date_affichage, date_iso, rsvp_deadline, domaine, ville |
| 03 | Contact | email, whatsapp |
| 04 | Langues | langues[] (fr / en / vi) |
| 05 | Photo couple | photo_couple (nom fichier), photo_couple_caption |
| 06 | Textes intro | hero_intro, hero_cta, scroll_label, citation, bandeau[], sr_line1, sr_line2 |
| 07 | Notre Histoire | histoire[] — 5 blocs (annee, titre, texte, align) |
| 08 | Programme | programme[] — 4 créneaux (heure, icon, titre, lieu) |
| 09 | Galerie | galerie[] — 6 entrées (icon, label, photo) |
| 10 | Les Lieux | lieux[] — 3 entrées + carte GPS (lat, lng, zoom) |
| 11 | Dress code | dress_intro, dress_couleurs[] (nom, hex, eviter) |
| 12 | Infos pratiques | infos[] — 6 lignes (icon, titre, texte) |
| 13 | FAQ | faq[] — 5 Q&R |
| 14 | Vidéo hero | video_hero.type (local / url / none), video_hero.src |

### Règles d'affichage des champs

- Les champs optionnels sont clairement marqués "(optionnel)"
- Les blocs répétables (histoire, programme, galerie…) affichent les entrées une par une avec possibilité d'en ajouter/supprimer
- Les champs vides génèrent `""` ou `null` selon le schéma — le masquage automatique du site s'en charge

### Bouton "Couple démo"

Présent sur la première section. Pré-remplit tous les champs avec les données de **Sophie & Thomas** (issues du `template/config.js`). Permet de tester le flow complet sans saisie manuelle.

### Soumission et envoi email

1. JS génère le contenu de `config.js` sous forme de string
2. EmailJS envoie l'email à l'adresse configurée dans `script.js`
3. **Contenu de l'email :**
   - Objet : `Nouveau client — {prenom1} & {prenom2}`
   - Corps : récapitulatif (noms, date, lieu, email client)
   - Pièce jointe : `config-{prenom1}-{prenom2}.js`
4. Page de confirmation affichée au client après envoi

**Service :** EmailJS (tier gratuit, 200 emails/mois, sans backend).
Les clés EmailJS (`serviceId`, `templateId`, `publicKey`) sont configurées en haut de `script.js`.

---

## Interface 2 — Studio (`studio/`)

### Layout

Split horizontal 2 colonnes :
- **Gauche (340px fixe) :** formulaire d'édition scrollable, toutes les sections accessibles
- **Droite (reste) :** iframe preview du site

Barre supérieure fixe avec :
- Nom du client chargé
- Bouton "📂 Charger un fichier" (file picker)
- Bouton "⬇ Télécharger config.js"

### Chargement d'un config

**Option A — Drag & drop :** glisser `config.js` sur l'interface → parsing JS → formulaire pré-rempli → iframe chargée

**Option B — Saisie directe :** remplir le formulaire de gauche → preview se construit en temps réel

### Prévisualisation (Blob URL)

1. Studio lit les valeurs du formulaire
2. Génère le contenu de `config.js` comme string JS
3. Crée un `Blob` combinant : le contenu de `config.js` + `supabase-config.js` (clés vides) + `script.js` + `style.css` du template (chargés via `fetch`)
4. Crée une `URL.createObjectURL(blob)` et l'assigne à `iframe.src`
5. Preview mise à jour à chaque modification avec debounce 500ms

**Limite connue :** les médias (vidéo hero, photo couple, galerie) ne s'affichent pas en preview locale car les chemins relatifs ne résolvent pas. Le texte, la mise en page et les couleurs sont vérifiables.

### Export

Bouton "Télécharger config.js" → génère et télécharge `config-{prenom1}-{prenom2}.js`.

---

## Flux de données complet

```
① Client remplit onboarding/         (~10 min)
   ↓ JS génère config.js en mémoire
   ↓ EmailJS envoie email avec pièce jointe

② Tu reçois l'email
   ↓ Tu sauvegardes config-sophie-thomas.js

③ Tu ouvres studio/index.html        (~5 min)
   ↓ Drag & drop du config.js
   ↓ Vérification + ajustements
   ↓ Téléchargement config.js final validé

④ Déploiement                         (~5 min)
   ↓ cp template/ → clients/sophie-thomas/
   ↓ Remplacer config.js
   ↓ Créer projet Supabase → supabase-config.js
   ↓ Push → Vercel déploie

Total : ~20 minutes par client
```

---

## Hors scope

- Interface d'administration multi-clients
- Gestion des médias (upload photo/vidéo depuis le formulaire) — le client fournit les fichiers séparément
- Traductions i18n dans le formulaire d'onboarding (section i18n remplie manuellement si besoin)
- Authentification sur le Studio (usage local uniquement)
