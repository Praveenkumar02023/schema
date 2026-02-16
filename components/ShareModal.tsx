
"use client";

import { useState } from "react";
import { Copy, Plus, Trash2, X, RefreshCw, Eye, Edit2, UserPlus, Link as LinkIcon, Users } from "lucide-react";
import { useSchemaStore } from "@/store/useSchemaStore";
import CollaboratorList from "./CollaboratorList";
import { clsx } from "clsx";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    currentUserRole: "OWNER" | "EDITOR" | "VIEWER";
}

export default function ShareModal({ isOpen, onClose, projectId, currentUserRole }: ShareModalProps) {
    const [viewToken, setViewToken] = useState<string | null>(null);
    const [editToken, setEditToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'invite' | 'members'>('invite');

    if (!isOpen) return null;

    const generateLink = async (type: 'view' | 'edit') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });
            if (res.ok) {
                const data = await res.json();
                if (type === 'view') setViewToken(data.viewToken);
                else setEditToken(data.editToken);
            }
        } catch (error) {
            console.error("Failed to generate link", error);
        } finally {
            setLoading(false);
        }
    };

    const revokeLink = async (type: 'view' | 'edit') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/invite?type=${type}`, {
                method: "DELETE",
            });
            if (res.ok) {
                if (type === 'view') setViewToken(null);
                else setEditToken(null);
            }
        } catch (error) {
            console.error("Failed to revoke link", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (token: string, type: 'view' | 'edit') => {
        const origin = window.location.origin;
        const url = `${origin}/share/${token}`;
        navigator.clipboard.writeText(url);
        alert(`Copied ${type} link to clipboard!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-semibold text-white">Share Project</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-zinc-800">
                    <button
                        onClick={() => setActiveTab('invite')}
                        className={clsx(
                            "pb-3 text-sm font-medium transition-colors relative mr-6",
                            activeTab === 'invite' ? "text-blue-500" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <LinkIcon size={14} /> Invite
                        </div>
                        {activeTab === 'invite' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                        )}
                    </button>

                    {currentUserRole === 'OWNER' && (
                        <button
                            onClick={() => setActiveTab('members')}
                            className={clsx(
                                "pb-3 text-sm font-medium transition-colors relative",
                                activeTab === 'members' ? "text-blue-500" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Users size={14} /> Members
                            </div>
                            {activeTab === 'members' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                            )}
                        </button>
                    )}
                </div>

                <div className="p-6 overflow-y-auto">
                    {activeTab === 'invite' ? (
                        <div className="space-y-6">
                            {/* View Link Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <Eye size={16} />
                                        <span className="text-sm font-medium">View Only Link</span>
                                    </div>
                                    {viewToken && currentUserRole === 'OWNER' && (
                                        <button
                                            onClick={() => revokeLink('view')}
                                            className="text-xs text-red-500 hover:text-red-400"
                                            disabled={loading}
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </div>

                                {viewToken ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            readOnly
                                            value={`${window.location.origin}/share/${viewToken}`}
                                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(viewToken, 'view')}
                                            className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => generateLink('view')}
                                        disabled={loading || currentUserRole !== 'OWNER'}
                                        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Generate View Link
                                    </button>
                                )}
                            </div>

                            {/* Edit Link Section */}
                            {currentUserRole === 'OWNER' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <Edit2 size={16} />
                                            <span className="text-sm font-medium">Edit Link</span>
                                        </div>
                                        {editToken && (
                                            <button
                                                onClick={() => revokeLink('edit')}
                                                className="text-xs text-red-500 hover:text-red-400"
                                                disabled={loading}
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>

                                    {editToken ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                readOnly
                                                value={`${window.location.origin}/share/${editToken}`}
                                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(editToken, 'edit')}
                                                className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => generateLink('edit')}
                                            disabled={loading}
                                            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Generate Edit Link
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-zinc-800">
                                <p className="text-xs text-zinc-500 text-center">
                                    Anyone with the link can access the project.
                                    View links allow read-only access.
                                    Edit links allow full modification rights.
                                </p>
                            </div>
                        </div>
                    ) : (
                        currentUserRole === 'OWNER' && (
                            <CollaboratorList projectId={projectId} currentUserRole={currentUserRole} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
