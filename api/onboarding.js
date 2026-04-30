export const config = { runtime: 'edge' };

const DELAIS = { essentielle: '3 jours', premium: '5 jours', 'sur-mesure': '10 jours' };

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

  const {
    lead_id, prenom1, prenom2, email_client,
    date_mariage, template, formule,
    couleur_primaire, couleur_secondaire, police,
    lieu, programme, infos_pratiques,
  } = body;

  if (!prenom1 || !email_client) {
    return new Response(JSON.stringify({ error: 'prenom1 et email_client sont requis' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  };

  // 1. Insérer dans projets
  const projetRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/projets`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify({
      lead_id: lead_id || null,
      prenom1, prenom2, email_client, date_mariage,
      template, formule, couleur_primaire, couleur_secondaire,
      police, lieu, programme, infos_pratiques,
    }),
  });

  if (!projetRes.ok) {
    const err = await projetRes.text();
    return new Response(JSON.stringify({ error: 'Erreur Supabase projets', detail: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const [projet] = await projetRes.json();

  // 2. Mettre à jour statut du lead si lead_id fourni
  if (lead_id) {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/leads?id=eq.${lead_id}`, {
      method: 'PATCH',
      headers: supabaseHeaders,
      body: JSON.stringify({ statut: 'signé' }),
    });
  }

  // 3. Email de confirmation au client
  const prenoms = prenom2 ? `${prenom1} et ${prenom2}` : prenom1;
  const dateLabel = date_mariage || 'date à confirmer';
  const delai = DELAIS[formule] || '5 jours';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Wedoria Studio <${process.env.FROM_EMAIL}>`,
      to: email_client,
      subject: `Votre site de mariage — on démarre !`,
      text: [
        `Bonjour ${prenoms},`,
        '',
        'Votre brief a bien été reçu — merci pour ces informations !',
        '',
        "Voici ce qu'on a retenu :",
        '',
        `  Template choisi : ${template || 'à confirmer'}`,
        `  Formule : ${formule || 'à confirmer'}`,
        `  Date de mariage : ${dateLabel}`,
        `  Lieu : ${lieu || 'à confirmer'}`,
        '',
        'Nous allons maintenant créer votre site sur cette base.',
        `Délai de livraison : ${delai}`,
        '',
        'Si vous avez des ajustements ou des précisions, répondez simplement à cet email.',
        '',
        'À très vite !',
        "L'équipe Wedoria Studio",
      ].join('\n'),
    }),
  });

  return new Response(JSON.stringify({ success: true, projet_id: projet.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
