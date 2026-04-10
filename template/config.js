/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Template Site de Mariage
   ─────────────────────────────────────────────────────────────
   Remplissez ce fichier depuis le formulaire d'onboarding.
   C'est le SEUL fichier à modifier pour chaque nouveau client.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = {

  /* ── 01 · MARIÉS ──────────────────────────────────────────── */
  prenom1: "Sophie",  nom1: "Martin",
  prenom2: "Thomas",  nom2: "Dupont",

  /* ── 02 · DATE & LIEU ─────────────────────────────────────── */
  date_affichage: "Samedi 12 Juillet 2025",
  date_iso:       "2025-07-12T14:00:00",   // Format : AAAA-MM-JJTHH:MM:SS
  rsvp_deadline:  "1er Mai 2025",           // Affiché "Avant le 1er Mai 2025"
  domaine:        "Domaine des Brumes",
  ville:          "Beaune, Bourgogne",

  /* ── 03 · CONTACT ─────────────────────────────────────────── */
  email:    "sophie.thomas@exemple.com",
  whatsapp: "06 12 34 56 78",               // null = masqué dans la FAQ

  /* ── 04 · LANGUES ACTIVES ─────────────────────────────────── */
  // "fr" est toujours inclus. Ajouter "en" et/ou "vi" si traduit.
  langues: ["fr"],

  /* ── 05 · PHOTO COUPLE ────────────────────────────────────── */
  // null = section entière masquée
  photo_couple:         "photo-couple.jpg",
  photo_couple_caption: "Sophie & Thomas · Paris, France",

  /* ── 06 · TEXTES D'INTRODUCTION ───────────────────────────── */
  hero_intro:   "Vous êtes invités au mariage de",
  hero_cta:     "Confirmer ma présence",
  scroll_label: "Découvrir",
  citation:     "« Aimer, c'est trouver sa richesse en l'autre. »",
  sr_line1:     "Avant ce jour,",
  sr_line2:     "notre histoire s'écrivait",

  // Bandeau défilant — [] = masqué
  bandeau: ["France", "Barcelone", "Sophie", "Thomas", "Juillet 2025", "Beaune", "Bourgogne"],

  /* ── 07 · NOTRE HISTOIRE ──────────────────────────────────── */
  // Les blocs avec texte vide sont automatiquement masqués.
  histoire_eyebrow: "Depuis 2019",
  histoire_titre:   "Notre Histoire",

  histoire: [
    {
      annee: "2019",
      titre: "La Rencontre",
      texte: "Un soir de novembre lors d'une soirée entre amis, nos regards se sont croisés pour la première fois. Ce fut le début d'une belle et inattendue aventure.",
      align: "left",
    },
    {
      annee: "2022",
      titre: "Notre Premier Voyage",
      texte: "Direction Lisbonne pour notre premier voyage. Entre pastéis de nata et tramways colorés, nous avons su que nous étions faits l'un pour l'autre.",
      align: "right",
    },
    {
      annee: "2024",
      titre: "La Demande",
      texte: "Au coucher du soleil sur la plage de Biarritz, Thomas s'est agenouillé et a demandé à Sophie de partager sa vie. Elle a dit oui, les yeux brillants de joie.",
      align: "left",
    },
    {
      annee: "2025",
      titre: "Le Grand Jour",
      texte: "Nous célébrons notre union entourés de ceux que nous aimons. Merci d'être là pour partager ce moment unique avec nous.",
      align: "right",
    },
    // Bloc 5 optionnel — laisser texte vide pour ne pas l'afficher
    { annee: "", titre: "", texte: "", align: "left" },
  ],

  /* ── 08 · PROGRAMME DU JOUR J ─────────────────────────────── */
  programme_eyebrow: "12 Juillet 2025",
  programme_titre:   "Le Jour J",

  programme: [
    { heure: "14h00", icon: "💍", titre: "Cérémonie Laïque",  lieu: "Chapelle du Domaine des Brumes" },
    { heure: "15h30", icon: "🥂", titre: "Vin d'Honneur",     lieu: "Jardins du Domaine" },
    { heure: "19h30", icon: "🍽️", titre: "Dîner de Gala",     lieu: "Grande Salle du Château" },
    { heure: "22h00", icon: "🎵", titre: "Soirée Dansante",   lieu: "Jusqu'au bout de la nuit !" },
  ],

  /* ── GALERIE ── (formulaire section 13) ───────────────────── */
  galerie_eyebrow: "Le décor de notre amour",
  galerie_titre:   "Le Domaine",
  galerie_hint:    "",

  galerie: [
    { icon: "🏰", label: "Façade du Domaine",   photo: null },
    { icon: "🌿", label: "Les Jardins",          photo: null },
    { icon: "✨", label: "Grande Salle",         photo: null },
    { icon: "⛪", label: "Chapelle",             photo: null },
    { icon: "🌸", label: "Terrasse",             photo: null },
    { icon: "🕯️", label: "Décoration de Table", photo: null },
    // photo: null → icône placeholder affiché
    // photo: "galerie/photo1.jpg" → vraie photo affichée
  ],

  /* ── 09 · LES LIEUX ───────────────────────────────────────── */
  lieux_eyebrow: "Où nous rejoindre",
  lieux_titre:   "Les Lieux",

  lieux: [
    {
      icon:     "⛪",
      type:     "Cérémonie Laïque",
      nom:      "Chapelle Saint-Jean",
      adresse:  ["12 Route des Vignes", "21200 Beaune, Bourgogne"],
      featured: false,
      badge:    "",
      btn:      { label: "Voir sur la carte", href: "#map" },
    },
    {
      icon:     "🏰",
      type:     "Réception",
      nom:      "Domaine des Brumes",
      adresse:  ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
      featured: true,
      badge:    "Lieu principal",
      btn:      { label: "Voir sur la carte", href: "#map" },
    },
    {
      icon:     "🏨",
      type:     "Hébergement conseillé",
      nom:      "Hôtel Le Cep ★★★★",              // Laisser vide ("") pour masquer
      adresse:  ["27 Rue Maufoux", "21200 Beaune, Bourgogne"],
      featured: false,
      badge:    "",
      btn:      { label: "Plus d'infos", href: "#infos" },
    },
  ],

  /* ── CARTE GPS ─────────────────────────────────────────────── */
  // null = carte masquée
  carte: {
    lat:     47.0239,
    lng:     4.8397,
    zoom:    14,
    nom:     "Domaine des Brumes",
    adresse: ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
    caption: "📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune",
  },

  /* ── 10 · CODE VESTIMENTAIRE ──────────────────────────────── */
  dress_eyebrow: "Pour l'occasion",
  dress_titre:   "Code Vestimentaire",
  dress_intro:   "Tenue de soirée souhaitée. Inspirez-vous des teintes printanières !",

  dress_couleurs: [
    { nom: "Rose poudré",  hex: "#F2C4CE", eviter: false },
    { nom: "Champagne",    hex: "#F0DCA0", eviter: false },
    { nom: "Sauge",        hex: "#87A878", eviter: false },
    { nom: "Ivoire",       hex: "#F5F0E0", eviter: false },
    { nom: "Blanc",        hex: "#F5F5F5", eviter: true  },
    { nom: "Noir",         hex: "#1A1A1A", eviter: true  },
  ],

  /* ── 11 · INFOS PRATIQUES ─────────────────────────────────── */
  // Les lignes avec texte vide sont automatiquement masquées.
  infos_eyebrow: "Tout ce qu'il faut savoir",
  infos_titre:   "Infos Pratiques",

  infos: [
    { icon: "🚗", titre: "Parking",     texte: "Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord." },
    { icon: "🚂", titre: "Train",       texte: "Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50." },
    { icon: "🏨", titre: "Hébergement", texte: "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel." },
    { icon: "👶", titre: "Enfants",     texte: "Soirée adultes uniquement." },
    { icon: "📸", titre: "Photos",      texte: "Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage." },
    { icon: "➕", titre: "",            texte: "" }, // Ligne bonus — laisser vide pour ne pas l'afficher
  ],

  /* ── 12 · FAQ ─────────────────────────────────────────────── */
  // Les Q&R avec question vide sont automatiquement masqués.
  faq_titre: "Questions fréquentes",

  faq: [
    {
      q: "Puis-je amener un +1 non mentionné sur l'invitation ?",
      r: "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire.",
    },
    {
      q: "Y a-t-il une liste de mariage ?",
      r: "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage. Détails envoyés par email après RSVP.",
    },
    {
      q: "Comment nous contacter ?",
      r: `Écrivez-nous à <a href="mailto:sophie.thomas@exemple.com">sophie.thomas@exemple.com</a>.`,
    },
    { q: "", r: "" }, // Q&R supplémentaire — laisser vide pour ne pas l'afficher
    { q: "", r: "" },
  ],

  /* ── 13 · VIDÉO HERO ──────────────────────────────────────── */
  video_hero: {
    type: "local",    // "local" | "url" | "none"
    src:  "hero.mp4", // ignoré si type: "none"
    // type "local"  → fichier hero.mp4 / hero.webm dans le même dossier
    // type "url"    → lien direct vers la vidéo (ex: WeTransfer, S3, etc.)
    // type "none"   → fond sombre fixe, pas de vidéo
  },

  /* ── RSVP ─────────────────────────────────────────────────── */
  rsvp_titre: "Confirmer votre présence",
  rsvp_intro: "Merci de nous confirmer votre présence avant le 1er mai 2025 afin que nous puissions organiser cette belle journée dans les meilleures conditions.",

  /* ── FOOTER ───────────────────────────────────────────────── */
  // citation est dans la section 06 ci-dessus

  /* ── I18N — TRADUCTIONS OPTIONNELLES ──────────────────────── */
  // À remplir uniquement si langues: ["fr", "en"] ou ["fr", "vi"]
  // Structure identique au site Catherine & Nhu-Sao (voir config.js racine pour référence)
  i18n: {
    // en: { hero_intro: "...", ... },
    // vi: { ... },
  },

};
