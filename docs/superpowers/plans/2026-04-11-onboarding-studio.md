# Onboarding & Studio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client onboarding form that generates and emails config.js, and a private Studio for previewing and editing the result before deployment.

**Architecture:** Two standalone HTML/CSS/JS interfaces in `onboarding/` and `studio/`. The onboarding wizard collects 14 sections and emails config.js content via EmailJS. The studio loads template assets via `fetch()` (requires VS Code Live Server), builds a Blob URL, and renders the site in an iframe.

**Tech Stack:** Vanilla HTML/CSS/JS, EmailJS browser SDK v4, VS Code Live Server (for studio)

**User Verification:** NO

---

## File Structure

```
onboarding/
  index.html   — 14-step wizard, EmailJS script tag, confirmation screen
  style.css    — wizard styles (progress bar, steps, form groups)
  script.js    — step navigation, demo data, generateMAIRIAGE(), generateConfigJS(), EmailJS send

studio/
  index.html   — split layout: topbar + left panel (form) + right iframe
  style.css    — studio styles
  script.js    — fetch() template assets, buildPreviewHTML(), drag & drop, debounced refresh, export
```

---

## Task 0: onboarding/ — Wizard HTML + CSS

**Goal:** Full 14-step wizard with progress bar, navigation, and confirmation screen.

**Files:**
- Create: `onboarding/index.html`
- Create: `onboarding/style.css`

**Acceptance Criteria:**
- [ ] 14 steps visible one at a time; Précédent/Suivant navigate correctly
- [ ] Progress bar updates (N/14) on each step
- [ ] Step 1 shows "Charger le couple démo" button
- [ ] Confirmation screen hidden until submit
- [ ] Responsive, readable on desktop

**Verify:** Open `onboarding/index.html` in browser → click through all 14 steps, verify progress updates and navigation works

**Steps:**

- [ ] **Créer `onboarding/style.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #faf9f7;
  color: #2c1a0e;
  min-height: 100vh;
}

/* ── WIZARD CONTAINER ── */
#wizard {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e8e0d5;
}

.wizard-logo {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #6b2737;
}

.wizard-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 320px;
  margin-left: 1.5rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e8e0d5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6b2737;
  border-radius: 2px;
  transition: width 0.3s ease;
  width: calc(1/14 * 100%);
}

.progress-label {
  font-size: 0.75rem;
  color: #8a6f5a;
  white-space: nowrap;
}

/* ── STEPS ── */
.wizard-step { display: none; }
.wizard-step.active { display: block; animation: fadeIn 0.25s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.step-number {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #c9a96e;
  background: #fdf5e8;
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid #e8d4a0;
}

.step-header h2 {
  font-size: 1.35rem;
  font-weight: 600;
  color: #2c1a0e;
}

.btn-demo {
  margin-left: auto;
  background: #fdf5e8;
  border: 1px solid #e8d4a0;
  color: #8a6030;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-demo:hover { background: #f5e8c8; }

/* ── FORM ELEMENTS ── */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.form-group.full { grid-column: 1 / -1; }

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #5a3d2b;
  letter-spacing: 0.02em;
}

.req { color: #c9a96e; }
.opt { color: #aaa; font-weight: 400; font-size: 0.75rem; }

input[type="text"],
input[type="email"],
input[type="url"],
input[type="datetime-local"],
input[type="number"],
select,
textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #d5c9bc;
  border-radius: 6px;
  font-size: 0.88rem;
  color: #2c1a0e;
  background: #fff;
  transition: border-color 0.2s;
  font-family: inherit;
  width: 100%;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #c9a96e;
  box-shadow: 0 0 0 3px rgba(201,169,110,0.15);
}
textarea { resize: vertical; min-height: 80px; }

input[type="color"] {
  padding: 2px 4px;
  height: 38px;
  border: 1px solid #d5c9bc;
  border-radius: 6px;
  cursor: pointer;
  width: 60px;
}

.hint {
  font-size: 0.72rem;
  color: #9a8070;
  margin-top: 2px;
}

/* ── REPEATING BLOCKS ── */
.block-section {
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
}

.block-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c9a96e;
  margin-bottom: 0.75rem;
}

/* ── CHECKBOX / RADIO ── */
.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  cursor: pointer;
}

/* ── NAVIGATION ── */
.wizard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e8e0d5;
}

.btn-prev, .btn-next, .btn-submit {
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.1s;
}
.btn-prev {
  background: transparent;
  color: #8a6f5a;
  border: 1px solid #d5c9bc;
}
.btn-prev:hover { background: #f5f0e8; }

.btn-next, .btn-submit {
  background: #6b2737;
  color: #fff;
  margin-left: auto;
}
.btn-next:hover, .btn-submit:hover { background: #8b3547; }
.btn-next:active { transform: scale(0.98); }

/* ── CONFIRMATION ── */
#confirmation {
  max-width: 480px;
  margin: 6rem auto;
  text-align: center;
  padding: 2rem;
}
#confirmation.hidden { display: none; }

.confirmation-icon {
  font-size: 2.5rem;
  color: #c9a96e;
  margin-bottom: 1rem;
}
#confirmation h2 { font-size: 1.8rem; margin-bottom: 0.75rem; }
#confirmation p { color: #5a3d2b; line-height: 1.6; }

/* ── SENDING STATE ── */
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 560px) {
  .form-row { grid-template-columns: 1fr; }
  .wizard-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  .wizard-progress { margin-left: 0; max-width: 100%; width: 100%; }
}
```

