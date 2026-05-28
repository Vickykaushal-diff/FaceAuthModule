import { getDB } from './SQLiteDB';
import { DB_CONFIG } from '../utils/Constants';

// Save face embedding for an employee
export const saveEmbedding = (
  employeeId: string,
  embedding: number[]
): boolean => {
  try {
    const db = getDB();
    const embeddingStr = JSON.stringify(embedding);

    db.execute(
      `INSERT OR REPLACE INTO ${DB_CONFIG.EMBEDDINGS_TABLE} 
       (employee_id, embedding) VALUES (?, ?)`,
      [employeeId, embeddingStr]
    );

    console.log(`✅ Embedding saved for ${employeeId}`);
    return true;
  } catch (error) {
    console.error('❌ Save embedding failed:', error);
    return false;
  }
};

// Fetch embedding for a specific employee
export const getEmbedding = (employeeId: string): number[] | null => {
  try {
    const db = getDB();
    const result = db.execute(
      `SELECT embedding FROM ${DB_CONFIG.EMBEDDINGS_TABLE} 
       WHERE employee_id = ?`,
      [employeeId]
    );

    if (result.rows?.length > 0) {
      return JSON.parse(result.rows.item(0).embedding);
    }
    return null;
  } catch (error) {
    console.error('❌ Get embedding failed:', error);
    return null;
  }
};

// Fetch ALL embeddings — for matching against unknown face
export const getAllEmbeddings = (): { employeeId: string; embedding: number[] }[] => {
  try {
    const db = getDB();
    const result = db.execute(
      `SELECT employee_id, embedding FROM ${DB_CONFIG.EMBEDDINGS_TABLE}`
    );

    const embeddings = [];
    for (let i = 0; i < result.rows?.length; i++) {
      const row = result.rows.item(i);
      embeddings.push({
        employeeId: row.employee_id,
        embedding: JSON.parse(row.embedding),
      });
    }
    return embeddings;
  } catch (error) {
    console.error('❌ Get all embeddings failed:', error);
    return [];
  }
};

// Delete embedding
export const deleteEmbedding = (employeeId: string): boolean => {
  try {
    const db = getDB();
    db.execute(
      `DELETE FROM ${DB_CONFIG.EMBEDDINGS_TABLE} WHERE employee_id = ?`,
      [employeeId]
    );
    return true;
  } catch (error) {
    console.error('❌ Delete embedding failed:', error);
    return false;
  }
};