// @vitest-environment node
import { describe, expect, test } from 'vitest';

import {
  expectToRejectCode,
  expectToThrowCode,
  MAX_EMAIL_LENGTH,
  splitArrayIntoBatches,
} from './index.js';

describe('public API', () => {
  test('exports splitArrayIntoBatches from the package entry point', () => {
    expect(splitArrayIntoBatches([1, 2, 3], 2)).toStrictEqual([[1, 2], [3]]);
  });

  test('exports error assertion helpers from the package entry point', () => {
    expect(expectToThrowCode).toBeTypeOf('function');
    expect(expectToRejectCode).toBeTypeOf('function');
  });

  test('exports validation constants from the package entry point', () => {
    expect(MAX_EMAIL_LENGTH).toBe(320);
  });
});
