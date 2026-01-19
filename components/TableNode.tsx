'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Table } from '@/lib/types';
import { Key, MoreVertical, Database, Columns } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default memo(function TableNode({ data, selected }: NodeProps) {
  const table = data.table as Table;

  if (!table) return (
    <div className="p-4 border-2 border-red-500 bg-red-50 text-red-500 rounded-lg">
      Error
    </div>
  );

  return (
    // OPTIMIZATION: 
    // 1. Removed 'transition-all' from the root div (causes drag lag)
    // 2. Added 'will-change-transform' (promotes to GPU layer)
    // 3. Added 'backface-hidden' (prevents flickering)
    <div
      className={cn(
        "flex flex-col min-w-[300px] bg-white dark:bg-zinc-950 rounded-xl overflow-hidden backface-hidden will-change-transform",
        "border",
        selected
          ? "border-zinc-400 dark:border-zinc-600 shadow-xl shadow-zinc-500/10 ring-1 ring-zinc-400 dark:ring-zinc-600"
          : "border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b transition-colors",
        selected
          ? "bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
          : "bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg border",
            selected
              ? "bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
              : "bg-white text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
          )}>
            <Database size={16} strokeWidth={2} />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
              {table.name}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
              {table.columns.length} columns
            </span>
          </div>
        </div>

        <button className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Columns */}
      <div className="flex flex-col bg-white dark:bg-zinc-950">
        {table.columns.map((col) => (
          <div
            key={col.id}
            className="group/row relative flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-b last:border-0 border-zinc-50 dark:border-zinc-900"
          >
            {/* Left Handle - Outside column */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${col.id}-target`}
              style={{
                width: '8px',
                height: '8px',
                background: '#60a5fa',
                border: '2px solid white',
                borderRadius: '50%',
                left: '-8px', // Further outside
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'crosshair',
                zIndex: 100, // Much higher z-index
              }}
            />

            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
              <div className="w-4 flex justify-center shrink-0">
                {col.isPrimaryKey ? (
                  <Key size={12} className="text-amber-500 dark:text-amber-400" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                )}
              </div>
              
              <span className={cn(
                "text-sm truncate font-medium",
                col.isPrimaryKey 
                  ? "text-zinc-900 dark:text-zinc-100" 
                  : "text-zinc-600 dark:text-zinc-400"
              )}>
                {col.name}
              </span>
            </div>

            <div className="flex items-center gap-2 pl-4">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">
                {col.type}
              </span>
              
              {!col.isNullable && (
                <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                  NN
                </span>
              )}
            </div>

            {/* Right Handle - Outside column */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${col.id}-source`}
              style={{
                width: '8px',
                height: '8px',
                background: '#60a5fa',
                border: '2px solid white',
                borderRadius: '50%',
                right: '-8px', // Further outside
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'crosshair',
                zIndex: 100, // Much higher z-index
              }}
            />
          </div>
        ))}

        {table.columns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
            <Columns size={32} className="mb-2 opacity-20" />
            <p className="text-xs italic">No columns defined</p>
          </div>
        )}
      </div>
    </div>
  );
});