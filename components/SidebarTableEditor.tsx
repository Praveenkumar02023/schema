"use client";
import { useSchemaStore } from '@/store/useSchemaStore';
import { Column, ColumnType } from '@/lib/types';
import { Plus, Trash2, Database, Key, Type as TypeIcon, MoreHorizontal, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLUMN_TYPES: ColumnType[] = ['INT', 'VARCHAR', 'BOOLEAN', 'DATE', 'JSON', 'TEXT'];

export default function SidebarTableEditor({ tableId }: { tableId: string }) {
  const tables = useSchemaStore((state) => state.tables);
  const updateTableName = useSchemaStore((state) => state.updateTableName);
  const addColumn = useSchemaStore((state) => state.addColumn);
  const updateColumn = useSchemaStore((state) => state.updateColumn);
  const deleteColumn = useSchemaStore((state) => state.deleteColumn);
  const deleteTable = useSchemaStore((state) => state.deleteTable);

  const selectedTable = tables.find((t) => t.id === tableId);

  if (!selectedTable) return null;

  const handleAddColumn = () => {
    const newCol: Column = {
      id: crypto.randomUUID(),
      name: 'new_column',
      type: 'VARCHAR',
      isPrimaryKey: false,
      isNullable: true,
    };
    addColumn(selectedTable.id, newCol);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 animate-in slide-in-from-right-4 duration-300">
      
      {/* --- Header & Table Identity --- */}
      <div className="p-4 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
            <Database size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">Table Properties</span>
          </div>
          
          <div className="relative group">
            <input
              type="text"
              value={selectedTable.name}
              onChange={(e) => updateTableName(selectedTable.id, e.target.value)}
              className="w-full px-0 py-1 bg-transparent text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none transition-all placeholder:text-zinc-300"
              placeholder="Enter table name..."
            />
          </div>
        </div>
      </div>

      {/* --- Columns Section --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            Columns
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full">
              {selectedTable.columns.length}
            </span>
          </h3>
          <button 
            onClick={handleAddColumn}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Plus size={12} strokeWidth={3} /> Add
          </button>
        </div>

        <div className="space-y-2">
          {selectedTable.columns.map((col) => (
            <div 
              key={col.id} 
              className="group relative flex flex-col gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all"
            >
              {/* Row 1: Name & Actions */}
              <div className="flex items-center gap-2">
                {/* Icon Indicator */}
                <div className={cn(
                  "p-1.5 rounded-md transition-colors",
                  col.isPrimaryKey 
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500" 
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                )}>
                  {col.isPrimaryKey ? <Key size={12} /> : <TypeIcon size={12} />}
                </div>

                {/* Column Name Input */}
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => updateColumn(selectedTable.id, col.id, { name: e.target.value })}
                  className="flex-1 min-w-0 bg-transparent text-sm font-medium text-zinc-700 dark:text-zinc-200 focus:outline-none placeholder:text-zinc-400"
                  placeholder="col_name"
                />

                {/* Delete Button (Visible on Hover) */}
                <button 
                  onClick={() => deleteColumn(selectedTable.id, col.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Row 2: Type & Constraints */}
              <div className="flex items-center justify-between gap-2 pl-9">
                {/* Type Selector */}
                <div className="relative">
                  <select
                    value={col.type}
                    onChange={(e) => updateColumn(selectedTable.id, col.id, { type: e.target.value as ColumnType })}
                    className="appearance-none bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] font-mono rounded px-2 py-1 pr-6 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {COLUMN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <MoreHorizontal size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateColumn(selectedTable.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                    className={cn(
                      "px-2 py-1 rounded text-[9px] font-bold transition-all",
                      col.isPrimaryKey 
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500" 
                        : "bg-transparent text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                  >
                    PK
                  </button>
                  <button
                    onClick={() => updateColumn(selectedTable.id, col.id, { isNullable: !col.isNullable })}
                    className={cn(
                      "px-2 py-1 rounded text-[9px] font-bold transition-all",
                      col.isNullable 
                        ? "bg-transparent text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800" 
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {col.isNullable ? "NULL" : "REQ"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {selectedTable.columns.length === 0 && (
            <div className="text-center py-8 px-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
              <p className="text-xs text-zinc-500 mb-2">No columns defined</p>
              <button onClick={handleAddColumn} className="text-xs text-zinc-600 dark:text-zinc-400 font-medium hover:underline">
                Create first column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer Action --- */}
      <div className="p-4 bg-zinc-50/30 dark:bg-zinc-900/10">
        <button
          onClick={() => deleteTable(selectedTable.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all"
        >
          <AlertCircle size={14} />
          Delete Table
        </button>
      </div>
    </div>
  );
}
