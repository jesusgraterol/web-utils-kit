// types
export type {
  IDateTemplate,
  IDateValue,
  INumberFormatConfig,
  ISubstitutionOptions,
  ITimeString,
} from './types.js';

// date transformers
export { prettifyDate, prettifyTime, toDate, toMS } from './date.js';

// JSON transformers
export {
  createDeepClone,
  parseJSON,
  pruneJSON,
  stringifyJSON,
  stringifyJSONDeterministically,
} from './json.js';

// number transformers
export {
  prettifyBadgeCount,
  prettifyFileSize,
  prettifyNumber,
  prettifyPercentage,
} from './number.js';

// string transformers
export {
  applySubstitutions,
  capitalizeFirst,
  maskMiddle,
  normalizeQuery,
  stringifyValue,
  toSlug,
  toTitleCase,
  truncateText,
} from './string.js';
