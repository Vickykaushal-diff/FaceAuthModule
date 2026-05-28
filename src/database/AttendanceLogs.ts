import { getDB } from './SQLiteDB';
import { DB_CONFIG } from '../utils/Constants';

export type LogEntry = {
  id?: number;
  employeeId: string;
  timestamp?: string;
  status: 'success' | 'failed';
  synced?: boolean;
};

// Save attendance log
export const saveLog = (employeeId: string, status: 'success' | 'failed'): boolean => {
  try {
    const db = getDB();
    db.execute(
      `INSERT INTO ${DB_CONFIG.LOGS_TABLE} 
       (employee_id, status, synced) VALUES (?, ?, 0)`,
      [employeeId, status]
    );
    console.log(`✅ Log saved: ${employeeId} — ${status}`);
    return true;
  } catch (error) {
    console.error('❌ Save log failed:', error);
    return false;
  }
};

// Fetch all logs
export const getAllLogs = (): LogEntry[] => {
  try {
    const db = getDB();
    const result = db.execute(
      `SELECT * FROM ${DB_CONFIG.LOGS_TABLE} ORDER BY timestamp DESC`
    );

    const logs: LogEntry[] = [];
    for (let i = 0; i < result.rows?.length; i++) {
      const row = result.rows.item(i);
      logs.push({
        id: row.id,
        employeeId: row.employee_id,
        timestamp: row.timestamp,
        status: row.status,
        synced: row.synced === 1,
      });
    }
    return logs;
  } catch (error) {
    console.error('❌ Get logs failed:', error);
    return [];
  }
};

// Fetch unsynced logs — for AWS sync
export const getUnsyncedLogs = (): LogEntry[] => {
  try {
    const db = getDB();
    const result = db.execute(
      `SELECT * FROM ${DB_CONFIG.LOGS_TABLE} WHERE synced = 0`
    );

    const logs: LogEntry[] = [];
    for (let i = 0; i < result.rows?.length; i++) {
      const row = result.rows.item(i);
      logs.push({
        id: row.id,
        employeeId: row.employee_id,
        timestamp: row.timestamp,
        status: row.status,
        synced: false,
      });
    }
    return logs;
  } catch (error) {
    console.error('❌ Get unsynced logs failed:', error);
    return [];
  }
};

// Mark logs as synced
export const markAsSynced = (ids: number[]): boolean => {
  try {
    const db = getDB();
    const placeholders = ids.map(() => '?').join(',');
    db.execute(
      `UPDATE ${DB_CONFIG.LOGS_TABLE} SET synced = 1 WHERE id IN (${placeholders})`,
      ids
    );
    return true;
  } catch (error) {
    console.error('❌ Mark synced failed:', error);
    return false;
  }
};

// Purge synced logs — after AWS sync
export const purgeSyncedLogs = (): boolean => {
  try {
    const db = getDB();
    db.execute(`DELETE FROM ${DB_CONFIG.LOGS_TABLE} WHERE synced = 1`);
    console.log('✅ Synced logs purged');
    return true;
  } catch (error) {
    console.error('❌ Purge failed:', error);
    return false;
  }
};