# NON Chapter 001 — staged waitlist automation

Status: **not live**. The current `joinForm` still posts to Formspree. The podcast `storyForm` is unchanged.

## Implemented on feature branch
- `index.html`: required, unchecked marketing-consent checkbox on the waitlist.
- `api/waitlist.js`: Vercel serverless POST endpoint accepting JSON `{"email":"test@example.com","marketingConsent":true}`; validates email and consent and forwards only to the Make webhook stored in a server-side environment variable.
- Does not send anything to Make until configured; does not automatically migrate existing Formspree subscribers.

## Required configuration before switching the form
1. In Vercel **Preview** environment, add `MAKE_WEBHOOK_URL` with the private URL generated in Make. Never commit it or paste it into public HTML/JS.
2. Optionally add `PUBLIC_SITE_ORIGIN` with the exact origin for the preview site. Note: Origin checks alone do not prevent automated abuse; add durable rate limiting and bot protection before public production exposure.
3. In Make, configure webhook → Brevo create/update contact, set list ID **3**, preserve marketing consent and ensure existing subscribers are not repeatedly welcomed.
4. Test POST to preview `/api/waitlist` and verify contact appears in Brevo, welcome message arrives once, invalid consent is rejected, and errors don't show a false success.
5. Only after verification, switch `joinForm` submission from Formspree to the new endpoint, with an explicit, reviewed rollout/rollback plan. Keep Formspree as a fallback until confirmed.

## Data handling
Collect only email, explicit consent, source, and timestamp for this waitlist. Do not send podcast story text or Instagram handles to Brevo without separate authorization. Add a privacy notice and retention policy before production launch. Formspree and Brevo should not both send welcome messages for the same submission.
