import { describe, afterEach, test, expect, vi } from 'vitest';
import { ISortDirection } from './types.js';
import {
  generateSequence,
  sortPrimitives,
  sortRecords,
  pickProps,
  omitProps,
  isEqual,
  delay,
  retryAsyncFunction,
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
});

describe('Sorting Utils', () => {
  test.each(<Array<[(number | string)[], ISortDirection, (number | string)[]]>>[
    [[], 'asc', []],

    // numeric values
    [[1, 2, 3, 4, 5], 'asc', [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], 'desc', [5, 4, 3, 2, 1]],
    [[5, 4, 3, 2, 1], 'asc', [1, 2, 3, 4, 5]],
    [[5, 4, 3, 2, 1], 'desc', [5, 4, 3, 2, 1]],
    [[3, 1, 4, 2, 5], 'asc', [1, 2, 3, 4, 5]],
    [[3, 1, 4, 2, 5], 'desc', [5, 4, 3, 2, 1]],

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
    [[[1], 2, 3], 'asc'],
  ])('sortPrimitives(%o, %s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (a, b) => {
    expect(() => a.sort(sortPrimitives(b))).toThrowError(ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES);
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
    [[{ v: [1] }, { v: [2] }, { v: '3' }]],
  ])('sortRecords(%o, %s) -> Error: MIXED_OR_UNSUPPORTED_DATA_TYPES', (a) => {
    expect(() => a.sort(sortRecords('v', 'asc'))).toThrowError(
      ERRORS.MIXED_OR_UNSUPPORTED_DATA_TYPES,
    );
  });
});

describe('Object Management Helpers', () => {
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
      expect(() => pickProps(a, b)).toThrowError(ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('pickProps(%s)', (a, b) => {
      expect(() => pickProps(a, b)).toThrowError(ERRORS.INVALID_OR_EMPTY_ARRAY);
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
      expect(() => omitProps(a, b)).toThrowError(ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('omitProps(%s)', (a, b) => {
      expect(() => omitProps(a, b)).toThrowError(ERRORS.INVALID_OR_EMPTY_ARRAY);
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
      expect(() => isEqual(a, b)).toThrowError(ERRORS.UNSUPPORTED_DATA_TYPE);
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
      await expect(retryAsyncFunction(fn, [0, 0])).rejects.toThrowError('This is an error!');
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
      expect(fn).toHaveBeenNthCalledWith(3);
    });

    test('can invoke a function persistently until its out of attempts with args', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('This is an error!'));
      const args = ['abc', 1, true, [1, 2], { foo: 'bar' }];
      await expect(retryAsyncFunction(() => fn(...args), [0, 0, 0])).rejects.toThrowError(
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
});
