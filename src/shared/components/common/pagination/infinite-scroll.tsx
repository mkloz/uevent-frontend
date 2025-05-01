import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { type ComponentProps, Fragment, type JSX, useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import type { Paginated } from '../../../types/pagination';
import { Loading } from '../../ui/loading';

interface InfiniteScrollProps<TItem extends { id: number }> extends ComponentProps<'ul'> {
  query: UseInfiniteQueryResult<InfiniteData<Paginated<TItem>, number>>;
  exclude?: { id: number }[];
  render: (item: TItem) => JSX.Element;
}
export default function InfiniteScroll<TItem extends { id: number }>({
  query,
  render,
  exclude,
  ...props
}: InfiniteScrollProps<TItem>) {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoading
  } = query;

  const { isIntersecting: isTopIntersecting, ref: topRef } = useIntersectionObserver();
  const { isIntersecting: isBottomIntersecting, ref: bottomRef } = useIntersectionObserver();

  useEffect(() => {
    if (isTopIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isTopIntersecting]);

  useEffect(() => {
    if (isBottomIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <div ref={topRef} className="flex justify-center items-center">
        {isFetchingPreviousPage && <Loading />}
      </div>
      <ul {...props}>
        {data?.pages.map((page) => (
          <Fragment key={page.meta.currentPage}>
            {page.items
              .filter((item) => !exclude?.some((e) => e.id === item.id))
              .map((item) => (
                <li key={item.id}>{render(item)}</li>
              ))}
          </Fragment>
        ))}
      </ul>
      <div ref={bottomRef} className="flex justify-center items-center">
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
}
