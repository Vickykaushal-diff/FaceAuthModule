import { open } from 'react-native-quick-sqlite';
import { DB_CONFIG } from '../utils/Constants';

let db: any = null;

export const initDB = async (): Promise<void> => {
  try {
    db = open({ name: DB_CONFIG.DB_NAME });

    // Embeddings table — store face vectors
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.EMBEDDINGS_TABLE} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL UNIQUE,
        embedding TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Attendance logs table
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.LOGS_TABLE} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL,
        timestamp TEXT DEFAULT (datetime('now')),
        status TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) throw new Error('DB not initialized. Call initDB() first.');
  return db;
};