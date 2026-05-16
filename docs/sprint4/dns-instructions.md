# DNS — wedoria.fr → Vercel

Le domaine wedoria.fr et www.wedoria.fr ont déjà été configurés côté Vercel.
Il reste 2 enregistrements à ajouter dans OVH (5 min).

## Aller dans OVH

1. https://www.ovh.com/manager > Domaines > wedoria.fr > Zone DNS
2. Cliquer "Ajouter une entrée"

## Record 1 — domaine racine

| Champ | Valeur |
|-------|--------|
| Type | A |
| Sous-domaine | (laisser vide) |
| Cible | 76.76.21.21 |
| TTL | 3600 (défaut) |

## Record 2 — www

| Champ | Valeur |
|-------|--------|
| Type | A |
| Sous-domaine | www |
| Cible | 76.76.21.21 |
| TTL | 3600 (défaut) |

## Délai

Propagation : 5 min à 48h.
Vérification : https://dnschecker.org → taper wedoria.fr → doit afficher 76.76.21.21 en vert.

Une fois propagé : https://wedoria.fr doit charger le site vitrine avec HTTPS automatique.