- [ ] **Créer `onboarding/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedoria — Votre site de mariage</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<div id="wizard">
  <div class="wizard-header">
    <div class="wizard-logo">◆ Wedoria</div>
    <div class="wizard-progress">
      <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
      <span class="progress-label" id="progress-label">Étape 1 / 14</span>
    </div>
  </div>

  <!-- ── 01 · MARIÉS ── -->
  <div class="wizard-step active" data-step="1">
    <div class="step-header">
      <span class="step-number">01</span>
      <h2>Les Mariés</h2>
      <button class="btn-demo" id="btn-demo" type="button">✨ Couple démo</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="prenom1">Prénom <span class="req">*</span></label>
        <input type="text" id="prenom1" name="prenom1" placeholder="Sophie" required />
      </div>
      <div class="form-group">
        <label for="nom1">Nom <span class="req">*</span></label>
        <input type="text" id="nom1" name="nom1" placeholder="Martin" required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="prenom2">Prénom <span class="req">*</span></label>
        <input type="text" id="prenom2" name="prenom2" placeholder="Thomas" required />
      </div>
      <div class="form-group">
        <label for="nom2">Nom <span class="req">*</span></label>
        <input type="text" id="nom2" name="nom2" placeholder="Dupont" required />
      </div>
    </div>
  </div>

  <!-- ── 02 · DATE & LIEU ── -->
  <div class="wizard-step" data-step="2">
    <div class="step-header"><span class="step-number">02</span><h2>Date &amp; Lieu</h2></div>
    <div class="form-group">
      <label for="date_affichage">Date affichée sur le site <span class="req">*</span></label>
      <input type="text" id="date_affichage" name="date_affichage" placeholder="Samedi 12 Juillet 2025" required />
      <span class="hint">Ex : Samedi 12 Juillet 2025</span>
    </div>
    <div class="form-group">
      <label for="date_iso">Date ISO (pour le compte à rebours) <span class="req">*</span></label>
      <input type="text" id="date_iso" name="date_iso" placeholder="2025-07-12T14:00:00" required />
      <span class="hint">Format : AAAA-MM-JJTHH:MM:SS</span>
    </div>
    <div class="form-group">
      <label for="rsvp_deadline">Deadline RSVP <span class="opt">(optionnel)</span></label>
      <input type="text" id="rsvp_deadline" name="rsvp_deadline" placeholder="1er Mai 2025" />
      <span class="hint">Affiché "Avant le …"</span>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="domaine">Nom du domaine / lieu <span class="req">*</span></label>
        <input type="text" id="domaine" name="domaine" placeholder="Domaine des Brumes" required />
      </div>
      <div class="form-group">
        <label for="ville">Ville &amp; région <span class="req">*</span></label>
        <input type="text" id="ville" name="ville" placeholder="Beaune, Bourgogne" required />
      </div>
    </div>
  </div>

  <!-- ── 03 · CONTACT ── -->
  <div class="wizard-step" data-step="3">
    <div class="step-header"><span class="step-number">03</span><h2>Contact</h2></div>
    <div class="form-group">
      <label for="email">Email des mariés <span class="req">*</span></label>
      <input type="email" id="email" name="email" placeholder="sophie.thomas@exemple.com" required />
    </div>
    <div class="form-group">
      <label for="whatsapp">WhatsApp <span class="opt">(optionnel)</span></label>
      <input type="text" id="whatsapp" name="whatsapp" placeholder="06 12 34 56 78" />
      <span class="hint">Laissez vide pour masquer dans la FAQ</span>
    </div>
  </div>

  <!-- ── 04 · LANGUES ── -->
  <div class="wizard-step" data-step="4">
    <div class="step-header"><span class="step-number">04</span><h2>Langues du site</h2></div>
    <div class="form-group">
      <label>Langues actives <span class="req">*</span></label>
      <div class="checkbox-group">
        <label class="checkbox-label"><input type="checkbox" name="lang_fr" value="fr" checked disabled /> 🇫🇷 Français (toujours inclus)</label>
        <label class="checkbox-label"><input type="checkbox" name="lang_en" value="en" id="lang_en" /> 🇬🇧 English</label>
        <label class="checkbox-label"><input type="checkbox" name="lang_vi" value="vi" id="lang_vi" /> 🇻🇳 Tiếng Việt</label>
      </div>
    </div>
  </div>

  <!-- ── 05 · PHOTO COUPLE ── -->
  <div class="wizard-step" data-step="5">
    <div class="step-header"><span class="step-number">05</span><h2>Photo du couple</h2></div>
    <div class="form-group">
      <label for="photo_couple">Nom du fichier photo <span class="opt">(optionnel)</span></label>
      <input type="text" id="photo_couple" name="photo_couple" placeholder="photo-couple.jpg" />
      <span class="hint">Laissez vide pour masquer cette section. Le fichier sera à déposer dans le dossier du client.</span>
    </div>
    <div class="form-group">
      <label for="photo_couple_caption">Légende de la photo <span class="opt">(optionnel)</span></label>
      <input type="text" id="photo_couple_caption" name="photo_couple_caption" placeholder="Sophie & Thomas · Paris, France" />
    </div>
  </div>

  <!-- ── 06 · TEXTES INTRO ── -->
  <div class="wizard-step" data-step="6">
    <div class="step-header"><span class="step-number">06</span><h2>Textes d'introduction</h2></div>
    <div class="form-group">
      <label for="hero_intro">Texte d'invitation (hero)</label>
      <input type="text" id="hero_intro" name="hero_intro" value="Vous êtes invités au mariage de" />
    </div>
    <div class="form-group">
      <label for="hero_cta">Bouton CTA hero</label>
      <input type="text" id="hero_cta" name="hero_cta" value="Confirmer ma présence" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="sr_line1">Sticky reveal — ligne 1</label>
        <input type="text" id="sr_line1" name="sr_line1" value="Avant ce jour," />
      </div>
      <div class="form-group">
        <label for="sr_line2">Sticky reveal — ligne 2</label>
        <input type="text" id="sr_line2" name="sr_line2" value="notre histoire s'écrivait" />
      </div>
    </div>
    <div class="form-group">
      <label for="citation">Citation (footer)</label>
      <input type="text" id="citation" name="citation" placeholder="« Aimer, c'est trouver sa richesse en l'autre. »" />
    </div>
    <div class="form-group">
      <label for="bandeau">Bandeau défilant <span class="opt">(optionnel — virgules)</span></label>
      <input type="text" id="bandeau" name="bandeau" placeholder="France, Barcelone, Sophie, Thomas, Juillet 2025" />
      <span class="hint">Laissez vide pour masquer le bandeau</span>
    </div>
  </div>

  <!-- ── 07 · NOTRE HISTOIRE ── -->
  <div class="wizard-step" data-step="7">
    <div class="step-header"><span class="step-number">07</span><h2>Notre Histoire</h2></div>
    <div class="form-row">
      <div class="form-group">
        <label for="histoire_eyebrow">Sous-titre (eyebrow)</label>
        <input type="text" id="histoire_eyebrow" name="histoire_eyebrow" placeholder="Depuis 2019" />
      </div>
      <div class="form-group">
        <label for="histoire_titre">Titre de section</label>
        <input type="text" id="histoire_titre" name="histoire_titre" value="Notre Histoire" />
      </div>
    </div>
    <!-- Blocs histoire (5 max) -->
    <div class="block-section">
      <div class="block-title">Bloc 1</div>
      <div class="form-row">
        <div class="form-group"><label for="h0_annee">Année</label><input type="text" id="h0_annee" name="h0_annee" placeholder="2019" /></div>
        <div class="form-group"><label for="h0_align">Alignement</label><select id="h0_align" name="h0_align"><option value="left">Gauche</option><option value="right">Droite</option></select></div>
      </div>
      <div class="form-group"><label for="h0_titre">Titre</label><input type="text" id="h0_titre" name="h0_titre" placeholder="La Rencontre" /></div>
      <div class="form-group"><label for="h0_texte">Texte <span class="hint">(laisser vide pour masquer)</span></label><textarea id="h0_texte" name="h0_texte" placeholder="Un soir de novembre…"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Bloc 2</div>
      <div class="form-row">
        <div class="form-group"><label for="h1_annee">Année</label><input type="text" id="h1_annee" name="h1_annee" /></div>
        <div class="form-group"><label for="h1_align">Alignement</label><select id="h1_align" name="h1_align"><option value="left">Gauche</option><option value="right" selected>Droite</option></select></div>
      </div>
      <div class="form-group"><label for="h1_titre">Titre</label><input type="text" id="h1_titre" name="h1_titre" /></div>
      <div class="form-group"><label for="h1_texte">Texte</label><textarea id="h1_texte" name="h1_texte"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Bloc 3</div>
      <div class="form-row">
        <div class="form-group"><label for="h2_annee">Année</label><input type="text" id="h2_annee" name="h2_annee" /></div>
        <div class="form-group"><label for="h2_align">Alignement</label><select id="h2_align" name="h2_align"><option value="left" selected>Gauche</option><option value="right">Droite</option></select></div>
      </div>
      <div class="form-group"><label for="h2_titre">Titre</label><input type="text" id="h2_titre" name="h2_titre" /></div>
      <div class="form-group"><label for="h2_texte">Texte</label><textarea id="h2_texte" name="h2_texte"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Bloc 4</div>
      <div class="form-row">
        <div class="form-group"><label for="h3_annee">Année</label><input type="text" id="h3_annee" name="h3_annee" /></div>
        <div class="form-group"><label for="h3_align">Alignement</label><select id="h3_align" name="h3_align"><option value="left">Gauche</option><option value="right" selected>Droite</option></select></div>
      </div>
      <div class="form-group"><label for="h3_titre">Titre</label><input type="text" id="h3_titre" name="h3_titre" /></div>
      <div class="form-group"><label for="h3_texte">Texte</label><textarea id="h3_texte" name="h3_texte"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Bloc 5 <span class="opt">(optionnel)</span></div>
      <div class="form-row">
        <div class="form-group"><label for="h4_annee">Année</label><input type="text" id="h4_annee" name="h4_annee" /></div>
        <div class="form-group"><label for="h4_align">Alignement</label><select id="h4_align" name="h4_align"><option value="left" selected>Gauche</option><option value="right">Droite</option></select></div>
      </div>
      <div class="form-group"><label for="h4_titre">Titre</label><input type="text" id="h4_titre" name="h4_titre" /></div>
      <div class="form-group"><label for="h4_texte">Texte</label><textarea id="h4_texte" name="h4_texte"></textarea></div>
    </div>
  </div>

  <!-- ── 08 · PROGRAMME ── -->
  <div class="wizard-step" data-step="8">
    <div class="step-header"><span class="step-number">08</span><h2>Programme du Jour J</h2></div>
    <div class="form-row">
      <div class="form-group"><label for="programme_eyebrow">Eyebrow</label><input type="text" id="programme_eyebrow" name="programme_eyebrow" placeholder="12 Juillet 2025" /></div>
      <div class="form-group"><label for="programme_titre">Titre</label><input type="text" id="programme_titre" name="programme_titre" value="Le Jour J" /></div>
    </div>
    <!-- 4 créneaux -->
    <div class="block-section">
      <div class="block-title">Créneau 1</div>
      <div class="form-row">
        <div class="form-group"><label for="p0_heure">Heure</label><input type="text" id="p0_heure" name="p0_heure" placeholder="14h00" /></div>
        <div class="form-group"><label for="p0_icon">Icône (emoji)</label><input type="text" id="p0_icon" name="p0_icon" placeholder="💍" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="p0_titre">Intitulé</label><input type="text" id="p0_titre" name="p0_titre" placeholder="Cérémonie Laïque" /></div>
        <div class="form-group"><label for="p0_lieu">Lieu</label><input type="text" id="p0_lieu" name="p0_lieu" placeholder="Chapelle du Domaine" /></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Créneau 2</div>
      <div class="form-row">
        <div class="form-group"><label for="p1_heure">Heure</label><input type="text" id="p1_heure" name="p1_heure" placeholder="15h30" /></div>
        <div class="form-group"><label for="p1_icon">Icône</label><input type="text" id="p1_icon" name="p1_icon" placeholder="🥂" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="p1_titre">Intitulé</label><input type="text" id="p1_titre" name="p1_titre" placeholder="Vin d'Honneur" /></div>
        <div class="form-group"><label for="p1_lieu">Lieu</label><input type="text" id="p1_lieu" name="p1_lieu" /></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Créneau 3</div>
      <div class="form-row">
        <div class="form-group"><label for="p2_heure">Heure</label><input type="text" id="p2_heure" name="p2_heure" placeholder="19h30" /></div>
        <div class="form-group"><label for="p2_icon">Icône</label><input type="text" id="p2_icon" name="p2_icon" placeholder="🍽️" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="p2_titre">Intitulé</label><input type="text" id="p2_titre" name="p2_titre" placeholder="Dîner de Gala" /></div>
        <div class="form-group"><label for="p2_lieu">Lieu</label><input type="text" id="p2_lieu" name="p2_lieu" /></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Créneau 4</div>
      <div class="form-row">
        <div class="form-group"><label for="p3_heure">Heure</label><input type="text" id="p3_heure" name="p3_heure" placeholder="22h00" /></div>
        <div class="form-group"><label for="p3_icon">Icône</label><input type="text" id="p3_icon" name="p3_icon" placeholder="🎵" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="p3_titre">Intitulé</label><input type="text" id="p3_titre" name="p3_titre" placeholder="Soirée Dansante" /></div>
        <div class="form-group"><label for="p3_lieu">Lieu</label><input type="text" id="p3_lieu" name="p3_lieu" /></div>
      </div>
    </div>
  </div>

  <!-- ── 09 · GALERIE ── -->
  <div class="wizard-step" data-step="9">
    <div class="step-header"><span class="step-number">09</span><h2>Galerie du Domaine</h2></div>
    <div class="form-row">
      <div class="form-group"><label for="galerie_eyebrow">Eyebrow</label><input type="text" id="galerie_eyebrow" name="galerie_eyebrow" placeholder="Le décor de notre amour" /></div>
      <div class="form-group"><label for="galerie_titre">Titre</label><input type="text" id="galerie_titre" name="galerie_titre" value="Le Domaine" /></div>
    </div>
    <!-- 6 entrées galerie — icône + label + chemin photo optionnel -->
    <div class="block-section">
      <div class="block-title">Photo 1</div>
      <div class="form-row">
        <div class="form-group"><label for="g0_icon">Icône placeholder</label><input type="text" id="g0_icon" name="g0_icon" value="🏰" /></div>
        <div class="form-group"><label for="g0_label">Légende</label><input type="text" id="g0_label" name="g0_label" placeholder="Façade du Domaine" /></div>
      </div>
      <div class="form-group"><label for="g0_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g0_photo" name="g0_photo" placeholder="galerie/photo1.jpg" /></div>
    </div>
    <div class="block-section">
      <div class="block-title">Photo 2</div>
      <div class="form-row">
        <div class="form-group"><label for="g1_icon">Icône</label><input type="text" id="g1_icon" name="g1_icon" value="🌿" /></div>
        <div class="form-group"><label for="g1_label">Légende</label><input type="text" id="g1_label" name="g1_label" placeholder="Les Jardins" /></div>
      </div>
      <div class="form-group"><label for="g1_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g1_photo" name="g1_photo" /></div>
    </div>
    <div class="block-section">
      <div class="block-title">Photo 3</div>
      <div class="form-row">
        <div class="form-group"><label for="g2_icon">Icône</label><input type="text" id="g2_icon" name="g2_icon" value="✨" /></div>
        <div class="form-group"><label for="g2_label">Légende</label><input type="text" id="g2_label" name="g2_label" placeholder="Grande Salle" /></div>
      </div>
      <div class="form-group"><label for="g2_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g2_photo" name="g2_photo" /></div>
    </div>
    <div class="block-section">
      <div class="block-title">Photo 4</div>
      <div class="form-row">
        <div class="form-group"><label for="g3_icon">Icône</label><input type="text" id="g3_icon" name="g3_icon" value="⛪" /></div>
        <div class="form-group"><label for="g3_label">Légende</label><input type="text" id="g3_label" name="g3_label" placeholder="Chapelle" /></div>
      </div>
      <div class="form-group"><label for="g3_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g3_photo" name="g3_photo" /></div>
    </div>
    <div class="block-section">
      <div class="block-title">Photo 5</div>
      <div class="form-row">
        <div class="form-group"><label for="g4_icon">Icône</label><input type="text" id="g4_icon" name="g4_icon" value="🌸" /></div>
        <div class="form-group"><label for="g4_label">Légende</label><input type="text" id="g4_label" name="g4_label" placeholder="Terrasse" /></div>
      </div>
      <div class="form-group"><label for="g4_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g4_photo" name="g4_photo" /></div>
    </div>
    <div class="block-section">
      <div class="block-title">Photo 6</div>
      <div class="form-row">
        <div class="form-group"><label for="g5_icon">Icône</label><input type="text" id="g5_icon" name="g5_icon" value="🕯️" /></div>
        <div class="form-group"><label for="g5_label">Légende</label><input type="text" id="g5_label" name="g5_label" placeholder="Décoration de Table" /></div>
      </div>
      <div class="form-group"><label for="g5_photo">Fichier photo <span class="opt">(optionnel)</span></label><input type="text" id="g5_photo" name="g5_photo" /></div>
    </div>
  </div>

  <!-- ── 10 · LIEUX ── -->
  <div class="wizard-step" data-step="10">
    <div class="step-header"><span class="step-number">10</span><h2>Les Lieux</h2></div>
    <!-- Cérémonie -->
    <div class="block-section">
      <div class="block-title">Cérémonie</div>
      <div class="form-row">
        <div class="form-group"><label for="l0_icon">Icône</label><input type="text" id="l0_icon" name="l0_icon" value="⛪" /></div>
        <div class="form-group"><label for="l0_type">Type</label><input type="text" id="l0_type" name="l0_type" placeholder="Cérémonie Laïque" /></div>
      </div>
      <div class="form-group"><label for="l0_nom">Nom du lieu</label><input type="text" id="l0_nom" name="l0_nom" placeholder="Chapelle Saint-Jean" /></div>
      <div class="form-group"><label for="l0_adresse1">Adresse ligne 1</label><input type="text" id="l0_adresse1" name="l0_adresse1" placeholder="12 Route des Vignes" /></div>
      <div class="form-group"><label for="l0_adresse2">Adresse ligne 2</label><input type="text" id="l0_adresse2" name="l0_adresse2" placeholder="21200 Beaune, Bourgogne" /></div>
    </div>
    <!-- Réception -->
    <div class="block-section">
      <div class="block-title">Réception (lieu principal)</div>
      <div class="form-row">
        <div class="form-group"><label for="l1_icon">Icône</label><input type="text" id="l1_icon" name="l1_icon" value="🏰" /></div>
        <div class="form-group"><label for="l1_type">Type</label><input type="text" id="l1_type" name="l1_type" placeholder="Réception" /></div>
      </div>
      <div class="form-group"><label for="l1_nom">Nom du lieu</label><input type="text" id="l1_nom" name="l1_nom" placeholder="Domaine des Brumes" /></div>
      <div class="form-group"><label for="l1_adresse1">Adresse ligne 1</label><input type="text" id="l1_adresse1" name="l1_adresse1" /></div>
      <div class="form-group"><label for="l1_adresse2">Adresse ligne 2</label><input type="text" id="l1_adresse2" name="l1_adresse2" /></div>
    </div>
    <!-- Hébergement -->
    <div class="block-section">
      <div class="block-title">Hébergement conseillé <span class="opt">(optionnel — laisser vide pour masquer)</span></div>
      <div class="form-group"><label for="l2_nom">Nom de l'hôtel</label><input type="text" id="l2_nom" name="l2_nom" placeholder="Hôtel Le Cep ★★★★" /></div>
      <div class="form-group"><label for="l2_adresse1">Adresse ligne 1</label><input type="text" id="l2_adresse1" name="l2_adresse1" /></div>
      <div class="form-group"><label for="l2_adresse2">Adresse ligne 2</label><input type="text" id="l2_adresse2" name="l2_adresse2" /></div>
    </div>
    <!-- Carte GPS -->
    <div class="block-section">
      <div class="block-title">Carte GPS <span class="opt">(optionnel — laisser lat/lng vides pour masquer)</span></div>
      <div class="form-row">
        <div class="form-group"><label for="carte_lat">Latitude</label><input type="text" id="carte_lat" name="carte_lat" placeholder="47.0239" /></div>
        <div class="form-group"><label for="carte_lng">Longitude</label><input type="text" id="carte_lng" name="carte_lng" placeholder="4.8397" /></div>
      </div>
      <div class="form-group"><label for="carte_nom">Nom affiché sur la carte</label><input type="text" id="carte_nom" name="carte_nom" placeholder="Domaine des Brumes" /></div>
      <div class="form-group"><label for="carte_caption">Légende sous la carte</label><input type="text" id="carte_caption" name="carte_caption" placeholder="📍 Domaine des Brumes · Beaune" /></div>
    </div>
  </div>

  <!-- ── 11 · DRESS CODE ── -->
  <div class="wizard-step" data-step="11">
    <div class="step-header"><span class="step-number">11</span><h2>Code Vestimentaire</h2></div>
    <div class="form-group">
      <label for="dress_intro">Description du dress code</label>
      <textarea id="dress_intro" name="dress_intro" placeholder="Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !"></textarea>
    </div>
    <p class="hint" style="margin-bottom:1rem">Palette de couleurs (6 swatches — cocher "À éviter" pour les couleurs déconseillées)</p>
    <!-- 6 couleurs -->
    <div class="block-section">
      <div class="block-title">Couleur 1</div>
      <div class="form-row">
        <div class="form-group"><label for="c0_nom">Nom</label><input type="text" id="c0_nom" name="c0_nom" placeholder="Rose poudré" /></div>
        <div class="form-group"><label for="c0_hex">Couleur</label><input type="color" id="c0_hex" name="c0_hex" value="#F2C4CE" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c0_eviter" /> À éviter</label></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Couleur 2</div>
      <div class="form-row">
        <div class="form-group"><label for="c1_nom">Nom</label><input type="text" id="c1_nom" name="c1_nom" placeholder="Champagne" /></div>
        <div class="form-group"><label for="c1_hex">Couleur</label><input type="color" id="c1_hex" name="c1_hex" value="#F0DCA0" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c1_eviter" /> À éviter</label></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Couleur 3</div>
      <div class="form-row">
        <div class="form-group"><label for="c2_nom">Nom</label><input type="text" id="c2_nom" name="c2_nom" placeholder="Sauge" /></div>
        <div class="form-group"><label for="c2_hex">Couleur</label><input type="color" id="c2_hex" name="c2_hex" value="#87A878" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c2_eviter" /> À éviter</label></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Couleur 4</div>
      <div class="form-row">
        <div class="form-group"><label for="c3_nom">Nom</label><input type="text" id="c3_nom" name="c3_nom" placeholder="Ivoire" /></div>
        <div class="form-group"><label for="c3_hex">Couleur</label><input type="color" id="c3_hex" name="c3_hex" value="#F5F0E0" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c3_eviter" /> À éviter</label></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Couleur 5</div>
      <div class="form-row">
        <div class="form-group"><label for="c4_nom">Nom</label><input type="text" id="c4_nom" name="c4_nom" placeholder="Blanc" /></div>
        <div class="form-group"><label for="c4_hex">Couleur</label><input type="color" id="c4_hex" name="c4_hex" value="#F5F5F5" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c4_eviter" checked /> À éviter</label></div>
      </div>
    </div>
    <div class="block-section">
      <div class="block-title">Couleur 6</div>
      <div class="form-row">
        <div class="form-group"><label for="c5_nom">Nom</label><input type="text" id="c5_nom" name="c5_nom" placeholder="Noir" /></div>
        <div class="form-group"><label for="c5_hex">Couleur</label><input type="color" id="c5_hex" name="c5_hex" value="#1A1A1A" /></div>
        <div class="form-group"><label>&nbsp;</label><label class="checkbox-label"><input type="checkbox" name="c5_eviter" checked /> À éviter</label></div>
      </div>
    </div>
  </div>

  <!-- ── 12 · INFOS PRATIQUES ── -->
  <div class="wizard-step" data-step="12">
    <div class="step-header"><span class="step-number">12</span><h2>Infos Pratiques</h2></div>
    <p class="hint" style="margin-bottom:1rem">Laisser le texte vide pour masquer une ligne.</p>
    <div class="block-section">
      <div class="block-title">🚗 Parking</div>
      <div class="form-group"><textarea id="i0_texte" name="i0_texte" placeholder="Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune."></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">🚂 Train</div>
      <div class="form-group"><textarea id="i1_texte" name="i1_texte" placeholder="Gare de Beaune à 8 km. Navettes organisées depuis la gare."></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">🏨 Hébergement</div>
      <div class="form-group"><textarea id="i2_texte" name="i2_texte" placeholder="Des chambres ont été pré-réservées à l'Hôtel Le Cep."></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">👶 Enfants</div>
      <div class="form-group"><textarea id="i3_texte" name="i3_texte" placeholder="Soirée adultes uniquement."></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">📸 Photos</div>
      <div class="form-group"><textarea id="i4_texte" name="i4_texte" placeholder="Un photographe professionnel sera présent."></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">➕ Info supplémentaire <span class="opt">(optionnel)</span></div>
      <div class="form-row">
        <div class="form-group"><label for="i5_icon">Icône</label><input type="text" id="i5_icon" name="i5_icon" value="➕" /></div>
        <div class="form-group"><label for="i5_titre">Titre</label><input type="text" id="i5_titre" name="i5_titre" /></div>
      </div>
      <div class="form-group"><textarea id="i5_texte" name="i5_texte"></textarea></div>
    </div>
  </div>

  <!-- ── 13 · FAQ ── -->
  <div class="wizard-step" data-step="13">
    <div class="step-header"><span class="step-number">13</span><h2>Questions Fréquentes</h2></div>
    <p class="hint" style="margin-bottom:1rem">Laisser la question vide pour masquer une entrée.</p>
    <div class="block-section">
      <div class="block-title">Q&amp;R 1</div>
      <div class="form-group"><label for="faq0_q">Question</label><input type="text" id="faq0_q" name="faq0_q" placeholder="Puis-je amener un +1 non mentionné ?" /></div>
      <div class="form-group"><label for="faq0_r">Réponse</label><textarea id="faq0_r" name="faq0_r"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Q&amp;R 2</div>
      <div class="form-group"><label for="faq1_q">Question</label><input type="text" id="faq1_q" name="faq1_q" placeholder="Y a-t-il une liste de mariage ?" /></div>
      <div class="form-group"><label for="faq1_r">Réponse</label><textarea id="faq1_r" name="faq1_r"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Q&amp;R 3</div>
      <div class="form-group"><label for="faq2_q">Question</label><input type="text" id="faq2_q" name="faq2_q" /></div>
      <div class="form-group"><label for="faq2_r">Réponse</label><textarea id="faq2_r" name="faq2_r"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Q&amp;R 4</div>
      <div class="form-group"><label for="faq3_q">Question</label><input type="text" id="faq3_q" name="faq3_q" /></div>
      <div class="form-group"><label for="faq3_r">Réponse</label><textarea id="faq3_r" name="faq3_r"></textarea></div>
    </div>
    <div class="block-section">
      <div class="block-title">Q&amp;R 5</div>
      <div class="form-group"><label for="faq4_q">Question</label><input type="text" id="faq4_q" name="faq4_q" /></div>
      <div class="form-group"><label for="faq4_r">Réponse</label><textarea id="faq4_r" name="faq4_r"></textarea></div>
    </div>
  </div>

  <!-- ── 14 · VIDÉO HERO ── -->
  <div class="wizard-step" data-step="14">
    <div class="step-header"><span class="step-number">14</span><h2>Vidéo Hero</h2></div>
    <div class="form-group">
      <label for="video_type">Type de vidéo</label>
      <select id="video_type" name="video_type">
        <option value="local">Fichier local (hero.mp4 dans le dossier)</option>
        <option value="url">URL externe (lien direct vers la vidéo)</option>
        <option value="none">Pas de vidéo (fond sombre)</option>
      </select>
    </div>
    <div class="form-group" id="video_src_group">
      <label for="video_src">URL de la vidéo <span class="opt">(si URL externe)</span></label>
      <input type="url" id="video_src" name="video_src" placeholder="https://..." />
    </div>
    <div class="form-group">
      <label for="rsvp_intro">Texte d'introduction RSVP</label>
      <textarea id="rsvp_intro" name="rsvp_intro" placeholder="Merci de nous confirmer votre présence avant le 1er mai 2025…"></textarea>
    </div>
  </div>

  <!-- Navigation -->
  <div class="wizard-nav">
    <button type="button" id="btn-prev" class="btn-prev">← Précédent</button>
    <button type="button" id="btn-next" class="btn-next">Suivant →</button>
    <button type="button" id="btn-submit" class="btn-submit" style="display:none">Envoyer ✓</button>
  </div>
</div>

<!-- Confirmation -->
<div id="confirmation" class="hidden">
  <div class="confirmation-icon">◆</div>
  <h2>Merci !</h2>
  <p>Vos informations ont bien été transmises.<br>Nous vous contacterons rapidement pour la suite.</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="script.js"></script>
</body>
</html>
```

