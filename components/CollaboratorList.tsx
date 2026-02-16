
"use client";

import { useState, useEffect } from "react";
import { Trash2, User, UserPlus } from "lucide-react";

interface Collaborator {
    id: string;
    role: "VIEWER" | "EDITOR";
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

interface CollaboratorListProps {
    projectId: string;
    currentUserRole: "OWNER" | "EDITOR" | "VIEWER";
}

export default function CollaboratorList({ projectId, currentUserRole }: CollaboratorListProps) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUserRole !== 'OWNER') return;

        const fetchCollaborators = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}/collaborators`);
                if (res.ok) {
                    const data = await res.json();
                    setCollaborators(data);
                }
            } catch (error) {
                console.error("Failed to fetch collaborators", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborators();
    }, [projectId, currentUserRole]);

    const updateRole = async (collaboratorId: string, newRole: "VIEWER" | "EDITOR") => {
        try {
            const res = await fetch(`/api/projects/${projectId}/collaborators`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collaboratorId, role: newRole }),
            });

            if (res.ok) {
                setCollaborators(prev => prev.map(c =>
                    c.id === collaboratorId ? { ...c, role: newRole } : c
                ));
            }
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const removeCollaborator = async (collaboratorId: string) => {
        if (!confirm("Are you sure you want to remove this collaborator?")) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/collaborators?collaboratorId=${collaboratorId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
            }
        } catch (error) {
            console.error("Failed to remove collaborator", error);
        }
    };

    if (currentUserRole !== 'OWNER') return null;

    return (
        <div className="mt-2">

            {loading ? (
                // Skeleton Loader
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="w-24 h-3 bg-zinc-800 rounded animate-pulse" />
                                    <div className="w-32 h-2.5 bg-zinc-800/50 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : collaborators.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                    <UserPlus size={48} className="opacity-20 mb-3" />
                    <p className="text-sm">No collaborators yet</p>
                    <p className="text-xs text-zinc-600">Invite people via link first</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {collaborators.map(collaborator => (
                        <div key={collaborator.id} className="group flex items-center justify-between bg-[#09090b] p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg">
                            <div className="flex items-center gap-3">
                                {collaborator.user.image ? (
                                    <img src={collaborator.user.image} alt="User" className="w-9 h-9 rounded-full border border-zinc-700" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-zinc-300 font-bold text-xs ring-1 ring-zinc-500/30">
                                        {collaborator.user.name?.[0]?.toUpperCase() || <User size={14} />}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">
                                        {collaborator.user.name || 'Unknown User'}
                                        {collaborator.user.email === 'you' && <span className="ml-2 text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">You</span>}
                                    </p>
                                    <p className="text-xs text-zinc-500">{collaborator.user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <select
                                        value={collaborator.role}
                                        onChange={(e) => updateRole(collaborator.id, e.target.value as "VIEWER" | "EDITOR")}
                                        className="appearance-none bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer hover:bg-zinc-800"
                                    >
                                        <option value="VIEWER">Viewer</option>
                                        <option value="EDITOR">Editor</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeCollaborator(collaborator.id)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Collaborator"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
