# Homepage Brief — Siya Ram Colour Works

Read this whole brief before writing any code. The hero scroll animation (canvas + frames in public/frames/) is already built and tested — keep it exactly as it works now and build the rest of the homepage around it.

---

## 0. Reference

- My design reference is saved in this folder as `reference.jpg`. Open it and study it: layout, spacing, typography scale, how images are placed, how much empty space there is.
- Take the *feeling* from it — minimal, classy, airy. Do not copy it element for element.

---

## 1. The feeling we want

Minimal. Classy. Calm but alive. Like a high-end interior design studio or an architecture firm, not a typical contractor site.

- Less words, more understanding. Every section should be understood in 3 seconds, mostly from images and one short line.
- Everything reacts to the mouse: hover, movement, scroll. Nothing feels static, nothing feels busy.
- Smooth, slow, confident transitions. Nothing bounces, nothing flashes.

---

## 2. It must NOT look AI-generated

Avoid every one of these:

- Purple/blue gradient backgrounds, neon glows, glassmorphism cards, glowing borders
- Rows of three identical cards with an icon on top
- Emojis or generic icon packs as decoration
- Everything centred; perfectly symmetrical grids everywhere
- Generic copy: "Elevate", "Unlock", "Seamless", "Transform your space", "Welcome to…", "We are passionate about…"
- Default Tailwind look (rounded-2xl cards with soft shadows everywhere)
- Stock-looking hero text over a dark overlay

Do this instead:

- Editorial layouts: asymmetric, large type next to large images, generous white space
- Small uppercase labels with section numbers (`01 — Our Story`), thin hairline rules
- Big serif headlines, small clean sans-serif body text
- Images with sharp or very slightly rounded corners (max 4px), no heavy shadows
- Text set left-aligned, short lines, real hierarchy
- Real textures and real photography do the decorating

---

## 3. Design system

**Background**
- Base: a warm off-white paper/limewash texture (around `#F4F0E8`), with a very subtle grain (SVG noise filter or a tiny tiling texture image at ~4–6% opacity). It should feel like a freshly plastered, matte wall, not flat white.
- Some sections can switch to a different subtle texture to separate them: soft limewash, fine linen, light concrete or a deep charcoal plaster for one contrast section (e.g. the philosophy section). Keep all textures very subtle and light in file size.

**Colours**
- Ink: near-black charcoal (around `#1B1B1B`) for text
- Muted grey (around `#6F6A63`) for secondary text
- Accent 1: deep royal blue; Accent 2: warm golden yellow. Use them sparingly — in paint elements, hover states, one word in a headline, the underline of a link. Never as big flat blocks of colour.

**Typography**
- Headlines: an elegant editorial serif (e.g. Fraunces, Cormorant Garamond or Playfair Display — pick the one that suits the reference best, show me first)
- Body and labels: a clean, modern sans-serif (e.g. Manrope or Satoshi/General Sans)
- Large size contrast: headlines very big, body small and quiet

**Spacing**
- Lots of air. Sections breathe. Generous margins on desktop.

---

## 4. Motion and interaction (everywhere)

- **Smooth scroll** with Lenis (desktop), GSAP ScrollTrigger for scroll animations.
- **Text reveals**: headlines rise in line by line from behind a mask as they enter.
- **Image reveals**: images uncover with a clip-path wipe, like a roller painting them in, with a slight scale-down from 1.1 to 1.
- **Custom cursor (desktop only)**: a small ink dot. Over images it grows into a soft paint blob with a word inside ("View", "Drag"). Over links and buttons it grows slightly. Hide it on touch devices.
- **Magnetic buttons**: buttons gently pull toward the cursor when it's near.
- **Image hover**: slow zoom (1 → 1.05) and a subtle colour-wash shift.
- **Link hover**: a hand-painted brush-stroke underline draws in.
- **Moving paint elements**: a few soft, organic paint blobs and thin paint ribbons (SVG, in the two accent colours, low opacity) that drift slowly in the background, move with parallax on scroll and shift slightly with the mouse. Subtle — they add life, never distract from content.
- **Section transitions**: a soft paint-wash reveal between some sections (a colour sweep that clears to show the next section).
- Durations 0.6–1.2s, ease-out (e.g. `power3.out` / `expo.out`). No bounce.
- `prefers-reduced-motion`: turn off parallax, cursor effects and drifting elements; show content still and readable.
- On phones: hover effects become tap or gentle automatic animations; keep it light and fast.

---

## 5. Homepage sections (top to bottom)

Copy lines are final unless marked. Keep words to a minimum.

### 01 — Hero (already built)
- The tested canvas scroll animation, ending on the painted brand name.
- After the last frame, fade in only: a small line "Quality in every stroke." and a thin animated scroll cue.

### 02 — Intro
- Label: `01 — Since 1995`
- Headline (serif, big): **Painting Surat since 1995.**
- One line under it: *Homes, offices, cafes and landmarks — finished with care.*
- Beside it, one tall image (freshly painted interior) with the clip-path reveal.

