import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ManageStackParamList } from '../navigation/ManageStackNavigator';
import {
  getUserProfile,
  getStudentDetails,
  updateStudentDetails,
} from '../services/firestoreService';
import { UserProfile, StudentDetails } from '../types';

type Props = StackScreenProps<ManageStackParamList, 'EditStudent'>;

const EditStudentScreen = ({ navigation, route }: Props) => {
  // 1. Get the studentId from the navigation params
  const { studentId } = route.params;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [details, setDetails] = useState<StudentDetails | null>(null);
  const [caseHistory, setCaseHistory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 2. Load all student data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile(studentId);
        const studentDetails = await getStudentDetails(studentId);

        if (!userProfile || !studentDetails) {
          Alert.alert('Error', 'Could not find student data.');
          navigation.goBack();
          return;
        }

        setProfile(userProfile);
        setDetails(studentDetails);
        setCaseHistory(studentDetails.caseHistory);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId, navigation]);

  // 3. Handle saving the changes
  const handleSaveChanges = async () => {
    if (caseHistory.trim() === '') {
      Alert.alert('Error', 'Case history cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateStudentDetails(studentId, caseHistory);
      Alert.alert('Success', 'Student details updated.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Student</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          value={`${profile?.firstName} ${profile?.lastName}`}
          editable={false} // This field is not editable
        />

        <Text style={styles.label}>Student Email</Text>
        <TextInput
          style={styles.input}
          value={profile?.email}
          editable={false}
        />

        <Text style={styles.label}>Case History / Management Details</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter case notes..."
          value={caseHistory}
          onChangeText={setCaseHistory}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    color: '#666', // Muted color for non-editable fields
  },
  multilineInput: {
    height: 160,
    textAlignVertical: 'top',
    color: '#333', // Editable fields should have standard color
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

export default EditStudentScreen;