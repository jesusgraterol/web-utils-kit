// @vitest-environment node
import { describe, test, expect } from 'vitest';
import { Exception } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import type { IDateTemplate, INumberFormatConfig, ITimeString } from './types.js';
import {
  prettifyNumber,
  prettifyPercentage,
  prettifyFileSize,
  prettifyBadgeCount,
  capitalizeFirst,
  toTitleCase,
  toSlug,
  prettifyDate,
  toDate,
  prettifyTime,
  truncateText,
  maskMiddle,
  stringifyValue,
  applySubstitutions,
  toMS,
  stringifyJSON,
  stringifyJSONDeterministically,
  parseJSON,
  createDeepClone,
  pruneJSON,
  normalizeQuery,
} from './index.js';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// ASCII and C1 control characters that search normalization replaces with word separators.
const CONTROL_CHARACTERS = String.fromCharCode(0, 31, 127, 159);

// error code values used by Exception assertions.
type IExpectedErrorCode = (typeof ERRORS)[keyof typeof ERRORS];

/**
 * Asserts that a synchronous function throws an Exception with the expected code and message.
 * @param fn The function expected to throw.
 * @param expectedCode The expected Exception code.
 * @param expectedMessage The expected Exception message when exact text matters.
 * @returns Nothing.
 */
