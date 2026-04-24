# Hero Vidéo Scroll-Driven — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le hero statique par une séquence scroll-driven : vidéo qui scrube, zoom arrière, cadre doré, texte révélé progressivement.

**Architecture:** La section `#accueil` est remplacée par un hero vidéo épinglé 250vh via GSAP ScrollTrigger. `initHeroGsap()` est remplacé par `initVideoHero()` qui gère la vidéo et les animations de scroll. GSAP est déjà chargé dans le projet.

**Tech Stack:** HTML/CSS/JS vanilla, GSAP ScrollTrigger (déjà présent), ffmpeg (compression vidéo)

**User Verification:** YES — l'utilisateur vérifie visuellement l'animation dans le navigateur après implémentation.

---

## Pré-requis manuel (avant de lancer les tâches)

### Installer ffmpeg et compresser la vidéo

Ouvrir un terminal et exécuter :

```bash
winget install ffmpeg
```

Puis redémarrer le terminal et compresser la vidéo :

```bash
cd "C:\Users\nhu-s\Documents\programs\mariage\site-invites"

# MP4 (Safari/iOS)
ffmpeg -i hero.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:-2" -an hero_web.mp4

# WebM (Chrome/Firefox)
ffmpeg -i hero.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -vf "scale=1920:-2" -an hero.webm
```

