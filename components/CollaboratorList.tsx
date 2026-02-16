
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
        <div className="mt-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <UserPlus size={16} />
                Collaborators
            </h3>

            {loading ? (
                <div className="text-xs text-zinc-500">Loading collaborators...</div>
            ) : collaborators.length === 0 ? (
                <div className="text-xs text-zinc-500 italic">No collaborators yet. Share a link to invite people.</div>
            ) : (
                <div className="space-y-3">
                    {collaborators.map(collaborator => (
                        <div key={collaborator.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded border border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                {collaborator.user.image ? (
                                    <img src={collaborator.user.image} alt="User" className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <User size={14} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-zinc-200">{collaborator.user.name || 'Unknown User'}</p>
                                    <p className="text-xs text-zinc-500">{collaborator.user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={collaborator.role}
                                    onChange={(e) => updateRole(collaborator.id, e.target.value as "VIEWER" | "EDITOR")}
                                    className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                </select>

                                <button
                                    onClick={() => removeCollaborator(collaborator.id)}
                                    className="text-zinc-500 hover:text-red-500 transition-colors"
                                    title="Remove Collaborator"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
