# Wedoria Studio — Équipe Agents · Design Spec
**Date :** 2026-04-24  
**Statut :** Approuvé

---

## Contexte & Objectif

Créer une équipe de 8 agents IA autonomes pour piloter Wedoria Studio en solo (PM).  
Les agents communiquent via un fichier partagé, s'orchestrent entre eux, et remontent les décisions stratégiques au PM via un dashboard interactif.

**3 priorités dans l'ordre :**
1. Robustesse du produit (templates, code, QA)
2. Mise en ligne sur le site vitrine
3. Stratégie de notoriété

---

## Architecture générale

```
wedoria-studio/
├── AGENTS.md              ← définition des rôles, règles, protocole
├── board.json             ← source de vérité partagée (agents + dashboard)
├── dashboard.html         ← dashboard interactif quotidien
└── agents/
    ├── ceo.md
    ├── tech-lead.md
    ├── dev.md
    ├── designer.md
    ├── chef-projet.md
    ├── marketing.md
    ├── commercial.md
    └── support.md
```

---

## Section 1 — Les 8 agents

| Agent | Rôle | Lead sprint |
|---|---|---|
| **CEO** | Orchestrateur central, décisions stratégiques | Tous |
| **Tech Lead** | Audit code, standards qualité, architecture | Sprint 1 |
| **Dev** | Implémentation, tests, corrections bugs | Sprint 1 & 2 |
| **Designer** | Validation visuelle, cohérence templates, UX | Sprint 1 & 2 |
| **Chef de projet** | Suivi client onboarding → livraison | Sprint 2 |
| **Marketing** | Contenu, SEO, stratégie notoriété | Sprint 3 |
| **Commercial** | Pipeline, devis, relances, acquisition | Sprint 3 |
| **Support** | FAQ, documentation, réponses clients | Permanent |

### Règles communes à tous les agents
1. Lire `board.json` avant d'agir
2. Écrire ses actions dans `board.json` (section `enCours`)
3. Si besoin d'un autre agent → ajouter dans `aFaire` avec agent assigné
4. Si besoin du PM → créer une escalade dans `escalades`
5. Jamais deux agents en conflit sur la même tâche

