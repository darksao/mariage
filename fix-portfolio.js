const fs = require('fs');
let c = fs.readFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', 'utf8');

// Base URL for templates
const BASE = 'https://wedoria-darksaos-projects.vercel.app/templates';

// The iframe HTML (as it will appear in the bundle's JSON string)
// In the bundle, attributes use \" and closing tags use /
function iframeHtml(url) {
  return `<iframe src=\\"${url}\\" loading=\\"lazy\\" scrolling=\\"no\\" style=\\"position:absolute;top:0;left:0;width:1200px;height:1600px;border:none;pointer-events:none;transform:scale(0.315);transform-origin:top left;\\" tabindex=\\"-1\\"><\\u002Fiframe>`;
}

function rep1(from, to) {
  const idx = c.indexOf(from);
  if (idx === -1) { console.warn('SKIP (not found):', from.slice(0, 80)); return false; }
  c = c.slice(0, idx) + to + c.slice(idx + from.length);
  console.log('OK:', from.slice(0, 60));
  return true;
}

// For each card: replace placeholder div + update overlay link together
// Encoding key: \" in file = \\" in template literal, \n (literal) = \\n, / (literal) = \\u002F

const cards = [
  {
    icon: 'C &amp; N',
    template: 'romantique',
  },
  {
    icon: 'T &amp; M',
    template: 'chic',
  },
  {
    icon: 'A &amp; L',
    template: 'champetre',
  },
];

for (const { icon, template } of cards) {
  const url = `${BASE}/${template}/`;

  // Replace placeholder + overlay link in one shot (unique per card thanks to icon)
  const from = `<div class=\\"card-placeholder\\">\\n            <div class=\\"card-placeholder-icon\\">${icon}<\\u002Fdiv>\\n            <span>Aperçu du site<\\u002Fspan>\\n          <\\u002Fdiv>\\n          <div class=\\"card-overlay\\"><a href=\\"#contact\\" class=\\"card-overlay-link\\">Voir le site →<\\u002Fa><\\u002Fdiv>`;

  const to = `${iframeHtml(url)}\\n          <div class=\\"card-overlay\\"><a href=\\"${url}\\" class=\\"card-overlay-link\\" target=\\"_blank\\">Voir le site →<\\u002Fa><\\u002Fdiv>`;

  rep1(from, to);
}

fs.writeFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', c, 'utf8');
console.log('\nDone!');
