import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  refreshThreshold?: number;
  maxPullDistance?: number;
  isEnabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  refreshThreshold = 80,
  maxPullDistance = 120,
  isEnabled = true,
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isEnabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Only start pull-to-refresh if we're at the top of the scrollable area
    if (container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [isEnabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isEnabled || isRefreshing || !isPulling) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      // Prevent default scroll behavior when pulling down
      e.preventDefault();
      
      // Apply resistance to the pull distance
      const resistance = 0.6;
      const distance = Math.min(deltaY * resistance, maxPullDistance);
      setPullDistance(distance);
    } else {
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [isEnabled, isRefreshing, isPulling, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isEnabled || isRefreshing || !isPulling) return;

    if (pullDistance >= refreshThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
  }, [isEnabled, isRefreshing, isPulling, pullDistance, refreshThreshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    isPulling,
    refreshThreshold,
  };
}