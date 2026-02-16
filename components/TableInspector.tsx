"use client";
import { useSchemaStore } from '@/store/useSchemaStore';
import { Column, ColumnType } from '@/lib/types';
import {
  X,
  Plus,
  Trash2,
  Key,
  Check,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const COLUMN_TYPES: ColumnType[] = [
  'INT', 'VARCHAR', 'TEXT', 'BOOLEAN',
  'DATE', 'TIMESTAMP', 'UUID', 'JSON',
  'FLOAT', 'DECIMAL', 'BIGINT'
];

// Custom Dropdown Component
function TypeSelector({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose
}: {
  value: string,
  onChange: (val: string) => void,
  isOpen: boolean,
  onToggle: () => void,
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between bg-zinc-900/50 border rounded px-2 py-1.5 text-[10px] font-mono transition-all outline-none",
          isOpen
            ? "border-blue-500/50 text-blue-400 bg-zinc-900 ring-1 ring-blue-500/20"
            : "border-zinc-800 text-blue-400/80 hover:border-zinc-700 hover:text-blue-400"
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={10} className={cn("ml-1 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-zinc-800 rounded-md shadow-2xl z-[100] max-h-[220px] overflow-y-auto overflow-x-hidden min-w-[120px] divide-y divide-zinc-800/50 animate-in fade-in zoom-in-95 duration-100 no-scrollbar">
          {COLUMN_TYPES.map(t => (
            <div
              key={t}
              onClick={() => {
                onChange(t);
                onClose();
              }}
              className={cn(
                "px-3 py-2 text-[10px] font-mono cursor-pointer transition-colors border-l-2 flex items-center justify-between group/item",
                value === t
                  ? "bg-blue-500/5 text-blue-400 border-blue-500"
                  : "text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              {t}
              {value === t && <Check size={10} className="text-blue-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MIN_WIDTH = 350;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 450;

export default function TableInspector() {
  const {
    selectedTableId,
    tables,
    updateTableName,
    addColumn,
    updateColumn,
    deleteColumn,
    deleteTable,
    setSelectedTableId
  } = useSchemaStore();

  const currentUserRole = useSchemaStore((state) => state.currentUserRole);
  const isReadOnly = currentUserRole === 'VIEWER';

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Track which dropdown is open (by column ID)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus new column input when added
  const [newColId, setNewColId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTableId) {
      setIsClosing(false);
    }
  }, [selectedTableId]);

  // --- Resizing Logic ---
  const startResizing = () => setIsResizing(true);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedTableId(null);
      setIsClosing(false);
    }, 300);
  };

  const handleDeleteTable = () => {
    if (confirm(`Are you sure you want to delete table "${selectedTable?.name}"?`)) {
      if (selectedTable) deleteTable(selectedTable.id);
      setSelectedTableId(null);
    }
  };

  const handleAddColumn = () => {
    if (!selectedTable) return;
    const id = crypto.randomUUID();
    const newCol: Column = {
      id,
      name: `new_column_${selectedTable.columns.length + 1}`,
      type: 'VARCHAR',
      isPrimaryKey: false,
      isNullable: true,
    };
    addColumn(selectedTable.id, newCol);
    setNewColId(id);
    setActiveDropdownId(null); // Close any open dropdowns

    // Auto scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  if (!selectedTable && !isClosing) return null;
  const renderTable = selectedTable || { name: '', columns: [] };
  if (!selectedTable && !isClosing) return null;

  return (
    <aside
      style={{ width: isClosing ? '0px' : `${width}px` }}
      className={cn(
        "fixed right-0 top-14 bottom-0 bg-[#09090b] border-l border-zinc-800 shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.5)] z-40 flex flex-col transition-[width,transform,opacity] duration-300 ease-out",
        isClosing ? "translate-x-10 opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
      )}
    >
      <div
        onMouseDown={startResizing}
        className={cn(
          "absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50",
          isResizing ? "bg-blue-500" : "bg-transparent"
        )}
      />

      {/* --- Header --- */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-800 bg-[#09090b] shrink-0">
        <div className="flex-1 mr-4">
          {isReadOnly ? (
            <div className="text-lg font-bold text-zinc-100 p-0 w-full truncate">{renderTable.name}</div>
          ) : (
            <input
              type="text"
              value={renderTable.name}
              onChange={(e) => selectedTable && updateTableName(selectedTable.id, e.target.value)}
              className="bg-transparent text-lg font-bold text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-0 border-none p-0 w-full truncate"
              placeholder="Table Name"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <>
              <button
                onClick={handleDeleteTable}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Delete Table"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-px h-4 bg-zinc-800 mx-1" />
            </>
          )}
          <button
            onClick={handleClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
            title="Close Inspector"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* --- Column List Header --- */}
      <div className="grid grid-cols-[32px_1fr_100px_60px_32px] gap-2 px-4 py-3 border-b border-zinc-800/50 bg-[#0c0c0e] text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
        <div className="flex justify-center">PK</div>
        <div>Name</div>
        <div>Type</div>
        <div className="text-center">Null</div>
        <div></div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-hidden relative bg-[#09090b]">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden p-2 space-y-0.5 no-scrollbar pb-20">
          {renderTable.columns?.map((col: any) => (
            <div
              key={col.id}
              className={cn(
                "group grid grid-cols-[32px_1fr_100px_60px_32px] gap-2 items-center px-2 py-1.5 rounded-md border border-transparent hover:bg-zinc-900/50 hover:border-zinc-800/50 transition-all duration-200",
                newColId === col.id && "bg-blue-500/5 animate-pulse border-blue-500/20"
              )}
              // Ensure activedropdown is on top
              style={{ zIndex: activeDropdownId === col.id ? 50 : 1, position: 'relative' }}
            >
              {/* PK Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => !isReadOnly && selectedTable && updateColumn(selectedTable.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                  disabled={isReadOnly}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    col.isPrimaryKey
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-zinc-700 opacity-20 group-hover:opacity-100 hover:text-zinc-400 hover:bg-zinc-800",
                    isReadOnly && "cursor-default opacity-50 hover:bg-transparent"
                  )}
                  title="Primary Key"
                >
                  <Key size={13} className={cn(col.isPrimaryKey && "fill-amber-400/20")} strokeWidth={col.isPrimaryKey ? 2.5 : 2} />
                </button>
              </div>

              {/* Name Input */}
              <div className="relative group/input">
                {isReadOnly ? (
                  <div className="w-full px-2 py-1.5 text-xs font-medium text-zinc-300">{col.name}</div>
                ) : (
                  <input
                    autoFocus={newColId === col.id}
                    type="text"
                    value={col.name}
                    onChange={(e) => selectedTable && updateColumn(selectedTable.id, col.id, { name: e.target.value })}
                    onBlur={() => setNewColId(null)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1.5 text-xs font-medium text-zinc-300 focus:text-white focus:bg-zinc-900 focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-zinc-700"
                    placeholder="col_name"
                  />
                )}
              </div>

              {/* Custom Type Selector */}
              <div className="relative w-full">
                {isReadOnly ? (
                  <div className="px-2 py-1.5 text-[10px] font-mono text-blue-400/80">{col.type}</div>
                ) : (
                  <TypeSelector
                    value={col.type}
                    isOpen={activeDropdownId === col.id}
                    onToggle={() => setActiveDropdownId(activeDropdownId === col.id ? null : col.id)}
                    onClose={() => setActiveDropdownId(null)}
                    onChange={(val) => selectedTable && updateColumn(selectedTable.id, col.id, { type: val as ColumnType })}
                  />
                )}
              </div>

              {/* Nullable Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => !isReadOnly && selectedTable && updateColumn(selectedTable.id, col.id, { isNullable: !col.isNullable })}
                  disabled={isReadOnly}
                  className={cn(
                    "w-8 py-0.5 rounded text-[9px] font-bold transition-all border",
                    !col.isNullable
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400",
                    isReadOnly && "cursor-default"
                  )}
                  title="Toggle Required"
                >
                  {!col.isNullable ? "REQ" : "NULL"}
                </button>
              </div>

              {/* Delete Action */}
              <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                  <button
                    onClick={() => selectedTable && deleteColumn(selectedTable.id, col.id)}
                    className="text-zinc-600 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {renderTable.columns?.length === 0 && (
            <div className="p-8 text-center opacity-40">
              <p className="text-xs text-zinc-500">No columns defined</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Add Button */}
      {!isReadOnly && (
        <div className="p-4 border-t border-zinc-800 bg-[#09090b] shrink-0">
          <button
            onClick={handleAddColumn}
            className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 active:translate-y-0.5 shadow-lg shadow-zinc-950/20"
          >
            <Plus size={14} strokeWidth={3} />
            Add Column
          </button>
        </div>
      )}
    </aside>
  );
}