- [ ] **Commit**

```bash
git add onboarding/index.html onboarding/style.css
git commit -m "feat: add onboarding wizard HTML and CSS (14 steps)"
```

```json:metadata
{"files": ["onboarding/index.html", "onboarding/style.css"], "verifyCommand": "open onboarding/index.html", "acceptanceCriteria": ["14 steps navigate correctly", "Progress bar updates", "Démo button visible on step 1", "Responsive on mobile"], "requiresUserVerification": false}
```

---

## Task 1: onboarding/ — Génération config.js + navigation + démo

**Goal:** JS that handles wizard navigation, reads all form values, generates a valid `config.js` string, and pre-fills with Sophie & Thomas demo data.

**Files:**
- Create: `onboarding/script.js`

**Acceptance Criteria:**
- [ ] Clicking "Suivant" advances step and updates progress bar
- [ ] Clicking "Précédent" goes back; button hidden on step 1
- [ ] "Charger le couple démo" pre-fills all fields
- [ ] `generateConfigJS()` returns a valid JS string with `const MARIAGE = {...}`
- [ ] Downloading the file produces a parseable `config.js`

**Verify:** Open onboarding/index.html → click "Couple démo" → click through to step 14 → open browser console → run `generateConfigJS()` → verify output is valid JS

**Steps:**

