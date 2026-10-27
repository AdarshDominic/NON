/* ===========================================================
   NON — homepage interactions (brand-awareness stage, no sales)
   =========================================================== */
(function () {
  'use strict';

  const $ = s => document.querySelector(s);

  /* ---- Toast ---- */
  let toastTimer;
  const toastEl = $('#toast'), toastMsg = $('#toastMsg');
  function toast(msg) {
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---- Mobile menu ---- */
  const menu = $('#mobileMenu'), burger = $('#burger');
  function closeMenu(){ menu.classList.remove('open'); }
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---- Podcast story submission ---- */
  const storyText = $('#storyText'), storyCount = $('#storyCount');
  storyText.addEventListener('input', () => {
    storyCount.textContent = storyText.value.length + ' / 600';
  });
  $('#storyForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const ig = $('#storyIg').value.trim().replace(/^@/, '');
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending\u2026';
    try {
      const res = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          instagram: ig,
          email: form.querySelector('input[name="email"]').value.trim(),
          story: storyText.value.trim()
        })
      });
      if (!res.ok) throw new Error('bad response');
      form.reset();
      storyCount.textContent = '0 / 600';
      toast('Story received, @' + ig + '. We\u2019ll be in touch.');
    } catch (err) {
      toast('Something went wrong \u2014 try again in a bit.');
    } finally {
      btn.disabled = false; btn.textContent = orig;
    }
  });

  /* ---- Newsletter / waitlist ---- */
  $('#joinForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending\u2026';
    try {
      const email = form.querySelector('input[name="email"]').value.trim();
      const consent = form.querySelector('input[name="marketingConsent"]').checked;
      if (!consent) throw new Error('consent required');
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, marketingConsent: consent })
      });
      if (!res.ok) throw new Error('bad response');
      form.reset();
      toast("You're in. Welcome to NON.");
    } catch (err) {
      toast('Something went wrong \u2014 try again in a bit.');
    } finally {
      btn.disabled = false; btn.textContent = orig;
    }
  });

  /* ---- Value carousel (editorial) — one face visible at a time ---- */
  const valFaces = document.querySelectorAll('.val-face');
  if (valFaces.length) {
    let vi = 0;
    valFaces[0].classList.add('active');
    setInterval(() => {
      valFaces[vi].classList.remove('active');
      vi = (vi + 1) % valFaces.length;
      valFaces[vi].classList.add('active');
    }, 2600);
  }

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
