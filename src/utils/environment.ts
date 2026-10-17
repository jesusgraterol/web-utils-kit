import { REDUCED_MOTION_QUERY } from './constants.js';

/**
 * Checks whether a global window object exists. It reports presence only and doesn't identify a
 * browser.
 * @returns True when the window global is defined.
 */
export const hasWindow = (): boolean => typeof window !== 'undefined';

/**
 * Checks whether a global navigator object exists. It reports presence only and doesn't identify a
 * browser: Node.js 21 and later define a global navigator too.
 * @returns True when the navigator global is defined.
 */
export const hasNavigator = (): boolean => typeof navigator !== 'undefined';

/**
 * Checks whether the IndexedDB API exists in the current environment.
 * @returns True when the indexedDB global is defined.
 */
export const isIndexedDbAvailable = (): boolean => typeof globalThis.indexedDB !== 'undefined';

/**
 * Checks whether the user asked the system to reduce motion. The view defaults to the global
 * window when one exists; pass another one, such as an element's ownerDocument.defaultView, to
 * check a different window.
 * @param view? The window whose media query is read. Defaults to the global window.
 * @returns True only when the view reports a reduced-motion preference.
 */
export const prefersReducedMotion = (
  view: { matchMedia?: (query: string) => { matches: boolean } } | null = hasWindow()
    ? window
    : null,
): boolean =>
  typeof view?.matchMedia === 'function' && view.matchMedia(REDUCED_MOTION_QUERY).matches;
