import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { encodeError } from 'error-message-utils';
import { IUUIDVersion } from '../shared/types.js';
import { ISortDirection } from './types.js';
import { ERRORS } from '../shared/errors.js';

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
const __sortNumberValues = (a: number, b: number, direction: ISortDirection): number => (
  direction === 'asc' ? a - b : b - a
);

/**
 * Sorts a list of primitive values based on their type and a sort direction.
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number
 */
const sortPrimitives = (
  direction: ISortDirection,
) => <T extends string | number>(a: T, b: T): number => {
  if (typeof a === 'string' && typeof b === 'string') {
    return __sortStringValues(a, b, direction);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return __sortNumberValues(a, b, direction);
  }
  throw new Error(encodeError(`Unable to sort list of primitive values as they can only be string | number and must not be mixed. Received: ${typeof a}, ${typeof b}`, ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES));
};

/**
 * Sorts a list of record values by key based on their type and a sort direction.
 * @param key
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 * @throws
 * - MIXED_OR_UNSUPPORTED_DATA_TYPES: if the values are mixed or are different to string | number
 */
const sortRecords = (
  key: string,
  direction: ISortDirection,
) => <T extends Record<string, any>>(a: T, b: T): number => {
  if (typeof a[key] === 'string' && typeof b[key] === 'string') {
    return __sortStringValues(a[key], b[key], direction);
  }
  if (typeof a[key] === 'number' && typeof b[key] === 'number') {
    return __sortNumberValues(a[key], b[key], direction);
  }
  throw new Error(encodeError(`Unable to sort list of record values as they can only be string | number and must not be mixed. Received: ${typeof a[key]}, ${typeof b[key]}`, ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES));
};





/* ************************************************************************************************
 *                                          MISC HELPERS                                          *
 ************************************************************************************************ */

/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds
 * @returns Promise<void>
 */
const delay = (seconds: number): Promise<void> => new Promise((resolve) => {
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
  func: (...args: any[]) => Promise<T>,
  args?: any[],
  retryScheduleDuration: number[] = [3, 5],
): Promise<T> => {
  try {
    if (args) {
      return await func(...args);
    }
    return await func();
  } catch (e) {
    if (retryScheduleDuration.length === 0) {
      throw e;
    }
    await delay(retryScheduleDuration[0]);
    return retryAsyncFunction(func, args, retryScheduleDuration.slice(1));
  }
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // generators
  generateUUID,

  // sorting utils
  sortPrimitives,
  sortRecords,

  // misc helpers
  delay,
  retryAsyncFunction,
};
