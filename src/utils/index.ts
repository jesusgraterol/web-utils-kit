import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { encodeError, extractMessage, isEncodedError } from 'error-message-utils';
import { IUUIDVersion } from '../shared/types.js';
import { ERRORS } from '../shared/errors.js';
import { isIntegerValid } from '../validations/index.js';
import { IDateValue, stringifyJSONDeterministically, toDate } from '../transformers/index.js';
import { IFilterByQueryOptions, ISortDirection } from './types.js';
import {
  canArrayBeShuffled,
  validateAuthorizationHeader,
  validateEmailAddress,
  validateObjectAndKeys,
} from './validations.js';
import { buildNormalizedQueryTokens } from './transformers.js';
import { filterItemsByQueryTokens } from './utils.js';

/* ************************************************************************************************
 *                                           GENERATORS                                           *
 ************************************************************************************************ */

/**
 * Generates a UUID based on a version.
 * @param version The version of the UUID to be generated.
 * @returns A UUID string of the specified version.
 */
const generateUUID = (version: IUUIDVersion): string => {
  if (version === 7) {
    return uuidv7();
  }
  return uuidv4();
};

/**
 * Generates a string from randomly picked characters based on the length.
 * @param length The length of the random string to be generated.
 * @param characters? A string of characters to pick from when generating the random string. Defaults to 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.
 * @returns A randomly generated string of the specified length.
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
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A randomly generated decimal number within the specified range.
 */
const generateRandomFloat = (min: number, max: number): number => {
  const value = Math.random() * (max - min + 1) + min;
  return value > max ? max : value;
};

/**
 * Generates a random number (integer) constrained by the range.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A randomly generated integer number within the specified range.
 */
const generateRandomInteger = (min: number, max: number): number =>
  Math.floor(generateRandomFloat(min, max));

/**
 * Generates a sequence of numbers within a range based on a number of steps.
 * @param start The starting value of the sequence.
 * @param stop The ending value of the sequence.
 * @param step? The step value to increment the sequence. Defaults to 1.
 * @returns An array of numbers representing the sequence.
 */
const generateSequence = (start: number, stop: number, step: number = 1): number[] =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/* ************************************************************************************************
 *                                         SORTING UTILS                                          *
 ************************************************************************************************ */

/**
 * Orders two string values based on a sorting direction.
 * @param a The first string value to compare.
 * @param b The second string value to compare.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order.
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
 * @param a The first number value to compare.
 * @param b The second number value to compare.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order.
 */
const __sortNumberValues = (a: number, b: number, direction: ISortDirection): number =>
  direction === 'asc' ? a - b : b - a;

/**
 * Orders two bigint values based on a sorting direction.
 * @param a The first bigint value to compare.
 * @param b The second bigint value to compare.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order.
 */
const __sortBigIntValues = (a: bigint, b: bigint, direction: ISortDirection): number => {
  if (a === b) return 0;
  return (direction === 'asc') === a < b ? -1 : 1;
};

/**
 * Sorts a list of primitive values based on their type and a sort direction.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order based on the primitive type.
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number | bigint
 */
const sortPrimitives =
  (direction: ISortDirection) =>
  <T extends string | number | bigint>(a: T, b: T): number => {
    if (typeof a === 'string' && typeof b === 'string') {
      return __sortStringValues(a, b, direction);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return __sortNumberValues(a, b, direction);
    }
    if (typeof a === 'bigint' && typeof b === 'bigint') {
      return __sortBigIntValues(a, b, direction);
    }
    throw new Error(
      encodeError(
        `Unable to sort list of primitive values as they can only be string | number | bigint and must not be mixed. Received: ${typeof a}, ${typeof b}`,
        ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
      ),
    );
  };

/**
 * Sorts a list of record values by key based on their type and a sort direction.
 * @param key The key of the record to sort by.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order based on the primitive type.
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number | bigint
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
    if (typeof a[key] === 'bigint' && typeof b[key] === 'bigint') {
      return __sortBigIntValues(a[key], b[key], direction);
    }
    throw new Error(
      encodeError(
        `Unable to sort list of record values as they can only be string | number | bigint and must not be mixed. Received: ${typeof a[key]}, ${typeof b[key]}`,
        ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
      ),
    );
  };

/**
 * Sorts a list of record values by key, treating stringified bigints as actual bigints, based on a
 * sort direction.
 * @param key The key of the record to sort by.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order based on the primitive type.
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number | bigint
 */
