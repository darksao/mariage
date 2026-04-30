/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Généré par Wedoria Onboarding
   ─────────────────────────────────────────────────────────────
   C'est le SEUL fichier à modifier pour chaque nouveau client.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = {
  "prenom1": "Sophie",
  "nom1": "Martin",
  "prenom2": "Thomas",
  "nom2": "Dupont",
  "date_affichage": "Samedi 12 Juillet 2025",
  "date_iso": "2025-07-12T14:00:00",
  "rsvp_deadline": "1er Mai 2025",
  "domaine": "Domaine des Brumes",
  "ville": "Beaune, Bourgogne",
  "email": "sophie.thomas@exemple.com",
  "whatsapp": "06 12 34 56 78",
  "langues": ["fr"],
  "photo_couple": null,
  "photo_couple_caption": "Sophie & Thomas · Paris, France",
  "hero_intro": "Vous êtes invités au mariage de",
  "hero_cta": "Confirmer ma présence",
  "scroll_label": "Découvrir",
  "citation": "« Aimer, c'est trouver sa richesse en l'autre. »",
  "sr_line1": "Avant ce jour,",
  "sr_line2": "notre histoire s'écrivait",
  "bandeau": ["France", "Barcelone", "Sophie", "Thomas", "Juillet 2025", "Beaune", "Bourgogne"],
  "histoire_eyebrow": "Depuis 2019",
  "histoire_titre": "Notre Histoire",
  "histoire": [
    { "annee": "2019", "titre": "La Rencontre", "texte": "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois.", "align": "left" },
    { "annee": "2022", "titre": "Notre Premier Voyage", "texte": "Direction Lisbonne pour notre premier voyage. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l'un pour l'autre.", "align": "right" },
    { "annee": "2024", "titre": "La Demande", "texte": "Au coucher du soleil sur la plage de Biarritz, Thomas s'est agenouillé et a demandé à Sophie de partager sa vie.", "align": "left" },
    { "annee": "2025", "titre": "Le Grand Jour", "texte": "Nous célébrons notre union entourés de ceux que nous aimons.", "align": "right" },
    { "annee": "", "titre": "", "texte": "", "align": "left" }
  ],
  "programme_eyebrow": "12 Juillet 2025",
  "programme_titre": "Le Jour J",
  "programme": [
    { "heure": "14h00", "icon": "💍", "titre": "Cérémonie Laïque", "lieu": "Chapelle du Domaine des Brumes" },
    { "heure": "15h30", "icon": "🥂", "titre": "Vin d'Honneur", "lieu": "Jardins du Domaine" },
    { "heure": "19h30", "icon": "🍽️", "titre": "Dîner de Gala", "lieu": "Grande Salle du Château" },
    { "heure": "22h00", "icon": "🎵", "titre": "Soirée Dansante", "lieu": "Jusqu'au bout de la nuit !" }
  ],
  "galerie_eyebrow": "Le décor de notre amour",
  "galerie_titre": "Le Domaine",
  "galerie_hint": "",
  "galerie": [
    { "icon": "🏰", "label": "Façade du Domaine", "photo": null },
    { "icon": "🌿", "label": "Les Jardins", "photo": null },
    { "icon": "✨", "label": "Grande Salle", "photo": null },
    { "icon": "⛪", "label": "Chapelle", "photo": null },
    { "icon": "🌸", "label": "Terrasse", "photo": null },
    { "icon": "🕯️", "label": "Décoration de Table", "photo": null }
  ],
  "lieux_eyebrow": "Où nous rejoindre",
  "lieux_titre": "Les Lieux",
  "lieux": [
    {
      "icon": "⛪", "type": "Cérémonie Laïque", "nom": "Chapelle Saint-Jean",
      "adresse": ["12 Route des Vignes", "21200 Beaune, Bourgogne"],
      "featured": false, "badge": "",
      "btn": { "label": "Voir sur la carte", "href": "#map" }
    },
    {
      "icon": "🏰", "type": "Réception", "nom": "Domaine des Brumes",
      "adresse": ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
      "featured": true, "badge": "Lieu principal",
      "btn": { "label": "Voir sur la carte", "href": "#map" }
    },
    {
      "icon": "🏨", "type": "Hébergement conseillé", "nom": "Hôtel Le Cep ★★★★",
      "adresse": ["27 Rue Maufoux", "21200 Beaune, Bourgogne"],
      "featured": false, "badge": "",
      "btn": { "label": "Plus d'infos", "href": "#infos" }
    }
  ],
  "carte": {
    "lat": 47.0239, "lng": 4.8397, "zoom": 14,
    "nom": "Domaine des Brumes",
    "adresse": ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
    "caption": "📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune"
  },
  "dress_eyebrow": "Pour l'occasion",
  "dress_titre": "Code Vestimentaire",
  "dress_intro": "Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !",
  "dress_couleurs": [
    { "nom": "Rose poudré", "hex": "#F2C4CE", "eviter": false },
    { "nom": "Champagne", "hex": "#F0DCA0", "eviter": false },
    { "nom": "Sauge", "hex": "#87A878", "eviter": false },
    { "nom": "Ivoire", "hex": "#F5F0E0", "eviter": false },
    { "nom": "Blanc", "hex": "#F5F5F5", "eviter": true },
    { "nom": "Noir", "hex": "#1A1A1A", "eviter": true }
  ],
  "infos_eyebrow": "Tout ce qu'il faut savoir",
  "infos_titre": "Infos Pratiques",
  "infos": [
    { "icon": "🚗", "titre": "Parking", "texte": "Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord." },
    { "icon": "🚂", "titre": "Train", "texte": "Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50." },
    { "icon": "🏨", "titre": "Hébergement", "texte": "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel." },
    { "icon": "👶", "titre": "Enfants", "texte": "Soirée adultes uniquement." },
    { "icon": "📸", "titre": "Photos", "texte": "Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage." },
    { "icon": "➕", "titre": "", "texte": "" }
  ],
  "faq_titre": "Questions fréquentes",
  "faq": [
    { "q": "Puis-je amener un +1 non mentionné sur l'invitation ?", "r": "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire." },
    { "q": "Y a-t-il une liste de mariage ?", "r": "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage. Détails envoyés par email après RSVP." },
    { "q": "Comment nous contacter ?", "r": "Écrivez-nous à <a href=\"mailto:sophie.thomas@exemple.com\">sophie.thomas@exemple.com</a>." },
    { "q": "", "r": "" },
    { "q": "", "r": "" }
  ],
  "video_hero": {
    "type": "none",
    "src": ""
  },
  "rsvp_titre": "Confirmer votre présence",
  "rsvp_intro": "Merci de nous confirmer votre présence avant le 1er mai 2025 afin que nous puissions organiser cette belle journée dans les meilleures conditions.",
  "i18n": {}
};
