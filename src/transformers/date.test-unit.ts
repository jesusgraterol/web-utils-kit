// @vitest-environment node
import { describe, expect, test } from 'vitest';

import { ERRORS } from '../shared/errors.js';
import { expectToThrowCode } from '../test-utils/index.js';

import type { IDateTemplate, ITimeString } from './types.js';
import { prettifyDate, prettifyTime, toDate, toMS } from './date.js';

describe('toDate', () => {
  test.each(<Array<[number | string | Date]>>[
    [1733412835329],
    ['2024-12-05T15:33:55.329Z'],
    [new Date(1733412835329)],
  ])('toDate(%s) -> valid Date', (a) => {
    const instance = toDate(a);
    expect(instance).toBeInstanceOf(Date);
    expect(instance.getTime()).toBe(1733412835329);
  });
});

describe('prettifyDate', () => {
  test.each(<Array<[IDateTemplate]>>[
    ['date-short'],
    ['date-medium'],
    ['date-long'],
    ['time-short'],
    ['time-medium'],
    ['datetime-short'],
    ['datetime-medium'],
    ['datetime-long'],
  ])('prettifyDate(%s) -> valid string', (template) => {
    const res = prettifyDate(Date.now(), template);
    expect(res).toBeTypeOf('string');
    expect(res.length).toBeGreaterThan(0);
  });
});

describe('prettifyTime', () => {
  test.each(<Array<[number, string]>>[
    [0, '0s'],
    [999, '0s'],
    [1000, '1s'],
    [59_999, '59s'],
    [60_000, '1m'],
    [61_999, '1m'],
    [3_600_000, '1h'],
    [3_660_000, '1h 1m'],
    [86_400_000, '1d'],
    [90_000_000, '1d 1h'],
    [90_060_000, '1d 1h 1m'],
  ])('prettifyTime(%d) -> %s', (milliseconds, expected) => {
    expect(prettifyTime(milliseconds)).toBe(expected);
  });

  test.each(<Array<[number, string]>>[
    [-1, '0s'],
    [Number.NaN, '0s'],
    [Number.POSITIVE_INFINITY, '0s'],
  ])('prettifyTime(%d) -> safe fallback %s', (milliseconds, expected) => {
    expect(prettifyTime(milliseconds)).toBe(expected);
  });
});

describe('toMS', () => {
  test.each<[ITimeString, number]>([
    ['1 millisecond', 1],
    ['100 millisecond', 100],
    ['100 milliseconds', 100],
    ['1 second', 1000],
    ['10 second', 10000],
    ['10 seconds', 10000],
    ['1 minute', 60000],
    ['10 minute', 600000],
    ['10 minutes', 600000],
    ['1 hour', 3600000],
    ['10 hour', 36000000],
    ['10 hours', 36000000],
    ['1 day', 86400000],
    ['10 day', 864000000],
    ['10 days', 864000000],
    ['1 week', 604800000],
    ['10 week', 6048000000],
    ['10 weeks', 6048000000],
    ['1 month', 2629800000],
    ['10 month', 26298000000],
    ['10 months', 26298000000],
    ['1 year', 31557600000],
    ['10 year', 315576000000],
    ['10 years', 315576000000],
    ['53 years', 1672552800000],
    ['53 months', 139379400000],
    ['53 weeks', 32054400000],
    ['53 days', 4579200000],
    ['53 hours', 190800000],
    ['53 minutes', 3180000],
    ['53 seconds', 53000],
    ['53 milliseconds', 53],
  ])('toMS(%s) -> %i', (input, expected) => {
    expect(toMS(input)).toBe(expected);
  });

  test.each([
    '',
    '100',
    '1x',
    '1hour',
    '2dys',
    '3week',
    '1second',
    '100milliseconds',
    '1monthss',
    '1yearz',
    '1.5hr',
    '1   s   ',
    '.5 msec',
    '-100 ms',
    '-1.5 hr',
    '-10.5 h',
    '-.5 h',
    '53 millisecondss',
    '17 msecs ',
    '1 sec ',
    '1 min ',
    '1 hr ',
    '2 days ',
    '1 week ',
    ' 1 day',
    '1 day ',
    ' 1 day ',
    '53 YeArS',
    '53 WeEkS',
    '53 DaYS',
    '53 HoUrs',
    '53 MiLliSeCondS',
    '0 day',
    '0 days',
    '-2 days',
    '2.1 days',
    '0.5 years',
    '2  days',
  ])('toMS(%s) -> throws', (input) => {
    expectToThrowCode(() => toMS(input as ITimeString), ERRORS.INVALID_TIME_STRING);
  });
});
