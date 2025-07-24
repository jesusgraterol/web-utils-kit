/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
type IErrorCode =
  | 'MIXED_OR_UNSUPPORTED_DATA_TYPES'
  | 'UNSUPPORTED_DATA_TYPE'
  | 'INVALID_OR_EMPTY_ARRAY'
  | 'INVALID_OR_EMPTY_OBJECT'
  | 'UNABLE_TO_SERIALIZE_JSON'
  | 'UNABLE_TO_DESERIALIZE_JSON'
  | 'UNABLE_TO_DEEP_CLONE';
const ERRORS: { [key in IErrorCode]: IErrorCode } = {
  MIXED_OR_UNSUPPORTED_DATA_TYPES: 'MIXED_OR_UNSUPPORTED_DATA_TYPES',
  UNSUPPORTED_DATA_TYPE: 'UNSUPPORTED_DATA_TYPE',
  INVALID_OR_EMPTY_ARRAY: 'INVALID_OR_EMPTY_ARRAY',
  INVALID_OR_EMPTY_OBJECT: 'INVALID_OR_EMPTY_OBJECT',
  UNABLE_TO_SERIALIZE_JSON: 'UNABLE_TO_SERIALIZE_JSON',
  UNABLE_TO_DESERIALIZE_JSON: 'UNABLE_TO_DESERIALIZE_JSON',
  UNABLE_TO_DEEP_CLONE: 'UNABLE_TO_DEEP_CLONE',
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { ERRORS };
