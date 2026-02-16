'use client';
import { useSchemaStore } from '@/store/useSchemaStore';
import ShareModal from './ShareModal';
import { exportToJSON, generateSQL, exportToPNG } from '@/lib/exporter';
import { useSession, signOut } from 'next-auth/react';
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
    Play,
    Save,
    Loader2,
    CheckCircle2,
    Cloud
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

interface EditorNavbarProps {
    projectId?: string;
}

export default function EditorNavbar({ projectId }: EditorNavbarProps) {
    const { tables, relations, setSchema, currentProjectName, updateProjectName } = useSchemaStore();
    const { data: session } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Share State
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<'OWNER' | 'EDITOR' | 'VIEWER'>('VIEWER');

    useEffect(() => {
        const fetchRole = async () => {
            if (!projectId) return;
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCurrentRole(data.role || 'VIEWER');
                }
            } catch (error) {
                console.error('Failed to fetch project role', error);
            }
        };
        fetchRole();
    }, [projectId]);

    // Project Name Edit State
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Auto-save state
    const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const isFirstRender = useRef(true);

    const handleNameClick = () => {
        setTempName(currentProjectName);
        setIsEditingName(true);
        setTimeout(() => nameInputRef.current?.focus(), 0);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleNameSubmit();
        if (e.key === 'Escape') setIsEditingName(false);
    };

    // --- Save Logic ---
    const saveProject = async (name: string, currentTables: typeof tables, currentRelations: typeof relations) => {
        setSavingStatus('saving');
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    tables: currentTables,
                    relations: currentRelations,
                }),
            });

            if (!response.ok) throw new Error('Failed to save');
            setSavingStatus('saved');
            setLastSaved(new Date());
        } catch (error) {
            console.error('Save error:', error);
            setSavingStatus('error');
        }
    };

    // --- Auto Save Logic ---
    useEffect(() => {
        if (!projectId) return;

        // Skip the very first render to avoid saving immediately on load
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Debounce save (e.g. 10000ms)
        const timeoutId = setTimeout(() => {
            saveProject(currentProjectName, tables, relations);
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [tables, relations, currentProjectName, projectId]);

    const handleNameSubmit = () => {
        const newName = tempName.trim();
        if (newName && newName !== currentProjectName) {
            updateProjectName(newName);
            setIsEditingName(false);
            // Trigger immediate save for name changes
            if (projectId) {
                saveProject(newName, tables, relations);
            }
        } else {
            setIsEditingName(false);
        }
    };

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
        a.download = `${currentProjectName.replace(/\s+/g, '_').toLowerCase()}.json`;
        a.click();
        setIsExportOpen(false);
    };

    const handleExportSQL = () => {
        const sql = generateSQL({ tables, relations });
        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentProjectName.replace(/\s+/g, '_').toLowerCase()}.sql`;
        a.click();
        setIsExportOpen(false);
    };

    return (
        <nav className="h-14 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-4 z-40 shrink-0">

            {/* Left: Brand & File Title */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <span className="font-bold tracking-tight text-3xl" style={{ fontFamily: "'Caveat', cursive" }}>
                        <span className="text-zinc-100">Schema</span><span className="text-blue-500">Studio</span>
                    </span>
                </Link>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-zinc-800" />

                {/* File Info */}
                {/* File Info */}
                <div className="flex items-center gap-2">
                    {isEditingName ? (
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={handleNameKeyDown}
                            disabled={currentRole === 'VIEWER'}
                            className="bg-zinc-900 border border-blue-500/50 text-white text-sm font-medium px-2 py-0.5 rounded outline-none w-[200px]"
                        />
                    ) : (
                        <div
                            onClick={currentRole !== 'VIEWER' ? handleNameClick : undefined}
                            className={`text-sm font-medium text-zinc-300 px-2 py-1 rounded transition-colors border border-transparent select-none ${currentRole !== 'VIEWER' ? 'hover:text-white cursor-pointer hover:bg-zinc-800 hover:border-zinc-700' : 'cursor-default'}`}
                            title={currentRole !== 'VIEWER' ? "Click to rename" : "Read Only"}
                        >
                            {currentProjectName || 'Untitled Project'}
                        </div>
                    )}
                    {currentRole === 'VIEWER' && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">Read Only</span>
                    )}
                </div>
            </div>

            {/* Middle: Quick Actions */}
            <div className="hidden md:flex items-center gap-1">
                {/* Save Button */}
                {/* Auto Save Status */}
                {currentRole !== 'VIEWER' && (
                    <div className="flex items-center justify-end min-w-[100px] px-3">
                        {savingStatus === 'saving' ? (
                            <div className="flex items-center gap-2 text-blue-400 animate-pulse bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                <Cloud size={12} className="animate-bounce" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Saving...</span>
                            </div>
                        ) : savingStatus === 'error' ? (
                            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Error</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors cursor-help px-2 py-1"
                                title={`Last saved: ${lastSaved?.toLocaleTimeString()}`}>
                                <CheckCircle2 size={13} />
                                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Saved</span>
                            </div>
                        )}
                    </div>
                )}



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
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsShareOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full transition-all shadow-lg shadow-blue-500/20 border border-blue-400/20 hover:scale-105 active:scale-95"
                >
                    <Share2 size={14} />
                    Share
                </button>

                {/* Vertical Separator */}
                <div className="h-6 w-px bg-zinc-800" />

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-zinc-800 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-zinc-700 transition-all"
                    >
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full border border-zinc-700 object-cover" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                                {session?.user?.name?.[0] || 'U'}
                            </div>
                        )}
                        <ChevronDown size={12} className="text-zinc-500" />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-zinc-800">
                                    <p className="text-sm font-bold text-white">{session?.user?.name || 'Guest User'}</p>
                                    <p className="text-xs text-zinc-500 truncate">{session?.user?.email || 'not signed in'}</p>
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
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <LogOut size={14} /> Sign out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Modals */}
            {projectId && (
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    projectId={projectId}
                    currentUserRole={currentRole}
                />
            )}
        </nav>
    );
}
