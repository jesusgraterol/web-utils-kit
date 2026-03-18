import { isArrayValid, isObjectValid } from '../validations/index.js';
import { INumberFormatConfig } from './types.js';

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
