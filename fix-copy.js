const fs = require('fs');
let c = fs.readFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', 'utf8');

function rep1(from, to) {
  const idx = c.indexOf(from);
  if (idx === -1) { console.warn('SKIP:', from.slice(0, 60)); return; }
  c = c.slice(0, idx) + to + c.slice(idx + from.length);
  console.log('OK:', from.slice(0, 60));
}

// ESSENTIELLE — subtitle (1st occurrence)
rep1('paiement unique · hébergement 12 mois inclus', 'paiement unique · en ligne pour toute votre liste');
// PREMIUM — subtitle (now only remaining occurrence)
rep1('paiement unique · hébergement 12 mois inclus', "paiement unique · l'expérience complète");

// ESSENTIELLE features
rep1('Site 1 page personnalisé', 'Une page complète et élégante, à votre image');
rep1('Hero, Programme, RSVP, Carte interactive', 'Infos pratiques, programme, RSVP et carte interactive');
rep1('1 langue', 'Vos invités répondent en quelques clics');
rep1('Livraison en 5 jours ouv', "1 an d’hébergement inclus, zéro gestion technique");
rep1('Hébergement 12 mois inclus', "On s’occupe de tout — livré sous 5 jours");
// Keep 'Support email'
rep1("Choisir l'Essentielle", "Commencer avec l'Essentielle →");

// PREMIUM badge
rep1('Le plus populaire', 'Le plus choisi');

// PREMIUM features
rep1("Tout l'Essentielle, plus…", "Tout l'Essentielle, enrichi");
rep1('Galerie photos', 'Galerie photos et compte à rebours animé');
rep1('Compte à rebours animé', 'Votre histoire racontée en timeline');
rep1('Multilingue (FR + 1 langue)', 'Site disponible en 2 langues — parfait pour les invités étrangers');
rep1('Photo couple pleine page', 'Photo de couple pleine page');
rep1('Notre histoire (timeline)', 'Accès &amp; modifications après livraison');
// Keep 'Code vestimentaire & FAQ'
rep1('Livraison en 3 jours ouv', 'Livré sous 3 jours ouvrés');
rep1('Choisir le Premium', 'Je veux le Premium →');

// SUR-MESURE price
rep1('Sur devis', 'à partir de 800€');
// SUR-MESURE subtitle
rep1('accompagnement dédié · projet unique', 'accompagnement de A à Z · disponible jusqu’au Jour J');
// SUR-MESURE features
rep1('Tout le Premium, plus…', 'Design créé de zéro, rien de générique');
rep1('Design entièrement personnalisé', "Sections et animations à l’infini");
rep1('Sections sur-mesure illimitées', 'Vidéo héro plein écran');
rep1('Animations additionnelles', "Livre d’or numérique pour vos invités");
rep1('Vidéo héro personnalisée', "Support jusqu’au soir du mariage");
rep1('Intégrations spéciales', 'Appel de lancement dédié');
rep1('Accompagnement dédié', 'Révisions illimitées');
rep1('Demander un devis', 'Parlons de votre projet →');

fs.writeFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', c, 'utf8');
console.log('\nAll done!');
