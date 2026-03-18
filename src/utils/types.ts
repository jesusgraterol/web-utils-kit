// the sort direction that can be applied to a list
export type ISortDirection = 'asc' | 'desc';

// the options that can be used to filter items by a query
export type IFilterByQueryOptions<T> = {
  // the property to filter by, if not provided, the whole item will be used
  queryProp?: keyof T;

  // the maximum number of items to return
  limit?: number;
};
