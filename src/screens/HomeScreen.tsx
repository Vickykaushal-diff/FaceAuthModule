import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>FaceAuth</Text>
      <Text style={styles.subtitle}>NHAI Field Personnel Authentication</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterFace')}>
        <Text style={styles.buttonText}>Register Face</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.authButton]}
        onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.buttonText}>Authenticate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logsButton]}
        onPress={() => navigation.navigate('Logs')}>
        <Text style={styles.buttonText}>View Logs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#16213e',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  authButton: { backgroundColor: '#0f3460' },
  logsButton: { backgroundColor: '#533483' },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;