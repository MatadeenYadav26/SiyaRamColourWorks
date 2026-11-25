# Progress — Siya Ram Colour Works (key points)

_Last updated: 2026-11-25. Continue from this file; it replaces the chat history._

## Stack / server
- Astro 7 + `gsap` (ScrollTrigger) + `lenis`. Everything lives in `src/pages/index.astro`.
- Start the server in `D:\Siya_Ram_Colour_Works` with `npm run dev` (port 4321, `--host`). Stop it with `Ctrl+C`.
- Local: http://localhost:4321/ · Network: http://10.224.172.32:4321/

## Scroll animation
- 179 WebP frames in `public/frames/`; the originals in `video_animation/frames/` are unchanged.
- Canvas: full screen, cover-fit, DPR capped at 2, redraws on resize. All frames preload, and frame 1 is shown first.
- ScrollTrigger pins the canvas for `SCROLL_SCREENS=4` screen heights with `scrub: true`. In `onUpdate`: `f = progress*(COUNT-1)`, then `setFrame` and `updateText(f)`.
- Lenis runs only on non-touch devices (`window.__lenis`).
- Scene frames: home ≈ 26–64, office ≈ 72–124, logo reveal 129–150, end 179.
- On mobile the logo is kept centred during the logo reveal (desktop is fine as is).

## Welcome text (2 messages, minimal)
- `.msg.center`, frames 26–64: "Welcome Home" / "Where comfort meets *colour*". Centred, bottom 16vh.
- `.msg.left`, frames 72–124: "Offices · Cafés · Workspaces" / "Spaces built to *inspire*". Bottom-left (`left:6vw; bottom:12vh`) with a gold left border.
- Style:
  - Cream `#fffaf0` text with layered text shadows and a dark blurred radial scrim behind it.
  - Eyebrow: gold `#ffcf4a`, Montserrat 600/700.
  - Heading: Montserrat 600, gold non-italic `em`; size clamp(34px,5.2vw,76px), left clamp(32px,4.3vw,62px).
- Animation:
  - Each message fades over its `data-from`/`data-to` frames with `FADE=9`.
  - Words are wrapped in `.w` spans and staggered.
  - Slight upward drift, plus pointer parallax on desktop.

## Gotchas
- `ScrollTrigger.create` must stay **below** the text setup. Otherwise you get the TDZ error `Cannot access 'lastF'`.
- The word splitter must keep the `<em>` accents. It walks the heading's childNodes instead of using `textContent`.

## Tuning knobs
| Knob | Now | Effect |
|---|---|---|
| `SCROLL_SCREENS` | 4 | Higher = slower, longer animation |
| Lenis `lerp` | 0.1 | Lower = floatier scroll |
| `scrub` | `true` | A number (e.g. `0.5`) adds catch-up easing |
| DPR cap | 2 | Lower = faster drawing on 4K screens |
| `FADE` | 9 | Frames each text message takes to fade |

## Debug
- `window.__stats` holds `firstFrameMs`, `allLoadedMs` and `draws`. The console logs the frame load times.

