'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIdx = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={clsx(
        'flex items-center justify-between flex-wrap gap-3',
        className
      )}
    >
      <p className="text-sm text-muted">
        Showing <span className="text-gray-200">{startIdx}</span>
        {' - '}
        <span className="text-gray-200">{endIdx}</span>
        {' of '}
        <span className="text-gray-200">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={ChevronLeft}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <span className="text-sm text-muted px-2">
          Page <span className="text-gray-200 font-medium">{page}</span>
          {' / '}
          {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          icon={ChevronRight}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}

export default Pagination;
