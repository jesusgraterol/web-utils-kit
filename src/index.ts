// shared types
export type { IJSONValue, IUUIDVersion } from './shared/types.js';

// error assertions
export { expectToThrowCode, expectToRejectCode } from './test-utils/index.js';

// validations
export { MAX_EMAIL_LENGTH } from './validations/index.js';

export {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isNumeric,
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

// transformers
export type {
  IDateTemplate,
  IDateValue,
  INumberFormatConfig,
  ISubstitutionOptions,
  ITimeString,
} from './transformers/index.js';

export {
  prettifyNumber,
  prettifyPercentage,
  toDate,
  prettifyDate,
  prettifyTime,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  truncateText,
  maskMiddle,
  normalizeQuery,
  stringifyValue,
  applySubstitutions,
  toMS,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
  pruneJSON,
} from './transformers/index.js';

// utilities
export type { IFilterByQueryOptions, ISortDirection } from './utils/index.js';

export {
  applyDefaults,
  generateUUID,
  generateRandomString,
  generateRandomFloat,
  generateRandomInteger,
  generateSequence,
  generateDateId,
  sortPrimitives,
  sortRecords,
  sortRecordsWithBigIntString,
  sortRecordsWithDateValue,
  shuffleArray,
  splitArrayIntoBatches,
  pickProps,
  omitProps,
  isEqual,
  filterByQuery,
  delay,
  retryAsyncFunction,
  extractTokenFromAuthorizationHeader,
  extractEmailUsername,
  getInitials,
  getNextPageParam,
  estimateReadingTime,
  extractFirstMarkdownHeadingName,
  extractSubstitutionPlaceholderNames,
} from './utils/index.js';
