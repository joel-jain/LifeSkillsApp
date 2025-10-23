import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// We will create these navigation types in the next step
// For now, we'll use 'any' to avoid an error
// import { StackScreenProps } from '@react-navigation/stack';
// import { FacultyStackParamList } from '../navigation/FacultyStackNavigator';
import { createSafetyIncident } from '../services/firestoreService';
import { useAuth } from '../store/AuthContext';
import { SafetyIncident } from '../types';
import { auth } from '../services/firebaseConfig';

// TODO: Replace 'any' with props: StackScreenProps<FacultyStackParamList, 'ReportIncident'>;
const ReportIncidentScreen = ({ route, navigation }: any) => {
  // Get student info passed from the previous screen
  const { studentId, studentName } = route.params;
  const { userProfile } = useAuth(); // Get the logged-in faculty member

  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SafetyIncident['severity'] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // ADD THESE LOGS:
    console.log("Submitting incident...");
    console.log("User Profile:", userProfile);
    console.log("Auth User UID:", auth.currentUser?.uid);

    if (!description || !severity) {
      Alert.alert('Missing Fields', 'Please add a description and severity.');
      return;
    }

    if (!userProfile || !auth.currentUser) { // Check both
      Alert.alert('Error', 'Not logged in or profile missing.');
      setLoading(false); // Stop loading if check fails early
      return;
    }

    setLoading(true);
    try {
      await createSafetyIncident(
        studentId,
        studentName,
        userProfile.uid,
        description,
        severity
      );
      Alert.alert('Success', 'Incident reported successfully.');
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit report. ' + error.message);
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Report Incident</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Student</Text>
        <TextInput
          style={styles.input}
          value={studentName}
          editable={false}
        />

        <Text style={styles.label}>Description of Incident *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe what happened..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <Text style={styles.label}>Severity *</Text>
        <View style={styles.severityContainer}>
          {(['low', 'medium', 'high'] as SafetyIncident['severity'][]).map(
            (level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.severityButton,
                  severity === level && styles.severityButtonSelected,
                  level === 'high' && styles.severityHigh, // Special style for 'high'
                ]}
                onPress={() => setSeverity(level)}
              >
                <Text
                  style={[
                    styles.severityText,
                    severity === level && styles.severityTextSelected,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f4f7f8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#666',
  },
  multilineInput: {
    height: 140,
    textAlignVertical: 'top',
    color: '#333',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  severityButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  severityHigh: {
    borderColor: '#dc3545',
  },
  severityButtonSelectedHigh: {
    backgroundColor: '#dc3545',
  },
  severityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  severityTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportIncidentScreen;