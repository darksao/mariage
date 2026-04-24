# Mise en ligne du site de mariage — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Héberger le site `site-invites/` sur Vercel et collecter les RSVP dans Supabase, avec un champ dynamique pour les prénoms des accompagnants.

**Architecture:** Site statique déployé sur Vercel. Le formulaire RSVP envoie les données directement à Supabase via le SDK JS (CDN). Les clés Supabase sont stockées dans un fichier de config dédié.

**Tech Stack:** HTML/CSS/JS vanilla, Supabase JS v2 (CDN), Vercel CLI

**User Verification:** YES — l'utilisateur doit vérifier que le RSVP apparaît dans le tableau de bord Supabase après un test de soumission.

---

## Pré-requis manuels (à faire avant de lancer les tâches)

Ces étapes ne peuvent pas être automatisées — elles nécessitent de créer des comptes en ligne.

### 1. Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com) → **Start your project** → créer un compte
2. Créer un nouveau projet (choisir la région `West EU`)
3. Dans **Project Settings > API**, noter :
   - `Project URL` (ex: `https://xxxx.supabase.co`)
   - `anon public key` (longue chaîne commençant par `eyJ...`)

### 2. Créer la table `rsvp` dans Supabase
Dans Supabase → **SQL Editor** → **New query**, coller et exécuter :

```sql
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  prenom text not null,
  nom text not null,
  email text not null,
  presence text not null,
  invites text,
  prenoms_accompagnants text,
  menu text,
  allergies text,
  message text
);

-- RLS : les invités peuvent insérer, seuls les admins peuvent lire
alter table rsvp enable row level security;

create policy "insert_public" on rsvp
  for insert to anon
  with check (true);

create policy "select_authenticated" on rsvp
  for select to authenticated
  using (true);
```

### 3. Installer Vercel CLI
Dans un terminal :
```bash
npm install -g vercel
```

---

## Structure des fichiers modifiés

| Fichier | Action | Rôle |
|---|---|---|
| `site-invites/supabase-config.js` | Créer | Clés de connexion Supabase |
| `site-invites/index.html` | Modifier | Ajout CDN Supabase + champ accompagnants |
| `site-invites/script.js` | Modifier | Affichage champ accompagnants + envoi Supabase |

---

## Tâche 1 : Créer le fichier de configuration Supabase

**Goal:** Créer `supabase-config.js` avec les clés du projet Supabase.

**Files:**
- Create: `site-invites/supabase-config.js`

**Acceptance Criteria:**
- [ ] Le fichier existe avec `SUPABASE_URL` et `SUPABASE_ANON_KEY` renseignés

**Verify:** Ouvrir le fichier et vérifier que les deux variables sont présentes et non vides.

**Steps:**

- [ ] **Étape 1 : Créer le fichier**

Créer `site-invites/supabase-config.js` avec ce contenu (remplacer les valeurs par celles du projet Supabase) :

```js
// Clés de connexion Supabase — la clé "anon" est publique, c'est normal
const SUPABASE_URL      = 'https://VOTRE_PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'eyJVOTRE_CLE_ANON...';
```

- [ ] **Étape 2 : Commit**

```bash
git add site-invites/supabase-config.js
git commit -m "feat: add supabase config"
```

```json:metadata
{"files": ["site-invites/supabase-config.js"], "verifyCommand": "", "acceptanceCriteria": ["fichier créé avec SUPABASE_URL et SUPABASE_ANON_KEY"], "requiresUserVerification": false}
```

---

## Tâche 2 : Ajouter le SDK Supabase et le champ accompagnants dans index.html

**Goal:** Charger le SDK Supabase via CDN et ajouter le champ HTML pour les prénoms des accompagnants dans le formulaire.

**Files:**
- Modify: `site-invites/index.html`

**Acceptance Criteria:**
- [ ] Le CDN Supabase JS est chargé avant `script.js`
- [ ] `supabase-config.js` est chargé avant `script.js`
- [ ] Le groupe `grp-accompagnants` existe dans le formulaire, entre `grp-invites` et `grp-menu`

**Verify:** Ouvrir `index.html` dans un navigateur, sélectionner "Oui" à la présence puis "+ 1 accompagnant(e)" → le champ prénoms doit apparaître.

**Steps:**

- [ ] **Étape 1 : Ajouter les scripts CDN dans `<head>` ou avant `</body>`**

Trouver la ligne `<script src="script.js"></script>` dans `index.html` et la remplacer par :

```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="supabase-config.js"></script>
  <script src="config.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="script.js"></script>
```

> Note : vérifier d'abord l'ordre exact des scripts existants dans index.html et ne garder que ceux déjà présents, en ajoutant uniquement les deux nouvelles lignes (supabase + supabase-config) avant les autres.

- [ ] **Étape 2 : Ajouter le champ prénoms accompagnants dans le formulaire**

