// @vitest-environment node
import { describe, afterEach, test, expect, vi } from 'vitest';
import type { ISortDirection } from './types.js';
import {
  generateSequence,
  sortPrimitives,
  sortRecords,
  sortRecordsWithBigIntString,
  sortRecordsWithDateValue,
  splitArrayIntoBatches,
  pickProps,
  omitProps,
  isEqual,
  filterByQuery,
  delay,
  retryAsyncFunction,
  extractTokenFromAuthorizationHeader,
  extractEmailUsername,
  getInitials,
  getNextPageParam,
  extractFirstMarkdownHeadingName,
  generateDateId,
} from './index.js';
import { ERRORS } from '../shared/errors.js';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

const TEST_OBJ = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    country: {
      name: 'USA',
      code: 'US',
      state: 'Some State',
      cities: [
        { name: 'City A', zip: '11111' },
        { name: 'City B', zip: '22222' },
      ],
    },
  },
  orders: [
    { id: 101, amount: 100, items: [{ id: 201, name: 'Widget A' }] },
    { id: 102, amount: 50, items: [{ id: 202, name: 'Widget B' }] },
  ],
};

// records containing date values accepted by sortRecordsWithDateValue
type IDateSortRecord = Record<'v', Date | number | string>;

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('Generators', () => {
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
    afterEach(() => {
      vi.useRealTimers();
    });

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

describe('Sorting Utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each(<Array<[(number | string | bigint)[], ISortDirection, (number | string | bigint)[]]>>[
    [[], 'asc', []],

    // numeric values
    [[1, 2, 3, 4, 5], 'asc', [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], 'desc', [5, 4, 3, 2, 1]],
    [[5, 4, 3, 2, 1], 'asc', [1, 2, 3, 4, 5]],
    [[5, 4, 3, 2, 1], 'desc', [5, 4, 3, 2, 1]],
    [[3, 1, 4, 2, 5], 'asc', [1, 2, 3, 4, 5]],
    [[3, 1, 4, 2, 5], 'desc', [5, 4, 3, 2, 1]],

    // bigint values
    [[1n, 2n, 3n, 4n, 5n], 'asc', [1n, 2n, 3n, 4n, 5n]],
    [[1n, 2n, 3n, 4n, 5n], 'desc', [5n, 4n, 3n, 2n, 1n]],
    [[5n, 4n, 3n, 2n, 1n], 'asc', [1n, 2n, 3n, 4n, 5n]],
    [[5n, 4n, 3n, 2n, 1n], 'desc', [5n, 4n, 3n, 2n, 1n]],
    [[3n, 1n, 4n, 2n, 5n], 'asc', [1n, 2n, 3n, 4n, 5n]],
    [[3n, 1n, 4n, 2n, 5n], 'desc', [5n, 4n, 3n, 2n, 1n]],
    [
      [9007199254740993n, -12n, 0n, 9007199254740992n, -12n],
      'asc',
      [-12n, -12n, 0n, 9007199254740992n, 9007199254740993n],
    ],
    [
      [9007199254740993n, -12n, 0n, 9007199254740992n, -12n],
      'desc',
      [9007199254740993n, 9007199254740992n, 0n, -12n, -12n],
    ],

    // string values
    [['a', 'b', 'c'], 'asc', ['a', 'b', 'c']],
    [['a', 'b', 'c'], 'desc', ['c', 'b', 'a']],
    [['Blue', 'Humpback', 'Beluga'], 'asc', ['Beluga', 'Blue', 'Humpback']],
    [['Blue', 'Humpback', 'Beluga'], 'desc', ['Humpback', 'Blue', 'Beluga']],
    [
      ['The', 'Magnetic', 'Edward', 'Sharpe', 'Zeros', 'And'],
      'asc',
      ['And', 'Edward', 'Magnetic', 'Sharpe', 'The', 'Zeros'],
    ],
    [
      ['The', 'Magnetic', 'Edward', 'Sharpe', 'Zeros', 'And'],
      'desc',
      ['Zeros', 'The', 'Sharpe', 'Magnetic', 'Edward', 'And'],
    ],
  ])('sortPrimitives(%o, %s) -> %o', (a, b, expected) => {
    const arr = a.slice();
    arr.sort(sortPrimitives(b));
    expect(arr).toStrictEqual(expected);
  });

  test.each(<Array<[(number | string)[], ISortDirection]>>[
    [[1, { foo: 'bar' }, 3, 4, 5], 'asc'],
    [[1, '2', 3, 4, 5], 'asc'],
    [[1, 2, '3', 4, '5'], 'asc'],
    [[1n, 2n, 3, 4n, 5n], 'asc'],
    [[1n, '2', 3n, 4n, 5n], 'asc'],
    [[[1], 2, 3], 'asc'],
  ])('sortPrimitives(%o, %s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (a, b) => {
    expect(() => a.sort(sortPrimitives(b))).toThrow(ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES);
  });

  test.each(<Array<[Record<string, any>[], ISortDirection, Record<string, any>[]]>>[
    [[], 'asc', []],

    // numeric values
    [[{ v: 1 }, { v: 2 }, { v: 3 }], 'asc', [{ v: 1 }, { v: 2 }, { v: 3 }]],
    [[{ v: 1 }, { v: 2 }, { v: 3 }], 'desc', [{ v: 3 }, { v: 2 }, { v: 1 }]],
    [
      [{ v: 21 }, { v: 37 }, { v: 45 }, { v: -12 }, { v: 13 }, { v: 37 }],
      'asc',
      [{ v: -12 }, { v: 13 }, { v: 21 }, { v: 37 }, { v: 37 }, { v: 45 }],
    ],
    [
      [{ v: 21 }, { v: 37 }, { v: 45 }, { v: -12 }, { v: 13 }, { v: 37 }],
      'desc',
      [{ v: 45 }, { v: 37 }, { v: 37 }, { v: 21 }, { v: 13 }, { v: -12 }],
    ],

    // bigint values
    [[{ v: 1n }, { v: 2n }, { v: 3n }], 'asc', [{ v: 1n }, { v: 2n }, { v: 3n }]],
    [[{ v: 1n }, { v: 2n }, { v: 3n }], 'desc', [{ v: 3n }, { v: 2n }, { v: 1n }]],
    [
      [{ v: 21n }, { v: 37n }, { v: 45n }, { v: -12n }, { v: 13n }, { v: 37n }],
      'asc',
      [{ v: -12n }, { v: 13n }, { v: 21n }, { v: 37n }, { v: 37n }, { v: 45n }],
    ],
    [
      [{ v: 21n }, { v: 37n }, { v: 45n }, { v: -12n }, { v: 13n }, { v: 37n }],
      'desc',
      [{ v: 45n }, { v: 37n }, { v: 37n }, { v: 21n }, { v: 13n }, { v: -12n }],
    ],
    [
      [{ v: 9007199254740993n }, { v: -12n }, { v: 0n }, { v: 9007199254740992n }],
      'asc',
      [{ v: -12n }, { v: 0n }, { v: 9007199254740992n }, { v: 9007199254740993n }],
    ],
    [
      [{ v: 9007199254740993n }, { v: -12n }, { v: 0n }, { v: 9007199254740992n }],
      'desc',
      [{ v: 9007199254740993n }, { v: 9007199254740992n }, { v: 0n }, { v: -12n }],
    ],

    // string values
    [[{ v: 'a' }, { v: 'b' }, { v: 'c' }], 'asc', [{ v: 'a' }, { v: 'b' }, { v: 'c' }]],
    [[{ v: 'a' }, { v: 'b' }, { v: 'c' }], 'desc', [{ v: 'c' }, { v: 'b' }, { v: 'a' }]],
    [
      [{ v: 'Blue' }, { v: 'Humpback' }, { v: 'Beluga' }],
      'asc',
      [{ v: 'Beluga' }, { v: 'Blue' }, { v: 'Humpback' }],
    ],
    [
      [{ v: 'Blue' }, { v: 'Humpback' }, { v: 'Beluga' }],
      'desc',
      [{ v: 'Humpback' }, { v: 'Blue' }, { v: 'Beluga' }],
    ],
    [
      [
        { v: 'The' },
        { v: 'Magnetic' },
        { v: 'Edward' },
        { v: 'Sharpe' },
        { v: 'Zeros' },
        { v: 'And' },
      ],
      'asc',
      [
        { v: 'And' },
        { v: 'Edward' },
        { v: 'Magnetic' },
        { v: 'Sharpe' },
        { v: 'The' },
        { v: 'Zeros' },
      ],
    ],
    [
      [
        { v: 'The' },
        { v: 'Magnetic' },
        { v: 'Edward' },
        { v: 'Sharpe' },
        { v: 'Zeros' },
        { v: 'And' },
      ],
      'desc',
      [
        { v: 'Zeros' },
        { v: 'The' },
        { v: 'Sharpe' },
        { v: 'Magnetic' },
        { v: 'Edward' },
        { v: 'And' },
      ],
    ],
  ])('sortRecords(%o, %s) -> %o', (a, b, expected) => {
    const arr = a.slice();
    arr.sort(sortRecords('v', b));
    expect(arr).toStrictEqual(expected);
  });

  test.each(<Array<any>>[
    [[{ v: 'a' }, { v: 'b' }, { v: { c: 'c' } }]],
    [[{ v: 1 }, { v: 'b' }, { v: 3 }]],
    [[{ v: 1 }, { v: 2 }, { v: '3' }]],
    [[{ v: 1n }, { v: 2n }, { v: 3 }]],
    [[{ v: 1n }, { v: 2n }, { v: '3' }]],
    [[{ v: [1] }, { v: [2] }, { v: '3' }]],
  ])('sortRecords(%o, %s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (a) => {
    expect(() => a.sort(sortRecords('v', 'asc'))).toThrow(ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES);
  });

  test.each(<Array<[Array<Record<'v', string>>, ISortDirection, Array<Record<'v', string>>]>>[
    [[], 'asc', []],
    [[{ v: '1' }, { v: '2' }, { v: '3' }], 'asc', [{ v: '1' }, { v: '2' }, { v: '3' }]],
    [[{ v: '1' }, { v: '2' }, { v: '3' }], 'desc', [{ v: '3' }, { v: '2' }, { v: '1' }]],
    [
      [{ v: '21' }, { v: '37' }, { v: '45' }, { v: '-12' }, { v: '13' }, { v: '37' }],
      'asc',
      [{ v: '-12' }, { v: '13' }, { v: '21' }, { v: '37' }, { v: '37' }, { v: '45' }],
    ],
    [
      [{ v: '21' }, { v: '37' }, { v: '45' }, { v: '-12' }, { v: '13' }, { v: '37' }],
      'desc',
      [{ v: '45' }, { v: '37' }, { v: '37' }, { v: '21' }, { v: '13' }, { v: '-12' }],
    ],
    [
      [{ v: '9007199254740993' }, { v: '-12' }, { v: '0' }, { v: '9007199254740992' }],
      'asc',
      [{ v: '-12' }, { v: '0' }, { v: '9007199254740992' }, { v: '9007199254740993' }],
    ],
    [
      [{ v: '9007199254740993' }, { v: '-12' }, { v: '0' }, { v: '9007199254740992' }],
      'desc',
      [{ v: '9007199254740993' }, { v: '9007199254740992' }, { v: '0' }, { v: '-12' }],
    ],
  ])('sortRecordsWithBigIntString(%o, %s) -> %o', (a, b, expected) => {
    const arr = a.slice();
    arr.sort(sortRecordsWithBigIntString('v', b));
    expect(arr).toStrictEqual(expected);
  });

  test.each(<Array<[string, Array<Record<string, unknown>>]>>[
    ['mixed value types', [{ v: '1' }, { v: 2 }]],
    ['missing sort key', [{ v: '1' }, { value: '2' }]],
  ])('sortRecordsWithBigIntString(%s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (caseName, a) => {
    expect(() => a.sort(sortRecordsWithBigIntString('v', 'asc')), caseName).toThrow(
      ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
    );
  });

  test('sortRecordsWithBigIntString(invalid bigint string) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(() =>
      [{ v: '1' }, { v: 'not-a-bigint' }].sort(sortRecordsWithBigIntString('v', 'asc')),
    ).toThrow(ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES);
    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
  });

  test.each(<Array<[IDateSortRecord[], ISortDirection, IDateSortRecord[]]>>[
    [[], 'asc', []],
    [
      [
        { v: '2026-06-15T00:00:00.000Z' },
        { v: '2024-01-01T00:00:00.000Z' },
        { v: '2025-01-01T00:00:00.000Z' },
      ],
      'asc',
      [
        { v: '2024-01-01T00:00:00.000Z' },
        { v: '2025-01-01T00:00:00.000Z' },
        { v: '2026-06-15T00:00:00.000Z' },
      ],
    ],
    [
      [
        { v: '2026-06-15T00:00:00.000Z' },
        { v: '2024-01-01T00:00:00.000Z' },
        { v: '2025-01-01T00:00:00.000Z' },
      ],
      'desc',
      [
        { v: '2026-06-15T00:00:00.000Z' },
        { v: '2025-01-01T00:00:00.000Z' },
        { v: '2024-01-01T00:00:00.000Z' },
      ],
    ],
    [
      [
        { v: new Date('2026-06-15T00:00:00.000Z') },
        { v: '2024-01-01T00:00:00.000Z' },
        { v: 1_735_689_600_000 },
      ],
      'asc',
      [
        { v: '2024-01-01T00:00:00.000Z' },
        { v: 1_735_689_600_000 },
        { v: new Date('2026-06-15T00:00:00.000Z') },
      ],
    ],
    [
      [
        { v: new Date('2026-06-15T00:00:00.000Z') },
        { v: '2024-01-01T00:00:00.000Z' },
        { v: 1_735_689_600_000 },
      ],
      'desc',
      [
        { v: new Date('2026-06-15T00:00:00.000Z') },
        { v: 1_735_689_600_000 },
        { v: '2024-01-01T00:00:00.000Z' },
      ],
    ],
  ])('sortRecordsWithDateValue(%o, %s) -> %o', (a, b, expected) => {
    const arr = a.slice();
    arr.sort(sortRecordsWithDateValue('v', b));
    expect(arr).toStrictEqual(expected);
  });

  test.each(<Array<[string, Array<Record<string, unknown>>]>>[
    [
      'missing sort key',
      [{ v: '2024-01-01T00:00:00.000Z' }, { value: '2025-01-01T00:00:00.000Z' }],
    ],
    ['null date value', [{ v: null }, { v: '2025-01-01T00:00:00.000Z' }]],
  ])('sortRecordsWithDateValue(%s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (caseName, a) => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(() => a.sort(sortRecordsWithDateValue('v', 'asc')), caseName).toThrow(
      ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
    );
  });
});