- [ ] **Créer `onboarding/script.js`**

```js
/* ═══════════════════════════════════════════════════
   WEDORIA ONBOARDING · script.js
═══════════════════════════════════════════════════ */

// ── CONFIG EMAILJS (à remplacer avec vos vraies clés) ──
const EMAILJS_SERVICE_ID  = 'VOTRE_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'VOTRE_PUBLIC_KEY';
// Adresse qui recevra l'email avec le config.js
const RECIPIENT_EMAIL     = 'votre@email.com';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── ÉTAT DU WIZARD ──
const TOTAL_STEPS = 14;
let currentStep = 1;

const steps       = document.querySelectorAll('.wizard-step');
const btnPrev     = document.getElementById('btn-prev');
const btnNext     = document.getElementById('btn-next');
const btnSubmit   = document.getElementById('btn-submit');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.wizard-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  btnNext.style.display    = n === TOTAL_STEPS ? 'none' : 'inline-block';
  btnSubmit.style.display  = n === TOTAL_STEPS ? 'inline-block' : 'none';

  progressFill.style.width = `${(n / TOTAL_STEPS) * 100}%`;
  progressLabel.textContent = `Étape ${n} / ${TOTAL_STEPS}`;

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnNext.addEventListener('click', () => {
  if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
});

btnPrev.addEventListener('click', () => {
  if (currentStep > 1) showStep(currentStep - 1);
});

// Masquer/afficher le champ URL vidéo selon le type
document.getElementById('video_type').addEventListener('change', function() {
  document.getElementById('video_src_group').style.display =
    this.value === 'url' ? 'block' : 'none';
});
document.getElementById('video_src_group').style.display = 'none';

// ── DONNÉES DÉMO (Sophie & Thomas) ──
const DEMO = {
  prenom1: 'Sophie',         nom1: 'Martin',
  prenom2: 'Thomas',         nom2: 'Dupont',
  date_affichage: 'Samedi 12 Juillet 2025',
  date_iso:       '2025-07-12T14:00:00',
  rsvp_deadline:  '1er Mai 2025',
  domaine: 'Domaine des Brumes',
  ville:   'Beaune, Bourgogne',
  email:    'sophie.thomas@exemple.com',
  whatsapp: '06 12 34 56 78',
  lang_en: false, lang_vi: false,
  photo_couple: 'photo-couple.jpg',
  photo_couple_caption: 'Sophie & Thomas · Paris, France',
  hero_intro:   'Vous êtes invités au mariage de',
  hero_cta:     'Confirmer ma présence',
  sr_line1:     'Avant ce jour,',
  sr_line2:     "notre histoire s'écrivait",
  citation:     '« Aimer, c\'est trouver sa richesse en l\'autre. »',
  bandeau:      'France, Barcelone, Sophie, Thomas, Juillet 2025, Beaune, Bourgogne',
  histoire_eyebrow: 'Depuis 2019',
  histoire_titre:   'Notre Histoire',
  h0_annee: '2019', h0_titre: 'La Rencontre',
  h0_texte: "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois.",
  h0_align: 'left',
  h1_annee: '2022', h1_titre: 'Notre Premier Voyage',
  h1_texte: 'Direction Lisbonne pour notre premier voyage. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l\'un pour l\'autre.',
  h1_align: 'right',
  h2_annee: '2024', h2_titre: 'La Demande',
  h2_texte: 'Au coucher du soleil sur la plage de Biarritz, Thomas s\'est agenouillé et a demandé à Sophie de partager sa vie.',
  h2_align: 'left',
  h3_annee: '2025', h3_titre: 'Le Grand Jour',
  h3_texte: 'Nous célébrons notre union entourés de ceux que nous aimons.',
  h3_align: 'right',
  h4_annee: '', h4_titre: '', h4_texte: '', h4_align: 'left',
  programme_eyebrow: '12 Juillet 2025',
  programme_titre:   'Le Jour J',
  p0_heure: '14h00', p0_icon: '💍', p0_titre: 'Cérémonie Laïque',  p0_lieu: 'Chapelle du Domaine des Brumes',
  p1_heure: '15h30', p1_icon: '🥂', p1_titre: "Vin d'Honneur",     p1_lieu: 'Jardins du Domaine',
  p2_heure: '19h30', p2_icon: '🍽️', p2_titre: 'Dîner de Gala',     p2_lieu: 'Grande Salle du Château',
  p3_heure: '22h00', p3_icon: '🎵', p3_titre: 'Soirée Dansante',   p3_lieu: "Jusqu'au bout de la nuit !",
  galerie_eyebrow: 'Le décor de notre amour',
  galerie_titre:   'Le Domaine',
  g0_icon: '🏰', g0_label: 'Façade du Domaine',   g0_photo: '',
  g1_icon: '🌿', g1_label: 'Les Jardins',          g1_photo: '',
  g2_icon: '✨', g2_label: 'Grande Salle',         g2_photo: '',
  g3_icon: '⛪', g3_label: 'Chapelle',             g3_photo: '',
  g4_icon: '🌸', g4_label: 'Terrasse',             g4_photo: '',
  g5_icon: '🕯️', g5_label: 'Décoration de Table', g5_photo: '',
  l0_icon: '⛪', l0_type: 'Cérémonie Laïque', l0_nom: 'Chapelle Saint-Jean',
  l0_adresse1: '12 Route des Vignes', l0_adresse2: '21200 Beaune, Bourgogne',
  l1_icon: '🏰', l1_type: 'Réception', l1_nom: 'Domaine des Brumes',
  l1_adresse1: 'Hameau des Brumes',   l1_adresse2: '21200 Beaune, Bourgogne',
  l2_nom: 'Hôtel Le Cep ★★★★', l2_adresse1: '27 Rue Maufoux', l2_adresse2: '21200 Beaune, Bourgogne',
  carte_lat: '47.0239', carte_lng: '4.8397', carte_nom: 'Domaine des Brumes',
  carte_caption: '📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune',
  dress_intro: 'Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !',
  c0_nom: 'Rose poudré',  c0_hex: '#F2C4CE', c0_eviter: false,
  c1_nom: 'Champagne',    c1_hex: '#F0DCA0', c1_eviter: false,
  c2_nom: 'Sauge',        c2_hex: '#87A878', c2_eviter: false,
  c3_nom: 'Ivoire',       c3_hex: '#F5F0E0', c3_eviter: false,
  c4_nom: 'Blanc',        c4_hex: '#F5F5F5', c4_eviter: true,
  c5_nom: 'Noir',         c5_hex: '#1A1A1A', c5_eviter: true,
  i0_texte: 'Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord.',
  i1_texte: 'Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50.',
  i2_texte: "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel.",
  i3_texte: 'Soirée adultes uniquement.',
  i4_texte: 'Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage.',
  i5_icon: '➕', i5_titre: '', i5_texte: '',
  faq0_q: "Puis-je amener un +1 non mentionné sur l'invitation ?",
  faq0_r: "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire.",
  faq1_q: "Y a-t-il une liste de mariage ?",
  faq1_r: "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage. Détails envoyés par email après RSVP.",
  faq2_q: "Comment nous contacter ?",
  faq2_r: 'Écrivez-nous à <a href="mailto:sophie.thomas@exemple.com">sophie.thomas@exemple.com</a>.',
  faq3_q: '', faq3_r: '',
  faq4_q: '', faq4_r: '',
  video_type: 'local',
  video_src:  '',
  rsvp_intro: 'Merci de nous confirmer votre présence avant le 1er mai 2025 afin que nous puissions organiser cette belle journée dans les meilleures conditions.',
};

// Remplir tous les champs du formulaire avec DEMO
document.getElementById('btn-demo').addEventListener('click', () => {
  Object.entries(DEMO).forEach(([key, value]) => {
    const el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
    if (!el) return;
    if (el.type === 'checkbox') { el.checked = value; return; }
    el.value = value;
  });
  // Déclencher l'affichage du champ URL vidéo
  document.getElementById('video_type').dispatchEvent(new Event('change'));
  // Aller à l'étape suivante pour confirmation visuelle
  showStep(2);
});

// ── LECTURE DES VALEURS ──
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function vCheck(name) {
  const el = document.querySelector(`[name="${name}"]`);
  return el ? el.checked : false;
}

// ── GÉNÉRATION DE L'OBJET MARIAGE ──
function generateMAIRIAGE() {
  const langues = ['fr'];
  if (vCheck('lang_en')) langues.push('en');
  if (vCheck('lang_vi')) langues.push('vi');

  const bandeau = v('bandeau')
    ? v('bandeau').split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const histoire = [0,1,2,3,4].map(i => ({
    annee: v(`h${i}_annee`),
    titre: v(`h${i}_titre`),
    texte: v(`h${i}_texte`),
    align: v(`h${i}_align`) || 'left',
  }));

  const programme = [0,1,2,3].map(i => ({
    heure: v(`p${i}_heure`),
    icon:  v(`p${i}_icon`) || '◆',
    titre: v(`p${i}_titre`),
    lieu:  v(`p${i}_lieu`),
  }));

  const galerie = [0,1,2,3,4,5].map(i => ({
    icon:  v(`g${i}_icon`) || '🏛️',
    label: v(`g${i}_label`),
    photo: v(`g${i}_photo`) || null,
  }));

  const carteLatRaw = v('carte_lat');
  const carteLngRaw = v('carte_lng');
  const carte = {
    lat:     carteLatRaw ? parseFloat(carteLatRaw) : null,
    lng:     carteLngRaw ? parseFloat(carteLngRaw) : null,
    zoom:    14,
    nom:     v('carte_nom'),
    adresse: [v('l1_adresse1'), v('l1_adresse2')].filter(Boolean),
    caption: v('carte_caption'),
  };

  const lieux = [
    {
      icon: v('l0_icon') || '⛪', type: v('l0_type'),
      nom:  v('l0_nom'),
      adresse: [v('l0_adresse1'), v('l0_adresse2')].filter(Boolean),
      featured: false, badge: '',
      btn: { label: 'Voir sur la carte', href: '#map' },
    },
    {
      icon: v('l1_icon') || '🏰', type: v('l1_type'),
      nom:  v('l1_nom'),
      adresse: [v('l1_adresse1'), v('l1_adresse2')].filter(Boolean),
      featured: true, badge: 'Lieu principal',
      btn: { label: 'Voir sur la carte', href: '#map' },
    },
    {
      icon: '🏨', type: 'Hébergement conseillé',
      nom:  v('l2_nom'),
      adresse: [v('l2_adresse1'), v('l2_adresse2')].filter(Boolean),
      featured: false, badge: '',
      btn: { label: "Plus d'infos", href: '#infos' },
    },
  ];

  const dress_couleurs = [0,1,2,3,4,5].map(i => ({
    nom:    v(`c${i}_nom`),
    hex:    v(`c${i}_hex`),
    eviter: vCheck(`c${i}_eviter`),
  })).filter(c => c.nom);

  const infos = [
    { icon: '🚗', titre: 'Parking',      texte: v('i0_texte') },
    { icon: '🚂', titre: 'Train',        texte: v('i1_texte') },
    { icon: '🏨', titre: 'Hébergement',  texte: v('i2_texte') },
    { icon: '👶', titre: 'Enfants',      texte: v('i3_texte') },
    { icon: '📸', titre: 'Photos',       texte: v('i4_texte') },
    { icon: v('i5_icon') || '➕', titre: v('i5_titre'), texte: v('i5_texte') },
  ];

  const faq = [0,1,2,3,4].map(i => ({
    q: v(`faq${i}_q`),
    r: v(`faq${i}_r`),
  }));

  const photoCouple = v('photo_couple') || null;

  return {
    prenom1: v('prenom1'), nom1: v('nom1'),
    prenom2: v('prenom2'), nom2: v('nom2'),
    date_affichage: v('date_affichage'),
    date_iso:       v('date_iso'),
    rsvp_deadline:  v('rsvp_deadline') || null,
    domaine: v('domaine'),
    ville:   v('ville'),
    email:    v('email'),
    whatsapp: v('whatsapp') || null,
    langues,
    photo_couple:         photoCouple,
    photo_couple_caption: v('photo_couple_caption'),
    hero_intro:   v('hero_intro'),
    hero_cta:     v('hero_cta'),
    scroll_label: 'Découvrir',
    citation:     v('citation'),
    sr_line1:     v('sr_line1'),
    sr_line2:     v('sr_line2'),
    bandeau,
    histoire_eyebrow: v('histoire_eyebrow'),
    histoire_titre:   v('histoire_titre'),
    histoire,
    programme_eyebrow: v('programme_eyebrow'),
    programme_titre:   v('programme_titre'),
    programme,
    galerie_eyebrow: v('galerie_eyebrow'),
    galerie_titre:   v('galerie_titre'),
    galerie_hint:    '',
    galerie,
    lieux_eyebrow: 'Où nous rejoindre',
    lieux_titre:   'Les Lieux',
    lieux,
    carte,
    dress_eyebrow: 'Pour l\'occasion',
    dress_titre:   'Code Vestimentaire',
    dress_intro:   v('dress_intro'),
    dress_couleurs,
    infos_eyebrow: 'Tout ce qu\'il faut savoir',
    infos_titre:   'Infos Pratiques',
    infos,
    faq_titre: 'Questions fréquentes',
    faq,
    video_hero: {
      type: v('video_type') || 'local',
      src:  v('video_src') || 'hero.mp4',
    },
    rsvp_titre: 'Confirmer votre présence',
    rsvp_intro: v('rsvp_intro'),
    i18n: {},
  };
}

// ── GÉNÉRATION DU FICHIER config.js ──
function generateConfigJS(m) {
  return `/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Généré par Wedoria Onboarding
   ─────────────────────────────────────────────────────────────
   C'est le SEUL fichier à modifier pour chaque nouveau client.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = ${JSON.stringify(m, null, 2)};
