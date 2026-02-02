export type ColumnType = 'INT' | 'VARCHAR' | 'BOOLEAN' | 'DATE' | 'JSON' | 'TEXT' | 'UUID' | 'TIMESTAMP';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  isPrimaryKey: boolean;
  isNullable: boolean;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
}

export type RelationType = '1-1' | '1-N' | 'N-N';

export interface Relation {
  id: string;
  sourceTableId: string;
  sourceColumnId: string;
  targetTableId: string;
  targetColumnId: string;
  type: RelationType;
}

export interface SchemaState {
  tables: Table[];
  relations: Relation[];
}