const expectException = (
  fn: () => unknown,
  expectedCode: IExpectedErrorCode,
  expectedMessage?: string,
): void => {
  let thrownError: unknown;

  try {
    fn();
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeInstanceOf(Exception);

  const exception = thrownError as Exception;

  expect(exception.code).toBe(expectedCode);

  if (typeof expectedMessage === 'string') {
    expect(exception.message).toBe(expectedMessage);
  }
};

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

describe('prettifyPercentage', () => {
  test.each(<Array<[number, Partial<INumberFormatConfig> | undefined, string]>>[
    [10, undefined, '10%'],
    [25.583, { maximumFractionDigits: 2 }, '25.58%'],
    [100, { prefix: '~' }, '~100%'],
    [2.65469642236, { maximumFractionDigits: 8, suffix: ' APY' }, '2.65469642% APY'],
    [100, { minimumFractionDigits: 2 }, '100.00%'],
    [-3.45, { maximumFractionDigits: 2 }, '-3.45%'],
  ])('prettifyPercentage(%d, %o) -> %s', (a, b, expected) => {
    expect(prettifyPercentage(a, b)).toBe(expected);
  });
});

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
    ['hello world', 'hello-world'],
    ['hello - world', 'hello-world'],
    ['Hello World', 'hello-world'],
    ['HELLO WORLD', 'hello-world'],
    ['---Hello World', 'hello-world'],
    ['Hello World---', 'hello-world'],
    ['@@@Hello World!!!', 'hello-world'],
    ['Hello 🌎 World 🚀', 'hello-world'],
    ['This Should work!!@', 'this-should-work'],
    ['Cómo crear un blog en 2026', 'como-crear-un-blog-en-2026'],
    ['  Node.js & TypeScript: Best Practices!  ', 'node-js-typescript-best-practices'],
    ['¡Hola Mundo!', 'hola-mundo'],
    ['¿Cómo estás?', 'como-estas'],
    ['À la carte', 'a-la-carte'],
    ['Æther & Œuvre', 'ther-uvre'],
    ['Lina’s article', 'linas-article'],
    ['already---valid---slug', 'already-valid-slug'],
    ['hello_world_test', 'hello-world-test'],
    ['blog\\posts\\typescript', 'blog-posts-typescript'],
  ])('toSlug(%s) -> %s', (a, expected) => {
    expect(toSlug(a)).toBe(expected);
  });

  test.each(['', '!!!@@@###', '--__--', '@-@'])('toSlug(%s) -> throws', (a) => {
    expectException(
      () => toSlug(a),
      ERRORS.UNABLE_TO_SLUGIFY_STRING,
      `Failed to slugify the string '${a}': the resulting slug is empty.`,
    );
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

describe('normalizeQuery', () => {
  test.each([
    ['spacing and casing', '  Information     Sections  ', 'information sections'],
    ['line and tab separators', 'First\nSecond\tThird', 'first second third'],
    ['Unicode compatibility characters', 'Ｆｕｌｌｗｉｄｔｈ　Ｓｅａｒｃｈ', 'fullwidth search'],
    ['zero-width characters', 'quick\u200Bsearch\u200Cresult\uFEFF', 'quicksearchresult'],
  ])('normalizeQuery(%s) -> normalized query', (_, query, expectedQuery) => {
    expect(normalizeQuery(query)).toBe(expectedQuery);
  });

  test('replaces control characters with spaces before collapsing whitespace', () => {
    expect(normalizeQuery(`alpha${CONTROL_CHARACTERS}omega`)).toBe('alpha omega');
  });

  test('returns an empty string when only removable characters are provided', () => {
    expect(normalizeQuery(`  \u200B${CONTROL_CHARACTERS}\uFEFF  `)).toBe('');
  });

  test('limits the normalized query to the configured max length', () => {
    const maxLength = 10;
    const query = 'A'.repeat(maxLength + 1);

    expect(normalizeQuery(query, maxLength)).toBe('a'.repeat(maxLength));
  });
});

describe('stringifyValue', () => {
  test('returns string inputs unchanged', () => {
    expect(stringifyValue('hello world')).toBe('hello world');
    expect(stringifyValue('{"already":"stringified"}')).toBe('{"already":"stringified"}');
  });

  test.each(<Array<[unknown, string]>>[
    [undefined, 'undefined'],
    [null, 'null'],
    [true, 'true'],
    [false, 'false'],
    [0, '0'],
    [123.45, '123.45'],
    [NaN, 'NaN'],
    [10n, '10'],
    [Symbol('token'), 'Symbol(token)'],
  ])('stringifyValue(%o) -> %s', (value, expected) => {
    expect(stringifyValue(value)).toBe(expected);
  });

  test.each(<Array<[unknown, string]>>[
    [{ name: 'Jane', count: 2 }, '{"name":"Jane","count":2}'],
    [['ready', 3, false], '["ready",3,false]'],
    [{}, '{}'],
    [[], '[]'],
  ])('stringifyValue(%o) -> JSON string', (value, expected) => {
    expect(stringifyValue(value)).toBe(expected);
  });

  test('applies JSON indentation when stringifying objects and arrays', () => {
    expect(stringifyValue({ name: 'Jane', roles: ['admin', 'editor'] }, 2)).toBe(
      '{\n  "name": "Jane",\n  "roles": [\n    "admin",\n    "editor"\n  ]\n}',
    );
  });

  test('falls back to String when JSON stringification fails', () => {
    const circularValue: Record<string, unknown> = { name: 'Circular' };

    circularValue.self = circularValue;

    expect(stringifyValue(circularValue)).toBe('[object Object]');
  });
});

describe('applySubstitutions', () => {
  test('replaces placeholders with corresponding values', () => {
    expect(
      applySubstitutions('Hello, {{name}}! You have {{count}} new messages.', {
        name: 'John',
        count: 5,
      }),
    ).toBe('Hello, John! You have 5 new messages.');
  });

  test('leaves placeholders unchanged if no corresponding value is found', () => {
    expect(
      applySubstitutions('Hello, {{name}}! You have {{count}} new messages.', {
        name: 'John',
      }),
    ).toBe('Hello, John! You have {{count}} new messages.');
  });

  test('the keys in the substitutions object are case-sensitive', () => {
    expect(
      applySubstitutions('Hello, {{name}}! You have {{count}} new messages.', {
        Name: 'John',
        COUNT: 5,
      }),
    ).toBe('Hello, {{name}}! You have {{count}} new messages.');
  });

  test('handles empty input string', () => {
    expect(applySubstitutions('', { name: 'John' })).toBe('');
  });

  test('handles input string with no placeholders', () => {
    expect(applySubstitutions('Hello, world!', { name: 'John' })).toBe('Hello, world!');
  });

  test('handles empty substitutions object', () => {
    expect(applySubstitutions('Hello, {{name}}! You have {{count}} new messages.')).toBe(
      'Hello, {{name}}! You have {{count}} new messages.',
    );
  });

  test('handles placeholders with no corresponding keys in substitutions object', () => {
    expect(
      applySubstitutions('Hello, {{name}}! You have {{count}} new messages.', {
        age: 30,
        city: 'New York',
      }),
    ).toBe('Hello, {{name}}! You have {{count}} new messages.');
  });

  test('handles multiple occurrences of the same placeholder', () => {
    expect(applySubstitutions('Hello, {{name}}! Your name is {{name}}.', { name: 'John' })).toBe(
      'Hello, John! Your name is John.',
    );
  });

  test('handles placeholders with special characters in keys', () => {
    expect(
      applySubstitutions('Hello, {{user-name}}! Your email is {{user.email}}.', {
        'user-name': 'John',
        'user.email': 'john@example.com',
      }),
    ).toBe('Hello, John! Your email is john@example.com.');
  });

  test('stringifies object and array substitution values as compact JSON', () => {
    expect(
      applySubstitutions('User: {{user}}. Roles: {{roles}}.', {
        user: {
          id: 'user-1',
          name: 'Jane',
        },
        roles: ['admin', 'editor'],
      }),
    ).toBe('User: {"id":"user-1","name":"Jane"}. Roles: ["admin","editor"].');
  });

  test('applies JSON indentation to object and array substitution values', () => {
    expect(
      applySubstitutions(
        'User:\n{{user}}\nRoles:\n{{roles}}',
        {
          user: {
            id: 'user-1',
            name: 'Jane',
          },
          roles: ['admin', 'editor'],
        },
        {
          jsonIndent: 2,
        },
      ),
    ).toBe(
      'User:\n{\n  "id": "user-1",\n  "name": "Jane"\n}\nRoles:\n[\n  "admin",\n  "editor"\n]',
    );
  });

  test('replaces placeholders when their substitution value is null or undefined', () => {
    expect(
      applySubstitutions('Missing value: {{missingValue}}. Null value: {{nullValue}}.', {
        missingValue: undefined,
        nullValue: null,
      }),
    ).toBe('Missing value: undefined. Null value: null.');
  });

  test('falls back to String when a substitution value cannot be stringified as JSON', () => {
    const circularValue: Record<string, unknown> = { id: 'value-1' };

    circularValue.self = circularValue;

    expect(applySubstitutions('Value: {{value}}.', { value: circularValue })).toBe(
      'Value: [object Object].',
    );
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
    expectException(() => toMS(input as ITimeString), ERRORS.INVALID_TIME_STRING);
  });
});

describe('stringifyJSON', () => {
  test.each([[undefined], [null], [''], ['hello world'], [true], [123], [NaN]])(
    'stringifyJSON(%o) -> throws UNSUPPORTED_DATA_TYPE',
    (value) => {
      expectException(() => stringifyJSON(value), ERRORS.UNSUPPORTED_DATA_TYPE);
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
      expectException(() => stringifyJSONDeterministically(value), ERRORS.UNSUPPORTED_DATA_TYPE);
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
      expectException(() => parseJSON(value as string), ERRORS.UNSUPPORTED_DATA_TYPE);
    },
  );
  test.each([['hello world']])('parseJSON(%s) -> throws UNABLE_TO_DESERIALIZE_JSON', (value) => {
    expectException(() => parseJSON(value), ERRORS.UNABLE_TO_DESERIALIZE_JSON);
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
    'createDeepClone(%o) -> throws UNABLE_TO_CREATE_DEEP_CLONE',
    (value) => {
      expectException(() => createDeepClone(value), ERRORS.UNABLE_TO_CREATE_DEEP_CLONE);
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

describe('pruneJSON', () => {
  test.each([
    [null, null],
    [undefined, null],
    [123, 123],
    ['hello', 'hello'],
    [[], null],
    [{}, null],
    [
      { a: null, b: undefined, c: {}, d: [], e: 0, f: '', g: { h: null, i: 5 }, j: [null, 6] },
      { e: 0, f: '', g: { i: 5 }, j: [6] },
    ],
    [
      [null, undefined, {}, [], 0, '', { a: null, b: 3 }, [null, 4]],
      [0, '', { b: 3 }, [4]],
    ],
    [
      {
        a: { b: { c: { d: {} }, x: undefined } },
        z: null,
        y: [[], [null, { foo: { x: { a: null } } }], {}],
      },
      null,
    ],
    [
      {
        a: { b: { c: { d: { z: undefined, x: [], p: { a: 1 } } }, x: undefined } },
        z: null,
        y: [[], [null, { foo: { x: { a: null } } }], {}],
      },
      { a: { b: { c: { d: { p: { a: 1 } } } } } },
    ],
  ])('pruneJSON(%o) -> %o', (input, expected) => {
    expect(pruneJSON(input as any)).toStrictEqual(expected);
  });
});
