'use client';

import { useSchemaStore } from '@/store/useSchemaStore';
import { exportToJSON, generateSQL, exportToPNG } from '@/lib/exporter';
import {
    Download,
    Upload,
    Share2,
    Settings,
    LogOut,
    ChevronDown,
    User,
    FileJson,
    FileCode,
    Image as ImageIcon,
    Play
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function EditorNavbar() {
    const { tables, relations, setSchema } = useSchemaStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target?.result as string);
                if (json.tables && Array.isArray(json.tables)) {
                    setSchema(json);
                } else {
                    alert('Invalid schema file');
                }
            } catch (err) {
                alert('Failed to parse JSON');
            }
        };
        reader.readAsText(file);
    };

    const handleExportJSON = () => {
        const json = exportToJSON({ tables, relations });
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawdb_dump.json';
        a.click();
        setIsExportOpen(false);
    };

    const handleExportSQL = () => {
        const sql = generateSQL({ tables, relations });
        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawdb.sql';
        a.click();
        setIsExportOpen(false);
    };

    return (
        <nav className="h-14 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-4 z-40 shrink-0">

            {/* Left: Brand & File Title */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                    {/* New Logo: Abstract Stacked Layers */}
                    <div className="w-8 h-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-sm group-hover:bg-blue-500/30 transition-colors" />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="z-10 text-blue-500">
                            <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 14L12 19L22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 8V16" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Decorative dots */}
                            <circle cx="12" cy="13" r="1.5" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="font-bold text-zinc-100 tracking-tight text-lg">DrawDB</span>
                </Link>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-zinc-800" />

                {/* File Info */}
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-zinc-300 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-zinc-800 transition-colors">
                        Untitled Project
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">v1.0</span>
                </div>
            </div>

            {/* Middle: Quick Actions */}
            <div className="hidden md:flex items-center gap-1">
                <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <Upload size={14} />
                    Import
                </button>
                <div className="relative">
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                    >
                        <Download size={14} />
                        Export
                        <ChevronDown size={12} className="opacity-50" />
                    </button>

                    {/* Export Dropdown */}
                    {isExportOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
                            <div className="absolute top-full mt-1 left-0 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 duration-200">
                                <button onClick={handleExportSQL} className="flex items-center gap-3 px-3 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                    <FileCode size={14} className="text-blue-500" />
                                    <span>Export SQL</span>
                                </button>
                                <button onClick={handleExportJSON} className="flex items-center gap-3 px-3 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                                    <FileJson size={14} className="text-yellow-500" />
                                    <span>Export JSON</span>
                                </button>
                                <div className="h-px bg-zinc-800 my-1" />
                                <button className="flex items-center gap-3 px-3 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors opacity-50 cursor-not-allowed">
                                    <ImageIcon size={14} className="text-purple-500" />
                                    <span>Export PNG (Soon)</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json"
                />
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3">



                {/* Share */}
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                    <Share2 size={16} />
                </button>

                {/* Vertical Separator */}
                <div className="h-4 w-px bg-zinc-800" />

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-zinc-800 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-zinc-700 transition-all"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                            PK
                        </div>
                        <ChevronDown size={12} className="text-zinc-500" />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-zinc-800">
                                    <p className="text-sm font-bold text-white">Praveen Kumar</p>
                                    <p className="text-xs text-zinc-500 truncate">praveen@example.com</p>
                                </div>

                                {/* Menu */}
                                <div className="p-1">
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                        <User size={14} /> Profile
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                        <Settings size={14} /> Settings
                                    </button>
                                </div>

                                <div className="h-px bg-zinc-800 mx-1" />

                                <div className="p-1">
                                    <Link href="/signin" className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <LogOut size={14} /> Sign out
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}
