

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Date Template
 * A date can be prettified by choosing a template that meets the user's requirements.
 * - date-short:
 * - date-medium:
 * - date-long:
 * - time-short:
 * - time-medium:
 * - datetime-short:
 * - datetime-medium:
 * - datetime-long:
 */
type IDateTemplate = 'date-short' | 'date-medium' | 'date-long' | 'time-short' | 'time-medium' |
'datetime-short' | 'datetime-medium' | 'datetime-long';



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IDateTemplate,
};
