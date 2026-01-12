export interface ResponseSpringslice<T> {
  content: Array<T>;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    }
    offset: number;
    paged: boolean;
    unpaged: boolean;
  }
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  }
  first: boolean;
  last: boolean;
  numberOfElements: number
  empty: boolean;
}
