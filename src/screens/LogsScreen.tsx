import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

type LogEntry = {
  id: string;
  employeeId: string;
  timestamp: string;
  status: 'success' | 'failed';
  synced: boolean;
};

// Dummy data for now — SQLite se aayega baad mein
const DUMMY_LOGS: LogEntry[] = [
  { id: '1', employeeId: 'EMP001', timestamp: '2026-05-28 09:00', status: 'success', synced: false },
  { id: '2', employeeId: 'EMP002', timestamp: '2026-05-28 09:15', status: 'failed', synced: false },
  { id: '3', employeeId: 'EMP003', timestamp: '2026-05-28 09:30', status: 'success', synced: true },
];

const LogsScreen = () => {
  const [logs] = useState<LogEntry[]>(DUMMY_LOGS);

  const renderLog = ({ item }: { item: LogEntry }) => (
    <View style={styles.logCard}>
      <View style={styles.logLeft}>
        <Text style={styles.empId}>{item.employeeId}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <View style={styles.logRight}>
        <Text style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'success' ? '#00ff8822' : '#ff444422' },
          { color: item.status === 'success' ? '#00ff88' : '#ff4444' }
        ]}>
          {item.status === 'success' ? '✅ Auth' : '❌ Failed'}
        </Text>
        <Text style={[styles.syncBadge, { color: item.synced ? '#00ff88' : '#f0a500' }]}>
          {item.synced ? '☁️ Synced' : '📴 Pending'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Attendance Logs</Text>
      <Text style={styles.subtitle}>{logs.length} records — {logs.filter(l => !l.synced).length} pending sync</Text>

      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={renderLog}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.syncButton}>
        <Text style={styles.buttonText}>🔄 Sync to AWS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 10,
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 13,
    marginBottom: 20,
  },
  list: { paddingBottom: 20 },
  logCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  logLeft: { flex: 1 },
  logRight: { alignItems: 'flex-end' },
  empId: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  timestamp: { color: '#aaaaaa', fontSize: 12, marginTop: 4 },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 6,
  },
  syncBadge: { fontSize: 11 },
  syncButton: {
    backgroundColor: '#533483',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default LogsScreen;