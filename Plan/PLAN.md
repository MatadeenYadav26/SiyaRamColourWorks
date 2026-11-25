# Siya Ram Colour Works — Website Build Plan (Part 1: Frontend)

> Hand this file to Claude Code at the start of the project (save it in the project root as `PLAN.md`, or paste it into `CLAUDE.md`).
> Work one phase at a time. At the end of each phase, stop, show the result, and wait for approval before starting the next.

---

## 1. Project context

**Business:** Siya Ram Colour Works — painting and colour contracting, Surat, Gujarat.
**Established:** 1995 by Mr. Vinod Yadav. Next generation: Deepak Yadav.
**Experience:** residential, commercial and professional establishments.
**Notable work:** Simpolo, Surat Diamond Bourse, reputed cafes, commercial offices, various residential and commercial projects.
**Philosophy / tagline:** Quality in every stroke. Trust in every relationship. Excellence in every project.
**WhatsApp / phone:** +91 81538 19049 → `https://wa.me/918153819049`

**Goal of the site:** a premium, scroll-driven, animated one-page experience that turns visitors into WhatsApp enquiries and quote requests, and wins commercial clients by showing 30+ years of experience and big-name projects.

**Scope of Part 1:** frontend only. Deployment, domain and the database for the form are Part 2.

---

## 2. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Astro (static, fast, component-based) |
| Styling | Tailwind CSS |
| Scroll animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (desktop only; native scroll on touch devices) |
| Hero frame sequence | `<canvas>` driven by ScrollTrigger |
| Images | WebP/AVIF, lazy-loaded; Astro `<Image>` where possible |
| Icons | Inline SVG (WhatsApp, Instagram, Facebook, phone, mail) |

---

## 3. Design and quality rules (apply to every phase)

- **Signature effect: "paint reveal".** Content appears as if painted in (brush-stroke masks, greyscale → colour washes). Every other motion is quieter.
- One main motion per section. Durations 0.4–0.8s, ease-out.
- Animate only `transform` and `opacity`. No layout-thrashing animations.
- Respect `prefers-reduced-motion`: show a still, fully readable version.
- Mobile first. Test at 360px, 768px, 1280px, 1920px.
- Calls to action (WhatsApp, call, quote) are never hidden behind or delayed by an animation.
- Performance target: main content visible in under 2.5s on a mid-range phone on 4G; Lighthouse 90+ on Performance, Accessibility, SEO.
- Semantic HTML, alt text on every image, visible focus states, colour contrast AA.
- Use placeholder images clearly marked `PLACEHOLDER` until real photos are supplied. Never invent client names, reviews or numbers.
- Keep all business text in one content file (`src/content/site.ts` or similar) so it can be edited without touching components.

---

## 4. Phases

### Phase 1 — Information and setup

**Owner provides:**
- [ ] Logo (or approve a temporary wordmark)
- [ ] Brand colours (or approve a proposed palette)
- [ ] Hero video (painting/roller/colour transformation clip, 5–10s, landscape and ideally a vertical version for mobile)
- [ ] Real photos: Mr. Vinod Yadav, Deepak Yadav, team at work, finished projects, 2–3 before/after pairs
- [ ] Project names, locations, type and scope for the 6 project sites
- [ ] 3–5 real client reviews (with name and permission)
- [ ] Office address, email, working hours
- [ ] Instagram, Facebook and any other social links
- [ ] Confirmation that Simpolo and Surat Diamond Bourse names (and logos, if used) may be shown

**Claude Code does:**
- [ ] Create the Astro + Tailwind project, install GSAP, ScrollTrigger and Lenis
- [ ] Set up folder structure: `components/`, `sections/`, `content/`, `public/frames/`, `public/images/`
- [ ] Create the central content file with all text above
- [ ] Set up base layout: fonts, colour tokens, global styles, Lenis, reduced-motion handling
- [ ] Build a minimal sticky header (logo + nav anchors + "Get a quote" button) that shrinks on scroll

**Done when:** project runs locally, empty sections scroll smoothly, header works on mobile and desktop.

---

### Phase 2 — Hero section (scroll-driven video frames)

The hero plays a video as the visitor scrolls, Apple-style: the video is split into still frames and drawn on a canvas according to scroll position.

**Tasks:**
- [ ] Extract frames from the hero video with ffmpeg (desktop: ~120–150 frames at 1920px wide; mobile: ~60–80 frames at 1080px wide), saved as numbered WebP in `public/frames/desktop/` and `public/frames/mobile/`
- [ ] Build `HeroSequence` component: full-screen `<canvas>`, pinned with ScrollTrigger for ~2–3 screen heights, frame index mapped to scroll progress
- [ ] Preload the first frame immediately, then the rest progressively; show the first frame as a poster while loading
- [ ] Cover-fit the canvas on resize and handle device pixel ratio
- [ ] Load the mobile frame set on small screens
- [ ] Overlay text that animates in during the sequence:
  - Headline: "Quality in every stroke."
  - Sub-line: "Painting Surat's homes, offices and landmarks since 1995."
  - Buttons: "Get a free site visit" (scrolls to form) and "WhatsApp us" (opens wa.me link)
