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
  | 'UNABLE_TO_CREATE_DEEP_CLONE'
  | 'INVALID_BATCH_SIZE';
const ERRORS: { [key in IErrorCode]: IErrorCode } = {
  MIXED_OR_UNSUPPORTED_DATA_TYPES: 'MIXED_OR_UNSUPPORTED_DATA_TYPES',
  UNSUPPORTED_DATA_TYPE: 'UNSUPPORTED_DATA_TYPE',
  INVALID_OR_EMPTY_ARRAY: 'INVALID_OR_EMPTY_ARRAY',
  INVALID_OR_EMPTY_OBJECT: 'INVALID_OR_EMPTY_OBJECT',
  UNABLE_TO_SERIALIZE_JSON: 'UNABLE_TO_SERIALIZE_JSON',
  UNABLE_TO_DESERIALIZE_JSON: 'UNABLE_TO_DESERIALIZE_JSON',
  UNABLE_TO_CREATE_DEEP_CLONE: 'UNABLE_TO_CREATE_DEEP_CLONE',
  INVALID_BATCH_SIZE: 'INVALID_BATCH_SIZE',
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { ERRORS };
