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
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const COLUMN_TYPES: ColumnType[] = ['INT', 'VARCHAR', 'BOOLEAN', 'DATE', 'JSON', 'TEXT'];

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

  return (
    // Fixed container: Hardcoded dark colors (zinc-950), sharp borders, reduced radius
    <aside className="absolute right-4 top-4 bottom-4 w-[400px] flex flex-col bg-[#09090b] border border-zinc-800 rounded-md shadow-2xl overflow-hidden z-50 text-zinc-100 font-sans">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-zinc-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Table Properties
          </span>
        </div>
        <button 
          onClick={() => setSelectedTableId(null)}
          className="text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* --- Content --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0c0c0e]">
        <div className="p-4 space-y-6">
          
          {/* Table Name Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Table Name</label>
            <input
              type="text"
              value={selectedTable.name}
              onChange={(e) => updateTableName(selectedTable.id, e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-md focus:outline-none focus:border-zinc-600 focus:bg-black transition-all font-medium"
              placeholder="Enter table name..."
            />
          </div>

          {/* Columns Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
               <span className="text-[10px] font-bold text-zinc-500 uppercase">
                 Columns ({selectedTable.columns.length})
               </span>
            </div>

            {/* Column List */}
            <div className="flex flex-col gap-px bg-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
              {selectedTable.columns.map((col) => (
                <div 
                  key={col.id} 
                  className="group grid grid-cols-[1fr,auto] items-center gap-3 p-2 bg-zinc-950 hover:bg-zinc-900 transition-colors"
                >
                  
                  {/* Left Side: Name & Type */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-zinc-600">
                        <Type size={12} />
                      </div>
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => updateColumn(selectedTable.id, col.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-medium text-zinc-200 placeholder-zinc-600 focus:outline-none focus:text-white w-full"
                        placeholder="column_name"
                      />
                    </div>
                    
                    {/* Type Selector (Monospace for tech feel) */}
                    <div className="relative flex items-center w-full">
                       <select
                        value={col.type}
                        onChange={(e) => updateColumn(selectedTable.id, col.id, { type: e.target.value as ColumnType })}
                        className="appearance-none bg-transparent text-[10px] font-mono text-zinc-500 hover:text-zinc-300 focus:outline-none focus:text-zinc-100 cursor-pointer w-full uppercase tracking-tight py-0.5"
                      >
                        {COLUMN_TYPES.map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-200">{t}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-0 text-zinc-600 pointer-events-none" />
                    </div>
                  </div>

                  {/* Right Side: Toggles & Actions */}
                  <div className="flex items-center gap-1">
                    
                    {/* PK Toggle - Monochrome Invert on Active */}
                    <button
                      onClick={() => updateColumn(selectedTable.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                      className={cn(
                        "h-6 px-1.5 rounded-sm text-[9px] font-bold border transition-all flex items-center justify-center gap-1",
                        col.isPrimaryKey 
                          ? "bg-zinc-100 border-zinc-100 text-black" // Active: White bg, Black text
                          : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                      )}
                      title="Primary Key"
                    >
                      <Key size={8} className={cn(col.isPrimaryKey ? "fill-black" : "fill-transparent")} />
                      PK
                    </button>

                    {/* Nullable Toggle */}
                    <button
                      onClick={() => updateColumn(selectedTable.id, col.id, { isNullable: !col.isNullable })}
                      className={cn(
                        "h-6 px-1.5 rounded-sm text-[9px] font-bold border transition-all flex items-center justify-center",
                        !col.isNullable 
                          ? "bg-zinc-800 border-zinc-700 text-zinc-300" // Required (Active state visually)
                          : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                      )}
                      title="Toggle Nullable"
                    >
                      {!col.isNullable ? "REQ" : "NULL"}
                    </button>

                    <div className="w-px h-4 bg-zinc-800 mx-1" />

                    <button 
                      onClick={() => deleteColumn(selectedTable.id, col.id)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-100 hover:bg-zinc-800 rounded-sm transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddColumn}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={12} /> Add Column
            </button>
          </div>
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={() => deleteTable(selectedTable.id)}
          className="w-full flex items-center justify-center gap-2 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-900 rounded-md text-xs font-medium transition-all"
        >
          Delete Table
        </button>
      </div>
    </aside>
  );
}