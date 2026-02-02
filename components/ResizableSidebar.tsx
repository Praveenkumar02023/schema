'use client';

import { useState, useRef, useEffect } from 'react';
import { useSchemaStore } from '../store/useSchemaStore';
import {
  Plus,
  Table as TableIcon,
  Search,
  GripVertical,
  MoreVertical,
  Layers
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MIN_WIDTH = 240;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 280;

export default function ResizableSidebar() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);

  const tables = useSchemaStore((state) => state.tables);
  const addTable = useSchemaStore((state) => state.addTable);
  const setSelectedTableId = useSchemaStore((state) => state.setSelectedTableId);
  const selectedTableId = useSchemaStore((state) => state.selectedTableId);

  // --- Resizing Logic ---
  const startResizing = () => setIsResizing(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
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

  // --- Handlers ---
  const handleAddTable = () => {
    const id = crypto.randomUUID();
    addTable({
      id,
      name: `new_table_${tables.length + 1}`,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      columns: [
        { id: crypto.randomUUID(), name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false }
      ],
    });
    setSelectedTableId(id);
  };

  const filteredTables = tables.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside
      ref={sidebarRef}
      className="relative h-full flex flex-col bg-[#09090b] border-r border-zinc-800 text-zinc-400 z-10 group/sidebar"
      style={{ width: `${width}px` }}
    >

      {/* --- Search & Header --- */}
      <div className="p-4 space-y-4 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs uppercase tracking-wider">
            <Layers size={14} className="text-zinc-500" />
            Explorer
          </div>
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
            {tables.length}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg py-2 pl-8 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* --- Scrollable List --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-2">
        <ul className="space-y-0.5">
          {filteredTables.map(table => {
            const isSelected = selectedTableId === table.id;
            return (
              <li key={table.id}>
                <div
                  onClick={() => setSelectedTableId(isSelected ? null : table.id)}
                  className={cn(
                    "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer select-none",
                    isSelected
                      ? "bg-blue-500/10 text-blue-400"
                      : "hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <TableIcon size={14} className={cn(
                    "transition-colors",
                    isSelected ? "text-blue-500" : "text-zinc-600 group-hover:text-zinc-500"
                  )} />

                  <span className="truncate flex-1 font-medium relative top-[0.5px]">
                    {table.name}
                  </span>

                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
              </li>
            );
          })}
        </ul>

        {filteredTables.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[10px] text-zinc-600 italic">No tables found</p>
          </div>
        )}
      </div>

      {/* --- Footer Action --- */}
      <div className="p-4 border-t border-zinc-800/50 bg-[#09090b]">
        <button
          onClick={handleAddTable}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-zinc-950/20 active:translate-y-0"
        >
          <Plus size={14} strokeWidth={3} />
          New Table
        </button>
      </div>

      {/* --- Resize Handle (Invisible but active) --- */}
      <div
        onMouseDown={startResizing}
        className={cn(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:w-1.5 transition-all duration-200 z-50",
          isResizing ? "bg-blue-500" : "bg-transparent hover:bg-blue-500/30"
        )}
      />
    </aside>
  );
}