Trouver dans `index.html` le bloc suivant (ligne ~241) :
```html
        </div>
        <div class="form-group" id="grp-menu" style="display:none">
```

Insérer ce nouveau bloc entre `grp-invites` et `grp-menu` :

```html
        <div class="form-group" id="grp-accompagnants" style="display:none">
          <label for="f-accompagnants">Prénom(s) de votre/vos accompagnant(s) *</label>
          <input type="text" id="f-accompagnants" name="accompagnants" placeholder="Ex : Marie, Pierre" />
        </div>
```

- [ ] **Étape 3 : Commit**

```bash
git add site-invites/index.html
git commit -m "feat: add supabase cdn and companion names field"
```

```json:metadata
{"files": ["site-invites/index.html"], "verifyCommand": "", "acceptanceCriteria": ["CDN supabase chargé", "supabase-config.js chargé", "champ grp-accompagnants présent dans le formulaire"], "requiresUserVerification": false}
```

---

## Tâche 3 : Connecter le formulaire à Supabase dans script.js

**Goal:** Modifier `script.js` pour (1) afficher/masquer le champ prénoms accompagnants dynamiquement, et (2) envoyer les RSVP à Supabase au lieu du localStorage.

**Files:**
- Modify: `site-invites/script.js`

**Acceptance Criteria:**
- [ ] Le champ prénoms accompagnants apparaît quand `f-invites` != "0"
- [ ] La soumission du formulaire insère une ligne dans la table `rsvp` Supabase
- [ ] En cas d'erreur réseau, un message d'erreur simple s'affiche à l'utilisateur
- [ ] Le comportement de confirmation visuelle (animation GSAP) est conservé

**Verify:** Soumettre le formulaire en local → vérifier dans Supabase > Table Editor > rsvp qu'une ligne est apparue.

**Steps:**

- [ ] **Étape 1 : Initialiser le client Supabase en haut de script.js**

Trouver la première ligne de `script.js` (probablement `document.addEventListener` ou `const M = MARIAGE`) et ajouter avant :

```js
// Client Supabase (SUPABASE_URL et SUPABASE_ANON_KEY viennent de supabase-config.js)
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

- [ ] **Étape 2 : Afficher/masquer le champ accompagnants selon la valeur du select**

Trouver dans `script.js` la logique qui gère l'affichage de `grp-invites` (chercher `grp-invites`). Elle ressemble à :

```js
document.getElementById('f-invites')?.addEventListener('change', ...);
```

Ajouter dans le même bloc (ou juste après), la logique pour `grp-accompagnants` :

```js
const selectInvites      = document.getElementById('f-invites');
const grpAccompagnants   = document.getElementById('grp-accompagnants');
const inputAccompagnants = document.getElementById('f-accompagnants');

function toggleAccompagnants() {
  const val = selectInvites?.value;
  const show = val && val !== '0';
  if (grpAccompagnants) grpAccompagnants.style.display = show ? '' : 'none';
  if (inputAccompagnants) inputAccompagnants.required = show;
}

selectInvites?.addEventListener('change', toggleAccompagnants);
```

- [ ] **Étape 3 : Remplacer le handler de soumission du formulaire**

Trouver le bloc `form.addEventListener('submit', e => { ... })` (ligne ~624) et remplacer le bloc entier par :

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('input[required]:not([type="radio"])').forEach(inp => {
    inp.classList.remove('error');
    const ok = inp.value.trim() &&
               (inp.type !== 'email' || /\S+@\S+\.\S+/.test(inp.value));
    if (!ok) { inp.classList.add('error'); valid = false; }
  });
  if (!form.querySelector('input[name="presence"]:checked')) valid = false;

  if (!valid) {
    const first = form.querySelector('.error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof gsap !== 'undefined') {
      gsap.to(form, { x: [-8, 8, -6, 6, 0], duration: 0.4, ease: 'none' });
    }
    return;
  }

  const prenom   = document.getElementById('f-prenom').value.trim();
  const presence = form.querySelector('input[name="presence"]:checked').value;
  const invites  = document.getElementById('f-invites')?.value ?? '0';

  const payload = {
    prenom,
    nom:                    document.getElementById('f-nom').value.trim(),
    email:                  document.getElementById('f-email').value.trim(),
    presence,
    invites,
    prenoms_accompagnants:  invites !== '0' ? (document.getElementById('f-accompagnants')?.value.trim() || null) : null,
    menu:                   form.querySelector('input[name="menu"]:checked')?.value ?? null,
    allergies:              document.getElementById('f-allergies')?.value.trim() || null,
    message:                document.getElementById('f-msg').value.trim() || null,
  };

  const { error } = await db.from('rsvp').insert(payload);

  if (error) {
    alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter par email.');
    console.error('Supabase error:', error);
    return;
  }

  if (typeof gsap !== 'undefined') {
    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.45, ease: 'power2.in',
      onComplete: () => {
        form.style.display = 'none';
        rsvpOk.style.display = 'block';
        gsap.from(rsvpOk, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
      }
    });
  } else {
    form.style.display = 'none';
    rsvpOk.style.display = 'block';
  }

  okMsg.textContent = presence === 'oui'
    ? `Merci ${prenom} ! Votre présence est confirmée. Nous avons hâte de vous voir le ${MARIAGE.date_affichage} 🎉`
    : `Merci ${prenom} pour votre réponse. Vous serez dans nos pensées ce beau jour-là 💕`;
});
```

