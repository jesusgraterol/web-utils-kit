import { describe, test, expect } from 'vitest';
import {
  prettifyNumber,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  prettifyDate,
} from './index.js';
import { IDateTemplate, INumberFormatConfig } from './types.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('prettifyNumber', () => {
  test.each(<Array<[number, Partial<INumberFormatConfig> | undefined, string]>>[
    [1000.583, undefined, '1,000.58'],
    [1000.583, { maximumFractionDigits: 2 }, '1,000.58'],
    [65544152361.6432, { maximumFractionDigits: 3 }, '65,544,152,361.643'],
    [1000.583, { prefix: '$' }, '$1,000.58'],
    [2654.69642236, { maximumFractionDigits: 8, suffix: ' BTC' }, '2,654.69642236 BTC'],
    [1000, { minimumFractionDigits: 2 }, '1,000.00'],
  ])('prettifyNumber(%d, %o) -> %s', (a, b, expected) => {
    expect(prettifyNumber(a, b)).toBe(expected);
  });
});

describe('prettifyDate', () => {
  test.each(<Array<[IDateTemplate]>>[
    ['date-short'],
    ['date-medium'],
    ['date-long'],
    ['time-short'],
    ['time-medium'],
    ['datetime-short'],
    ['datetime-medium'],
    ['datetime-long'],
  ])('prettifyDate(%s) -> valid string', (template) => {
    const res = prettifyDate(Date.now(), template);
    expect(res).toBeTypeOf('string');
    expect(res.length).toBeGreaterThan(0);
  });
});

describe('prettifyFileSize', () => {
  test.each([
    [1000, 2, '1000 B'],
    [2785, 2, '2.72 kB'],
    [85545, 6, '83.540039 kB'],
    [977615, 1, '954.7 kB'],
    [1211423, 2, '1.16 MB'],
    [79551423, 2, '75.87 MB'],
    [99479551423, 2, '92.65 GB'],
    [Number.MAX_SAFE_INTEGER, 2, '8.00 PB'],
  ])('prettifyFileSize(%d, %i) -> %s', (a, b, expected) => {
    expect(prettifyFileSize(a, b)).toBe(expected);
  });
});

describe('prettifyBadgeCount', () => {
  test.each([
    [0, undefined, undefined],
    [1, undefined, '1'],
    [9, undefined, '9+'],
    [10, undefined, '9+'],
    [9, 9, '9+'],
    [10, 9, '9+'],
    [100, 99, '99+'],
  ])('prettifyBadgeCount(%d, %d) -> %s', (a, b, expected) => {
    expect(prettifyBadgeCount(a, b)).toBe(expected);
  });
});

describe('capitalizeFirst', () => {
  test.each([
    ['', ''],
    ['hello world', 'Hello world'],
    ['this should work', 'This should work'],
    ['hello World', 'Hello World'],
  ])('capitalizeFirst(%s) -> %s', (a, expected) => {
    expect(capitalizeFirst(a)).toBe(expected);
  });
});

describe('toTitleCase', () => {
  test.each([
    ['', ''],
    ['hello world', 'Hello World'],
    ['This should work', 'This Should Work'],
    ['jesus graterol', 'Jesus Graterol'],
    ['JESUS GRATEROL', 'Jesus Graterol'],
  ])('toTitleCase(%s) -> %s', (a, expected) => {
    expect(toTitleCase(a)).toBe(expected);
  });
});

describe('toSlug', () => {
  test.each([
    ['', ''],
    ['hello world', 'hello-world'],
    ['hello - world', 'hello-world'],
    ['HELLO WORLD', 'hello-world'],
    ['This Should work!!@', 'this-should-work'],
  ])('toSlug(%s) -> %s', (a, expected) => {
    expect(toSlug(a)).toBe(expected);
  });
});
