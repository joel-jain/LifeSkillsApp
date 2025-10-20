import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';
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
    // Re-fetch students when the screen is focused (e.g., after adding one)
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudents();
    });
    return unsubscribe;
  }, [navigation]);

  const renderContent = () => {
    // This 'if' block is where the error was. It is fixed here.
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Students</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
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
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#666',
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