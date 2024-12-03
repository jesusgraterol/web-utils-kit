# Web Utils

The `web-utils` package provides a collection of well-tested and thoroughly documented utility functions for various web development needs. Each function adheres to a strict coding style and best practices to ensure consistency and maintainability.





</br>

## Getting Started

Install the package:
```bash
npm install -S web-utils
```





</br>

## Usage

Encoding an error:

```typescript
import { encodeError } from 'error-message-utils';

if (emailExists()) {
  throw new Error(encodeError(
    'The provided email is already in use.', 
    'EMAIL_EXISTS'
  ));
  // 'The provided email is already in use.{(EMAIL_EXISTS)}'
}
```




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
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Acknowledgments

- ...





<br/>

## @TODOS

- [ ] ...





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
