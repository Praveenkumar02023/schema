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
    <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-400 rounded-lg text-xs font-mono">
      Error: Table data missing
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col min-w-[280px] rounded-xl overflow-hidden backdrop-blur-md will-change-transform backface-hidden transition-all duration-300",
        // Base Style
        "bg-zinc-900/90 border-zinc-800",
        // Selection State
        selected
          ? "border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/20 transform scale-[1.01]"
          : "border hover:border-zinc-700 hover:shadow-xl shadow-black/20"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b transition-colors bg-gradient-to-r",
        selected
          ? "from-blue-500/10 to-transparent border-blue-500/20"
          : "from-white/[0.03] to-transparent border-white/[0.05]"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg shadow-inner border transition-colors",
            selected
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : "bg-zinc-800 text-zinc-500 border-white/5"
          )}>
            <Database size={14} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className={cn(
              "font-bold text-sm leading-none tracking-tight",
              selected ? "text-white" : "text-zinc-200"
            )}>
              {table.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {table.columns.length} columns
            </span>
          </div>
        </div>
      </div>

      {/* Columns List */}
      <div className="flex flex-col bg-transparent">
        {table.columns.map((col, index) => (
          <div
            key={col.id}
            className={cn(
              "group/row relative flex items-center justify-between px-4 py-2 border-b last:border-0 border-white/[0.02] transition-colors",
              "hover:bg-white/[0.04]"
            )}
          >
            {/* Left Handle - Invisible hit area, visible dot */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20">
              <Handle
                type="target"
                position={Position.Left}
                id={`${col.id}-target`}
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  border: '2px solid #18181b', // Matches dark bg
                  borderRadius: '50%',
                  opacity: selected ? 1 : 0, // Show on selection or hover
                  transition: 'opacity 0.2s',
                }}
                className="!relative !left-0 !top-0 !transform-none group-hover/row:!opacity-100"
              />
            </div>

            {/* Column Content */}
            <div className="flex items-center gap-2.5 overflow-hidden flex-1 pl-1">
              <div className="w-4 flex justify-center shrink-0">
                {col.isPrimaryKey ? (
                  <Key size={10} className="text-amber-400" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover/row:bg-zinc-500 transition-colors" />
                )}
              </div>

              <span className={cn(
                "text-[13px] truncate font-medium transition-colors",
                col.isPrimaryKey ? "text-amber-100" : "text-zinc-400 group-hover/row:text-zinc-200"
              )}>
                {col.name}
              </span>
            </div>

            {/* Type Badge */}
            <div className="flex items-center gap-2 pl-4">
              <span className="text-[9px] font-mono uppercase text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5">
                {col.type}
              </span>

              {!col.isNullable && (
                <span className="text-[8px] font-bold text-red-400/80 tracking-wider" title="Required">
                  *
                </span>
              )}
            </div>

            {/* Right Handle */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center z-20">
              <Handle
                type="source"
                position={Position.Right}
                id={`${col.id}-source`}
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  border: '2px solid #18181b',
                  borderRadius: '50%',
                  opacity: selected ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
                className="!relative !left-0 !top-0 !transform-none group-hover/row:!opacity-100"
              />
            </div>
          </div>
        ))}

        {table.columns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-600">
            <Columns size={24} className="mb-2 opacity-20" />
            <p className="text-[10px] italic">No columns</p>
          </div>
        )}
      </div>
    </div>
  );
});