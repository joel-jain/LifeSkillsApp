import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { useAuth } from '../store/AuthContext';
import { logOut } from '../services/authService';
import {
  requestLocationPermissions,
  getGeofenceRegion,
} from '../services/locationService';
import * as Location from 'expo-location';
import { GEOFENCE_TASK_NAME } from '../services/geofenceTask';
import { SafeAreaView } from 'react-native-safe-area-context';

const startGeofencing = async () => {
  try {
    const region = await getGeofenceRegion();
    if (!region) {
      console.log('Geofence region not found. Skipping start.');
      return;
    }

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, [region]);
    console.log('Geofencing task started successfully.');
  } catch (err: any) {
    console.error('Failed to start geofencing:', err.message);
    Alert.alert('Error', 'Failed to start automatic attendance.');
  }
};

const HomeScreen = () => {
  const { userProfile } = useAuth();

  useEffect(() => {
    // Only run this logic if the user is a student
    if (userProfile?.role === 'student') {
      const checkPermissionsAndStart = async () => {
        try {
          const { status } = await Location.getBackgroundPermissionsAsync();
          if (status !== 'granted') {
            const granted = await requestLocationPermissions();
            if (granted) {
              await startGeofencing();
            }
          } else {
            await startGeofencing();
          }
        } catch (err: any) {
          console.error('Error in checkPermissionsAndStart:', err.message);
        }
      };

      checkPermissionsAndStart();
    }
  }, [userProfile]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              if (userProfile?.role === 'student') {
                await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
                console.log('Geofencing stopped.');
              }
              await logOut();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to log out.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <Button title="Logout" onPress={handleLogout} color="#dc3545" />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {userProfile?.firstName}!</Text>
        <Text style={styles.subtitle}>
          You are logged in as: {userProfile?.role}
        </Text> {/* <-- THIS IS THE FIX */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;