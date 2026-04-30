const fs = require('fs');
let c = fs.readFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', 'utf8');

function rep1(from, to) {
  const idx = c.indexOf(from);
  if (idx === -1) { console.warn('SKIP:', from.slice(0, 80)); return; }
  c = c.slice(0, idx) + to + c.slice(idx + from.length);
  console.log('OK:', from.slice(0, 60));
}

const imgStyle = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:top;';

const BASE = 'https://wedoria-darksaos-projects.vercel.app/templates';

const cards = [
  { template: 'romantique', preview: 'preview-romantique.jpg' },
  { template: 'chic',       preview: 'preview-chic.jpg' },
  { template: 'champetre',  preview: 'preview-champetre.jpg' },
];

for (const { template, preview } of cards) {
  const iframeSrc = `${BASE}/${template}/`;

  // The iframe HTML as it exists in the bundle (with \" escaping)
  const iframeFrom = `<iframe src=\\"${iframeSrc}\\" loading=\\"lazy\\" scrolling=\\"no\\" style=\\"position:absolute;top:0;left:0;width:1200px;height:1600px;border:none;pointer-events:none;transform:scale(0.315);transform-origin:top left;\\" tabindex=\\"-1\\"><\\u002Fiframe>`;

  // Replace with an img tag
  const imgTo = `<img src=\\"./${preview}\\" style=\\"${imgStyle}\\" alt=\\"Aperçu template ${template}\\" loading=\\"lazy\\">`;

  rep1(iframeFrom, imgTo);
}

fs.writeFileSync('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine/index.html', c, 'utf8');
console.log('\nDone!');
