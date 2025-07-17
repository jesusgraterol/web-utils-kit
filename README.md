# Web Utils Kit

The `web-utils-kit` package provides a collection of well-tested and thoroughly documented utility functions for various web development needs. Each function adheres to a strict coding style and best practices to ensure consistency and maintainability.

</br>

## Getting Started

Install the package:

```bash
npm install -S web-utils-kit
```

## Examples

Validate a password:

```typescript
import { isPasswordValid } from 'web-utils-kit';

isPasswordValid('zR<q%+r2C,&fy.SE&~.(REXTqe4K[?>G'); // true
isPasswordValid('some-weak-password'); // false
```

Sort a list of records:

```typescript
import { sortRecords } from 'web-utils-kit';

[{ v: 1 }, { v: 2 }, { v: 3 }].sort(sortRecords('v', 'desc'));
// [{ v: 3 }, { v: 2 }, { v: 1 }]
```

Execute an asynchronous function persistently:

```typescript
import { retryAsyncFunction } from 'web-utils-kit';

const res = await retryAsyncFunction(() => fetch('https://api.example.com/user/1')[(3, 5)]);
await res.json();
// {
//   uid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
//   nickname: 'PythonWiz333'
// }
```

<br/>

## API Reference

### Validations

<details>
  <summary><code>isStringValid</code></summary>
  <br/>
  Verifies if a value is a valid string and its length is within a range (optional).

  ```typescript
  import { isStringValid } from 'web-utils-kit';

  isStringValid(''); // true
  isStringValid('', 1, 5); // false
  isStringValid('abcde', 1, 5); // true
  isStringValid('abcdef', 1, 5); // false
  ```
</details>

<details>
  <summary><code>isNumberValid</code></summary>
  <br/>
  Verifies if a value is a valid number and is within a range (optional). The minimum value defaults to `Number.MIN_SAFE_INTEGER` (-9007199254740991) while the maximum value defaults to `Number.MAX_SAFE_INTEGER` (9007199254740991).

  ```typescript
  import { isNumberValid } from 'web-utils-kit';

  isNumberValid(1); // true
  isNumberValid(2, 3, 5); // false
  isNumberValid(3, 3, 5); // true
  isNumberValid(6, 3, 5); // false
  ```
</details>

<details>
  <summary><code>isIntegerValid</code></summary>
  <br/>
  Verifies if a value is a valid integer and is within a range (optional). If a range is not provided, it will use the properties `Number.MIN_SAFE_INTEGER` & `Number.MAX_SAFE_INTEGER`.
  
  ```typescript
  import { isIntegerValid } from 'web-utils-kit';

  isIntegerValid(1); // true
  isIntegerValid(1.5); // false
  ```
</details>

<details>
  <summary><code>isTimestampValid</code></summary>
  <br/>
  Verifies if a value is a valid unix timestamp in milliseconds. The smallest value is set for the beginning of the Unix epoch (January 1st, 1970 - 14400000) on the numeric limit established by JavaScript (9007199254740991).

  ```typescript
  import { isTimestampValid } from 'web-utils-kit';

  isTimestampValid(Date.now()); // true
  isTimestampValid(14399999); // false
  isTimestampValid(Number.MIN_SAFE_INTEGER + 1); // false
  ```
</details>

<details>
  <summary><code>isObjectValid</code></summary>
  <br/>
  Verifies if a value is an actual object. It also validates if it has keys (optional).

  ```typescript
  import { isObjectValid } from 'web-utils-kit';

  isObjectValid({}); // false
  isObjectValid({}, true); // true
  isObjectValid({ auth: 123, isAdmin: true }); // true
  isObjectValid([0, 1, { foo: 'bar' }]); // false
  ```
</details>

<details>
  <summary><code>isArrayValid</code></summary>
  <br/>
  Verifies if a value is an array. It also validates if it has elements inside (optional).

  ```typescript
  import { isArrayValid } from 'web-utils-kit';

  isArrayValid([]); // false
  isArrayValid([], true); // true
  isArrayValid({ auth: 123, isAdmin: true }); // false
  ```
