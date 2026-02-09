import { create } from 'zustand';
import { Project, SchemaState } from '../lib/types';
import { persist } from 'zustand/middleware';

interface ProjectStore {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    // We can save the schema state back to the project when leaving the editor
    saveSchemaToProject: (projectId: string, schema: SchemaState) => void;
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set) => ({
            projects: [],
            setProjects: (projects) => set({ projects }),
            addProject: (project) =>
                set((state) => ({ projects: [project, ...state.projects] })),
            updateProject: (id, updates) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),
            deleteProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                })),
            saveSchemaToProject: (projectId, schema) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tables: schema.tables,
                                relations: schema.relations,
                                lastEdited: new Date().toISOString(), // Update last edited
                            }
                            : p
                    ),
                })),
        }),
        {
            name: 'drawdb-projects', // unique name
        }
    )
);
