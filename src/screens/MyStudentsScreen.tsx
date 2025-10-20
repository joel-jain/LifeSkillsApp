import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
// 1. Import markAttendance
import {
  markAttendance,
  getStudentsByFaculty, // 1. Add this import
} from '../services/firestoreService';
import { UserProfile } from '../types';
import { useAuth } from '../store/AuthContext';

// 2. Update the StudentItem component
const StudentItem = ({
  item,
  onMark,
  isMarking,
}: {
  item: UserProfile;
  onMark: (status: 'present' | 'absent') => void;
  isMarking: boolean;
}) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.itemSubtitle}>{item.email}</Text>
    </View>
    <View style={styles.buttonContainer}>
      {isMarking ? (
        <ActivityIndicator />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.button, styles.presentButton]}
            onPress={() => onMark('present')}
          >
            <Text style={styles.buttonText}>Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.absentButton]}
            onPress={() => onMark('absent')}
          >
            <Text style={styles.buttonText}>Absent</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);

const MyStudentsScreen = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 3. Add state to track which student is being marked
  const [markingStudentId, setMarkingStudentId] = useState<string | null>(null);
  const { userProfile } = useAuth();

  const fetchStudents = async () => {
    if (!userProfile || userProfile.role !== 'teacher') {
      setError('You must be a teacher to view this screen.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const studentList = await getStudentsByFaculty(userProfile.uid);
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
    fetchStudents();
  }, [userProfile]);

  // 4. Create the function to handle marking attendance
  const handleMarkAttendance = async (
    student: UserProfile,
    status: 'present' | 'absent'
  ) => {
    if (!userProfile) return; // Should never happen if they see the screen

    setMarkingStudentId(student.uid); // Show spinner on this item
    try {
      await markAttendance(
        student.uid,
        `${student.firstName} ${student.lastName}`,
        status,
        userProfile.uid
      );
      Alert.alert(
        'Success',
        `${student.firstName} marked as ${status}.`
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to mark attendance. ' + err.message);
    } finally {
      setMarkingStudentId(null); // Hide spinner
    }
  };

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
          <Text style={styles.emptyText}>No students are assigned to you.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={students}
        renderItem={({ item }) => (
          // 5. Pass props to the StudentItem
          <StudentItem
            item={item}
            isMarking={markingStudentId === item.uid}
            onMark={(status) => handleMarkAttendance(item, status)}
          />
        )}
        keyExtractor={(item) => item.uid}
        onRefresh={fetchStudents}
        refreshing={loading}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Students</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

// 6. Add new styles for the buttons
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
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
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  presentButton: {
    backgroundColor: '#28a745', // Green
  },
  absentButton: {
    backgroundColor: '#dc3545', // Red
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyStudentsScreen;