import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen'; // 1. Import SignUpScreen

// Define the types for the screens in this stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  // ForgotPassword: undefined; // We can add this later
};

// Create the stack navigator
const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    // 2. Hide the header for all screens in this navigator
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen} // 3. Add the SignUp screen
      />
      {/* We will add ForgotPasswordScreen here */}
    </Stack.Navigator>
  );
};