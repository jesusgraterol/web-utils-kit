import { describe, test, expect } from 'vitest';
import { INumberFormatConfig } from './types.js';
import { buildNumberFormatConfig, getDateInstance, sortJSONObjectKeys } from './utils.js';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

// generates a number format config object
const mockNumberFormatConfig = (
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  prefix: string,
  suffix: string,
): INumberFormatConfig => ({
  minimumFractionDigits,
  maximumFractionDigits,
  prefix,
  suffix,
});

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('buildNumberFormatConfig', () => {
  test.each(<Array<[Partial<INumberFormatConfig> | undefined, INumberFormatConfig]>>[
    [undefined, mockNumberFormatConfig(0, 2, '', '')],
    [{}, mockNumberFormatConfig(0, 2, '', '')],
    [{ minimumFractionDigits: 2 }, mockNumberFormatConfig(2, 2, '', '')],
    [
      { minimumFractionDigits: 2, maximumFractionDigits: 4, prefix: '$' },
      mockNumberFormatConfig(2, 4, '$', ''),
    ],
    [
      { minimumFractionDigits: 1, maximumFractionDigits: 8, suffix: 'BTC' },
      mockNumberFormatConfig(1, 8, '', 'BTC'),
    ],
  ])('buildNumberFormatConfig(%o) -> %o', (a, expected) => {
    expect(buildNumberFormatConfig(a)).toStrictEqual(expected);
  });
});

describe('getDateInstance', () => {
  test.each(<Array<[number | string | Date]>>[
    [1733412835329],
    ['2024-12-05T15:33:55.329Z'],
    [new Date(1733412835329)],
  ])('getDateInstance(%s) -> valid Date', (a) => {
    const instance = getDateInstance(a);
    expect(instance).toBeInstanceOf(Date);
    expect(instance.getTime()).toBe(1733412835329);
  });
});

describe('sortJSONObjectKeys', () => {
  test.each(<Array<[unknown, unknown]>>[
    [123456, 123456],
    ['Hello there!', 'Hello there!'],
    [true, true],
    [{}, {}],
    [[], []],
    [
      { b: 2, a: 1 },
      { a: 1, b: 2 },
    ],
    [
      { b: 2, a: { 2: 'b', 1: 'a', 3: [1, 2, 3], 4: { z: 2, x: 5, y: true } } },
      { a: { 1: 'a', 2: 'b', 3: [1, 2, 3], 4: { x: 5, y: true, z: 2 } }, b: 2 },
    ],
    [[{ b: 2, a: 1, c: 4 }], [{ a: 1, b: 2, c: 4 }]],
    [
      [
        { b: 2, a: { 2: 'b', 1: 'a', 3: [1, 2, 3], 4: { z: 2, x: 5, y: true } } },
        { b: 2, a: 1, c: [{ d: 5, c: [1, 2, 3] }] },
      ],
      [
        { a: { 1: 'a', 2: 'b', 3: [1, 2, 3], 4: { x: 5, y: true, z: 2 } }, b: 2 },
        { a: 1, b: 2, c: [{ c: [1, 2, 3], d: 5 }] },
      ],
    ],
  ])('sortJSONObjectKeys(%j) -> %j', (value, expected) => {
    expect(JSON.stringify(sortJSONObjectKeys(value))).toBe(JSON.stringify(expected));
  });
});
