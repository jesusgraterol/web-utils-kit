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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildNumberFormatConfig,
  getDateInstance,
};
