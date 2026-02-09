"use client";

import ResizableSidebar from "@/components/ResizableSidebar";
import SchemaCanvas from "@/components/SchemaCanvas";
import TableInspector from "@/components/TableInspector";
import EditorNavbar from "@/components/EditorNavbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSchemaStore } from "@/store/useSchemaStore";

export default function EditorPage() {
    const params = useParams();
    const projectId = params?.id as string;
    const { loadProjectSchema, setCurrentProject } = useSchemaStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`/api/projects/${projectId}`);
                    if (res.ok) {
                        const project = await res.json();

                        // Set basic info
                        setCurrentProject(project.id, project.name);

                        // Load schema
                        loadProjectSchema({
                            tables: project.tables || [],
                            relations: project.relations || [],
                        });

                    } else {
                        console.error("Failed to load project");
                    }
                } catch (err) {
                    console.error("Error loading project:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchProject();
        }
    }, [projectId, loadProjectSchema, setCurrentProject]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-zinc-950 text-white selection:bg-blue-500/30">
            <EditorNavbar projectId={projectId} />
            <div className="flex-1 flex flex-row overflow-hidden relative">
                <ResizableSidebar />
                <div className="flex-1 h-full relative">
                    <SchemaCanvas />
                    <TableInspector />
                </div>
            </div>
        </main>
    );
}