### CEO — Orchestrateur
- Lit le board chaque matin (simulé au démarrage d'une session Claude)
- Assigne les tâches selon les priorités du sprint
- Peut lancer plusieurs agents en parallèle
- Valide les transitions entre sprints
- Escalade au PM uniquement les décisions stratégiques

---

## Section 2 — Communication via board.json

### Structure du fichier

```json
{
  "date": "2026-04-24",
  "sprint": {
    "numero": 1,
    "nom": "Robustesse produit",
    "progression": 0
  },
  "agents": {
    "ceo":          { "statut": "actif" },
    "tech-lead":    { "statut": "actif" },
    "dev":          { "statut": "actif" },
    "designer":     { "statut": "attente" },
    "chef-projet":  { "statut": "attente" },
    "marketing":    { "statut": "attente" },
    "commercial":   { "statut": "attente" },
    "support":      { "statut": "actif" }
  },
  "enCours": [
    { "id": "t1", "agent": "tech-lead", "tache": "Audit code template romantique" },
    { "id": "t2", "agent": "dev", "tache": "Fix bug countdown chic template" }
  ],
  "aFaire": [
    { "id": "t3", "agent": "designer", "tache": "Validation visuelle 3 templates" }
  ],
  "escalades": [
    {
      "id": "e1",
      "de": "ceo",
      "question": "Faut-il corriger le bug X avant mise en ligne, ou livrer quand même ?",
      "options": ["Corriger d'abord", "Livrer maintenant", "Différer"],
      "reponse": null
    }
  ],
  "decisions": [
    { "date": "2026-04-24", "agent": "ceo", "decision": "Sprint 2 démarre quand Tech Lead valide la robustesse" }
  ],
  "termine": [
    { "id": "t0", "agent": "dev", "tache": "Fix responsive mobile template chic" }
  ]
}
```

### Protocole de transition de sprint
- Sprint 1 → Sprint 2 : Tech Lead écrit `"sprint1_valide": true` dans board.json, CEO lance Designer + Chef de projet
- Sprint 2 → Sprint 3 : Chef de projet écrit `"sprint2_valide": true`, CEO lance Marketing + Commercial
- Le PM peut forcer une transition via le dashboard

---

## Section 3 — Dashboard interactif

### Fichier : `dashboard.html`

Page HTML locale, ouverte quotidiennement dans le navigateur. Style Wedoria (sobre, premium).

### Layout

```
┌─────────────────────────────────────────────────┐
│  WEDORIA STUDIO · Équipe agents     [date]       │
├──────────────────┬──────────────────────────────┤
│  SPRINT ACTUEL   │  ⚠️ ESCALADES                 │
│  Nom du sprint   │  Question + boutons d'action  │
│  Barre de prog.  │                               │
├──────────────────┤                               │
│  AGENTS          ├──────────────────────────────┤
│  · CEO      ●    │  EN COURS                    │
│  · Tech Lead ●   │  Liste des tâches actives     │
│  · Dev      ●    │                              │
│  · Designer  ○   │  TERMINÉ ✅                  │
│  · Marketing ○   │  Liste des tâches finies      │
│  · Support   ●   │                              │
└──────────────────┴──────────────────────────────┘
```

`●` actif · `○` en attente · `⚠` escalade

### Interactions possibles
- **Répondre aux escalades** : boutons d'action → écrit la réponse dans `board.json`
- **Marquer une tâche terminée** : click sur une tâche en cours → déplace vers `termine`
- **Forcer transition de sprint** : bouton "Passer au sprint suivant"
- **Voir le log** : historique des décisions prises

### Lecture/écriture de board.json
Utilise l'API File System Access du navigateur (pas de serveur requis) :
- Au chargement : `showOpenFilePicker` → l'utilisateur sélectionne `board.json` une fois
- Ensuite : lecture/écriture directe, auto-refresh toutes les 30 secondes

---

## Section 4 — Contenu des fichiers agents

Chaque fichier `agents/[nom].md` contient :
- Le rôle et les responsabilités
- Les tâches automatisables (ce que l'agent peut faire sans demander)
- Les tâches qui nécessitent validation
- Le protocole d'escalade spécifique au rôle
- La mémoire des décisions passées le concernant

Ces fichiers servent de contexte système quand Claude incarne l'agent.

---

## Section 5 — Les 3 sprints

### Sprint 1 — Robustesse produit
**Lead :** Tech Lead  
**Agents actifs :** Tech Lead, Dev, Designer, Support  
**Objectifs :**
- Audit complet du code (templates romantique, chic, + template de base)
- Identification et correction des bugs
- Validation visuelle cross-browser et mobile
- Documentation des composants

**Critère de fin :** Tech Lead valide dans board.json

### Sprint 2 — Mise sur le site vitrine
**Lead :** Chef de projet  
**Agents actifs :** Dev, Designer, Chef de projet  
**Objectifs :**
- Intégrer les templates finalisés dans la vitrine Wedoria
- Pages de présentation de chaque template (portfolio)
- Tests de performance et accessibilité
- Mise en ligne sur Vercel

**Critère de fin :** Chef de projet valide la mise en ligne

### Sprint 3 — Stratégie notoriété
**Lead :** Marketing  
**Agents actifs :** Marketing, Commercial, CEO  
**Objectifs :**
- Définir les canaux d'acquisition prioritaires
- Calendrier éditorial (contenu SEO, réseaux)
- Plan de prospection commerciale
- Métriques de suivi

**Critère de fin :** CEO valide la stratégie au PM

---

## Fichiers à créer

| Fichier | Description |
|---|---|
| `AGENTS.md` | Règles globales de l'équipe |
| `board.json` | Board initial (Sprint 1, tous agents définis) |
| `dashboard.html` | Dashboard interactif |
| `agents/ceo.md` | Contexte CEO |
| `agents/tech-lead.md` | Contexte Tech Lead |
| `agents/dev.md` | Contexte Dev |
| `agents/designer.md` | Contexte Designer |
| `agents/chef-projet.md` | Contexte Chef de projet |
| `agents/marketing.md` | Contexte Marketing |
| `agents/commercial.md` | Contexte Commercial |
| `agents/support.md` | Contexte Support |
