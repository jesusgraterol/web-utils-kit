import { describe, test, expect } from 'vitest';
import {
  prettifyNumber,
  prettifyFileSize,
  capitalizeFirst,
  toTitleCase,
  toSlug,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('prettifyNumber', () => {
  test.each([
    [1000.58, 2, undefined, undefined, '1,000.58'],
    [65544152361.6432, 3, undefined, undefined, '65,544,152,361.643'],
    [1000.58, 2, '$', undefined, '$1,000.58'],
    [1000.58, 2, undefined, '$', '1,000.58$'],
    [1000.58, 2, 'USD ', undefined, 'USD 1,000.58'],
    [1000.58654422, 8, undefined, ' BTC', '1,000.58654422 BTC'],
  ])('prettifyNumber(%d, %i, %s, %s) -> %s', (a, b, c, d, expected) => {
    expect(prettifyNumber(a, b, c, d)).toBe(expected);
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
});
