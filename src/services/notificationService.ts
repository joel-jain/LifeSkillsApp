import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

// Set default notification handling (show alert even if app is open)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Asks for push notification permissions and gets the token.
 * @returns {Promise<string | null>} The Expo push token or null.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission Denied', 'Failed to get push token for notification!');
    return null;
  }

  try {
    // This is the user's unique push notification token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Saves a user's push token to their 'users' profile in Firestore.
 * @param uid - The user's UID.
 * @param token - The push token.
 */
export const saveTokenToUserProfile = async (uid: string, token: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    // We use updateDoc to add or update the 'pushToken' field
    await updateDoc(userDocRef, {
      pushToken: token,
    });
  } catch (error) {
    console.error('Error saving token to Firestore:', error);
  }
};