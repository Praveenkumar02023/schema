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
  setCurrentProject: (id: string, name: string) => void;
  updateProjectName: (name: string) => void;
  loadProjectSchema: (schema: { tables: Table[], relations: Relation[] }) => void;

  // History
  history: { tables: Table[]; relations: Relation[] }[];
  future: { tables: Table[]; relations: Relation[] }[];
  undo: () => void;
  redo: () => void;
  pushToHistory: () => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({

  tables: [],
  relations: [],
  history: [],
  future: [],
  selectedTableId: null,
  currentProjectId: null,
  currentProjectName: "Untitled Project",

  setCurrentProject: (id: string, name: string) => set({ currentProjectId: id, currentProjectName: name }),
  updateProjectName: (name: string) => set({ currentProjectName: name }),

  loadProjectSchema: (schema: { tables: Table[], relations: Relation[] }) => set({ tables: schema.tables, relations: schema.relations }),

  addTable: (table) => set((state) => ({ tables: [...state.tables, table] })),

  updateTablePosition: (id, position) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === id ? { ...t, position } : t
      ),
    })),

  updateTableName: (id, name) =>
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, name } : t)),
    })),

  deleteTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
      relations: state.relations.filter(
        (r) => r.sourceTableId !== id && r.targetTableId !== id
      ),
      selectedTableId: state.selectedTableId === id ? null : state.selectedTableId,
    })),

  addColumn: (tableId, column) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: [...t.columns, column] }
          : t
      ),
    })),

  updateColumn: (tableId, columnId, updates) =>
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
    })),

  deleteColumn: (tableId, columnId) =>
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
    })),

  addRelation: (relation) => set((state) => ({ relations: [...state.relations, relation] })),

  updateRelation: (relationId, type) =>
    set((state) => ({
      relations: state.relations.map((r) =>
        r.id === relationId ? { ...r, type } : r
      ),
    })),

  deleteRelation: (relationId) =>
    set((state) => ({
      relations: state.relations.filter((r) => r.id !== relationId),
    })),

  setSelectedTableId: (id) => set({ selectedTableId: id }),

  setSchema: (schema: Partial<SchemaStore>) => set((state) => ({
    tables: schema.tables || [],
    relations: schema.relations || [],
    history: [], // Reset history on new schema load
    future: [],
  })),

  // --- History ---
  pushToHistory: () => set((state) => {
    // Limit history stack size if needed (e.g. 50)
    const newHistory = [
      ...state.history,
      { tables: state.tables, relations: state.relations }
    ].slice(-50);
    return { history: newHistory, future: [] };
  }),

  undo: () => set((state) => {
    if (state.history.length === 0) return {};

    const previous = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    return {
      tables: previous.tables,
      relations: previous.relations,
      history: newHistory,
      future: [{ tables: state.tables, relations: state.relations }, ...state.future],
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return {};

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    return {
      tables: next.tables,
      relations: next.relations,
      history: [...state.history, { tables: state.tables, relations: state.relations }],
      future: newFuture,
    };
  }),

}));
