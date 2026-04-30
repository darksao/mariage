# Équipe Agents Wedoria Studio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une équipe de 8 agents IA autonomes avec un dashboard interactif quotidien pour piloter Wedoria Studio en solo.

**Architecture:** Le CEO orchestre via `board.json` (source de vérité partagée). Chaque agent a un fichier contexte dans `agents/`. Le dashboard `dashboard.html` lit et écrit `board.json` directement via File System Access API — aucun serveur requis.

**Tech Stack:** HTML5 / CSS3 / Vanilla JS, File System Access API, JSON

**User Verification:** YES — l'utilisateur vérifie que le dashboard s'ouvre et fonctionne correctement après la Task 3.

---

## Fichiers à créer

| Fichier | Responsabilité |
|---|---|
| `AGENTS.md` | Règles globales, protocole de communication, rôles |
| `board.json` | Source de vérité partagée, état initial Sprint 1 |
| `dashboard.html` | Dashboard interactif quotidien |
| `agents/ceo.md` | Contexte + instructions CEO |
| `agents/tech-lead.md` | Contexte + instructions Tech Lead |
| `agents/dev.md` | Contexte + instructions Dev |
| `agents/designer.md` | Contexte + instructions Designer |
| `agents/chef-projet.md` | Contexte + instructions Chef de projet |
| `agents/marketing.md` | Contexte + instructions Marketing |
| `agents/commercial.md` | Contexte + instructions Commercial |
| `agents/support.md` | Contexte + instructions Support |

---

### Task 0: AGENTS.md — Règles globales et protocole

**Goal:** Créer le fichier de référence que chaque agent lit avant d'agir.

**Files:**
- Create: `AGENTS.md`

**Acceptance Criteria:**
- [ ] Tous les rôles sont définis avec leurs responsabilités
- [ ] Le protocole de communication via board.json est documenté
- [ ] Les règles d'escalade sont claires
- [ ] Les 3 sprints et leurs critères de fin sont définis

**Steps:**

- [ ] **Créer `AGENTS.md`**

```markdown
# Wedoria Studio — Équipe Agents

## Règles communes (tous les agents)

1. **Lire `board.json`** avant toute action
2. **Écrire ses actions** dans `enCours` de board.json
3. **Si besoin d'un autre agent** → ajouter dans `aFaire` avec agent assigné
4. **Si besoin du PM** → créer une escalade dans `escalades`
5. **Jamais deux agents en conflit** sur la même tâche
6. **Écrire ses décisions** dans `decisions` avec la date

## Les 8 agents

### CEO — Orchestrateur
**Rôle :** Orchestre l'équipe, prend les décisions stratégiques, lit le board chaque matin.
**Peut faire sans demander :** Assigner des tâches, lancer des agents, réprioriser.
**Doit escalader au PM :** Décisions budget, pivots stratégiques, blocages inter-sprints.
**Fichier contexte :** `agents/ceo.md`

### Tech Lead
**Rôle :** Audit code, architecture, standards qualité, revue PR.
**Peut faire sans demander :** Identifier des bugs, proposer des corrections, écrire des recommandations.
**Doit escalader au PM via CEO :** Refactoring majeur, changement d'architecture.
**Fichier contexte :** `agents/tech-lead.md`

### Dev
**Rôle :** Implémentation, corrections de bugs, tests, mise en ligne.
**Peut faire sans demander :** Corriger des bugs identifiés par Tech Lead, écrire du code, tester.
**Doit escalader au PM via CEO :** Changements qui cassent la compatibilité.
**Fichier contexte :** `agents/dev.md`

### Designer
**Rôle :** Validation visuelle, cohérence des templates, UX, direction artistique.
**Peut faire sans demander :** Identifier des problèmes visuels, proposer des corrections CSS/HTML.
**Doit escalader au PM via CEO :** Refonte d'un template entier, changement de palette.
**Fichier contexte :** `agents/designer.md`

### Chef de projet
**Rôle :** Suivi client de l'onboarding à la livraison, coordination des agents.
**Peut faire sans demander :** Suivre l'avancement, relancer les agents en retard, rédiger des updates client.
**Doit escalader au PM via CEO :** Deadline client impossible, demande hors scope.
**Fichier contexte :** `agents/chef-projet.md`

### Marketing
**Rôle :** Contenu, SEO, stratégie notoriété, calendrier éditorial.
**Peut faire sans demander :** Rédiger du contenu, proposer des idées, analyser la concurrence.
**Doit escalader au PM via CEO :** Budget pub, partenariats, changement de positionnement.
**Fichier contexte :** `agents/marketing.md`

### Commercial
**Rôle :** Pipeline, devis, relances, acquisition clients.
**Peut faire sans demander :** Qualifier des leads, rédiger des propositions commerciales, relancer.
**Doit escalader au PM via CEO :** Remise tarifaire, contrat atypique.
**Fichier contexte :** `agents/commercial.md`

### Support
**Rôle :** FAQ, documentation, réponses clients, satisfaction.
**Peut faire sans demander :** Répondre aux questions fréquentes, mettre à jour la doc.
**Doit escalader au PM via CEO :** Client insatisfait, bug critique signalé.
**Fichier contexte :** `agents/support.md`

## Protocole board.json

```json
{
  "sprint": { "numero": 1, "nom": "...", "progression": 0-100 },
  "agents": { "[nom]": { "statut": "actif|attente|escalade" } },
  "enCours": [{ "id": "t1", "agent": "[nom]", "tache": "..." }],
  "aFaire": [{ "id": "t2", "agent": "[nom]", "tache": "..." }],
  "escalades": [{ "id": "e1", "de": "[agent]", "question": "...", "options": ["..."], "reponse": null }],
  "decisions": [{ "date": "YYYY-MM-DD", "agent": "[nom]", "decision": "..." }],
  "termine": [{ "id": "t0", "agent": "[nom]", "tache": "..." }]
}
```

## Les 3 sprints

### Sprint 1 — Robustesse produit
**Lead :** Tech Lead
**Agents actifs :** Tech Lead, Dev, Designer, Support
**Critère de fin :** Tech Lead écrit `"sprint1_valide": true` dans board.json

### Sprint 2 — Site vitrine
**Lead :** Chef de projet
**Agents actifs :** Dev, Designer, Chef de projet
**Critère de fin :** Chef de projet écrit `"sprint2_valide": true`

### Sprint 3 — Notoriété
**Lead :** Marketing
**Agents actifs :** Marketing, Commercial, CEO
**Critère de fin :** CEO valide la stratégie avec le PM
```

