import { IUUIDVersion } from './shared/types.js';
import {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
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

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // shared types
  type IUUIDVersion,

  // validations
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isSlugValid,
  isPasswordValid,
  isOTPSecretValid,
  isOTPTokenValid,
  isJWTValid,
  isAuthorizationHeaderValid,
  isSemverValid,
  isURLValid,
  isUUIDValid,

  // utilities
  // ...
};
