import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const RegisterFaceScreen = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register Face</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Employee ID"
        placeholderTextColor="#aaaaaa"
        value={employeeId}
        onChangeText={setEmployeeId}
      />

      <View style={styles.cameraBox}>
        <Text style={styles.cameraText}>Camera Preview</Text>
        <Text style={styles.cameraSubText}>(Camera component coming here)</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Capture & Register</Text>
      </TouchableOpacity>

      {status ? <Text style={styles.status}>{status}</Text> : null}
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
  input: {
    width: '100%',
    backgroundColor: '#16213e',
    color: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    marginBottom: 20,
    fontSize: 16,
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
  button: {
    width: '100%',
    backgroundColor: '#0f3460',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  status: { color: '#00ff88', marginTop: 20, fontSize: 14 },
});

export default RegisterFaceScreen;