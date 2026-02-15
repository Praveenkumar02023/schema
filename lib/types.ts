export type ColumnType = 'INT' | 'BIGINT' | 'VARCHAR' | 'BOOLEAN' | 'DATE' | 'JSON' | 'TEXT' | 'UUID' | 'TIMESTAMP' | 'SERIAL' | 'BIGSERIAL' | 'NUMERIC' | 'DECIMAL' | 'FLOAT' | 'REAL' | 'MONEY' | 'CHAR' | 'TEXT' | 'BLOB' | 'BYTEA' | 'JSONB' | 'XML' | 'INTERVAL' | 'MACADDR' | 'INET' | 'CIDR' | 'MACADDR8' | 'POINT' | 'LINE' | 'LSEG' | 'BOX' | 'PATH' | 'POLYGON' | 'CIRCLE';

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

export interface Project {
  id: string;
  name: string;
  databaseType: string; // e.g., 'PostgreSQL', 'MySQL', 'SQLite'
  createdAt: string;
  lastEdited: string;
  color: string; // For the list view decoration
  tables: Table[];
  relations: Relation[];
}
