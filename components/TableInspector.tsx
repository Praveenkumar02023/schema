"use client";
import { useSchemaStore } from '@/store/useSchemaStore';
import { Column, ColumnType } from '@/lib/types';
import {
  X,
  Plus,
  Trash2,
  Key,
  Database,
  Type,
  ChevronDown,
  Settings,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const COLUMN_TYPES: ColumnType[] = ['INT', 'VARCHAR', 'BOOLEAN', 'DATE', 'JSON', 'TEXT', 'UUID', 'TIMESTAMP'];

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

  const [activeTab, setActiveTab] = useState<'columns' | 'settings'>('columns');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTable = tables.find((t) => t.id === selectedTableId);

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

  const filteredColumns = selectedTable.columns.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="absolute right-6 top-6 bottom-6 w-[420px] flex flex-col bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-20 animate-in slide-in-from-right-8 duration-500">

      {/* --- Header --- */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-white/5 bg-white/5 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="p-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
              <Database size={14} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Table Inspector
            </span>
          </div>
          <button
            onClick={() => setSelectedTableId(null)}
            className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        {/* Title Input */}
        <div className="relative z-10 group">
          <input
            type="text"
            value={selectedTable.name}
            onChange={(e) => updateTableName(selectedTable.id, e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-white placeholder-zinc-600 focus:outline-none focus:ring-0 border-b border-transparent group-hover:border-white/10 focus:border-blue-500 transition-all pb-1 placeholder:opacity-50"
            placeholder="Table Name"
          />
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
        <button
          onClick={() => setActiveTab('columns')}
          className={cn(
            "px-4 py-3 text-xs font-medium border-b-2 transition-all",
            activeTab === 'columns'
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Columns <span className="ml-1 opacity-50 text-[10px]">{selectedTable.columns.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "px-4 py-3 text-xs font-medium border-b-2 transition-all",
            activeTab === 'settings'
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Settings
        </button>
      </div>

      {/* --- Content Area --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">

        {activeTab === 'columns' && (
          <div className="p-4 space-y-4">

            {/* Search */}
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Find column..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredColumns.map((col) => (
                <div
                  key={col.id}
                  className="group relative flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200"
                >

                  {/* Left Icon (PK or Type) */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors",
                    col.isPrimaryKey
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-zinc-800/50 border-white/5 text-zinc-500"
                  )}>
                    {col.isPrimaryKey ? <Key size={14} /> : <Type size={14} />}
                  </div>

                  {/* Inputs */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(selectedTable.id, col.id, { name: e.target.value })}
                      className="bg-transparent text-sm font-medium text-zinc-200 placeholder-zinc-600 focus:outline-none w-full"
                      placeholder="column_name"
                    />

                    {/* Small Type Selector Row */}
                    <div className="flex items-center gap-2">
                      <div className="relative text-[10px] uppercase font-mono tracking-tight text-blue-400 max-w-[80px]">
                        <select
                          value={col.type}
                          onChange={(e) => updateColumn(selectedTable.id, col.id, { type: e.target.value as ColumnType })}
                          className="w-full appearance-none bg-transparent hover:text-blue-300 focus:outline-none cursor-pointer py-0.5 truncate"
                        >
                          {COLUMN_TYPES.map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-300">{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateColumn(selectedTable.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        col.isPrimaryKey
                          ? "text-amber-500 bg-amber-500/10"
                          : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                      )}
                      title="Toggle Primary Key"
                    >
                      <Key size={14} />
                    </button>
                    <button
                      onClick={() => updateColumn(selectedTable.id, col.id, { isNullable: !col.isNullable })}
                      className={cn(
                        "px-1.5 py-1 rounded-md text-[9px] font-bold border transition-all w-10 text-center",
                        !col.isNullable // Required
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-transparent border-zinc-700 text-zinc-600 hover:text-zinc-400"
                      )}
                      title="Toggle Nullable"
                    >
                      {!col.isNullable ? "REQ" : "NULL"}
                    </button>

                    <button
                      onClick={() => deleteColumn(selectedTable.id, col.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={handleAddColumn}
              className="w-full py-3 border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-all flex items-center justify-center gap-2 group"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={12} />
              </div>
              Add New Column
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Trash2 size={16} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-100">Delete Table</h4>
                  <p className="text-xs text-red-400/60 mt-1 leading-relaxed">
                    This action cannot be undone. All data and relationships associated with this table will be removed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteTable(selectedTable.id)}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Delete Table
              </button>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}