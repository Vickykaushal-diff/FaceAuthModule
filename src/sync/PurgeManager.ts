import { purgeSyncedLogs } from '../database/AttendanceLogs';
import { isNetworkAvailable } from './NetworkMonitor';
import { syncLogs } from './SyncManager';

// Sync first then purge
export const syncAndPurge = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const isOnline = await isNetworkAvailable();
    if (!isOnline) {
      return { success: false, message: 'Cannot purge — device is offline' };
    }

    // Sync first
    const syncResult = await syncLogs();
    if (!syncResult.success && syncResult.synced === 0) {
      return { success: false, message: 'Sync failed — purge aborted' };
    }

    // Then purge
    const purged = purgeSyncedLogs();
    if (purged) {
      return { success: true, message: `Synced & purged successfully` };
    }

    return { success: false, message: 'Purge failed' };
  } catch (error) {
    console.error('❌ Sync & purge failed:', error);
    return { success: false, message: 'Sync & purge failed' };
  }
};