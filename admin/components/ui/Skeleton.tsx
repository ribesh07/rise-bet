'use client';

import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  rounded?: string;
}

export function Skeleton({
  className,
  count = 1,
  height = 'h-4',
  rounded = 'rounded-md',
}: SkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={clsx('skeleton', height, rounded, className)}
        />
      ))}
    </>
  );
}

interface SkeletonStatCardsProps {
  count?: number;
}

export function SkeletonStatCards({ count = 7 }: SkeletonStatCardsProps) {
  const items = Array.from({ length: count });
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
      {items.map((_, i) => (
        <div key={i} className="glass-card p-5 md:p-6">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-full max-w-[100px]" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonRowsProps {
  count?: number;
  columns?: number;
}

export function SkeletonRows({ count = 6, columns = 6 }: SkeletonRowsProps) {
  const rows = Array.from({ length: count });
  const cols = Array.from({ length: columns });
  return (
    <div className="py-2">
      {rows.map((_, ri) => (
        <div
          key={ri}
          className="grid gap-4 px-5 py-3.5 border-b border-border/40"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {cols.map((__, ci) => (
            <Skeleton key={ci} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