</details>

<details>
  <summary><code>isEmailValid</code></summary>
  <br/>
  Verifies if a value is a valid email address.

  ```typescript
  import { isEmailValid } from 'web-utils-kit';

  isEmailValid('jesusgraterol@gmail.com'); // true
  isEmailValid('jesus@graterol'); // false

  // forbid certain extensions
  isEmailValid('jesusgraterol@gmail.con', ['.con']); // false
  ```
</details>

<details>
  <summary><code>isSlugValid</code></summary>
  <br/>
  Verifies if a slug meets the following requirements:
  - Accepts any Alpha Characters (lower and upper case)
  - Accepts any digits
  - Accepts `-` `,` `.` and/or `_`
  - Meets a length range (Defaults to 2 - 16)

  ```typescript
  import { isSlugValid } from 'web-utils-kit';

  isSlugValid('PythonWiz333'); // true
  isSlugValid('hello-world', true); // true
  isSlugValid('jesus@graterol'); // false
  ```
</details>

<details>
  <summary><code>isPasswordValid</code></summary>
  <br/>
  Verifies if a password meets the following requirements:
   - Meets a length range (Defaults to 8 - 2048)
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

  ```typescript
  import { isPasswordValid } from 'web-utils-kit';

  isPasswordValid('zR<q%+r2C,&fy.SE&~.(REXTqe4K[?>G'); // true
  isPasswordValid('some-weak-password'); // false
  ```
</details>

<details>
  <summary><code>isOTPSecretValid</code></summary>
  <br/>
  Verifies if a value has the correct OTP Secret Format.

  ```typescript
  import { isOTPSecretValid } from 'web-utils-kit';

  isOTPSecretValid('NB2RGV2KAY2CMACD'); // true
  ```
</details>

<details>
  <summary><code>isOTPTokenValid</code></summary>
  <br/>
  Verifies if a value has the correct OTP Token Format.

  ```typescript
  import { isOTPTokenValid } from 'web-utils-kit';

  isOTPTokenValid('123456'); // true
  isOTPTokenValid('1234567'); // false
  ```
</details>

<details>
  <summary><code>isJWTValid</code></summary>
  <br/>
  Verifies if a value has a correct JWT Format: `[Base64-URL Encoded Header].[Base64-URL Encoded Payload].[Signature]`

  ```typescript
  import { isJWTValid } from 'web-utils-kit';

  isJWTValid('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o');
  // true
  ```
</details>

<details>
  <summary><code>isAuthorizationHeaderValid</code></summary>
  <br/>
  Verifies if a value has a valid Authorization Header format based on the RFC6750. Example: 
  `Authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9TJV...r7E20RMHrHDcEfxjoYZgeFONFh7HgQ`

  ```typescript
  import { isAuthorizationHeaderValid } from 'web-utils-kit';

  isAuthorizationHeaderValid('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o');
  // true
  ```
</details>

<details>
  <summary><code>isSemverValid</code></summary>
  <br/>
  Verifies if a value complies with semantic versioning.

  ```typescript
  import { isSemverValid } from 'web-utils-kit';

  isSemverValid('1.0.0'); // true
  ```
</details>

<details>
  <summary><code>isURLValid</code></summary>
  <br/>
  Verifies if a value is a valid URL.

  ```typescript
  import { isURLValid } from 'web-utils-kit';

  isURLValid('https://jesusgraterol.dev'); // true
  isURLValid('jesusgraterol.dev'); // false
  ```
</details>

<details>
  <summary><code>isUUIDValid</code></summary>
  <br/>
  Verifies if a value is a valid UUID and that it matches a specific version.

  ```typescript
  import { isUUIDValid } from 'web-utils-kit';

  isUUIDValid('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 4); // true
  isUUIDValid('01695553-c90c-705a-b56d-778dfbbd4bed', 7); // true
  ```
