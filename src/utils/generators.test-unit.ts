// @vitest-environment node
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  generateDateId,
  generateRandomFloat,
  generateRandomInteger,
  generateSequence,
} from './generators.js';

describe('Generators', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('generateRandomFloat', () => {
    test('uses a uniform continuous range without clamping values to the maximum', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      expect(generateRandomFloat(0, 1)).toBe(0.5);
    });
  });

  describe('generateRandomInteger', () => {
    test('includes the maximum integer in the range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999_999);

      expect(generateRandomInteger(1, 10)).toBe(10);
    });
  });

  describe('generateSequence', () => {
    test.each([
      [1, 10, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      [1, 10, 2, [1, 3, 5, 7, 9]],
      [0, 4, 1, [0, 1, 2, 3, 4]],
    ])('generateSequence(%d, %d, %d) -> %o', (a, b, c, expected) => {
      expect(generateSequence(a, b, c)).toStrictEqual(expected);
    });
  });

  describe('generateDateId', () => {
    test.each(<Array<[Date | number | string, string]>>[
      [new Date(2024, 0, 5, 12), '2024_01_05'],
      [new Date(2024, 10, 15, 12).getTime(), '2024_11_15'],
      ['2024-12-31T12:00:00', '2024_12_31'],
      ['2026-06-26T12:27:45.571Z', '2026_06_26'],
      [1782476885050, '2026_06_26'],
      ['2022-01-07T12:30:09.449Z', '2022_01_07'],
      [1641558609449, '2022_01_07'],
    ])('generateDateId(%o) -> %s', (value, expected) => {
      expect(generateDateId(value)).toBe(expected);
    });

    test('uses the current date when no value is provided', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 9, 12));

      expect(generateDateId()).toBe('2025_03_09');
    });
  });
});
