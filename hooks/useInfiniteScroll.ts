'use client'

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";

interface UseInfiniteScroll<T> {
  queryKey: string[];
  getItems: ({ page }: { page: number }) => Promise<T[]>;
}

interface UseInfiniteScrollReturn<T> {
  infiniteScrollRef: (node: HTMLDivElement) => void;
  items: T[];
  isFetching: boolean;
  error: Error | null;
}

export default function useInfiniteScroll<T>(
  { queryKey, getItems }: UseInfiniteScroll<T>
  ): UseInfiniteScrollReturn<T> {
  const observer = useRef<IntersectionObserver>();

  const {
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    data,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getItems({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined
    },
    getPreviousPageParam: () => undefined
  })

  const infiniteScrollRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  const items = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [data]); 

  return {
    infiniteScrollRef,
    items: items || [],
    isFetching,
    error
  }
}
