import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { isArrayValid, isObjectValid } from '../validations/index.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Checks if a list can be shuffled.
 * @param input The array to check.
 * @throws
 * - INVALID_OR_EMPTY_ARRAY: If the input is not an array or has less than 2 items.
 */
const canArrayBeShuffled = (input: unknown[]): void => {
  if (!Array.isArray(input) || input.length <= 1) {
    throw new Error(
      encodeError(
        'For an array to be shuffled it must contain at least 2 items.',
        ERRORS.INVALID_OR_EMPTY_ARRAY,
      ),
    );
  }
};

/**
 * Validates the input object and the keys to be picked/omitted.
 * @param input
 * @param propKeys
 * @throws
 * - INVALID_OR_EMPTY_OBJECT: If the input is not a valid object or is empty.
 * - INVALID_OR_EMPTY_ARRAY: If the keys are not a valid array or are empty.
 */
const validateObjectAndKeys = (input: unknown, propKeys: unknown): void => {
  if (!isObjectValid(input)) {
    throw new Error(
      encodeError(
        'The input must be a valid and non-empty object.',
        ERRORS.INVALID_OR_EMPTY_OBJECT,
      ),
    );
  }
  if (!isArrayValid(propKeys)) {
    throw new Error(
      encodeError(
        'The keys must be a valid and non-empty array of strings.',
        ERRORS.INVALID_OR_EMPTY_ARRAY,
      ),
    );
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { canArrayBeShuffled, validateObjectAndKeys };
