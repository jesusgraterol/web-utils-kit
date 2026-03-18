import { normalizeItemValue } from './transformers.js';

/**
 * Applies the filter to the items based on the query tokens and returns a filtered list.
 * @param items The list of items to be filtered.
 * @param queryTokens The array of normalized query tokens to filter the items by.
 * @param queryProp The property of the item to filter by, if not provided, the whole item will be used for filtering.
 * @returns A filtered array of items that match the query tokens.
 */
export const filterItemsByQueryTokens = <T>(
  items: T[],
  queryTokens: string[],
  queryProp: keyof T | undefined,
): T[] =>
  items.filter((item) => {
    const itemValue = normalizeItemValue(typeof queryProp === 'string' ? item[queryProp] : item);
    return queryTokens.some((token) => itemValue.includes(token));
  });