export const sortRecordsWithBigIntString =
  <T extends Record<string, unknown>>(key: keyof T, direction: ISortDirection) =>
  (a: T, b: T): number => {
    try {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aBigInt = BigInt(aValue);
        const bBigInt = BigInt(bValue);
        return __sortBigIntValues(aBigInt, bBigInt, direction);
      }

      throw new Error(
        encodeError(
          `Unable to sort list of record values as they can only be stringified bigints. Received: ${typeof aValue}, ${typeof bValue}`,
          ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
        ),
      );
    } catch (e) {
      console.log(`key: ${String(key)}`);
      console.log('a: ', a);
      console.log('b: ', b);
      if (isEncodedError(e)) {
        throw e;
      }
      throw new Error(
        encodeError(
          `Failed to sort list of record values as they can only be stringified bigints: ${extractMessage(e)}`,
          ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
        ),
      );
    }
  };

/**
 * Sorts a list of record values by key, treating date values as actual Date objects, based on a
 * sort direction.
 * @param key The key of the record to sort by.
 * @param direction The direction to sort the values.
 * @returns A number indicating the sort order based on the date values.
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to date values
 */
export const sortRecordsWithDateValue =
  <T extends Record<string, unknown>>(key: keyof T, direction: ISortDirection) =>
  (a: T, b: T): number => {
    try {
      if (a[key] && b[key]) {
        const aDate = toDate(a[key] as IDateValue);
        const bDate = toDate(b[key] as IDateValue);
        return __sortNumberValues(aDate.getTime(), bDate.getTime(), direction);
      }

      throw new Error(
        encodeError(
          `Unable to sort list of record values as they can only be date values.`,
          ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
        ),
      );
    } catch (e) {
      console.log(`key: ${String(key)}`);
      console.log('a: ', a);
      console.log('b: ', b);
      if (isEncodedError(e)) {
        throw e;
      }
      throw new Error(
        encodeError(
          `Failed to sort list of record values as they can only be date strings: ${extractMessage(e)}`,
          ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
        ),
      );
    }
  };

/* ************************************************************************************************
 *                                    OBJECT MANAGEMENT HELPERS                                   *
 ************************************************************************************************ */

/**
 * Creates a shallow copy of the input array and shuffles it, using a version of the Fisher-Yates
 * algorithm.
 * @param input The array to be shuffled.
 * @returns A new array with the values of the input array in a random order.
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
 * Splits an array into smaller arrays (batches) of a given size.
 * @param items The array to be split into batches.
 * @param batchSize The size of each batch.
 * @returns An array of arrays, where each inner array is a batch of the specified size.
 * @throws
 * - INVALID_BATCH_SIZE: if the batch size is not a valid integer greater than 0
 */
const splitArrayIntoBatches = <T>(items: T[], batchSize: number): Array<T[]> => {
  // return an empty array if there are no items
  if (!items.length) {
    return [];
  }

  // ensure the batch size is a valid integer greater than zero
  if (!isIntegerValid(batchSize, 1)) {
    throw new Error(
      encodeError(
        `In order to split an array into batches, the batch size must be an integer greater than 0. Received: ${batchSize}`,
        ERRORS.INVALID_BATCH_SIZE,
      ),
    );
  }

  // split the items into batches
  const out: Array<T[]> = [];
  for (let i = 0; i < items.length; i += batchSize) {
    out.push(items.slice(i, i + batchSize));
  }
  return out;
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
 * @param input The object from which to omit properties.
 * @param propKeys The keys of the properties to omit.
 * @returns A new object containing only the properties that were not omitted.
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
 * Compares two objects or arrays deeply and returns true if they are equal.
 * @param a The first object or array to compare.
 * @param b The second object or array to compare.
 * @returns A boolean indicating whether the two values are equal.
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
 * @param items The array of items to be filtered by the query.
 * @param query The query string to filter the items by.
 * @param options? The options to filter the items by query.
 * @returns A new array containing the items that match the query based on the provided options.
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
  const result = filterItemsByQueryTokens(items, queryTokens, options?.queryProp);
  if (typeof options?.limit === 'number') {
    return result.slice(0, options.limit);
  }
  return result;
};

