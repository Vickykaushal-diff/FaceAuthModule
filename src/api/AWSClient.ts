import { SYNC_CONFIG } from '../utils/Constants';

type SyncPayload = {
  employeeId: string;
  timestamp: string;
  status: string;
};

// Push logs to AWS API Gateway
export const pushLogsToAWS = async (
  logs: SyncPayload[]
): Promise<{ success: boolean; message: string }> => {
  let attempts = 0;

  while (attempts < SYNC_CONFIG.RETRY_ATTEMPTS) {
    try {
      console.log(`⏳ Syncing ${logs.length} logs to AWS... (attempt ${attempts + 1})`);

      const response = await fetch(
        `${SYNC_CONFIG.AWS_API_URL}${SYNC_CONFIG.SYNC_ENDPOINT}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs }),
        }
      );

      if (response.ok) {
        console.log('✅ Logs synced to AWS successfully');
        return { success: true, message: 'Logs synced successfully' };
      }

      console.warn(`⚠️ AWS returned ${response.status}`);
      attempts++;
    } catch (error) {
      console.error(`❌ Sync attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }

  return { success: false, message: 'Sync failed after max retries' };
};