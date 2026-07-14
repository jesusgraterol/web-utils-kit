import { Exception } from 'error-message-utils';

import { ERRORS } from '../shared/errors.js';

import type { IDateTemplate, IDateValue, ITimeString } from './types.js';
import {
  DATE_TEMPLATE_CONFIGS,
  ONE_DAY_IN_MILLISECONDS,
  ONE_HOUR_IN_MILLISECONDS,
  ONE_MINUTE_IN_MILLISECONDS,
  ONE_MONTH_IN_MILLISECONDS,
  ONE_SECOND_IN_MILLISECONDS,
  ONE_WEEK_IN_MILLISECONDS,
  ONE_YEAR_IN_MILLISECONDS,
} from './constants.js';
import { parseTimeString } from './utilities.js';

/**
 * Creates an instance of Date based on a value.
 * @param value The value to create a Date instance from. It can be a Date object, a timestamp, or a date string.
 * @returns A Date instance.
 */
export const toDate = (value: IDateValue): Date => {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
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
export const prettifyDate = (value: IDateValue, template: IDateTemplate): string =>
  toDate(value).toLocaleString(undefined, DATE_TEMPLATE_CONFIGS[template]);

/**
 * Formats a duration in milliseconds into a human-readable string.
 * @param milliseconds The duration in milliseconds.
 * @returns A string representing the formatted duration.
 */
export const prettifyTime = (milliseconds: number): string => {
  const safeSeconds = Number.isFinite(milliseconds)
    ? Math.max(0, Math.floor(milliseconds / 1000))
    : 0;
  const days = Math.floor(safeSeconds / 86_400);
  const hours = Math.floor((safeSeconds % 86_400) / 3_600);
  const minutes = Math.floor((safeSeconds % 3_600) / 60);
  const seconds = safeSeconds % 60;
  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    days === 0 && hours === 0 && minutes === 0 ? `${seconds}s` : null,
  ].filter((part): part is string => typeof part === 'string');

  return parts.join(' ');
};

/**
 * Converts a time string into milliseconds. The time string should be in the format of "{value} {unit}",
 * where the value is a number and the unit can be milliseconds, seconds, minutes, hours, days, weeks,
 * months, or years. For example: "2 days", "5 minutes", "2 hours".
 * @param str The time string to convert into milliseconds.
 * @returns The equivalent time in milliseconds.
 * @throws
 * - INVALID_TIME_STRING: if the provided time string is not a valid string.
 * - INVALID_TIME_STRING: if the chunks do not match the expected format.
 * - INVALID_TIME_STRING: if the value is not a valid positive integer.
 * - INVALID_TIME_STRING: if the unit is not one of the accepted values.
 */
export const toMS = (str: ITimeString): number => {
  const { value, unit } = parseTimeString(str);
  switch (unit) {
    case 'years':
    case 'year':
      return value * ONE_YEAR_IN_MILLISECONDS;
    case 'months':
    case 'month':
      return value * ONE_MONTH_IN_MILLISECONDS;
    case 'weeks':
    case 'week':
      return value * ONE_WEEK_IN_MILLISECONDS;
    case 'days':
    case 'day':
      return value * ONE_DAY_IN_MILLISECONDS;
    case 'hours':
    case 'hour':
      return value * ONE_HOUR_IN_MILLISECONDS;
    case 'minutes':
    case 'minute':
      return value * ONE_MINUTE_IN_MILLISECONDS;
    case 'seconds':
    case 'second':
      return value * ONE_SECOND_IN_MILLISECONDS;
    case 'milliseconds':
    case 'millisecond':
      return value;
    default:
      throw new Exception(
        `The unit provided to the toMS function is invalid: "${unit}". Received: ${str}`,
        ERRORS.INVALID_TIME_STRING,
      );
  }
};
