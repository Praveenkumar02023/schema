
"use client";

import { useState } from "react";
import { Copy, Plus, Trash2, X, RefreshCw, Eye, Edit2, UserPlus, Link as LinkIcon, Users, Loader2 } from "lucide-react";
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
        // alert(`Copied ${type} link to clipboard!`); // Removed alert for better UX, maybe add a toast later?
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl bg-[#09090b] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-800/50 bg-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Share Project</h2>
                        <p className="text-xs text-zinc-400 mt-1">Manage access and collaboration</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-zinc-800 bg-zinc-900/30">
                    <button
                        onClick={() => setActiveTab('invite')}
                        className={clsx(
                            "pb-3 pt-4 text-sm font-medium transition-all relative mr-6 flex items-center gap-2",
                            activeTab === 'invite' ? "text-blue-500" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <LinkIcon size={16} /> Invite via Link
                        {activeTab === 'invite' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                        )}
                    </button>

                    {currentUserRole === 'OWNER' && (
                        <button
                            onClick={() => setActiveTab('members')}
                            className={clsx(
                                "pb-3 pt-4 text-sm font-medium transition-all relative flex items-center gap-2",
                                activeTab === 'members' ? "text-blue-500" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <Users size={16} /> Manage Members
                            {activeTab === 'members' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                            )}
                        </button>
                    )}
                </div>

                <div className="p-6 overflow-y-auto bg-[#09090b]">
                    {activeTab === 'invite' ? (
                        <div className="space-y-6">

                            {/* View Link Card */}
                            <div className="group rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700/80 hover:bg-zinc-900/40">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                            <Eye size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-100">Public View Link</h3>
                                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-[260px]">
                                                Anyone with the link can <span className="text-zinc-300 font-medium">view</span> the project structure.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Toggle */}
                                    {currentUserRole === 'OWNER' && (
                                        <button
                                            onClick={() => viewToken ? revokeLink('view') : generateLink('view')}
                                            disabled={loading}
                                            className={clsx(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
                                                viewToken ? "bg-blue-600" : "bg-zinc-700",
                                                loading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <span className="sr-only">Enable View Link</span>
                                            <span
                                                className={clsx(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center",
                                                    viewToken ? "translate-x-6" : "translate-x-1"
                                                )}
                                            >
                                                {loading && <Loader2 size={10} className="animate-spin text-zinc-900" />}
                                            </span>
                                        </button>
                                    )}
                                </div>

                                {/* Link Display */}
                                {viewToken && (
                                    <div className="mt-4 pl-[52px] animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 border border-zinc-800 rounded-lg group-hover:border-zinc-700/50 transition-colors">
                                            <div className="flex-1 px-3 py-1.5 text-xs text-zinc-400 font-mono truncate select-all">
                                                {`${window.location.origin}/share/${viewToken}`}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(viewToken, 'view')}
                                                className="p-2 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-400 rounded-md transition-all active:scale-95 shadow-sm"
                                                title="Copy Link"
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Edit Link Card */}
                            {currentUserRole === 'OWNER' && (
                                <div className="group rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700/80 hover:bg-zinc-900/40">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                                <Edit2 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-100">Contributor Invite Link</h3>
                                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-[260px]">
                                                    Anyone with the link can <span className="text-zinc-300 font-medium">edit</span> the project.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Toggle */}
                                        <button
                                            onClick={() => editToken ? revokeLink('edit') : generateLink('edit')}
                                            disabled={loading}
                                            className={clsx(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
                                                editToken ? "bg-purple-600" : "bg-zinc-700",
                                                loading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <span className="sr-only">Enable Edit Link</span>
                                            <span
                                                className={clsx(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center",
                                                    editToken ? "translate-x-6" : "translate-x-1"
                                                )}
                                            >
                                                {loading && <Loader2 size={10} className="animate-spin text-zinc-900" />}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Link Display */}
                                    {editToken && (
                                        <div className="mt-4 pl-[52px] animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 border border-zinc-800 rounded-lg group-hover:border-zinc-700/50 transition-colors">
                                                <div className="flex-1 px-3 py-1.5 text-xs text-zinc-400 font-mono truncate select-all">
                                                    {`${window.location.origin}/share/${editToken}`}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(editToken, 'edit')}
                                                    className="p-2 bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-400 rounded-md transition-all active:scale-95 shadow-sm"
                                                    title="Copy Link"
                                                >
                                                    <Copy size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                <p className="text-[10px] text-zinc-600 text-center font-medium">
                                    Links do not expire unless manually revoked.
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
