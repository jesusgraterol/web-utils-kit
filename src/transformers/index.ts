import { decodeError, encodeError, extractMessage } from 'error-message-utils';
import { IJSONValue } from '../shared/types.js';
import { ERRORS } from '../shared/errors.js';
import { isObjectValid } from '../validations/index.js';
import { IDateTemplate, INumberFormatConfig, ITimeString } from './types.js';
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
 * @param value The number to be formatted.
 * @param configuration? An optional configuration object.
 * @returns A string representing the formatted number.
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
 * @param value The date value to be formatted. It can be a Date object, a timestamp, or a date string.
 * @param template The template to use for formatting the date.
 * @returns A string representing the formatted date.
 */
const prettifyDate = (value: Date | number | string, template: IDateTemplate): string =>
  getDateInstance(value).toLocaleString(undefined, DATE_TEMPLATE_CONFIGS[template]);

/**
 * Formats a bytes value into a human readable format.
 * @param value The bytes value to be formatted.
 * @param decimalPlaces The number of decimal places to include. Defaults to 2.
 * @returns A string representing the formatted file size.
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
 * @param count The current count to be displayed in the badge.
 * @param maxValue The maximum value to display before showing a "+" sign. Defaults to 9.
 * @returns A string representing the formatted badge count or undefined if the count is 0.
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
 * @param val The string value to capitalize.
 * @returns A string with the first letter capitalized.
 */
const capitalizeFirst = (value: string): string =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : '';

/**
 * Converts a string value into Title Case.
 * @param value The string value to convert.
 * @returns A string converted to Title Case.
 */
const toTitleCase = (value: string): string =>
  value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());

/**
 * Converts a string value into a slug, meeting the following requirements:
 * - lowercase
 * - removes accents/diacritics
 * - replaces spaces and separators with "-"
 * - removes invalid URL characters
 * - collapses repeated "-"
 * - trims leading/trailing "-"
 * @param value The string value to convert.
 * @returns A string converted to a slug.
 * @throws
 * - UNABLE_TO_SLUGIFY_STRING: if the resulting slug is empty after processing the input string
 */
const toSlug = (value: string): string => {
  const slug = value
    .normalize('NFKD') // separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '') // remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric runs with "-"
    .replace(/-+/g, '-') // collapse multiple "-"
    .replace(/^-|-$/g, ''); // trim "-" from start/end
  if (slug.length === 0) {
    throw new Error(
      encodeError(
        `Failed to slugify the string '${value}': the resulting slug is empty.`,
        ERRORS.UNABLE_TO_SLUGIFY_STRING,
      ),
    );
  }
  return slug;
};

/**
 * Truncates a string to a specified length and appends an ellipsis if it exceeds that length.
 * @param text The string value to truncate.
 * @param maxLength The maximum length of the string before truncation.
 * @returns A string truncated to the specified length with an ellipsis if necessary.
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
 * @param text The string value to mask.
 * @param visibleChars The number of characters to keep visible at the start and end of the string.
 * @param mask? An optional string to use as the mask. Defaults to '...'.
 * @returns A string with the middle masked, keeping the specified number of visible characters at the start.
 */
const maskMiddle = (text: string, visibleChars: number, mask: string = '...'): string => {
  if (text.length <= visibleChars * 2) {
    return text;
  }
  return `${text.slice(0, visibleChars)}${mask}${text.slice(-visibleChars)}`;
};

/**
 * Applies substitutions to a string based on a provided object. The string can contain placeholders
 * in the format of {{key}}, which will be replaced by the corresponding value from the substitutions
 * object. If a placeholder does not have a corresponding key in the substitutions object, it will
 * remain unchanged in the output string.
 * @param input The input string containing placeholders in the format of {{key}}.
 * @param substitutions? An object containing key-value pairs for substitutions. The keys should
 * match the placeholders in the input string, without the curly braces.
 * @returns A string with the placeholders replaced by their corresponding values from the substitutions object.
 */
const applySubstitutions = (input: string, substitutions: Record<string, unknown> = {}): string =>
  input.replace(/{{(.*?)}}/g, (match, key) =>
    key in substitutions ? String(substitutions[key]) : match,
  );

/* ************************************************************************************************
 *                                             JSON                                               *
 ************************************************************************************************ */

/**
 * Serializes a JSON object with the JSON.stringify method.
 * @param value The value to be serialized. It should be an object or an array.
 * @returns A string representing the serialized JSON object.
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
 * @param value The value to be serialized. It should be an object or an array.
 * @returns A string representing the serialized JSON object with sorted keys.
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
 * @param value The JSON string to be deserialized.
 * @returns The deserialized object or array.
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
 * @param value The value to be cloned. It should be an object or an array.
 * @returns A deep clone of the provided value.
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

/**
 * Removes null, undefined, empty objects, and empty arrays from the given data recursively.
 * @param value The value to be pruned. It should be an object, array, or primitive value.
 * @returns The pruned value, or null if the value is empty or invalid.
 */
const pruneJSON = <T extends IJSONValue>(value: T): T | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => pruneJSON(item))
      .filter((item) => {
        if (item === null || item === undefined) return false;
        if (Array.isArray(item)) return item.length > 0;
        if (isObjectValid(item, true)) return Object.keys(item).length > 0;
        return true;
      });

    // if after cleaning it has no items, return null
    return cleanedArray.length > 0 ? (cleanedArray as T) : null;
  }

  if (isObjectValid(value, true)) {
    const cleanedObj: Record<string, IJSONValue> = {};

    Object.entries(value).forEach(([key, val]) => {
      const cleanedVal = pruneJSON(val);

      if (cleanedVal === null || cleanedVal === undefined) return;
      if (Array.isArray(cleanedVal) && cleanedVal.length === 0) return;
      if (isObjectValid(cleanedVal, true) && !isObjectValid(cleanedVal)) return;

      cleanedObj[key] = cleanedVal;
    });

    // if after cleaning it has no keys, return null
    return Object.keys(cleanedObj).length > 0 ? (cleanedObj as T) : null;
  }

  return value;
};

/* ************************************************************************************************
 *                                        MODULE EXPORTS                                          *
 ************************************************************************************************ */
export {
  // types
  type INumberFormatConfig,
  type IDateTemplate,
  type ITimeString,

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
  applySubstitutions,

  // JSON
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
  pruneJSON,
};
