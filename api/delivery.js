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

  const { projet_id, url_site } = body;

  if (!projet_id || !url_site) {
    return new Response(JSON.stringify({ error: 'projet_id et url_site sont requis' }), {
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

  // 1. Récupérer le projet
  const getRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/projets?id=eq.${projet_id}&select=*`,
    { headers: supabaseHeaders },
  );

  if (!getRes.ok) {
    return new Response(JSON.stringify({ error: 'Projet introuvable' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const projets = await getRes.json();
  if (!projets.length) {
    return new Response(JSON.stringify({ error: 'Projet introuvable' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const projet = projets[0];

  // 2. Marquer comme livré
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/projets?id=eq.${projet_id}`, {
    method: 'PATCH',
    headers: supabaseHeaders,
    body: JSON.stringify({ statut: 'livré', url_site, livre_at: new Date().toISOString() }),
  });

  // 3. Email de livraison au client
  const prenoms = projet.prenom2 ? `${projet.prenom1} et ${projet.prenom2}` : projet.prenom1;
  const isPremium = ['premium', 'sur-mesure'].includes(projet.formule);

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Wedoria Studio <${process.env.FROM_EMAIL}>`,
      to: projet.email_client,
      subject: `Votre site est en ligne !`,
      text: [
        `Bonjour ${prenoms},`,
        '',
        'Votre site de mariage est prêt — et il est magnifique.',
        '',
        `→ Voir votre site : ${url_site}`,
        '',
        'Pour partager le lien avec vos invités, copiez simplement cette adresse :',
        url_site,
        '',
        'Ce que vos invités trouveront :',
        '  - Les informations pratiques (lieu, horaires, programme)',
        '  - Le compte à rebours jusqu\'au grand jour',
        ...(isPremium ? ['  - Le formulaire RSVP', '  - La galerie photos'] : []),
        '',
        "Besoin d'une modification ? Répondez à cet email, on s'en occupe.",
        '',
        'Félicitations pour votre mariage — on est ravis d\'en faire partie !',
        '',
        "L'équipe Wedoria Studio",
      ].join('\n'),
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
