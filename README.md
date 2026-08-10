# Handoff: NON — "Never Off Narrative" Brand Site

## Overview
A pre-launch brand-awareness site for **NON**, a performance-streetwear label ("Never Off Narrative"). Purpose: introduce the brand's mission, tell the "why," and capture a waitlist + podcast-guest submissions ahead of the first product drop (NON Mode). Nothing is for sale yet — no cart, no checkout, no prices.

## About the Design Files
The bundled files are **not a rough mock — they are a complete, working, production-ready static site** (plain HTML/CSS/JS, no build step, no framework). Unlike a typical hifi-mock handoff, there is no "recreate this in the target stack" step required: `index.html` + `non.css` + `non.js` + `image-slot.js` + `assets/` can be committed to the `AdarshDominic/NON` GitHub repo as-is and served directly (e.g. via GitHub Pages) to go live immediately.

If the goal later is to rebuild this inside a larger app/framework (Next.js, etc.), treat this bundle as a **pixel-accurate hifi reference** — port the exact markup/CSS/JS behavior rather than reinterpreting it.

## Fidelity
**High-fidelity, functional.** All copy is final, all colors/type are final, and all interactions (nav, mobile menu, scroll reveals, value carousel, forms) are implemented and working — not placeholders.

## Screens / Views
Single scrolling page (`index.html`), sections top to bottom:

1. **Topbar** — announcement strip: "NON MODE IS COMING — THIS IS WHERE IT BEGINS — JOIN THE MOVEMENT". Background `var(--blue)`.
2. **Nav** — sticky, blurred glass background. Logo "NON" centered, links (NON Mode / Manifesto / The Code / Podcast) left, "Join" ghost button right. Collapses to a burger + full-screen `.mobile-menu` under 860px.
3. **Hero** — full-viewport-height. Left: eyebrow "Performance Streetwear", giant display headline "NEVER OFF NARRATIVE" (first two words outlined/hollow via `-webkit-text-stroke`, last word solid), subhead, two CTAs ("Join the Movement" primary, "Read the Manifesto" ghost), a 3-column meta strip (Drop / Built for / Status). Right: `<image-slot>` placeholder for a lookbook photo with corner brackets and a frame tag. Background: radial blue glow + faint ghosted brand mark + horizontal grid lines.
4. **Marquee** — infinite horizontal scroll of "Confident · Hungry · Ready · Never Off Narrative", alternating solid/outlined text, pauses on hover.
5. **Manifesto** — full-bleed blue band. Large headline quote: "We don't sell clothes. We sell the decision to start." plus supporting paragraph and a ghost CTA.
6. **Editorial ("The Story")** — two-column split. Left: a **3D flip value-carousel** (see Interactions) cycling brand-value words (Discipline, Hunger, Courage, Movement, Action, Now) on alternating blue/dark tiles. Right: "Built Different. Global Standard." copy + a 4-row spec list (fabric weight, GSM, logo placement, made-in).
7. **The NON Code ("Promise")** — 3-column grid: Confident / Hungry / Ready, each a numbered cell with a short line of copy and a small blue underline bar.
8. **Podcast ("Before They Made It")** — two-column: left is pitch copy + 3-step strip; right is a **guest-application form** — a textarea with a live 0/600 character counter, an `@`-prefixed Instagram handle input, and a submit button. On submit: resets the form and shows a toast confirming receipt.
9. **Join** — centered waitlist capture: headline "It's Never Off Narrative", email input + "Join" button, fine print. Submitting resets the form and toasts "You're in. Welcome to NON."
10. **Footer** — brand blurb, 3 link columns (NON Mode / NON / Help), bottom bar with copyright + social links.
11. **Toast** — fixed bottom-center confirmation pill, shared by both forms.

