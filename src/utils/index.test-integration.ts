import { describe, test, expect } from 'vitest';
import { ERRORS } from '../shared/errors.js';
import { isIntegerValid, isUUIDValid } from '../validations/index.js';
import {
  generateUUID,
  generateRandomString,
  generateRandomFloat,
  generateRandomInteger,
  shuffleArray,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('Generators', () => {
  describe('generateUUID', () => {
    test('can generate a valid uuid v4', () => {
      [
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
        generateUUID(4),
      ].forEach((uuid) => {
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBe(36);
        expect(isUUIDValid(uuid, 4)).toBe(true);
        expect(
          /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
            uuid,
          ),
        ).toBe(true);
      });
    });

    test('can generate a valid uuid v7', () => {
      [
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
        generateUUID(7),
      ].forEach((uuid) => {
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBe(36);
        expect(isUUIDValid(uuid, 7)).toBe(true);
        expect(
          /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
            uuid,
          ),
        ).toBe(true);
      });
    });
  });

  describe('generateRandomString', () => {
    test('can generate a random string of any length', () => {
      const lengths = [5, 15, 35, 75, 100];
      const strings = lengths.map((len) => generateRandomString(len));
      strings.forEach((str, i) => {
        expect(new RegExp(`^[A-Za-z0-9]{${lengths[i]}}$`).test(str)).toBe(true);
      });
    });

    test('can generate a random string out a custom list of characters', () => {
      expect(/^[ABCDEFG]{100}$/.test(generateRandomString(100, 'ABCDEFG'))).toBe(true);
      expect(/^[0-9]{100}$/.test(generateRandomString(100, '0123456789'))).toBe(true);
    });
  });

  describe('generateRandomFloat', () => {
    test.each([
      [1, 10],
      [100, 1000],
      [-100, 10000],
      [76, 9885],
      [-5112, -11],
    ])('generateRandomFloat(%d, %d)', (min, max) => {
      const val = generateRandomFloat(min, max);
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThanOrEqual(max);
    });
  });

  describe('generateRandomInteger', () => {
    test.each([
      [1, 10],
      [100, 1000],
      [-100, 10000],
      [76, 9885],
      [-5112, -11],
    ])('generateRandomInteger(%d, %d)', (min, max) => {
      const val = generateRandomInteger(min, max);
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThanOrEqual(max);
      expect(isIntegerValid(val)).toBe(true);
    });
  });
});

describe('Object management helpers', () => {
  describe('shuffleArray', () => {
    test.each<Array<any>>([
      [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']],
      [[{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }]],
    ])('shuffleArray(%o)', (arr) => {
      const shuffled = shuffleArray(arr);
      expect(shuffled).not.toEqual(arr);
      expect(shuffled).toHaveLength(arr.length);
    });

    test.each<any>([
      [[]],
      [[1]],
      [[1]],
      [1],
      ['a'],
      [new Set([1, 2, 3, 4, 5])],
      [
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      ],
    ])('shuffleArray(%o)', (arr) => {
      expect(() => shuffleArray(arr)).toThrowError(ERRORS.INVALID_OR_EMPTY_ARRAY);
    });
  });
});
