import { isNetworkAvailable, subscribeToNetwork } from './NetworkMonitor';
import { pushLogsToAWS } from '../api/AWSClient';
import { getUnsyncedLogs, markAsSynced } from '../database/AttendanceLogs';
import { purgeSyncedLogs } from '../database/AttendanceLogs';

// Sync all unsynced logs to AWS
export const syncLogs = async (): Promise<{
  success: boolean;
  synced: number;
  message: string;
}> => {
  try {
    // Check network
    const isOnline = await isNetworkAvailable();
    if (!isOnline) {
      console.log('📴 Offline — sync skipped');
      return { success: false, synced: 0, message: 'No network available' };
    }

    // Fetch unsynced logs
    const unsyncedLogs = getUnsyncedLogs();
    if (unsyncedLogs.length === 0) {
      console.log('✅ Nothing to sync');
      return { success: true, synced: 0, message: 'Nothing to sync' };
    }

    console.log(`⏳ Found ${unsyncedLogs.length} unsynced logs`);

    // Push to AWS
    const payload = unsyncedLogs.map(log => ({
      employeeId: log.employeeId,
      timestamp: log.timestamp || '',
      status: log.status,
    }));

    const result = await pushLogsToAWS(payload);

    if (result.success) {
      // Mark as synced
      const ids = unsyncedLogs.map(log => log.id!);
      markAsSynced(ids);

      console.log(`✅ ${unsyncedLogs.length} logs synced`);
      return {
        success: true,
        synced: unsyncedLogs.length,
        message: `${unsyncedLogs.length} logs synced successfully`,
      };
    }

    return { success: false, synced: 0, message: result.message };
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return { success: false, synced: 0, message: 'Sync failed' };
  }
};

// Auto sync — triggers when network comes back
export const startAutoSync = (): (() => void) => {
  console.log('🔄 Auto sync started');

  const unsubscribe = subscribeToNetwork(async (isConnected) => {
    if (isConnected) {
      console.log('📶 Network restored — auto syncing...');
      await syncLogs();
    }
  });

  return unsubscribe;
};