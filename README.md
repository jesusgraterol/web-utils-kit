# Web Utils

The `web-utils` package provides a collection of well-tested and thoroughly documented utility functions for various web development needs. Each function adheres to a strict coding style and best practices to ensure consistency and maintainability.





</br>

## Getting Started

Install the package:
```bash
npm install -S web-utils
```


## Examples

...:

```typescript
import { ... } from 'web-utils';

...
```




<br/>

## API Reference

### Validations

<details>
  <summary><code>isStringValid</code></summary>
  
  Verifies if a value is a valid string and its length is within a range (optional).
  ```typescript
  import { isStringValid } from 'web-utils';

  isStringValid(''); // true
  isStringValid('', 1, 5); // false
  isStringValid('abcde', 1, 5); // true
  isStringValid('abcdef', 1, 5); // false
  ```
</details>

<details>
  <summary><code>isNumberValid</code></summary>
  
  Verifies if a value is a valid number and is within a range (optional). The minimum value defaults to `Number.MIN_SAFE_INTEGER` (-9007199254740991) while the maximum value defaults to `Number.MAX_SAFE_INTEGER` (9007199254740991).
  ```typescript
  import { isNumberValid } from 'web-utils';

  isNumberValid(1); // true
  isNumberValid(2, 3, 5); // false
  isNumberValid(3, 3, 5); // true
  isNumberValid(6, 3, 5); // false
  ```
</details>

<details>
  <summary><code>isIntegerValid</code></summary>
  
  Verifies if a value is a valid integer and is within a range (optional). If a range is not provided, it will use the properties `Number.MIN_SAFE_INTEGER` & `Number.MAX_SAFE_INTEGER`.
  ```typescript
  import { isIntegerValid } from 'web-utils';

  isIntegerValid(1); // true
  isIntegerValid(1.5); // false
  ```
</details>

<details>
  <summary><code>isTimestampValid</code></summary>
  
  Verifies if a value is a valid unix timestamp in milliseconds. The smallest value is set for the beginning of the Unix epoch (January 1st, 1970 - 14400000) on the numeric limit established by JavaScript (9007199254740991).
  ```typescript
  import { isTimestampValid } from 'web-utils';

  isTimestampValid(Date.now()); // true
  isTimestampValid(14399999); // false
  isTimestampValid(Number.MIN_SAFE_INTEGER + 1); // false
  ```
</details>

<details>
  <summary><code>isObjectValid</code></summary>
  
  Verifies if a value is an actual object. It also validates if it has keys (optional).
  ```typescript
  import { isObjectValid } from 'web-utils';

  isObjectValid({}); // false
  isObjectValid({}, true); // true
  isObjectValid({ auth: 123, isAdmin: true }); // true
  isObjectValid([0, 1, { foo: 'bar' }]); // false
  ```
</details>

<details>
  <summary><code>isArrayValid</code></summary>
  
  Verifies if a value is an array. It also validates if it has elements inside (optional).
  ```typescript
  import { isArrayValid } from 'web-utils';

  isArrayValid([]); // false
  isArrayValid([], true); // true
  isArrayValid({ auth: 123, isAdmin: true }); // false
  ```
</details>

<details>
  <summary><code>isSlugValid</code></summary>
  
  Verifies if a slug meets the following requirements:
   - Accepts any Alpha Characters (lower and upper case)
   - Accepts any digits
   - Accepts `-` `,` `.` and/or `_`
   - Meets a length range (Defaults to 2 - 16)
  ```typescript
  import { isSlugValid } from 'web-utils';

  isSlugValid('PythonWiz333'); // true
  isSlugValid('hello-world', true); // true
  isSlugValid('jesus@graterol'); // false
  ```
</details>

<details>
  <summary><code>isPasswordValid</code></summary>
  
  Verifies if a password meets the following requirements:
   - Meets a length range (Defaults to 8 - 2048)
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
  ```typescript
  import { isPasswordValid } from 'web-utils';

  isPasswordValid('zR<q%+r2C,&fy.SE&~.(REXTqe4K[?>G'); // true
  isPasswordValid('some-weak-password'); // false
  ```
</details>

<details>
  <summary><code>isOTPSecretValid</code></summary>
  
  Verifies if a value has the correct OTP Secret Format.
  ```typescript
  import { isOTPSecretValid } from 'web-utils';

  isOTPSecretValid('NB2RGV2KAY2CMACD'); // true
  ```
</details>

<details>
  <summary><code>isOTPTokenValid</code></summary>
  
  Verifies if a value has the correct OTP Token Format.
  ```typescript
  import { isOTPTokenValid } from 'web-utils';

  isOTPTokenValid('123456'); // true
  isOTPTokenValid('1234567'); // false
  ```