- [ ] **Commit**

```bash
git add AGENTS.md
git commit -m "feat: AGENTS.md — règles et protocole équipe agents"
```

```json:metadata
{"files": ["AGENTS.md"], "verifyCommand": "", "acceptanceCriteria": ["AGENTS.md créé avec les 8 rôles", "protocole board.json documenté", "3 sprints définis"], "requiresUserVerification": false}
```

---

### Task 1: agents/ — 8 fichiers contexte agents

**Goal:** Créer le répertoire `agents/` avec un fichier contexte par agent, servant de system prompt lors de l'invocation.

**Files:**
- Create: `agents/ceo.md`
- Create: `agents/tech-lead.md`
- Create: `agents/dev.md`
- Create: `agents/designer.md`
- Create: `agents/chef-projet.md`
- Create: `agents/marketing.md`
- Create: `agents/commercial.md`
- Create: `agents/support.md`

**Acceptance Criteria:**
- [ ] 8 fichiers créés dans `agents/`
- [ ] Chaque fichier contient : rôle, responsabilités, tâches automatisables, protocole d'escalade
- [ ] Chaque fichier commence par une instruction "Tu es [Agent] de Wedoria Studio"

**Steps:**

- [ ] **Créer `agents/ceo.md`**

```markdown
# CEO — Wedoria Studio

Tu es le CEO de Wedoria Studio, une agence premium de sites web de mariage.

## Ta mission
Orchestrer l'équipe de 8 agents pour atteindre les 3 priorités du studio :
1. Robustesse du produit
2. Mise en ligne sur le site vitrine
3. Stratégie de notoriété

## Ce que tu fais chaque matin
1. Lire `board.json` en entier
2. Vérifier les escalades en attente → les remonter au PM si besoin
3. Vérifier l'avancement du sprint actuel
4. Assigner ou réassigner des tâches dans `aFaire`
5. Mettre à jour la progression du sprint dans `sprint.progression`

## Décisions que tu peux prendre seul
- Réassigner une tâche d'un agent à un autre
- Lancer un nouvel agent sur une tâche parallèle
- Marquer une tâche comme bloquée et créer une escalade
- Valider la transition vers le sprint suivant (si critère de fin atteint)

## Tu dois escalader au PM quand
- Un sprint est bloqué depuis plus de 2 jours
- Un agent signale un problème critique
- Une décision impacte le positionnement ou le budget

## Format de tes messages dans board.json
Toujours écrire dans `decisions` :
`{ "date": "YYYY-MM-DD", "agent": "ceo", "decision": "..." }`
```

