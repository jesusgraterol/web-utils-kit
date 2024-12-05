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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildNumberFormatConfig,
};
