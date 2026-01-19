'use client';

import { useState, useRef, useEffect } from 'react';
import { useSchemaStore } from '../store/useSchemaStore';
import { 
  Plus, 
  Table as TableIcon, 
  FileCode, 
  FileJson, 
  Upload, 
  Database, 
  ChevronRight,
  Settings2,
  GripVertical
} from 'lucide-react';
import { exportToJSON, generateSQL } from '@/lib/exporter';
import SidebarTableEditor from './SidebarTableEditor';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MIN_WIDTH = 260;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 300;

export default function ResizableSidebar() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tables = useSchemaStore((state) => state.tables);
  const relations = useSchemaStore((state) => state.relations);
  const addTable = useSchemaStore((state) => state.addTable);
  const setSelectedTableId = useSchemaStore((state) => state.setSelectedTableId);
  const selectedTableId = useSchemaStore((state) => state.selectedTableId);
  const setSchema = useSchemaStore((state) => state.setSchema);

  // ... (Keep existing resizing logic and handlers here) ...
  const startResizing = () => setIsResizing(true);
  
  // (Paste your existing useEffect logic for resizing here)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
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

  const handleAddTable = () => {
    const id = crypto.randomUUID();
    addTable({ id, name: `new_table_${tables.length + 1}`, position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }, columns: [{ id: crypto.randomUUID(), name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false }] });
    setSelectedTableId(id);
  };
  // ... (Paste other handlers: handleExportJSON, handleExportSQL, handleImportClick, handleFileChange) ...
  const handleExportJSON = () => { /* ... */ };
  const handleExportSQL = () => { /* ... */ };
  const handleImportClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: any) => { /* ... */ };

  return (
    <aside 
      ref={sidebarRef}
      className="relative h-full flex flex-col bg-[#09090b] border-r border-zinc-800 text-zinc-400 z-20 shadow-2xl group/sidebar"
      style={{ width: `${width}px` }}
    >
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800 bg-[#09090b] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-zinc-100 rounded-md text-zinc-950 shadow-inner">
            <Database size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight leading-none">SchemaViz</h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">v1.0.0-beta</p>
          </div>
        </div>
        <button className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors text-zinc-500 hover:text-zinc-300">
          <Settings2 size={16} />
        </button>
      </div>
      
      {/* --- Scrollable Content (NO SCROLLBAR) --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-[#09090b]/95 backdrop-blur-sm z-10 border-b border-zinc-800/50">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Explorer
          </h2>
          <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-sm font-mono border border-zinc-700/50">
            {tables.length}
          </span>
        </div>
        
        <ul className="p-2 space-y-1">
          {tables.map(table => {
            const isSelected = selectedTableId === table.id;
            return (
              <li key={table.id} className="flex flex-col">
                <div 
                  onClick={() => setSelectedTableId(isSelected ? null : table.id)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-all duration-200 cursor-pointer border select-none",
                    isSelected 
                      ? "bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-zinc-900/50 hover:text-zinc-200 text-zinc-500"
                  )}
                >
                   <span className={cn(
                     "transition-transform duration-200",
                     isSelected ? "rotate-90 text-zinc-100" : "text-zinc-600 group-hover:text-zinc-500"
                   )}>
                     <ChevronRight size={12} strokeWidth={3} />
                   </span>
                  
                  <TableIcon size={14} className={cn(
                    isSelected ? "text-zinc-100" : "text-zinc-600 group-hover:text-zinc-400"
                  )} />
                  
                  <span className="truncate flex-1 font-mono font-medium tracking-tight">
                    {table.name}
                  </span>
                </div>
                
                {isSelected && (
                  <div className="relative pl-3 pr-1 py-1 animate-in slide-in-from-left-2 duration-200">
                     <div className="absolute left-[18px] top-0 bottom-0 w-px bg-zinc-800" />
                     <div className="pl-4">
                        <SidebarTableEditor tableId={table.id} />
                     </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {tables.length === 0 && (
          <div className="px-4 py-12 text-center opacity-50">
             <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 mb-3">
               <TableIcon size={20} strokeWidth={1.5} />
             </div>
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest">No tables found</p>
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <div className="p-4 border-t border-zinc-800 bg-[#09090b] space-y-3 shrink-0">
        <button 
          onClick={handleAddTable}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-md transition-all hover:translate-y-[-1px] active:translate-y-[0px] shadow-lg shadow-zinc-950/50"
        >
          <Plus size={14} strokeWidth={3} />
          NEW TABLE
        </button>

        {/* ... Secondary buttons ... */}
        <div className="grid grid-cols-2 gap-2">
           {/* Paste your existing buttons here (Export JSON/SQL) */}
           <button onClick={handleExportJSON} className="flex items-center justify-center gap-2 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold uppercase rounded-md transition-colors"><FileJson size={14} /> JSON</button>
           <button onClick={handleExportSQL} className="flex items-center justify-center gap-2 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold uppercase rounded-md transition-colors"><FileCode size={14} /> SQL</button>
        </div>
        
        {/* Import */}
        <button onClick={handleImportClick} className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30 rounded-md text-[10px] font-bold uppercase text-zinc-600 hover:text-zinc-300 transition-all"><Upload size={12} /> Import Schema</button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
      </div>

      {/* --- Resize Handle --- */}
      <div
        onMouseDown={startResizing}
        className={cn(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:w-1.5 transition-all duration-200 z-50",
          isResizing ? "bg-blue-600" : "bg-transparent hover:bg-blue-600/50"
        )}
      >
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-1.5 w-4 h-8 flex items-center justify-center rounded-sm transition-opacity duration-200 pointer-events-none",
          "bg-zinc-800 border border-zinc-700 text-zinc-400 shadow-md",
          isResizing || "group-hover/sidebar:opacity-100 opacity-0"
        )}>
          <GripVertical size={10} />
        </div>
      </div>
    </aside>
  );
}