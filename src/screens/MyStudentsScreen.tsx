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
// 1. Import navigation types
import { StackScreenProps } from '@react-navigation/stack';
import { FacultyStackParamList } from '../navigation/FacultyStackNavigator';
import {
  markAttendance,
  getStudentsByFaculty,
} from '../services/firestoreService';
import { UserProfile } from '../types';
import { useAuth } from '../store/AuthContext';

// 2. Define component props
type Props = StackScreenProps<FacultyStackParamList, 'MyStudents'>;

// 3. Update StudentItem props
const StudentItem = ({
  item,
  onMark,
  onReport, // Add onReport prop
  isMarking,
}: {
  item: UserProfile;
  onMark: (status: 'present' | 'absent') => void;
  onReport: () => void; // Add onReport prop
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
    {/* 4. Add Report Button */}
    <TouchableOpacity
      style={styles.reportButton}
      onPress={onReport}
      disabled={isMarking}
    >
      <Text style={styles.reportButtonText}>Report</Text>
    </TouchableOpacity>
  </View>
);

// 5. Add navigation prop to the component
const MyStudentsScreen = ({ navigation }: Props) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingStudentId, setMarkingStudentId] = useState<string | null>(null);
  const { userProfile } = useAuth();

  const fetchStudents = async () => {
    // ... (fetchStudents logic remains the same)
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
    // 6. Re-fetch when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudents();
    });
    return unsubscribe;
  }, [userProfile, navigation]); // Add navigation dependency

  const handleMarkAttendance = async (
    student: UserProfile,
    status: 'present' | 'absent'
  ) => {
    // ... (handleMarkAttendance logic remains the same)
    if (!userProfile) return;
    setMarkingStudentId(student.uid);
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
      setMarkingStudentId(null);
    }
  };

  const renderContent = () => {
    // ... (renderContent logic remains the same)
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
          <StudentItem
            item={item}
            isMarking={markingStudentId === item.uid}
            onMark={(status) => handleMarkAttendance(item, status)}
            // 7. Pass the navigation handler
            onReport={() =>
              navigation.navigate('ReportIncident', {
                studentId: item.uid,
                studentName: `${item.firstName} ${item.lastName}`,
              })
            }
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

// 8. Add/update styles
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
    flexWrap: 'wrap', // Allow wrapping for the report button
  },
  itemContent: {
    flexBasis: '100%', // Take full width on its own line
    marginBottom: 12,
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
    flexGrow: 1, // Grow to take available space
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8, // Use marginRight for spacing
  },
  presentButton: {
    backgroundColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reportButton: {
    backgroundColor: '#ffc107', // Yellow for caution
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  reportButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default MyStudentsScreen;