</details>

### Transformers

<details>
  <summary><code>prettifyNumber</code></summary>
  <br/>
  Verifies if a value is a valid UUID and that it matches a specific version.

  ```typescript
  import { prettifyNumber } from 'web-utils-kit';

  prettifyNumber(1000.583); // '1,000.58'
  prettifyNumber(2654.69642236, { maximumFractionDigits: 8, suffix: ' BTC' });
  // '2,654.69642236 BTC'
  prettifyNumber(1000, { minimumFractionDigits: 2, prefix: '$' });
  // '$1,000.00'
  ```
</details>

<details>
  <summary><code>prettifyDate</code></summary>
  <br/>
  Formats a date instance based on a template.
  - `date-short` -> 12/05/2024 (Default)
  - `date-medium` -> December 5, 2024
  - `date-long` -> Thursday, December 5, 2024
  - `time-short` -> 12:05 PM
  - `time-medium` -> 12:05:20 PM
  - `datetime-short` -> 12/5/2024, 12:05 PM
  - `datetime-medium` -> December 5, 2024 at 12:05 PM
  - `datetime-long` -> Thursday, December 5, 2024 at 12:05:20 PM

  ```typescript
  import { prettifyDate } from 'web-utils-kit';

  prettifyDate(new Date(), 'datetime-long');
  // 'Thursday, December 5, 2024 at 12:05:20 PM'
  prettifyDate(Date.now(), 'date-medium');
  // 'December 5, 2024'
  ```
</details>

<details>
  <summary><code>prettifyFileSize</code></summary>
  <br/>
  Formats a bytes value into a human readable format.

  ```typescript
  import { prettifyFileSize } from 'web-utils-kit';

  prettifyFileSize(85545, 6); // '83.540039 kB'
  prettifyFileSize(79551423); // '75.87 MB'
  ```
</details>

<details>
  <summary><code>prettifyBadgeCount</code></summary>
  <br/>
  Formats the number that will be inserted in a badge so it doesn't take too much space. If the current count is 0, it returns undefined as the badge shouldn't be displayed.

  ```typescript
  import { prettifyBadgeCount } from 'web-utils-kit';

  prettifyBadgeCount(0); // undefined
  prettifyBadgeCount(11); // '9+'
  prettifyBadgeCount(135, 99); // '99+'
  ```
</details>

<details>
  <summary><code>capitalizeFirst</code></summary>
  <br/>
  Capitalizes the first letter of a string and returns the new value.

  ```typescript
  import { capitalizeFirst } from 'web-utils-kit';

  capitalizeFirst('hello world'); // 'Hello world'
  ```
</details>

<details>
  <summary><code>toTitleCase</code></summary>
  <br/>
  Converts a string value into Title Case.

  ```typescript
  import { toTitleCase } from 'web-utils-kit';

  toTitleCase('hello world'); // 'Hello World'
  ```
</details>

<details>
  <summary><code>toSlug</code></summary>
  <br/>
  Converts a string value into a slug.

  ```typescript
  import { toSlug } from 'web-utils-kit';

  toSlug('HELLO WORLD!!@'); // 'hello-world'
```
</details>

<details>
  <summary><code>truncateText</code></summary>
  <br/>
  Truncates a string to a specified length and appends an ellipsis if it exceeds that length.

  ```typescript
  import { truncateText } from 'web-utils-kit';

  truncateText('This is a message', 18); // 'This is a message'
  truncateText('This is a message', 17); // 'This is a message'
  truncateText('This is a message', 16); // 'This is a mes...'
  truncateText('This is a message', 15); // 'This is a me...'
  ```
</details>

<details>
  <summary><code>maskMiddle</code></summary>
  <br/>
  Masks the middle of a string, keeping a specified number of visible characters at the start and end.

  ```typescript
  import { maskMiddle } from 'web-utils-kit';

  maskMiddle('01021234567890123456', 4); // '0102...3456'
  maskMiddle('01021234567890123456', 6, '********'); // '010212********123456'
  ```