</details>

<details>
  <summary><code>isJWTValid</code></summary>
  
  Verifies if a value has a correct JWT Format: `[Base64-URL Encoded Header].[Base64-URL Encoded Payload].[Signature]`
  ```typescript
  import { isJWTValid } from 'web-utils';

  isJWTValid('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o'); 
  // true
  ```
</details>

<details>
  <summary><code>isAuthorizationHeaderValid</code></summary>
  
  Verifies if a value has a valid Authorization Header format based on the RFC6750. Example: 
  `Authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9TJV...r7E20RMHrHDcEfxjoYZgeFONFh7HgQ`
  ```typescript
  import { isAuthorizationHeaderValid } from 'web-utils';

  isAuthorizationHeaderValid('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o'); 
  // true
  ```
</details>

<details>
  <summary><code>isSemverValid</code></summary>
  
  Verifies if a value complies with semantic versioning.
  ```typescript
  import { isSemverValid } from 'web-utils';

  isSemverValid('1.0.0'); // true
  ```
</details>

<details>
  <summary><code>isURLValid</code></summary>
  
  Verifies if a value is a valid URL.
  ```typescript
  import { isURLValid } from 'web-utils';

  isURLValid('https://jesusgraterol.dev'); // true
  isURLValid('jesusgraterol.dev'); // false
  ```
</details>

<details>
  <summary><code>isUUIDValid</code></summary>
  
  Verifies if a value is a valid UUID and that it matches a specific version.
  ```typescript
  import { isUUIDValid } from 'web-utils';

  isUUIDValid('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 4); // true
  isUUIDValid('01695553-c90c-705a-b56d-778dfbbd4bed', 7); // true
  ```
</details>



### Transformers

<details>
  <summary><code>prettifyNumber</code></summary>
  
  Verifies if a value is a valid UUID and that it matches a specific version.
  ```typescript
  import { prettifyNumber } from 'web-utils';

  prettifyNumber(1000.583); // '1,000.58'
  prettifyNumber(2654.69642236, { maximumFractionDigits: 8, suffix: ' BTC' }); 
  // '2,654.69642236 BTC'
  prettifyNumber(1000, { minimumFractionDigits: 2, prefix: '$' }); 
  // '$1,000.00'
  ```
</details>

<details>
  <summary><code>prettifyDate</code></summary>
  
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
  import { prettifyDate } from 'web-utils';

  prettifyDate(new Date(), 'datetime-long'); 
  // 'Thursday, December 5, 2024 at 12:05:20 PM'
  prettifyDate(Date.now(), 'date-medium'); 
  // 'December 5, 2024'
  ```
</details>

<details>
  <summary><code>prettifyFileSize</code></summary>
  
  Formats a bytes value into a human readable format.
  ```typescript
  import { prettifyFileSize } from 'web-utils';

  prettifyFileSize(85545, 6); // '83.540039 kB'
  prettifyFileSize(79551423); // '75.87 MB'
  ```
</details>

<details>
  <summary><code>prettifyBadgeCount</code></summary>
  
  Formats the number that will be inserted in a badge so it doesn't take too much space. If the current count is 0, it returns undefined as the badge shouldn't be displayed.
  ```typescript
  import { prettifyBadgeCount } from 'web-utils';

  prettifyBadgeCount(0); // undefined
  prettifyBadgeCount(11); // '9+'
  prettifyBadgeCount(135, 99); // '99+'
  ```
</details>

<details>
  <summary><code>capitalizeFirst</code></summary>
  
  Capitalizes the first letter of a string and returns the new value.
  ```typescript
  import { capitalizeFirst } from 'web-utils';

  capitalizeFirst('hello world'); // 'Hello world'
  ```
</details>

<details>
  <summary><code>toTitleCase</code></summary>
  
  Capitalizes the first letter of a string and returns the new value.
  ```typescript
  import { toTitleCase } from 'web-utils';

  toTitleCase('hello world'); // 'Hello World'
  ```
</details>

<details>
  <summary><code>toSlug</code></summary>
  
  Capitalizes the first letter of a string and returns the new value.
  ```typescript
  import { toSlug } from 'web-utils';

  toSlug('HELLO WORLD!!@'); // 'hello-world'
  ```
</details>










<br/>

## Types

<details>
  <summary><code>IUUIDVersion</code></summary>
  
  The UUID versions supported by this library.
  ```typescript
  type IUUIDVersion = 4 | 7;
  ```
</details>

<details>
  <summary><code>ISortDirection</code></summary>
  
  The sort direction that can be applied to a list
  ```typescript
  type ISortDirection = 'asc' | 'desc';
  ```
</details>

<details>
  <summary><code>INumberFormatConfig</code></summary>
  
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