### 03 — Two generations
- Label: `02 — Our Story`
- Two portraits side by side, slightly offset in height (asymmetric):
  - **Vinod Yadav** — *Founder, since 1995*
  - **Deepak Yadav** — *The next generation*
- Portraits start in black and white and turn to colour on hover (and on scroll into view on phones).
- One short line under: *Experience that started it. A new generation taking it forward.*

### 04 — What we do
- Label: `03 — Services`
- A minimal, large-type list, one service per row, separated by hairline rules:
  - Homes
  - Offices
  - Cafes & Hospitality
  - Showrooms & Commercial
- On hover over a row: the row's text shifts slightly, and a matching photo appears and floats with the cursor (follows the mouse smoothly). On phones: each row shows a small image beside it instead.

### 05 — Our work
- Label: `04 — Work`
- Small line: *Trusted on projects for Simpolo, Surat Diamond Bourse, cafes and offices across Surat.*
- An auto-sliding gallery of work photos (continuous slow marquee):
  - Slows down and pauses on hover; can be dragged sideways (cursor shows "Drag")
  - Images of different widths for a natural, editorial rhythm
  - Each image has a tiny caption on hover (project type and area)
- Placeholder images for now (see section 7).

### 06 — Our promise
- On the contrasting dark charcoal plaster texture.
- Three lines in very large serif type, each filling with colour (blue/gold) word by word as you scroll:
  - Quality in every stroke.
  - Trust in every relationship.
  - Excellence in every project.

### 07 — Enquiry form
- Label: `05 — Get in touch`
- Headline: **Let's colour your space.**
- A minimal form, no boxes: inputs are just a thin bottom line that turns into a painted stroke when focused.
  - Name
  - Phone (10-digit Indian mobile, validated)
  - Area in Surat
  - Property type (selectable chips: Home / Office / Cafe / Showroom / Other)
  - Message (optional)
  - Submit button: "Request a site visit" (magnetic)
- On submit: validate, show a calm thank-you message with a small paint-splash animation, and open WhatsApp with the details pre-filled as a working fallback.
- Leave a clear `TODO: connect to database (Part 2)` in the submit handler. Do not set up any database now.
- Beside the form: "Prefer WhatsApp?" with a direct WhatsApp button.

### 08 — Footer
- A very large brand wordmark "Siya Ram Colour Works" across the footer, with a paint-stroke reveal on scroll.
- Small columns: WhatsApp / phone, Instagram, Surat address (placeholder), quick links.
- Bottom line: `© 2026 Siya Ram Colour Works · Surat` and a small Unsplash photo-credits link.

### Floating WhatsApp button (on every screen)
- Bottom-right corner, circular, WhatsApp green with the WhatsApp icon, subtle shadow.
- Gentle pulse every few seconds; on hover it grows slightly and shows "Chat with us".
- Link: `https://wa.me/918320515635?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20painting%20work.`
- Must never cover the form's submit button on phones.

---

## 6. Business details

- WhatsApp / phone: **+91 83205 15635** → `https://wa.me/918320515635`, `tel:+918320515635`
- Instagram: put a placeholder `INSTAGRAM_URL` in the content file and ask me for the link.
- Address, email: placeholders, ask me.
- Keep ALL text in one content file so I can edit it without touching components.

---

## 7. Images for now

- Use the Unsplash MCP to find high-quality placeholder photos: freshly painted modern Indian homes, painter with roller, modern office interiors, cosy cafe interiors with textured walls, tiled showrooms, paint texture close-ups. Prefer warm, natural, editorial photos — no cheesy stock photos with people smiling at the camera.
- Download into `public/images/`, convert to WebP, keep a credits file, and show the required Unsplash credits in the footer link.
- **Portraits of Vinod Yadav and Deepak Yadav: do NOT search the internet for them** — any result would be a different person with the same name. Use a tasteful neutral placeholder (e.g. a painter-at-work photo from behind, or a plain textured frame with their name) and mark it clearly. I will upload their real photos.
- Work gallery photos are temporary placeholders and must not be described as our projects in any caption until I replace them. List every placeholder in `PLACEHOLDERS.md`.

---

## 8. Quality bar

- Smooth at 60fps on desktop, light on phones. Animate only transform and opacity.
- Lazy-load images below the fold, WebP, correct sizes.
- Semantic HTML, alt text, keyboard-friendly form, good contrast.
- Test at 360px, 768px, 1280px and 1920px wide.

---

## 9. How we work

1. First, show me: the chosen fonts, colour values, background texture approach and a short list of files/components you will create. Wait for my OK.
2. Then build in three checkpoints. After each one, keep the local server running, give me the localhost link (and the network link for my phone), and stop for my feedback:
   - **Checkpoint A:** design system, textured background, custom cursor, floating paint elements, Intro section, floating WhatsApp button
   - **Checkpoint B:** Two generations, What we do, Our work gallery
   - **Checkpoint C:** Our promise, Enquiry form, Footer, final polish on mobile
3. Do not add anything not in this brief without asking.
