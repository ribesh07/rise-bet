'use client';

import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string | number;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  headerRight?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  selectable = false,
  emptyMessage = 'No data',
  onRowClick,
  rowKey,
  page = 1,
  pageSize,
  totalItems,
  onPageChange,
  title,
  headerRight,
  className,
}: DataTableProps<T>) {
  const pageItems = useMemo(() => {
    if (pageSize === undefined) return data;
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const displayTotal = totalItems ?? data.length;
  const totalPages = pageSize ? Math.ceil(displayTotal / pageSize) : 1;
  const startIdx = displayTotal > 0 ? (page - 1) * (pageSize ?? displayTotal) + 1 : 0;
  const endIdx = Math.min(page * (pageSize ?? displayTotal), displayTotal);

  return (
    <div className={clsx('glass-card overflow-hidden', className)}>
      {(title || headerRight) && (
        <div className="flex items-start justify-between p-5 border-b border-border gap-4 flex-wrap">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded border-border bg-background" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={col.className}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {selectable && (
                      <td className="px-4 py-3">
                        <Skeleton className="w-4 h-4 rounded" />
                      </td>
                    )}
                    {columns.map((col, j) => (
                      <td key={String(col.key) + j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : pageItems.length === 0
              ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="text-center py-16 text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )
              : pageItems.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={clsx(onRowClick && 'cursor-pointer')}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-border bg-background"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={String(col.key)} className={col.className}>
                        <div className="cell-truncate">
                          {col.cell
                            ? col.cell(row)
                            : String((row as any)[col.key] ?? '')}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {pageSize !== undefined && (
        <div className="flex items-center justify-between p-4 border-t border-border flex-wrap gap-3">
          <p className="text-sm text-muted">
            Showing <span className="text-gray-200">{startIdx}</span>
            {' - '}
            <span className="text-gray-200">{endIdx}</span>
            {' of '}
            <span className="text-gray-200">{displayTotal}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
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
              onClick={() => onPageChange?.(page + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