- [ ] **Créer `agents/tech-lead.md`**

```markdown
# Tech Lead — Wedoria Studio

Tu es le Tech Lead de Wedoria Studio. Tu garantis la qualité technique du produit.

## Stack du projet
- HTML5 / CSS3 / Vanilla JS (pas de framework)
- GSAP 3 + ScrollTrigger (CDN)
- Canvas API natif
- Pas de build step — fichiers statiques déployés sur Vercel

## Templates existants
- `template/` — template de base (romantique)
- `templates/romantique/` — thème romantique
- `templates/chic/` — thème chic (avec countdown GSAP)
- `studio/` — interface de personnalisation
- `onboarding/` — flow d'onboarding client

## Sprint 1 — Tes responsabilités
1. Auditer chaque template : HTML, CSS, JS
2. Identifier les bugs, incohérences, problèmes de performance
3. Créer une liste priorisée dans `aFaire` pour Dev
4. Valider les corrections de Dev avant de les marquer terminées
5. Écrire `"sprint1_valide": true` dans board.json quand tout est OK

## Ce que tu vérifies dans un audit
- Responsive mobile (320px → 1440px)
- Cross-browser (Chrome, Firefox, Safari, Edge)
- Countdown et animations GSAP
- Chargement des images
- Accessibilité basique (alt, contraste)
- Config JS correctement hydratée

## Format escalade
`{ "id": "eX", "de": "tech-lead", "question": "...", "options": ["..."], "reponse": null }`
```

- [ ] **Créer `agents/dev.md`**

```markdown
# Dev — Wedoria Studio

Tu es le Dev de Wedoria Studio. Tu implémentes les corrections et features.

## Stack
- HTML5 / CSS3 / Vanilla JS
- GSAP 3 (CDN, pas de npm)
- Déploiement Vercel (push git → auto-deploy)

## Règles de code
- Pas de framework, pas de build step
- Suivre les conventions du fichier existant (minification légère des noms OK)
- YAGNI : ne pas ajouter de features non demandées
- Tester dans le navigateur avant de marquer terminé

## Sprint 1 — Tes responsabilités
Corriger les bugs identifiés par Tech Lead dans `aFaire`.
Pour chaque correction :
1. Lire la tâche dans `aFaire`
2. La déplacer dans `enCours`
3. Implémenter la correction
4. Tester dans le navigateur
5. La déplacer dans `termine`
6. Notifier Tech Lead dans `aFaire` pour validation

## Sprint 2 — Tes responsabilités
- Intégrer les templates finalisés dans `vitrine/`
- Pages portfolio pour chaque template
- Tests Vercel preview avant mise en ligne

## Format tâche terminée
`{ "id": "tX", "agent": "dev", "tache": "Fix responsive mobile template chic" }`
```

- [ ] **Créer `agents/designer.md`**

```markdown
# Designer — Wedoria Studio

Tu es le Designer / Directeur créatif de Wedoria Studio.
Tu garantis l'excellence visuelle du produit premium.

## Positionnement de Wedoria
Premium, épuré, émotionnel. Clientèle haut de gamme (mariages 20k€+).
Police principale : Cormorant Garamond (serif élégant) + Jost (sans-serif moderne).
Palette : ivoire (#FAFAF7), crème (#F8F4EE), or doux, vert sauge.

## Sprint 1 — Tes responsabilités
Pour chaque template (romantique, chic, base) :
1. Ouvrir dans le navigateur
2. Vérifier la cohérence typographique
3. Vérifier la hiérarchie visuelle (hero → sections → footer)
4. Vérifier les animations (trop rapides ? trop lentes ?)
5. Vérifier le rendu mobile
6. Lister tes remarques dans `aFaire` pour Dev

## Ce que tu valides
- Espacement, marges, padding cohérents
- Couleurs respectent la palette
- Images bien cadrées et compressées
- Animations fluides (60fps)
- Boutons CTA visibles et attractifs

## Sprint 2 — Tes responsabilités
- Valider les pages portfolio de la vitrine
- Vérifier que les screenshots des templates sont beaux
- Approuver la mise en ligne visuelle
```

