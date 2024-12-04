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
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  generateUUID,
};
