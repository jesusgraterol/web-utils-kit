// @vitest-environment node
import { describe, expect, test } from 'vitest';

import {
  applyDefaults,
  decodeBase64Url,
  encodeBase64Url,
  estimateReadingTime,
  expectToRejectCode,
  expectToThrowCode,
  hasNavigator,
  hasWindow,
  isFileNameValid,
  isIndexedDbAvailable,
  MAX_EMAIL_LENGTH,
  prefersReducedMotion,
  prettifyTime,
  splitArrayIntoBatches,
  waitUntil,
} from './index.js';

describe('public API', () => {
  test('exports applyDefaults from the package entry point', () => {
    expect(applyDefaults({ retryCount: 8 }, { retryCount: 4 })).toStrictEqual({ retryCount: 4 });
  });

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

  test('exports composable reading-time utilities from the package entry point', () => {
    expect(prettifyTime(estimateReadingTime('word '.repeat(200)))).toBe('1m');
  });

  test('exports the base64url transformers from the package entry point', () => {
    expect(decodeBase64Url(encodeBase64Url('{"page":2}'))).toBe('{"page":2}');
  });

  test('exports the file name validation from the package entry point', () => {
    expect(isFileNameValid('notes.md')).toBe(true);
  });

  test('exports the async and environment utilities from the package entry point', async () => {
    await expect(waitUntil(() => 'ready', { timeoutSeconds: 1 })).resolves.toBe('ready');
    [hasWindow, hasNavigator, isIndexedDbAvailable, prefersReducedMotion].forEach((check) => {
      expect(check).toBeTypeOf('function');
    });
  });

  test('keeps the date formatting constants internal', async () => {
    const publicApi = await import('./index.js');

    expect(publicApi).not.toHaveProperty('DATE_LOCALE');
    expect(publicApi).not.toHaveProperty('DATE_TEMPLATES_WITH_TIME');
  });
});
