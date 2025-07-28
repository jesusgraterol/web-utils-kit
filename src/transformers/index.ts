import { decodeError, encodeError, extractMessage } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { IDateTemplate, INumberFormatConfig } from './types.js';
import { DATE_TEMPLATE_CONFIGS, FILE_SIZE_THRESHOLD, FILE_SIZE_UNITS } from './consts.js';
import {
  canJSONBeSerialized,
  validateJSONSerializationResult,
  canJSONBeDeserialized,
  validateJSONDeserializationResult,
} from './validations.js';
import { buildNumberFormatConfig, getDateInstance, sortJSONObjectKeys } from './utils.js';

/* ************************************************************************************************
 *                                            GENERAL                                             *
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

/* ************************************************************************************************
 *                                             JSON                                               *
 ************************************************************************************************ */

/**
 * Serializes a JSON object with the JSON.stringify method.
 * @param value
 * @returns string
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not an object or an array
 * - UNABLE_TO_SERIALIZE_JSON: if the result of JSON.stringify is not a valid string
 * - UNABLE_TO_SERIALIZE_JSON: if an error is thrown during stringification
 */
const stringifyJSON = <T>(value: T): string => {
  try {
    canJSONBeSerialized(value);
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
const stringifyJSONDeterministically = <T>(value: T): string => {
  canJSONBeSerialized(value);
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

/**
 * Deserializes a JSON string with the JSON.parse method.
 * @param value
 * @returns T
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not a non-empty string
 * - UNABLE_TO_DESERIALIZE_JSON: if the result of JSON.parse is not a valid object or array
 * - UNABLE_TO_DESERIALIZE_JSON: if an error is thrown during parsing
 */
const parseJSON = <T>(value: string): T => {
  canJSONBeDeserialized(value);
  try {
    const result = JSON.parse(value);
    validateJSONDeserializationResult(value, result);
    return result;
  } catch (e) {
    if (decodeError(e).code !== ERRORS.UNABLE_TO_DESERIALIZE_JSON) {
      throw new Error(
        encodeError(
          `Failed to parse the JSON value '${value}': ${extractMessage(e)}`,
          ERRORS.UNABLE_TO_DESERIALIZE_JSON,
        ),
      );
    }
    throw e;
  }
};

/**
 * Creates a deep clone of an object by using the JSON.stringify and JSON.parse methods.
 * @param value
 * @returns T
 * @throws
 * - UNABLE_TO_CREATE_DEEP_CLONE: if the value cannot be serialized and deserialized
 */
const createDeepClone = <T>(value: T): T => {
  try {
    return parseJSON(stringifyJSON(value));
  } catch (e) {
    throw new Error(
      encodeError(
        `Failed to create a deep clone of the value '${value}': ${extractMessage(e)}`,
        ERRORS.UNABLE_TO_CREATE_DEEP_CLONE,
      ),
    );
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // general
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  truncateText,
  maskMiddle,

  // json
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
};
