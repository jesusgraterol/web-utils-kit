/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, bench } from 'vitest';

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
 *                                           pickProps                                            *
 ************************************************************************************************ */

const __pickProps1 = <T extends Record<string, any>, K extends keyof T>(input: T, keys: K[]): Pick<T, K> => (
  keys.reduce(
    (result, key) => ({ ...result, [key]: input[key] }),
    {} as Pick<T, K>,
  )
);

const __pickProps2 = <T extends Record<string, any>, K extends keyof T>(input: T, keys: K[]): Pick<T, K> => (
  Object.fromEntries(
    keys.map((key) => [key, input[key]]),
  ) as Pick<T, K>
);

describe('pickProps', () => {
  bench.only('__pickProps1', () => {
    const obj1 = __pickProps1(TEST_OBJ, ['id', 'name']);
    const obj2 = __pickProps1(TEST_OBJ, ['email', 'address']);
    const obj3 = __pickProps1(TEST_OBJ, ['id', 'name', 'email', 'address', 'orders']);
  });

  bench.only('__pickProps2', () => {
    const obj = __pickProps2(TEST_OBJ, ['id', 'name']);
    const obj2 = __pickProps2(TEST_OBJ, ['email', 'address']);
    const obj3 = __pickProps2(TEST_OBJ, ['id', 'name', 'email', 'address', 'orders']);
  });
});
