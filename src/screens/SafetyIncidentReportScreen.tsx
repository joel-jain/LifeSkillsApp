import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ManageStackParamList } from '../navigation/ManageStackNavigator'; // We'll add this type soon
import { getAllSafetyIncidents } from '../services/firestoreService';
import { SafetyIncident } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = StackScreenProps<ManageStackParamList, 'SafetyIncidentReport'>; // We'll define this type

import { Timestamp } from 'firebase/firestore'; // Make sure this import is present

// Helper function to format timestamp (handles both number and Timestamp)
const formatTimestamp = (timestamp: number | Timestamp): string => {
  if (!timestamp) return 'N/A';
  
  let date: Date;
  if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    date = timestamp.toDate();
  }
  
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// Component to render each incident card
const IncidentItem = ({ item }: { item: SafetyIncident }) => {
  // Determine card border color based on severity
  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'high':
        return '#dc3545'; // Red
      case 'medium':
        return '#ffc107'; // Yellow
      case 'low':
      default:
        return '#6c757d'; // Gray
    }
  };

  const severityColor = getSeverityColor(item.severity);

  return (
    <View style={[styles.card, { borderLeftColor: severityColor }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={[styles.severityText, { color: severityColor }]}>
          {item.severity.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.timestamp}>
        Reported: {formatTimestamp(item.reportedAt)}
      </Text>
      {/* We could add 'Reported By' later if needed */}
    </View>
  );
};

const SafetyIncidentReportScreen = ({ navigation }: Props) => {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const incidentList = await getAllSafetyIncidents();
      setIncidents(incidentList);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch incident reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch when screen comes into focus
    const unsubscribe = navigation.addListener('focus', fetchIncidents);
    return unsubscribe;
  }, [navigation]);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={styles.loader} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (incidents.length === 0) {
      return <Text style={styles.emptyText}>No safety incidents reported yet.</Text>;
    }
    return (
      <FlatList
        data={incidents}
        renderItem={({ item }) => <IncidentItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onRefresh={fetchIncidents} // Pull-to-refresh
        refreshing={loading}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Safety Incident Report</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f8', // Light background for contrast
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
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
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingVertical: 10,
  },
  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 5, // Severity indicator
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default SafetyIncidentReportScreen;