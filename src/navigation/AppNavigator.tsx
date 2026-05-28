import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RegisterFaceScreen from '../screens/RegisterFaceScreen';
import AuthScreen from '../screens/AuthScreen';
import LogsScreen from '../screens/LogsScreen';

// Types
export type RootStackParamList = {
  Home: undefined;
  RegisterFace: undefined;
  Auth: undefined;
  Logs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'FaceAuth — NHAI' }}
        />
        <Stack.Screen
          name="RegisterFace"
          component={RegisterFaceScreen}
          options={{ title: 'Register Face' }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Authenticate' }}
        />
        <Stack.Screen
          name="Logs"
          component={LogsScreen}
          options={{ title: 'Attendance Logs' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;