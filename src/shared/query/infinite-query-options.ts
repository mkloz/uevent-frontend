import {
  type InfiniteData,
  infiniteQueryOptions as options,
  type QueryKey,
  type UnusedSkipTokenInfiniteOptions
} from '@tanstack/react-query';

import type { Optional } from '../types/interfaces';
import type { Paginated } from '../types/pagination';

type InfiniteQueryOptionsParams<T extends object> = Optional<
  UnusedSkipTokenInfiniteOptions<Paginated<T>, Error, InfiniteData<Paginated<T>, number>, QueryKey, number>,
  'getNextPageParam' | 'initialPageParam' | 'maxPages' | 'getPreviousPageParam'
>;

export function infiniteQueryOptions<T extends object>(params: InfiniteQueryOptionsParams<T>) {
  return options({
    getNextPageParam: (lastLoaded) =>
      lastLoaded.meta.currentPage >= lastLoaded.meta.totalPages ? undefined : lastLoaded.meta.currentPage + 1,
    initialPageParam: 1,
    maxPages: 10,
    getPreviousPageParam: (firstLoaded) =>
      firstLoaded.meta.currentPage <= 1 ? undefined : firstLoaded.meta.currentPage - 1,
    ...params
  });
}
