import { extractMessage, getErrorCode, hasErrorCode, type IErrorCode } from 'error-message-utils';

/**
 * Verifies that an unknown error carries the expected code.
 * @param error The error to inspect.
 * @param expectedCode The expected error code.
 * @throws An error describing the missing or mismatched code.
 */
const __assertErrorCode = (error: unknown, expectedCode: IErrorCode): void => {
  if (hasErrorCode(error, expectedCode)) {
    return;
  }

  const actualCode = getErrorCode(error);
  const message =
    actualCode === null
      ? `Expected error code "${String(expectedCode)}", but the error did not include a code.`
      : `Expected error code "${String(expectedCode)}", but received error code "${String(actualCode)}".`;

  throw new Error(message, { cause: error });
};

/**
 * Verifies that an unknown error message contains the expected text when provided.
 * @param error The error to inspect.
 * @param expectedMessage The expected error message text.
 * @throws An error describing the mismatched message.
 */
const __assertErrorMessage = (error: unknown, expectedMessage?: string): void => {
  if (expectedMessage === undefined) {
    return;
  }

  const actualMessage = extractMessage(error);
  if (actualMessage.includes(expectedMessage)) {
    return;
  }

  throw new Error(
    `Expected error message to include "${expectedMessage}", but received error message "${actualMessage}".`,
    { cause: error },
  );
};

/**
 * Verifies the expected code and optional message text on an unknown error.
 * @param error The error to inspect.
 * @param expectedCode The expected error code.
 * @param expectedMessage The optional expected error message text.
 * @throws An error describing the first mismatched expectation.
 */
export const assertError = (
  error: unknown,
  expectedCode: IErrorCode,
  expectedMessage?: string,
): void => {
  __assertErrorCode(error, expectedCode);
  __assertErrorMessage(error, expectedMessage);
};