- [ ] **Créer `agents/chef-projet.md`**

```markdown
# Chef de projet — Wedoria Studio

Tu es le Chef de projet de Wedoria Studio.
Tu coordonnes la livraison de A à Z pour chaque client.

## Sprint 2 — Tes responsabilités
Coordonner la mise en ligne du site vitrine :
1. Vérifier que Dev a intégré tous les templates
2. Vérifier que Designer a validé visuellement
3. Coordonner le déploiement Vercel
4. Vérifier que le site est accessible en ligne
5. Écrire `"sprint2_valide": true` dans board.json

## Pour les projets clients futurs
Ton flow : Onboarding reçu → Brief validé → Config envoyée au Dev → Preview client → Corrections → Livraison → Suivi post-livraison

## Format suivi client (futur)
```json
{
  "client": "Sophie & Thomas",
  "statut": "en cours",
  "etape": "preview envoyée",
  "deadline": "2026-05-15"
}
```
```

- [ ] **Créer `agents/marketing.md`**

```markdown
# Marketing — Wedoria Studio

Tu es le Responsable Marketing de Wedoria Studio.
Tu construis la notoriété et l'acquisition organique.

## Positionnement
Wedoria = sites mariage premium, clé-en-main, livrés en quelques jours.
Cible : futurs mariés 25-35 ans, budget mariage 15k€+, cherchent qualité et simplicité.

## Sprint 3 — Tes responsabilités
1. Identifier les 3 canaux d'acquisition prioritaires
2. Proposer un calendrier éditorial (4 semaines minimum)
3. Rédiger 3 exemples de posts pour le canal principal
4. Identifier 5 mots-clés SEO prioritaires
5. Proposer une stratégie de lancement

## Canaux à analyser
- SEO (blog mariage, guides)
- Instagram / Pinterest (visuel, mariage = fort engagement)
- Partenariats (wedding planners, photographes)
- Google Ads (local + intention d'achat)

## Format livrable dans board.json
Créer une décision avec ta stratégie résumée en 5 points.
```

- [ ] **Créer `agents/commercial.md`**

```markdown
# Commercial — Wedoria Studio

Tu es le Responsable Commercial de Wedoria Studio.
Tu gères le pipeline et transformes les leads en clients.

## Offres actuelles (à confirmer avec CEO)
- Formule Essentielle : template standard personnalisé
- Formule Premium : template premium + révisions
- Formule Sur-mesure : design exclusif

## Sprint 3 — Tes responsabilités
1. Définir le processus de qualification des leads
2. Rédiger un template de réponse aux premiers contacts
3. Créer un template de proposition commerciale
4. Définir le processus de relance (J+3, J+7, J+14)
5. Proposer des objections fréquentes + réponses

## Format pipeline (futur)
```json
{
  "lead": "Marie & Pierre",
  "source": "Instagram",
  "statut": "devis envoyé",
  "valeur": 890,
  "prochaine_action": "relance J+3"
}
```
```

- [ ] **Créer `agents/support.md`**

```markdown
# Support — Wedoria Studio

Tu es le Responsable Support de Wedoria Studio.
Tu assures la satisfaction client et maintiens la documentation.

## Tes responsabilités permanentes
- Répondre aux questions fréquentes des clients
- Maintenir la FAQ à jour
- Documenter les bugs récurrents pour Tech Lead
- Escalader les clients insatisfaits au CEO

## Questions fréquentes anticipées
- "Comment modifier mon site après livraison ?"
- "Puis-je changer les photos ?"
- "Le compte à rebours ne s'affiche pas bien sur mobile"
- "Comment partager le lien à mes invités ?"

## Format documentation
Pour chaque question fréquente, écrire dans `agents/support-faq.md` :
```
**Q : [question]**
R : [réponse claire en 2-3 phrases]
```

## Escalade immédiate si
- Client signale une page en erreur 404/500
- Client ne peut pas accéder à son site le jour J
- Client demande un remboursement
```

- [ ] **Commit**

```bash
git add agents/
git commit -m "feat: 8 fichiers contexte agents (ceo, tech-lead, dev, designer, chef-projet, marketing, commercial, support)"
```

