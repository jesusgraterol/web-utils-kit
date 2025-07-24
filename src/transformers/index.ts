import { decodeError, encodeError, extractMessage } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { IDateTemplate, INumberFormatConfig } from './types.js';
import { DATE_TEMPLATE_CONFIGS, FILE_SIZE_THRESHOLD, FILE_SIZE_UNITS } from './consts.js';
import {
  canJSONBeSerializedDeterministically,
  validateJSONSerializationResult,
} from './validations.js';
import { buildNumberFormatConfig, getDateInstance, sortJSONObjectKeys } from './utils.js';

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
const prettifyDate = (value: Date | number | string, template: IDateTemplate): string =>
  getDateInstance(value).toLocaleString(undefined, DATE_TEMPLATE_CONFIGS[template]);

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
    if (Math.abs(value) < FILE_SIZE_THRESHOLD) {
      return `${value} B`;
    }

    // iterate until the best unit of measure is found
    let u = -1;
    const r = 10 ** decimalPlaces;
    do {
      bytes /= FILE_SIZE_THRESHOLD;
      u += 1;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= FILE_SIZE_THRESHOLD &&
      u < FILE_SIZE_UNITS.length - 1
    );

    // finally, return the value and its unit
    return `${bytes.toFixed(decimalPlaces)} ${FILE_SIZE_UNITS[u]}`;
  }
  return '0 B';
};

/**
 * Formats the number that will be inserted in a badge so it doesn't take too much space. If the
 * current count is 0, it returns undefined as the badge shouldn't be displayed.
 * @param count
 * @param maxValue?
 * @returns string | undefined
 */
const prettifyBadgeCount = (value: number, maxValue: number = 9): string | undefined => {
  if (value === 0) {
    return undefined;
  }
  if (value >= maxValue) {
    return `${maxValue}+`;
  }
  return String(value);
};

/**
 * Capitalizes the first letter of a string and returns the new value.
 * @param val
 * @returns string
 */
const capitalizeFirst = (value: string): string =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : '';

/**
 * Converts a string value into Title Case.
 * @param value
 * @returns string
 */
const toTitleCase = (value: string): string =>
  value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());

/**
 * Converts a string value into a slug.
 * @param value
 * @returns string
 */
const toSlug = (value: string): string =>
  value.length > 0
    ? value
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
    : '';

/**
 * Truncates a string to a specified length and appends an ellipsis if it exceeds that length.
 * @param text
 * @param maxLength
 * @returns string
 */
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Masks the middle of a string, keeping a specified number of visible characters at the start and
 * end.
 * @param text
 * @param visibleChars
 * @param mask?
 * @returns string
 */
const maskMiddle = (text: string, visibleChars: number, mask: string = '...'): string => {
  if (text.length <= visibleChars * 2) {
    return text;
  }
  return `${text.slice(0, visibleChars)}${mask}${text.slice(-visibleChars)}`;
};

/**
 * Serializes a JSON object into a string.
 * @param value
 * @returns string
 * @throws
 * - UNABLE_TO_SERIALIZE_JSON: if the result of JSON.stringify is not a valid string
 * - UNABLE_TO_SERIALIZE_JSON: if an error is thrown during stringification
 */
const stringifyJSON = (value: NonNullable<object>): string => {
  try {
    const result = JSON.stringify(value);
    validateJSONSerializationResult(value, result);
    return result;
  } catch (e) {
    if (decodeError(e).code !== ERRORS.UNABLE_TO_SERIALIZE_JSON) {
      throw new Error(
        encodeError(
          `Failed to stringify the JSON value '${value}': ${extractMessage(e)}`,
          ERRORS.UNABLE_TO_SERIALIZE_JSON,
        ),
      );
    }
    throw e;
  }
};

/**
 * Stringifies a JSON object in a deterministic way, ensuring that the keys are sorted and the
 * output is consistent.
 * @param value
 * @returns string
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not an object or an array
 * - UNABLE_TO_SERIALIZE_JSON: if the result of JSON.stringify is not a valid string
 * - UNABLE_TO_SERIALIZE_JSON: if an error is thrown during stringification
 */
const stringifyJSONDeterministically = (value: NonNullable<object>): string => {
  canJSONBeSerializedDeterministically(value);
  try {
    return stringifyJSON(sortJSONObjectKeys(value) as object);
  } catch (e) {
    if (decodeError(e).code !== ERRORS.UNABLE_TO_SERIALIZE_JSON) {
      throw new Error(
        encodeError(
          `Failed to stringify the JSON value deterministically '${value}': ${extractMessage(e)}`,
          ERRORS.UNABLE_TO_SERIALIZE_JSON,
        ),
      );
    }
    throw e;
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  truncateText,
  maskMiddle,
  stringifyJSON,
  stringifyJSONDeterministically,
};