`;
}
```

- [ ] **Commit**

```bash
git add onboarding/script.js
git commit -m "feat: add onboarding wizard navigation, demo data, and config generation"
```

```json:metadata
{"files": ["onboarding/script.js"], "verifyCommand": "open onboarding/index.html — charger démo, ouvrir console, appeler generateConfigJS(generateMAIRIAGE())", "acceptanceCriteria": ["Navigation wizard fonctionne", "Démo pré-remplit tous les champs", "generateConfigJS retourne JS valide", "Objet MARIAGE conforme au schéma"], "requiresUserVerification": false}
```

---

## Task 2: onboarding/ — Envoi EmailJS + téléchargement + confirmation

**Goal:** On submit, generate config.js, trigger file download, send email with config content, show confirmation screen.

**Files:**
- Modify: `onboarding/script.js` — ajouter la fonction `handleSubmit()` à la fin

**Acceptance Criteria:**
- [ ] Cliquer "Envoyer" déclenche le téléchargement de `config-prenom1-prenom2.js`
- [ ] Un email est envoyé à `RECIPIENT_EMAIL` avec le contenu config.js dans le corps
- [ ] L'écran de confirmation s'affiche, le wizard disparaît
- [ ] Le bouton est désactivé pendant l'envoi (pas de double-clic)

