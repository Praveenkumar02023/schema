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
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  tables: [
    {
      id: 'users',
      name: 'users',
      position: { x: 100, y: 100 },
      columns: [
        { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false },
        { id: 'c2', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isNullable: false },
      ],
    },
    {
      id: 'posts',
      name: 'posts',
      position: { x: 500, y: 150 },
      columns: [
        { id: 'c3', name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false },
        { id: 'c4', name: 'title', type: 'VARCHAR', isPrimaryKey: false, isNullable: false },
        { id: 'c5', name: 'user_id', type: 'INT', isPrimaryKey: false, isNullable: true },
        // Foreign key relation logic is separate, but we model it via relations
      ],
    },
  ],
  relations: [
     // Example relation
     { 
       id: 'r1', 
       sourceTableId: 'users', 
       sourceColumnId: 'c1', 
       targetTableId: 'posts', 
       targetColumnId: 'c5', 
       type: '1-N' 
     }
  ],
  selectedTableId: null,

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
     })),
}));
