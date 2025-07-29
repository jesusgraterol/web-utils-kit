import { normalizeItemValue } from './transformers.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Applies the filter to the items based on the query tokens and returns a filtered list.
 * @param items
 * @param queryTokens
 * @param queryProp
 * @returns T[]
 */
const filterItemsByQueryTokens = <T>(
  items: T[],
  queryTokens: string[],
  queryProp: keyof T | undefined,
): T[] =>
  items.filter((item) => {
    const itemValue = normalizeItemValue(typeof queryProp === 'string' ? item[queryProp] : item);
    return queryTokens.some((token) => itemValue.includes(token));
  });

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { filterItemsByQueryTokens };
