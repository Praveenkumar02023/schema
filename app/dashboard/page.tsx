'use client';

import Link from 'next/link';
import {
    Plus,
    Search,
    MoreVertical,
    Clock,
    ChevronRight,
    Settings,
    LogOut,
    User,
    ChevronDown // Added ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useProjectStore } from '@/store/useProjectStore';
import { useSchemaStore } from '@/store/useSchemaStore';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/types';

const COLOR_VARIANTS = {
    blue: {
        gradient: "from-blue-500/0 via-blue-500/5",
        iconTv: "text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20",
        text: "group-hover:text-blue-400"
    },
    emerald: {
        gradient: "from-emerald-500/0 via-emerald-500/5",
        iconTv: "text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20",
        text: "group-hover:text-emerald-400"
    },
    purple: {
        gradient: "from-purple-500/0 via-purple-500/5",
        iconTv: "text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20",
        text: "group-hover:text-purple-400"
    }
};


type ProjectColor = keyof typeof COLOR_VARIANTS;

export default function DashboardPage() {
    const { projects, addProject } = useProjectStore();
    const { setCurrentProject, loadProjectSchema } = useSchemaStore();
    const { data: session } = useSession();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Create Project Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectColor, setNewProjectColor] = useState<ProjectColor>('blue');

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateProject = () => {
        if (!newProjectName.trim()) return;

        const newProject: Project = {
            id: crypto.randomUUID(),
            name: newProjectName,
            databaseType: 'PostgreSQL', // Default for now
            createdAt: new Date().toISOString(),
            lastEdited: 'Just now',
            color: newProjectColor,
            tables: [],
            relations: [],
        };

        addProject(newProject);

        // Initialize Editor
        setCurrentProject(newProject.id, newProject.name);
        loadProjectSchema({ tables: [], relations: [] });

        router.push('/editor');
    };

    const handleOpenProject = (project: Project) => {
        setCurrentProject(project.id, project.name);
        loadProjectSchema({ tables: project.tables, relations: project.relations });
        router.push('/editor');
    };

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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="z-10 text-blue-500">
                                <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 14L12 19L22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 8V16" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="13" r="1.5" fill="currentColor" />
                            </svg>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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

                        {/* Create Button */}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 whitespace-nowrap"
                        >
                            <Plus size={16} />
                            <span>New Project</span>
                        </button>
                    </div>
                </div>

                {/* --- Content List --- */}
                <div className="flex flex-col gap-3">
                    {/* List Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        <div className="col-span-6">Project Name</div>
                        <div className="col-span-4 hidden sm:block">Last Edited</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {filteredProjects.map((project, index) => {
                        const colorTheme = COLOR_VARIANTS[project.color as ProjectColor] || COLOR_VARIANTS.blue;

                        return (
                            <div
                                key={project.id}
                                onClick={() => handleOpenProject(project)}
                                className="group relative grid grid-cols-12 gap-4 items-center p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900 hover:border-zinc-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.005] cursor-pointer"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Hover Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${colorTheme.gradient} to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none`} />

                                {/* Project Info */}
                                <div className="col-span-6 flex items-center gap-4 relative z-10">
                                    {/* Icon/Thumbnail */}
                                    <div className={`w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all duration-300 ${colorTheme.iconTv}`}>
                                        <span className="text-sm font-bold">{project.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className={`text-sm font-semibold text-zinc-200 transition-colors ${colorTheme.text}`}>{project.name}</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                            <span className="bg-zinc-800/50 px-1.5 py-0.5 rounded text-zinc-400">{project.tables.length} tables</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="col-span-4 hidden sm:flex items-center gap-2 text-zinc-500 text-xs relative z-10">
                                    <Clock size={12} />
                                    <span>{new Date(project.lastEdited).toLocaleDateString()}</span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-6 sm:col-span-2 flex items-center justify-end relative z-10">
                                    <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-200">
                                        <MoreVertical size={16} />
                                    </button>
                                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300 ml-2" />
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <Search size={24} className="text-zinc-600" />
                            </div>
                            <h3 className="text-lg font-medium text-white">No projects found</h3>
                            <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                                {projects.length === 0 ? "You haven't created any projects yet." : `We couldn't find any projects matching "${searchQuery}".`}
                            </p>
                            <button
                                onClick={projects.length === 0 ? () => setIsCreateOpen(true) : () => setSearchQuery('')}
                                className="mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {projects.length === 0 ? "Create your first project" : "Clear search"}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Project Modal */}
            {isCreateOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCreateOpen(false)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Project</h2>
                            <button onClick={() => setIsCreateOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Project Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. E-commerce Schema"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Color Theme</label>
                                <div className="flex gap-3">
                                    {(['blue', 'emerald', 'purple'] as ProjectColor[]).map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setNewProjectColor(c)}
                                            className={`h-10 flex-1 rounded-xl border transition-all ${newProjectColor === c ? `bg-${c}-500/20 border-${c}-500` : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full mx-auto bg-${c}-500 ${newProjectColor === c ? 'ring-2 ring-white/20' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreateProject}
                                disabled={!newProjectName.trim()}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}
