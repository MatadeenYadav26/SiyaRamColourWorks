// Desktop-only "services finale": letters fall, paint floods, a roller wipes it
// sideways and the Work section slides in from the right. Shared so both
// sections agree on whether it is running.
export const FINALE_MQ = '(min-width: 861px) and (hover: hover) and (pointer: fine)';
export const finaleEnabled = () =>
  typeof window !== 'undefined' &&
  matchMedia(FINALE_MQ).matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;
