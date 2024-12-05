import { IDateTemplate, IDateTemplateConfigs, INumberFormatConfig } from './types.js';
import { buildNumberFormatConfig, getDateInstance } from './utils.js';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// values needed to format a file size value into a readable string
const __FILE_SIZE_THRESHOLD: number = 1024;
const __FILE_SIZE_UNITS: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

// the configurations that will be used to prettify dates
const __DATE_TEMPLATE_CONFIGS: IDateTemplateConfigs = {
  'date-short': {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  'date-medium': {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  'date-long': {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  'time-short': {
    hour: '2-digit',
    minute: '2-digit',
  },
  'time-medium': {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  'datetime-short': {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  'datetime-medium': {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  'datetime-long': {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Formats a numeric value based on the user's default language.
 * @param value
 * @param configuration?
 * @returns string
 */
const prettifyNumber = (value: number, configuration?: Partial<INumberFormatConfig>): string => {
  const config = buildNumberFormatConfig(configuration);
  const prettifiedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  });
  return `${config.prefix}${prettifiedValue}${config.suffix}`;
};

/**
 * Formats a date instance based on a template.
 * - date-short: 12/05/2024 (Default)
 * - date-medium: December 5, 2024
 * - date-long: Thursday, December 5, 2024
 * - time-short: 12:05 PM
 * - time-medium: 12:05:20 PM
 * - datetime-short: 12/5/2024, 12:05 PM
 * - datetime-medium: December 5, 2024 at 12:05 PM
 * - datetime-long: Thursday, December 5, 2024 at 12:05:20 PM
 * @param value
 * @param template
 * @returns string
 */
const prettifyDate = (value: Date | number | string, template: IDateTemplate): string => (
  getDateInstance(value).toLocaleString(undefined, __DATE_TEMPLATE_CONFIGS[template])
);

/**
 * Formats a bytes value into a human readable format.
 * @param value
 * @param decimalPlaces
 * @return string
 */
const prettifyFileSize = (value: number, decimalPlaces: number = 2): string => {
  if (typeof value === 'number' && value > 0) {
    let bytes = value;

    // if the value is tiny, return it in bytes
    if (Math.abs(value) < __FILE_SIZE_THRESHOLD) {
      return `${value} B`;
    }

    // iterate until the best unit of measure is found
    let u = -1;
    const r = 10 ** decimalPlaces;
    do {
      bytes /= __FILE_SIZE_THRESHOLD;
      u += 1;
    } while (
      Math.round(Math.abs(bytes) * r) / r
        >= __FILE_SIZE_THRESHOLD && u < __FILE_SIZE_UNITS.length - 1
    );

    // finally, return the value and its unit
    return `${bytes.toFixed(decimalPlaces)} ${__FILE_SIZE_UNITS[u]}`;
  }
  return '0 B';
};


/**
 * Capitalizes the first letter of a string and returns the new value.
 * @param val
 * @returns string
 */
const capitalizeFirst = (value: string): string => (
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : ''
);

/**
 * Converts a string value into Title Case.
 * @param value
 * @returns string
 */
const toTitleCase = (value: string): string => value.replace(
  /\w\S*/g,
  (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
);

/**
 * Converts a string value into a slug.
 * @param value
 * @returns string
 */
const toSlug = (value: string): string => (
  value.length > 0 ? value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : ''
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  capitalizeFirst,
  toTitleCase,
  toSlug,
};
