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
  - `date-short` -> 29/04/1453
  - `date-medium` -> April 29th, 1453
  - `date-long` -> Friday, April 29th, 1453
  - `time-short` -> 12:00 AM
  - `time-medium` -> 12:00:00 AM
  - `datetime-short` -> 29/04/1453, 12:00 AM
  - `datetime-medium` -> Apr 29, 1453, 12:00:00 AM
  - `datetime-long` -> Friday, April 29th, 1453 at 12:00:00 AM
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
