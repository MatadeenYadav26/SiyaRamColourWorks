// All homepage copy and contact details live here.
// TODO placeholders: full address — waiting on the client.

const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

export const site = {
  name: 'Siya Ram Colour Works',
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
    { cls: 'end', from: 160, to: 185, eyebrow: 'Siya Ram Colour Works', html: 'Quality in every <em>stroke</em>.' },
  ],
  scrollCue: 'Scroll',
};

export const intro = {
  label: '01 — Since 1995',
  // heading renders as: pre <em>em</em>end
  heading: { pre: 'Surfaces crafted to', em: 'stand out', end: '.' },
  cta: { label: 'Book Site Visit', href: '#enquiry' },
  link: { label: 'Explore Work', href: '#work' },
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
  people: [
    // PLACEHOLDER: Vinod's portrait is AI-generated — replace with a real photo.
    { name: 'Vinod Yadav', role: 'Founder, since 1995', src: asset('images/story-vinod.webp'), alt: 'Portrait of Vinod Yadav, founder', w: 900, h: 1125 },
    { name: 'Deepak Yadav', role: 'The next generation', src: asset('images/story-deepak.webp'), alt: 'Portrait of Deepak Yadav', w: 900, h: 1125 },
  ],
};

// Client-supplied project photos (work-1..7) matched to each service.
export const services = {
  label: '03 — Services',
  heading: ['What we paint.'],
  items: [
    { name: 'Homes', note: 'Interiors, exteriors, textures', src: asset('images/work-1.webp') },
    { name: 'Offices', note: 'Workspaces finished on schedule', src: asset('images/work-2.webp') },
    { name: 'Cafes & Hospitality', note: 'Feature walls and finishes', src: asset('images/work-6.webp') },
    { name: 'Showrooms & Commercial', note: 'Large areas, clean lines', src: asset('images/work-4.webp') },
  ],
};

// Client-supplied project photos (work_1..7 from the client) — captions generic.
export const work = {
  label: '04 — Work',
  heading: ['Selected', 'work.'],
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

export const promise = {
  label: 'Our promise',
  lines: ['Quality in every stroke.', 'Trust in every relationship.', 'Excellence in every project.'],
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
