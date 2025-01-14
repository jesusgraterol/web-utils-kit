

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
type IErrorCode = 'MIXED_OR_UNSUPPORTED_DATA_TYPES' | 'UNSUPPORTED_DATA_TYPE'
| 'INVALID_OR_EMPTY_ARRAY' | 'INVALID_OR_EMPTY_OBJECT' | 'UNABLE_TO_SERIALIZE_JSON';
const ERRORS: { [key in IErrorCode]: IErrorCode } = {
  MIXED_OR_UNSUPPORTED_DATA_TYPES: 'MIXED_OR_UNSUPPORTED_DATA_TYPES',
  UNSUPPORTED_DATA_TYPE: 'UNSUPPORTED_DATA_TYPE',
  INVALID_OR_EMPTY_ARRAY: 'INVALID_OR_EMPTY_ARRAY',
  INVALID_OR_EMPTY_OBJECT: 'INVALID_OR_EMPTY_OBJECT',
  UNABLE_TO_SERIALIZE_JSON: 'UNABLE_TO_SERIALIZE_JSON',
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ERRORS,
};
