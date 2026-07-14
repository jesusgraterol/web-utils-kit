import { Exception } from 'error-message-utils';

import { ERRORS } from '../shared/errors.js';
import { stringifyJSONDeterministically } from '../transformers/index.js';
import { isIntegerValid } from '../validations/index.js';

import { canArrayBeShuffled, validateObjectAndKeys } from './validations.js';

/**
 * Creates a shallow copy of the input array and shuffles it, using a version of the Fisher-Yates
 * algorithm.
 * @param input The array to be shuffled.
 * @returns A new array with the values of the input array in a random order.
 * @throws
 * - INVALID_OR_EMPTY_ARRAY: if the input is not array or it is empty
 */
export const shuffleArray = <T>(input: Array<T>): Array<T> => {
  canArrayBeShuffled(input);
  const shuffledItems = input.slice();
  for (let currentIndex = shuffledItems.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffledItems[currentIndex], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[currentIndex],
    ];
  }
  return shuffledItems;
};

/**
 * Splits an array into smaller arrays (batches) of a given size.
 * @param items The array to be split into batches.
 * @param batchSize The size of each batch.
 * @returns An array of arrays, where each inner array is a batch of the specified size.
 * @throws
 * - INVALID_BATCH_SIZE: if the batch size is not a valid integer greater than 0
 */
export const splitArrayIntoBatches = <T>(items: T[], batchSize: number): Array<T[]> => {
  // return an empty array if there are no items
  if (!items.length) {
    return [];
  }

  // ensure the batch size is a valid integer greater than zero
  if (!isIntegerValid(batchSize, 1)) {
    throw new Exception(
      `In order to split an array into batches, the batch size must be an integer greater than 0. Received: ${batchSize}`,
      ERRORS.INVALID_BATCH_SIZE,
    );
  }

  // split the items into batches
  const batches: Array<T[]> = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += batchSize) {
    batches.push(items.slice(itemIndex, itemIndex + batchSize));
  }
  return batches;
};

/**
 * Picks a list of properties from an object and returns a new object (shallow) with the provided
 * keys.
 * @param input The object from which to pick properties.
 * @param propKeys The keys of the properties to pick.
 * @returns A new object containing only the picked properties.
 * @throws
 * - INVALID_OR_EMPTY_OBJECT: if the input is not a valid object or it is empty
 * - INVALID_OR_EMPTY_ARRAY: if the keys to be picked are not a valid array or it is empty
 */
export const pickProps = <T extends Record<string, any>, K extends keyof T>(
  input: T,
  propKeys: K[],
): Pick<T, K> => {
  validateObjectAndKeys(input, propKeys);
  return Object.fromEntries(propKeys.map((key) => [key, input[key]])) as Pick<T, K>;
};

/**
 * Omits a list of properties from an object and returns a new object (shallow) with only those
 * keys that weren't omitted
 * @param input The object from which to omit properties.
 * @param propKeys The keys of the properties to omit.
 * @returns A new object containing only the properties that were not omitted.
 * @throws
 * - INVALID_OR_EMPTY_OBJECT: if the input is not a valid object or it is empty
 * - INVALID_OR_EMPTY_ARRAY: if the keys to be omitted are not a valid array or it is empty
 */
export const omitProps = <T extends Record<string, any>, K extends keyof T>(
  input: T,
  propKeys: K[],
): Omit<T, K> => {
  validateObjectAndKeys(input, propKeys);
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !propKeys.includes(key as K)),
  ) as Omit<T, K>;
};

/**
 * Compares two objects or arrays deeply and returns true if they are equal.
 * @param firstValue The first object or array to compare.
 * @param secondValue The second object or array to compare.
 * @returns A boolean indicating whether the two values are equal.
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if any of the values isn't an object or an array
 * - UNABLE_TO_SERIALIZE_JSON: if any of the values contains data that cannot be serialized
 */
export const isEqual = (
  firstValue: Record<string, any> | Array<any>,
  secondValue: Record<string, any> | Array<any>,
): boolean =>
  stringifyJSONDeterministically(firstValue) === stringifyJSONDeterministically(secondValue);