## Interactions & Behavior
- **Scroll reveals**: elements with `.reveal` fade+slide up via `IntersectionObserver`, triggered once at 12% visibility, staggered with inline `transition-delay`.
- **Value carousel**: `.val-face` elements are absolutely stacked; JS (`non.js`) toggles an `.active` class every 2600ms, cycling through them one at a time. CSS transitions `transform` (rotateY 90deg → 0) and `opacity` for a flip-in effect. Respects `prefers-reduced-motion`.
- **Marquee**: pure CSS `@keyframes scroll` translating `-50%`, `animation-play-state: paused` on hover.
- **Mobile menu**: burger toggles `.open` class on `.mobile-menu` (full-screen overlay), closes on link click or `Escape`.
- **Podcast form**: character counter updates on `input`; `submit` prevents default, reads the Instagram field (strips leading `@`), resets the form, shows toast `Story received, @handle. We'll be in touch.`
- **Join form**: `submit` prevents default, resets form, shows toast `You're in. Welcome to NON.`
- **Toast**: `.toast.show` class toggled, auto-hides after 2200ms via `setTimeout`.
- No client-side or server-side persistence exists for either form — both are front-end only. A real backend/form service (e.g. Formspree, a serverless function, or a CRM webhook) is needed before launch to actually collect submissions.
- **Responsive breakpoints**: 1080px (grid/meta adjust), 860px (nav → burger, hero/editorial stack to 1 column), 520px (further stacking, join form goes vertical).

## State Management
No app framework/state library — plain DOM + a few closures in `non.js`. State is transient (in-memory only, lost on refresh): character count, active carousel face, open/closed menu.

## Design Tokens
Defined as CSS custom properties in `non.css` `:root`:

**Colors**
- `--ink: #08080a` (page background)
- `--ink-1: #0c0d10`, `--ink-2: #121319`, `--ink-3: #181a22` (surface layers)
- `--line: rgba(255,255,255,.10)`, `--line-soft: rgba(255,255,255,.06)` (hairline borders)
- `--blue: #1f44c7` (primary brand blue, from the embroidered logo)
- `--blue-bright: #3d6bf0`, `--glow: #5b9bff`, `--blue-deep: #142f8e`
- `--bone: #f4f5f7` (off-white text), `--white: #ffffff`
- `--gray: #9ca1ac`, `--gray-dim: #6b6f79`

**Typography**
- Display: `'Archivo', system-ui, sans-serif` — weights 400–900, used uppercase for headlines/buttons
- Mono: `'IBM Plex Mono', ui-monospace, monospace` — used for eyebrows, labels, prices/specs, all uppercase with heavy letter-spacing (`.14em`–`.28em`)
- Both loaded via Google Fonts `@import` at the top of `non.css`

**Spacing / Layout**
- Max content width: `--maxw: 1320px`
- Side gutter: `--gut: clamp(20px, 5vw, 72px)`
- Section vertical padding: `clamp(72px, 9vw, 128px)`

**Other**
- No border-radius anywhere — the brand language is sharp/hairline-edged, not rounded
- Buttons: `.btn--primary` (filled blue) and `.btn--ghost` (outlined) — mono uppercase label, `.18em` letter-spacing

## Assets
- `assets/non-mark.png` — cropped/padded brand monogram (blue embroidery mark on near-black), sampled directly from the user-supplied logo photo, used ghosted behind the hero copy.
- `image-slot.js` — a small custom element (`<image-slot>`) providing drag-and-drop image placeholders (hero lookbook photo, editorial photo originally — now replaced by the value carousel). Still loaded/used for the hero slot.
- Google Fonts (Archivo, IBM Plex Mono) loaded via CDN `@import` — no local font files.

## Files
- `index.html` — page markup (originally `NON Home.html`)
- `non.css` — all styles, design tokens, responsive rules
- `non.js` — all interactivity (forms, toast, carousel, menu, reveals)
- `image-slot.js` — reusable image-placeholder web component
- `assets/non-mark.png` — brand mark asset

## Deployment note
Simplest path to "live": push this folder's contents to the root of `AdarshDominic/NON` on GitHub, rename `index.html` if needed (already named correctly), enable **GitHub Pages** (Settings → Pages → deploy from `main` branch, root folder). No build step required.