/* ************************************************************************************************
 *                                          MISC HELPERS                                          *
 ************************************************************************************************ */

/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds The number of seconds to delay before the promise resolves.
 * @returns A promise that resolves after the specified number of seconds has passed.
 */
const delay = (seconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.round(seconds * 1000));
  });

/**
 * Executes an asynchronous function persistently, retrying on error with incremental delays
 * defined in retryScheduleDuration (seconds).
 * @param fn The asynchronous function to be executed persistently.
 * @param retryScheduleDuration? An array of numbers representing the delay (in seconds) between each retry attempt. Defaults to [3, 5].
 * @returns A promise that resolves with the result of the asynchronous function or rejects with the last encountered error.
 */
const retryAsyncFunction = async <T>(
  fn: () => Promise<T>,
  retryScheduleDuration: number[] = [3, 5],
): Promise<T> => {
  try {
    return await fn();
  } catch (e) {
    if (retryScheduleDuration.length === 0) {
      throw e;
    }
    await delay(retryScheduleDuration[0]);
    return retryAsyncFunction(fn, retryScheduleDuration.slice(1));
  }
};

/**
 * Validates the format of an authorization header and extracts the token from it.
 * @param header The authorization header to validate and extract the token from.
 * @returns The extracted token from the authorization header.
 * @throws
 * - INVALID_AUTHORIZATION_HEADER: If the header does not comply with the expected format.
 */
const extractTokenFromAuthorizationHeader = (header: string): string => {
  validateAuthorizationHeader(header);
  return header.split(' ')[1];
};

/**
 * Validates the format of an email address and extracts the username from it.
 * @param email The email address to validate and extract the username from.
 * @returns The extracted username from the email address.
 * @throws
 * - INVALID_EMAIL_ADDRESS: If the email address is not valid or has a forbidden extension.
 */
const extractEmailUsername = (email: string): string => {
  validateEmailAddress(email);
  return email.split('@')[0].toLowerCase();
};

/**
 * Extracts a string of initials from the provided value.
 * @param value The string value from which to extract initials.
 * @param initialsCount? The maximum number of initials to extract. Defaults to 1.
 * @returns A string with up to the requested number of letter-only initials, or "A" if none exist.
 */
const getInitials = (value: string, initialsCount: number = 1): string => {
  const segmentLetters = (value.match(/[\p{L}\p{N}]+/gu) ?? [])
    .map((segment) => Array.from(segment.match(/\p{L}/gu) ?? []))
    .filter((letters) => letters.length > 0);

  if (!segmentLetters.length) {
    return 'A';
  }

  const initials = segmentLetters.map(([firstLetter]) => firstLetter.toUpperCase());
  const remainingLetters = segmentLetters.flatMap((letters) =>
    letters.slice(1).map((letter) => letter.toUpperCase()),
  );

  return initials.concat(remainingLetters).slice(0, initialsCount).join('');
};

/**
 * Gets the value of a property from the last item when the array length reaches the initial page size.
 * @param propName The property name to read from the last item.
 * @param items The array of items from which to read the last property value.
 * @param initialPageSize The expected page size required before reading the last property value.
 * @returns The last item's property value, or undefined when the array length is below the initial page size.
 */
const getNextPageParam = <T extends object, K extends keyof T>(
  propName: K,
  items: T[],
  initialPageSize: number,
): T[K] | undefined => {
  if (items.length < initialPageSize) {
    return undefined;
  }
  return items.at(-1)?.[propName];
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type ISortDirection,
  type IFilterByQueryOptions,

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
  splitArrayIntoBatches,
  pickProps,
  omitProps,
  isEqual,

  // filters
  filterByQuery,

  // misc helpers
  delay,
  retryAsyncFunction,
  extractTokenFromAuthorizationHeader,
  extractEmailUsername,
  getInitials,
  getNextPageParam,
};
