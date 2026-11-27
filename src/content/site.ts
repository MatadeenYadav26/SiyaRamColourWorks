// All homepage copy and contact details live here.
// TODO placeholders: full address — waiting on the client.

const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

export const site = {
  name: 'Siya Ram Colour Works',
  url: 'https://siya-ram-colour-works.vercel.app/', // update when a custom domain is added
  title: 'Siya Ram Colour Works — Painting Surat since 1995',
  description: 'Interior and exterior painting for homes, offices, cafes and landmarks in Surat since 1995.',
  phone: '+918320515635',
  phoneDisplay: '+91 83205 15635',
  whatsapp: 'https://wa.me/918320515635?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20painting%20work.',
  INSTAGRAM_URL: 'https://www.instagram.com/siya.ram.colour.works/',
  address: 'Surat, Gujarat', // TODO full address
  email: 'siya.ram.colour.works@gmail.com',
  logo: asset('images/logo.webp'),
};

export const hero = {
  messages: [
    { cls: 'center', from: 26, to: 64, eyebrow: 'Welcome Home', html: 'Where comfort meets <em>colour</em>' },
    { cls: 'left', from: 72, to: 124, eyebrow: 'Offices · Cafés · Workspaces', html: 'Spaces built to <em>inspire</em>' },
    { cls: 'end', from: 156, to: 400, eyebrow: 'Siya Ram Colour Works', html: 'Quality in every <em>stroke</em>.' },
  ],
  scrollCue: 'Scroll to paint',
  open: {
    eyebrow: 'Siya Ram Colour Works · Surat · Since 1995',
    title: { pre: 'Every city starts', em: 'grey', end: '.' },
    lead: 'Scroll down and watch our paint bring it to life.',
  },
};

// Mobile-only hero (<768px). Desktop uses the scroll sequence messages above.
export const heroMobile = {
  eyebrow: 'Painting contractors · Surat',
  title: { pre: 'Quality in every', em: 'stroke', end: '.' },
  lead: 'Homes, offices, cafés and showrooms — painted with care by one family since 1995.',
  primary: 'Book a site visit',
  secondary: 'WhatsApp',
  meta: 'Est. 1995 · Interiors · Exteriors · Commercial',
};

export const intro = {
  label: '01 — Since 1995',
  // heading renders as: pre <em>em</em>end
  heading: { pre: 'Surfaces crafted', pre2: 'to', em: 'stand out', end: '.' },
  cta: { label: 'Book Site Visit', href: '#enquiry' },
  link: { label: 'Explore Work', href: '#work' },
  lead: 'From a single room to a full commercial floor, every surface is prepared, primed and finished by hand — by a Surat family that has been doing it since 1995.',
  facts: [
    { value: '1995', label: 'Founded in Surat' },
    { value: '30+', label: 'Years of painting' },
    { value: '2', label: 'Generations, one family' },
  ],
  badge: 'Siya Ram Colour Works · Surat · ',
  badgeYear: '1995',
  // Fan-deck shades: tapping one repaints the illustrated house wall.
  chips: [
    { name: 'Mustard Yellow', color: '#E0A526' },
    { name: 'Royal Blue', color: '#2D4FA3' },
    { name: 'Terracotta', color: '#B9583D' },
    { name: 'Sage Green', color: '#8C9A7B' },
    { name: 'Ivory White', color: '#EFE8DA' },
  ],
  hint: 'Tap a shade to repaint',
  logo: asset('images/logo-final.webp'),
  art: 'Siya Ram Colour Works logo: a blue and gold house with a paint roller',
};

