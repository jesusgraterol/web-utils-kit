

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
type IErrorCode = 'MIXED_OR_UNSUPPORTED_DATA_TYPES' | 'INVALID_OR_EMPTY_ARRAY' | 'INVALID_OR_EMPTY_OBJECT';
const ERRORS: { [key in IErrorCode]: IErrorCode } = {
  MIXED_OR_UNSUPPORTED_DATA_TYPES: 'MIXED_OR_UNSUPPORTED_DATA_TYPES',
  INVALID_OR_EMPTY_ARRAY: 'INVALID_OR_EMPTY_ARRAY',
  INVALID_OR_EMPTY_OBJECT: 'INVALID_OR_EMPTY_OBJECT',
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ERRORS,
};