Renommer ensuite `hero_web.mp4` en `hero.mp4` (remplacer l'original) :
```bash
move /Y hero_web.mp4 hero.mp4
```

> Si winget n'est pas disponible : télécharger ffmpeg sur https://ffmpeg.org/download.html (version Windows) et l'ajouter au PATH.

---

## Structure des fichiers

| Fichier | Action | Changement |
|---|---|---|
| `site-invites/index.html` | Modifier | Remplacer le contenu de `#accueil` |
| `site-invites/style.css` | Modifier | Ajouter styles `.hero-video-section` et éléments associés |
| `site-invites/script.js` | Modifier | Remplacer `initHeroGsap()` par `initVideoHero()` |
| `site-invites/hero.mp4` | Déjà là | Compressé (pré-requis manuel) |
| `site-invites/hero.webm` | Créer | Généré par ffmpeg (pré-requis manuel) |

---

## Tâche 1 : Remplacer le hero dans index.html

**Goal:** Remplacer le contenu de la section `#accueil` par la structure HTML du hero vidéo.

**Files:**
- Modify: `site-invites/index.html`

**Acceptance Criteria:**
- [ ] La section `#accueil` contient un `<video id="hero-video">` avec sources mp4 et webm
- [ ] `<div id="hero-frame">` existe dans la section
- [ ] `<div id="hero-overlay">` contient le monogramme, les noms, la date et le bouton CTA
- [ ] L'ancienne structure (canvas, rings, hero-content, countdown) est supprimée

**Verify:** Ouvrir `site-invites/index.html` dans un éditeur — la section `#accueil` ne contient plus `.hero-ring` ni `#leaves-canvas`.

**Steps:**

- [ ] **Étape 1 : Lire la section hero actuelle**

Lire `site-invites/index.html` lignes 55-96 pour repérer exactement ce qui est à remplacer.

- [ ] **Étape 2 : Remplacer le contenu de la section `#accueil`**

Trouver ce bloc complet dans index.html :
```html
  <!-- ══ HERO ══════════════════════════════════════════════ -->
  <section id="accueil" class="hero">
    <canvas id="leaves-canvas"></canvas>

    <div class="hero-ring ring-1"></div>
    <div class="hero-ring ring-2"></div>
    <div class="hero-ring ring-3"></div>

    <div class="hero-content" id="hero-content">
      ...tout le contenu...
    </div>

    <div class="scroll-mouse"><span class="scroll-dot"></span></div>
  </section>
```

Le remplacer par :
```html
  <!-- ══ HERO VIDÉO ════════════════════════════════════════ -->
  <section id="accueil" class="hero-video-section">
    <video id="hero-video" muted playsinline preload="auto">
      <source src="hero.webm" type="video/webm" />
      <source src="hero.mp4"  type="video/mp4"  />
    </video>
    <div id="hero-frame"></div>
    <div id="hero-overlay">
      <div id="hero-monogram">
        <span class="hv-l">C</span>
        <span class="hv-amp">◆</span>
        <span class="hv-r">N</span>
      </div>
      <p id="hero-names-overlay">Catherine &amp; Nhu-Sao</p>
      <p id="hero-date-overlay">18 · X · 2026</p>
      <a href="#rsvp" id="hero-cta-overlay" class="btn-gold">Confirmer ma présence</a>
    </div>
  </section>
```

```json:metadata
{"files": ["site-invites/index.html"], "verifyCommand": "", "acceptanceCriteria": ["section #accueil contient video#hero-video", "hero-frame existe", "hero-overlay avec monogramme/noms/date/CTA existe", "ancienne structure supprimée"], "requiresUserVerification": false}
```

---

## Tâche 2 : Ajouter les styles CSS du hero vidéo

**Goal:** Ajouter les styles pour `.hero-video-section` et tous ses éléments enfants dans `style.css`.

**Files:**
- Modify: `site-invites/style.css`

**Acceptance Criteria:**
- [ ] `.hero-video-section` occupe 100dvh, `position:relative`, `overflow:hidden`
- [ ] `#hero-video` est en `position:absolute`, couvre tout, `object-fit:cover`
- [ ] `#hero-frame` a une bordure dorée (`var(--gold)`) avec un inset de 4vw
- [ ] `#hero-overlay` est centré en bas de la section
- [ ] `#hero-monogram`, `#hero-names-overlay`, `#hero-date-overlay`, `#hero-cta-overlay` ont `opacity:0` par défaut (animés par GSAP)

**Verify:** Ouvrir `http://localhost:3000` — la section hero affiche la première frame de la vidéo en fond sombre, sans les anciens anneaux ni le texte animé.

**Steps:**

- [ ] **Étape 1 : Trouver la section `.hero` dans style.css**

Lire `site-invites/style.css` à partir de la ligne 159 pour voir les styles existants du hero.

- [ ] **Étape 2 : Ajouter les styles après les styles `.hero` existants**

Trouver la ligne commentaire `/* Countdown */` (ligne ~235) et ajouter AVANT ce bloc les nouveaux styles :

```css
/* ── HERO VIDÉO ─────────────────────────────────────────── */
.hero-video-section {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: #0a0a0a;
}

#hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform;
}

#hero-frame {
  position: absolute;
  inset: clamp(16px, 4vw, 48px);
  border: 1.5px solid var(--gold);
  pointer-events: none;
  opacity: 0;
  will-change: opacity;
}

#hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: clamp(3rem, 8vh, 6rem);
  gap: clamp(0.75rem, 2vh, 1.25rem);
  text-align: center;
  pointer-events: none;
}
#hero-overlay a { pointer-events: all; }

#hero-monogram {
  font-family: var(--serif);
  font-size: clamp(3rem, 10vw, 6rem);
  font-style: italic;
  font-weight: 300;
  color: var(--gold);
  display: flex;
  align-items: center;
  gap: 0.3em;
  opacity: 0;
  will-change: opacity, transform;
}
.hv-amp {
  font-size: 0.38em;
  font-style: normal;
  color: rgba(201, 169, 110, 0.65);
}

#hero-names-overlay {
  font-family: var(--sans);
  font-size: clamp(0.6rem, 1.5vw, 0.85rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.75);
  opacity: 0;
  will-change: opacity, transform;
}

#hero-date-overlay {
  font-family: var(--serif);
  font-size: clamp(0.9rem, 2.5vw, 1.4rem);
  color: var(--cream);
  opacity: 0;
  will-change: opacity, transform;
}

#hero-cta-overlay {
  opacity: 0;
  will-change: opacity, transform;
}
```

```json:metadata
{"files": ["site-invites/style.css"], "verifyCommand": "", "acceptanceCriteria": [".hero-video-section 100dvh position:relative overflow:hidden", "#hero-video absolute object-fit:cover", "#hero-frame bordure dorée inset 4vw opacity:0", "#hero-overlay centré en bas", "éléments overlay opacity:0 par défaut"], "requiresUserVerification": false}
```

---

## Tâche 3 : Remplacer initHeroGsap() par initVideoHero() dans script.js

**Goal:** Implémenter `initVideoHero()` avec GSAP ScrollTrigger qui scrube la vidéo et anime tous les éléments au scroll, et l'appeler à la place de `initHeroGsap()`.

**Files:**
- Modify: `site-invites/script.js`

**Acceptance Criteria:**
- [ ] `initVideoHero()` est définie et appelée depuis `dismissLoader()` à la place de `initHeroGsap()`
- [ ] La section `#accueil` est épinglée pendant 250vh (`end: '+=250%'`)
- [ ] `video.currentTime` est scrubé selon `self.progress * video.duration`
- [ ] La vidéo part de `scale(1.4)` et revient à `scale(1.0)` sur les 50 premiers % du scroll
- [ ] Le cadre `#hero-frame` passe de `opacity:0` à `opacity:1` entre 30% et 60%
- [ ] `#hero-monogram` apparaît entre 50% et 75%
- [ ] `#hero-names-overlay` apparaît entre 60% et 80%
- [ ] `#hero-date-overlay` apparaît entre 70% et 85%
- [ ] `#hero-cta-overlay` apparaît entre 80% et 100%
- [ ] `initScrollAnimations()` et `initStickyReveal()` sont toujours appelées

**Verify:** Ouvrir `http://localhost:3000` et scroller — la vidéo doit avancer, le zoom se faire, le cadre et les textes apparaître progressivement.

**Steps:**

- [ ] **Étape 1 : Lire les fonctions concernées dans script.js**

Lire `site-invites/script.js` lignes 230-280 pour voir `dismissLoader()` et `initHeroGsap()`.

- [ ] **Étape 2 : Remplacer l'appel dans dismissLoader()**

Trouver dans `dismissLoader()` :
```js
        initHeroGsap();
```
Remplacer par :
```js
        initVideoHero();
```

(Chercher aussi dans la branche `else` du même bloc et faire la même substitution si elle existe.)

- [ ] **Étape 3 : Remplacer la fonction initHeroGsap() par initVideoHero()**

Trouver le bloc complet :
```js
/* ────────────────────────────────────────
   HERO ENTRANCE (GSAP)
──────────────────────────────────────── */
function initHeroGsap() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('#hero-pre',     { y: 28, opacity: 0, duration: 0.75 })
    .from('#name-lea',     { y: 70, opacity: 0, duration: 1.1  }, '-=0.4')
    .from('#hero-amp',     { y: 30, opacity: 0, duration: 0.8, scale: 0.7, transformOrigin: 'center' }, '-=0.75')
    .from('#name-antoine', { y: 70, opacity: 0, duration: 1.1  }, '-=0.75')
    .from('#hero-orn',     { scaleX: 0, opacity: 0, duration: 0.7, transformOrigin: 'center' }, '-=0.4')
    .from('#hero-date',    { y: 22, opacity: 0, duration: 0.65 }, '-=0.35')
    .from('#hero-loc',     { y: 18, opacity: 0, duration: 0.6  }, '-=0.45')
    .from('#countdown',    { y: 28, opacity: 0, duration: 0.7  }, '-=0.4')
    .from('#hero-cta',     { y: 18, opacity: 0, duration: 0.65, scale: 0.96, transformOrigin: 'center' }, '-=0.4');

  initScrollAnimations();
  initStickyReveal();
}
```

Remplacer par :
```js
/* ────────────────────────────────────────
   HERO VIDÉO SCROLL-DRIVEN (GSAP)
──────────────────────────────────────── */
function initVideoHero() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const video  = document.getElementById('hero-video');
  const frame  = document.getElementById('hero-frame');
  const mono   = document.getElementById('hero-monogram');
  const names  = document.getElementById('hero-names-overlay');
  const date   = document.getElementById('hero-date-overlay');
  const cta    = document.getElementById('hero-cta-overlay');

  if (!video) { initScrollAnimations(); initStickyReveal(); return; }

  // Préparer la première frame dès que possible
  video.play().then(() => video.pause()).catch(() => {});

  // État initial
  gsap.set(video,  { scale: 1.4 });
  gsap.set([frame, mono, names, date, cta], { opacity: 0 });

  ScrollTrigger.create({
    trigger: '#accueil',
    start:   'top top',
    end:     '+=250%',
    pin:     true,
    scrub:   1.2,

    onUpdate(self) {
      const p = self.progress;

      // --- Scrub vidéo ---
      if (video.readyState >= 2 && video.duration) {
        video.currentTime = p * video.duration;
      }

      // --- Zoom arrière (scale 1.4 → 1.0 sur les 50 premiers %) ---
      const scale = Math.max(1.0, 1.4 - p * 0.8);
      gsap.set(video, { scale });

      // --- Cadre doré : 30% → 60% ---
      gsap.set(frame, {
        opacity: clamp01((p - 0.30) / 0.30),
      });

      // --- Monogramme C ◆ N : 50% → 75% ---
      const monoP = clamp01((p - 0.50) / 0.25);
      gsap.set(mono, { opacity: monoP, y: 20 * (1 - monoP) });

      // --- Noms : 60% → 80% ---
      const namesP = clamp01((p - 0.60) / 0.20);
      gsap.set(names, { opacity: namesP, y: 15 * (1 - namesP) });

      // --- Date : 70% → 85% ---
      const dateP = clamp01((p - 0.70) / 0.15);
      gsap.set(date, { opacity: dateP, y: 15 * (1 - dateP) });

      // --- CTA : 80% → 100% ---
      const ctaP = clamp01((p - 0.80) / 0.20);
      gsap.set(cta, { opacity: ctaP, y: 15 * (1 - ctaP) });
    },

    onLeave()      { video.pause(); },
    onEnterBack()  { video.play().catch(() => {}); },
  });

  initScrollAnimations();
  initStickyReveal();
}

/** Clamp une valeur entre 0 et 1 */
function clamp01(v) { return Math.min(1, Math.max(0, v)); }
```

```json:metadata
{"files": ["site-invites/script.js"], "verifyCommand": "", "acceptanceCriteria": ["initVideoHero() appelée depuis dismissLoader()", "pin 250vh", "video.currentTime scrubé", "scale 1.4→1.0 sur 50%", "cadre opacity 30%-60%", "monogramme 50%-75%", "noms 60%-80%", "date 70%-85%", "CTA 80%-100%", "initScrollAnimations et initStickyReveal appelées"], "requiresUserVerification": false}
```

---

## Tâche 4 : Vérification visuelle par l'utilisateur

**Goal:** Confirmer que l'animation scroll-driven fonctionne correctement dans le navigateur.

**Files:** aucun

**Acceptance Criteria:**
- [ ] L'utilisateur confirme que l'animation est satisfaisante

**Verify:** Ouvrir `http://localhost:3000` et scroller.

**Steps:**

- [ ] **Étape 1 : Lancer le serveur local**

```bash
cd "C:\Users\nhu-s\Documents\programs\mariage\site-invites"
npx serve . --listen 3000
```

- [ ] **Étape 2 : Tester l'animation**

Ouvrir `http://localhost:3000`, laisser le loader se terminer, puis scroller lentement et observer :
1. La vidéo avance au scroll
2. Le zoom arrière est visible
3. Le cadre doré apparaît
4. Le monogramme, les noms, la date, et le bouton apparaissent dans l'ordre
5. Après la zone épinglée, le reste du site continue normalement

**User Verification Required:**
Avant de marquer cette tâche comme terminée, appeler AskUserQuestion :
```yaml
AskUserQuestion:
  question: "L'animation hero vidéo scroll-driven fonctionne-t-elle comme attendu ?"
  header: "Vérification visuelle"
  options:
    - label: "Oui, c'est bon"
      description: "L'animation est fluide et les éléments apparaissent dans le bon ordre"
    - label: "Non, il y a un problème"
      description: "Décrire le problème — on ajuste"
```

```json:metadata
{"files": [], "verifyCommand": "", "acceptanceCriteria": ["animation fluide au scroll", "zoom arrière visible", "cadre et textes révélés dans l'ordre"], "requiresUserVerification": true, "userVerificationPrompt": "L'animation hero vidéo scroll-driven fonctionne-t-elle comme attendu ?"}
```