describe('Object Management Helpers', () => {
  describe('splitArrayIntoBatches', () => {
    test.each([
      [[1, 2, 3], -1],
      [[1, 2, 3], 0],
      [[1, 2, 3], 2.5],
      [[1, 2, 3], NaN],
    ])('splitArrayIntoBatches(%o, %s) throws INVALID_BATCH_SIZE', (a, b) => {
      expect(() => splitArrayIntoBatches(a, b)).toThrow(ERRORS.INVALID_BATCH_SIZE);
    });

    test('passing an empty array returns an empty array', () => {
      expect(splitArrayIntoBatches([], 5)).toEqual([]);
    });

    test.each([
      [[1, 2, 3], 10, [[1, 2, 3]]],
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        3,
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
      [[1, 2, 3, 4, 5, 6, 7, 8, 9], 4, [[1, 2, 3, 4], [5, 6, 7, 8], [9]]],
      [[1, 2, 3, 4, 5, 6, 7, 8, 9], 2, [[1, 2], [3, 4], [5, 6], [7, 8], [9]]],
      [[1, 2, 3, 4, 5, 6, 7, 8, 9], 10, [[1, 2, 3, 4, 5, 6, 7, 8, 9]]],
    ])('splitArrayIntoBatches(%o, %i) -> %o', (a, b, expected) => {
      expect(splitArrayIntoBatches(a, b)).toStrictEqual(expected);
    });

    test('can split an array regardless of its content', () => {
      expect(
        splitArrayIntoBatches([{ foo: 'bar' }, [1, 2, 3], 'string', 123, true, null, undefined], 3),
      ).toStrictEqual([[{ foo: 'bar' }, [1, 2, 3], 'string'], [123, true, null], [undefined]]);
    });
  });

  describe('pickProps', () => {
    test('can pick a subset of properties from an object', () => {
      expect(pickProps(TEST_OBJ, ['id', 'name'])).toStrictEqual({
        id: TEST_OBJ.id,
        name: TEST_OBJ.name,
      });
      expect(pickProps(TEST_OBJ, ['email', 'address', 'orders'])).toStrictEqual({
        email: TEST_OBJ.email,
        address: TEST_OBJ.address,
        orders: TEST_OBJ.orders,
      });
    });

    test('can pick all of the properties', () => {
      expect(pickProps(TEST_OBJ, ['id', 'name', 'email', 'address', 'orders'])).toStrictEqual(
        TEST_OBJ,
      );
    });

    test.each<Array<any>>([
      [{}, ['id']],
      [[], ['id']],
      [undefined, ['id']],
      [null, ['id']],
      ['abc', ['id']],
      [1, ['id']],
    ])('pickProps(%s)', (a, b) => {
      expect(() => pickProps(a, b)).toThrow(ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('pickProps(%s)', (a, b) => {
      expect(() => pickProps(a, b)).toThrow(ERRORS.INVALID_OR_EMPTY_ARRAY);
    });
  });

  describe('omitProps', () => {
    test('can omit a subset of properties from an object', () => {
      expect(omitProps(TEST_OBJ, ['id', 'name'])).toStrictEqual({
        email: TEST_OBJ.email,
        address: TEST_OBJ.address,
        orders: TEST_OBJ.orders,
      });
      expect(omitProps(TEST_OBJ, ['email', 'address', 'orders'])).toStrictEqual({
        id: TEST_OBJ.id,
        name: TEST_OBJ.name,
      });
    });

    test('can omit all of the properties', () => {
      expect(omitProps(TEST_OBJ, ['id', 'name', 'email', 'address', 'orders'])).toStrictEqual({});
    });

    test.each<Array<any>>([
      [{}, ['id']],
      [[], ['id']],
      [undefined, ['id']],
      [null, ['id']],
      ['abc', ['id']],
      [1, ['id']],
    ])('omitProps(%s)', (a, b) => {
      expect(() => omitProps(a, b)).toThrow(ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('omitProps(%s)', (a, b) => {
      expect(() => omitProps(a, b)).toThrow(ERRORS.INVALID_OR_EMPTY_ARRAY);
    });
  });

  describe('isEqual', () => {
    test.each<Array<any>>([
      [{}, 'someString'],
      [[], 1],
      [{}, true],
      [[], null],
      [{}, undefined],
      ['someString', {}],
      [1, []],
      [true, {}],
      [null, []],
      [undefined, {}],
    ])("throws UNSUPPORTED_DATA_TYPE if any of the values isn't an object or an array", (a, b) => {
      expect(() => isEqual(a, b)).toThrow(ERRORS.UNSUPPORTED_DATA_TYPE);
    });

    test.each([
      [{ a: undefined }, { a: undefined }, true],
      [{ a: undefined }, {}, true],
      [{ a: 1 }, { a: 1 }, true],
      [{ a: 1 }, { a: 2 }, false],
      [{ a: 2 }, { a: 1 }, false],
      [{ a: 2, c: 5, b: 3 }, { c: 5, b: 3, a: 2 }, true],
      [{ a: 2, c: 5, b: 3 }, { c: 5, b: 3, a: 1 }, false],
      [{ a: 2, c: { y: 1, x: 6, z: 2 }, b: 3 }, { c: { z: 2, x: 6, y: 1 }, b: 3, a: 2 }, true],
      [{ a: 2, c: { y: 1, x: 6, z: 2 }, b: 3 }, { c: { z: 2, x: 5, y: 1 }, b: 3, a: 2 }, false],
    ])('isEqual(%o, %o) -> %s', (a, b, expected) => {
      expect(isEqual(a, b)).toBe(expected);
    });

    test.each([
      [[], [], true],
      [[1, 2, 3], [1, 2, 3], true],
      [[1, 2, 3], [3, 2, 1], false],
      [[{ a: 1, b: 2 }], [{ b: 2, a: 1 }], true],
      [[{ a: 1, b: 2 }], [{ b: 1, a: 2 }], false],
      [
        [
          { a: 1, b: 2 },
          { a: 4, b: 6 },
        ],
        [
          { b: 2, a: 1 },
          { b: 6, a: 4 },
        ],
        true,
      ],
      [[{ a: 2, c: { y: 1, x: 6, z: 2 }, b: 3 }], [{ c: { z: 2, x: 6, y: 1 }, b: 3, a: 2 }], true],
      [[{ a: 2, c: { y: 1, x: 6, z: 2 }, b: 3 }], [{ c: { z: 2, x: 1, y: 1 }, b: 3, a: 2 }], false],
    ])('isEqual(%o, %o) -> %s', (a, b, expected) => {
      expect(isEqual(a, b)).toBe(expected);
    });
  });
});

describe('Filters', () => {
  describe('filterByQuery', () => {
    test.each([
      [[], 'test', undefined, []],
      [[1, 2, 3], '', undefined, [1, 2, 3]],
      [[1, 2, 3], '   ', undefined, [1, 2, 3]],
      [['HELLO', 'WORLD'], 'h', undefined, ['HELLO']],
      [['HELLO', 'WORLD'], 'h W', undefined, ['HELLO', 'WORLD']],
      [['HELLO', 'WORLD'], 'Hello World', undefined, ['HELLO', 'WORLD']],
    ])('filterByQuery(%o, %s, %o) -> %o', (values, query, options, expected) => {
      expect(filterByQuery(values as any, query, options)).toStrictEqual(expected);
    });

    test('can limit the number of results', () => {
      expect(filterByQuery(['aa', 'ab', 'ac', 'ad'], 'a', { limit: 2 })).toStrictEqual([
        'aa',
        'ab',
      ]);
    });

    test('can query records by property', () => {
      const items = [
        { name: 'aaa', lastName: 'bbb' },
        { name: 'ccc', lastName: 'ddd' },
        { name: 'eee', lastName: 'fff' },
      ];
      expect(filterByQuery(items, 'a', { queryProp: 'name' })).toStrictEqual([
        { name: 'aaa', lastName: 'bbb' },
      ]);
      expect(filterByQuery(items, 'a', { queryProp: 'lastName' })).toStrictEqual([]);
    });

    test('can filter records by query', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Chalie' },
        { id: 4, name: 'David' },
      ];
      expect(filterByQuery(items, 'b')).toStrictEqual([{ id: 2, name: 'Bob' }]);
      expect(filterByQuery(items, 'a')).toStrictEqual([
        { id: 1, name: 'Alice' },
        { id: 3, name: 'Chalie' },
        { id: 4, name: 'David' },
      ]);
      expect(filterByQuery(items, 'al')).toStrictEqual([
        { id: 1, name: 'Alice' },
        { id: 3, name: 'Chalie' },
      ]);
      expect(filterByQuery(items, 'alie')).toStrictEqual([{ id: 3, name: 'Chalie' }]);
    });

    test('can query complex data structures', () => {
      const items = [
        { a: { x: 'Hello', y: ['yak', 123], p: { a: { b: 'croatoan' } }, z: { foo: 'bar' } } },
        { a: { x: 'Bye', y: ['Kok', 456], p: { a: { b: ['xaax'] } }, z: { foo: 'Haj' } } },
      ];
      expect(filterByQuery(items, 'HELLO')).toStrictEqual([items[0]]);
      expect(filterByQuery(items, '123')).toStrictEqual([items[0]]);
      expect(filterByQuery(items, 'croatoan')).toStrictEqual([items[0]]);
      expect(filterByQuery(items, 'kok')).toStrictEqual([items[1]]);
      expect(filterByQuery(items, 'xaax')).toStrictEqual([items[1]]);
      expect(filterByQuery(items, 'k')).toStrictEqual(items);
    });
  });
});

describe('Misc Helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('delay', () => {
    test('can delay the execution of a function for any number of seconds', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      delay(10).then(mockFn);
      expect(mockFn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(5000);
      expect(mockFn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(6000);
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });

  describe('retryAsyncFunction', () => {
    test('can invoke a function persistently until its out of attempts (w/ delay)', async () => {
      vi.useFakeTimers();
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      retryAsyncFunction(fn, [3, 5]);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(2100);
      expect(fn).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(5500);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('can invoke a function persistently until its out of attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('This is an error!'));
      await expect(retryAsyncFunction(fn, [0, 0])).rejects.toThrow('This is an error!');
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
      expect(fn).toHaveBeenNthCalledWith(3);
    });

    test('can invoke a function persistently until its out of attempts with args', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('This is an error!'));
      const args = ['abc', 1, true, [1, 2], { foo: 'bar' }];
      await expect(retryAsyncFunction(() => fn(...args), [0, 0, 0])).rejects.toThrow(
        'This is an error!',
      );
      expect(fn).toHaveBeenNthCalledWith(1, ...args);
      expect(fn).toHaveBeenNthCalledWith(2, ...args);
      expect(fn).toHaveBeenNthCalledWith(3, ...args);
      expect(fn).toHaveBeenNthCalledWith(4, ...args);
    });

    test('can invoke a function persistently until it resolves', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      await expect(retryAsyncFunction(fn, [0, 0])).resolves.toBeUndefined();
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
      expect(fn).toHaveBeenNthCalledWith(3);
    });

    test('can invoke a function persistently until it resolves a value', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce('Hello World!');
      await expect(retryAsyncFunction(fn, [0, 0])).resolves.toBe('Hello World!');
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
    });

    test('can invoke a function persistently until it resolves with args', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      const args = ['abc', 1, true, [1, 2], { foo: 'bar' }];
      await expect(retryAsyncFunction(() => fn(...args), [0, 0])).resolves.toBeUndefined();
      expect(fn).toHaveBeenNthCalledWith(1, ...args);
      expect(fn).toHaveBeenNthCalledWith(2, ...args);
      expect(fn).toHaveBeenNthCalledWith(3, ...args);
    });
  });

  describe('extractTokenFromAuthorizationHeader', () => {
    test.each([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
      ['Bearer abc123.XYZ-789_token', 'abc123.XYZ-789_token'],
    ])('extractTokenFromAuthorizationHeader(%s) -> %s', (header, expected) => {
      expect(extractTokenFromAuthorizationHeader(header)).toBe(expected);
    });

    test.each([
      undefined,
      null,
      {},
      [],
      '',
      'Bearer',
      'Bearer ',
      'bearer abc123',
      'Basic abc123',
      'Bearer abc123#',
    ])(
      'extractTokenFromAuthorizationHeader(%s) -> Error: INVALID_AUTHORIZATION_HEADER',
      (header) => {
        expect(() => extractTokenFromAuthorizationHeader(header as string)).toThrow(
          ERRORS.INVALID_AUTHORIZATION_HEADER,
        );
      },
    );
  });

  describe('extractEmailUsername', () => {
    test.each([
      ['johndoe@gmail.com', 'johndoe'],
      ['john.doe@protonmail.com', 'john.doe'],
      ['john.doe+shopping@protonmail.com', 'john.doe+shopping'],
      ['JOHNDOE@GMAIL.COM', 'johndoe'],
    ])('extractEmailUsername(%s) -> %s', (email, expected) => {
      expect(extractEmailUsername(email)).toBe(expected);
    });

    test.each([
      undefined,
      null,
      {},
      [],
      '',
      ' ',
      'domain.com',
      '@domain.com',
      'johndoe@gmail',
      'johndoe@gmail.',
      'johndoe@gmail.con',
    ])('extractEmailUsername(%s) -> Error: INVALID_EMAIL_ADDRESS', (email) => {
      expect(() => extractEmailUsername(email as string)).toThrow(ERRORS.INVALID_EMAIL_ADDRESS);
    });
  });

  describe('getInitials', () => {
    test.each([
      ['John Doe', 1, 'J'],
      ['John Doe', 2, 'JD'],
      ['John', 2, 'JO'],
      ['123 john - 456 doe', 2, 'JD'],
      ['12345', 3, 'A'],
      ['1!23@4#5', 1, 'A'],
      ['  ', 1, 'A'],
      ['', 1, 'A'],
    ])('getInitials(%s, %i) -> %s', (value, initialsCount, expected) => {
      expect(getInitials(value, initialsCount)).toBe(expected);
    });
  });

  describe('getNextPageParam', () => {
    test('returns undefined when the array is empty', () => {
      const emptyEntries: Array<{ id: string }> = [];

      expect(getNextPageParam('id', emptyEntries, 1)).toBeUndefined();
    });

    test('returns undefined when the array length is below the page size', () => {
      const entries = [
        { id: 'entry-1', createdAt: new Date('2026-01-01T00:00:00.000Z') },
        { id: 'entry-2', createdAt: new Date('2026-01-02T00:00:00.000Z') },
      ];

      expect(getNextPageParam('id', entries, 3)).toBeUndefined();
    });

    test.each(<Array<[string, number]>>[
      ['equal to', 2],
      ['greater than', 1],
    ])(
      'returns the requested property value when the array length is %s the page size',
      (_, pageSize) => {
        const entries = [
          { id: 'entry-1', createdAt: new Date('2026-01-01T00:00:00.000Z') },
          { id: 'entry-2', createdAt: new Date('2026-01-02T00:00:00.000Z') },
        ];

        const lastEntryId: string | undefined = getNextPageParam('id', entries, pageSize);
        const lastEntryCreatedAt: Date | undefined = getNextPageParam(
          'createdAt',
          entries,
          pageSize,
        );

        expect(lastEntryId).toBe('entry-2');
        expect(lastEntryCreatedAt).toStrictEqual(new Date('2026-01-02T00:00:00.000Z'));
      },
    );
  });
});

