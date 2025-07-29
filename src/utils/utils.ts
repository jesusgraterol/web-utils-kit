/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Calculates the score of an item based on how many query tokens it contains.
 * @param itemValue
 * @param queryTokens
 * @returns number
 */
const calculateItemScoreByQuery = (itemValue: string, queryTokens: string[]): number =>
  queryTokens.reduce((acc, token) => acc + (itemValue.includes(token) ? token.length : 0), 0);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { calculateItemScoreByQuery };
