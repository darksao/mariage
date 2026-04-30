# E2E Process Design — Wedoria Studio
**Date :** 2026-04-25
**Statut :** Approuvé

---

## 1. Architecture du flux complet

```
Prospect
  └── Vitrine (formulaire contact)
        └── POST /api/contact
              ├── Supabase → table `leads` (INSERT)
              └── Resend → Email PM (notification)

PM
  └── Reçoit l'email → ouvre l'onboarding
        └── Wizard onboarding (brief projet)
              └── POST /api/onboarding
                    ├── Supabase → table `projets` (INSERT)
                    └── Resend → Email client (lien config.js + instructions)

PM (J+3 à J+5)
  └── Livraison du site
        └── POST /api/delivery (ou appel manuel)
              ├── Supabase → `projets` (UPDATE statut: 'livré')
              └── Resend → Email client (confirmation livraison + lien site)
```

### Étapes détaillées

| # | Étape | Acteur | Outil |
|---|-------|--------|-------|
| 1 | Prospect remplit le formulaire vitrine | Prospect | Formulaire HTML |
| 2 | `POST /api/contact` reçoit les données | Serveur | Vercel Edge Function |
| 3 | Lead enregistré dans Supabase | Serveur | Supabase `leads` |
| 4 | Email de notification envoyé au PM | Serveur | Resend |
| 5 | PM remplit le wizard d'onboarding | PM | `/onboarding/index.html` |
| 6 | `POST /api/onboarding` traite le brief | Serveur | Vercel Edge Function |
| 7 | Projet enregistré dans Supabase | Serveur | Supabase `projets` |
| 8 | Email d'onboarding envoyé au client | Serveur | Resend |
| 9 | PM livre le site, déclenche la confirmation | PM | `POST /api/delivery` |
| 10 | Email de confirmation de livraison envoyé | Serveur | Resend |

---

## 2. Tables Supabase

### Table `leads`

```sql
CREATE TABLE leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  prenom1     TEXT NOT NULL,
  prenom2     TEXT,
  email       TEXT NOT NULL,
  telephone   TEXT,
  date_mariage DATE,
  message     TEXT,
  statut      TEXT DEFAULT 'nouveau'
    CHECK (statut IN ('nouveau', 'contacté', 'proposition', 'signé', 'archivé'))
);
```

### Table `projets`

```sql
CREATE TABLE projets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now(),
  lead_id         UUID REFERENCES leads(id),
  prenom1         TEXT NOT NULL,
  prenom2         TEXT,
  email_client    TEXT NOT NULL,
  date_mariage    DATE,
  template        TEXT CHECK (template IN ('classique', 'romantique', 'chic')),
  formule         TEXT CHECK (formule IN ('essentielle', 'premium', 'sur-mesure')),
  couleur_primaire TEXT,
  couleur_secondaire TEXT,
  police          TEXT,
  lieu            TEXT,
  programme       TEXT,
  infos_pratiques TEXT,
  statut          TEXT DEFAULT 'brief'
    CHECK (statut IN ('brief', 'en-cours', 'livré', 'archivé')),
  url_site        TEXT,
  livré_at        TIMESTAMPTZ
);
```

### Table `rsvp` (facultative, créée si formule Premium+)

```sql
CREATE TABLE rsvp (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  projet_id   UUID REFERENCES projets(id),
  prenom      TEXT NOT NULL,
  nom         TEXT,
  email       TEXT,
  presence    BOOLEAN,
  nb_personnes INTEGER DEFAULT 1,
  regime      TEXT,
  message     TEXT
);
```

---

## 3. Vercel Edge Functions

### Variables d'environnement requises

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...   # Service role key (jamais côté client)
RESEND_API_KEY=re_xxxx
PM_EMAIL=vu.nhusao@gmail.com
FROM_EMAIL=contact@wedoria.fr
```

### `/api/contact.js`

**Déclencheur :** `POST /api/contact` depuis le formulaire vitrine

**Payload attendu :**
```json
{
  "prenom1": "Sophie",
  "prenom2": "Thomas",
  "email": "sophie@example.com",
  "telephone": "06 12 34 56 78",
  "date_mariage": "2026-09-15",
  "message": "Nous voudrions un site romantique..."
}
```

**Actions :**
1. Valider les champs obligatoires (`prenom1`, `email`)
2. Insérer dans `leads`
3. Envoyer email PM via Resend
4. Retourner `{ success: true, lead_id }`

**Réponses d'erreur :**
- `400` — champs manquants
- `500` — erreur Supabase ou Resend

---

### `/api/onboarding.js`

**Déclencheur :** `POST /api/onboarding` depuis le wizard onboarding

**Payload attendu :**
```json
{
  "lead_id": "uuid-optionnel",
  "prenom1": "Sophie",
  "prenom2": "Thomas",
  "email_client": "sophie@example.com",
  "date_mariage": "2026-09-15",
  "template": "romantique",
  "formule": "premium",
  "couleur_primaire": "#C4A0B0",
  "couleur_secondaire": "#F5EDE5",
  "police": "Cormorant Garamond",
  "lieu": "Château de Vaux-le-Vicomte",
  "programme": "Cérémonie 15h, Vin d'honneur 17h, Dîner 20h",
  "infos_pratiques": "Parking gratuit sur place. Tenue: élégante."
}
```

**Actions :**
1. Valider les champs obligatoires
2. Insérer dans `projets`
3. Mettre à jour `leads.statut = 'signé'` si `lead_id` fourni
4. Envoyer email client via Resend
5. Retourner `{ success: true, projet_id }`

---

### `/api/delivery.js`

**Déclencheur :** `POST /api/delivery` (appelé manuellement par le PM)

**Payload attendu :**
```json
{
  "projet_id": "uuid",
  "url_site": "https://sophie-thomas.wedoria.fr"
}
```

**Actions :**
1. Mettre à jour `projets` : `statut = 'livré'`, `url_site`, `livré_at = now()`
2. Envoyer email de confirmation de livraison au client
3. Retourner `{ success: true }`

---

## 4. Emails Resend

### Email 1 — Notification PM (nouveau lead)

**De :** `Wedoria Studio <contact@wedoria.fr>`
**À :** `vu.nhusao@gmail.com`
**Objet :** `🎉 Nouveau lead — [Prénom1] & [Prénom2] ([date_mariage])`

```
Nouveau contact reçu sur le formulaire vitrine.

