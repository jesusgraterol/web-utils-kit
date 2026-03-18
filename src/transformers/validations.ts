import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { isArrayValid, isObjectValid } from '../validations/index.js';

/**
 * Checks if a JSON value can be serialized (JSON.stringify).
 * @param value The value to check for JSON serialization. It should be an object or an array.
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not an object or an array
 */
export const canJSONBeSerialized = (value: unknown): void => {
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
 * @param value The original value that was attempted to be serialized.
 * @param result The result of the JSON.stringify operation.
 * @throws
 * - UNABLE_TO_SERIALIZE_JSON: if the result of JSON.stringify is not a valid string
 */
export const validateJSONSerializationResult = (value: unknown, result: unknown): void => {
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
 * @param value The value to check for JSON deserialization.
 * @throws
 * - UNSUPPORTED_DATA_TYPE: if the provided value is not a non-empty string
 */
export const canJSONBeDeserialized = (value: string): void => {
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
 * @param value The original value that was attempted to be deserialized.
 * @param result The result of the JSON.parse operation.
 * @throws
 * - UNABLE_TO_DESERIALIZE_JSON: if the result of JSON.parse is not a valid object or array
 */
export const validateJSONDeserializationResult = (value: string, result: unknown): void => {
  if (!isObjectValid(result, true) && !isArrayValid(result, true)) {
    throw new Error(
      encodeError(
        `Parsing the JSON value '${value}' produced an invalid result: ${result}.`,
        ERRORS.UNABLE_TO_DESERIALIZE_JSON,
      ),
    );
  }
};
