'use client';

import Link from 'next/link';
import {
    Database,
    Plus,
    Search,
    MoreVertical,
    Clock,
    ChevronRight,
    Layout,
    Settings,
    LogOut,
    User,
    ChevronDown // Added ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Added next-auth hooks

const DUMMY_PROJECTS = [
    { id: '1', name: 'E-commerce Schema', tables: 12, editedAt: '2 mins ago', color: 'blue' },
    { id: '2', name: 'Blog Database', tables: 5, editedAt: '2 days ago', color: 'emerald' },
    { id: '3', name: 'Analytics Setup', tables: 8, editedAt: '1 week ago', color: 'purple' },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const filteredProjects = DUMMY_PROJECTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 flex flex-col relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

            {/* --- Navbar --- */}
            <nav className="relative z-20 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 relative flex items-center justify-center bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                            <Database size={16} className="text-blue-500" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors">DrawDB</span>
                    </Link>

                    {/* User Profile */}
                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-900 rounded-full transition-colors border border-transparent hover:border-zinc-800"
                        >
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-800 object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-zinc-950">
                                    {session?.user?.name?.[0] || 'U'}
                                </div>
                            )}
                            <div className="hidden md:flex flex-col items-start text-left">
                                <span className="text-sm font-medium text-zinc-300 leading-none">{session?.user?.name || 'User'}</span>
                            </div>
                            <ChevronDown size={14} className="text-zinc-500" />
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
                                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                                        <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors">
                                            <User size={14} /> Profile
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors">
                                            <Settings size={14} /> Settings
                                        </button>
                                    </div>
                                    <div className="h-px bg-zinc-800 mx-1" />
                                    <div className="p-1">
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut size={14} /> Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Main Content --- */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                        <p className="text-zinc-400 text-sm">Manage and organize your database schemas.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 md:w-64 group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        {/* Filter Button (Visual) */}
                        <button className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                            <Layout size={16} />
                        </button>
                    </div>
                </div>

                {/* --- Content Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* New Project Card */}
                    <Link href="/editor" className="group relative flex flex-col items-center justify-center gap-4 aspect-[4/3] bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl hover:bg-zinc-900/40 hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">

                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300 z-10 shadow-xl">
                            <Plus size={32} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-zinc-500 group-hover:text-blue-400 z-10 transition-colors">Create New Project</span>
                    </Link>

                    {/* Project List */}
                    {filteredProjects.map((project) => (
                        <Link key={project.id} href="/editor" className="group relative flex flex-col aspect-[4/3] bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

                            {/* Card Image / Preview (Abstract) */}
                            <div className="flex-1 bg-zinc-950/50 relative overflow-hidden p-6 flex items-center justify-center">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${project.color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />

                                {/* Mock Diagram */}
                                <div className="w-full h-full border border-zinc-800/50 rounded-lg bg-zinc-900/50 relative opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="absolute top-4 left-4 w-12 h-16 border border-zinc-700 bg-zinc-800 rounded-md" />
                                    <div className="absolute bottom-6 right-8 w-16 h-12 border border-blue-900/30 bg-blue-900/10 rounded-md" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12 bg-zinc-700 rotate-45" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm relative z-10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors mb-1">{project.name}</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                            <span className="font-mono">{project.tables} tables</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                            <Clock size={10} />
                                            <span>{project.editedAt}</span>
                                        </div>
                                    </div>
                                    <button className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreVertical size={14} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>
            </main>

        </div>
    );
}
