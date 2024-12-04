import { describe, test, expect } from 'vitest';
import {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isSlugValid,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('isStringValid', () => {
  test.each([
    // essential
    ['', undefined, undefined, true],
    [' ', undefined, undefined, true],
    ['Hello World!', undefined, undefined, true],

    // ranges
    ['', 1, undefined, false],
    ['A', 1, undefined, true],
    ['ABCDE', undefined, 5, true],
    ['ABCDEF', undefined, 5, false],
    ['ABCDEF', 1, 5, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    [1, undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isStringValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isStringValid(a, b, c)).toBe(expected);
  });
});




describe('isNumberValid', () => {
  test.each([
    // essential
    [1, undefined, undefined, true],
    [0, undefined, undefined, true],
    [-1, undefined, undefined, true],
    [Number.MIN_SAFE_INTEGER, undefined, undefined, true],
    [Number.MAX_SAFE_INTEGER, undefined, undefined, true],

    // ranges
    [0, 1, 5, false],
    [1, 1, 5, true],
    [2, 1, 5, true],
    [3, 1, 5, true],
    [4, 1, 5, true],
    [5, 1, 5, true],
    [6, 1, 5, false],
    [NaN, undefined, undefined, false],
    [NaN, 0, undefined, false],
    [Number.MIN_SAFE_INTEGER - 1, undefined, undefined, false],
    [Number.MAX_SAFE_INTEGER + 1, undefined, undefined, false],
    [Infinity, undefined, undefined, false],
    [-Infinity, undefined, undefined, false],
    [-1, 0, undefined, false],
    [1, undefined, 0, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['', undefined, undefined, false],
    ['1', undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isNumberValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isNumberValid(a, b, c)).toBe(expected);
  });
});





describe('isIntegerValid', () => {
  test.each([
    // essential
    [1, undefined, undefined, true],
    [0, undefined, undefined, true],
    [-1, undefined, undefined, true],
    [14400000, undefined, undefined, true],
    [Number.MAX_SAFE_INTEGER, undefined, undefined, true],
    [Number.MIN_SAFE_INTEGER, undefined, undefined, true],
    [1562851996000, undefined, undefined, true],

    // ranges
    [0, 1, 5, false],
    [1, 1, 5, true],
    [2, 1, 5, true],
    [3, 1, 5, true],
    [4, 1, 5, true],
    [5, 1, 5, true],
    [6, 1, 5, false],
    [NaN, 0, undefined, false],
    [-Infinity, 0, undefined, false],
    [Infinity, undefined, 1, false],
    [Number.MAX_SAFE_INTEGER + 1, undefined, undefined, false],
    [Number.MIN_SAFE_INTEGER - 1, undefined, undefined, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['', undefined, undefined, false],
    ['1', undefined, undefined, false],
    [true, undefined, undefined, false],
    [55.85, undefined, undefined, false],
    [Infinity, undefined, undefined, false],
    [-Infinity, undefined, undefined, false],
    [NaN, undefined, undefined, false],
  ])('isIntegerValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isIntegerValid(a, b, c)).toBe(expected);
  });
});





describe('isTimestampValid', () => {
  test.each([
    // valid
    [14400000, true],
    [Number.MAX_SAFE_INTEGER, true],
    [Date.now(), true],
    [1562851996000, true],

    // invalid
    [undefined, false],
    [null, false],
    [{}, false],
    [[], false],
    ['a', false],
    ['JESUSGRATEROL@', false],
    ['Jes15-Gratero_.!', false],
    ['@@', false],
    ['Jes15-Gratero_.as', false],
    ['jesu()', false],
    ['asdjkhxaslkdj546512asdkasd', false],
    ['', false],
    [' ', false],
    ['   ', false],
    [123, false],
    [true, false],
    [14300000, false],
    [Number.MAX_SAFE_INTEGER + 1, false],
    [14400000.5, false],
  ])('isTimestampValid(%s) -> %s', (a, expected) => {
    expect(isTimestampValid(a)).toBe(expected);
  });
});





describe('isObjectValid', () => {
  test.each([
    // valid
    [{}, true, true],
    [{ foo: 'bar', auth: 123, isAdmin: true, obj: { some: 'obj', arr: [1, 2] } }, undefined, true],
    [{ foo: 'bar', auth: 123, isAdmin: true, obj: { some: 'obj', arr: [1, 2] } }, true, true],

    // invalid
    [undefined, undefined, false],
    [null, undefined, false],
    [{}, false, false],
    [[], false, false],
    [[], true, false],
    ['a', undefined, false],
    ['JESUSGRATEROL@', undefined, false],
    ['Jes15-Gratero_.!', undefined, false],
    ['@@', undefined, false],
    ['Jes15-Gratero_.as', undefined, false],
    ['jesu()', undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, false],
    ['', undefined, false],
    [' ', undefined, false],
    ['   ', undefined, false],
    [123, undefined, false],
    [true, undefined, false],
  ])('isObjectValid(%s, %s) -> %s', (a, b, expected) => {
    expect(isObjectValid(a, b)).toBe(expected);
  });
});





describe('isArrayValid', () => {
  test.each([
    // valid
    [[], true, true],
    [[1, 2, 3], undefined, true],
    [['a', 'b', 'c'], undefined, true],
    [[[1, 2], [3, 4], [5, 6]], false, true],

    // invalid
    [undefined, undefined, false],
    [null, undefined, false],
    [{}, undefined, false],
    [[], false, false],
    ['a', undefined, false],
    ['JESUSGRATEROL@', undefined, false],
    ['Jes15-Gratero_.!', undefined, false],
    ['@@', undefined, false],
    ['Jes15-Gratero_.as', undefined, false],
    ['jesu()', undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, false],
    ['', undefined, false],
    [' ', undefined, false],
    ['   ', undefined, false],
    [123, undefined, false],
    [true, undefined, false],
  ])('isArrayValid(%s, %s) -> %s', (a, b, expected) => {
    expect(isArrayValid(a, b)).toBe(expected);
  });
});





describe('isSlugValid', () => {
  test.each([
    // valid
    ['jesusgraterol', undefined, undefined, true],
    ['JESUSGRATEROL', undefined, undefined, true],
    ['Jes15-Graterol_.', undefined, undefined, true],
    ['je', undefined, undefined, true],
    ['15', undefined, undefined, true],
    ['xD', undefined, undefined, true],
    ['Herassio-.', undefined, undefined, true],
    ['PythonWiz333', undefined, undefined, true],
    ['restAPI12.-_', undefined, undefined, true],
    ['__', undefined, undefined, true],

    // ranges
    ['j', 2, 5, false],
    ['je', 2, 5, true],
    ['jes', 2, 5, true],
    ['jesu', 2, 5, true],
    ['jesus', 2, 5, true],
    ['jesusg', 2, 5, false],

    // invalid
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['a', undefined, undefined, false],
    ['JESUSGRATEROL@', undefined, undefined, false],
    ['Jes15-Gratero_.!', undefined, undefined, false],
    ['@@', undefined, undefined, false],
    ['Jes15-Gratero_.as', undefined, undefined, false],
    ['jesu()', undefined, undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, undefined, false],
    ['', undefined, undefined, false],
    [' ', undefined, undefined, false],
    ['   ', undefined, undefined, false],
    [123, undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isSlugValid(%s, %d, %d) -> %s', (a, b, c, expected) => {
    expect(isSlugValid(a, b, c)).toBe(expected);
  });
});
