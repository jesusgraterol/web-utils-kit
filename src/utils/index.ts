import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { encodeError } from 'error-message-utils';
import { IUUIDVersion } from '../shared/types.js';
import { ERRORS } from '../shared/errors.js';
import { stringifyJSONDeterministically } from '../transformers/index.js';
import { IFilterByQueryOptions, ISortDirection } from './types.js';
import { canArrayBeShuffled, validateObjectAndKeys } from './validations.js';
import { buildNormalizedQueryTokens } from './transformers.js';
import { filterItemsByQueryTokens } from './utils.js';

/* ************************************************************************************************
 *                                           GENERATORS                                           *
 ************************************************************************************************ */

/**
 * Generates a UUID based on a version.
 * @param version
 * @returns string
 */
const generateUUID = (version: IUUIDVersion): string => {
  if (version === 7) {
    return uuidv7();
  }
  return uuidv4();
};

/**
 * Generates a string from randomly picked characters based on the length.
 * @param length
 * @param characters?
 * @returns string
 */
const generateRandomString = (
  length: number,
  characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string => {
  let result = '';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
};

/**
 * Generates a random number (decimal) constrained by the range.
 * @param min
 * @param max
 * @returns number
 */
const generateRandomFloat = (min: number, max: number): number => {
  const value = Math.random() * (max - min + 1) + min;
  return value > max ? max : value;
};

/**
 * Generates a random number (integer) constrained by the range.
 * @param min
 * @param max
 * @returns number
 */
const generateRandomInteger = (min: number, max: number): number =>
  Math.floor(generateRandomFloat(min, max));

/**
 * Generates a sequence of numbers within a range based on a number of steps.
 * @param start
 * @param stop
 * @param step?
 * @returns number[]
 */
const generateSequence = (start: number, stop: number, step: number = 1): number[] =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/* ************************************************************************************************
 *                                         SORTING UTILS                                          *
 ************************************************************************************************ */

/**
 * Orders two string values based on a sorting direction.
 * @param a
 * @param b
 * @param direction
 * @returns number
 */
const __sortStringValues = (a: string, b: string, direction: ISortDirection): number => {
  const _a = a.toLocaleLowerCase();
  const _b = b.toLocaleLowerCase();
  if (_a > _b) {
    return direction === 'asc' ? 1 : -1;
  }
  if (_b > _a) {
    return direction === 'asc' ? -1 : 1;
  }
  return 0;
};

/**
 * Orders two number values based on a sorting direction.
 * @param a
 * @param b
 * @param direction
 * @returns number
 */
const __sortNumberValues = (a: number, b: number, direction: ISortDirection): number =>
  direction === 'asc' ? a - b : b - a;

/**
 * Sorts a list of primitive values based on their type and a sort direction.
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number
 */
const sortPrimitives =
  (direction: ISortDirection) =>
  <T extends string | number>(a: T, b: T): number => {
    if (typeof a === 'string' && typeof b === 'string') {
      return __sortStringValues(a, b, direction);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return __sortNumberValues(a, b, direction);
    }
    throw new Error(
      encodeError(
        `Unable to sort list of primitive values as they can only be string | number and must not be mixed. Received: ${typeof a}, ${typeof b}`,
        ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
      ),
    );
  };

/**
 * Sorts a list of record values by key based on their type and a sort direction.
 * @param key
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number
 */
const sortRecords =
  (key: string, direction: ISortDirection) =>
  <T extends Record<string, any>>(a: T, b: T): number => {
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return __sortStringValues(a[key], b[key], direction);
    }
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      return __sortNumberValues(a[key], b[key], direction);
    }
    throw new Error(
      encodeError(
        `Unable to sort list of record values as they can only be string | number and must not be mixed. Received: ${typeof a[key]}, ${typeof b[key]}`,
        ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
      ),
    );
  };

/* ************************************************************************************************
 *                                    OBJECT MANAGEMENT HELPERS                                   *
 ************************************************************************************************ */

/**
 * Creates a shallow copy of the input array and shuffles it, using a version of the Fisher-Yates
 * algorithm.
 * @param input
 * @returns Array<T>
 * @throws
 * - INVALID_OR_EMPTY_ARRAY: if the input is not array or it is empty
 */
