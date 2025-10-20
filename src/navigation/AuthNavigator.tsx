import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
// We will create and import SignUpScreen and ForgotPasswordScreen later

// Define the types for the screens in this stack
export type AuthStackParamList = {
  Login: undefined; // 'Login' screen takes no parameters
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Create the stack navigator
const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      {/* We will add SignUpScreen and ForgotPasswordScreen here
      when we build them.
      */}
    </Stack.Navigator>
  );
};