**Verify:** Remplir le formulaire démo → cliquer Envoyer → vérifier : fichier téléchargé, email reçu, confirmation affichée

**Prérequis EmailJS :**
1. Créer un compte sur https://emailjs.com (gratuit)
2. Créer un "Email Service" (Gmail, etc.) → noter le `serviceId`
3. Créer un "Email Template" avec les variables `{{to_email}}`, `{{subject}}`, `{{prenom1}}`, `{{prenom2}}`, `{{date}}`, `{{lieu}}`, `{{config_content}}` → noter le `templateId`
4. Récupérer la "Public Key" dans Account → API Keys
5. Remplacer les 4 constantes en haut de `script.js`

**Template EmailJS recommandé (corps de l'email) :**
```
Nouveau client : {{prenom1}} & {{prenom2}}
Date : {{date}}
Lieu : {{lieu}}

--- CONFIG.JS ---
{{config_content}}
```

**Steps:**

- [ ] **Ajouter à la fin de `onboarding/script.js`**

```js
// ── TÉLÉCHARGEMENT DU FICHIER ──
function downloadConfig(content, prenom1, prenom2) {
  const filename = `config-${prenom1.toLowerCase()}-${prenom2.toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── SOUMISSION ──
async function handleSubmit() {
  const m         = generateMAIRIAGE();
  const configStr = generateConfigJS(m);

  // 1. Téléchargement immédiat (même si l'email échoue)
  downloadConfig(configStr, m.prenom1, m.prenom2);

  // 2. Désactiver le bouton
  btnSubmit.disabled   = true;
  btnSubmit.textContent = 'Envoi en cours…';

  // 3. Envoi email via EmailJS
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:       RECIPIENT_EMAIL,
      subject:        `Nouveau client — ${m.prenom1} & ${m.prenom2}`,
      prenom1:        m.prenom1,
      prenom2:        m.prenom2,
      date:           m.date_affichage,
      lieu:           `${m.domaine}, ${m.ville}`,
      email_client:   m.email,
      config_content: configStr,
    });
  } catch (err) {
    console.error('EmailJS error:', err);
    // L'email a échoué mais le fichier a déjà été téléchargé — on continue
  }

  // 4. Afficher la confirmation
  document.getElementById('wizard').style.display      = 'none';
  document.getElementById('confirmation').classList.remove('hidden');
}

btnSubmit.addEventListener('click', handleSubmit);
```

- [ ] **Commit**

```bash
git add onboarding/script.js
git commit -m "feat: add EmailJS submit, auto-download config.js, confirmation screen"
```

```json:metadata
{"files": ["onboarding/script.js"], "verifyCommand": "Remplir démo → Envoyer → vérifier téléchargement + email + confirmation", "acceptanceCriteria": ["Fichier config téléchargé automatiquement", "Email reçu avec contenu config", "Confirmation visible après envoi", "Bouton désactivé pendant envoi"], "requiresUserVerification": false}
```

---

## Task 3: studio/ — Layout HTML + CSS

**Goal:** Studio split layout with topbar, scrollable left form panel, right iframe panel.

**Files:**
- Create: `studio/index.html`
- Create: `studio/style.css`

**Acceptance Criteria:**
- [ ] Layout split 340px gauche / reste droite, fixe sans scroll de page
- [ ] Topbar avec nom client, bouton "Charger", bouton "Télécharger"
- [ ] Zone de drop visible au centre quand aucun config n'est chargé
- [ ] Iframe remplit toute la hauteur droite

**Verify:** Ouvrir `studio/index.html` via VS Code Live Server → vérifier le layout

**Note :** Le Studio nécessite un serveur local pour que `fetch()` fonctionne.
Installer l'extension **VS Code Live Server** → clic droit sur `studio/index.html` → "Open with Live Server".

**Steps:**

- [ ] **Créer `studio/style.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --topbar-h: 52px;
  --panel-w: 360px;
  --bg:      #111119;
  --surface: #1a1a28;
  --border:  #2e2e45;
  --text:    #cdd6f4;
  --text-dim:#6c7086;
  --gold:    #c9a96e;
  --green:   #a6e3a1;
}

html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; }

/* ── TOPBAR ── */
.topbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--topbar-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0 1rem;
  z-index: 100;
}
.topbar-logo { font-weight: 700; letter-spacing: 0.1em; color: var(--gold); font-size: 0.9rem; margin-right: 0.5rem; }
.topbar-client { font-size: 0.8rem; color: var(--text-dim); flex: 1; }
.topbar-client span { color: var(--text); font-weight: 500; }

