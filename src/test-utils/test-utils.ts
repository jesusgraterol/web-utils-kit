import type { IErrorCode } from 'error-message-utils';

import { assertError } from './utilities.js';

/**
 * Asserts that a synchronous operation throws an error with the expected code and optional message
 * text. Codes and messages are resolved through error-message-utils, and message checks use
 * substring matching.
 * @param operation The synchronous operation expected to throw.
 * @param expectedCode The expected error code.
 * @param expectedMessage Optional text that the extracted error message must contain.
 * @throws An Error when the operation returns normally or the thrown error does not match. Errors
 * caused by a mismatched throw preserve the original error as their cause.
 * @example
 * expectToThrowCode(
 *   () => {
 *     throw Object.assign(new Error('Access denied'), { code: 'ACCESS_DENIED' });
 *   },
 *   'ACCESS_DENIED',
 *   'Access denied',
 * );
 */
export const expectToThrowCode = (
  operation: () => unknown,
  expectedCode: IErrorCode,
  expectedMessage?: string,
): void => {
  try {
    operation();
  } catch (error) {
    assertError(error, expectedCode, expectedMessage);
    return;
  }

  throw new Error(
    `Expected the operation to throw error code "${String(expectedCode)}", but it did not throw.`,
  );
};

/**
 * Asserts that a promise rejects with an error containing the expected code and optional message
 * text. Codes and messages are resolved through error-message-utils, and message checks use
 * substring matching.
 * @param promise The promise expected to reject.
 * @param expectedCode The expected error code.
 * @param expectedMessage Optional text that the extracted rejection message must contain.
 * @returns A promise that resolves with undefined when the rejection matches.
 * @throws An Error when the promise resolves or its rejection does not match. Errors caused by a
 * mismatched rejection preserve the original rejection as their cause.
 * @example
 * await expectToRejectCode(
 *   Promise.reject(Object.assign(new Error('Access denied'), { code: 'ACCESS_DENIED' })),
 *   'ACCESS_DENIED',
 *   'Access denied',
 * );
 */
export const expectToRejectCode = async (
  promise: PromiseLike<unknown>,
  expectedCode: IErrorCode,
  expectedMessage?: string,
): Promise<void> => {
  try {
    await promise;
  } catch (error) {
    assertError(error, expectedCode, expectedMessage);
    return;
  }

  throw new Error(
    `Expected the promise to reject with error code "${String(expectedCode)}", but it resolved.`,
  );
};
