# Sprint 4 — Lancement public & Premier client

**Date :** 2026-05-16
**Durée :** Pas de deadline fixe — on avance jusqu'au premier client signé
**Critère de fin :** 1 client signé au tarif plein + site livré + témoignage collecté

## Contexte

Les 3 premiers sprints sont terminés :
- Produit robuste (3 templates, E2E fonctionnel)
- Vitrine live sur wedoria-darksaos-projects.vercel.app
- Stratégie marketing + process commercial définis mais non activés
- 0 clients, 0 leads, 0 présence sociale

Sprint 4 = passer de "prêt à lancer" à "premiers vrais clients", canaux froids uniquement (pas de réseau perso), tarif plein dès le départ.

## Approche retenue

**Option A — Infra d'abord, acquisition ensuite**
Crédibilité avant de faire du bruit : domaine custom + présence Instagram établie avant de contacter les photographes.

---

## Phase 1 — Infra & Crédibilité

### 1.1 wedoria.fr sur Vercel

- Configurer wedoria.fr comme domaine custom via Vercel CLI
- Vercel génère 2 records DNS (A + CNAME)
- PM ajoute les records dans le registrar du domaine
- Propagation : 5 min à 48h

**Fait par :** dev (config Vercel) + PM (DNS registrar)
**Critère :** `https://wedoria.fr` charge le site vitrine

### 1.2 9 posts Instagram préparés en batch

- 3 semaines de contenu (3 posts/semaine : lun / mer / ven)
- Format par post : texte final + hashtags + consigne visuelle (quel asset utiliser)
- Thèmes : reveals templates, tips mariage, témoignages fictifs

**Fait par :** marketing (contenu) + PM (créer le compte + publier)
**Critère :** 9 posts prêts à copier-coller dans un doc

### 1.3 Template DM photographes

- 1 message court, direct, proposition de valeur claire
- Critères de sélection des 10 photographes cibles (zone géographique, style)
- Objectif : 1 partenariat referral confirmé

**Fait par :** commercial (rédaction) + PM (envoyer les DMs)

---

## Phase 2 — Acquisition

### 2.1 Instagram lancé

- Publication des 9 posts selon le calendrier (lun/mer/ven)
- Bio optimisée : slogan + lien wedoria.fr + email contact
- Engagement proactif : liker/commenter posts de fiançailles récents

**Fait par :** PM
**Critère :** 3 premiers posts publiés, compte visible publiquement

### 2.2 Outreach photographes

- Envoyer le DM à 10 photographes sélectionnés
- Relance J+7 si pas de réponse
- Objectif : au moins 1 réponse positive dans les 2-3 semaines

**Fait par :** PM
**Critère :** 10 DMs envoyés, pipeline suivi dans board.json

### 2.3 Article SEO

- 1 article ~800 mots ciblant `site mariage personnalisé` ou `créer site internet mariage`
- Publié sur une page `/blog` ou equivalent
- Ancre le SEO dès le lancement sans attendre du trafic immédiat

**Fait par :** marketing (rédaction) + dev (intégration page blog si besoin)
**Critère :** article publié et indexable (pas de noindex)

---

## Phase 3 — Conversion

### 3.1 Réponse aux leads

- Template de premier contact déjà prêt (agents/commercial.md)
- Objectif : répondre en < 24h, qualifier en 3 questions, proposition sous 48h
- Suivi dans board.json (statut lead : nouveau → contacté → devis envoyé → signé)

**Fait par :** PM

### 3.2 Onboarding premier client

- Client remplit le formulaire `/onboarding`
- API crée le projet dans Supabase, email envoyé à PM
- Dev personnalise le template choisi avec les infos du questionnaire
- Livraison sous 48-72h

**Fait par :** dev + PM (validation finale)
**Critère :** URL du site client fonctionnelle, invités peuvent accéder au RSVP

### 3.3 Livraison & témoignage

- Email de remise de site : URL + guide d'utilisation (1 page max)
- Relance témoignage J+14 après livraison
- Témoignage publié sur la vitrine + réutilisé en post Instagram

**Fait par :** dev (email template) + PM (envoyer, collecter)
**Critère :** témoignage reçu et intégré à la vitrine

---

## Répartition des tâches

| Tâche | Agent | PM |
|-------|-------|----|
| Config Vercel domaine custom | dev | Ajouter DNS records |
| 9 posts Instagram | marketing | Créer compte + publier |
| DM photographes | commercial | Envoyer les 10 DMs |
| Article SEO | marketing | Publier |
| Répondre aux leads | — | PM |
| Onboarding + livraison | dev | Valider + facturer |
| Collecter témoignage | — | PM |

---

## Critère de fin de sprint

- [ ] wedoria.fr live
- [ ] Instagram actif (3 posts minimum publiés)
- [ ] 10 DMs photographes envoyés
- [ ] 1 article SEO publié
- [ ] 1 client signé au tarif plein
- [ ] Site livré + témoignage collecté
