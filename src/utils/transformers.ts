import { isArrayValid, isObjectValid } from '../validations/index.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds an array of normalized query tokens from a given query string.
 * @param query
 * @returns string[]
 */
const buildNormalizedQueryTokens = (query: string): string[] =>
  query.toLowerCase().split(' ').filter(Boolean);

/**
 * Stringifies a value so it can be compared in a case-insensitive manner.
 * @param value
 * @returns string
 */
const normalizeItemValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  if (isObjectValid(value, true)) {
    return Object.values(value).map(normalizeItemValue).join(' ');
  }
  if (isArrayValid(value, true)) {
    return value.map(normalizeItemValue).join(' ');
  }
  return value !== null && value !== undefined ? String(value).toLowerCase() : '';
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { buildNormalizedQueryTokens, normalizeItemValue };
