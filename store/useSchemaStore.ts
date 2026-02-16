import { create } from 'zustand';
import { Table, Relation, Column, RelationType } from '../lib/types';

interface SchemaStore {
  tables: Table[];
  relations: Relation[];
  selectedTableId: string | null;
  addTable: (table: Table) => void;
  updateTablePosition: (id: string, position: { x: number; y: number }) => void;
  updateTableName: (id: string, name: string) => void;
  deleteTable: (id: string) => void;
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  addRelation: (relation: Relation) => void;
  updateRelation: (relationId: string, type: RelationType) => void;
  deleteRelation: (relationId: string) => void;
  setSelectedTableId: (id: string | null) => void;
  setSchema: (schema: Partial<SchemaStore>) => void;

  // Project Association
  currentProjectId: string | null;
  currentProjectName: string;
  currentUserRole: 'OWNER' | 'EDITOR' | 'VIEWER' | null;
  setCurrentProject: (id: string, name: string) => void;
  setProjectRole: (role: 'OWNER' | 'EDITOR' | 'VIEWER') => void;
  updateProjectName: (name: string) => void;
  loadProjectSchema: (schema: { tables: Table[], relations: Relation[] }) => void;

  // History
  history: { tables: Table[]; relations: Relation[] }[];
  future: { tables: Table[]; relations: Relation[] }[];
  undo: () => void;
  redo: () => void;
  pushToHistory: () => void;
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({

  tables: [],
  relations: [],
  history: [],
  future: [],
  selectedTableId: null,
  currentProjectId: null,
  currentProjectName: "Untitled Project",
  currentUserRole: null,

  setCurrentProject: (id: string, name: string) => set({ currentProjectId: id, currentProjectName: name }),
  setProjectRole: (role) => set({ currentUserRole: role }),
  updateProjectName: (name: string) => {
    if (get().currentUserRole === 'VIEWER') return;
    set({ currentProjectName: name });
  },

  loadProjectSchema: (schema: { tables: Table[], relations: Relation[] }) => set({ tables: schema.tables, relations: schema.relations }),

  addTable: (table) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({ tables: [...state.tables, table] }));
  },

  updateTablePosition: (id, position) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === id ? { ...t, position } : t
      ),
    }));
  },

  updateTableName: (id, name) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, name } : t)),
    }));
  },

  deleteTable: (id) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
      relations: state.relations.filter(
        (r) => r.sourceTableId !== id && r.targetTableId !== id
      ),
      selectedTableId: state.selectedTableId === id ? null : state.selectedTableId,
    }));
  },

  addColumn: (tableId, column) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: [...t.columns, column] }
          : t
      ),
    }));
  },

  updateColumn: (tableId, columnId, updates) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? {
            ...t,
            columns: t.columns.map((c) =>
              c.id === columnId ? { ...c, ...updates } : c
            ),
          }
          : t
      ),
    }));
  },

  deleteColumn: (tableId, columnId) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) }
          : t
      ),
      // Also remove relations involving this column
      relations: state.relations.filter(
        (r) => r.sourceColumnId !== columnId && r.targetColumnId !== columnId
      ),
    }));
  },

  addRelation: (relation) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({ relations: [...state.relations, relation] }));
  },

  updateRelation: (relationId, type) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      relations: state.relations.map((r) =>
        r.id === relationId ? { ...r, type } : r
      ),
    }));
  },

  deleteRelation: (relationId) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      relations: state.relations.filter((r) => r.id !== relationId),
    }));
  },

  setSelectedTableId: (id) => set({ selectedTableId: id }),

  setSchema: (schema: Partial<SchemaStore>) => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => ({
      tables: schema.tables || [],
      relations: schema.relations || [],
      history: [], // Reset history on new schema load
      future: [],
    }));
  },

  // --- History ---
  pushToHistory: () => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => {
      // Limit history stack size if needed (e.g. 50)
      const newHistory = [
        ...state.history,
        { tables: state.tables, relations: state.relations }
      ].slice(-50);
      return { history: newHistory, future: [] };
    });
  },

  undo: () => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => {
      if (state.history.length === 0) return {};

      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      return {
        tables: previous.tables,
        relations: previous.relations,
        history: newHistory,
        future: [{ tables: state.tables, relations: state.relations }, ...state.future],
      };
    });
  },

  redo: () => {
    if (get().currentUserRole === 'VIEWER') return;
    set((state) => {
      if (state.future.length === 0) return {};

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        tables: next.tables,
        relations: next.relations,
        history: [...state.history, { tables: state.tables, relations: state.relations }],
        future: newFuture,
      };
    });
  },

}));
