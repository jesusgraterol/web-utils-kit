import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { isArrayValid, isObjectValid } from '../validations/index.js';

/**
 * Checks if a JSON value can be serialized (JSON.stringify).
 * @param value
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not an object or an array
 */
export const canJSONBeSerialized = (value: NonNullable<object>): void => {
  if (!isObjectValid(value, true) && !isArrayValid(value, true)) {
    throw new Error(
      encodeError(
        `The JSON value must be an object or an array in order to be stringified. Received: ${value}`,
        ERRORS.UNSUPPORTED_DATA_TYPE,
      ),
    );
  }
};

/**
 * Validates the result of a JSON serialization operation.
 * @param value
 * @param result
 * @throws
 * - UNABLE_TO_SERIALIZE_JSON: if the result of JSON.stringify is not a valid string
 */
export const validateJSONSerializationResult = (
  value: NonNullable<object>,
  result: unknown,
): void => {
  if (typeof result !== 'string' || !result.length) {
    throw new Error(
      encodeError(
        `Stringifying the JSON value '${value}' produced an invalid result: ${result}.`,
        ERRORS.UNABLE_TO_SERIALIZE_JSON,
      ),
    );
  }
};
