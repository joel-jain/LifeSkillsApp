import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type User } from 'firebase/auth';
import { onAuthUserChanged } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';
import { type UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 1. Import AsyncStorage
import { registerForPushNotificationsAsync, saveTokenToUserProfile } from '../services/notificationService';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null; // Firebase Auth user
  userProfile: UserProfile | null; // Our Firestore user profile
  role: UserProfile['role'] | null; // The user's role
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define keys for local storage
const STUDENT_UID_KEY = 'student_uid';
const STUDENT_NAME_KEY = 'student_name';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthUserChanged(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        // User logged IN. Fetch their profile.
        const profile = await getUserProfile(authUser.uid);
        setUserProfile(profile);

        // Get and save push token for all users
        try {
          const token = await registerForPushNotificationsAsync();
          if (token && profile) {
            if (profile.pushToken !== token) {
              await saveTokenToUserProfile(profile.uid, token);
            }
          }
        } catch (e) {
          console.error('Push Token registration failed:', e);
        }

        // 2. Save student info to local storage
        if (profile && profile.role === 'student') {
          await AsyncStorage.setItem(STUDENT_UID_KEY, profile.uid);
          await AsyncStorage.setItem(
            STUDENT_NAME_KEY,
            `${profile.firstName} ${profile.lastName}`
          );
          console.log('Student info saved to local storage.');
        } else {
          // If user is not a student, clear any old data
          await AsyncStorage.removeItem(STUDENT_UID_KEY);
          await AsyncStorage.removeItem(STUDENT_NAME_KEY);
        }
      } else {
        // 3. User logged OUT. Clear their profile and local storage.
        setUserProfile(null);
        await AsyncStorage.removeItem(STUDENT_UID_KEY);
        await AsyncStorage.removeItem(STUDENT_NAME_KEY);
        console.log('User logged out, local storage cleared.');
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  const value = {
    user,
    userProfile,
    role: userProfile?.role || null,
    initializing,
  };

  if (initializing) {
    return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};