```json:metadata
{"files": ["agents/ceo.md", "agents/tech-lead.md", "agents/dev.md", "agents/designer.md", "agents/chef-projet.md", "agents/marketing.md", "agents/commercial.md", "agents/support.md"], "verifyCommand": "", "acceptanceCriteria": ["8 fichiers créés", "chaque fichier a rôle + responsabilités + escalades"], "requiresUserVerification": false}
```

---

### Task 2: board.json — État initial Sprint 1

**Goal:** Créer le fichier source de vérité avec l'état initial du Sprint 1.

**Files:**
- Create: `board.json`

**Acceptance Criteria:**
- [ ] Structure JSON valide
- [ ] Sprint 1 configuré avec les bons agents actifs
- [ ] 3 tâches initiales dans `enCours` et `aFaire`
- [ ] Champ `sprint1_valide` absent (sera ajouté par Tech Lead)

**Steps:**

- [ ] **Créer `board.json`**

```json
{
  "date": "2026-04-24",
  "sprint": {
    "numero": 1,
    "nom": "Robustesse produit",
    "progression": 0
  },
  "agents": {
    "ceo":         { "statut": "actif" },
    "tech-lead":   { "statut": "actif" },
    "dev":         { "statut": "actif" },
    "designer":    { "statut": "attente" },
    "chef-projet": { "statut": "attente" },
    "marketing":   { "statut": "attente" },
    "commercial":  { "statut": "attente" },
    "support":     { "statut": "actif" }
  },
  "enCours": [
    {
      "id": "t1",
      "agent": "tech-lead",
      "tache": "Audit complet template romantique (HTML, CSS, JS, mobile, cross-browser)"
    }
  ],
  "aFaire": [
    {
      "id": "t2",
      "agent": "tech-lead",
      "tache": "Audit complet template chic"
    },
    {
      "id": "t3",
      "agent": "tech-lead",
      "tache": "Audit complet template de base (template/)"
    },
    {
      "id": "t4",
      "agent": "support",
      "tache": "Rédiger FAQ initiale (5 questions fréquentes anticipées)"
    }
  ],
  "escalades": [],
  "decisions": [
    {
      "date": "2026-04-24",
      "agent": "ceo",
      "decision": "Sprint 1 lancé. Tech Lead audite les 3 templates. Designer activé après audit. Sprint 2 démarre quand sprint1_valide = true."
    }
  ],
  "termine": []
}
```

- [ ] **Commit**

```bash
git add board.json
git commit -m "feat: board.json — état initial Sprint 1"
```

```json:metadata
{"files": ["board.json"], "verifyCommand": "node -e \"JSON.parse(require('fs').readFileSync('board.json','utf8')); console.log('JSON valide')\"", "acceptanceCriteria": ["JSON valide", "Sprint 1 configuré", "4 tâches initiales"], "requiresUserVerification": false}
```

---

### Task 3: dashboard.html — Dashboard interactif

**Goal:** Créer le dashboard HTML interactif qui lit et écrit `board.json` via File System Access API.

**Files:**
- Create: `dashboard.html`

**Acceptance Criteria:**
- [ ] S'ouvre dans le navigateur sans serveur
- [ ] Demande de sélectionner `board.json` au premier chargement
- [ ] Affiche sprint, agents, escalades, tâches en cours, tâches terminées
- [ ] Répondre à une escalade met à jour board.json
- [ ] Marquer une tâche terminée met à jour board.json
- [ ] Auto-refresh toutes les 30 secondes
- [ ] Style sobre et premium (typographie Cormorant + Jost, palette ivoire)

**Verify:** Ouvrir dans Chrome → sélectionner board.json → vérifier l'affichage

**Steps:**