- [ ] **Étape 4 : Commit**

```bash
git add site-invites/script.js
git commit -m "feat: connect rsvp form to supabase"
```

```json:metadata
{"files": ["site-invites/script.js"], "verifyCommand": "", "acceptanceCriteria": ["champ accompagnants s'affiche si invites != 0", "soumission insère dans supabase", "message d'erreur en cas d'échec réseau", "animation de confirmation conservée"], "requiresUserVerification": false}
```

---

## Tâche 4 : Vérifier le formulaire RSVP en local

**Goal:** S'assurer que le formulaire fonctionne localement avant de déployer.

**Files:** aucun

**Acceptance Criteria:**
- [ ] Le formulaire se soumet sans erreur
- [ ] La ligne apparaît dans Supabase > Table Editor > rsvp

**Verify:** Supabase > Table Editor > rsvp → au moins 1 ligne visible après le test.

**Steps:**

- [ ] **Étape 1 : Ouvrir le site en local**

Dans un terminal, dans le dossier `site-invites/` :

```bash
npx serve .
```

Ouvrir `http://localhost:3000` dans le navigateur.

- [ ] **Étape 2 : Tester le formulaire**

1. Cliquer sur "Oui, avec joie"
2. Sélectionner "+ 1 accompagnant(e)" → vérifier que le champ prénoms apparaît
3. Remplir tous les champs
4. Soumettre

- [ ] **Étape 3 : Vérifier dans Supabase**

Aller dans Supabase > **Table Editor** > `rsvp` → la ligne de test doit apparaître.

```json:metadata
{"files": [], "verifyCommand": "", "acceptanceCriteria": ["formulaire soumis sans erreur", "ligne visible dans supabase rsvp"], "requiresUserVerification": true, "userVerificationPrompt": "Avez-vous vu la ligne RSVP de test apparaître dans Supabase > Table Editor > rsvp ?"}
```

**User Verification Required:**
Avant de marquer cette tâche comme terminée, appeler AskUserQuestion :
```yaml
AskUserQuestion:
  question: "Avez-vous vu la ligne RSVP de test apparaître dans Supabase > Table Editor > rsvp ?"
  header: "Vérification"
  options:
    - label: "Oui, ça marche"
      description: "La ligne est visible — on peut déployer"
    - label: "Non, erreur"
      description: "Un problème est survenu — on diagnostique avant de déployer"
```

---

## Tâche 5 : Déployer sur Vercel

**Goal:** Mettre le site `site-invites/` en ligne sur Vercel et obtenir l'URL publique.

**Files:** aucun

**Acceptance Criteria:**
- [ ] Le site est accessible sur une URL `*.vercel.app`
- [ ] Le formulaire RSVP fonctionne sur l'URL publique

**Verify:** Ouvrir l'URL publique dans le navigateur → le site se charge et le formulaire est fonctionnel.

**Steps:**

- [ ] **Étape 1 : Se connecter à Vercel**

```bash
npx vercel login
```

Suivre les instructions (choisir "Continue with Email" ou GitHub).

- [ ] **Étape 2 : Déployer depuis le dossier site-invites/**

```bash
cd site-invites
npx vercel --prod
```

Répondre aux questions :
- "Set up and deploy?" → **Y**
- "Which scope?" → choisir votre compte
- "Link to existing project?" → **N**
- "What's your project's name?" → `mariage-catherine-nhusao` (ou autre)
- "In which directory is your code located?" → `.` (point, car on est déjà dans site-invites/)
- "Want to modify these settings?" → **N**

- [ ] **Étape 3 : Noter l'URL**

À la fin, Vercel affiche l'URL publique, ex : `https://mariage-catherine-nhusao.vercel.app`

- [ ] **Étape 4 : Tester sur l'URL publique**

Ouvrir l'URL → soumettre un RSVP test → vérifier dans Supabase que la ligne apparaît.

```json:metadata
{"files": [], "verifyCommand": "", "acceptanceCriteria": ["site accessible sur vercel.app", "formulaire fonctionne sur l'URL publique"], "requiresUserVerification": false}
```

---

## Résumé des étapes manuelles

1. Créer compte Supabase + projet + table `rsvp` (SQL fourni ci-dessus)
2. Copier `Project URL` et `anon key` dans `supabase-config.js`
3. Exécuter les tâches 1 à 5 ci-dessus
4. Partager l'URL `*.vercel.app` avec les invités
