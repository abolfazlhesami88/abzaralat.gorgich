import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  keyField?: keyof T;
}

export function DataTable<T extends { id?: string }>({
  columns, data, isLoading, onRowClick,
  selectedIds, onSelectAll, onSelectRow, keyField = 'id' as keyof T,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="border border-border rounded-card overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b border-border">
            <tr>
              {onSelectAll && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="accent-gold w-4 h-4 cursor-pointer"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={selectedIds?.length === data.length && data.length > 0}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:text-text-primary select-none',
                    col.width,
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectAll ? 1 : 0)} className="text-center py-12 text-text-muted bg-white">
                  داده‌ای یافت نشد
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const rowId = String(row[keyField] ?? i);
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-border last:border-0 transition-colors bg-white',
                      onRowClick && 'cursor-pointer hover:bg-gold-light/20',
                      selectedIds?.includes(rowId) && 'bg-gold-light/30',
                    )}
                  >
                    {onSelectRow && (
                      <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="accent-gold w-4 h-4 cursor-pointer"
                          checked={selectedIds?.includes(rowId) ?? false}
                          onChange={(e) => onSelectRow(rowId, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-text-primary">
                        {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
