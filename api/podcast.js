// NON podcast submission endpoint. The Make webhook is stored only on Vercel.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const body = req.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const instagram = String(body.instagram || '').trim().replace(/^@/, '');
  const story = String(body.story || '').trim();
  if (!emailPattern.test(email) || email.length > 254 ||
      !/^[A-Za-z0-9._]{1,30}$/.test(instagram) ||
      !story || story.length > 600) {
    return res.status(400).json({ error: 'Valid email, Instagram handle and story required' });
  }
  const webhook = process.env.MAKE_PODCAST_WEBHOOK_URL;
  if (!webhook) return res.status(503).json({ error: 'Podcast integration not configured' });
  try {
    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submittedAt: new Date().toISOString(), instagram, email, story, status: 'New' }),
      signal: AbortSignal.timeout(8000)
    });
    if (!upstream.ok) return res.status(502).json({ error: 'Application delivery failed' });
    return res.status(200).json({ ok: true });
  } catch (_) {
    return res.status(502).json({ error: 'Application delivery failed' });
  }
};
