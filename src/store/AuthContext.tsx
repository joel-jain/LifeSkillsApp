import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type User } from 'firebase/auth';
import { onAuthUserChanged } from '../services/authService';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  initializing: boolean; // To know if we are still checking for a user
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthUserChanged((user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [initializing]);

  const value = {
    user,
    initializing,
  };

  // Don't render the app until we've finished checking the auth state
  if (initializing) {
    return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to easily access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};