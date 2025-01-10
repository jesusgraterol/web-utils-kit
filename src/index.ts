import { IUUIDVersion } from './shared/types.js';
import {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isEmailValid,
  isSlugValid,
  isPasswordValid,
  isOTPSecretValid,
  isOTPTokenValid,
  isJWTValid,
  isAuthorizationHeaderValid,
  isSemverValid,
  isURLValid,
  isUUIDValid,
} from './validations/index.js';
import { INumberFormatConfig, IDateTemplate } from './transformers/types.js';
import {
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
} from './transformers/index.js';
import { ISortDirection } from './utils/types.js';
import {
  generateUUID,
  generateRandomString,
  generateRandomFloat,
  generateRandomInteger,
  generateSequence,
  sortPrimitives,
  sortRecords,
  shuffleArray,
  pickProps,
  omitProps,
  delay,
  retryAsyncFunction,
} from './utils/index.js';

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // shared
  type IUUIDVersion,

  // validations
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isEmailValid,
  isSlugValid,
  isPasswordValid,
  isOTPSecretValid,
  isOTPTokenValid,
  isJWTValid,
  isAuthorizationHeaderValid,
  isSemverValid,
  isURLValid,
  isUUIDValid,

  // transformers
  type INumberFormatConfig,
  type IDateTemplate,
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,

  // utils
  type ISortDirection,
  generateUUID,
  generateRandomString,
  generateRandomFloat,
  generateRandomInteger,
  generateSequence,
  sortPrimitives,
  sortRecords,
  shuffleArray,
  pickProps,
  omitProps,
  delay,
  retryAsyncFunction,
};
