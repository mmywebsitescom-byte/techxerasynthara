import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function getLenis(): Lenis | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.__lenis;
}

export interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  onComplete?: () => void;
}

/**
 * Perform a silky-smooth scroll to a target element, selector, or pixel offset
 * using the global Lenis engine with exponential easing and no jitter.
 */
export function smoothScrollTo(
  target: number | string | HTMLElement,
  options?: SmoothScrollOptions
): void {
  const lenis = getLenis();
  const offset = options?.offset ?? -72; // Account for fixed navbar height
  const duration = options?.duration ?? 1.15;

  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(target, {
      offset,
      duration,
      immediate: options?.immediate ?? false,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: options?.onComplete,
    });
  } else {
    // Graceful fallback if Lenis is not active or during SSR
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    } else if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
    }

    if (options?.onComplete) {
      setTimeout(options.onComplete, (options?.immediate ? 0.05 : duration) * 1000);
    }
  }
}

/**
 * Instantly reset scroll to top and re-sync Lenis state
 */
export function resetScrollImmediate(): void {
  const lenis = getLenis();
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
  } else if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
}
