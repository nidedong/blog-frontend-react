import { useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  loading: boolean; // 是否正在加载
  hasMore?: boolean; // 是否还有更多
  onLoadMore: () => void; // 触发加载下一页
  scrollContainer?: HTMLElement | null; // 默认 window
  threshold?: number; // 提前触发距离 px
}

function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  scrollContainer = null,
  threshold = 300,
}: InfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const options = {
      root: scrollContainer,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, options);

    const el = sentinelRef.current;
    if (el) observerRef.current.observe(el);

    return () => {
      if (el && observerRef.current) observerRef.current.unobserve(el);
    };
  }, [loading, hasMore, onLoadMore, scrollContainer, threshold]);

  return sentinelRef;
}

export default useInfiniteScroll;
