import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { getAllLogs, LogEntry } from '../database/AttendanceLogs';
import { syncAndPurge } from '../sync/PurgeManager';
import { isNetworkAvailable } from '../sync/NetworkMonitor';
import StatusBanner from '../components/UI/StatusBanner';

const LogsScreen = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showStatus, setShowStatus] = useState(false);

  const showMessage = (msg: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setStatus(msg);
    setStatusType(type);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const fetchLogs = useCallback(() => {
    const data = getAllLogs();
    setLogs(data);
  }, []);

  const checkNetwork = useCallback(async () => {
    const online = await isNetworkAvailable();
    setIsOnline(online);
  }, []);

  useEffect(() => {
    fetchLogs();
    checkNetwork();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchLogs();
    await checkNetwork();
    setRefreshing(false);
  };

  const handleSyncAndPurge = async () => {
    if (!isOnline) {
      showMessage('📴 No network — cannot sync', 'warning');
      return;
    }

    try {
      setIsSyncing(true);
      showMessage('⏳ Syncing to AWS...', 'info');

      const result = await syncAndPurge();

      if (result.success) {
        showMessage(`✅ ${result.message}`, 'success');
        fetchLogs(); // Refresh logs after purge
      } else {
        showMessage(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      showMessage('❌ Sync failed', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = logs.filter(l => !l.synced).length;
  const syncedCount = logs.filter(l => l.synced).length;

  const renderLog = ({ item }: { item: LogEntry }) => (
    <View style={styles.logCard}>
      <View style={styles.logLeft}>
        <Text style={styles.empId}>{item.employeeId}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <View style={styles.logRight}>
        <Text style={[
          styles.statusBadge,
          {
            backgroundColor: item.status === 'success' ? '#00ff8822' : '#ff444422',
            color: item.status === 'success' ? '#00ff88' : '#ff4444',
          }
        ]}>
          {item.status === 'success' ? '✅ Auth' : '❌ Failed'}
        </Text>
        <Text style={[
          styles.syncBadge,
          { color: item.synced ? '#00ff88' : '#f0a500' }
        ]}>
          {item.synced ? '☁️ Synced' : '📴 Pending'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Logs</Text>
        <View style={styles.networkBadge}>
          <View style={[
            styles.networkDot,
            { backgroundColor: isOnline ? '#00ff88' : '#ff4444' }
          ]} />
          <Text style={styles.networkText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{logs.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#f0a500' }]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#00ff88' }]}>
            {syncedCount}
          </Text>
          <Text style={styles.statLabel}>Synced</Text>
        </View>
      </View>

      <StatusBanner
        message={status}
        type={statusType}
        visible={showStatus}
      />

      {/* Logs List */}
      {logs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No logs yet</Text>
          <Text style={styles.emptySubText}>
            Authentication records will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          renderItem={renderLog}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
            />
          }
        />
      )}

      {/* Sync Button */}
      <TouchableOpacity
        style={[
          styles.syncButton,
          (!isOnline || isSyncing) && styles.syncButtonDisabled,
        ]}
        onPress={handleSyncAndPurge}
        disabled={!isOnline || isSyncing}>
        {isSyncing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.syncButtonText}>
            {isOnline ? '☁️ Sync & Purge to AWS' : '📴 Offline — Cannot Sync'}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  networkDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  networkText: { color: '#ffffff', fontSize: 12 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  statLabel: { color: '#aaaaaa', fontSize: 12, marginTop: 4 },
  list: { paddingBottom: 16 },
  logCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  logLeft: { flex: 1 },
  logRight: { alignItems: 'flex-end' },
  empId: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  timestamp: { color: '#aaaaaa', fontSize: 11, marginTop: 4 },
  statusBadge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  syncBadge: { fontSize: 11 },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  emptySubText: { color: '#aaaaaa', fontSize: 13, marginTop: 8 },
  syncButton: {
    backgroundColor: '#533483',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonDisabled: { backgroundColor: '#333333' },
  syncButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default LogsScreen;