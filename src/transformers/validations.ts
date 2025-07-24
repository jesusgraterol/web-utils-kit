import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { isArrayValid, isObjectValid } from '../validations/index.js';

/* ************************************************************************************************
 *                                             JSON                                               *
 ************************************************************************************************ */
/**
 * Checks if a JSON value can be serialized (JSON.stringify).
 * @param value
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not an object or an array
 */
const canJSONBeSerialized = (value: unknown): void => {
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
const validateJSONSerializationResult = (value: unknown, result: unknown): void => {
  if (typeof result !== 'string' || !result.length) {
    throw new Error(
      encodeError(
        `Stringifying the JSON value '${value}' produced an invalid result: ${result}.`,
        ERRORS.UNABLE_TO_SERIALIZE_JSON,
      ),
    );
  }
};

/**
 * Checks if a JSON value can be deserialized (JSON.parse).
 * @param value
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not a non-empty string
 */
const canJSONBeDeserialized = (value: string): void => {
  if (typeof value !== 'string' || !value.length) {
    throw new Error(
      encodeError(
        `The JSON value must be a non-empty string in order to be parsed. Received: ${value}`,
        ERRORS.UNSUPPORTED_DATA_TYPE,
      ),
    );
  }
};

/**
 * Validates the result of a JSON deserialization operation (JSON.parse).
 * @param value
 * @param result
 * @throws
 * - UNABLE_TO_DESERIALIZE_JSON: if the result of JSON.parse is not a valid object or array
 */
const validateJSONDeserializationResult = (value: string, result: unknown): void => {
  if (!isObjectValid(result, true) && !isArrayValid(result, true)) {
    throw new Error(
      encodeError(
        `Parsing the JSON value '${value}' produced an invalid result: ${result}.`,
        ERRORS.UNABLE_TO_DESERIALIZE_JSON,
      ),
    );
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // json
  canJSONBeSerialized,
  validateJSONSerializationResult,
  canJSONBeDeserialized,
  validateJSONDeserializationResult,
};
