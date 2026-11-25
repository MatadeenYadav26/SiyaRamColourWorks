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

  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
    gsap.to(el, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    const t = e.target as Element | null;
    const paint = !!t?.closest('[data-cursor], .reveal, .tile, .intro__logo');
    const dragging = !!t?.closest('.marquee.is-drag');
    const link = !paint && !!t?.closest('a, button');
    const dark = !!t?.closest('.tint-charcoal, #hero');
    el.classList.toggle('is-paint', paint);
    el.classList.toggle('is-dragging', dragging);
    el.classList.toggle('is-link', link);
    el.classList.toggle('is-dark', dark);
  }, { passive: true });

  window.addEventListener('pointerdown', () => el.classList.add('is-dragging'), { passive: true });
  window.addEventListener('pointerup', () => el.classList.remove('is-dragging'), { passive: true });
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.3 }));
}
