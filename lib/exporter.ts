export const exportToJSON = ({ tables, relations }: { tables: any[], relations: any[] }) => {
  return JSON.stringify({ tables, relations }, null, 2);
};

export const generateSQL = ({ tables, relations }: { tables: any[], relations: any[] }) => {
  let sql = "";

  tables.forEach((table) => {
    sql += `CREATE TABLE ${table.name} (\n`;
    const columns = table.columns.map((col: any) => {
      let def = `  ${col.name} ${col.type}`;
      if (col.isPrimaryKey) def += " PRIMARY KEY";
      if (!col.isNullable) def += " NOT NULL";
      return def;
    });
    sql += columns.join(",\n");
    sql += "\n);\n\n";
  });

  relations.forEach((rel) => {
    // Basic foreign key generation (simplified)
    // sql += `-- Relation ${rel.type} from ${rel.sourceTableId} to ${rel.targetTableId}\n`;
    // In a real app, you'd lookup table names by ID to write ALTER TABLE statements
  });

  return sql;
};

// Placeholder for PNG export if I needed it, but using placeholder for now
export const exportToPNG = () => {
  // implementation would go here using html-to-image or similar
}
