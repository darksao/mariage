const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const templates = [
  { name: 'romantique', url: 'http://localhost:3003/templates/romantique/' },
  { name: 'chic',       url: 'http://localhost:3003/templates/chic/' },
  { name: 'champetre',  url: 'http://localhost:3003/templates/champetre/' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  // Block Supabase and external requests so page doesn't hang
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('supabase') || url.includes('fonts.google') || url.includes('googleapis')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const { name, url } of templates) {
    console.log('Screenshotting', name, '...');
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
      // Short wait for CSS/fonts to render
      await new Promise(r => setTimeout(r, 1500));
      const outPath = path.join('C:/Users/nhu-s/Documents/programs/wedoria-studio/vitrine', `preview-${name}.jpg`);
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 85, fullPage: false });
      console.log('Saved:', outPath);
    } catch (e) {
      console.error('Error for', name, ':', e.message);
    }
  }

  await browser.close();
  console.log('Done!');
})();
