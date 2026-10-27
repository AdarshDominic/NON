// NON Chapter 001 waitlist relay. Deploy on Vercel; never expose MAKE_WEBHOOK_URL in client code.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const allowedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (allowedOrigin && req.headers.origin && req.headers.origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const consent = body.marketingConsent === true;
  // Honeypot: acknowledge silently; don't forward automated spam.
  if (body.website) return res.status(200).json({ ok: true });
  if (!EMAIL.test(email) || email.length > 254 || !consent) {
    return res.status(400).json({ error: 'Valid email and marketing consent required' });
  }
  const webhook = process.env.MAKE_WEBHOOK_URL;
  if (!webhook || !/^https:\/\/hook(?:\.[a-z0-9-]+)?\.make\.com\//i.test(webhook)) {
    return res.status(503).json({ error: 'Waitlist integration not configured' });
  }
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        marketingConsent: true,
        consentSource: 'NON Chapter 001 website waitlist',
        consentTimestamp: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(502).json({ error: 'Unable to process signup' });
    return res.status(200).json({ ok: true });
  } catch (_) {
    return res.status(502).json({ error: 'Unable to process signup' });
  }
};
