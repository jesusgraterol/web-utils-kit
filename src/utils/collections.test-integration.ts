// @vitest-environment node
import { describe, expect, test } from 'vitest';

import { ERRORS } from '../shared/errors.js';
import { expectToThrowCode } from '../test-utils/index.js';

import { shuffleArray } from './collections.js';

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
      expectToThrowCode(() => shuffleArray(arr), ERRORS.INVALID_OR_EMPTY_ARRAY);
    });
  });
});
