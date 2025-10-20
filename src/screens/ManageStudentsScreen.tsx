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
import { getStudentsByFaculty } from '../services/firestoreService';
import { UserProfile } from '../types';
import { useAuth } from '../store/AuthContext'; // 1. Import useAuth

// A simple component to render each student
const StudentItem = ({ item }: { item: UserProfile }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.itemSubtitle}>{item.email}</Text>
    </View>
    {/* We'll add navigation to ViewStudentAttendanceScreen later */}
    <Button title="View" onPress={() => { /* TODO */ }} />
  </View>
);

const MyStudentsScreen = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth(); // 2. Get the logged-in user's profile

  const fetchStudents = async () => {
    // 3. Make sure we have a profile and the user is a teacher
    if (!userProfile || userProfile.role !== 'teacher') {
      setError('You must be a teacher to view this screen.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 4. Call the service with the teacher's UID
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
  }, [userProfile]); // 5. Re-run if the profile changes

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
        renderItem={({ item }) => <StudentItem item={item} />}
        keyExtractor={(item) => item.uid}
        onRefresh={fetchStudents} // Add pull-to-refresh
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
    alignItems: 'center', // Center title
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
});

export default MyStudentsScreen;