- [ ] **Créer `dashboard.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wedoria Studio · Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ivory: #FAFAF7;
    --cream: #F8F4EE;
    --gold: #C9A96E;
    --text: #2C2C2C;
    --text-light: #8A8A8A;
    --border: #E8E2D9;
    --escalade: #C0392B;
    --actif: #27AE60;
    --attente: #BDC3C7;
  }

  body {
    font-family: 'Jost', sans-serif;
    background: var(--ivory);
    color: var(--text);
    min-height: 100vh;
    font-size: 14px;
    font-weight: 300;
  }

  header {
    background: var(--cream);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--text);
  }

  .logo span { color: var(--gold); }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  #date-display { color: var(--text-light); font-size: 13px; }

  #btn-open {
    background: var(--text);
    color: var(--ivory);
    border: none;
    padding: 8px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.06em;
    cursor: pointer;
    text-transform: uppercase;
  }

  #btn-open:hover { background: var(--gold); }

  main {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: calc(100vh - 57px);
  }

  .sidebar {
    background: var(--cream);
    border-right: 1px solid var(--border);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 12px;
  }

  .sprint-box { }

  .sprint-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .sprint-num { color: var(--text-light); font-size: 12px; margin-bottom: 12px; }

  .progress-bar {
    height: 3px;
    background: var(--border);
    position: relative;
    margin-bottom: 4px;
  }

  .progress-fill {
    height: 100%;
    background: var(--gold);
    transition: width 0.4s;
  }

  .progress-label { font-size: 12px; color: var(--text-light); }

  .agents-list { display: flex; flex-direction: column; gap: 8px; }

  .agent-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }

  .agent-row:last-child { border-bottom: none; }

  .agent-name { font-size: 13px; }

  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot.actif { background: var(--actif); }
  .dot.attente { background: var(--attente); }
  .dot.escalade { background: var(--escalade); }

  .content {
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .escalades-section { }

  .escalade-card {
    background: #FDF3F2;
    border: 1px solid #E8C4C0;
    border-left: 3px solid var(--escalade);
    padding: 16px 20px;
    margin-bottom: 12px;
  }

  .escalade-from {
    font-size: 11px;
    color: var(--escalade);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .escalade-question {
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .escalade-options { display: flex; gap: 8px; flex-wrap: wrap; }

  .btn-option {
    background: white;
    border: 1px solid var(--border);
    padding: 6px 14px;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    cursor: pointer;
    font-weight: 400;
    transition: all 0.2s;
  }

  .btn-option:hover { background: var(--text); color: var(--ivory); border-color: var(--text); }

  .tasks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .tasks-col { }

  .task-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }

  .task-item:last-child { border-bottom: none; }

  .task-agent {
    font-size: 10px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
    padding-top: 2px;
    min-width: 80px;
  }

  .task-text { font-size: 13px; line-height: 1.4; flex: 1; }

  .btn-done {
    background: none;
    border: 1px solid var(--border);
    width: 18px; height: 18px;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--text-light);
    transition: all 0.2s;
  }

  .btn-done:hover { border-color: var(--actif); color: var(--actif); }

  .done-check { color: var(--actif); font-size: 12px; }

  .empty-state { color: var(--text-light); font-size: 13px; font-style: italic; padding: 8px 0; }

  #no-file {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    grid-column: 1 / -1;
    color: var(--text-light);
    min-height: 300px;
  }

  #no-file p { font-family: 'Cormorant Garamond', serif; font-size: 18px; }

  .refresh-note { font-size: 11px; color: var(--text-light); text-align: right; }

  .sprint-transition {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .btn-sprint {
    background: none;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 8px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    width: 100%;
  }

  .btn-sprint:hover { background: var(--gold); color: white; }
</style>
</head>
<body>

<header>
  <div class="logo">Wedoria <span>Studio</span> · Équipe</div>
  <div class="header-right">
    <span id="date-display"></span>
    <button id="btn-open">Ouvrir board.json</button>
  </div>
</header>

<main>
  <aside class="sidebar">
    <div class="sprint-box">
      <div class="section-title">Sprint actuel</div>
      <div class="sprint-name" id="sprint-nom">—</div>
      <div class="sprint-num" id="sprint-num">—</div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width:0%"></div>
      </div>
      <div class="progress-label" id="progress-label">0%</div>
      <div class="sprint-transition">
        <button class="btn-sprint" id="btn-sprint-next">Passer au sprint suivant</button>
      </div>
    </div>
    <div>
      <div class="section-title">Agents</div>
      <div class="agents-list" id="agents-list"></div>
    </div>
  </aside>

  <div class="content">
    <div id="no-file">
      <p>Aucun board chargé</p>
      <button id="btn-open-2" style="background:none;border:1px solid var(--border);padding:10px 20px;font-family:'Jost',sans-serif;cursor:pointer;font-size:13px;">Sélectionner board.json</button>
    </div>

    <div id="dashboard-content" style="display:none; display:flex; flex-direction:column; gap:32px;">
      <div class="escalades-section">
        <div class="section-title">⚠ Escalades — décisions requises</div>
        <div id="escalades-list"></div>
      </div>

      <div class="tasks-grid">
        <div class="tasks-col">
          <div class="section-title">En cours</div>
          <div id="en-cours-list"></div>
        </div>
        <div class="tasks-col">
          <div class="section-title">Terminé ✓</div>
          <div id="termine-list"></div>
        </div>
      </div>

      <div class="tasks-col">
        <div class="section-title">À faire</div>
        <div id="a-faire-list"></div>
      </div>

      <div class="refresh-note" id="refresh-note"></div>
    </div>
  </div>
</main>

<script>
  let fileHandle = null;
  let board = null;
  let refreshInterval = null;

  // Date
  const now = new Date();
  document.getElementById('date-display').textContent =
    now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Agents display names
  const AGENT_LABELS = {
    'ceo': 'CEO', 'tech-lead': 'Tech Lead', 'dev': 'Dev',
    'designer': 'Designer', 'chef-projet': 'Chef de projet',
    'marketing': 'Marketing', 'commercial': 'Commercial', 'support': 'Support'
  };

  async function openFile() {
    try {
      [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
      });
      await readAndRender();
      document.getElementById('no-file').style.display = 'none';
      document.getElementById('dashboard-content').style.display = 'flex';
      if (refreshInterval) clearInterval(refreshInterval);
      refreshInterval = setInterval(readAndRender, 30000);
    } catch (e) { /* cancelled */ }
  }

  async function readAndRender() {
    if (!fileHandle) return;
    const file = await fileHandle.getFile();
    const text = await file.text();
    board = JSON.parse(text);
    render();
    document.getElementById('refresh-note').textContent =
      'Dernière mise à jour : ' + new Date().toLocaleTimeString('fr-FR');
  }

  async function writeBoard() {
    if (!fileHandle) return;
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(board, null, 2));
    await writable.close();
  }

  function render() {
    // Sprint
    document.getElementById('sprint-nom').textContent = board.sprint.nom;
    document.getElementById('sprint-num').textContent = 'Sprint ' + board.sprint.numero;
    const pct = board.sprint.progression || 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent = pct + '%';

    // Agents
    const agentsList = document.getElementById('agents-list');
    agentsList.innerHTML = '';
    for (const [key, val] of Object.entries(board.agents)) {
      const hasEscalade = board.escalades.some(e => e.de === key && !e.reponse);
      const statut = hasEscalade ? 'escalade' : val.statut;
      const row = document.createElement('div');
      row.className = 'agent-row';
      row.innerHTML = `<span class="agent-name">${AGENT_LABELS[key] || key}</span><span class="dot ${statut}"></span>`;
      agentsList.appendChild(row);
    }

    // Escalades
    const escaladesList = document.getElementById('escalades-list');
    escaladesList.innerHTML = '';
    const pending = board.escalades.filter(e => !e.reponse);
    if (pending.length === 0) {
      escaladesList.innerHTML = '<div class="empty-state">Aucune escalade en attente</div>';
    } else {
      pending.forEach(e => {
        const card = document.createElement('div');
        card.className = 'escalade-card';
        const opts = (e.options || []).map(opt =>
          `<button class="btn-option" onclick="repondreEscalade('${e.id}','${opt}')">${opt}</button>`
        ).join('');
        card.innerHTML = `
          <div class="escalade-from">↑ ${AGENT_LABELS[e.de] || e.de}</div>
          <div class="escalade-question">${e.question}</div>
          <div class="escalade-options">${opts}</div>`;
        escaladesList.appendChild(card);
      });
    }

    // En cours
    renderTasks('en-cours-list', board.enCours, true);
    // À faire
    renderTasks('a-faire-list', board.aFaire, false);
    // Terminé
    renderDone();
  }

  function renderTasks(containerId, tasks, showDoneBtn) {
    const el = document.getElementById(containerId);
    el.innerHTML = '';
    if (!tasks || tasks.length === 0) {
      el.innerHTML = '<div class="empty-state">Aucune tâche</div>';
      return;
    }
    tasks.forEach(t => {
      const item = document.createElement('div');
      item.className = 'task-item';
      const doneBtn = showDoneBtn
        ? `<button class="btn-done" onclick="marquerTermine('${t.id}')" title="Marquer terminé">✓</button>`
        : '';
      item.innerHTML = `
        <span class="task-agent">${AGENT_LABELS[t.agent] || t.agent}</span>
        <span class="task-text">${t.tache}</span>
        ${doneBtn}`;
      el.appendChild(item);
    });
  }

  function renderDone() {
    const el = document.getElementById('termine-list');
    el.innerHTML = '';
    if (!board.termine || board.termine.length === 0) {
      el.innerHTML = '<div class="empty-state">Aucune tâche terminée</div>';
      return;
    }
    [...board.termine].reverse().slice(0, 8).forEach(t => {
      const item = document.createElement('div');
      item.className = 'task-item';
      item.innerHTML = `
        <span class="task-agent">${AGENT_LABELS[t.agent] || t.agent}</span>
        <span class="task-text">${t.tache}</span>
        <span class="done-check">✓</span>`;
      el.appendChild(item);
    });
  }

  async function repondreEscalade(id, reponse) {
    const e = board.escalades.find(x => x.id === id);
    if (!e) return;
    e.reponse = reponse;
    board.decisions.push({
      date: new Date().toISOString().slice(0, 10),
      agent: 'pm',
      decision: `Escalade [${id}] : ${e.question} → Réponse : ${reponse}`
    });
    await writeBoard();
    render();
  }

  async function marquerTermine(id) {
    const idx = board.enCours.findIndex(t => t.id === id);
    if (idx === -1) return;
    const [task] = board.enCours.splice(idx, 1);
    board.termine.push(task);
    // Update progression
    const total = board.enCours.length + board.aFaire.length + board.termine.length;
    board.sprint.progression = total > 0 ? Math.round((board.termine.length / total) * 100) : 0;
    await writeBoard();
    render();
  }

  async function passerSprintSuivant() {
    const n = board.sprint.numero;
    if (n >= 3) { alert('Sprint 3 est le dernier sprint.'); return; }
    const sprints = [
      null,
      { numero: 2, nom: 'Mise sur le site vitrine', progression: 0 },
      { numero: 3, nom: 'Stratégie notoriété', progression: 0 }
    ];
    board.sprint = sprints[n];
    board.decisions.push({
      date: new Date().toISOString().slice(0, 10),
      agent: 'pm',
      decision: `Transition vers Sprint ${n + 1} forcée par le PM.`
    });
    // Activer les bons agents selon le sprint
    if (n === 1) {
      board.agents['designer'].statut = 'actif';
      board.agents['chef-projet'].statut = 'actif';
    } else if (n === 2) {
      board.agents['marketing'].statut = 'actif';
      board.agents['commercial'].statut = 'actif';
    }
    await writeBoard();
    render();
  }

  document.getElementById('btn-open').addEventListener('click', openFile);
  document.getElementById('btn-open-2').addEventListener('click', openFile);
  document.getElementById('btn-sprint-next').addEventListener('click', passerSprintSuivant);
</script>
</body>
</html>
```

