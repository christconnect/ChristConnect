import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAppStore } from '../store/useAppStore';

// Import Bottom Tabs and Screens
import BottomTabs from './BottomTabs';
import ChatScreen from '../screens/Messages/ChatScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator: React.FC = () => {
  const { hasCompletedOnboarding, isAuthenticated } = useAppStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="ChatRoom" component={ChatScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
