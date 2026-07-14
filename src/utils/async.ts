/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds The number of seconds to delay before the promise resolves.
 * @returns A promise that resolves after the specified number of seconds has passed.
 */
export const delay = (seconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.round(seconds * 1000));
  });

/**
 * Executes an asynchronous function persistently, retrying on error with incremental delays
 * defined in retryScheduleDuration (seconds).
 * @param fn The asynchronous function to be executed persistently.
 * @param retryScheduleDuration? An array of numbers representing the delay (in seconds) between each retry attempt. Defaults to [3, 5].
 * @returns A promise that resolves with the result of the asynchronous function or rejects with the last encountered error.
 */
export const retryAsyncFunction = async <T>(
  fn: () => Promise<T>,
  retryScheduleDuration: number[] = [3, 5],
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retryScheduleDuration.length === 0) {
      throw error;
    }
    await delay(retryScheduleDuration[0]);
    return retryAsyncFunction(fn, retryScheduleDuration.slice(1));
  }
};
