const fs = require('fs');
let c = fs.readFileSync('vitrine/index.html', 'utf8');

function escapeForBundle(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

// ── SEO meta tags to inject after existing <meta name="description"> ──
const SEO_TAGS = [
  '',
  '  <!-- Open Graph -->',
  '  <meta property="og:type" content="website">',
  '  <meta property="og:locale" content="fr_FR">',
  '  <meta property="og:site_name" content="Wedoria">',
  '  <meta property="og:title" content="Wedoria — Sites de mariage clé-en-main">',
  '  <meta property="og:description" content="Votre site de mariage sur-mesure, livré en 3 à 5 jours. Design premium, RSVP, galerie photos, compte à rebours. À partir de 290€.">',
  '  <meta property="og:url" content="https://wedoria.studio">',
  '  <meta property="og:image" content="https://wedoria.studio/og-preview.jpg">',
  '  <meta property="og:image:width" content="1200">',
  '  <meta property="og:image:height" content="630">',
  '',
  '  <!-- Twitter Card -->',
  '  <meta name="twitter:card" content="summary_large_image">',
  '  <meta name="twitter:title" content="Wedoria — Sites de mariage clé-en-main">',
  '  <meta name="twitter:description" content="Votre site de mariage sur-mesure, livré en 3 à 5 jours. Design premium, RSVP, galerie photos. À partir de 290€.">',
  '  <meta name="twitter:image" content="https://wedoria.studio/og-preview.jpg">',
  '',
  '  <!-- SEO technique -->',
  '  <link rel="canonical" href="https://wedoria.studio">',
  '  <meta name="robots" content="index, follow">',
  '  <meta name="author" content="Wedoria Studio">',
].join('\n');

// ── JSON-LD structured data ──
const JSONLD = [
  '',
  '  <script type="application/ld+json">',
  '  {',
  '    "@context": "https://schema.org",',
  '    "@type": "ProfessionalService",',
  '    "name": "Wedoria Studio",',
  '    "url": "https://wedoria.studio",',
  '    "description": "Création de sites de mariage clé-en-main, livrés en 3 à 5 jours. Design premium, RSVP, galerie photos, compte à rebours.",',
  '    "priceRange": "€€",',
  '    "areaServed": "FR",',
  '    "serviceType": "Site web de mariage",',
  '    "offers": [',
  '      {',
  '        "@type": "Offer",',
  '        "name": "Formule Essentielle",',
  '        "price": "290",',
  '        "priceCurrency": "EUR",',
  '        "description": "Site de mariage 1 page, livraison 3 jours, hébergement 12 mois"',
  '      },',
  '      {',
  '        "@type": "Offer",',
  '        "name": "Formule Premium",',
  '        "price": "490",',
  '        "priceCurrency": "EUR",',
  '        "description": "Site de mariage avec RSVP, galerie, livraison 5 jours, hébergement 12 mois"',
  '      }',
  '    ]',
  '  }',
  '  <\\/script>'
].join('\n');

// Insertion point: after <meta name="description" ...>
const descMeta = '<meta name=\\"description\\" content=\\"Wedoria crée votre site de mariage sur-mesure, livré en 5 jours. RSVP, galerie, compte à rebours, multilingue. À partir de 290€.\\">';
const descIdx = c.indexOf(descMeta);
if (descIdx === -1) { console.error('ERREUR: meta description introuvable'); process.exit(1); }
const afterDesc = descIdx + descMeta.length;

const seoEscaped = escapeForBundle(SEO_TAGS);
c = c.slice(0, afterDesc) + seoEscaped + c.slice(afterDesc);
console.log('OK: Open Graph + Twitter Card + SEO meta injectés');

// Insert JSON-LD before </head> (stored as unicode escape in bundle)
const headClose = '<\\u002Fhead>';
const headIdx = c.indexOf(headClose);
if (headIdx === -1) { console.error('ERREUR: </head> introuvable'); process.exit(1); }

// JSON-LD closing </script> must use unicode escape in the raw file (same trick as accordion)
// escapeForBundle turns \ into \\, so we build the escaped string then swap the closing tag
const jsonldEscaped = escapeForBundle(JSONLD)
  .replace('<\\\\/script>', '<\\u002Fscript>'); // single occurrence — no need for regex

c = c.slice(0, headIdx) + jsonldEscaped + '\\n' + c.slice(headIdx);
console.log('OK: JSON-LD structured data injecté avant </head>');

fs.writeFileSync('vitrine/index.html', c, 'utf8');
console.log('\nDone!');
