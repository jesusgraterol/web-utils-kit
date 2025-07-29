/* ************************************************************************************************
 *                                       SORTING UTILITIES                                        *
 ************************************************************************************************ */

// the sort direction that can be applied to a list
type ISortDirection = 'asc' | 'desc';

/* ************************************************************************************************
 *                                            FILTERS                                             *
 ************************************************************************************************ */

// the options that can be used to filter items by a query
type IFilterByQueryOptions<T> = {
  queryProp?: keyof T; // the property to filter by, if not provided, the whole item will be used
  limit?: number; // the maximum number of items to return
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // sorting utilities
  ISortDirection,

  // filters
  IFilterByQueryOptions,
};
