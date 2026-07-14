import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';

import type { IUUIDVersion } from '../shared/types.js';
import type { IDateValue } from '../transformers/index.js';
import { toDate } from '../transformers/index.js';

/**
 * Generates a UUID based on a version.
 * @param version The version of the UUID to be generated.
 * @returns A UUID string of the specified version.
 */
export const generateUUID = (version: IUUIDVersion): string => {
  if (version === 7) {
    return uuidv7();
  }
  return uuidv4();
};

/**
 * Generates a string from randomly picked characters based on the length.
 * @param length The length of the random string to be generated.
 * @param characters? A string of characters to pick from when generating the string.
 * @returns A randomly generated string of the specified length.
 */
export const generateRandomString = (
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
 * @returns A random decimal greater than or equal to min and less than max.
 */
export const generateRandomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/**
 * Generates a random number (integer) constrained by the range.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A random integer within the inclusive range.
 */
export const generateRandomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a sequence of numbers within a range based on a number of steps.
 * @param start The starting value of the sequence.
 * @param stop The ending value of the sequence.
 * @param step? The step value to increment by. Defaults to 1.
 * @returns An array of numbers representing the sequence.
 */
export const generateSequence = (start: number, stop: number, step: number = 1): number[] =>
  Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

/**
 * Generates a date ID string in the format "YYYY_MM_DD".
 * @param value The date value to generate the ID from. Defaults to the current date if not provided.
 * @returns The generated date ID string.
 */
export const generateDateId = (value?: IDateValue): string => {
  const date = toDate(value ?? new Date());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
};
