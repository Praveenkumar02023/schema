import { Table, Relation, SchemaState } from './types';

export function exportToJSON(state: SchemaState): string {
  return JSON.stringify(state, null, 2);
}

export function generateSQL(state: SchemaState): string {
  let sql = '';

  // 1. Create Tables
  state.tables.forEach((table) => {
    sql += `CREATE TABLE ${table.name} (\n`;
    
    // Columns
    const primaryKeys: string[] = [];
    const columnDefs = table.columns.map((col) => {
      if (col.isPrimaryKey) primaryKeys.push(col.name);
      
      let def = `  ${col.name} ${col.type}`;
      if (!col.isNullable) def += ' NOT NULL';
      return def;
    });

    if (primaryKeys.length > 0) {
      columnDefs.push(`  PRIMARY KEY (${primaryKeys.join(', ')})`);
    }

    // Foreign Keys arising from relations where this table is the TARGET
    // (assuming 1-N means Source(1) -> Target(N))
    const incomingRelations = state.relations.filter(
      (r) => r.targetTableId === table.id && r.sourceTableId !== table.id
    );

    incomingRelations.forEach((rel) => {
      const sourceTable = state.tables.find((t) => t.id === rel.sourceTableId);
      const sourceColumn = sourceTable?.columns.find((c) => c.id === rel.sourceColumnId);
      const targetColumn = table.columns.find((c) => c.id === rel.targetColumnId);

      if (sourceTable && sourceColumn && targetColumn) {
        columnDefs.push(
          `  FOREIGN KEY (${targetColumn.name}) REFERENCES ${sourceTable.name}(${sourceColumn.name})`
        );
      }
    });

    sql += columnDefs.join(',\n');
    sql += '\n);\n\n';
  });

  return sql;
}
