import { describe, test, expect } from 'vitest';
import { ERRORS } from '../shared/errors.js';
import { IDateTemplate, INumberFormatConfig } from './types.js';
import {
  prettifyNumber,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  prettifyDate,
  truncateText,
  maskMiddle,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('prettifyNumber', () => {
  test.each(<Array<[number, Partial<INumberFormatConfig> | undefined, string]>>[
    [1000.583, undefined, '1,000.58'],
    [1000.583, { maximumFractionDigits: 2 }, '1,000.58'],
    [65544152361.6432, { maximumFractionDigits: 3 }, '65,544,152,361.643'],
    [1000.583, { prefix: '$' }, '$1,000.58'],
    [2654.69642236, { maximumFractionDigits: 8, suffix: ' BTC' }, '2,654.69642236 BTC'],
    [1000, { minimumFractionDigits: 2 }, '1,000.00'],
  ])('prettifyNumber(%d, %o) -> %s', (a, b, expected) => {
    expect(prettifyNumber(a, b)).toBe(expected);
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

describe('prettifyFileSize', () => {
  test.each([
    [1000, 2, '1000 B'],
    [2785, 2, '2.72 kB'],
    [85545, 6, '83.540039 kB'],
    [977615, 1, '954.7 kB'],
    [1211423, 2, '1.16 MB'],
    [79551423, 2, '75.87 MB'],
    [99479551423, 2, '92.65 GB'],
    [Number.MAX_SAFE_INTEGER, 2, '8.00 PB'],
  ])('prettifyFileSize(%d, %i) -> %s', (a, b, expected) => {
    expect(prettifyFileSize(a, b)).toBe(expected);
  });
});

describe('prettifyBadgeCount', () => {
  test.each([
    [0, undefined, undefined],
    [1, undefined, '1'],
    [9, undefined, '9+'],
    [10, undefined, '9+'],
    [9, 9, '9+'],
    [10, 9, '9+'],
    [100, 99, '99+'],
  ])('prettifyBadgeCount(%d, %d) -> %s', (a, b, expected) => {
    expect(prettifyBadgeCount(a, b)).toBe(expected);
  });
});

describe('capitalizeFirst', () => {
  test.each([
    ['', ''],
    ['hello world', 'Hello world'],
    ['this should work', 'This should work'],
    ['hello World', 'Hello World'],
  ])('capitalizeFirst(%s) -> %s', (a, expected) => {
    expect(capitalizeFirst(a)).toBe(expected);
  });
});

describe('toTitleCase', () => {
  test.each([
    ['', ''],
    ['hello world', 'Hello World'],
    ['This should work', 'This Should Work'],
    ['jesus graterol', 'Jesus Graterol'],
    ['JESUS GRATEROL', 'Jesus Graterol'],
  ])('toTitleCase(%s) -> %s', (a, expected) => {
    expect(toTitleCase(a)).toBe(expected);
  });
});

describe('toSlug', () => {
  test.each([
    ['', ''],
    ['hello world', 'hello-world'],
    ['hello - world', 'hello-world'],
    ['HELLO WORLD', 'hello-world'],
    ['This Should work!!@', 'this-should-work'],
  ])('toSlug(%s) -> %s', (a, expected) => {
    expect(toSlug(a)).toBe(expected);
  });
});

describe('truncateText', () => {
  test.each([
    ['This is a message', 18, 'This is a message'],
    ['This is a message', 17, 'This is a message'],
    ['This is a message', 16, 'This is a mes...'],
    ['This is a message', 15, 'This is a me...'],
    ['This is a message', 14, 'This is a m...'],
  ])('truncateText(%s, %i) -> %s', (text, maxLength, expected) => {
    expect(truncateText(text, maxLength)).toBe(expected);
  });
});

describe('maskMiddle', () => {
  test.each([
    ['0102', 4, undefined, '0102'],
    ['12345678', 4, undefined, '12345678'],
    ['010201023', 4, undefined, '0102...1023'],
    ['01021234567890123456', 4, undefined, '0102...3456'],
    ['01021234567890123456', 6, '********', '010212********123456'],
    ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 4, undefined, 'bc1q...0wlh'],
    ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 6, '********', 'bc1qxy********hx0wlh'],
  ])('maskMiddle(%s, %i, %s) -> %s', (text, visibleChars, mask, expected) => {
    expect(maskMiddle(text, visibleChars, mask)).toBe(expected);
  });
});

describe('stringifyJSON', () => {
  test.each([[undefined], [null], [''], ['hello world'], [true], [123], [NaN]])(
    'stringifyJSON(%o) -> throws UNSUPPORTED_DATA_TYPE',
    (value) => {
      expect(() => stringifyJSON(value as any)).toThrowError(ERRORS.UNSUPPORTED_DATA_TYPE);
    },
  );

  test.each([
    [{ c: 6, b: [4, 5], a: 3, z: null }, '{"c":6,"b":[4,5],"a":3,"z":null}'],
    [{ a: 3, z: undefined }, '{"a":3}'],
    [[4, undefined, 6], '[4,null,6]'],
    [{ a: 3, z: '' }, '{"a":3,"z":""}'],
    [[4, '', 6], '[4,"",6]'],
    [{ c: 8, b: [{ z: 6, y: 5, x: 4 }, 7], a: 3 }, '{"c":8,"b":[{"z":6,"y":5,"x":4},7],"a":3}'],
    [{ b: { x: 1 }, a: { x: 1 } }, '{"b":{"x":1},"a":{"x":1}}'],
  ])('stringifyJSON(%j) -> %s', (value, expected) => {
    expect(stringifyJSON(value)).toBe(expected);
  });
});

describe('stringifyJSONDeterministically', () => {
  test.each([[undefined], [null], [''], ['hello world'], [true], [123], [NaN]])(
    'stringifyJSONDeterministically(%o) -> throws UNSUPPORTED_DATA_TYPE',
    (value) => {
      expect(() => stringifyJSONDeterministically(value as any)).toThrowError(
        ERRORS.UNSUPPORTED_DATA_TYPE,
      );
    },
  );

  test.each([
    [{ c: 6, b: [4, 5], a: 3, z: null }, '{"a":3,"b":[4,5],"c":6,"z":null}'],
    [{ a: 3, z: undefined }, '{"a":3}'],
    [[4, undefined, 6], '[4,null,6]'],
    [{ a: 3, z: '' }, '{"a":3,"z":""}'],
    [[4, '', 6], '[4,"",6]'],
    [{ c: 8, b: [{ z: 6, y: 5, x: 4 }, 7], a: 3 }, '{"a":3,"b":[{"x":4,"y":5,"z":6},7],"c":8}'],
    [{ b: { x: 1 }, a: { x: 1 } }, '{"a":{"x":1},"b":{"x":1}}'],
    [{ b: { a: 1 }, c: { a: 1 } }, '{"b":{"a":1},"c":{"a":1}}'],
  ])('stringifyJSONDeterministically(%j) -> %s', (value, expected) => {
    expect(stringifyJSONDeterministically(value)).toBe(expected);
  });
});

describe('parseJSON', () => {
  test.each([[undefined], [null], [''], [true], [123], [NaN]])(
    'parseJSON(%s) -> throws UNSUPPORTED_DATA_TYPE',
    (value) => {
      expect(() => parseJSON(value as any)).toThrowError(ERRORS.UNSUPPORTED_DATA_TYPE);
    },
  );
  test.each([['hello world']])('parseJSON(%s) -> throws UNABLE_TO_DESERIALIZE_JSON', (value) => {
    expect(() => parseJSON(value as any)).toThrowError(ERRORS.UNABLE_TO_DESERIALIZE_JSON);
  });

  test.each([
    ['{"c":6,"b":[4,5],"a":3,"z":null}', { c: 6, b: [4, 5], a: 3, z: null }],
    ['{"a":3}', { a: 3 }],
    ['[4,null,6]', [4, null, 6]],
    ['{"a":3,"z":""}', { a: 3, z: '' }],
    ['[4,"",6]', [4, '', 6]],
    ['{"c":8,"b":[{"z":6,"y":5,"x":4},7],"a":3}', { c: 8, b: [{ z: 6, y: 5, x: 4 }, 7], a: 3 }],
    ['{"b":{"x":1},"a":{"x":1}}', { b: { x: 1 }, a: { x: 1 } }],
  ])('parseJSON(%s) -> %o', (value, expected) => {
    expect(parseJSON(value)).toStrictEqual(expected);
  });
});

describe('createDeepClone', () => {
  test.each([[undefined], [null], [''], [true], [123], [NaN], ['hello world']])(
    'createDeepClone(%o) -> throws UNABLE_TO_DEEP_CLONE',
    (value) => {
      expect(() => createDeepClone(value as any)).toThrowError(ERRORS.UNABLE_TO_DEEP_CLONE);
    },
  );

  test('Can mutate properties without affecting the original', () => {
    const a = { a: 'Hello', b: { c: 'World' } };
    const b = createDeepClone(a);
    expect(b).toStrictEqual(a);

    b.b.c = 'Universe';
    expect(a.b.c).toBe('World');
    expect(b.b.c).toBe('Universe');
  });
});
