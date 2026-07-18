// @vitest-environment node
import { describe, expect, test } from 'vitest';

import { ERRORS } from '../shared/errors.js';
import { expectToThrowCode } from '../test-utils/index.js';

import {
  applyDefaults,
  isEqual,
  omitProps,
  pickProps,
  splitArrayIntoBatches,
} from './collections.js';

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

describe('Object Management Helpers', () => {
  describe('splitArrayIntoBatches', () => {
    test.each([
      [[1, 2, 3], -1],
      [[1, 2, 3], 0],
      [[1, 2, 3], 2.5],
      [[1, 2, 3], NaN],
    ])('splitArrayIntoBatches(%o, %s) throws INVALID_BATCH_SIZE', (a, b) => {
      expectToThrowCode(() => splitArrayIntoBatches(a, b), ERRORS.INVALID_BATCH_SIZE);
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
      expectToThrowCode(() => pickProps(a, b), ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('pickProps(%s)', (a, b) => {
      expectToThrowCode(() => pickProps(a, b), ERRORS.INVALID_OR_EMPTY_ARRAY);
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
      expectToThrowCode(() => omitProps(a, b), ERRORS.INVALID_OR_EMPTY_OBJECT);
    });

    test.each<Array<any>>([
      [{ id: 1 }, {}],
      [{ id: 1 }, []],
    ])('omitProps(%s)', (a, b) => {
      expectToThrowCode(() => omitProps(a, b), ERRORS.INVALID_OR_EMPTY_ARRAY);
    });
  });

  describe('applyDefaults', () => {
    test('applies non-nullish overrides to the default values', () => {
      const defaults = {
        name: 'Anonymous',
        retryCount: 8,
        isEnabled: true,
      };

      expect(
        applyDefaults(defaults, {
          name: 'Alice',
          retryCount: 0,
          isEnabled: false,
        }),
      ).toStrictEqual({
        name: 'Alice',
        retryCount: 0,
        isEnabled: false,
      });
    });

    test('uses defaults for missing or nullish overrides', () => {
      const defaults: {
        name: string | null;
        retryCount: number | null;
        isEnabled: boolean;
      } = {
        name: 'Anonymous',
        retryCount: 8,
        isEnabled: true,
      };

      expect(
        applyDefaults(defaults, {
          name: null,
          retryCount: undefined,
        }),
      ).toStrictEqual(defaults);
    });

    test('returns a new shallow object containing only default keys', () => {
      const defaults = {
        options: { retryCount: 8 },
      };
      const overrides = {
        options: { retryCount: 4 },
        unsupportedProp: true,
      };
      const result = applyDefaults(defaults, overrides);

      expect(result).toStrictEqual({
        options: overrides.options,
      });
      expect(result).not.toBe(defaults);
      expect(result.options).toBe(overrides.options);
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
      expectToThrowCode(() => isEqual(a, b), ERRORS.UNSUPPORTED_DATA_TYPE);
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