describe('extractFirstMarkdownHeadingName', () => {
  test.each(['', '  ', '\n', '\t', 'Hello world :)'])(
    'returns null when section is invalid: %j',
    (section) => {
      expect(extractFirstMarkdownHeadingName(section)).toBeNull();
    },
  );

  test('extracts the name from the first h1 heading', () => {
    expect(extractFirstMarkdownHeadingName('# Output format\n\nReturn concise Markdown.')).toBe(
      'Output format',
    );
  });

  test('extracts the name from the first heading regardless of heading level', () => {
    expect(
      extractFirstMarkdownHeadingName(
        [
          'Introductory text before the reusable section.',
          '',
          '### Review criteria',
          '',
          '# Later heading',
        ].join('\n'),
      ),
    ).toBe('Review criteria');
  });

  test('normalizes heading whitespace and trailing closing hashes', () => {
    expect(
      extractFirstMarkdownHeadingName('  ##   C# guidance ###  \n\nKeep inline hashes intact.'),
    ).toBe('C# guidance');
  });

  test('ignores heading-like lines inside fenced code blocks', () => {
    expect(
      extractFirstMarkdownHeadingName(
        ['```markdown', '# Example heading in code', '```', '', '## Runtime context'].join('\n'),
      ),
    ).toBe('Runtime context');
  });

  test('returns null when no markdown heading is found', () => {
    expect(extractFirstMarkdownHeadingName('Plain section content without a heading.')).toBeNull();
  });

  test('returns null when the first markdown heading has no text', () => {
    expect(extractFirstMarkdownHeadingName('###   \n\nBody content.')).toBeNull();
  });
});
