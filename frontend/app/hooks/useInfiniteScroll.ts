"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollProps = {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onReachEnd: () => void;
};

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  onReachEnd,
}: UseInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          onReachEnd();
        }
      },
      {
        root: null,
        threshold: 1.0,
        rootMargin: "100px",
      }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, onReachEnd]);

  return sentinelRef;
}