- [ ] Scroll hint (animated arrow or roller icon) at the bottom
- [ ] Reduced-motion and slow-connection fallback: a single still image with the same text and buttons
- [ ] Trust strip directly under the hero: "Since 1995 · Simpolo · Surat Diamond Bourse · Cafes · Offices", with count-up numbers once real figures are given

**Done when:** scrolling scrubs the video smoothly forward and backward at 60fps on desktop and stays smooth on a mid-range phone; text and buttons are readable at every frame.

---

### Phase 3 — Our story and vision

**Tasks:**
- [ ] Section heading with paint-reveal animation: "Our Story"
- [ ] Scroll-drawn vertical timeline (a paint line draws as you scroll), milestones fade in as the line reaches them:
  - 1995 — Mr. Vinod Yadav founds Siya Ram Colour Works in Surat
  - Growth into commercial and professional projects
  - Associated with Simpolo, Surat Diamond Bourse, reputed cafes and offices
  - Today — Deepak Yadav leads the next generation with modern techniques
- [ ] Two-generation feature: side-by-side portraits of Mr. Vinod Yadav and Deepak Yadav (greyscale → colour on scroll) with a short line each
- [ ] Vision and philosophy block: the three lines in very large type, each line filling with colour as it scrolls past
  - Quality in every stroke.
  - Trust in every relationship.
  - Excellence in every project.
- [ ] Short "what we do" strip: Residential · Commercial offices · Cafes and hospitality · Showrooms (cards fill with colour on enter, lift on hover)

**Done when:** the story reads clearly top to bottom with real photos (or marked placeholders), and every animation has a still fallback.

---

### Phase 4 — Our work and reviews

**Tasks:**
- [ ] "Our Work" section: pinned horizontal-scroll gallery of featured projects (Simpolo, Surat Diamond Bourse, cafes, offices, the 6 project sites)
- [ ] Each project card: photo, name, location, type, one-line scope; tap/click opens a lightbox with more photos
- [ ] Filter chips: All · Residential · Commercial · Hospitality
- [ ] Before/after drag slider for 2–3 transformations (touch and mouse, keyboard accessible)
- [ ] "Where we've worked" map of Surat with the 6 project pins (pins drop in one by one; tap shows the project)
- [ ] Reviews section: real client reviews only, cards that drift in on desktop and auto-slide on mobile; star rating and client name
- [ ] Optional link: "See more reviews on Google"

**Done when:** gallery, slider and map work smoothly on touch and desktop; on mobile the horizontal gallery becomes a swipeable carousel if pinning feels heavy.

---

### Phase 5 — Contact form and WhatsApp

**Tasks:**
- [ ] Contact section heading: "Planning a new look? Book a free site visit."
- [ ] Form fields: name, phone, area in Surat, property type (Home / Office / Cafe / Showroom / Other), service needed, preferred visit date, message, optional photo upload
- [ ] Client-side validation (10-digit Indian mobile number, required fields), clear error messages, success state
- [ ] For Part 1, the form submits to a stub function with a `TODO: connect to database (Part 2)` marker; as a working fallback, the submit can also open WhatsApp with the form details pre-filled
- [ ] Large "Chat on WhatsApp" and "Call now" buttons beside the form (`tel:+918153819049`)
- [ ] **Floating WhatsApp button on every page**, fixed to the bottom-right corner:
  - Official-style green WhatsApp icon, 56–64px, with shadow
  - Gentle pulse every few seconds to draw attention; scale-up and tooltip "Chat with us" on hover
  - Links to `https://wa.me/918153819049?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20painting%20work.`
  - Opens in a new tab; never overlaps the form submit button or footer links on mobile
  - Accessible label: "Chat with Siya Ram Colour Works on WhatsApp"

**Done when:** form validates and shows success, WhatsApp opens with a pre-filled message on phone and desktop, floating button is visible and usable on every screen size.

---

### Phase 6 — Footer (page end)

**Tasks:**
- [ ] Brand block: logo, one-line tagline, "Since 1995"
- [ ] Contact: phone/WhatsApp +91 81538 19049, email, office address, working hours
- [ ] Quick links: Home, Our Story, Our Work, Reviews, Contact
- [ ] Social icons: Instagram, Facebook (and others supplied)
- [ ] Small Google Map embed of the office (optional)
- [ ] Copyright line: "© 2026 Siya Ram Colour Works, Surat. All rights reserved."
- [ ] Calm, no heavy animation; a final subtle paint-stroke divider above it

**Done when:** footer is complete, links work, and the whole page passes the final checks below.

---

## 5. Final checks for Part 1

- [ ] Full scroll from hero to footer is smooth on desktop (Chrome, Safari, Edge) and on Android and iPhone
- [ ] Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO
- [ ] Reduced-motion mode shows a complete, readable site
- [ ] All placeholders listed in one place so they can be swapped for real content
- [ ] Page title, meta description and social share image set
- [ ] No console errors

---

## 6. Part 2 (later, not in this build)

- Deploy (Vercel or Netlify) and connect the domain
- Connect the form to a database (e.g. Supabase) with email/WhatsApp alerts
- Private enquiry dashboard (New → Site visited → Quoted → Won/Lost)
- Google Business Profile link, analytics, local SEO markup
