import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const AuthScreen = () => {
  const [authStatus, setAuthStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const statusColor = {
    idle: '#aaaaaa',
    processing: '#f0a500',
    success: '#00ff88',
    failed: '#ff4444',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Authenticate</Text>

      <View style={styles.cameraBox}>
        <Text style={styles.cameraText}>Camera Preview</Text>
        <Text style={styles.cameraSubText}>(Camera + Liveness coming here)</Text>
      </View>

      <View style={styles.statusBox}>
        <Text style={[styles.statusText, { color: statusColor[authStatus] }]}>
          {authStatus === 'idle' && 'Ready to Authenticate'}
          {authStatus === 'processing' && 'Verifying...'}
          {authStatus === 'success' && '✅ Authenticated Successfully'}
          {authStatus === 'failed' && '❌ Authentication Failed'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setAuthStatus('processing')}>
        <Text style={styles.buttonText}>Start Authentication</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 20,
  },
  cameraBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#16213e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
    marginBottom: 20,
  },
  cameraText: { color: '#ffffff', fontSize: 18 },
  cameraSubText: { color: '#aaaaaa', fontSize: 12, marginTop: 8 },
  statusBox: {
    width: '100%',
    padding: 16,
    backgroundColor: '#16213e',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: { fontSize: 16, fontWeight: '600' },
  button: {
    width: '100%',
    backgroundColor: '#0f3460',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default AuthScreen;