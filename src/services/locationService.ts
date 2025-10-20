import { Alert } from 'react-native';
import * as Location from 'expo-location';
// Import the correct type 'LocationRegion' as a named import
import { LocationRegion } from 'expo-location';
import { getGeofenceZone } from './firestoreService';
import { GeofenceZone } from '../types';

/**
 * Requests all necessary location permissions for geofencing.
 * @returns {Promise<boolean>} True if all permissions were granted, false otherwise.
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    // 1. Ask for foreground permissions
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need location permission to use the app.'
      );
      return false;
    }

    // 2. If foreground is granted, ask for background permissions
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need background location permission for automatic attendance. Please enable it in your phone settings.'
      );
      return false;
    }

    // 3. All permissions granted
    return true;
  } catch (err: any) {
    console.error('Error requesting location permissions:', err.message);
    Alert.alert('Error', 'An error occurred while requesting permissions.');
    return false;
  }
};

/**
 * Fetches the geofence settings from Firestore and formats them.
 * @returns {Promise<LocationRegion | null>} The formatted region object or null.
 */
// Use the correct imported type
export const getGeofenceRegion = async (): Promise<LocationRegion | null> => {
  try {
    const zone: GeofenceZone | null = await getGeofenceZone();

    if (!zone) {
      console.warn('Geofence has not been set by management yet.');
      return null;
    }

    // This type will now be correct
    const region: LocationRegion = {
      identifier: zone.id,
      latitude: zone.center.latitude,
      longitude: zone.center.longitude,
      radius: zone.radius,
      notifyOnEnter: true,
      notifyOnExit: true,
    };

    return region;
  } catch (error) {
    console.error('Error fetching geofence region:', error);
    return null;
  }
};