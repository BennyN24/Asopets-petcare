import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  isEnabled?: boolean;
  className?: string;
}

export default function PullToRefresh({
  children,
  onRefresh,
  isEnabled = true,
  className,
}: PullToRefreshProps) {
  const {
    containerRef,
    isRefreshing,
    pullDistance,
    isPulling,
    refreshThreshold,
  } = usePullToRefresh({
    onRefresh,
    isEnabled,
  });

  const pullProgress = Math.min(pullDistance / refreshThreshold, 1);
  const shouldTriggerRefresh = pullDistance >= refreshThreshold;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{
        transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0px)',
        transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
      }}
    >
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-white/95 backdrop-blur-sm border-b"
          style={{
            height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
            transform: `translateY(-${isPulling ? pullDistance : (isRefreshing ? 0 : 60)}px)`,
            transition: isPulling ? 'none' : 'all 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <div
              className={cn(
                "transition-all duration-300",
                isRefreshing && "animate-spin"
              )}
              style={{
                transform: `rotate(${isPulling ? pullProgress * 180 : 0}deg)`,
                opacity: Math.max(pullProgress, isRefreshing ? 1 : 0),
              }}
            >
              <RefreshCw 
                className={cn(
                  "w-6 h-6",
                  shouldTriggerRefresh ? "text-primary" : "text-gray-400"
                )} 
              />
            </div>
            <p
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                shouldTriggerRefresh ? "text-primary" : "text-gray-500"
              )}
              style={{ opacity: Math.max(pullProgress * 0.8, 0) }}
            >
              {isRefreshing
                ? "Refreshing..."
                : shouldTriggerRefresh
                ? "Release to refresh"
                : "Pull to refresh"}
            </p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
}