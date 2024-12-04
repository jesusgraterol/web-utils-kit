import { describe, test, expect } from 'vitest';
import { isUUIDValid } from '../validations/index.js';
import { generateUUID } from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('generateUUID', () => {
  test('can generate a valid uuid v4', () => {
    [
      generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4),
      generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4),
      generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4), generateUUID(4),
    ].forEach((uuid) => {
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
      expect(isUUIDValid(uuid, 4)).toBe(true);
      expect(
        /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(uuid),
      ).toBe(true);
    });
  });

  test('can generate a valid uuid v7', () => {
    [
      generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7),
      generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7),
      generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7), generateUUID(7),
    ].forEach((uuid) => {
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
      expect(isUUIDValid(uuid, 7)).toBe(true);
      expect(
        /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(uuid),
      ).toBe(true);
    });
  });
});
