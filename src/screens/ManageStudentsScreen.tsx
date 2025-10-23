import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { ManageStackParamList } from '../navigation/ManageStackNavigator';
import { getStudentsByRole } from '../services/firestoreService';
import { UserProfile } from '../types';

type Props = StackScreenProps<ManageStackParamList, 'ManageStudents'>;

const StudentItem = ({
  item,
  onEdit,
}: {
  item: UserProfile;
  onEdit: () => void;
}) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.itemSubtitle}>{item.email}</Text>
    </View>
    <Button title="Edit" onPress={onEdit} />
  </View>
);

const ManageStudentsScreen = ({ navigation }: Props) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentList = await getStudentsByRole();
      setStudents(studentList);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudents();
    });
    return unsubscribe;
  }, [navigation]);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={styles.loader} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (students.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No students found.</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to add the first student.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={students}
        renderItem={({ item }) => (
          <StudentItem
            item={item}
            onEdit={() =>
              navigation.navigate('EditStudent', { studentId: item.uid })
            }
          />
        )}
        keyExtractor={(item) => item.uid}
        onRefresh={fetchStudents}
        refreshing={loading}
      />
    );
  };

  // ... (keep everything before the return statement)

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('GeofenceSettings')}
        >
          <Text style={styles.headerButtonText}>⚙️</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Manage</Text>

        {/* Incident Report Button */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('SafetyIncidentReport')} // <-- Navigate here
        >
          <Text style={styles.headerButtonText}>⚠️</Text> 
        </TouchableOpacity>

        {/* Add Student Button */}
        <TouchableOpacity
          style={[styles.headerButton, styles.addButton]} // Keep original style too
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Text style={styles.headerButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

// --- Update Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f8',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust spacing
    alignItems: 'center',
    paddingHorizontal: 12, // Slightly reduce padding
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    // Removed margin to let space-between work better
  },
  headerButton: {
    width: 36, // Smaller buttons
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 4, // Add spacing between buttons
  },
  addButton: { // Keep specific add button styles if needed
     // Example: backgroundColor: '#28a745',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 20, // Adjust icon size
    fontWeight: 'bold',
    lineHeight: 24, // Adjust vertical centering
  },
   // ... (keep the rest of the styles)
   itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1, // Allows text to shrink
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    flexShrink: 1,
  },
});

export default ManageStudentsScreen;