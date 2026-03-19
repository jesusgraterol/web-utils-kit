import { IDateTemplateConfigs, IUnit } from './types.js';

/* ************************************************************************************************
 *                                            NUMBERS                                             *
 ************************************************************************************************ */

// values needed to format a file size value into a readable string
export const FILE_SIZE_THRESHOLD: number = 1024;
export const FILE_SIZE_UNITS: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

/* ************************************************************************************************
 *                                             DATES                                              *
 ************************************************************************************************ */

// the configurations that will be used to prettify dates
export const DATE_TEMPLATE_CONFIGS: IDateTemplateConfigs = {
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
 *                                          TIME STRING                                           *
 ************************************************************************************************ */

// the units that can be used in a time string
export const TIME_STRING_UNITS: IUnit[] = [
  'seconds',
  'second',
  'minutes',
  'minute',
  'hours',
  'hour',
  'days',
  'day',
  'weeks',
  'week',
  'months',
  'month',
  'years',
  'year',
];

// the values needed to convert a time string into milliseconds
export const ONE_SECOND_IN_MILLISECONDS = 1000;
export const ONE_MINUTE_IN_MILLISECONDS = ONE_SECOND_IN_MILLISECONDS * 60;
export const ONE_HOUR_IN_MILLISECONDS = ONE_MINUTE_IN_MILLISECONDS * 60;
export const ONE_DAY_IN_MILLISECONDS = ONE_HOUR_IN_MILLISECONDS * 24;
export const ONE_WEEK_IN_MILLISECONDS = ONE_DAY_IN_MILLISECONDS * 7;
export const ONE_YEAR_IN_MILLISECONDS = ONE_DAY_IN_MILLISECONDS * 365.25;
export const ONE_MONTH_IN_MILLISECONDS = ONE_YEAR_IN_MILLISECONDS / 12;
