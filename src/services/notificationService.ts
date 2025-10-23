import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import Constants from 'expo-constants'; // 1. Import Constants

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  // ... (keep the Android channel logic)
  if (Platform.OS === 'android') {
    // ...
  }

  // ... (keep the permission request logic)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  // ...
  if (existingStatus !== 'granted') {
    // ...
    return null;
  }

  try {
    // 2. Get the projectId from app.json
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found in app.json. Please add it under extra.eas.projectId");
    }

    // 3. Pass the projectId to the function
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Push Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

export const saveTokenToUserProfile = async (uid: string, token: string) => {
  // ... (this function is correct, no changes needed)
};