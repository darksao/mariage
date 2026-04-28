export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prenom1, prenom2, email, telephone, date_mariage, message } = body;

  if (!prenom1 || !email) {
    return new Response(JSON.stringify({ error: 'prenom1 et email sont requis' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Insérer dans Supabase
  const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ prenom1, prenom2, email, telephone, date_mariage, message }),
  });

  if (!supabaseRes.ok) {
    const err = await supabaseRes.text();
    return new Response(JSON.stringify({ error: 'Erreur Supabase', detail: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const [lead] = await supabaseRes.json();

  // 2. Email notification PM via Resend
  const dateLabel = date_mariage || 'non précisée';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Wedoria Studio <${process.env.FROM_EMAIL}>`,
      to: process.env.PM_EMAIL,
      subject: `Nouveau lead — ${prenom1}${prenom2 ? ' & ' + prenom2 : ''} (${dateLabel})`,
      text: [
        'Nouveau contact reçu sur le formulaire vitrine.',
        '',
        `Prénom(s) : ${prenom1}${prenom2 ? ' & ' + prenom2 : ''}`,
        `Email : ${email}`,
        `Téléphone : ${telephone || 'non renseigné'}`,
        `Date de mariage : ${dateLabel}`,
        '',
        'Message :',
        message || '(aucun message)',
        '',
        '→ Ouvrir l\'onboarding : https://wedoria.studio/onboarding/',
      ].join('\n'),
    }),
  });

  return new Response(JSON.stringify({ success: true, lead_id: lead.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