export const nav = {
  brand: 'Siya Ram',
  aria: 'Main',
  menu: 'Menu',
  close: 'Close',
  links: [
    { label: 'Story', href: '#story' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Promise', href: '#promise' },
    { label: 'Contact', href: '#enquiry' },
  ],
  cta: 'WhatsApp',
};

export const fab = { label: 'Chat with us', aria: 'Chat with Siya Ram Colour Works on WhatsApp' };

export const story = {
  label: '02 — Our Story',
  heading: ['Two generations,', 'one standard.'],
  line: 'Experience that started it. A new generation taking it forward.',
  hint: 'Click a portrait to meet them',
  close: 'Close',
  meet: 'Meet',
  people: [
    // PLACEHOLDER: Vinod's portrait is AI-generated — replace with a real photo.
    // TODO(client): confirm the bio text, quotes and facts below before going live.
    {
      name: 'Vinod Yadav', role: 'Founder, since 1995', src: asset('images/story-vinod.webp'), alt: 'Portrait of Vinod Yadav, founder', w: 900, h: 1125,
      eyebrow: 'The founder', bgWord: '1995',
      quote: 'Quality in every stroke. Trust in every relationship.',
      bio: [
        'Vinod Yadav started Siya Ram Colour Works in Surat in 1995, with one idea: a wall is only as good as the care that goes into it.',
        'Over three decades, that idea has carried the business from family homes to offices, cafés and landmark commercial work, including projects for Simpolo and the Surat Diamond Bourse.',
      ],
      facts: [{ k: '1995', v: 'Founded in Surat' }, { k: '30+', v: 'Years of painting' }, { k: 'Landmarks', v: 'Simpolo · Surat Diamond Bourse' }],
      more: 'Read his story',
    },
    {
      name: 'Deepak Yadav', role: 'The next generation', src: asset('images/story-deepak.webp'), alt: 'Portrait of Deepak Yadav', w: 900, h: 1125,
      eyebrow: 'The next generation', bgWord: 'Next',
      quote: 'Excellence in every project — the same standard, carried forward.',
      bio: [
        'Deepak Yadav is preparing to lead Siya Ram Colour Works into its next chapter, learning the craft and the client relationships his father built.',
        'His focus is simple: keep the standard that earned the family its name, and bring it to more homes and businesses across Surat.',
      ],
      facts: [{ k: '2nd', v: 'Generation of the family' }, { k: 'Same', v: 'Standard, every project' }, { k: 'Surat', v: 'Homes · Offices · Commercial' }],
      more: 'Read his story',
    },
  ],
};

// Client-supplied project photos (work-1..7) matched to each service.
export const services = {
  label: '03 — Services',
  heading: ['What we paint.'],
  cta: 'Get a quote',
  swipe: 'Swipe',
  items: [
    { name: 'Homes', type: 'Home', note: 'Interiors, exteriors, textures', quality: 'Careful preparation and smooth, even finishes, down to every detail.', src: asset('images/work-1.webp') },
    { name: 'Offices', type: 'Office', note: 'Workspaces finished on schedule', quality: 'Clean lines and consistent colour, applied with care around working spaces.', src: asset('images/work-2.webp') },
    { name: 'Cafes & Hospitality', type: 'Cafe', note: 'Feature walls and finishes', quality: 'Thoughtful feature walls and polished finishes that help welcome every guest.', src: asset('images/work-6.webp') },
    { name: 'Showrooms & Commercial', type: 'Showroom', note: 'Large areas, clean lines', quality: 'Even coverage and crisp edges, carefully finished across larger spaces.', src: asset('images/work-4.webp') },
  ],
};

// Client-supplied project photos (work_1..7 from the client) — captions generic.
export const work = {
  label: '04 — Work',
  index: '(04)',
  eyebrow: 'Selected work',
  heading: ["Walls we're", '<em>proud</em> to sign.'],
  lead: 'A few recent homes, offices and cafés from around Surat — each one prepared, painted and finished by Siya Ram Colour Works.',
  hint: 'Drag to explore',
  cursor: 'Drag',
  items: [
    { src: asset('images/work-1.webp'), w: 900, h: 1100, caption: 'Interior · Living room' },
    { src: asset('images/work-2.webp'), w: 1200, h: 800, caption: 'Office · Workspace' },
    { src: asset('images/work-3.webp'), w: 800, h: 800, caption: 'Interior · Detail' },
    { src: asset('images/work-4.webp'), w: 1200, h: 800, caption: 'Commercial · Open plan' },
    { src: asset('images/work-5.webp'), w: 900, h: 1100, caption: 'Interior · Feature wall' },
    { src: asset('images/work-6.webp'), w: 1200, h: 800, caption: 'Hospitality · Seating area' },
    { src: asset('images/work-7.webp'), w: 800, h: 800, caption: 'Interior · Finish' },
  ],
};

// NOTE: confirm these promises match how the business actually works before launch.
export const promise = {
  label: 'Our promise',
  lead: 'Every Siya Ram job comes with our word that it will be',
  items: [
    { title: 'Prepared properly.', text: 'Walls cleaned, filled and primed before any colour goes on.' },
    { title: 'Priced in writing.', text: 'A clear quotation before work begins — the cost is known from day one.' },
    { title: 'Finished on time.', text: 'We agree a schedule together, and we keep to it.' },
    { title: 'Left spotless.', text: 'Furniture covered, floors protected, and the space handed back clean.' },
  ],
  motto: { pre: 'Quality in every', em: 'stroke', end: '.' },
  sign: 'The Siya Ram way, since 1995',
};

export const enquiry = {
  label: '05 — Get in touch',
  heading: "Let's colour your space.",
  line: 'Tell us a little about the job. We will call back to fix a site visit.',
  types: ['Home', 'Office', 'Cafe', 'Showroom', 'Other'],
  submit: 'Request a site visit',
  whatsapp: 'Prefer WhatsApp?',
  whatsappNote: 'Message us directly and send photos of the space.',
  thanks: 'Thank you — we will be in touch shortly.',
  thanksNote: 'WhatsApp is opening with your details so you can send them straight away.',
  errors: { name: 'Please enter your name.', phone: 'Enter a valid 10-digit mobile number.', area: 'Please tell us your area.' },
};

export const footer = {
  label: '06 — Contact',
  cta: {
    lines: ['Have a wall', 'in <em>mind?</em>'],
    lead: 'Send us a photo of the space on WhatsApp, and we will take it from there.',
    badge: 'Message us on WhatsApp · Message us on WhatsApp · ',
  },
  ticker: ['Homes', 'Offices', 'Cafés', 'Showrooms', 'Exteriors', 'Interiors', 'Since 1995'],
  paintHint: 'Roll over the name to paint it',
  clockLabel: 'Surat, IN',
  backToTop: 'Back to top',
  wordmark: 'Siya Ram',
  cols: { whatsapp: 'WhatsApp', instagram: 'Instagram', studio: 'Studio', index: 'Index' },
  whatsappCta: 'Message us',
  callCta: 'or call',
  instagramHandle: '@siya.ram.colour.works',
  instagramCta: 'Recent walls, on the feed',
  links: [
    { label: 'Story', href: '#story' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Get in touch', href: '#enquiry' },
  ],
  copyright: '© 2026 Siya Ram Colour Works · Surat',
  credits: { label: 'Image credits', href: asset('images/CREDITS.md') },
};
