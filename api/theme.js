export const config = { runtime: 'edge' };

const SERIF_FONTS = ['Cormorant Garamond', 'Playfair Display', 'EB Garamond', 'Libre Baskerville', 'Lora', 'Bodoni Moda'];
const SANS_FONTS  = ['Montserrat', 'Raleway', 'Josefin Sans', 'DM Sans', 'Nunito'];

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { theme } = await req.json().catch(() => ({}));
  if (!theme) return new Response(JSON.stringify({ error: 'theme required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors() } });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY manquant' }), { status: 500, headers: { 'Content-Type': 'application/json', ...cors() } });

  const prompt = `Tu es un expert en design de sites de mariage haut de gamme.
Le thème décrit est : "${theme}"

Ta mission : choisir les paramètres visuels idéaux.
- Une couleur principale hex (la couleur dominante qui incarne le thème, sobre et élégante)
- Une police serif parmi exactement : ${SERIF_FONTS.join(', ')}
- Une police sans-serif parmi exactement : ${SANS_FONTS.join(', ')}

Réponds UNIQUEMENT avec ce JSON (aucun autre texte) :
{"hex":"#RRGGBB","serif":"Nom exact","sans":"Nom exact"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  let result = {};
  try {
    const match = text.match(/\{[^}]+\}/);
    if (match) result = JSON.parse(match[0]);
  } catch { /* malformed — return empty */ }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json', ...cors() },
  });
}