.btn-load, .btn-export {
  padding: 6px 14px; border-radius: 6px; font-size: 0.78rem;
  font-weight: 600; cursor: pointer; border: none; white-space: nowrap;
}
.btn-load   { background: transparent; border: 1px solid var(--border); color: var(--text-dim); }
.btn-load:hover { border-color: var(--gold); color: var(--gold); }
.btn-export { background: var(--green); color: #1a1a1a; }
.btn-export:hover { background: #b8eeae; }
.btn-export:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── MAIN LAYOUT ── */
.studio-layout {
  display: flex;
  height: 100vh;
  padding-top: var(--topbar-h);
}

/* ── LEFT PANEL (form) ── */
.left-panel {
  width: var(--panel-w);
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  padding: 1rem;
}

.panel-section { margin-bottom: 1.25rem; }
.panel-section-title {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 0.5rem; padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--border);
}

.field { margin-bottom: 0.6rem; }
.field label { display: block; font-size: 0.7rem; color: var(--text-dim); margin-bottom: 3px; }
.field input, .field textarea, .field select {
  width: 100%; padding: 0.4rem 0.6rem;
  background: #0e0e1a; border: 1px solid var(--border);
  border-radius: 5px; color: var(--text);
  font-size: 0.8rem; font-family: inherit;
}
.field input:focus, .field textarea:focus, .field select:focus {
  outline: none; border-color: var(--gold);
}
.field textarea { resize: vertical; min-height: 60px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.field input[type="color"] { height: 32px; padding: 2px 4px; width: 48px; cursor: pointer; }

/* ── RIGHT PANEL (iframe) ── */
.right-panel {
  flex: 1;
  position: relative;
  background: #000;
  overflow: hidden;
}

#preview-iframe {
  width: 100%; height: 100%; border: none;
  display: none;
}

.drop-zone {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1rem; color: var(--text-dim);
}
.drop-zone.drag-over { background: rgba(201,169,110,0.05); }
.drop-zone.hidden { display: none; }

.drop-icon { font-size: 3rem; }
.drop-title { font-size: 1.1rem; font-weight: 600; color: var(--text); }
.drop-sub   { font-size: 0.82rem; }
.drop-or    { font-size: 0.75rem; color: var(--text-dim); }

.btn-form-preview {
  padding: 8px 20px; background: var(--gold); color: #1a1a1a;
  border: none; border-radius: 6px; font-weight: 700;
  font-size: 0.85rem; cursor: pointer;
}
.btn-form-preview:hover { background: #d9bc8a; }

/* ── SPINNER ── */
.preview-loading {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: #000; color: var(--text-dim); font-size: 0.85rem;
  display: none;
}
```

- [ ] **Créer `studio/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>◆ Wedoria Studio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<!-- TOPBAR -->
<header class="topbar">
  <span class="topbar-logo">◆ STUDIO</span>
  <span class="topbar-client" id="topbar-client">Aucun config chargé</span>
  <input type="file" id="file-input" accept=".js" style="display:none" />
  <button class="btn-load" id="btn-load">📂 Charger config.js</button>
  <button class="btn-export" id="btn-export" disabled>⬇ Télécharger config.js</button>
</header>

<!-- LAYOUT -->
<div class="studio-layout">

  <!-- LEFT: formulaire éditable -->
  <aside class="left-panel" id="left-panel">

    <div class="panel-section">
      <div class="panel-section-title">Mariés</div>
      <div class="field-row">
        <div class="field"><label>Prénom 1</label><input type="text" id="s_prenom1" /></div>
        <div class="field"><label>Nom 1</label><input type="text" id="s_nom1" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Prénom 2</label><input type="text" id="s_prenom2" /></div>
        <div class="field"><label>Nom 2</label><input type="text" id="s_nom2" /></div>
      </div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">Date &amp; Lieu</div>
      <div class="field"><label>Date affichée</label><input type="text" id="s_date_affichage" /></div>
      <div class="field"><label>Date ISO</label><input type="text" id="s_date_iso" /></div>
      <div class="field"><label>Deadline RSVP</label><input type="text" id="s_rsvp_deadline" /></div>
      <div class="field-row">
        <div class="field"><label>Domaine</label><input type="text" id="s_domaine" /></div>
        <div class="field"><label>Ville</label><input type="text" id="s_ville" /></div>
      </div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">Contact</div>
      <div class="field"><label>Email</label><input type="text" id="s_email" /></div>
      <div class="field"><label>WhatsApp</label><input type="text" id="s_whatsapp" /></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">Intro &amp; Textes</div>
      <div class="field"><label>Texte hero</label><input type="text" id="s_hero_intro" /></div>
      <div class="field"><label>Bouton CTA</label><input type="text" id="s_hero_cta" /></div>
      <div class="field"><label>Citation</label><input type="text" id="s_citation" /></div>
      <div class="field"><label>Bandeau (virgules)</label><input type="text" id="s_bandeau" /></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">Dress code</div>
      <div class="field"><label>Description</label><textarea id="s_dress_intro"></textarea></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">Vidéo Hero</div>
      <div class="field">
        <label>Type</label>
        <select id="s_video_type">
          <option value="local">local</option>
          <option value="url">url</option>
          <option value="none">none</option>
        </select>
      </div>
      <div class="field"><label>Src (si url)</label><input type="text" id="s_video_src" /></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">RSVP</div>
      <div class="field"><label>Texte intro</label><textarea id="s_rsvp_intro"></textarea></div>
    </div>

  </aside>

  <!-- RIGHT: iframe preview -->
  <main class="right-panel" id="right-panel">
    <div class="drop-zone" id="drop-zone">
      <div class="drop-icon">📂</div>
      <div class="drop-title">Glisser un config.js ici</div>
      <div class="drop-sub">ou</div>
      <button class="btn-form-preview" id="btn-form-preview">Prévisualiser depuis le formulaire</button>
      <div class="drop-or">Le Studio nécessite VS Code Live Server</div>
    </div>
    <div class="preview-loading" id="preview-loading">Chargement du template…</div>
    <iframe id="preview-iframe" title="Preview site mariage"></iframe>
  </main>

</div>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Commit**

```bash
git add studio/index.html studio/style.css
git commit -m "feat: add studio HTML layout and CSS"
```

```json:metadata
{"files": ["studio/index.html", "studio/style.css"], "verifyCommand": "Ouvrir via Live Server → vérifier layout split, drop zone visible, topbar correcte", "acceptanceCriteria": ["Layout split 360px/reste", "Drop zone centrée côté droit", "Topbar avec boutons Load et Export"], "requiresUserVerification": false}
```

---

## Task 4: studio/ — Engine complet (preview Blob URL + drag & drop + export)

**Goal:** Full studio engine: fetch template assets, build Blob URL preview, populate form from dropped config.js, live refresh on edits, export named config.js.

**Files:**
- Create: `studio/script.js`

**Acceptance Criteria:**
- [ ] Drag & drop d'un config.js → formulaire pré-rempli + preview iframe chargée
- [ ] Modifier un champ → preview se rafraîchit après 500ms (debounce)
- [ ] "Prévisualiser depuis le formulaire" → preview chargée depuis les champs actuels
- [ ] "Télécharger config.js" → télécharge `config-prenom1-prenom2.js`
- [ ] Topbar affiche "Sophie & Thomas" une fois le config chargé

**Verify:** Via Live Server — drag & drop `template/config.js` → vérifier que l'iframe charge le site, modifier "Prénom 1" → voir le titre de page changer dans l'iframe

**Steps:**

- [ ] **Créer `studio/script.js`**

```js
/* ═══════════════════════════════════════════════════
   WEDORIA STUDIO · script.js
   Nécessite un serveur local (VS Code Live Server)
═══════════════════════════════════════════════════ */
'use strict';

// ── REFS DOM ──
const iframe         = document.getElementById('preview-iframe');
const dropZone       = document.getElementById('drop-zone');
const previewLoading = document.getElementById('preview-loading');
const topbarClient   = document.getElementById('topbar-client');
const btnLoad        = document.getElementById('btn-load');
const btnExport      = document.getElementById('btn-export');
const btnFormPreview = document.getElementById('btn-form-preview');
const fileInput      = document.getElementById('file-input');
const rightPanel     = document.getElementById('right-panel');

// ── ÉTAT ──
let currentMARIAGE = null;    // objet MARIAGE actif
let templateHTML   = null;    // contenu de template/index.html
let templateCSS    = null;    // contenu de template/style.css
let templateJS     = null;    // contenu de template/script.js
let debounceTimer  = null;

// ── CHARGEMENT DES ASSETS TEMPLATE (fetch — nécessite serveur) ──
async function loadTemplateAssets() {
  try {
    const [html, css, js] = await Promise.all([
      fetch('../template/index.html').then(r => r.text()),
      fetch('../template/style.css').then(r => r.text()),
      fetch('../template/script.js').then(r => r.text()),
    ]);
    templateHTML = html;
    templateCSS  = css;
    templateJS   = js;
  } catch (e) {
    console.error('Impossible de charger les assets template. Ouvre le Studio via VS Code Live Server.', e);
    dropZone.querySelector('.drop-or').textContent =
      '⚠️ Erreur : ouvre via VS Code Live Server (clic droit → Open with Live Server)';
  }
}

// ── CONSTRUCTION DU BLOB HTML ──
function buildPreviewHTML(m) {
  if (!templateHTML || !templateCSS || !templateJS) return null;

  // Injecter le config dans le HTML du template
  let html = templateHTML;

  // Remplacer <link rel="stylesheet" href="style.css"> par le CSS inline
  html = html.replace(
    /<link[^>]+href=["']style\.css["'][^>]*>/,
    `<style>${templateCSS}</style>`
  );

  // Supprimer les balises script locales (config, supabase-config, script)
  html = html.replace(/<script[^>]+src=["'](supabase-config|config|script)\.js["'][^>]*><\/script>/g, '');

  // Injecter config.js + supabase stub + script.js avant </body>
  const injection = `
<script>
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
</script>
<script>
const MARIAGE = ${JSON.stringify(m, null, 2)};
</script>
<script>
${templateJS}
</script>`;

  html = html.replace('</body>', injection + '\n</body>');
  return html;
}

// ── AFFICHAGE PREVIEW ──
function showPreview(m) {
  const html = buildPreviewHTML(m);
  if (!html) return;

  dropZone.classList.add('hidden');
  previewLoading.style.display = 'flex';
  iframe.style.display = 'none';

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);

  iframe.onload = () => {
    previewLoading.style.display = 'none';
    iframe.style.display = 'block';
    // Révoquer l'ancienne URL après chargement
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  iframe.src = url;
  currentMARIAGE = m;

  // Mettre à jour topbar
  topbarClient.innerHTML = `<span>${m.prenom1} &amp; ${m.prenom2}</span> — ${m.date_affichage}`;
  btnExport.disabled = false;
}

// ── LECTURE D'UN FICHIER config.js ──
function parseConfigFile(text) {
  try {
    // Extraire le contenu de l'objet MARIAGE
    // Supporte : const MARIAGE = {...}; ou var MARIAGE = {...};
    const match = text.match(/(?:const|var|let)\s+MARIAGE\s*=\s*(\{[\s\S]*\})\s*;?\s*$/m);
    if (!match) throw new Error('Pattern MARIAGE non trouvé');
    // Évaluer de façon sécurisée via Function
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch (e) {
    alert('Impossible de lire ce fichier config.js. Vérifiez qu\'il contient `const MARIAGE = {...}`.');
    return null;
  }
}

// ── PEUPLER LE FORMULAIRE DEPUIS UN OBJET MARIAGE ──
function populateForm(m) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  set('s_prenom1',        m.prenom1);
  set('s_nom1',           m.nom1);
  set('s_prenom2',        m.prenom2);
  set('s_nom2',           m.nom2);
  set('s_date_affichage', m.date_affichage);
  set('s_date_iso',       m.date_iso);
  set('s_rsvp_deadline',  m.rsvp_deadline || '');
  set('s_domaine',        m.domaine);
  set('s_ville',          m.ville);
  set('s_email',          m.email);
  set('s_whatsapp',       m.whatsapp || '');
  set('s_hero_intro',     m.hero_intro);
  set('s_hero_cta',       m.hero_cta);
  set('s_citation',       m.citation);
  set('s_bandeau',        Array.isArray(m.bandeau) ? m.bandeau.join(', ') : '');
  set('s_dress_intro',    m.dress_intro);
  set('s_video_type',     m.video_hero ? m.video_hero.type : 'local');
  set('s_video_src',      m.video_hero ? m.video_hero.src  : '');
  set('s_rsvp_intro',     m.rsvp_intro);
}

// ── LIRE LE FORMULAIRE ET CONSTRUIRE UN MARIAGE PARTIEL ──
// Pour le Studio, on ne réécrit que les champs éditables (les autres viennent de currentMARIAGE)
function readFormIntoMARIAGE() {
  if (!currentMARIAGE) return null;

  const v  = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const m  = JSON.parse(JSON.stringify(currentMARIAGE)); // deep clone

  m.prenom1        = v('s_prenom1')        || m.prenom1;
  m.nom1           = v('s_nom1')           || m.nom1;
  m.prenom2        = v('s_prenom2')        || m.prenom2;
  m.nom2           = v('s_nom2')           || m.nom2;
  m.date_affichage = v('s_date_affichage') || m.date_affichage;
  m.date_iso       = v('s_date_iso')       || m.date_iso;
  m.rsvp_deadline  = v('s_rsvp_deadline')  || null;
  m.domaine        = v('s_domaine')        || m.domaine;
  m.ville          = v('s_ville')          || m.ville;
  m.email          = v('s_email')          || m.email;
  m.whatsapp       = v('s_whatsapp')       || null;
  m.hero_intro     = v('s_hero_intro')     || m.hero_intro;
  m.hero_cta       = v('s_hero_cta')       || m.hero_cta;
  m.citation       = v('s_citation');
  m.bandeau        = v('s_bandeau') ? v('s_bandeau').split(',').map(s=>s.trim()).filter(Boolean) : [];
  m.dress_intro    = v('s_dress_intro');
  m.video_hero     = { type: v('s_video_type') || 'local', src: v('s_video_src') || 'hero.mp4' };
  m.rsvp_intro     = v('s_rsvp_intro');

  return m;
}

// ── GÉNÉRATION config.js ──
function generateConfigJS(m) {
  return `/* config.js — généré par Wedoria Studio */\n\nconst MARIAGE = ${JSON.stringify(m, null, 2)};\n`;
}

// ── EXPORT ──
function exportConfig() {
  const m = readFormIntoMARIAGE() || currentMARIAGE;
  if (!m) return;
  const content  = generateConfigJS(m);
  const filename = `config-${m.prenom1.toLowerCase()}-${m.prenom2.toLowerCase()}.js`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── DEBOUNCE REFRESH ──
function scheduleRefresh() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const m = readFormIntoMARIAGE();
    if (m) showPreview(m);
  }, 500);
}

// ── DRAG & DROP ──
rightPanel.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
rightPanel.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});
rightPanel.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file || !file.name.endsWith('.js')) {
    alert('Déposez un fichier .js (config.js)');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const m = parseConfigFile(ev.target.result);
    if (!m) return;
    populateForm(m);
    showPreview(m);
  };
  reader.readAsText(file);
});

// ── FILE PICKER ──
btnLoad.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const m = parseConfigFile(ev.target.result);
    if (!m) return;
    populateForm(m);
    showPreview(m);
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// ── PREVIEW DEPUIS FORMULAIRE ──
btnFormPreview.addEventListener('click', () => {
  // Créer un MARIAGE minimal depuis le formulaire (sans currentMARIAGE)
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const stub = {
    prenom1: v('s_prenom1') || 'Prénom 1', nom1: v('s_nom1') || '',
    prenom2: v('s_prenom2') || 'Prénom 2', nom2: v('s_nom2') || '',
    date_affichage: v('s_date_affichage') || 'Date à définir',
    date_iso: v('s_date_iso') || '2025-01-01T14:00:00',
    rsvp_deadline: v('s_rsvp_deadline') || null,
    domaine: v('s_domaine') || '', ville: v('s_ville') || '',
    email: v('s_email') || '', whatsapp: v('s_whatsapp') || null,
    langues: ['fr'],
    photo_couple: null, photo_couple_caption: '',
    hero_intro: v('s_hero_intro') || 'Vous êtes invités au mariage de',
    hero_cta: v('s_hero_cta') || 'Confirmer ma présence',
    scroll_label: 'Découvrir',
    citation: v('s_citation'),
    sr_line1: 'Avant ce jour,', sr_line2: "notre histoire s'écrivait",
    bandeau: v('s_bandeau') ? v('s_bandeau').split(',').map(s=>s.trim()).filter(Boolean) : [],
    histoire_eyebrow: '', histoire_titre: 'Notre Histoire',
    histoire: [{ annee:'', titre:'', texte:'', align:'left' }],
    programme_eyebrow: '', programme_titre: 'Le Jour J',
    programme: [{ heure:'', icon:'💍', titre:'', lieu:'' }],
    galerie_eyebrow: '', galerie_titre: 'Le Domaine', galerie_hint: '',
    galerie: [{ icon:'🏰', label:'', photo:null }],
    lieux_eyebrow: 'Où nous rejoindre', lieux_titre: 'Les Lieux',
    lieux: [{ icon:'🏰', type:'', nom:'', adresse:[], featured:true, badge:'Lieu principal', btn:{ label:'Voir sur la carte', href:'#map' } }],
    carte: { lat: null, lng: null, zoom:14, nom:'', adresse:[], caption:'' },
    dress_eyebrow: "Pour l'occasion", dress_titre: 'Code Vestimentaire',
    dress_intro: v('s_dress_intro'), dress_couleurs:[],
    infos_eyebrow: 'Tout ce qu\'il faut savoir', infos_titre: 'Infos Pratiques', infos:[],
    faq_titre: 'Questions fréquentes', faq:[],
    video_hero: { type: v('s_video_type')||'none', src: v('s_video_src')||'' },
    rsvp_titre: 'Confirmer votre présence', rsvp_intro: v('s_rsvp_intro'),
    i18n:{},
  };
  currentMARIAGE = stub;
  showPreview(stub);
});

// ── LISTENERS FORMULAIRE (debounce) ──
document.getElementById('left-panel').addEventListener('input', () => {
  if (currentMARIAGE) scheduleRefresh();
});

// ── EXPORT BUTTON ──
btnExport.addEventListener('click', exportConfig);

// ── INIT ──
loadTemplateAssets();
```

- [ ] **Commit**

```bash
git add studio/script.js
git commit -m "feat: add studio engine — Blob URL preview, drag & drop, form sync, export"
```

```json:metadata
{"files": ["studio/script.js"], "verifyCommand": "Via Live Server: drag template/config.js → iframe charge le site mariage, modifier champ → refresh auto", "acceptanceCriteria": ["Drag & drop config.js charge le site dans l'iframe", "Formulaire pré-rempli après drop", "Refresh live après 500ms", "Export télécharge config-prenom1-prenom2.js"], "requiresUserVerification": false}
```

---

## Self-Review

**1. Spec coverage :**
- ✅ Formulaire client 14 sections wizard → Tasks 0 + 1
- ✅ Couple démo pré-chargé → Task 1 (DEMO object + btn-demo)
- ✅ EmailJS envoi + téléchargement → Task 2
- ✅ Confirmation après envoi → Task 2
- ✅ Studio layout split → Task 3
- ✅ Drag & drop config.js → Task 4
- ✅ Preview Blob URL → Task 4
- ✅ Formulaire éditable + refresh live → Task 4
- ✅ Export nommé → Task 4
- ✅ Topbar avec nom client → Task 4

**2. Placeholder scan :** Aucun TBD. Les clés EmailJS sont des constantes à remplacer, documentées clairement.

**3. Type consistency :** `generateMAIRIAGE()` et `generateConfigJS()` utilisés de façon cohérente dans Tasks 1, 2, et 4. `currentMARIAGE` initialisé à `null` avant utilisation.

**4. Vérification user :** Non requis (outil interne PM).
