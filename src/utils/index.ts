import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { IUUIDVersion } from '../shared/types.js';

/* ************************************************************************************************
 *                                           GENERATORS                                           *
 ************************************************************************************************ */

/**
 * Generates a UUID based on a version.
 * @param version
 * @returns string
 */
const generateUUID = (version: IUUIDVersion): string => {
  if (version === 7) {
    return uuidv7();
  }
  return uuidv4();
};





/* ************************************************************************************************
 *                                          MISC HELPERS                                          *
 ************************************************************************************************ */

/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds
 * @returns Promise<void>
 */
const delay = (seconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, Math.round(seconds * 1000));
});

/**
 * Executes an asynchronous function persistently, retrying on error with incremental delays
 * defined in retryScheduleDuration (seconds).
 * @param func
 * @param args?
 * @param retryScheduleDuration?
 * @returns Promise<T>
 */
const retryAsyncFunction = async <T>(
  func: (...args: any[]) => Promise<T>,
  args?: any[],
  retryScheduleDuration: number[] = [3, 5],
): Promise<T> => {
  try {
    if (args) {
      return await func(...args);
    }
    return await func();
  } catch (e) {
    if (retryScheduleDuration.length === 0) {
      throw e;
    }
    await delay(retryScheduleDuration[0]);
    return retryAsyncFunction(func, args, retryScheduleDuration.slice(1));
  }
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // generators
  generateUUID,

  // misc helpers
  delay,
  retryAsyncFunction,
};
