// @vitest-environment node
import { describe, expect, test } from 'vitest';

import { expectToRejectCode, expectToThrowCode, splitArrayIntoBatches } from './index.js';

describe('public API', () => {
  test('exports splitArrayIntoBatches from the package entry point', () => {
    expect(splitArrayIntoBatches([1, 2, 3], 2)).toStrictEqual([[1, 2], [3]]);
  });

  test('exports error assertion helpers from the package entry point', () => {
    expect(expectToThrowCode).toBeTypeOf('function');
    expect(expectToRejectCode).toBeTypeOf('function');
  });
});
