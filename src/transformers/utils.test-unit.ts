import { describe, test, expect } from 'vitest';
import { INumberFormatConfig } from './types.js';
import { buildNumberFormatConfig, getDateInstance } from './utils.js';

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
    [{ minimumFractionDigits: 2, maximumFractionDigits: 4, prefix: '$' }, mockNumberFormatConfig(2, 4, '$', '')],
    [{ minimumFractionDigits: 1, maximumFractionDigits: 8, suffix: 'BTC' }, mockNumberFormatConfig(1, 8, '', 'BTC')],
  ])('buildNumberFormatConfig(%o) -> %o', (a, expected) => {
    expect(buildNumberFormatConfig(a)).toStrictEqual(expected);
  });
});





describe('getDateInstance', () => {
  test('can create an instance of Date based on any valid value', () => {
    [
      1733412835329, '2024-12-05T15:33:55.329Z', new Date(1733412835329),
    ].forEach((value) => {
      const instance = getDateInstance(value);
      expect(instance).toBeInstanceOf(Date);
      expect(instance.getTime()).toBe(1733412835329);
    });
  });
});
