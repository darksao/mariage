const fs = require('fs');
let c = fs.readFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', 'utf8');

function rep1(from, to) {
  const idx = c.indexOf(from);
  if (idx === -1) { console.warn('SKIP:', from.slice(0, 80)); return; }
  c = c.slice(0, idx) + to + c.slice(idx + from.length);
  console.log('OK:', from.slice(0, 60));
}

// 1. Renommer les couples
rep1('Catherine &amp; Nhu-Sao', 'Manon &amp; Raphaël');
rep1('Thomas &amp; Margot',     'Camille &amp; Édouard');
rep1('Alexandre &amp; Léa',     'Léa &amp; Antoine');

// 2. Supprimer les cartes 4 et 5 (sans preview)
// On cherche le début de la carte 4 (après la carte champetre)
// Dans le fichier: \n\n      <div class=\"portfolio-card\" data-reveal=\"\" data-delay=\"300\">
const card4Marker = `\\n\\n      <div class=\\"portfolio-card\\" data-reveal=\\"\\" data-delay=\\"300\\">`;

// La fin du portfolio-track: \n\n    </div>\n\n  </div>\n</section>
// Cherchons le closing de portfolio-track après la position de la carte 4
const idxCard4 = c.indexOf(card4Marker);
if (idxCard4 === -1) {
  console.warn('Carte 4 non trouvée');
} else {
  // Trouver la fin du bloc portfolio-track après la carte 4
  // On cherche \n    </div>\n\n  </div>\n</section> qui ferme portfolio-track > portfolio-track-wrap > section
  const endMarker = `\\n\\n  <\\u002Fdiv>\\n<\\u002Fsection>\\n\\n<!-- ========== T`;
  const idxEnd = c.indexOf(endMarker, idxCard4);
  if (idxEnd === -1) {
    console.warn('Fin portfolio non trouvée');
    // Debug: show what's around idxCard4 + 800
    console.log('Context:', JSON.stringify(c.slice(idxCard4 + 800, idxCard4 + 1200)));
  } else {
    // Delete from start of card4 to the end marker (keep end marker)
    c = c.slice(0, idxCard4) + c.slice(idxEnd);
    console.log('OK: cartes 4+ supprimées');
  }
}

fs.writeFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', c, 'utf8');
console.log('\nDone!');
