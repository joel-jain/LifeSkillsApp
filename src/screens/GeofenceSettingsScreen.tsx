import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
// 1. Import MapView components
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { StackScreenProps } from '@react-navigation/stack';
import { ManageStackParamList } from '../navigation/ManageStackNavigator';
import { getGeofenceZone, setGeofenceZone } from '../services/firestoreService';

type Props = StackScreenProps<ManageStackParamList, 'GeofenceSettings'>;

// Default location (approx. Chathannoor, Kollam)
const DEFAULT_REGION = {
  latitude: 8.8681,
  longitude: 76.7176,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const GeofenceSettingsScreen = ({ navigation }: Props) => {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [radius, setRadius] = useState(100); // Default 100 meters
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 2. Load existing settings when screen opens
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const settings = await getGeofenceZone();
        if (settings) {
          setMarker(settings.center);
          setRadius(settings.radius);
          // Center map on the saved location
          setRegion({
            ...DEFAULT_REGION,
            latitude: settings.center.latitude,
            longitude: settings.center.longitude,
          });
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load existing settings.');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!marker) {
      Alert.alert('Error', 'Please tap on the map to set a location.');
      return;
    }

    setSaving(true);
    try {
      await setGeofenceZone(marker, radius);
      Alert.alert('Success', 'Geofence settings have been saved.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Geofence Settings</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            // 3. Set marker on tap
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            {marker && (
              <>
                <Marker coordinate={marker} />
                <Circle
                  center={marker}
                  radius={radius}
                  fillColor="rgba(0, 122, 255, 0.1)"
                  strokeColor="rgba(0, 122, 255, 0.3)"
                />
              </>
            )}
          </MapView>
          <View style={styles.controlsContainer}>
            <Text style={styles.infoText}>
              Tap on the map to set the school's center location.
            </Text>
            <Text style={styles.radiusText}>Radius: {radius.toFixed(0)} meters</Text>
            {/* 4. Radius slider */}
            <Slider
              style={styles.slider}
              minimumValue={50} // 50 meters
              maximumValue={500} // 500 meters
              step={10}
              value={radius}
              onValueChange={setRadius}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Settings</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 30,
    color: '#007AFF',
    marginTop: -5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  radiusText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GeofenceSettingsScreen;