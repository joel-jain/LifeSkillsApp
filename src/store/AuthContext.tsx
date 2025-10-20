import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type User } from 'firebase/auth';
import { onAuthUserChanged } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';
import { type UserProfile } from '../types'; // Import our UserProfile type

// Define the new shape of our auth context
interface AuthContextType {
  user: User | null; // Firebase Auth user
  userProfile: UserProfile | null; // Our Firestore user profile
  role: UserProfile['role'] | null; // The user's role
  initializing: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthUserChanged(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        // User logged IN. Fetch their profile.
        const profile = await getUserProfile(authUser.uid);
        setUserProfile(profile);
      } else {
        // User logged OUT. Clear their profile.
        setUserProfile(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [initializing]);

  const value = {
    user,
    userProfile,
    role: userProfile?.role || null, // Provide the role for convenience
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