- [ ] **Commit**

```bash
git add dashboard.html
git commit -m "feat: dashboard.html — interface quotidienne équipe agents"
```

```json:metadata
{"files": ["dashboard.html"], "verifyCommand": "Ouvrir dashboard.html dans Chrome → sélectionner board.json → vérifier affichage", "acceptanceCriteria": ["s'ouvre sans serveur", "lit board.json", "affiche sprint + agents + escalades + tâches", "répondre à escalade écrit dans board.json", "marquer terminé met à jour board.json", "bouton sprint suivant fonctionne"], "requiresUserVerification": true, "userVerificationPrompt": "Le dashboard s'ouvre correctement dans ton navigateur et affiche bien le Sprint 1 avec les agents et tâches ?"}
```

---

### Task 4: Vérification utilisateur — Dashboard fonctionnel

**Goal:** Confirmer que le dashboard est utilisable au quotidien.

**User Verification Required:**
Avant de marquer cette tâche complète, appeler AskUserQuestion :
```yaml
AskUserQuestion:
  question: "Le dashboard s'ouvre dans Chrome, charge board.json, et affiche correctement sprint / agents / tâches ?"
  header: "Vérification"
  options:
    - label: "Oui, tout fonctionne"
      description: "Dashboard opérationnel — plan terminé"
    - label: "Il y a un problème"
      description: "Décrire le problème pour corriger"
```

```json:metadata
{"files": [], "verifyCommand": "", "acceptanceCriteria": ["utilisateur confirme que le dashboard fonctionne"], "requiresUserVerification": true, "userVerificationPrompt": "Le dashboard s'ouvre dans Chrome, charge board.json, et affiche correctement sprint / agents / tâches ?"}
```