</details>


### Utils

<details>
  <summary><code>generateUUID</code></summary>
  <br/>
  Generates a UUID based on a version.

  ```typescript
  import { generateUUID } from 'web-utils-kit';

  generateUUID(4); // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  generateUUID(7); // '01695553-c90c-705a-b56d-778dfbbd4bed'
  ```
</details>

<details>
  <summary><code>generateRandomString</code></summary>
  <br/>
  Generates a string from randomly picked characters based on the length.

  ```typescript
  import { generateRandomString } from 'web-utils-kit';

  generateRandomString(15); // 'IbnqwSPvZdXxVyS'
  ```
</details>


<details>
  <summary><code>generateRandomFloat</code></summary>
  <br/>
  Generates a random number (decimal) constrained by the range.

  ```typescript
  import { generateRandomFloat } from 'web-utils-kit';

  generateRandomFloat(1, 100); // 67.551
  ```
</details>

<details>
  <summary><code>generateRandomInteger</code></summary>
  <br/>
  Generates a random number (integer) constrained by the range.

  ```typescript
  import { generateRandomInteger } from 'web-utils-kit';

  generateRandomInteger(1, 100); // 71
  ```
</details>


<details>
  <summary><code>generateSequence</code></summary>
  <br/>
  Generates a sequence of numbers within a range based on a number of steps.

  ```typescript
  import { generateSequence } from 'web-utils-kit';

  generateSequence(1, 10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  generateSequence(1, 10, 2); // [1, 3, 5, 7, 9]
  ```
</details>

<details>
  <summary><code>sortPrimitives</code></summary>
  <br/>
  Sorts a list of primitive values based on their type and a sort direction.

  ```typescript
  import { sortPrimitives } from 'web-utils-kit';

  [1, 2, 3, 4, 5].sort(sortPrimitives('asc'));
  // [1, 2, 3, 4, 5]
  [1, 2, 3, 4, 5].sort(sortPrimitives('desc'));
  // [5, 4, 3, 2, 1]
  ['a', 'b', 'c'].sort(sortPrimitives('asc'));
  // ['a', 'b', 'c']
  ['a', 'b', 'c'].sort(sortPrimitives('desc'));
  // ['c', 'b', 'a']
  ```
</details>


<details>
  <summary><code>sortRecords</code></summary>
  <br/>
  Sorts a list of record values by key based on their type and a sort direction.

  ```typescript
  import { sortRecords } from 'web-utils-kit';

  [{ v: 1 }, { v: 2 }, { v: 3 }].sort(sortRecords('v', 'asc'));
  // [1, 2, 3, 4, 5]
  [{ v: 1 }, { v: 2 }, { v: 3 }].sort(sortRecords('v', 'desc'));
  // [{ v: 3 }, { v: 2 }, { v: 1 }]
  [{ v: 'a' }, { v: 'b' }, { v: 'c' }].sort(sortRecords('v', 'asc'));
  // [{ v: 'a' }, { v: 'b' }, { v: 'c' }]
  [{ v: 'a' }, { v: 'b' }, { v: 'c' }].sort(sortRecords('v', 'desc'));
  // [{ v: 'c' }, { v: 'b' }, { v: 'a' }]
  ```
</details>

<details>
  <summary><code>shuffleArray</code></summary>
  <br/>
  Creates a shallow copy of the input array and shuffles it, using a version of the Fisher-Yates algorithm.

  ```typescript
  import { shuffleArray } from 'web-utils-kit';

  shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  // [4, 7, 5, 3, 6, 8, 9, 1, 2, 10]
  shuffleArray(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])
  // ['d', 'j', 'c', 'a', 'g', 'e', 'b', 'f', 'i', 'h']
  shuffleArray([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }])
  // [ { c: 3 }, { d: 4 }, { a: 1 }, { b: 2 }, { e: 5 } ]
  ```
</details>


