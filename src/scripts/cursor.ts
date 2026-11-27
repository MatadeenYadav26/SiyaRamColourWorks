import { gsap } from 'gsap';

export function initCursor() {
  const fine = matchMedia('(pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!el || !fine || reduced) return;

  document.documentElement.classList.add('has-cursor');
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  gsap.set(el, { opacity: 0 });
  el.classList.add('is-paint');

  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
    gsap.to(el, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    const t = e.target as Element | null;
    // Paint roller everywhere, except typing fields: there the normal text cursor shows
    // so visitors instantly know they can type.
    const typing = !!t?.closest('input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"]), textarea, select, [contenteditable="true"]');
    el.classList.toggle('is-typing', typing);
    el.classList.toggle('is-dragging', !!t?.closest('.marquee.is-drag'));
  }, { passive: true });

  // a small paint dab where the visitor clicks on something interactive
  window.addEventListener('pointerdown', (e) => {
    el.classList.add('is-dragging');
    // paint dab only when clicking something interactive (not when clicking into a text field)
    const t = e.target as Element | null;
    if (t?.closest('input, textarea, select') || !t?.closest('[data-cursor], .tile, .intro__art, a, button, [role="button"], label')) return;
    const dab = document.createElement('span');
    dab.className = 'cursor-dab';
    dab.style.left = `${e.clientX}px`;
    dab.style.top = `${e.clientY}px`;
    document.body.appendChild(dab);
    gsap.fromTo(dab, { scale: 0.2, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.7, ease: 'expo.out', onComplete: () => dab.remove() });
  }, { passive: true });
  window.addEventListener('pointerup', () => el.classList.remove('is-dragging'), { passive: true });
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.3 }));
}
