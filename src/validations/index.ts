

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Verifies if a value is a valid string and its length is within a range (optional)
 * @param value
 * @param minLength?
 * @param maxLength?
 * @returns boolean
 */
const isStringValid = (value: unknown, minLength?: number, maxLength?: number): value is string => (
  typeof value === 'string'
  && (minLength === undefined || value.length >= minLength)
  && (maxLength === undefined || value.length <= maxLength)
);

/**
 * Verifies if a value is a valid number and is within a range (optional). The minimum value
 * defaults to Number.MIN_SAFE_INTEGER (-9007199254740991) while the maximum value defaults to
 * Number.MAX_SAFE_INTEGER (9007199254740991).
 * @param value
 * @param min?
 * @param max?
 * @returns boolean
 */
const isNumberValid = (value: unknown, min?: number, max?: number): value is number => (
  typeof value === 'number'
  && !Number.isNaN(value)
  && value >= (min ?? Number.MIN_SAFE_INTEGER)
  && value <= (max ?? Number.MAX_SAFE_INTEGER)
);

/**
 * Verifies if a value is a valid integer and is within a range (optional). If a range is not
 * provided, it will use the properties Number.MIN_SAFE_INTEGER & Number.MAX_SAFE_INTEGER.
 * @param value
 * @param min?
 * @param max?
 * @returns boolean
 */
const isIntegerValid = (value: unknown, min?: number, max?: number): value is number => (
  isNumberValid(value, min, max)
  && Number.isInteger(value)
);

/**
 * Verifies if a value is a valid unix timestamp in milliseconds. The smallest value is set for
 * the beginning of the Unix epoch (January 1st, 1970 - 14400000) while the largest value is based
 * on the numeric limit established by JavaScript (9007199254740991).
 * @param value
 * @returns boolean
 */
const isTimestampValid = (value: unknown): value is number => isIntegerValid(value, 14400000);

/**
 * Verifies if a value is an actual object. It also validates if it has keys (optional).
 * @param value
 * @param allowEmpty?
 * @returns boolean
 */
const isObjectValid = (value: unknown, allowEmpty?: boolean): value is Record<string, any> => (
  Boolean(value)
  && typeof value === 'object'
  && !Array.isArray(value)
  && (allowEmpty || Object.keys(value as object).length > 0)
);

/**
 * Verifies if a value is an array. It also validates if it has elements inside (optional)
 * @param value
 * @param allowEmpty?
 * @returns boolean
 */
const isArrayValid = (value: unknown, allowEmpty?: boolean): value is Array<any> => (
  Array.isArray(value)
  && (allowEmpty || value.length > 0)
);

/**
 * Verifies if a slug meets the following requirements:
 * - Accepts any Alpha Characters (lower and upper case)
 * - Accepts any digits
 * - Accepts - , . and/or _
 * - Meets a length range (Defaults to 2 - 16)
 * @param value
 * @returns boolean
 */
const isSlugValid = (value: unknown, minLength?: number, maxLength?: number): value is string => (
  isStringValid(value, minLength ?? 2, maxLength ?? 16)
  && /^[a-zA-Z0-9\-._]+$/.test(value)
);

/**
 * Verifies if a password meets the following requirements:
 * - Meets a length range (Defaults to 8 - 2048)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param value
 * @returns boolean
 */
const isPasswordValid = (
  value: unknown,
  minLength?: number,
  maxLength?: number,
): value is string => (
  isStringValid(value, minLength ?? 8, maxLength ?? 2048)
  && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/.test(value)
);



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isSlugValid,
  isPasswordValid,
};
