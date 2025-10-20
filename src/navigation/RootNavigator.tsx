import React from 'react';
import { useAuth } from '../store/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export const RootNavigator = () => {
  const { user } = useAuth();

  // If we have a user, show the main app.
  // Otherwise, show the login/signup screens.
  return user ? <AppNavigator /> : <AuthNavigator />;
};