<details>
  <summary><code>pickProps</code></summary>
  <br/>
  Picks a list of properties from an object and returns a new object (shallow) with the provided keys.

  ```typescript
  import { pickProps } from 'web-utils-kit';

  pickProps({ a: 1, b: 2, c: 3, d: 4 }, ['b', 'd'])
  // { b: 2, d: 4 }
  ```
</details>

<details>
  <summary><code>omitProps</code></summary>
  <br/>
  Omits a list of properties from an object and returns a new object (shallow) with only those keys that weren't omitted.

  ```typescript
  import { omitProps } from 'web-utils-kit';

  omitProps({ a: 1, b: 2, c: 3, d: 4 }, ['b', 'd'])
  // { a: 1, c: 3 }
  ```
</details>


<details>
  <summary><code>isEqual</code></summary>
  <br/>
  Compares two objects or arrays deeply and returns true if they are equals.

  ```typescript
  import { isEqual } from 'web-utils-kit';

  isEqual({ a: 2, c: 5, b: 3 }, { c: 5, b: 3, a: 2 });
  // true
  isEqual([{ a: 1, b: 2 }], [{ b: 2, a: 1 }]);
  // true
  ```
</details>

<details>
  <summary><code>delay</code></summary>
  <br/>
  Creates an asynchronous delay that resolves once the provided seconds have passed.

  ```typescript
  import { delay } from 'web-utils-kit';

  await delay(3);
  // ~3 seconds later
  ```
</details>


<details>
  <summary><code>retryAsyncFunction</code></summary>
  <br/>
  Executes an asynchronous function persistently, retrying on error with incremental delays defined in retryScheduleDuration (seconds).

  ```typescript
  import { retryAsyncFunction } from 'web-utils-kit';

  const res = await retryAsyncFunction(
    () => fetch('https://api.example.com/user/1'),
    [3, 5],
  );
  await res.json();
  // {
  //   uid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  //   nickname: 'PythonWiz333'
  // }
  ```
</details>

<br/>

## Types

<details>
  <summary><code>IUUIDVersion</code></summary>
  <br/>
  The UUID versions supported by this library.

  ```typescript
  type IUUIDVersion = 4 | 7;
  ```
</details>

<details>
  <summary><code>ISortDirection</code></summary>
  <br/>
  The sort direction that can be applied to a list.

  ```typescript
  type ISortDirection = 'asc' | 'desc';
  ```
</details>

<details>
  <summary><code>INumberFormatConfig</code></summary>
  <br/>
  The configuration that will be used to prettify a number.

  ```typescript
  type INumberFormatConfig = {
    minimumFractionDigits: number; // Default: 0
    maximumFractionDigits: number; // Default: 2
    prefix: string; // Default: ''
    suffix: string; // Default: ''
  };
  ```
</details>

<details>
  <summary><code>IDateTemplate</code></summary>
  <br/>
  A date can be prettified by choosing a template that meets the user's requirements.
  - `date-short` -> 12/05/2024 (Default)
  - `date-medium` -> December 5, 2024
  - `date-long` -> Thursday, December 5, 2024
  - `time-short` -> 12:05 PM
  - `time-medium` -> 12:05:20 PM
  - `datetime-short` -> 12/5/2024, 12:05 PM
  - `datetime-medium` -> December 5, 2024 at 12:05 PM
  - `datetime-long` -> Thursday, December 5, 2024 at 12:05:20 PM

  ```typescript
  type IDateTemplate = 'date-short' | 'date-medium' | 'date-long' | 'time-short' | 'time-medium' | 'datetime-short' | 'datetime-medium' | 'datetime-long';
  ```
</details>

<br/>

## Built With

- TypeScript

<br/>

## Running the Tests

```bash
# integration tests
npm run test:integration

# unit tests
npm run test:unit

# benchmarks
npm run test:bench
```

<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)

<br/>

## Deployment

Install dependencies:

```bash
npm install
```

Build the library:

```bash
npm start
```

Publish to `npm`:

```bash
npm publish
```
