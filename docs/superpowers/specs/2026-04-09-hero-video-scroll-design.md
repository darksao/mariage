# Design — Hero vidéo scroll-driven

**Date :** 2026-04-09  
**Projet :** Site mariage Catherine & Nhu-Sao  
**Référence visuelle :** [the-tawaraya.jp](https://the-tawaraya.jp/)

---

## Objectif

Remplacer le hero statique par une séquence d'animation scroll-driven : une vidéo qui scrube au scroll, avec un zoom arrière, un cadre doré, et les éléments texte qui apparaissent progressivement.

---

## Architecture

```
Loader (inchangé)
  ↓ (après disparition du loader)
Hero vidéo épinglé (250vh)
  ├── <video> scrubée par ScrollTrigger (hero.mp4 / hero.webm)
  ├── Cadre doré (div CSS, border #c9a84c)
  ├── Monogramme C ◆ N
  ├── Date 18 · X · 2026
  └── Bouton CTA "Confirmer ma présence"
  ↓ (après 250vh scrollés)
Suite du site (Notre Histoire, Programme, etc.) — inchangée
```

---

## 1. Structure de la page

Le hero actuel (section `#hero`) est **remplacé** par le nouveau hero vidéo. Le loader (`#loader`) reste intact et inchangé.

La section hero est épinglée via `ScrollTrigger.pin` pendant **250vh** de scroll. Pendant ce temps, la page ne défile pas — ce sont les éléments internes qui s'animent. Une fois les 250vh parcourus, la section se désépingle et le reste du site reprend normalement.

### Fichiers modifiés
| Fichier | Action | Changement |
|---|---|---|
| `site-invites/index.html` | Modifier | Remplacer contenu du `#hero` par la structure vidéo |
| `site-invites/script.js` | Modifier | Remplacer les animations GSAP du hero par ScrollTrigger |
| `site-invites/style.css` | Modifier | Styles du hero vidéo, cadre, overlay texte |
| `site-invites/hero.mp4` | Créer | Vidéo compressée (format MP4) |
| `site-invites/hero.webm` | Créer | Vidéo compressée (format WebM) |

---

## 2. Séquence d'animation

La progression est découpée sur les 250vh (exprimée en % de progression ScrollTrigger, de 0 à 1) :

| Progression | Élément | Animation |
|---|---|---|
| 0 → 1.0 | `<video>` | `currentTime` scrubé de 0s à durée max |
| 0 → 0.5 | `<video>` | `scale` : 1.4 → 1.0 (zoom arrière) |
| 0.3 → 0.6 | Cadre doré | `opacity` 0 → 1, `scale` 1.05 → 1.0 |
| 0.5 → 0.75 | Monogramme C ◆ N | `opacity` 0 → 1, `y` 20px → 0 |
| 0.65 → 0.85 | Date 18 · X · 2026 | `opacity` 0 → 1, `y` 15px → 0 |
| 0.8 → 1.0 | Bouton CTA | `opacity` 0 → 1, `y` 15px → 0 |

Les timings se chevauchent pour un effet fluide et continu.

### Structure HTML du hero

```html
<section id="hero" class="hero-video">
  <video id="hero-video" muted playsinline preload="auto">
    <source src="hero.webm" type="video/webm" />
    <source src="hero.mp4" type="video/mp4" />
  </video>
  <div id="hero-frame"></div>
  <div id="hero-overlay">
    <div id="hero-monogram">
      <span class="lm-l">C</span>
      <span class="lm-amp">◆</span>
      <span class="lm-a">N</span>
    </div>
    <p id="hero-names">Catherine & Nhu-Sao</p>
    <p id="hero-date">18 · X · 2026</p>
    <a href="#rsvp" id="hero-cta" class="btn-gold">Confirmer ma présence</a>
  </div>
</section>
```

---

## 3. Optimisation vidéo

La vidéo source (`hero.mp4`, 23 MB) est compressée avec `ffmpeg` :

**MP4 (Safari/iOS) :**
```bash
ffmpeg -i hero.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:-2" -an hero_compressed.mp4
```

**WebM (Chrome/Firefox) :**
```bash
ffmpeg -i hero.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -vf "scale=1920:-2" -an hero.webm
```

Cible : ~3-5 MB par format.

La vidéo est :
- **Muette** (`muted`) — pas d'audio
- **Non autoplay classique** — démarrée via JS après la disparition du loader
- **Mise en pause** quand l'utilisateur dépasse la section hero (ScrollTrigger `onLeave`)

---

## 4. Comportement JS

Dans `script.js`, après le bloc du loader (`onComplete`), initialiser :

```js
// 1. Démarrer la vidéo
video.play().then(() => video.pause()); // précharge la première frame

// 2. ScrollTrigger pin + scrub
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: '+=250%',
  pin: true,
  scrub: 1,
  onUpdate: self => {
    // scrub vidéo
    video.currentTime = self.progress * video.duration;
    // zoom vidéo
    const scale = 1.4 - self.progress * 0.4; // 1.4 → 1.0 sur 0-0.5
    ...
  },
  onLeave: () => video.pause(),
});
```

---

## 5. Hors scope

- Fond audio ambiant
- Transitions vers les autres sections (déjà gérées par GSAP existant)
- Version mobile différente (même animation, viewport adapté)

---

## Critères de succès

- [ ] Le loader existant fonctionne et enchaîne sur la vidéo hero
- [ ] La vidéo scrube au scroll (chaque position de scroll = position dans la vidéo)
- [ ] L'effet zoom arrière (1.4 → 1.0) est visible
- [ ] Le cadre doré apparaît progressivement
- [ ] Les 3 éléments texte + bouton apparaissent dans l'ordre
- [ ] Après 250vh, le site continue normalement
- [ ] Poids vidéo ≤ 5 MB par format
