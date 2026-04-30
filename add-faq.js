const fs = require('fs');
let c = fs.readFileSync('vitrine/index.html', 'utf8');

function escapeForBundle(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

// ── Section FAQ ──
const faqItems = [
  {
    q: 'Est-ce que mon site est vraiment personnalisé ?',
    a: 'Oui, chaque site est créé sur mesure à partir de vos informations : prénoms, date, lieu, programme, couleurs et photos. Aucun site ne ressemble à un autre.'
  },
  {
    q: 'Combien de temps faut-il pour recevoir mon site ?',
    a: 'En 3 jours ouvrés pour la formule Essentielle, 5 jours pour Premium, et jusqu’à 10 jours pour Sur-mesure. Vous recevez un email avec le lien de votre site dès qu’il est prêt.'
  },
  {
    q: 'Puis-je demander des modifications après livraison ?',
    a: 'Oui. Pour ajuster un texte, changer une photo ou modifier le programme, il vous suffit de répondre à l’email de livraison. Les ajustements mineurs sont inclus dans toutes les formules.'
  },
  {
    q: 'Vos sites fonctionnent-ils bien sur mobile ?',
    a: 'Absolument. Tous nos sites sont conçus en mobile-first — vos invités les consulteront principalement depuis leur téléphone, et chaque élément est optimisé pour ça.'
  },
  {
    q: 'Que devient le site après le mariage ?',
    a: 'Votre site reste en ligne pendant 12 mois. Vous pouvez l’utiliser comme galerie souvenir à partager avec vos proches. Au-delà, nous vous proposons une extension d’hébergement si vous souhaitez le conserver.'
  }
];

const iconStyle = 'flex-shrink:0;width:22px;height:22px;border:1.5px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform 0.3s;font-size:0.9rem;color:var(--gold);';
const btnStyle  = 'width:100%;text-align:left;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-family:var(--font-display);font-size:1.25rem;font-weight:500;color:var(--charcoal);letter-spacing:0.02em;';
const ansStyle  = 'padding-top:1rem;font-family:var(--font-body);font-size:1rem;line-height:1.75;color:var(--text-muted);';

function buildItem(item, idx, isLast) {
  const borderStyle = isLast
    ? 'padding:1.75rem 0;'
    : 'border-bottom:1px solid rgba(201,169,110,0.3);padding:1.75rem 0;';
  const delay = idx * 80;
  return [
    '<div class="faq-item" data-reveal="" data-delay="' + delay + '" style="' + borderStyle + '">',
    '  <button class="faq-q" aria-expanded="false" style="' + btnStyle + '">',
    '    ' + item.q,
    '    <span class="faq-icon" aria-hidden="true" style="' + iconStyle + '">+</span>',
    '  </button>',
    '  <div class="faq-a" hidden style="' + ansStyle + '">',
    '    ' + item.a,
    '  </div>',
    '</div>'
  ].join('\n');
}

const itemsHtml = faqItems.map((item, i) => buildItem(item, i, i === faqItems.length - 1)).join('\n\n');

const faqSection = [
  '<!-- ========== FAQ ========== -->',
  '<section id="faq" style="background:var(--warm);padding:6rem 0;">',
  '  <div class="container">',
  '    <div class="text-center" style="margin-bottom:3.5rem">',
  '      <span class="section-label" data-reveal="">On répond à vos questions</span>',
  '      <h2 class="section-title" data-reveal="" data-delay="100">Questions fréquentes</h2>',
  '    </div>',
  '    <div class="faq-list" style="max-width:780px;margin:0 auto;">',
  itemsHtml,
  '    </div>',
  '  </div>',
  '</section>',
  ''
].join('\n');

// Accordion JS — just the code, no script tags (added separately with correct encoding)
const accordionJS = [
  'document.querySelectorAll(".faq-q").forEach(function(btn) {',
  '  btn.addEventListener("click", function() {',
  '    var item = btn.closest(".faq-item");',
  '    var answer = item.querySelector(".faq-a");',
  '    var icon = item.querySelector(".faq-icon");',
  '    var isOpen = btn.getAttribute("aria-expanded") === "true";',
  '    document.querySelectorAll(".faq-q").forEach(function(b) {',
  '      b.setAttribute("aria-expanded", "false");',
  '      b.closest(".faq-item").querySelector(".faq-a").hidden = true;',
  '      b.closest(".faq-item").querySelector(".faq-icon").style.transform = "";',
  '    });',
  '    if (!isOpen) {',
  '      btn.setAttribute("aria-expanded", "true");',
  '      answer.hidden = false;',
  '      icon.style.transform = "rotate(45deg)";',
  '    }',
  '  });',
  '});'
].join('\n');

// ── Insert FAQ before CONTACT ──
const CONTACT_MARKER = '<!-- ========== CONTACT ========== -->';
const contactEscaped = escapeForBundle(CONTACT_MARKER);
const faqEscaped     = escapeForBundle(faqSection);

const idx1 = c.indexOf(contactEscaped);
if (idx1 === -1) { console.error('ERREUR: marker CONTACT introuvable'); process.exit(1); }
c = c.slice(0, idx1) + faqEscaped + c.slice(idx1);
console.log('OK: section FAQ inseree avant CONTACT');

// ── Insert accordion JS before </body> ──
// Closing </script> must be stored as </script> in the raw file
// so JSON.parse decodes it to </script> (unicode / = /)
// and the outer <script type="__bundler/template"> parser sees <\ not </ so it stays open.
const bodyClose = '<\\u002Fbody>';
const accordionContentEscaped = escapeForBundle(accordionJS);
// Wrap with <script>...</script> using correct encoding for the bundler:
// - opening: <script>\n  (literal in file, fine since HTML parser handles type-less script tags)
// - closing: </script> in file → JSON.parse gives </script> → DOMParser closes the script
//   The outer <script type="__bundler/template"> sees </ (backslash) not </ so stays open.
const accordionBlock = '<script>\\n' + accordionContentEscaped + '\\n<\\u002Fscript>';
const idx2 = c.indexOf(bodyClose);
if (idx2 === -1) { console.error('ERREUR: </body> introuvable'); process.exit(1); }
c = c.slice(0, idx2) + accordionBlock + '\\n' + c.slice(idx2);
console.log('OK: accordion JS ajoute avant </body>');

// ── Add FAQ nav link before Contact in navbar ──
const contactNavLink = '<li><a href=\\"#contact\\">Contact<\\u002Fa><\\u002Fli>';
const faqNavLink     = '<li><a href=\\"#faq\\">FAQ<\\u002Fa><\\u002Fli>';
const navIdx = c.indexOf(contactNavLink);
if (navIdx !== -1 && !c.includes(faqNavLink)) {
  c = c.slice(0, navIdx) + faqNavLink + '\\n    ' + c.slice(navIdx);
  console.log('OK: lien FAQ ajoute dans la navbar');
} else {
  console.warn('SKIP: nav link');
}

fs.writeFileSync('vitrine/index.html', c, 'utf8');
console.log('\nDone!');
