import { IDateTemplateConfigs } from './types.js';

// values needed to format a file size value into a readable string
const FILE_SIZE_THRESHOLD: number = 1024;
const FILE_SIZE_UNITS: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

// the configurations that will be used to prettify dates
const DATE_TEMPLATE_CONFIGS: IDateTemplateConfigs = {
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
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { FILE_SIZE_THRESHOLD, FILE_SIZE_UNITS, DATE_TEMPLATE_CONFIGS };
