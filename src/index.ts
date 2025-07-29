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
  truncateText,
  maskMiddle,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
} from './transformers/index.js';
import { ISortDirection, IFilterByQueryOptions } from './utils/types.js';
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
  filterByQuery,
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
  truncateText,
  maskMiddle,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,

  // utils
  type ISortDirection,
  type IFilterByQueryOptions,
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
  filterByQuery,
  delay,
  retryAsyncFunction,
};
