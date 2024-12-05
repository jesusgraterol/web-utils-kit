

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Number Format Configuration
 * The configuration that will be used to prettify a number.
 */
type INumberFormatConfig = {
  minimumFractionDigits: number; // Default: 0
  maximumFractionDigits: number; // Default: 2
  prefix: string; // Default: ''
  suffix: string; // Default: ''
};

/**
 * Date Template
 * A date can be prettified by choosing a template that meets the user's requirements.
 * - date-short: 29/04/1453
 * - date-medium: April 29th, 1453
 * - date-long: Friday, April 29th, 1453
 * - time-short: 12:00 AM
 * - time-medium: 12:00:00 AM
 * - datetime-short: 29/04/1453, 12:00 AM
 * - datetime-medium: Apr 29, 1453, 12:00:00 AM
 * - datetime-long: Friday, April 29th, 1453 at 12:00:00 AM
 */
type IDateTemplate = 'date-short' | 'date-medium' | 'date-long' | 'time-short' | 'time-medium' |
'datetime-short' | 'datetime-medium' | 'datetime-long';

/**
 * Date Template Configs
 * The options that will be combined in order to provide a format that can meet any requirement.
 */
type IDateTemplateConfigs = {
  [key in IDateTemplate]: {
    localeMatcher?: 'best fit' | 'lookup' | undefined;
    weekday?: 'long' | 'short' | 'narrow' | undefined;
    era?: 'long' | 'short' | 'narrow' | undefined;
    year?: 'numeric' | '2-digit' | undefined;
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
    day?: 'numeric' | '2-digit' | undefined;
    hour?: 'numeric' | '2-digit' | undefined;
    minute?: 'numeric' | '2-digit' | undefined;
    second?: 'numeric' | '2-digit' | undefined;
    timeZoneName?: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined;
    formatMatcher?: 'best fit' | 'basic' | undefined;
    hour12?: boolean | undefined;
    timeZone?: string | undefined;
  }
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  INumberFormatConfig,
  IDateTemplate,
  IDateTemplateConfigs,
};
