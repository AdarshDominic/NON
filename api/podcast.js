// NON podcast application endpoint; integration pending.
module.exports = async function handler(req, res) {
  res.setHeader('Allow', 'POST');
  return res.status(503).json({ error: 'Podcast automation not configured yet' });
};
