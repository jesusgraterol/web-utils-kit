// shared
export type { IJSONValue, IUUIDVersion } from './shared/types.js';

// validations
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
export {
  type INumberFormatConfig,
  type IDateTemplate,
  type ITimeString,
  type ISubstitutionOptions,
  prettifyNumber,
  prettifyDate,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  truncateText,
  maskMiddle,
  stringifyValue,
  applySubstitutions,
  toMS,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
  pruneJSON,
} from './transformers/index.js';

// utils
export {
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
  extractTokenFromAuthorizationHeader,
  extractEmailUsername,
  getInitials,
  getNextPageParam,
} from './utils/index.js';