## Homepage (HOMEPAGE_BRIEF.md)
- Step 1 proposal sent 2026-11-25, **waiting for OK**. Build nothing until then.
- Proposed fonts: Fraunces (headings) + Manrope (body).
- Proposed colours: paper #F4F0E8, ink #1B1B1B, muted #6F6A63, blue #1F3A8A, gold #E0A526, charcoal #1E1D1B.
- Proposed texture: SVG feTurbulence grain at 5%, plus CSS section tints (limewash, linen, concrete, charcoal).
- Proposed files: content/site.ts, layouts/Base, styles/tokens+global, one component per section, scripts/motion|cursor|magnetic.
- Hero gets moved into `Hero.astro` without changes.
- reference.jpg is missing.
- Images/: the logo and 2 portraits are there (Vinod's is AI-generated). The projects folders are empty.
- Still needed from the user: Instagram URL, address, email.
- _Update: the proposal was approved and the build has started. See Checkpoint A below._

---

## Working rule (from 2026-11-25)
- **Never delete or condense old notes in this file.** Only add new sections or mark old ones as superseded.
- Read this file at the start of each session and update it after every checkpoint.

## Homepage build — Checkpoint A (2026-11-25) · 2 of 6 steps done
1. ✅ Design system (tokens, fonts, global styles), grain texture, custom cursor, floating paint blobs.
2. ✅ Floating WhatsApp button: pulsing green circle in the bottom-right corner, "Chat with us" label on hover, slight magnetic pull. **Written but not yet checked in the browser.**
3. ⏳ Intro section ("Painting Surat since 1995"): heading, line and interior photo with a scroll-in animation. The text and image are ready; the section isn't built yet.
4. ⏳ Add the Intro section to the homepage, under the hero.
5. ⏳ Test on localhost at phone, tablet, laptop and large-screen widths. Check for console errors, that the hero scroll still works, where the WhatsApp button sits, and that the cursor is hidden on touch.
6. ⏳ Update progress.md and send the links.

Notes:
- The hero scroll animation is **unchanged**.
- The dev server shows the hero, grain, blobs and WhatsApp button. The Intro section appears after step 4.
  - Local: http://localhost:4321/
  - Phone (same Wi-Fi): http://10.224.172.32:4321/
- Next: steps 3–6, once the user says "continue".

---

## Homepage build — Checkpoint B (2026-11-25) · 3 of 6 steps done
_Supersedes the step status in Checkpoint A. Checkpoint A is kept above for history._

1. ✅ Design system: `styles/tokens.css` and `styles/global.css`, Fraunces + Manrope fonts, grain (`Grain.astro`), custom cursor (`Cursor.astro` + `scripts/cursor.ts`), floating paint blobs (`PaintBlobs.astro`), and `layouts/Base.astro`.
2. ✅ WhatsApp FAB (`WhatsAppFab.astro` + `scripts/magnetic.ts`). **Not yet checked in the browser.**
3. ✅ Intro section built in `src/components/Intro.astro`. **Not yet checked in the browser.**
   - `section#intro.intro.tint-limewash`, z-index 3, sits above the hero (z-index 2).
   - Grid is 5fr / 7fr; a single column at ≤860px.
   - Text column: label "01 — Since 1995", heading "Painting Surat / since 1995." split into lines, gold rule, lead line.
   - Image: `/images/intro-interior.webp` (1200×670), lazy-loaded.
   - Motion: GSAP timeline plays once at `top 72%`. Lines rise in, the rule draws, the image reveals with a clip-path wipe and scales from 1.18 to 1.
   - Gentle image parallax (yPercent −6, scrub). `ScrollTrigger.refresh()` runs on `load`. All motion is skipped for `prefers-reduced-motion`.
   - Content comes from `content/site.ts` → `intro`.
4. ⏳ **Next:** `src/pages/index.astro` is still the OLD 294-line test page with the inline hero script. Replace it with the Base + Hero + Intro composition. Keep the frame-1 preload in the head slot. The hero code itself stays unchanged inside `Hero.astro`.
5. ⏳ Browser test at 375 / 768 / 1366 / 1920 widths. Check:
   - no console errors
   - the hero scroll still scrubs all 179 frames
   - the Intro reveals correctly after the hero pin
   - the FAB position
   - the cursor is hidden on touch
6. ⏳ Final progress.md update, then share the links.

Still needed from the user:
- Instagram URL, address, email (marked TODO in `content/site.ts`)
- reference.jpg (missing)
- Project photos (the `Images/projects` folders are empty)

Links (once the dev server is running with `npm run dev`):
- Local: http://localhost:4321/
- Phone (same Wi-Fi): http://10.224.172.32:4321/

---

## PROGRESS — Checkpoint C: full homepage plan (2026-11-25)
_Supersedes the step status in Checkpoint B (index.astro is already Base + Hero + Intro, tested at 484/375). Older notes kept above. If compacted: read this section and continue from the next unticked item._

### DONE
- Design system (tokens.css, global.css, Fraunces + Manrope), Grain, PaintBlobs, Cursor + cursor.ts, magnetic.ts, Base layout
- Hero (unchanged scroll animation, in Hero.astro)
- Intro (01 — Since 1995)
- WhatsApp FAB
- index.astro = Base + Hero + Intro

### TODO (from HOMEPAGE_BRIEF.md)
- [x] 1. Two generations (02 — Our Story) — `Story.astro` (verified in browser 2026-11-25)
- [x] 2. Services hover list (03 — Services) — `Services.astro`
- [x] 3. Work gallery marquee (04 — Work) — `Work.astro`
- [x] 4. Promise (dark plaster, words fill on scroll) — `Promise.astro` (verified 2026-11-25)
- [x] 5. Enquiry form (05 — Get in touch) — `Enquiry.astro` (verified: validation + reveal, 2026-11-25)
- [x] 6. Footer — `Footer.astro` (verified 2026-11-25)
- [x] 7. WhatsApp FAB
- [x] 8. Cursor, paint blobs, magnetic buttons
- [ ] 9. Mobile pass 360/768, heavy hover off on touch

### DECISIONS
- Fonts: Fraunces (headings), Manrope (body), Montserrat (hero only)
- Colours: paper #F4F0E8, ink #1B1B1B, muted #6F6A63, blue #1F3A8A, gold #E0A526, charcoal #1E1D1B
- Texture: feTurbulence grain 5% + tints `.tint-limewash/linen/concrete/charcoal`
- Animation: GSAP + ScrollTrigger, Lenis (non-touch). Reveal pattern = Intro.astro (`top 72%`, once, expo.out 1.1s, line split, clip-path image wipe). Transform/opacity only. Reduced motion = static.
- Sections: `position:relative; z-index:3` (hero canvas is z 2). Radius ≤ 4px. Labels `NN — Label`.
- Folders: `src/components/*.astro`, `src/scripts/*.ts`, `src/content/site.ts` (all text), `public/images/*.webp`
- No new libraries. No database (form has `TODO: connect to database (Part 2)`).

### PLACEHOLDERS
- Vinod portrait is AI-generated → replace with a real photo
- Gallery/services images are stock (Unsplash) → replace with real project photos
- Correction (2026-11-25): work-1..7 images are crops of hero frames, not Unsplash stock — still placeholders
- Instagram URL, address, email → TODO in site.ts
- Logged in `public/images/PLACEHOLDERS.md`, credits in `public/images/CREDITS.md`

### CONTACT
- WhatsApp +91 83205 15635 (https://wa.me/918320515635)
- Instagram = INSTAGRAM_URL placeholder

---

## PROGRESS — Checkpoint D: contacts + nav bar (2026-11-25)
_Supersedes the Instagram/email placeholder notes in Checkpoint C (PLACEHOLDERS and CONTACT). Older notes kept above._

### DONE
- Instagram: `https://www.instagram.com/siya.ram.colour.works/`, handle `@siya.ram.colour.works` (site.ts → `INSTAGRAM_URL`, `footer.instagramHandle`)
- Email: `siya.ram.colour.works@gmail.com` (site.ts → `email`, footer mailto)
- Nav bar: `src/components/Nav.astro`, mounted in `layouts/Base.astro` (before `<main>`); copy in site.ts → `nav`
  - Fixed, z-index 50. Over the hero: transparent, cream text with text shadow.
  - Past the hero: `.is-solid` (paper background + hairline, ink text).
  - Moves with scroll: hides (`translateY(-100%)`) when scrolling down past 200px, comes back on scroll up.
  - Links: Story, Services, Work, Promise, Contact (#enquiry). Smooth jump via Lenis (`window.__lenis`), native fallback on touch.
  - Active link = gold underline (IntersectionObserver).
  - Mobile (≤860px or touch): Menu/Close toggle, panel with numbered serif links 01–05 + WhatsApp CTA. Escape closes.
- Browser check of the nav: **not done yet** (usage limit reached).

### STILL TODO
- [ ] Browser check of the nav (desktop + 375px): solid after hero, hide/show on scroll, mobile menu, no console errors
- [ ] 9. Mobile pass 360/768, heavy hover off on touch (cursor may still show on touch → `@media (hover:none){.cursor{display:none}}`)

### PLACEHOLDERS (remaining)
- Vinod portrait (AI-generated), work/services images (hero-frame crops), full address, reference.jpg

---

## PROGRESS — Checkpoint E: client images, logo, minimal Work (2026-11-25)
_Supersedes the work-image placeholder notes in Checkpoints C and D. Older notes kept above._

### DONE
- Unsplash MCP blocked (account email unconfirmed) → no stock images downloaded.
- Client photos `work_1` … `work_7` converted to `public/images/work-1.webp` … `work-7.webp`; used in site.ts → `work.items` (generic captions).
- `logo_final` (logo folder) → `public/images/logo.webp` (site.ts → `site.logo`); shown beside "Siya Ram" in the nav bar.
- Work section made minimal: label "04 — Work", heading "Selected work.", short captions; drag/instruction text removed.
- Image logs updated: site.ts comment, `public/images/PLACEHOLDERS.md`, `public/images/CREDITS.md` (work-1..7 + logo = client-supplied).
- Browser check (localhost:4321): 27 images, 0 broken; no console errors; logo visible in nav (~52px wide); credits link present; `#work` text = "04 — WORK / Selected work." + captions. Off-screen marquee images lazy-load (naturalWidth 0 until visible) — not broken.

### STILL TODO
- [ ] 9. Mobile pass 360/768 + cursor fix on touch (`@media (hover:none){.cursor{display:none}}`)
- [ ] Browser check of the nav (desktop + 375px): solid after hero, hide/show on scroll, mobile menu
- [ ] Footer background image
- [ ] Real Services and Intro images from the client

### PLACEHOLDERS (remaining)
- `intro-interior.webp` (from sample.png), Vinod portrait (AI-generated), Deepak portrait (source not recorded), `svc-*` hero-frame crops, full address, reference.jpg