const shuffleArray = <T>(input: Array<T>): Array<T> => {
  canArrayBeShuffled(input);
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Picks a list of properties from an object and returns a new object (shallow) with the provided
 * keys.
 * @param input
 * @param propKeys
 * @returns Pick<T, K>
 * @throws
 * - INVALID_OR_EMPTY_OBJECT: if the input is not a valid object or it is empty
 * - INVALID_OR_EMPTY_ARRAY: if the keys to be picked are not a valid array or it is empty
 */
const pickProps = <T extends Record<string, any>, K extends keyof T>(
  input: T,
  propKeys: K[],
): Pick<T, K> => {
  validateObjectAndKeys(input, propKeys);
  return Object.fromEntries(propKeys.map((key) => [key, input[key]])) as Pick<T, K>;
};

/**
 * Omits a list of properties from an object and returns a new object (shallow) with only those
 * keys that weren't omitted
 * @param input
 * @param propKeys
 * @returns Omit<T, K>
 * @throws
 * - INVALID_OR_EMPTY_OBJECT: if the input is not a valid object or it is empty
 * - INVALID_OR_EMPTY_ARRAY: if the keys to be omitted are not a valid array or it is empty
 */
const omitProps = <T extends Record<string, any>, K extends keyof T>(
  input: T,
  propKeys: K[],
): Omit<T, K> => {
  validateObjectAndKeys(input, propKeys);
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !propKeys.includes(key as K)),
  ) as Omit<T, K>;
};

/**
 * Compares two objects or arrays deeply and returns true if they are equals.
 * @param a
 * @param b
 * @returns boolean
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if any of the values isn't an object or an array
 * - UNABLE_TO_SERIALIZE_JSON: if any of the values contains data that cannot be serialized
 */
const isEqual = (
  a: Record<string, any> | Array<any>,
  b: Record<string, any> | Array<any>,
): boolean => stringifyJSONDeterministically(a) === stringifyJSONDeterministically(b);

/* ************************************************************************************************
 *                                            FILTERS                                             *
 ************************************************************************************************ */

/**
 * Filters an array of primitives based on a given query and returns a shallow copy.
 * @IMPORTANT Providing the queryProp makes the query very efficient as it only attempts to match
 * the value of that property, instead of the whole item.
 * @param items
 * @param query
 * @param options?
 * @returns T[]
 */
const filterByQuery = <T>(items: T[], query: string, options?: IFilterByQueryOptions<T>): T[] => {
  if (!items.length || !query) {
    return items;
  }

  // build the query tokens
  const queryTokens = buildNormalizedQueryTokens(query);
  if (!queryTokens.length) {
    return items;
  }

  // apply the filter to the items based on the query and provided options
  return filterItemsByQueryTokens(items, queryTokens, options?.queryProp).slice(0, options?.limit);
};

/* ************************************************************************************************
 *                                          MISC HELPERS                                          *
 ************************************************************************************************ */

/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds
 * @returns Promise<void>
 */
const delay = (seconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.round(seconds * 1000));
  });

/**
 * Executes an asynchronous function persistently, retrying on error with incremental delays
 * defined in retryScheduleDuration (seconds).
 * @param func
 * @param args?
 * @param retryScheduleDuration?
 * @returns Promise<T>
 */
const retryAsyncFunction = async <T>(
  func: () => Promise<T>,
  retryScheduleDuration: number[] = [3, 5],
): Promise<T> => {
  try {
    return await func();
  } catch (e) {
    if (retryScheduleDuration.length === 0) {
      throw e;
    }
    await delay(retryScheduleDuration[0]);
    return retryAsyncFunction(func, retryScheduleDuration.slice(1));
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // generators
  generateUUID,
  generateRandomString,
  generateRandomFloat,
  generateRandomInteger,
  generateSequence,

  // sorting utils
  sortPrimitives,
  sortRecords,

  // object management helpers
  shuffleArray,
  pickProps,
  omitProps,
  isEqual,

  // filters
  filterByQuery,

  // misc helpers
  delay,
  retryAsyncFunction,
};
