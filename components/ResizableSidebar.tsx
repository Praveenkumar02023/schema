'use client';

import { useState, useRef, useEffect } from 'react';
import { useSchemaStore } from '../store/useSchemaStore';
import {
  Plus,
  Search,
  GripVertical,
  User,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Settings,
  Shield,
  Calendar,
  MapPin,
  Tag,
  Link,
  BarChart3,
  Building2,
  Table as TableIcon,
  LayoutGrid
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
  const [isFocused, setIsFocused] = useState(false);

  const tables = useSchemaStore((state) => state.tables);
  const addTable = useSchemaStore((state) => state.addTable);
  const setSelectedTableId = useSchemaStore((state) => state.setSelectedTableId);
  const selectedTableId = useSchemaStore((state) => state.selectedTableId);
  const currentUserRole = useSchemaStore((state) => state.currentUserRole);

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
      // Prevent iframe pointer events while resizing if any
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

  // Icon Logic
  const getTableIcon = (tableName: string) => {
    const name = tableName.toLowerCase();
    if (name.includes('user') || name.includes('student') || name.includes('person') || name.includes('auth') || name.includes('profile')) return Users;
    if (name.includes('product') || name.includes('item') || name.includes('inventory')) return Package;
    if (name.includes('order') || name.includes('cart') || name.includes('checkout')) return ShoppingCart;
    if (name.includes('payment') || name.includes('transaction') || name.includes('card') || name.includes('finance')) return CreditCard;
    if (name.includes('message') || name.includes('chat') || name.includes('comment')) return MessageSquare;
    if (name.includes('file') || name.includes('doc') || name.includes('post') || name.includes('blog')) return FileText;
    if (name.includes('image') || name.includes('photo') || name.includes('media')) return ImageIcon;
    if (name.includes('setting') || name.includes('config')) return Settings;
    if (name.includes('role') || name.includes('permission') || name.includes('auth')) return Shield;
    if (name.includes('date') || name.includes('event') || name.includes('schedule')) return Calendar;
    if (name.includes('address') || name.includes('location')) return MapPin;
    if (name.includes('tag') || name.includes('category')) return Tag;
    if (name.includes('link') || name.includes('refer')) return Link;
    if (name.includes('stat') || name.includes('analytic')) return BarChart3;
    if (name.includes('org') || name.includes('company')) return Building2;

    return TableIcon; // Default fallback
  };

  return (
    <aside
      ref={sidebarRef}
      className="relative h-full flex flex-col bg-[#09090b] text-zinc-400 z-30 group/sidebar border-r border-[#1e1e22] shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)] transition-all ease-out duration-300"
      style={{ width: `${width}px` }}
    >

      {/* --- Header & Search --- */}
      <div className="flex flex-col gap-4 p-4 pb-2 border-b border-[#27272a]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              Explorer
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-zinc-500 bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded-full">
            {filteredTables.length}
          </span>
        </div>

        {/* Search Bar */}
        <div className={cn(
          "relative group transition-all duration-200",
          isFocused ? "opacity-100" : "opacity-80 hover:opacity-100"
        )}>
          <Search
            size={14}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none",
              isFocused ? "text-blue-500" : "text-zinc-600"
            )}
          />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-[#18181b] border rounded-lg py-2.5 pl-9 pr-3 text-xs text-zinc-300 outline-none transition-all duration-200 placeholder:text-zinc-600",
              isFocused
                ? "border-blue-500/40 bg-[#18181b] shadow-[0_0_0_1px_rgba(59,130,246,0.1)]"
                : "border-[#27272a] hover:border-zinc-700 hover:bg-[#202023]"
            )}
          />
        </div>
      </div>

      {/* --- Scrollable List --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-3">
        <div className="flex flex-col space-y-1">
          {/* Label if list is not empty */}
          {filteredTables.length > 0 ? (
            <div className="px-2 pb-2 pt-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
              <span>Tables</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
          ) : null}

          {filteredTables.map(table => {
            const isSelected = selectedTableId === table.id;
            const Icon = getTableIcon(table.name);

            return (
              <div
                key={table.id}
                onClick={() => setSelectedTableId(isSelected ? null : table.id)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs cursor-pointer select-none transition-all duration-200 border border-transparent",
                  isSelected
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-100 shadow-sm"
                    : "hover:bg-[#18181b] hover:border-[#27272a] text-zinc-500"
                )}
              >
                {/* Active Indicator Line */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-0.5 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}

                <Icon
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "transition-colors duration-200 shrink-0",
                    isSelected ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400"
                  )}
                />

                <span className={cn(
                  "truncate flex-1 font-medium relative top-[0.5px] tracking-tight",
                  isSelected ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
                )}>
                  {table.name}
                </span>

                {/* Hover Action or Status */}
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)] animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {filteredTables.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-12 mt-10 text-center opacity-60">
            <div className="w-12 h-12 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-3 shadow-inner">
              <Search size={18} className="text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 font-medium">No results found</p>
            <p className="text-[10px] text-zinc-700 mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* --- Footer Action --- */}
      {currentUserRole !== 'VIEWER' && (
        <div className="p-4 border-t border-[#27272a]/50 bg-[#09090b] relative z-20">
          <button
            onClick={handleAddTable}
            className="group relative flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-lg transition-all duration-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_24px_-4px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <Plus size={16} strokeWidth={3} className="relative z-20 transition-transform group-hover:rotate-90 duration-300" />
            <span className="relative z-20">New Table</span>
          </button>
        </div>
      )}

      {/* --- Resize Handle --- */}
      <div
        onMouseDown={startResizing}
        className={cn(
          "absolute top-0 right-0 w-[1px] h-full cursor-col-resize hover:w-1.5 transition-all duration-200 z-50 group/resizer touch-none",
          isResizing ? "bg-blue-500 w-1" : "bg-transparent hover:bg-blue-500/20"
        )}
      >
      </div>
    </aside>
  );
}