Prénom(s) : [prenom1] & [prenom2]
Email : [email]
Téléphone : [telephone]
Date de mariage : [date_mariage]

Message :
[message]

→ Ouvrir l'onboarding : https://wedoria.studio/onboarding/
```

---

### Email 2 — Onboarding client (brief reçu)

**De :** `Wedoria Studio <contact@wedoria.fr>`
**À :** `[email_client]`
**Objet :** `Votre site de mariage — on démarre ! ✨`

```
Bonjour [prenom1] et [prenom2],

Votre brief a bien été reçu — merci pour ces informations !

Voici ce qu'on a retenu :

  Template choisi : [template]
  Formule : [formule]
  Date de mariage : [date_mariage]
  Lieu : [lieu]

Nous allons maintenant créer votre site sur cette base.
Délai de livraison : [3 jours si Essentielle / 5 jours si Premium / 10 jours si Sur-mesure]

Si vous avez des ajustements ou des précisions, répondez simplement à cet email.

À très vite !
L'équipe Wedoria Studio

P.S. Vous pouvez suivre l'avancement en répondant à ce mail.
```

---

### Email 3 — Confirmation de livraison

**De :** `Wedoria Studio <contact@wedoria.fr>`
**À :** `[email_client]`
**Objet :** `Votre site est en ligne ! 🌹`

```
Bonjour [prenom1] et [prenom2],

Votre site de mariage est prêt — et il est magnifique.

→ Voir votre site : [url_site]

Pour partager le lien avec vos invités, copiez simplement cette adresse :
[url_site]

Ce que vos invités trouveront :
  - Les informations pratiques (lieu, horaires, programme)
  - Le compte à rebours jusqu'au grand jour
  [Si formule Premium+] - Le formulaire RSVP
  [Si formule Premium+] - La galerie photos

Besoin d'une modification ? Répondez à cet email, on s'en occupe.

Félicitations pour votre mariage — on est ravis d'en faire partie !

L'équipe Wedoria Studio
```

---

## 5. Plan de test E2E (10 étapes)

| # | Test | Résultat attendu |
|---|------|-----------------|
| 1 | Soumettre le formulaire vitrine avec tous les champs | Status 200, lead créé dans Supabase |
| 2 | Soumettre sans email | Status 400, message d'erreur clair |
| 3 | Vérifier l'email PM reçu | Email reçu dans les 30 secondes |
| 4 | Ouvrir le wizard onboarding | Formulaire s'affiche correctement |
| 5 | Remplir et soumettre l'onboarding | Status 200, projet créé dans Supabase |
| 6 | Vérifier l'email client onboarding | Email reçu, données correctes (template, formule, date) |
| 7 | Vérifier `leads.statut` dans Supabase | Statut passé à 'signé' |
| 8 | Appeler `/api/delivery` avec `projet_id` + `url_site` | Status 200, `projets.statut = 'livré'` |
| 9 | Vérifier l'email de livraison | Email reçu avec le bon lien |
| 10 | Tester avec un `lead_id` invalide | Status 400 ou 404, pas de crash |

---

## Décisions techniques

| Question | Décision |
|----------|----------|
| Base de données | Supabase (créé from scratch) |
| Email | Resend + Vercel Edge Functions |
| Hébergement des fonctions | Vercel (même projet que la vitrine) |
| Clé Supabase côté serveur | Service role key uniquement dans les Edge Functions |
| Formulaire vitrine | Existant, câblé sur `/api/contact` |
| Wizard onboarding | `/onboarding/index.html` existant, câblé sur `/api/onboarding` |
| Livraison | Déclenchée manuellement par le PM via `/api/delivery` |
