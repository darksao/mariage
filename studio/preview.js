'use strict';

function hexToHSL(hex) {
  let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0,l=(max+min)/2;
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}
  return [h*360,s*100,l*100];
}
function hslToHex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');};return `#${f(0)}${f(8)}${f(4)}`;}

const FONTS = {
  serif:{'Cormorant Garamond':'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600','Playfair Display':'Playfair+Display:ital,wght@0,400;0,600;1,400;1,600','EB Garamond':'EB+Garamond:ital,wght@0,400;0,600;1,400;1,600','Libre Baskerville':'Libre+Baskerville:ital,wght@0,400;0,700;1,400','Lora':'Lora:ital,wght@0,400;0,600;1,400;1,600','Bodoni Moda':'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400;1,6..96,600'},
  sans:{'Montserrat':'Montserrat:wght@300;400;500;600','Raleway':'Raleway:wght@300;400;500;600','Josefin Sans':'Josefin+Sans:wght@300;400;500;600','DM Sans':'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600','Nunito':'Nunito:wght@300;400;500;600'},
};

const TEMPLATE_PATHS = {
  base:       '../template/',
  romantique: '../templates/romantique/',
  chic:       '../templates/chic/',
};

async function buildPreviewHTML(row) {
  const tpl    = row.template || 'base';
  const base   = TEMPLATE_PATHS[tpl] || TEMPLATE_PATHS.base;
  const origin = location.origin;

  const [html, css, js] = await Promise.all([
    fetch(base + 'index.html').then(r => r.text()),
    fetch(base + 'style.css').then(r => r.text()),
    fetch(base + 'script.js').then(r => r.text()),
  ]);

  const m = row.config || {};
  let out = html;

  out = out.replace('<head>', `<head>\n  <base href="${origin}/${base}" />`);
  out = out.replace(/<link[^>]+href=["']style\.css["'][^>]*>/, `<style>${css}</style>`);

  const serif    = m.theme?.font_serif || 'Cormorant Garamond';
  const sans     = m.theme?.font_sans  || 'Montserrat';
  const serifP   = FONTS.serif[serif]  || FONTS.serif['Cormorant Garamond'];
  const sansP    = FONTS.sans[sans]    || FONTS.sans['Montserrat'];
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${serifP}&family=${sansP}&display=swap`;
  out = out.replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/g, `<link href="${fontsUrl}" rel="stylesheet" />`);

  const th = m.theme || {};
  const w  = th.wine || '#6B2737';
  const [wH,wS,wL] = hexToHSL(w);
  const themeStyle = `<style>:root{
  --wine:${w};--wine-dk:${th.wine_dk||hslToHex(wH,wS,Math.max(wL-16,3))};--wine-lt:${th.wine_lt||hslToHex(wH,wS,Math.min(wL+14,80))};
  --gold:${th.gold||'#C9A96E'};--gold-lt:${th.gold_lt||'#D9BC8A'};--olive:${th.olive||'#7D8C4F'};
  --cream:${th.cream||'#F5F0E8'};--cream-dk:${th.cream_dk||'#EDE6D5'};
  --dark:${th.dark||'#1C0A06'};--dark-md:${th.dark_md||'#2C1510'};
  --text:${th.text||'#3D1F0F'};--text-lt:${th.text_lt||'#7A4F3A'};
  --serif:'${serif}',Georgia,serif;--sans:'${sans}',system-ui,sans-serif;
}</style>`;
  out = out.replace('</head>', themeStyle + '\n</head>');

  out = out.replace(/<script[^>]+src=["'](supabase-config|config|script)\.js["'][^>]*><\/script>/g, '');

  out = out.replace('</body>', `
<script>const SUPABASE_URL='';const SUPABASE_ANON_KEY='';</script>
<script>const MARIAGE=${JSON.stringify(m, null, 2)};</script>
<script>${js}</script>
<script>
if(typeof hydrate==='function')hydrate();
if(typeof setupVideo==='function')setupVideo();
if(typeof initBandeau==='function')initBandeau();
if(typeof initMap==='function')initMap();
if(typeof initLoader==='function')initLoader();
const _langs=(typeof MARIAGE!=='undefined'&&MARIAGE.langues)||['fr'];
const _ls=document.getElementById('lang-switch');
if(_ls)_ls.style.display=_langs.length<=1?'none':'';
</script>
</body>`);

  return out;
}

const $ = id => document.getElementById(id);
let blobUrl = null;

async function init() {
  const raw = sessionStorage.getItem('wedoria_current');
  if (!raw) { $('no-session').style.display = 'flex'; return; }

  let row;
  try { row = JSON.parse(raw); } catch { $('no-session').style.display = 'flex'; return; }

  const cfg      = row.config || {};
  const couple   = [cfg.prenom1, cfg.prenom2].filter(Boolean).join(' & ') || 'Aperçu';
  const tplLabel = { base:'Base', romantique:'Romantique', chic:'Chic' }[row.template] || row.template;
  $('topbar-label').textContent = `${couple} · ${tplLabel}`;

  $('btn-back').addEventListener('click', () => {
    if (row.id) history.back();
    else location.href = 'studio.html';
  });

  try {
    const html = await buildPreviewHTML(row);
    const blob = new Blob([html], { type: 'text/html' });
    blobUrl = URL.createObjectURL(blob);

    const iframe = $('preview-iframe');
    iframe.style.display = 'block';
    iframe.onload = () => { if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; } };
    iframe.src = blobUrl;

    $('btn-open-tab').addEventListener('click', async () => {
      const html2 = await buildPreviewHTML(row);
      const blob2 = new Blob([html2], { type: 'text/html' });
      const url2  = URL.createObjectURL(blob2);
      window.open(url2, '_blank');
      setTimeout(() => URL.revokeObjectURL(url2), 5000);
    });

  } catch (e) {
    $('no-session').style.display = 'flex';
    $('no-session').innerHTML = `<p>Erreur preview : ${e.message}</p><a href="clients.html" class="btn-save" style="text-decoration:none;padding:6px 14px">← Revenir à la liste</a>`;
  }
}

init();
