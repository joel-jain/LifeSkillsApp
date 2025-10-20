import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { ManageStackParamList } from '../navigation/ManageStackNavigator';
// 1. Import our new functions
import { createAuthUser } from '../services/authService';
import {
  createUserProfile,
  addStudentDetails,
} from '../services/firestoreService';

type Props = StackScreenProps<ManageStackParamList, 'AddStudent'>;

const AddStudentScreen = ({ navigation }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentEmail, setParentEmail] = useState(''); // TODO: Link this
  const [caseHistory, setCaseHistory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveStudent = async () => {
    if (!firstName || !lastName || !email || !password || !caseHistory) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the new auth user
      const userCred = await createAuthUser(
        email.trim().toLowerCase(),
        password
      );
      const uid = userCred.user.uid;

      // 2. Create their UserProfile document
      await createUserProfile(
        uid,
        email.trim().toLowerCase(),
        firstName.trim(),
        lastName.trim(),
        'student' // Set their role
      );

      // 3. Create their StudentDetails document
      // TODO: We need logic to find parent's UID from parentEmail
      const parentId = ''; // For now, leave parentId blank
      await addStudentDetails(uid, caseHistory, parentId);

      // 4. Success!
      Alert.alert('Success', 'New student has been created.');
      navigation.goBack(); // Go back to the list
    } catch (error: any) {
      console.error(error);
      // Handle specific errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Error',
          'This email is already in use by another account.'
        );
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password is too weak. Must be 6+ characters.');
      } else {
        Alert.alert('Error', 'Failed to create student. ' + error.message);
      }
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
        <Text style={styles.title}>Add New Student</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Student's First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Student's Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Student's Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="student@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Initial Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Min. 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Parent's Email (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="parent@email.com (for linking)"
          value={parentEmail}
          onChangeText={setParentEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Case History / Management Details *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter initial case notes..."
          value={caseHistory}
          onChangeText={setCaseHistory}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveStudent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Student</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (styles remain exactly the same)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffff',
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
    marginTop: -5, // Adjust for optical alignment
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
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top', // For Android
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

export default AddStudentScreen;