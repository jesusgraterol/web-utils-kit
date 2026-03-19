import { isArrayValid, isObjectValid } from '../validations/index.js';
import { INumberFormatConfig, ITimeString } from './types.js';
import {
  validateTimeStringChunks,
  validateTimeStringType,
  validateTimeStringValue,
} from './validations.js';

/**
 * Builds the object that will be passed to the number formatting function.
 * @param config? The optional configuration object for number formatting.
 * @returns The configuration object for number formatting with default values applied.
 */
export const buildNumberFormatConfig = (
  config: Partial<INumberFormatConfig> = {},
): INumberFormatConfig => ({
  minimumFractionDigits: config.minimumFractionDigits ?? 0,
  maximumFractionDigits: config.maximumFractionDigits ?? 2,
  prefix: config.prefix ?? '',
  suffix: config.suffix ?? '',
});

/**
 * Creates an instance of Date based on a value.
 * @param value The value to create a Date instance from. It can be a Date object, a timestamp, or a date string.
 * @returns A Date instance.
 */
export const getDateInstance = (value: Date | number | string): Date => {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
};

/**
 * Parses a time string and returns an object containing the value and the unit.
 * @param str The time string to parse.
 * @returns The parsed time string as an object containing the value and the unit.
 * @throws
 * - INVALID_TIME_STRING: if the provided time string is not a valid string.
 * - INVALID_TIME_STRING: if the chunks do not match the expected format.
 * - INVALID_TIME_STRING: if the value is not a valid positive integer.
 */
export const parseTimeString = (str: ITimeString): { value: number; unit: string } => {
  // ensure the provided value is a valid string
  validateTimeStringType(str);

  // separate the value and the unit and ensure they are both present
  const chunks = str.split(' ');
  validateTimeStringChunks(chunks);

  // cast the value to a number and ensure it's a positive integer
  const value = Number(chunks[0]);
  validateTimeStringValue(value);

  // finally, return the value and the unit
  return { value, unit: chunks[1] };
};

/**
 * Recursively sorts the keys of a JSON object. If the value is not an object or an array, it
 * returns the value as is.
 * @param val The value to sort. It can be an object, an array, or any other type.
 * @returns The value with sorted keys if it's an object, or the original value otherwise.
 */
export const sortJSONObjectKeys = (val: unknown): unknown => {
  if (isArrayValid(val)) {
    return val.map(sortJSONObjectKeys);
  }
  if (isObjectValid(val)) {
    return Object.keys(val)
      .sort()
      .reduce(
        (sorted: Record<string, unknown>, key: string) => ({
          ...sorted,
          [key]: sortJSONObjectKeys(val[key]),
        }),
        {},
      );
  }
  return val;
};
