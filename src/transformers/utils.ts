import { isArrayValid, isObjectValid } from '../validations/index.js';
import { INumberFormatConfig } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds the object that will be passed to the number formatting function.
 * @param config?
 * @returns INumberFormatConfig
 */
const buildNumberFormatConfig = (
  config: Partial<INumberFormatConfig> = {},
): INumberFormatConfig => ({
  minimumFractionDigits: config.minimumFractionDigits ?? 0,
  maximumFractionDigits: config.maximumFractionDigits ?? 2,
  prefix: config.prefix ?? '',
  suffix: config.suffix ?? '',
});

/**
 * Creates an instance of Date based on a value.
 * @param value
 * @returns Date
 */
const getDateInstance = (value: Date | number | string): Date => {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
};

/**
 * Recursively sorts the keys of a JSON object. If the value is not an object or an array, it
 * returns the value as is.
 * @param val
 * @returns unknown
 */
const sortJSONObjectKeys = (val: unknown): unknown => {
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

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { buildNumberFormatConfig, getDateInstance, sortJSONObjectKeys };
