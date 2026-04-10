/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Fichier de configuration du site de mariage
   ─────────────────────────────────────────────────────────────
   Modifiez ce fichier pour mettre à jour tout le contenu du site.
   Enregistrez puis actualisez le navigateur pour voir les changements.
═══════════════════════════════════════════════════════════════ */

const MARIAGE = {

  /* ─────────────────────────────────────────────────────────
     💌  INVITÉ (nom affiché dans le héros)
  ───────────────────────────────────────────────────────── */


  /* ─────────────────────────────────────────────────────────
     👫  MARIÉS
  ───────────────────────────────────────────────────────── */
  prenom1: "Catherine", nom1: "MA",
  prenom2: "Nhu-Sao",   nom2: "VU",

  /* ─────────────────────────────────────────────────────────
     📅  DATE & LIEU
  ───────────────────────────────────────────────────────── */
  date_affichage: "Samedi 18 Octobre 2026",
  date_iso:       "2026-10-18T14:00:00",   // ← Format : AAAA-MM-JJTHH:MM:SS (pour le compte à rebours)
  domaine:        "Domaine des Brumes",
  ville:          "Beaune, Bourgogne",

  /* ─────────────────────────────────────────────────────────
     📸  PHOTO COUPLE (section visible en 1er au scroll)
     Chemin relatif depuis le dossier site-invites/
  ───────────────────────────────────────────────────────── */
  photo_couple: "photo-couple.jpg",
  photo_couple_caption: "Catherine & Nhu-Sao · Nice, France",

  /* ─────────────────────────────────────────────────────────
     🌟  HERO
  ───────────────────────────────────────────────────────── */
  hero_intro: "Vous êtes invités au mariage de",
  hero_cta:   "Confirmer ma présence",
  scroll_label: "Découvrir",
  sr_line1:   "Avant ce jour,",
  sr_line2:   "notre histoire s'écrivait",

  /* ─────────────────────────────────────────────────────────
     📖  NOTRE HISTOIRE
  ───────────────────────────────────────────────────────── */
  histoire_eyebrow: "Depuis 2017",
  histoire_titre:   "Notre Histoire",

  histoire: [
    {
      annee:  "2017",
      titre:  "La Rencontre",
      texte:  "Un soir d'automne lors d'une soirée raclette, nos regards se sont croisés pour la première fois. Ce fut le début d'une belle et inattendue aventure.",
      align:  "left",   // "left" ou "right"
    },
    {
      annee:  "2021",
      titre:  "Notre Premier Voyage",
      texte:  "Direction le Japon pour deux semaines inoubliables. Entre temples anciens et forêts de bambous, nous avons su que nous étions faits l'un pour l'autre.",
      align:  "right",
    },
    {
      annee:  "2024",
      titre:  "La Demande",
      texte:  "Au coucher du soleil (plutôt après) sur la côte niçoise, Nhu-Sao s'est agenouillé et a demandé à Léa de partager sa vie. Elle a dit oui, les yeux brillants de joie.",
      align:  "left",
    },
    {
      annee:  "2026",
      titre:  "Le Grand Jour",
      texte:  "Nous célébrons notre union entourés de ceux que nous aimons. Merci d'être là pour partager ce moment unique avec nous.",
      align:  "right",
    },
  ],

  /* ─────────────────────────────────────────────────────────
     🗓️  PROGRAMME DU JOUR J
  ───────────────────────────────────────────────────────── */
  programme_eyebrow: "18 Octobre 2026",
  programme_titre:   "Le Jour J",

  programme: [
    { heure: "14h00", icon: "💍", titre: "Cérémonie Laïque",  lieu: "Chapelle du Domaine des Brumes" },
    { heure: "15h30", icon: "🥂", titre: "Vin d'Honneur",     lieu: "Jardins du Domaine" },
    { heure: "19h30", icon: "🍽️", titre: "Dîner de Gala",     lieu: "Grande Salle du Château" },
    { heure: "22h00", icon: "🎵", titre: "Soirée Dansante",   lieu: "Jusqu'au bout de la nuit !" },
  ],

  /* ─────────────────────────────────────────────────────────
     🏰  GALERIE (placeholders — remplacez par vos vraies photos)
     Pour ajouter une photo : remplacez "photo: null" par "photo: 'chemin/vers/image.jpg'"
  ───────────────────────────────────────────────────────── */
  galerie_eyebrow: "Le décor de notre amour",
  galerie_titre:   "Le Domaine",
  galerie_hint:    "Ajoutez vos photos du domaine ici",

  galerie: [
    { icon: "🏰", label: "Façade du Domaine",    photo: null },
    { icon: "🍂", label: "Jardins d'Automne",    photo: null },
    { icon: "✨", label: "Grande Salle",          photo: null },
    { icon: "⛪", label: "Chapelle",              photo: null },
    { icon: "🌿", label: "Terrasse & Vignes",     photo: null },
    { icon: "🕯️", label: "Décoration de Table",  photo: null },
  ],

  /* ─────────────────────────────────────────────────────────
     📍  LES LIEUX
  ───────────────────────────────────────────────────────── */
  lieux_eyebrow: "Où nous rejoindre",
  lieux_titre:   "Les Lieux",

  lieux: [
    {
      icon:     "⛪",
      type:     "Cérémonie",
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
      nom:      "Hôtel Le Cep ★★★★",
      adresse:  ["27 Rue Maufoux", "21200 Beaune, Bourgogne"],
      featured: false,
      badge:    "",
      btn:      { label: "Plus d'infos", href: "#infos" },
    },
  ],

  /* ─────────────────────────────────────────────────────────
     🗺️  CARTE (coordonnées GPS du lieu de réception)
  ───────────────────────────────────────────────────────── */
  carte: {
    lat:      47.0239,
    lng:      4.8397,
    zoom:     14,
    nom:      "Domaine des Brumes",
    adresse:  ["Hameau des Brumes", "21200 Beaune, Bourgogne"],
    caption:  "📍 Domaine des Brumes · Hameau des Brumes, 21200 Beaune",
  },

  /* ─────────────────────────────────────────────────────────
     👗  CODE VESTIMENTAIRE
     eviter: true = couleur à éviter (affichée avec un ✕)
  ───────────────────────────────────────────────────────── */
  dress_eyebrow: "Pour l'occasion",
  dress_titre:   "Code Vestimentaire",
  dress_intro:   "Tenue de soirée souhaitée. Inspirez-vous des teintes automnales !",

  dress_couleurs: [
    { nom: "Bordeaux",   hex: "#6B2737", eviter: false },
    { nom: "Or",         hex: "#C9A96E", eviter: false },
    { nom: "Olive",      hex: "#7D8C4F", eviter: false },
    { nom: "Rouille",    hex: "#C45A23", eviter: false },
    { nom: "Caramel",    hex: "#8B6B4A", eviter: false },
    { nom: "Terracotta", hex: "#A0522D", eviter: false },
    { nom: "Blanc",      hex: "#F5F5F5", eviter: true  },
    { nom: "Noir",       hex: "#1A1A1A", eviter: true  },
  ],

  /* ─────────────────────────────────────────────────────────
     ✉️  RSVP
  ───────────────────────────────────────────────────────── */
  rsvp_eyebrow: "Avant le 1er Août 2026",
  rsvp_titre:   "Confirmer votre présence",
  rsvp_intro:   "Merci de nous confirmer votre présence avant le 1er août 2026 afin que nous puissions organiser cette belle journée dans les meilleures conditions.",

  /* ─────────────────────────────────────────────────────────
     ℹ️  INFOS PRATIQUES
  ───────────────────────────────────────────────────────── */
  infos_eyebrow: "Tout ce qu'il faut savoir",
  infos_titre:   "Infos Pratiques",

  infos: [
    { icon: "👗", titre: "Tenue",         texte: "Tenue de soirée souhaitée. Évitez le blanc et le noir — les teintes automnales sont les bienvenues !" },
    { icon: "🚗", titre: "Parking",       texte: "Parking gratuit sur le domaine. Depuis Paris : A6 sortie Beaune. Depuis Lyon : A6 sortie Beaune Nord." },
    { icon: "🚂", titre: "Train",         texte: "Gare de Beaune à 8 km. Des navettes seront organisées depuis la gare à 13h30 et 13h50." },
    { icon: "🏨", titre: "Hébergement",   texte: "Des chambres ont été pré-réservées à l'Hôtel Le Cep. Contactez-nous pour le code préférentiel." },
    { icon: "👶", titre: "Enfants",       texte: "Pas d'enfants, déso pas déso" },
    { icon: "📸", titre: "Photos",        texte: "Un photographe professionnel sera présent. Les photos seront partagées via un lien privé après le mariage." },
  ],

  /* ─────────────────────────────────────────────────────────
     ❓  FAQ
     La réponse accepte du HTML (ex : <a href="...">lien</a>)
  ───────────────────────────────────────────────────────── */
  faq_titre: "Questions fréquentes",

  faq: [
    {
      q: "Puis-je amener un +1 non mentionné sur l'invitation ?",
      r: "Merci de nous contacter directement avant de confirmer votre venue avec un accompagnant supplémentaire.",
    },
    {
      q: "Y a-t-il une liste de mariage ?",
      r: "Oui ! Nous avons ouvert une liste chez Zola et une cagnotte voyage de noces. Détails envoyés par email après RSVP.",
    },
    {
      q: "Quelle météo prévoir en octobre en Bourgogne ?",
      r: "Les températures oscillent entre 8 °C et 16 °C. Prévoyez une veste pour la soirée. Les vignes aux couleurs d'automne seront magnifiques !",
    },
    {
      q: "Comment vous contacter ?",
      r: `Écrivez-nous à <a href="mailto:vu.nhusao@gmail.com">vu.nhusao@gmail.com</a> ou par WhatsApp au 06 XX XX XX XX.`,
    },
  ],

  /* ─────────────────────────────────────────────────────────
     📞  CONTACT
  ───────────────────────────────────────────────────────── */
  email:    "vu.nhusao@gmail.com",
  whatsapp: "06 XX XX XX XX",

  /* ─────────────────────────────────────────────────────────
     🦶  FOOTER
  ───────────────────────────────────────────────────────── */
  citation: "« Deux âmes qui se reconnaissent n'ont jamais besoin d'une introduction. »",

  /* ─────────────────────────────────────────────────────────
     🌍  TRADUCTIONS (EN · VI)
     Seules les clés présentes ici remplacent le français.
  ───────────────────────────────────────────────────────── */
  i18n: {

    en: {
      hero_intro:    "You are invited to the wedding of",
      hero_cta:      "Confirm my attendance",
      scroll_label:  "Discover",
      sr_line1:      "Before this day,",
      sr_line2:      "our story was being written",
      nav:           ["Our Story", "The Day", "Estate", "Venues", "RSVP", "Info"],
      cd_labels:     ["Days", "Hours", "Minutes", "Seconds"],

      histoire_eyebrow:    "Since 2017",
      histoire_titre:      "Our Story",
      histoire: [
        { annee: "2017", align: "left",  titre: "The Meeting",       texte: "On an autumn evening at a raclette dinner, our eyes met for the very first time. It was the beginning of a beautiful and unexpected adventure." },
        { annee: "2021", align: "right", titre: "Our First Journey",  texte: "Off to Japan for two unforgettable weeks. Between ancient temples and bamboo forests, we knew we were made for each other." },
        { annee: "2024", align: "left",  titre: "The Proposal",       texte: "At sunset (well, slightly after) on the Côte d'Azur, Nhu-Sao got down on one knee and asked Catherine to share his life. She said yes, eyes shining with joy." },
        { annee: "2026", align: "right", titre: "The Big Day",        texte: "We celebrate our union surrounded by those we love. Thank you for being here to share this unique moment with us." },
      ],

      programme_eyebrow:   "18 October 2026",
      programme_titre:     "The Big Day",
      programme: [
        { heure: "2:00 PM",  icon: "💍", titre: "Civil Ceremony",  lieu: "Domaine des Brumes Chapel" },
        { heure: "3:30 PM",  icon: "🥂", titre: "Cocktail Hour",   lieu: "Estate Gardens" },
        { heure: "7:30 PM",  icon: "🍽️", titre: "Gala Dinner",     lieu: "Grand Château Hall" },
        { heure: "10:00 PM", icon: "🎵", titre: "Dancing",         lieu: "Until the end of the night!" },
      ],

      galerie_eyebrow:     "The setting of our love story",
      galerie_titre:       "The Estate",

      lieux_eyebrow:       "Where to find us",
      lieux_titre:         "The Venues",
      lieux: [
        { type: "Ceremony",               badge: "",             btn: { label: "View on map", href: "#map" } },
        { type: "Reception",              badge: "Main venue",   btn: { label: "View on map", href: "#map" } },
        { type: "Recommended hotel",      badge: "",             btn: { label: "More info",   href: "#infos" } },
      ],

      dress_eyebrow:       "For the occasion",
      dress_titre:         "Dress Code",
      dress_intro:         "Evening attire requested. Draw inspiration from autumn tones!",

      rsvp_eyebrow:        "Before 1 August 2026",
      rsvp_titre:          "Confirm your attendance",
      rsvp_intro:          "Please confirm your attendance before 1 August 2026 so we can organise this beautiful day in the best conditions.",

      infos_eyebrow:       "Everything you need to know",
      infos_titre:         "Practical Info",
      infos: [
        { icon: "👗", titre: "Dress Code",      texte: "Evening attire requested. Avoid white and black — autumn tones are welcome!" },
        { icon: "🚗", titre: "Parking",         texte: "Free parking on the estate. From Paris: A6 exit Beaune. From Lyon: A6 exit Beaune Nord." },
        { icon: "🚂", titre: "Train",           texte: "Beaune station 8 km away. Shuttles from the station at 1:30 PM and 1:50 PM." },
        { icon: "🏨", titre: "Accommodation",   texte: "Rooms pre-booked at Hôtel Le Cep. Contact us for the preferential code." },
        { icon: "👶", titre: "Children",        texte: "No children, sorry not sorry" },
        { icon: "📸", titre: "Photos",          texte: "A professional photographer will be present. Photos will be shared via a private link after the wedding." },
      ],

      faq_titre: "Frequently Asked Questions",
      faq: [
        { q: "Can I bring a +1 not mentioned on the invitation?",   r: "Please contact us directly before confirming your attendance with an additional guest." },
        { q: "Is there a wedding list?",                            r: "Yes! We have a list at Zola and a honeymoon fund. Details sent by email after RSVP." },
        { q: "What weather to expect in October in Burgundy?",      r: "Temperatures range between 8 °C and 16 °C. Bring a jacket for the evening. The autumn vineyards will be magnificent!" },
        { q: "How to contact you?",                                 r: `Write to us at <a href="mailto:vu.nhusao@gmail.com">vu.nhusao@gmail.com</a> or on WhatsApp at 06 XX XX XX XX.` },
      ],

      citation: "« Two souls that recognise each other never need an introduction. »",

      form: {
        prenom: "First name *",   prenom_ph: "Your first name",
        nom:    "Last name *",    nom_ph:    "Your last name",
        email:  "Email *",
        presence: "Will you attend? *",
        oui:    "Yes, with pleasure! 🎉",
        non:    "Unfortunately no 😢",
        invites: "Number of guests",
        invites_opts: ["Coming alone", "+ 1 guest", "+ 2 guests", "+ 3 guests", "+ 4 or more"],
        menu:       "Menu preference",
        vegetarien: "Vegetarian",
        allergies:  "Allergies or dietary requirements",
        allergies_ph: "E.g.: gluten-free, nut allergy…",
        message:    "A word for the couple",
        message_ph: "Your message, wishes, anecdote…",
        submit:     "Send my reply",
        ok_h3:      "Thank you!",
      },
    },

    vi: {
      hero_intro:    "Trân trọng kính mời bạn đến lễ cưới của",
      hero_cta:      "Xác nhận tham dự",
      scroll_label:  "Khám phá",
      sr_line1:      "Trước ngày hôm nay,",
      sr_line2:      "câu chuyện của chúng tôi đang được viết",
      nav:           ["Câu chuyện", "Chương trình", "Địa danh", "Địa điểm", "RSVP", "Thông tin"],
      cd_labels:     ["Ngày", "Giờ", "Phút", "Giây"],

      histoire_eyebrow:    "Từ năm 2017",
      histoire_titre:      "Câu chuyện của chúng tôi",
      histoire: [
        { annee: "2017", align: "left",  titre: "Cuộc Gặp Gỡ",      texte: "Một buổi tối mùa thu trong bữa tiệc raclette, ánh mắt chúng tôi lần đầu tiên chạm nhau. Đó là khởi đầu của một cuộc phiêu lưu tuyệt vời và bất ngờ." },
        { annee: "2021", align: "right", titre: "Chuyến Đi Đầu Tiên", texte: "Cùng nhau đến Nhật Bản trong hai tuần không thể quên. Giữa những ngôi đền cổ kính và rừng tre, chúng tôi biết rằng mình sinh ra là dành cho nhau." },
        { annee: "2024", align: "left",  titre: "Lời Cầu Hôn",       texte: "Lúc hoàng hôn (thực ra là sau đó một chút) trên bờ biển Côte d'Azur, Nhu-Sao quỳ xuống và cầu hôn Catherine. Cô ấy đã nói có, mắt long lanh ánh vui mừng." },
        { annee: "2026", align: "right", titre: "Ngày Trọng Đại",    texte: "Chúng tôi tổ chức lễ kết hôn bên cạnh những người thân yêu nhất. Cảm ơn bạn đã có mặt để chia sẻ khoảnh khắc đặc biệt này cùng chúng tôi." },
      ],

      programme_eyebrow:   "Ngày 18 tháng 10 năm 2026",
      programme_titre:     "Ngày trọng đại",
      programme: [
        { heure: "14:00", icon: "💍", titre: "Lễ cưới",          lieu: "Nhà nguyện Domaine des Brumes" },
        { heure: "15:30", icon: "🥂", titre: "Tiệc khai vị",     lieu: "Vườn của Domaine" },
        { heure: "19:30", icon: "🍽️", titre: "Tiệc gala",        lieu: "Đại sảnh Château" },
        { heure: "22:00", icon: "🎵", titre: "Vũ hội",           lieu: "Cho đến tận đêm khuya!" },
      ],

      galerie_eyebrow:     "Khung cảnh tình yêu của chúng tôi",
      galerie_titre:       "Địa danh",

      lieux_eyebrow:       "Nơi chúng tôi gặp nhau",
      lieux_titre:         "Địa điểm",
      lieux: [
        { type: "Lễ cưới",          badge: "",              btn: { label: "Xem bản đồ",      href: "#map" } },
        { type: "Tiệc cưới",        badge: "Địa điểm chính",btn: { label: "Xem bản đồ",      href: "#map" } },
        { type: "Khách sạn gợi ý",  badge: "",              btn: { label: "Thêm thông tin",  href: "#infos" } },
      ],

      dress_eyebrow:       "Cho dịp đặc biệt",
      dress_titre:         "Trang phục",
      dress_intro:         "Mong muốn trang phục dạ tiệc. Hãy lấy cảm hứng từ gam màu mùa thu!",

      rsvp_eyebrow:        "Trước ngày 1 tháng 8 năm 2026",
      rsvp_titre:          "Xác nhận tham dự",
      rsvp_intro:          "Vui lòng xác nhận trước ngày 1 tháng 8 năm 2026 để chúng tôi chuẩn bị tốt nhất cho ngày trọng đại này.",

      infos_eyebrow:       "Tất cả những gì bạn cần biết",
      infos_titre:         "Thông tin thực tế",
      infos: [
        { icon: "👗", titre: "Trang phục",    texte: "Mong muốn trang phục dạ tiệc. Tránh màu trắng và đen — gam màu mùa thu được chào đón!" },
        { icon: "🚗", titre: "Bãi đậu xe",   texte: "Bãi đậu xe miễn phí. Từ Paris: A6 lối ra Beaune. Từ Lyon: A6 lối ra Beaune Nord." },
        { icon: "🚂", titre: "Tàu hỏa",      texte: "Ga Beaune cách 8 km. Xe đưa đón từ ga lúc 13:30 và 13:50." },
        { icon: "🏨", titre: "Chỗ ở",        texte: "Phòng đặt trước tại Hôtel Le Cep. Liên hệ để nhận mã ưu đãi." },
        { icon: "👶", titre: "Trẻ em",       texte: "Không có trẻ em, xin lỗi nhé" },
        { icon: "📸", titre: "Ảnh",          texte: "Sẽ có nhiếp ảnh gia chuyên nghiệp. Ảnh chia sẻ qua liên kết riêng sau lễ cưới." },
      ],

      faq_titre: "Câu hỏi thường gặp",
      faq: [
        { q: "Tôi có thể mang thêm khách không có trong thiệp mời không?", r: "Vui lòng liên hệ trực tiếp trước khi xác nhận tham dự với khách thêm." },
        { q: "Có danh sách quà cưới không?",                               r: "Có! Chúng tôi đã mở danh sách tại Zola và quỹ tuần trăng mật. Chi tiết gửi qua email sau RSVP." },
        { q: "Thời tiết tháng 10 ở Burgundy như thế nào?",                r: "Nhiệt độ 8–16 °C. Mang theo áo khoác buổi tối. Vườn nho mùa thu sẽ rất đẹp!" },
        { q: "Liên hệ với các bạn như thế nào?",                          r: `Viết thư tại <a href="mailto:vu.nhusao@gmail.com">vu.nhusao@gmail.com</a> hoặc WhatsApp số 06 XX XX XX XX.` },
      ],

      citation: "« Hai tâm hồn nhận ra nhau không bao giờ cần lời giới thiệu. »",

      form: {
        prenom: "Tên *",  prenom_ph: "Tên của bạn",
        nom:    "Họ *",   nom_ph:    "Họ của bạn",
        email:  "Email *",
        presence: "Bạn có tham dự không? *",
        oui:    "Có, rất vui lòng! 🎉",
        non:    "Rất tiếc không tham dự được 😢",
        invites: "Số người đi cùng",
        invites_opts: ["Đi một mình", "+ 1 người", "+ 2 người", "+ 3 người", "+ 4 hoặc hơn"],
        menu:       "Lựa chọn menu",
        vegetarien: "Chay",
        allergies:  "Dị ứng hoặc chế độ ăn đặc biệt",
        allergies_ph: "Ví dụ: không gluten, dị ứng đậu phộng…",
        message:    "Một lời nhắn cho cặp đôi",
        message_ph: "Tin nhắn, lời chúc, kỷ niệm…",
        submit:     "Gửi câu trả lời",
        ok_h3:      "Cảm ơn bạn!",
      },
    },
  },

};
